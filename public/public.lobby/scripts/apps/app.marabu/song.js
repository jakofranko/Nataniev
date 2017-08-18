
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
    lobby.apps.marabu.editor.refresh();
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
    this.update_bpm(lobby.apps.marabu.sequencer.sequence.bpm);
    this.update_rpp(lobby.apps.marabu.editor.pattern.length);

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

    lobby.apps.marabu.instrument.install();
    lobby.apps.marabu.instrument.refresh();

    mJammer.start();
    mJammer.updateRowLen(mSong.rowLen);
  };
};

// function Song()
// {
//   this.create = function()
//   {
//     var song = {}, i, j, k, instr, col;
//     song.rowLen = calcSamplesPerRow(120);
//     song.endPattern = 2;
//     song.patternLen = 32;
//     var defaultInstr = { name: "FORM sin", i: [3,255,128,0,2,23,152,0,0,0,0,72,129,0,0,3,121,57,0,2,180,50,0,31,47,3,55,8] };

//     // All 8 instruments
//     song.songData = [];

//     for (i = 0; i < 8; i++) {
//       instr = {};
//       instr.i = [];

//       // Copy the default instrument
//       for (j = 0; j <= defaultInstr.i.length; ++j) {
//         instr.i[j] = defaultInstr.i[j];
//       }

//       // Sequence
//       instr.p = [];
//       for (j = 0; j < MAX_SONG_ROWS; j++){
//         instr.p[j] = 0;
//       }

//       // Patterns
//       instr.c = [];
//       for (j = 0; j < MAX_PATTERNS; j++)
//       {
//         col = {n:[],f:[]};
//         for (k = 0; k < song.patternLen * 4; k++){
//           col.n[k] = 0;
//         }
//         for (k = 0; k < song.patternLen * 2; k++){
//           col.f[k] = 0;
//         }
//         instr.c[j] = col;
//       }
      
//       // Save
//       song.songData[i] = instr;
//     }

//     // Default instruments
//     song.songData[4].name = "Kick";
//     song.songData[4].i = [2,0,92,0,0,255,92,23,1,0,14,0,74,0,0,0,89,0,1,1,16,0,21,255,49,6,0,0];
//     song.songData[5].name = "Snare";
//     song.songData[5].i = [0,221,92,1,0,210,92,0,1,192,4,0,46,0,0,1,97,141,1,3,93,0,4,57,20,0,0,6];
//     song.songData[6].name = "Hihat"
//     song.songData[6].i = [0,0,140,0,0,0,140,0,0,60,4,10,34,0,0,0,187,5,0,1,239,135,0,170,87,5,0,4];
//     song.songData[7].name = "Tom"
//     song.songData[7].i = [0,192,104,1,0,80,99,0,0,0,4,0,66,0,0,3,0,0,0,1,0,1,2,32,37,4,0,0];

//     // Create a pattern
//     song.songData[0].p[0] = 1;
//     return song;
//   }
// }

lobby.apps.marabu.setup.confirm("song");
