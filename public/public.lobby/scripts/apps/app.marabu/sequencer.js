
var CAudioTimer = function ()
{
  var mAudioElement = null;
  var mStartT = 0;
  var mErrHist = [0, 0, 0, 0, 0, 0];
  var mErrHistPos = 0;

  this.setAudioElement = function (audioElement)
  {
    mAudioElement = audioElement;
  }

  this.currentTime = function ()
  {
    if (!mAudioElement)
      return 0;

    // Calculate current time according to Date()
    var t = (new Date()).getTime() * 0.001;
    var currentTime = t - mStartT;

    // Get current time according to the audio element
    var audioCurrentTime = mAudioElement.currentTime;

    // Check if we are off by too much - in which case we will use the time
    // from the audio element
    var err = audioCurrentTime - currentTime;
    if (audioCurrentTime < 0.01 || err > 0.2 || err < -0.2) {
      currentTime = audioCurrentTime;
      mStartT = t - currentTime;
      for (var i = 0; i < mErrHist.length; i++)
        mErrHist[i] = 0;
    }

    // Error compensation (this should fix the problem when we're constantly
    // slightly off)
    var comp = 0;
    for (var i = 0; i < mErrHist.length; i++)
      comp += mErrHist[i];
    comp /= mErrHist.length;
    mErrHist[mErrHistPos] = err;
    mErrHistPos = (mErrHistPos + 1) % mErrHist.length;

    return currentTime + comp;
  };

  this.reset = function () {
    mStartT = (new Date()).getTime() * 0.001;
    for (var i = 0; i < mErrHist.length; i++)
      mErrHist[i] = 0;
  };
};


//------------------------------------------------------------------------------
// GUI class
//------------------------------------------------------------------------------

var CGUI = function()
{
  this.sequence_controller = lobby.apps.marabu.sequencer;
  this.pattern_controller = lobby.apps.marabu.editor;
  this.instrument_controller = lobby.apps.marabu.instrument;

  var MAX_SONG_ROWS = 16,
      MAX_PATTERNS = 16;

  var mPatternCol = 0,
      mPatternRow = 0,
      mPatternCol2 = 0,
      mPatternRow2 = 0,
      mSeqCol = 0,
      mSeqRow = 0,
      mSeqCol2 = 0,
      mSeqRow2 = 0,
      mFxTrackRow = 0,
      mFxTrackRow2 = 0;

  // Resources
  var mSong = {};
  var mAudio = null;
  var mAudioTimer = new CAudioTimer();
  var mPlayer = new CPlayer();
  var mJammer = new CJammer();

  this.mAudio = function(){ return mAudio; }
  this.mAudio_timer = function(){ return mAudioTimer; }

  this.mJammer = mJammer;

  var mPreload = [];

  //--------------------------------------------------------------------------
  // Song import/export functions
  //--------------------------------------------------------------------------

  var calcSamplesPerRow = function(bpm)
  {
    return Math.round((60 * 44100 / 4) / bpm);
  };

  this.get_bpm = function()
  {
    return Math.round((60 * 44100 / 4) / mSong.rowLen);
  };

  this.update_bpm = function(bpm)
  {
    mSong.rowLen = calcSamplesPerRow(bpm);
    mJammer.updateRowLen(mSong.rowLen);
  }

  this.update_rpp = function(rpp)
  {
    setPatternLength(rpp);
    updatePatternLength();
  }

  this.play_note = function(note)
  {
    mJammer.addNote(note+87);
  }

  this.song = function()
  {
    return mSong;
  }

  this.mJammer_update = function()
  {
    return mJammer.updateInstr(GUI.instrument().i);
  }

  this.instrument = function()
  {
    return this.song().songData[this.instrument_controller.id];
  }















  var setPatternLength = function (length)
  {
    if (mSong.patternLen === length)
      return;

    // Stop song if it's currently playing (the song will be wrong and the
    // follower will be off)
    stopAudio();

    // Truncate/extend patterns
    var i, j, k, col, notes, fx;
    for (i = 0; i < 8; i++) {
      for (j = 0; j < MAX_PATTERNS; j++) { // TODO 32 for MAX_PATTERNS
        col = mSong.songData[i].c[j];
        notes = [];
        fx = [];
        for (k = 0; k < 4 * length; k++)
          notes[k] = 0;
        for (k = 0; k < 2 * length; k++)
          fx[k] = 0;
        for (k = 0; k < Math.min(mSong.patternLen, length); k++) {
          notes[k] = col.n[k];
          notes[k + length] = col.n[k + mSong.patternLen];
          notes[k + 2 * length] = col.n[k + 2 * mSong.patternLen];
          notes[k + 3 * length] = col.n[k + 3 * mSong.patternLen];
          fx[k] = col.f[k];
          fx[k + length] = col.f[k + mSong.patternLen];
        }
        col.n = notes;
        col.f = fx;
      }
    }

    // Update pattern length
    mSong.patternLen = length;
  };

  var updatePatternLength = function()
  {
    var rpp = parseInt(document.getElementById("rpp").value);
    rpp = 32;
    if (rpp && (rpp >= 1) && (rpp <= 256)) {
      // Update the pattern length of the song data
      setPatternLength(rpp);

      // Update UI
      lobby.apps.marabu.editor.refresh();
    }
  };

  var updateSongRanges = function ()
  {
    var i, j, emptyRow;

    // Determine the last song pattern
    mSong.endPattern = MAX_SONG_ROWS + 1;
    for (i = MAX_SONG_ROWS - 1; i >= 0; --i) {
      emptyRow = true;
      for (j = 0; j < 8; ++j) {
        if (mSong.songData[j].p[i] > 0) {
          emptyRow = false;
          break;
        }
      }
      if (!emptyRow) break;
      mSong.endPattern--;
    }
  };

  var generateAudio = function (doneFun, opts)
  {
    console.log("Generating..",mSong);
    var d1 = new Date();
    mPlayer = new CPlayer();
    mPlayer.generate(mSong, opts, function (progress){
      if (progress >= 1) {
        var wave = mPlayer.createWave();
        var d2 = new Date();
        console.log("complete!",progress);
        doneFun(wave);
      }
      else{
        console.log("rendering:",progress);
      }
    });
  };

  var stopAudio = function ()
  {
    lobby.apps.marabu.sequencer.follower.stop();
    if (mAudio) {
      mAudio.pause();
      mAudioTimer.reset();
    }
  };

  this.stop_song = function()
  {
    stopAudio();
  }

  this.play_song = function()
  {
    this.update_bpm(120);
    this.update_rpp(32);

    stopAudio();
    updateSongRanges();

    mFollowerFirstRow = 0;
    mFollowerLastRow = mSong.endPattern - 2;
    mFollowerFirstCol = 0;
    mFollowerLastCol = 7;

    var doneFun = function(wave)
    {
      console.log("playing..")
      lobby.apps.marabu.sequencer.follower.start();
      mAudio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      mAudioTimer.reset();
      mAudio.play();
    };
    generateAudio(doneFun);
  }


  //--------------------------------------------------------------------------
  // Initialization
  //--------------------------------------------------------------------------

  this.init = function ()
  {
    var i, j, o;

    // Build the UI tables
    lobby.apps.marabu.sequencer.build_sequence_table();
    lobby.apps.marabu.editor.build_table();

    // Create audio element, and always play the audio as soon as it's ready
    mAudio = new Audio();
    mAudioTimer.setAudioElement(mAudio);
    mAudio.addEventListener("canplay", function () { this.play(); }, true);

    mSong = lobby.apps.marabu.new_song();

    lobby.apps.marabu.sequencer.refresh();
    lobby.apps.marabu.editor.refresh();

    document.getElementById("rpp").innerHTML = mSong.patternLen;

    lobby.apps.marabu.instrument.install();
    lobby.apps.marabu.instrument.refresh();

    mJammer.start();
    mJammer.updateRowLen(mSong.rowLen);
  };
};

