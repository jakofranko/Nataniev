/* -*- mode: javascript; tab-width: 2; indent-tabs-mode: nil; -*-
*
* Copyright (c) 2011-2014 Marcus Geelnard
*
* This file is part of SoundBox.
*
* SoundBox is free software: you can redistribute it and/or modify
* it under the terms of the GNU General Public License as published by
* the Free Software Foundation, either version 3 of the License, or
* (at your option) any later version.
*
* SoundBox is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
* GNU General Public License for more details.
*
* You should have received a copy of the GNU General Public License
* along with SoundBox.  If not, see <http://www.gnu.org/licenses/>.
*
*/

//------------------------------------------------------------------------------
// Helper class for getting high precision timing info from an audio element
// (e.g. Firefox Audio.currentTime has < 60 Hz precision, leading to choppy
// animations etc).
//------------------------------------------------------------------------------

var CAudioTimer = function ()
{
  var mAudioElement = null;
  var mStartT = 0;
  var mErrHist = [0, 0, 0, 0, 0, 0];
  var mErrHistPos = 0;

  this.setAudioElement = function (audioElement) {
    mAudioElement = audioElement;
  }

  this.currentTime = function () {
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

  this.mJammer = mJammer;

  var mPreload = [];

  //--------------------------------------------------------------------------
  // Song import/export functions
  //--------------------------------------------------------------------------

  var calcSamplesPerRow = function(bpm)
  {
    return Math.round((60 * 44100 / 4) / bpm);
  };

  var getBPM = function()
  {
    return Math.round((60 * 44100 / 4) / mSong.rowLen);
  };

  // Instrument property indices
  var OSC1_WAVEFORM = 0,
      OSC1_VOL = 1,
      OSC1_SEMI = 2,
      OSC1_XENV = 3,

      OSC2_WAVEFORM = 4,
      OSC2_VOL = 5,
      OSC2_SEMI = 6,
      OSC2_DETUNE = 7,
      OSC2_XENV = 8,

      NOISE_VOL = 9,

      ENV_ATTACK = 10,
      ENV_SUSTAIN = 11,
      ENV_RELEASE = 12,

      ARP_CHORD = 13,
      ARP_SPEED = 14,

      LFO_WAVEFORM = 15,
      LFO_AMT = 16,
      LFO_FREQ = 17,
      LFO_FX_FREQ = 18,

      FX_FILTER = 19,
      FX_FREQ = 20,
      FX_RESONANCE = 21,
      FX_DIST = 22,
      FX_DRIVE = 23,
      FX_PAN_AMT = 24,
      FX_PAN_FREQ = 25,
      FX_DELAY_AMT = 26,
      FX_DELAY_TIME = 27;

  //--------------------------------------------------------------------------
  // Helper functions
  //--------------------------------------------------------------------------

  var getEventElement = function (e)
  {
    var o = null;
    if (!e) var e = window.event;
    if (e.target)
      o = e.target;
    else if (e.srcElement)
      o = e.srcElement;
    if (o.nodeType == 3) // defeat Safari bug
      o = o.parentNode;
    return o;
  };

  var updateSongInfo = function()
  {
    document.getElementById("bpm").value = getBPM();
    document.getElementById("rpp").value = mSong.patternLen;
  };

  var updateSequencer = function (scrollIntoView, selectionOnly)
  {
    lobby.apps.marabu.sequencer.refresh_table();
  };

  var updatePattern = function (scrollIntoView, selectionOnly)
  {
    lobby.apps.marabu.editor.build_table();
    lobby.apps.marabu.editor.refresh_table();
  };

  this.play_note = function(note)
  {
    mJammer.addNote(note+87);
  }

  var updateCheckBox = function (o, check) {
    o.src = check ? "media/graphics/toggle_on.svg" : "media/graphics/toggle_off.svg";
  };

  var clearPresetSelection = function () {
    var o = document.getElementById("instrPreset");
    o.selectedIndex = 0;
  };

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

  this.pattern = function()
  {
    return this.instrument().c[GUI.pattern_controller.pattern_id];
  }

  this.instruments = function()
  {
    return this.song().songData;
  }

  var updateInstrument = function()
  {
    var instr = GUI.instrument();

    // Oscillator 1

    // TODO
    // if(instr.i[OSC1_WAVEFORM] == 0){ document.getElementById("osc1_wave_select"). }

    // document.getElementById("osc1_wave_sin").src = instr.i[OSC1_WAVEFORM] == 0 ? "media/graphics/wave_sin_sel.svg" : "media/graphics/wave_sin.svg";
    // document.getElementById("osc1_wave_sqr").src = instr.i[OSC1_WAVEFORM] == 1 ? "media/graphics/wave_sqr_sel.svg" : "media/graphics/wave_sqr.svg";
    // document.getElementById("osc1_wave_saw").src = instr.i[OSC1_WAVEFORM] == 2 ? "media/graphics/wave_saw_sel.svg" : "media/graphics/wave_saw.svg";
    // document.getElementById("osc1_wave_tri").src = instr.i[OSC1_WAVEFORM] == 3 ? "media/graphics/wave_tri_sel.svg" : "media/graphics/wave_tri.svg";

    // // Oscillator 2
    // document.getElementById("osc2_wave_sin").src = instr.i[OSC2_WAVEFORM] == 0 ? "media/graphics/wave_sin_sel.svg" : "media/graphics/wave_sin.svg";
    // document.getElementById("osc2_wave_sqr").src = instr.i[OSC2_WAVEFORM] == 1 ? "media/graphics/wave_sqr_sel.svg" : "media/graphics/wave_sqr.svg";
    // document.getElementById("osc2_wave_saw").src = instr.i[OSC2_WAVEFORM] == 2 ? "media/graphics/wave_saw_sel.svg" : "media/graphics/wave_saw.svg";
    // document.getElementById("osc2_wave_tri").src = instr.i[OSC2_WAVEFORM] == 3 ? "media/graphics/wave_tri_sel.svg" : "media/graphics/wave_tri.svg";

    // document.getElementById("lfo_wave_sin").src = instr.i[LFO_WAVEFORM] == 0 ? "media/graphics/wave_sin_sel.svg" : "media/graphics/wave_sin.svg";
    // document.getElementById("lfo_wave_sqr").src = instr.i[LFO_WAVEFORM] == 1 ? "media/graphics/wave_sqr_sel.svg" : "media/graphics/wave_sqr.svg";
    // document.getElementById("lfo_wave_saw").src = instr.i[LFO_WAVEFORM] == 2 ? "media/graphics/wave_saw_sel.svg" : "media/graphics/wave_saw.svg";
    // document.getElementById("lfo_wave_tri").src = instr.i[LFO_WAVEFORM] == 3 ? "media/graphics/wave_tri_sel.svg" : "media/graphics/wave_tri.svg";

    // document.getElementById("fx_filt_lp").src = instr.i[FX_FILTER] == 2 ? "media/graphics/wave_lp_sel.svg" : "media/graphics/wave_lp.svg";
    // document.getElementById("fx_filt_hp").src = instr.i[FX_FILTER] == 1 ? "media/graphics/wave_hp_sel.svg" : "media/graphics/wave_hp.svg";
    // document.getElementById("fx_filt_bp").src = instr.i[FX_FILTER] == 3 ? "media/graphics/wave_bp_sel.svg" : "media/graphics/wave_bp.svg";

    updateCheckBox(document.getElementById("osc1_xenv"), instr.i[OSC1_XENV]);
    updateCheckBox(document.getElementById("osc2_xenv"), instr.i[OSC2_XENV]);



    // PART 1

    lobby.apps.marabu.instrument.update_controls();

    // Update the jammer instrument
    mJammer.updateInstr(instr.i);
  };

  this.update_instr = function()
  {
    updateInstrument();
  }

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
      updatePattern();
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

  var loadSongFromData = function (songData)
  {
    var song = binToSong(songData);
    if (song) {
      stopAudio();
      mSong = song;
      updateSongInfo();
      updateSequencer();
      updatePattern();
      updateInstrument(true);
    }
  };

  //--------------------------------------------------------------------------
  // Event handlers
  //--------------------------------------------------------------------------

  var exportBINARY = function()
  {
    var dataURI = "data:application/octet-stream;base64," + btoa(songToBin(mSong));
    window.open(dataURI);
  }

  this.export_wav = function()
  {
    exportWAV();
  }

  this.export_js = function()
  {
    exportJS();
  }

  var exportWAV = function(e)
  {
    // Update song ranges
    updateSongRanges();

    // Generate audio data
    var doneFun = function(wave)
    {
      var blob = new Blob([wave], {type: "application/octet-stream"});
      saveAs(blob, "render.wav");
    };
    generateAudio(doneFun);
  };

  var exportJS = function(e)
  {
    // Update song ranges
    updateSongRanges();

    // Generate JS song data
    var dataURI = "data:text/javascript;base64," + btoa(songToJS(mSong));
    window.open(dataURI);
    return false;
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
    stopFollower();
    if (mAudio) {
      mAudio.pause();
      mAudioTimer.reset();
    }
  };

  this.stop_audio = function()
  {
    stopAudio();
  }


  //----------------------------------------------------------------------------
  // Playback follower
  //----------------------------------------------------------------------------

  var mFollowerTimerID = -1;
  var mFollowerFirstRow = 0;
  var mFollowerLastRow = 0;
  var mFollowerFirstCol = 0;
  var mFollowerLastCol = 0;
  var mFollowerActive = false;
  var mFollowerLastVULeft = 0;
  var mFollowerLastVURight = 0;

  var getSamplesSinceNote = function (t, chan) {
    var nFloat = t * 44100 / mSong.rowLen;
    var n = Math.floor(nFloat);
    var seqPos0 = Math.floor(n / mSong.patternLen) + mFollowerFirstRow;
    var patPos0 = n % mSong.patternLen;
    for (var k = 0; k < mSong.patternLen; ++k) {
      var seqPos = seqPos0;
      var patPos = patPos0 - k;
      while (patPos < 0) {
        --seqPos;
        if (seqPos < mFollowerFirstRow) return -1;
        patPos += mSong.patternLen;
      }
      var pat = mSong.songData[chan].p[seqPos] - 1;
      for (var patCol = 0; patCol < 4; patCol++) {
        if (pat >= 0 && mSong.songData[chan].c[pat].n[patPos+patCol*mSong.patternLen] > 0)
          return (k + (nFloat - n)) * mSong.rowLen;
      }
    }
    return -1;
  };

  var redrawPlayerGfx = function (t)
  {
    return;
    // TODO
    var o = document.getElementById("playGfxCanvas");
    var w = 100;
    var h = 100;
    var ctx = o.getContext("2d");
    if (ctx)
    {
      // Calculate singal powers
      var pl = 0, pr = 0;
      if (mFollowerActive && t >= 0)
      {
        // Get the waveform
        var wave = mPlayer.getData(t, 1000);

        // Calculate volume
        var i, l, r;
        var sl = 0, sr = 0, l_old = 0, r_old = 0;
        for (i = 1; i < wave.length; i += 2)
        {
          l = wave[i-1];
          r = wave[i];

          // Band-pass filter (low-pass + high-pass)
          sl = 0.8 * l + 0.1 * sl - 0.3 * l_old;
          sr = 0.8 * r + 0.1 * sr - 0.3 * r_old;
          l_old = l;
          r_old = r;

          // Sum of squares
          pl += sl * sl;
          pr += sr * sr;
        }

        // Low-pass filtered mean power (RMS)
        pl = Math.sqrt(pl / wave.length) * 0.2 + mFollowerLastVULeft * 0.8;
        pr = Math.sqrt(pr / wave.length) * 0.2 + mFollowerLastVURight * 0.8;
        mFollowerLastVULeft = pl;
        mFollowerLastVURight = pr;
      }

      // Convert to angles in the VU meter
      var a1 = pl > 0 ? 1.3 + 0.5 * Math.log(pl) : -1000;
      a1 = a1 < -1 ? -1 : a1 > 1 ? 1 : a1;
      a1 *= 0.57;
      var a2 = pr > 0 ? 1.3 + 0.5 * Math.log(pr) : -1000;
      a2 = a2 < -1 ? -1 : a2 > 1 ? 1 : a2;
      a2 *= 0.57;

      // Draw VU hands
      ctx.strokeStyle = "rgb(0,0,0)";
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h * 2.1);
      ctx.lineTo(w * 0.25 + h * 1.8 * Math.sin(a1), h * 2.1 - h * 1.8 * Math.cos(a1));
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(w * 0.75, h * 2.1);
      ctx.lineTo(w * 0.75 + h * 1.8 * Math.sin(a2), h * 2.1 - h * 1.8 * Math.cos(a2));
      ctx.stroke();

      // Draw leds
      ctx.fillStyle = "rgb(0,0,0)";
      ctx.fillRect(0, h, w, 20);
      for (i = 0; i < 8; ++i)
      {
        // Draw un-lit led
        var x = Math.round(26 + 23.0 * i);

        if (i >= mFollowerFirstCol && i <= mFollowerLastCol)
        {
          // Get envelope profile for this channel
          var env_a = mSong.songData[i].i[ENV_ATTACK],
              env_s = mSong.songData[i].i[ENV_SUSTAIN],
              env_r = mSong.songData[i].i[ENV_RELEASE];
          env_a = env_a * env_a * 4;
          env_r = env_s * env_s * 4 + env_r * env_r * 4;
          var env_tot = env_a + env_r;
          if (env_tot < 10000)
          {
            env_tot = 10000;
            env_r = env_tot - env_a;
          }

          // Get number of samples since last new note
          var numSamp = getSamplesSinceNote(t, i);
          if (numSamp >= 0 && numSamp < env_tot)
          {
            // Calculate current envelope (same method as the synth, except sustain)
            var alpha;
            if (numSamp < env_a)
              alpha = numSamp / env_a;
            else
              alpha = 1 - (numSamp - env_a) / env_r;

            // Draw lit led with alpha blending
            ctx.globalAlpha = alpha * alpha;
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }
  };

  var startFollower = function()
  {
    // Update the sequencer selection
    mSeqRow = mFollowerFirstRow;
    mSeqRow2 = mFollowerFirstRow;
    mSeqCol2 = 0;
    updateSequencer(true, true);
    updatePattern();

    // Start the follower
    mFollowerActive = true;
    mFollowerTimerID = setInterval(updateFollower, 16);

    var table = document.getElementById("pattern-table");
    table.className = "tracks playing";
  };

  var updateFollower = function()
  {
    // Get current time
    var t = mAudioTimer.currentTime();

    // Are we past the play range (i.e. stop the follower?)
    if (mAudio.ended || (mAudio.duration && ((mAudio.duration - t) < 0.1))) {
      stopFollower();
      mPatternRow = 0;
      mPatternRow2 = 0;
      mFxTrackRow = 0;
      mFxTrackRow2 = 0;
      updatePattern();
      return;
    }

    // Calculate current song position
    var n = Math.floor(t * 44100 / mSong.rowLen);
    var seqPos = Math.floor(n / mSong.patternLen) + mFollowerFirstRow;
    var patPos = n % mSong.patternLen;

    if(patPos === 0){
      // updatePattern();
    }

    document.getElementById("spr"+seqPos).className = "played";
    document.getElementById("ppr"+patPos).className = "played";

    // Player graphics
    redrawPlayerGfx(t);
  };

  var stopFollower = function()
  {
    if (mFollowerActive)
    {
      // Stop the follower
      if (mFollowerTimerID !== -1) {
        clearInterval(mFollowerTimerID);
        mFollowerTimerID = -1;
      }

      // Clear player gfx
      redrawPlayerGfx(-1);
      mFollowerActive = false;
    }
  };

  //----------------------------------------------------------------------------
  // (end of playback follower)
  //----------------------------------------------------------------------------

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
      startFollower();
      mAudio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      mAudioTimer.reset();
      mAudio.play();
      console.log(mAudio)
    };
    generateAudio(doneFun);
  }

  var playRange = function (e)
  {
    stopAudio();
    updateSongRanges();

    // Select range to play
    var opts = {
      firstRow: mSeqRow,
      lastRow: mSeqRow2,
      firstCol: mSeqCol,
      lastCol: mSeqCol2
    };
    mFollowerFirstRow = mSeqRow;
    mFollowerLastRow = mSeqRow2;
    mFollowerFirstCol = mSeqCol;
    mFollowerLastCol = mSeqCol2;

    var doneFun = function (wave)
    {
      startFollower();
      mAudio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));
      mAudio.play();
      mAudioTimer.reset();
    };
    generateAudio(doneFun, opts);
  };

  var stopPlaying = function(e)
  {
    stopAudio();
  };

  var fx_update = function(filt_name)
  {
    console.log(filt_name);
    var filt = 2;
    if (o.id === "fx_filt_hp") filt = 1;
    else if (o.id === "fx_filt_lp") filt = 2;
    else if (o.id === "fx_filt_bp") filt = 3;
    if (GUI.pattern_controller.is_mod_selected) {
      var pat = GUI.instrument().p[mSeqRow] - 1;
      if (pat >= 0) {
        GUI.instrument().c[pat].f[mFxTrackRow] = FX_FILTER + 1
        GUI.instrument().c[pat].f[mFxTrackRow+mSong.patternLen] = filt;
      }
    }
    GUI.instrument().i[FX_FILTER] = filt;
    updateInstrument(true);

  }

  // Pattern

  this.update_instrument = function(cmdNo,value,id)
  {
    var instr = this.instrument();

    if (cmdNo === ARP_CHORD) { 
    // The arpeggio chord notes are combined into a single byte
      if (id == "arp_note1")
        value = (instr.i[ARP_CHORD] & 15) | (value << 4);
      else
        value = (instr.i[ARP_CHORD] & 240) | value;
    }

    if (GUI.pattern_controller.is_mod_selected) {
      // Update the effect command in the FX track
      if (mSeqRow == mSeqRow2 && mSeqCol == mSeqCol2) {
        var pat = GUI.instrument().p[mSeqRow] - 1;
        if (pat >= 0) {
          GUI.instrument().c[pat].f[mFxTrackRow] = cmdNo + 1;
          GUI.instrument().c[pat].f[mFxTrackRow+mSong.patternLen] = value;
        }
      }
    }

    if (cmdNo >= 0){ instr.i[cmdNo] = value;}
    mJammer.updateInstr(instr.i);  
  }

  var onFileDrop = function (e)
  {
    e.stopPropagation();
    e.preventDefault();

    // Get the dropped file
    var files = e.dataTransfer.files;
    if (files.length != 1) {
      this.update_status("Cannot open multiple files at once.")
      return;
    }
    var file = files[0];

    if(file.name.indexOf(".instrument") > -1){
      GUI.load_instrument_file(file);
      return;
    }
    if(file.name.indexOf(".kit") > -1){
      GUI.load_kit_file(file);
      return;
    }

    // Load the file into the editor
    var reader = new FileReader();
    reader.onload = function(e){
      loadSongFromData(getURLSongData(e.target.result));  
    };
    reader.readAsDataURL(file);
  };

  this.load_kit_file = function(file)
  {
    var reader = new FileReader();
    reader.onload = function(e){
      var new_kit = JSON.parse(e.target.result);
      GUI.load_kit(new_kit);
    };
    reader.readAsText(file);
  }

  this.load_instrument_file = function(file)
  {
    var reader = new FileReader();
    reader.onload = function(e){
      var new_instr = JSON.parse(e.target.result);
      GUI.load_instrument(new_instr.name,new_instr.i);
    };
    reader.readAsText(file);
  }

  this.load_instrument = function(instr_name,instr_data)
  {
    GUI.instrument().i = instr_data;
    GUI.instrument().name = instr_name;
    updateInstrument(true);
    this.instrument_controller.instrument_name_el.value = instr_name;
  }

  this.load_kit = function(kit_data)
  {
    var id = 0
    for(name in kit_data){
      mSong.songData[id].i = kit_data[name];
      mSong.songData[id].name = name;
      id += 1;
    }

    updateInstrument(true);
  }

  //--------------------------------------------------------------------------
  // Initialization
  //--------------------------------------------------------------------------

  this.init = function ()
  {
    var i, j, o;

    // Build the UI tables
    lobby.apps.marabu.sequencer.build_sequence_table();

    // Create audio element, and always play the audio as soon as it's ready
    mAudio = new Audio();
    mAudioTimer.setAudioElement(mAudio);
    mAudio.addEventListener("canplay", function () { this.play(); }, true);

    mSong = lobby.apps.marabu.new_song();

    // Update UI according to the loaded song
    updateSongInfo();
    updateSequencer();
    updatePattern();

    // GUI.pattern_controller.load();
    // GUI.sequence_controller.select();

    lobby.apps.marabu.instrument.install();
    updateInstrument(true);

    mJammer.start();
    mJammer.updateRowLen(mSong.rowLen);
  };
};


//------------------------------------------------------------------------------
// Program start
//------------------------------------------------------------------------------

function gui_init()
{
  GUI = new CGUI();
  GUI.init();
}

lobby.apps.marabu.setup.confirm("gui/gui");
