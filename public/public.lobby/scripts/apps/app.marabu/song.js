
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

var Song = function()
{
  var MAX_SONG_ROWS = 32,
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
    lobby.apps.marabu.update();
  }

  this.play_note = function(note)
  {
    mJammer.addNote(note+87);
  }

  this.song = function()
  {
    return mSong;
  }

  this.replace_song = function(new_song)
  {
    mSong = new_song;
  }

  this.mJammer_update = function()
  {
    return mJammer.updateInstr(this.instrument().i);
  }

  this.instrument = function(id = lobby.apps.marabu.selection.instrument)
  {
    return this.song().songData[id];
  }

  //

  this.pattern_at = function(i,t)
  {
    return this.song().songData[i].p[t];
  }

  this.inject_pattern_at = function(i,t,v)
  {
    this.song().songData[i].p[t] = v;
  }

  this.note_at = function(i,t,n)
  {
    var c = this.pattern_at(i,t)-1; if(c == -1){ return; }
    return this.song().songData[i].c[c].n[n];
  }

  this.inject_note_at = function(i,t,n,v)
  {
    var c = this.pattern_at(i,t)-1; if(c == -1){ return; }
    this.song().songData[i].c[c].n[n] = v+87;
  }

  this.effect_at = function(i,t,f)
  {
    var c = this.pattern_at(i,t)-1; if(c == -1){ return; }
    return this.song().songData[i].c[c].f[f];
  }

  this.inject_effect_at = function(i,t,f,cmd,val)
  {
    var c = this.pattern_at(i,t);
    this.song().songData[i].c[c].f[f] = cmd;
    this.song().songData[i].c[c].f[f+32] = val;
  }

  this.inject_instrument = function(i,f,v)
  {
    this.song().songData[i][f] = v;
  }

  this.inject_control = function(i,c,v)
  {
    this.song().songData[i].i[c] = v;
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
      for (j = 0; j < MAX_PATTERNS; j++) {
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

  this.update_ranges = function()
  {
    updateSongRanges();
  }

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

  this.export_wav = function()
  {
    updateSongRanges();
    
    var doneFun = function(wave)
    {
      var blob = new Blob([wave], {type: "application/octet-stream"});
      saveAs(blob, "render.wav");
    };
    generateAudio(doneFun);
  };

  var generateAudio = function (doneFun, opts)
  {
    lobby.commander.notify("Starting..",false);
    var d1 = new Date();
    mPlayer = new CPlayer();
    mPlayer.generate(mSong, opts, function (progress){
      if (progress >= 1) {
        var wave = mPlayer.createWave();
        var d2 = new Date();
        lobby.commander.notify("complete!");
        doneFun(wave);
      }
      else{
        lobby.commander.notify("Rendering "+parseInt(progress * 100)+"%",false);
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

    // Create audio element, and always play the audio as soon as it's ready
    mAudio = new Audio();
    mAudioTimer.setAudioElement(mAudio);
    mAudio.addEventListener("canplay", function () { this.play(); }, true);

    mSong = lobby.apps.marabu.new_song();

    mJammer.start();
    mJammer.updateRowLen(mSong.rowLen);
  };
};

lobby.apps.marabu.setup.confirm("song");