//------------------------------------------------------------------------------
// Program start
//------------------------------------------------------------------------------

function Sequencer()
{
  var app = lobby.apps.marabu;
  var target = this;

  this.edit_mode = false;
  this.selection = {x1:0,y1:0,x2:0,y2:0};
  this.sequence = {length:32}

  this.title_el = document.getElementById("seq_title");
  this.bpm_el = document.getElementById("bpm");

  this.status = function()
  {
    var html = "";
    html += "SEQ("+this.selection.x1+":"+this.selection.y1+" "+this.selection.x2+":"+this.selection.y2+") ";
    return html;
  }

  this.build = function()
  {
    var html = "";

    html += "  <div class='sequencer' id='sequence_controller' style='width:120px; display:inline-block; vertical-align:top'>";
    html += "    <h1 class='lh30' style='width:90px'><b id='seq_title'>SEQ</b> <t id='bpm' class='bh fh' style='float:right; text-align:right; height:30px; color:#999; line-height:30px; background:transparent'/><hr /></h1>";
    html += "    <div id='sequencer'><table class='tracks' id='sequencer-table'></table></div>";
    html += "  </div>";

    return html;
  }

  this.pattern_id_at = function(x,y)
  {
    var instrument_id = GUI.instrument_controller.id;
    var pattern_id = GUI.song().songData[instrument_id].p[this.selection.y1];
    return pattern_id - 1;
  }

  this.select = function(x1 = 0,y1 = 0,x2 = 0,y2 = 0)
  {
    this.selection = {x1:x1,y1:y1,x2:x2,y2};

    var target_pattern_value = document.getElementById("sc"+x2+"r"+y2).textContent;
    var target_instrument_id = x2;
    var target_pattern_id = target_pattern_value == "-" ? -1 : parseInt(target_pattern_value);    

    app.editor.pattern.id = target_pattern_id;
    app.instrument.id = target_instrument_id;

    app.editor.refresh();
    app.sequencer.refresh();
    app.instrument.refresh();
  }

  this.deselect = function()
  {
    this.selection = {x1:-1,y1:-1,x2:-1,y2:-1};
    app.sequencer.refresh();
  }

  this.select_move = function(x,y)
  {
    var s = this.selection;

    s.x2 += x;
    s.y2 += y;

    if(s.x2 < 0){ s.x2 = 0; }
    if(s.y2 < 0){ s.y2 = 0; }
    if(s.x2 > 7){ s.x2 = 7; }
    if(s.y2 > 31){ s.y2 = 31; }

    s.x1 = s.x2;
    s.y1 = s.y2;

    this.select(s.x1,s.y1,s.x2,s.y2);
  }

  this.edit = function(toggle = true)
  {
    console.log("sequencer.edit",toggle);
    this.edit_mode = toggle;

    var table = document.getElementById("sequencer-table");
    table.className = toggle ? "tracks edit" : "tracks";
  }

  this.edit_note = function(i,c,n,v)
  {
    console.info("edit_node","i:"+i,"c:"+c,"n:"+n,"v:"+v,GUI.song().songData);
    GUI.song().songData[i].c[c].n[n] = v;

    console.info("edit_node","i:"+i,"c:"+c,"n:"+n,"v:"+v,GUI.song().songData);
  }

  this.edit_sequence = function(i,p,v)
  {
    GUI.song().songData[i].p[p] = parseInt(v);

    console.info("edit_sequence","i:"+i,"p:"+p,"v:"+v,GUI.song().songData);

    this.refresh_table();
    this.edit(false);
    if(v != 0){
      app.editor.pattern.id = parseInt(v);
      app.editor.edit();   
      app.editor.select(0,0,0,0);
      app.sequencer.deselect();
    }
  }

  function bpm_update(e)
  {
    // if(GUI.sequence_controller.bpm_el.value == ""){ return; }
    // var new_bpm = parseInt(GUI.sequence_controller.bpm_el.value);
    // if(new_bpm < 20){ new_bpm = 10; }
    // if(new_bpm > 800){ new_bpm = 800;}
    // GUI.update_bpm(new_bpm);
  }

  this.location = function()
  {
    return {i:app.instrument.id};
  }

  // 
  // Sequence Table
  // 

  this.sequence_mouse_down = function(e)
  {
    var col = parseInt(e.target.id.slice(2,3));
    var row = parseInt(e.target.id.slice(4));

    target.edit();
    target.select(col,row,col,row);
    lobby.commander.update_status();
  }

  this.refresh = function()
  {
    document.getElementById("bpm").innerHTML = GUI.get_bpm();

    this.refresh_table();
    this.refresh_title();
  }

  this.refresh_title = function()
  {
    var html = "SEQ ";

    if(this.edit_mode){ html += this.selection.y2; }

    document.getElementById("seq_title").innerHTML = html;
  }

  this.build_sequence_table = function()
  {
    var table = document.getElementById("sequencer-table");
    // Clean
    while (table.firstChild){
      table.removeChild(table.firstChild);
    }
    var tr, td;
    for (var row = 0; row < this.sequence.length; row++) {
      tr = document.createElement("tr");
      tr.id = "spr"+row;
      tr.className = row % 4 === 0 ? "beat" : "";
      for (var col = 0; col < 8; col++) {
        td = document.createElement("td");
        td.id = "sc" + col + "r" + row;
        td.textContent = "-";
        td.addEventListener("mousedown", this.sequence_mouse_down, false);
        tr.appendChild(td);
      }
      table.appendChild(tr);
    }
  }

  this.refresh_table = function()
  {
    for (var r = 0; r < this.sequence.length; ++r)
    {
      for (var c = 0; c < 8; ++c)
      {
        var o = document.getElementById("sc" + c + "r" + r);
        var pat = GUI.song().songData[c].p[r];
        var classes = "";
        if(pat > 0){ classes += "pattern_"+pat+" "; }
        if (r >= this.selection.y1 && r <= this.selection.y2 && c >= this.selection.x1 && c <= this.selection.x2){ classes += "selected "; }
        o.className = classes;
        if(r == this.selection.y2 && c == this.selection.x2){
          o.textContent = ">";  
        }
        else if(pat){
          o.textContent = pat;  
        }
        else{
          o.textContent = "-";  
        }
      }
    }
  }

  // Keyboard Events

  this.when = 
  {
    key : function(key)
    {
      if(target.edit_mode != true){ return; }

      if(key == "arrowleft"){ target.select_move(-1,0); return; }
      if(key == "arrowright"){ target.select_move(1,0); return; }
      if(key == "arrowup"){ target.select_move(0,-1); return; }
      if(key == "arrowdown"){ target.select_move(0,1); return; }

      if(["0","1","2","3","4","5","6","7","8","9","a","b","c","d","e","f","escape","backspace","enter"].indexOf(key) == -1){ console.log("SEQ: Unknown Key",key); return; }
      
      if(key == "escape"){ return; }
      if(key == "backspace"){ key = 0; }

      var i = target.selection.x2;
      var p = target.selection.y2;

      if(key == "enter"){ target.edit_sequence(i,p,app.editor.pattern.id); return; }

      target.edit_sequence(i,p,key); 
      
    }
  }

}

lobby.apps.marabu.setup.confirm("sequencer");
