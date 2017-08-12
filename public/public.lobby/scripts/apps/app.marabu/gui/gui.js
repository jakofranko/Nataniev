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
// Local classes for easy access to binary data
//------------------------------------------------------------------------------

var CBinParser = function (d) {
  var mData = d;
  var mPos = 0;

  this.getUBYTE = function () {
    return mData.charCodeAt(mPos++) & 255;
  };

  this.getUSHORT = function () {
    var l = (mData.charCodeAt(mPos) & 255) |
            ((mData.charCodeAt(mPos + 1) & 255) << 8);
    mPos += 2;
    return l;
  };

  this.getULONG = function () {
    var l = (mData.charCodeAt(mPos) & 255) |
            ((mData.charCodeAt(mPos + 1) & 255) << 8) |
            ((mData.charCodeAt(mPos + 2) & 255) << 16) |
            ((mData.charCodeAt(mPos + 3) & 255) << 24);
    mPos += 4;
    return l;
  };

  this.getFLOAT = function () {
    var l = this.getULONG();
    if (l == 0) return 0;
    var s = l & 0x80000000;                       // Sign
    var e = (l >> 23) & 255;                      // Exponent
    var m = 1 + ((l & 0x007fffff) / 0x00800000);  // Mantissa
    var x = m * Math.pow(2, e - 127);
    return s ? -x : x;
  };

  this.getTail = function () {
    var str = mData.slice(mPos);
    mPos = mData.length;
    return str;
  };
};

var CBinWriter = function () {
  var mData = "";

  this.putUBYTE = function (x) {
    mData += String.fromCharCode(x);
  };

  this.putUSHORT = function (x) {
    mData += String.fromCharCode(
               x & 255,
               (x >> 8) & 255
             );
  };

  this.putULONG = function (x) {
    mData += String.fromCharCode(
               x & 255,
               (x >> 8) & 255,
               (x >> 16) & 255,
               (x >> 24) & 255
             );
  };

  this.putFLOAT = function (x) {
    var l = 0;
    if (x != 0)
    {
      var s = 0;
      if (x < 0) s = 0x80000000, x = -x;
      var e = 127 + 23;
      while (x < 0x00800000)
      {
        x *= 2;
        e--;
      }
      while (x >= 0x01000000)
      {
        x /= 2;
        e++;
      }
      l = s | ((e & 255) << 23) | (x & 0x007fffff);
    }
    this.putULONG(l);
  };

  this.append = function (x) {
    mData += x;
  };

  this.getData = function () {
    return mData;
  };
};


//------------------------------------------------------------------------------
// Helper class for getting high precision timing info from an audio element
// (e.g. Firefox Audio.currentTime has < 60 Hz precision, leading to choppy
// animations etc).
//------------------------------------------------------------------------------

var CAudioTimer = function () {
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

  // Parsed URL data
  var mBaseURL;
  var mGETParams;

  // Resources
  var mSong = {};
  var mAudio = null;
  var mAudioTimer = new CAudioTimer();
  var mPlayer = new CPlayer();
  var mPlayGfxVUImg = new Image();
  var mPlayGfxLedOffImg = new Image();
  var mPlayGfxLedOnImg = new Image();
  var mJammer = new CJammer();

  this.mJammer = mJammer;

  var mBlackKeyPos = [
    26, 1, 63, 3, 116, 6, 150, 8, 184, 10, 238, 13, 274, 15, 327, 18, 362, 20, 394, 22
  ];

  // Prealoaded resources
  var mPreload = [];


  //--------------------------------------------------------------------------
  // URL parsing & generation
  //--------------------------------------------------------------------------

  var getURLBase = function (url) {
    var queryStart = url.indexOf("?");
    return url.slice(0, queryStart >= 0 ? queryStart : url.length);
  };

  var parseURLGetData = function (url) {
    var queryStart = url.indexOf("?") + 1;
    var queryEnd   = url.indexOf("#") + 1 || url.length + 1;
    var query      = url.slice(queryStart, queryEnd - 1);

    var params = {};
    if (query === url || query === "")
      return params;

    var nvPairs = query.replace(/\+/g, " ").split("&");

    for (var i=0; i<nvPairs.length; i++) {
      var nv = nvPairs[i].split("=");
      var n  = decodeURIComponent(nv[0]);
      var v  = decodeURIComponent(nv[1]);
      if ( !(n in params) ) {
        params[n] = [];
      }
      params[n].push(nv.length === 2 ? v : null);
    }
    return params;
  };

  var getURLSongData = function (dataParam) {
    var songData = undefined;
    if (dataParam) {
      var str = dataParam, str2 = "";
      if (str.indexOf("data:") == 0) {
        // This is a data: URI (e.g. data:application/x-extension-sbx;base64,....)
        var idx = str.indexOf("base64,");
        if (idx > 0)
          str2 = str.substr(idx + 7);
      } else {
        // This is GET data from an http URL
        for (var i = 0; i < str.length; ++i) {
          var chr = str[i];
          if (chr === "-") chr = "+";
          if (chr === "_") chr = "/";
          str2 += chr;
        }
      }
      try {
        songData = atob(str2);
      }
      catch (err) {
        songData = undefined;
      }
    }
    return songData;
  };

  var makeURLSongData = function (data) {
    var str = btoa(data), str2 = "";
    for (var i = 0; i < str.length; ++i) {
      var chr = str[i];
      if (chr === "+") chr = "-";
      if (chr === "/") chr = "_";
      if (chr === "=") chr = "";
      str2 += chr;
    }
    return mBaseURL + "?data=" + str2;
  };


  //--------------------------------------------------------------------------
  // Song import/export functions
  //--------------------------------------------------------------------------

  var calcSamplesPerRow = function (bpm) {
    return Math.round((60 * 44100 / 4) / bpm);
  };

  var getBPM = function () {
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


  var makeNewSong = function ()
  {
    var song = {}, i, j, k, instr, col;

    // Row length
    song.rowLen = calcSamplesPerRow(120);

    // Last pattern to play
    song.endPattern = 2;

    // Rows per pattern
    song.patternLen = 32;

    // Select the default instrument from the presets
    var defaultInstr = { name: "FORM sin", i: [3,255,128,0,2,23,152,0,0,0,0,72,129,0,0,3,121,57,0,2,180,50,0,31,47,3,55,8] };

    // All 8 instruments
    song.songData = [];
    for (i = 0; i < 8; i++) {
      instr = {};
      instr.i = [];

      // Copy the default instrument
      for (j = 0; j <= defaultInstr.i.length; ++j) {
        instr.i[j] = defaultInstr.i[j];
      }

      // Sequence
      instr.p = [];
      for (j = 0; j < MAX_SONG_ROWS; j++)
        instr.p[j] = 0;

      // Patterns
      instr.c = [];
      for (j = 0; j < MAX_PATTERNS; j++)
      {
        col = {};
        col.n = [];
        for (k = 0; k < song.patternLen * 4; k++)
          col.n[k] = 0;
        col.f = [];
        for (k = 0; k < song.patternLen * 2; k++)
          col.f[k] = 0;
        instr.c[j] = col;
      }

      song.songData[i] = instr;
      song.songData[i].p[0] = 1;
      song.songData[i].p[1] = 1;
      song.songData[i].p[2] = 1;
      song.songData[i].p[3] = 1;
      song.songData[i].c[0].n[0] = 87;
      song.songData[i].c[0].n[1] = 87;
      song.songData[i].c[0].n[2] = 87;
      song.songData[i].c[0].n[3] = 87;
      song.songData[i].c[0].n[4] = 87;
      song.songData[i].c[0].n[5] = 87;

      song.songData[i].c[1].n[0] = 87;
      song.songData[i].c[1].n[1] = 87;
      song.songData[i].c[1].n[2] = 87;
      song.songData[i].c[1].n[3] = 87;
      song.songData[i].c[1].n[4] = 87;
      song.songData[i].c[1].n[5] = 87;

      song.songData[i].c[2].n[0] = 87;
      song.songData[i].c[2].n[1] = 87;
      song.songData[i].c[2].n[2] = 87;
      song.songData[i].c[2].n[3] = 87;
      song.songData[i].c[2].n[4] = 87;
      song.songData[i].c[2].n[5] = 87;

    }

    // Default instruments
    song.songData[4].name = "Kick";
    song.songData[4].i = [2,0,92,0,0,255,92,23,1,0,14,0,74,0,0,0,89,0,1,1,16,0,21,255,49,6,0,0];
    song.songData[5].name = "Snare";
    song.songData[5].i = [0,221,92,1,0,210,92,0,1,192,4,0,46,0,0,1,97,141,1,3,93,0,4,57,20,0,0,6];
    song.songData[6].name = "Hihat"
    song.songData[6].i = [0,0,140,0,0,0,140,0,0,60,4,10,34,0,0,0,187,5,0,1,239,135,0,170,87,5,0,4];
    song.songData[7].name = "Tom"
    song.songData[7].i = [0,192,104,1,0,80,99,0,0,0,4,0,66,0,0,3,0,0,0,1,0,1,2,32,37,4,0,0];

    // Make a first empty pattern
    song.songData[0].p[0] = 1;

    return song;
  };

  var songToBin = function (song) {
    var bin = new CBinWriter();

    // Row length (i.e. song speed)
    bin.putULONG(song.rowLen);

    // Last pattern to play
    bin.putUBYTE(song.endPattern - 2);

    // Rows per pattern
    bin.putUBYTE(song.patternLen);

    // All 8 instruments
    var i, j, k, instr, col;
    for (i = 0; i < 8; i++) {
      instr = song.songData[i];

      // Oscillator 1
      bin.putUBYTE(instr.i[OSC1_WAVEFORM]);
      bin.putUBYTE(instr.i[OSC1_VOL]);
      bin.putUBYTE(instr.i[OSC1_SEMI]);
      bin.putUBYTE(instr.i[OSC1_XENV]);

      // Oscillator 2
      bin.putUBYTE(instr.i[OSC2_WAVEFORM]);
      bin.putUBYTE(instr.i[OSC2_VOL]);
      bin.putUBYTE(instr.i[OSC2_SEMI]);
      bin.putUBYTE(instr.i[OSC2_DETUNE]);
      bin.putUBYTE(instr.i[OSC2_XENV]);

      // Noise oscillator
      bin.putUBYTE(instr.i[NOISE_VOL]);

      // Envelope
      bin.putUBYTE(instr.i[ENV_ATTACK]);
      bin.putUBYTE(instr.i[ENV_SUSTAIN]);
      bin.putUBYTE(instr.i[ENV_RELEASE]);

      // Arpeggio
      bin.putUBYTE(instr.i[ARP_CHORD]);
      bin.putUBYTE(instr.i[ARP_SPEED]);

      // LFO
      bin.putUBYTE(instr.i[LFO_WAVEFORM]);
      bin.putUBYTE(instr.i[LFO_AMT]);
      bin.putUBYTE(instr.i[LFO_FREQ]);
      bin.putUBYTE(instr.i[LFO_FX_FREQ]);

      // Effects
      bin.putUBYTE(instr.i[FX_FILTER]);
      bin.putUBYTE(instr.i[FX_FREQ]);
      bin.putUBYTE(instr.i[FX_RESONANCE]);
      bin.putUBYTE(instr.i[FX_DIST]);
      bin.putUBYTE(instr.i[FX_DRIVE]);
      bin.putUBYTE(instr.i[FX_PAN_AMT]);
      bin.putUBYTE(instr.i[FX_PAN_FREQ]);
      bin.putUBYTE(instr.i[FX_DELAY_AMT]);
      bin.putUBYTE(instr.i[FX_DELAY_TIME]);

      // Patterns
      for (j = 0; j < MAX_SONG_ROWS; j++)
        bin.putUBYTE(instr.p[j]);

      // Columns
      for (j = 0; j < MAX_PATTERNS; j++) { // 32 for MAX_PATTERNS
        col = instr.c[j];
        for (k = 0; k < song.patternLen * 4; k++)
          bin.putUBYTE(col.n[k]);
        for (k = 0; k < song.patternLen * 2; k++)
          bin.putUBYTE(col.f[k]);
      }
    }

    // Pack the song data
    // FIXME: To avoid bugs, we try different compression methods here until we
    // find something that works (this should not be necessary).
    var unpackedData = bin.getData(), packedData, testData, compressionMethod = 0;
    for (i = 9; i > 0; i--) {
      packedData = RawDeflate.deflate(unpackedData, i);
      testData = RawDeflate.inflate(packedData);
      if (unpackedData === testData) {
        compressionMethod = 2;
        break;
      }
    }
    if (compressionMethod == 0) {
      packedData = rle_encode(bin.getData());
      testData = rle_decode(packedData);
      if (unpackedData === testData)
        compressionMethod = 1;
      else
        packedData = unpackedData;
    }

    // Create a new binary stream - this is the actual file
    bin = new CBinWriter();

    // Signature ("SBox")
    bin.putULONG(2020557395);

    // Format version
    bin.putUBYTE(11);

    // Compression method
    //  0: none
    //  1: RLE
    //  2: DEFLATE
    bin.putUBYTE(compressionMethod);

    // Append packed data
    bin.append(packedData);

    return bin.getData();
  };

  var soundboxBinToSong = function (d) {
    var bin = new CBinParser(d);
    var song = {};

    // Signature
    var signature = bin.getULONG();

    // Format version
    var version = bin.getUBYTE();

    // Check if this is a SoundBox song
    if (signature != 2020557395 || (version < 1 || version > 11))
      return undefined;

    if (version >= 8) {
      // Get compression method
      //  0: none
      //  1: RLE
      //  2: DEFLATE
      var compressionMethod = bin.getUBYTE();

      // Unpack song data
      var packedData = bin.getTail(), unpackedData;
      switch (compressionMethod) {
      default:
      case 0:
        unpackedData = packedData;
        break;
      case 1:
        unpackedData = rle_decode(packedData);
        break;
      case 2:
        unpackedData = RawDeflate.inflate(packedData);
        break;
      }
      bin = new CBinParser(unpackedData);
    }

    // Row length
    song.rowLen = bin.getULONG();

    // Last pattern to play
    song.endPattern = bin.getUBYTE() + 2;

    // Number of rows per pattern
    if (version >= 10)
      song.patternLen = bin.getUBYTE();
    else
      song.patternLen = 32;

    // All 8 instruments
    song.songData = [];
    var i, j, k, instr, col;
    for (i = 0; i < 8; i++) {
      instr = {};
      instr.i = [];

      // Oscillator 1
      if (version < 6) {
        instr.i[OSC1_SEMI] = bin.getUBYTE();
        instr.i[OSC1_XENV] = bin.getUBYTE();
        instr.i[OSC1_VOL] = bin.getUBYTE();
        instr.i[OSC1_WAVEFORM] = bin.getUBYTE();
      }
      else {
        instr.i[OSC1_WAVEFORM] = bin.getUBYTE();
        instr.i[OSC1_VOL] = bin.getUBYTE();
        instr.i[OSC1_SEMI] = bin.getUBYTE();
        instr.i[OSC1_XENV] = bin.getUBYTE();
      }

      // Oscillator 2
      if (version < 6) {
        instr.i[OSC2_SEMI] = bin.getUBYTE();
        instr.i[OSC2_DETUNE] = bin.getUBYTE();
        instr.i[OSC2_XENV] = bin.getUBYTE();
        instr.i[OSC2_VOL] = bin.getUBYTE();
        instr.i[OSC2_WAVEFORM] = bin.getUBYTE();
      }
      else {
        instr.i[OSC2_WAVEFORM] = bin.getUBYTE();
        instr.i[OSC2_VOL] = bin.getUBYTE();
        instr.i[OSC2_SEMI] = bin.getUBYTE();
        instr.i[OSC2_DETUNE] = bin.getUBYTE();
        instr.i[OSC2_XENV] = bin.getUBYTE();
      }

      // Noise oscillator
      instr.i[NOISE_VOL] = bin.getUBYTE();

      // Envelope
      if (version < 5) {
        instr.i[ENV_ATTACK] = Math.round(Math.sqrt(bin.getULONG()) / 2);
        instr.i[ENV_SUSTAIN] = Math.round(Math.sqrt(bin.getULONG()) / 2);
        instr.i[ENV_RELEASE] = Math.round(Math.sqrt(bin.getULONG()) / 2);
      }
      else {
        instr.i[ENV_ATTACK] = bin.getUBYTE();
        instr.i[ENV_SUSTAIN] = bin.getUBYTE();
        instr.i[ENV_RELEASE] = bin.getUBYTE();
      }

      // Arpeggio
      if (version < 11) {
        instr.i[ARP_CHORD] = 0;
        instr.i[ARP_SPEED] = 0;
      }
      else {
        instr.i[ARP_CHORD] = bin.getUBYTE();
        instr.i[ARP_SPEED] = bin.getUBYTE();
      }

      if (version < 6) {
        // Effects
        instr.i[FX_FILTER] = bin.getUBYTE();
        if (version < 5)
          instr.i[FX_FREQ] = Math.round(bin.getUSHORT() / 43.23529);
        else
          instr.i[FX_FREQ] = bin.getUBYTE();
        instr.i[FX_RESONANCE] = bin.getUBYTE();

        instr.i[FX_DELAY_TIME] = bin.getUBYTE();
        instr.i[FX_DELAY_AMT] = bin.getUBYTE();
        instr.i[FX_PAN_FREQ] = bin.getUBYTE();
        instr.i[FX_PAN_AMT] = bin.getUBYTE();
        instr.i[FX_DIST] = bin.getUBYTE();
        instr.i[FX_DRIVE] = bin.getUBYTE();

        // LFO
        instr.i[LFO_FX_FREQ] = bin.getUBYTE();
        instr.i[LFO_FREQ] = bin.getUBYTE();
        instr.i[LFO_AMT] = bin.getUBYTE();
        instr.i[LFO_WAVEFORM] = bin.getUBYTE();
      }
      else {
        // LFO
        instr.i[LFO_WAVEFORM] = bin.getUBYTE();
        instr.i[LFO_AMT] = bin.getUBYTE();
        instr.i[LFO_FREQ] = bin.getUBYTE();
        instr.i[LFO_FX_FREQ] = bin.getUBYTE();

        // Effects
        instr.i[FX_FILTER] = bin.getUBYTE();
        instr.i[FX_FREQ] = bin.getUBYTE();
        instr.i[FX_RESONANCE] = bin.getUBYTE();
        instr.i[FX_DIST] = bin.getUBYTE();
        instr.i[FX_DRIVE] = bin.getUBYTE();
        instr.i[FX_PAN_AMT] = bin.getUBYTE();
        instr.i[FX_PAN_FREQ] = bin.getUBYTE();
        instr.i[FX_DELAY_AMT] = bin.getUBYTE();
        instr.i[FX_DELAY_TIME] = bin.getUBYTE();
      }

      // Patterns
      var song_rows = version < 9 ? 48 : MAX_SONG_ROWS;
      instr.p = [];
      for (j = 0; j < song_rows; j++)
        instr.p[j] = bin.getUBYTE();
      for (j = song_rows; j < MAX_SONG_ROWS; j++)
        instr.p[j] = 0;

      // Columns
      var num_patterns = version < 9 ? 10 : MAX_PATTERNS; // 32 for MAX_PATTERNS
      instr.c = [];
      for (j = 0; j < num_patterns; j++) {
        col = {};
        col.n = [];
        if (version == 1) {
          for (k = 0; k < song.patternLen; k++) {
            col.n[k] = bin.getUBYTE();
            col.n[k+song.patternLen] = 0;
            col.n[k+2*song.patternLen] = 0;
            col.n[k+3*song.patternLen] = 0;
          }
        }
        else {
          for (k = 0; k < song.patternLen * 4; k++)
            col.n[k] = bin.getUBYTE();
        }
        col.f = [];
        if (version < 4) {
          for (k = 0; k < song.patternLen * 2; k++)
            col.f[k] = 0;
        }
        else {
          for (k = 0; k < song.patternLen; k++) {
            var fxCmd = bin.getUBYTE();
            // We inserted two new commands in version 11
            if (version < 11 && fxCmd >= 14)
              fxCmd += 2;
            col.f[k] = fxCmd;
          }
          for (k = 0; k < song.patternLen; k++)
            col.f[song.patternLen + k] = bin.getUBYTE();
        }
        instr.c[j] = col;
      }
      for (j = num_patterns; j < MAX_PATTERNS; j++) { // 32 for MAX_PATTERNS
        col = {};
        col.n = [];
        for (k = 0; k < song.patternLen * 4; k++)
          col.n[k] = 0;
        col.f = [];
        for (k = 0; k < song.patternLen * 2; k++)
          col.f[k] = 0;
        instr.c[j] = col;
      }

      // Fixup conversions
      if (version < 3) {
        if (instr.i[OSC1_WAVEFORM] == 2)
          instr.i[OSC1_VOL] = Math.round(instr.i[OSC1_VOL]/2);
        if (instr.i[OSC2_WAVEFORM] == 2)
          instr.i[OSC2_VOL] = Math.round(instr.i[OSC2_VOL]/2);
        if (instr.i[LFO_WAVEFORM] == 2)
          instr.i[LFO_AMT] = Math.round(instr.i[LFO_AMT]/2);
        instr.i[FX_DRIVE] = instr.i[FX_DRIVE] < 224 ? instr.i[FX_DRIVE] + 32 : 255;
      }
      if (version < 7)
        instr.i[FX_RESONANCE] = 255 - instr.i[FX_RESONANCE];

      song.songData[i] = instr;
    }

    return song;
  };

  var sonantBinToSong = function (d) {
    // Check if this is a sonant song (correct length & reasonable end pattern)
    if (d.length != 3333)
      return undefined;
    if ((d.charCodeAt(3332) & 255) > 48)
      return undefined;

    var bin = new CBinParser(d);
    var song = {};

    // Row length
    song.rowLen = bin.getULONG();

    // Number of rows per pattern
    song.patternLen = 32;

    // All 8 instruments
    song.songData = [];
    var i, j, k, instr, col, master;
    for (i = 0; i < 8; i++) {
      instr = {};
      instr.i = [];

      // Oscillator 1
      instr.i[OSC1_SEMI] = 12 * (bin.getUBYTE() - 8) + 128;
      instr.i[OSC1_SEMI] += bin.getUBYTE();
      bin.getUBYTE(); // Skip (detune)
      instr.i[OSC1_XENV] = bin.getUBYTE();
      instr.i[OSC1_VOL] = bin.getUBYTE();
      instr.i[OSC1_WAVEFORM] = bin.getUBYTE();

      // Oscillator 2
      instr.i[OSC2_SEMI] = 12 * (bin.getUBYTE() - 8) + 128;
      instr.i[OSC2_SEMI] += bin.getUBYTE();
      instr.i[OSC2_DETUNE] = bin.getUBYTE();
      instr.i[OSC2_XENV] = bin.getUBYTE();
      instr.i[OSC2_VOL] = bin.getUBYTE();
      instr.i[OSC2_WAVEFORM] = bin.getUBYTE();

      // Noise oscillator
      instr.i[NOISE_VOL] = bin.getUBYTE();
      bin.getUBYTE(); // Pad!
      bin.getUBYTE(); // Pad!
      bin.getUBYTE(); // Pad!

      // Envelope
      instr.i[ENV_ATTACK] = Math.round(Math.sqrt(bin.getULONG()) / 2);
      instr.i[ENV_SUSTAIN] = Math.round(Math.sqrt(bin.getULONG()) / 2);
      instr.i[ENV_RELEASE] = Math.round(Math.sqrt(bin.getULONG()) / 2);
      master = bin.getUBYTE(); // env_master

      // Effects
      instr.i[FX_FILTER] = bin.getUBYTE();
      bin.getUBYTE(); // Pad!
      bin.getUBYTE(); // Pad!
      instr.i[FX_FREQ] = Math.round(bin.getFLOAT() / 43.23529);
      instr.i[FX_RESONANCE] = 255 - bin.getUBYTE();
      instr.i[FX_DELAY_TIME] = bin.getUBYTE();
      instr.i[FX_DELAY_AMT] = bin.getUBYTE();
      instr.i[FX_PAN_FREQ] = bin.getUBYTE();
      instr.i[FX_PAN_AMT] = bin.getUBYTE();
      instr.i[FX_DIST] = 0;
      instr.i[FX_DRIVE] = 32;

      // Arpeggio
      instr.i[ARP_CHORD] = 0;
      instr.i[ARP_SPEED] = 0;

      // LFO
      bin.getUBYTE(); // Skip! (lfo_osc1_freq)
      instr.i[LFO_FX_FREQ] = bin.getUBYTE();
      instr.i[LFO_FREQ] = bin.getUBYTE();
      instr.i[LFO_AMT] = bin.getUBYTE();
      instr.i[LFO_WAVEFORM] = bin.getUBYTE();

      // Patterns
      instr.p = [];
      for (j = 0; j < 48; j++)
        instr.p[j] = bin.getUBYTE();
      for (j = 48; j < MAX_SONG_ROWS; j++)
        instr.p[j] = 0;

      // Columns
      instr.c = [];
      for (j = 0; j < 10; j++) {
        col = {};
        col.n = [];
        for (k = 0; k < 32; k++) {
          col.n[k] = bin.getUBYTE();
          col.n[k+32] = 0;
          col.n[k+64] = 0;
          col.n[k+96] = 0;
        }
        col.f = [];
        for (k = 0; k < 32 * 2; k++)
          col.f[k] = 0;
        instr.c[j] = col;
      }
      for (j = 10; j < MAX_PATTERNS; j++) { // 32 for MAX_PATTERNS
        col = {};
        col.n = [];
        for (k = 0; k < 32 * 4; k++)
          col.n[k] = 0;
        col.f = [];
        for (k = 0; k < 32 * 2; k++)
          col.f[k] = 0;
        instr.c[j] = col;
      }

      bin.getUBYTE(); // Pad!
      bin.getUBYTE(); // Pad!

      // Fixup conversions
      if (instr.i[FX_FILTER] < 1 || instr.i[FX_FILTER] > 3) {
        instr.i[FX_FILTER] = 2;
        instr.i[FX_FREQ] = 255; // 11025;
      }
      instr.i[OSC1_VOL] *= master / 255;
      instr.i[OSC2_VOL] *= master / 255;
      instr.i[NOISE_VOL] *= master / 255;
      if (instr.i[OSC1_WAVEFORM] == 2)
        instr.i[OSC1_VOL] /= 2;
      if (instr.i[OSC2_WAVEFORM] == 2)
        instr.i[OSC2_VOL] /= 2;
      if (instr.i[LFO_WAVEFORM] == 2)
        instr.i[LFO_AMT] /= 2;
      instr.i[OSC1_VOL] = Math.round(instr.i[OSC1_VOL]);
      instr.i[OSC2_VOL] = Math.round(instr.i[OSC2_VOL]);
      instr.i[NOISE_VOL] = Math.round(instr.i[NOISE_VOL]);
      instr.i[LFO_AMT] = Math.round(instr.i[LFO_AMT]);

      song.songData[i] = instr;
    }

    // Last pattern to play
    song.endPattern = bin.getUBYTE() + 2;

    return song;
  };

  var binToSong = function (d) {
    // Try to parse the binary data as a SoundBox song
    var song = soundboxBinToSong(d);

    // Try to parse the binary data as a Sonant song
    if (!song)
      song = sonantBinToSong(d);

    // If we couldn't parse the song, just make a clean new song
    if (!song) {
      alert("Song format not recognized.");
      return undefined;
    }

    return song;
  };

  var songToJS = function (song)
  {
    console.log(song)
    var i, j, k;
    var jsData = "";

    jsData += "    var song = {\n";

    jsData += "      songData: [\n";
    for (i = 0; i < 8; i++) {
      var instr = song.songData[i];
      jsData += "        { // Instrument " + i + "\n";
      jsData += "          i: ["+ instr.i[OSC1_WAVEFORM] + ","+ instr.i[OSC1_VOL] + ","+ instr.i[OSC1_SEMI] + ","+ instr.i[OSC1_XENV] + ","+ instr.i[OSC2_WAVEFORM] + ","+ instr.i[OSC2_VOL] + ","+ instr.i[OSC2_SEMI] + ","+ instr.i[OSC2_DETUNE] + ","+ instr.i[OSC2_XENV] + ","+ instr.i[NOISE_VOL] + ","+ instr.i[ENV_ATTACK] + ","+ instr.i[ENV_SUSTAIN] + ","+ instr.i[ENV_RELEASE] + ","+ instr.i[ARP_CHORD] + ","+ instr.i[ARP_SPEED] + ","+ instr.i[LFO_WAVEFORM] + ","+ instr.i[LFO_AMT] + ","+ instr.i[LFO_FREQ] + ","+ instr.i[LFO_FX_FREQ] + ","+ instr.i[FX_FILTER] + ","+ instr.i[FX_FREQ] + ","+ instr.i[FX_RESONANCE] + ","+ instr.i[FX_DIST] + ","+ instr.i[FX_DRIVE] + ","+ instr.i[FX_PAN_AMT] + ","+ instr.i[FX_PAN_FREQ] + ","+ instr.i[FX_DELAY_AMT] + ","+ instr.i[FX_DELAY_TIME] + "],\n";

      // Sequencer data for this instrument
      jsData += "          // Patterns\n";
      jsData += "          p: [";
      var lastRow = song.endPattern - 2;
      var maxPattern = 0, lastNonZero = 0;
      for (j = 0; j <= lastRow; j++) {
        var pattern = instr.p[j];
        if (pattern > maxPattern)
          maxPattern = pattern;
        if (pattern)
          lastNonZero = j;
      }
      for (j = 0; j <= lastNonZero; j++) {
        var pattern = instr.p[j];
        if (pattern)
          jsData += pattern;
        if (j < lastNonZero)
          jsData += ",";
      }
      jsData += "],\n";

      // Pattern data for this instrument
      jsData += "          // Columns\n";
      jsData += "          c: [\n";
      for (j = 0; j < maxPattern; j++) {
        jsData += "            {n: [";
        lastNonZero = 0;
        for (k = 0; k < song.patternLen * 4; k++) {
          if (instr.c[j].n[k])
            lastNonZero = k;
        }
        for (k = 0; k <= lastNonZero; k++) {
          var note = instr.c[j].n[k];
          if (note)
            jsData += note;
          if (k < lastNonZero)
            jsData += ",";
        }
        jsData += "],\n";
        jsData += "             f: [";
        lastNonZero = 0;
        for (k = 0; k < song.patternLen * 2; k++) {
          if (instr.c[j].f[k])
            lastNonZero = k;
        }
        for (k = 0; k <= lastNonZero; k++) {
          var fx = instr.c[j].f[k];
          if (fx)
            jsData += fx;
          if (k < lastNonZero)
            jsData += ",";
        }
        jsData += "]}";
        if (j < maxPattern - 1)
          jsData += ",";
        jsData += "\n";
      }
      jsData += "          ]\n";
      jsData += "        }";
      if (i < 7)
        jsData += ",";
      jsData += "\n";
    }

    jsData += "      ],\n";
    jsData += "      rowLen: " + song.rowLen + ",   // In sample lengths\n";
    jsData += "      patternLen: " + song.patternLen + ",  // Rows per pattern\n";
    jsData += "      endPattern: " + song.endPattern + "  // End pattern\n";
    jsData += "    };\n";

    return jsData;
  };

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

  var unfocusHTMLInputElements = function ()
  {
    document.getElementById("bpm").blur();
    document.getElementById("rpp").blur();
  };

  var setEditMode = function (mode)
  {
    if(mode === mEditMode){ return; }

    GUI.update_status("Mode: "+mode);
    mEditMode = mode;

    // Unfocus any focused input elements
    if (mEditMode != EDIT_NONE)
    {
      unfocusHTMLInputElements();
      updatePatternLength();
    }
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

  var toHex = function (num, count) {
    var s = num.toString(16).toUpperCase();
    var leadingZeros = count - s.length;
    for (var i = 0; i < leadingZeros; ++i)
      s = "0" + s;
    return s;
  };

  var updateFxTrack = function (scrollIntoView, selectionOnly)
  {
    lobby.apps.marabu.editor.build_table();
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

  var updateInstrument = function(resetPreset)
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
    GUI.sliders["osc1_vol"].override(instr.i[OSC1_VOL]);
    GUI.sliders["osc1_semi"].override(instr.i[OSC1_SEMI]);
    GUI.sliders["osc2_vol"].override(instr.i[OSC2_VOL]);
    GUI.sliders["osc2_semi"].override(instr.i[OSC2_SEMI]);
    GUI.sliders["osc2_det"].override(instr.i[OSC2_DETUNE]);
    GUI.sliders["noise_vol"].override(instr.i[NOISE_VOL]);

    GUI.sliders["env_att"].override(instr.i[ENV_ATTACK]);
    GUI.sliders["env_sust"].override(instr.i[ENV_SUSTAIN]);
    GUI.sliders["env_rel"].override(instr.i[ENV_RELEASE]);

    GUI.sliders["arp_note1"].override(instr.i[ARP_CHORD] >> 4);
    GUI.sliders["arp_note2"].override(instr.i[ARP_CHORD] & 15);
    GUI.sliders["arp_speed"].override(instr.i[ARP_SPEED]);

    GUI.sliders["lfo_amt"].override(instr.i[LFO_AMT]);
    GUI.sliders["lfo_freq"].override(instr.i[LFO_FREQ]);
    GUI.sliders["lfo_fxfreq"].override(instr.i[LFO_FX_FREQ]);

    GUI.sliders["fx_freq"].override(instr.i[FX_FREQ]);
    GUI.sliders["fx_res"].override(instr.i[FX_RESONANCE]);
    GUI.sliders["fx_dly_amt"].override(instr.i[FX_DELAY_AMT]);
    GUI.sliders["fx_dly_time"].override(instr.i[FX_DELAY_TIME]);
    GUI.sliders["fx_pan_amt"].override(instr.i[FX_PAN_AMT]);
    GUI.sliders["fx_pan_freq"].override(instr.i[FX_PAN_FREQ]);
    GUI.sliders["fx_dist"].override(instr.i[FX_DIST]);
    GUI.sliders["fx_drive"].override(instr.i[FX_DRIVE]);

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
    GUI.update_status("Updated song BPM to <b>"+bpm+"</b>")
  }

  this.update_rpp = function(rpp)
  {
    setPatternLength(rpp);
    updatePatternLength();
    GUI.update_status("Updated RPP to <b>"+rpp+"</b>")
  }

  var setPatternLength = function (length) {
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

  var updatePatternLength = function ()
  {
    var rpp = parseInt(document.getElementById("rpp").value);
    rpp = 32;
    if (rpp && (rpp >= 1) && (rpp <= 256)) {
      // Update the pattern length of the song data
      setPatternLength(rpp);

      // Update UI
      updatePattern();
      updateFxTrack();
    }
  };

  var updateSongRanges = function () {
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
      updateFxTrack();
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

  var setStatus = function (msg)
  {
    document.getElementById("statusText").innerHTML = msg;
//    window.status = msg;
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
    var w = mPlayGfxVUImg.width > 0 ? mPlayGfxVUImg.width : o.width;
    var h = mPlayGfxVUImg.height > 0 ? mPlayGfxVUImg.height : 51;
    var ctx = o.getContext("2d");
    if (ctx)
    {
      // Draw the VU meter BG
      ctx.drawImage(mPlayGfxVUImg, 0, 0);

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
        ctx.drawImage(mPlayGfxLedOffImg, x, h);

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
            ctx.drawImage(mPlayGfxLedOnImg, x, h);
            ctx.globalAlpha = 1.0;
          }
        }
      }
    }
  };

  var updateFollower = function ()
  {
    if (mAudio == null)
      return;

    // Get current time
    var t = mAudioTimer.currentTime();

    // Are we past the play range (i.e. stop the follower?)
    if (mAudio.ended || (mAudio.duration && ((mAudio.duration - t) < 0.1))) {
      stopFollower();

      // Reset pattern position
      mPatternRow = 0;
      mPatternRow2 = 0;
      updatePattern();
      mFxTrackRow = 0;
      mFxTrackRow2 = 0;
      updateFxTrack();

      return;
    }

    // Calculate current song position
    var n = Math.floor(t * 44100 / mSong.rowLen);
    var seqPos = Math.floor(n / mSong.patternLen) + mFollowerFirstRow;
    var patPos = n % mSong.patternLen;

    // Have we stepped?
    var newSeqPos = (seqPos != mSeqRow);
    var newPatPos = newSeqPos || (patPos != mPatternRow);

    // Update the sequencer
    if (newSeqPos) {
      if (seqPos >= 0) {
        mSeqRow = seqPos;
        mSeqRow2 = seqPos;
        updateSequencer(true, true);
      }
      for (var i = 0; i < MAX_SONG_ROWS; ++i) {
        var o = document.getElementById("spr" + i);
        // o.className = (i == seqPos ? "playpos" : "");
      }
    }

    // Update the pattern
    if (newPatPos) {
      if (patPos >= 0) {
        mPatternRow = patPos;
        mPatternRow2 = patPos;
        updatePattern(true, !newSeqPos);
        mFxTrackRow = patPos;
        mFxTrackRow2 = patPos;
        updateFxTrack(true, !newSeqPos);
      }
      for (var i = 0; i < mSong.patternLen; ++i) {
        var o = document.getElementById("ppr" + i);
        // o.className = (i == patPos ? "playpos" : ""); // TODO
      }
    }

    // Player graphics
    redrawPlayerGfx(t);
  };

  var startFollower = function ()
  { // TODO!!!!!
    // Update the sequencer selection
    mSeqRow = mFollowerFirstRow;
    mSeqRow2 = mFollowerFirstRow;
    mSeqCol2 = 0;
    updateSequencer(true, true);
    updatePattern();
    updateFxTrack();

    // Start the follower
    mFollowerActive = true;
    mFollowerTimerID = setInterval(updateFollower, 16);
  };

  var stopFollower = function ()
  {
    // TODO
    if (mFollowerActive)
    {
      // Stop the follower
      if (mFollowerTimerID !== -1) {
        clearInterval(mFollowerTimerID);
        mFollowerTimerID = -1;
      }

      // Clear the follower markers
      for (var i = 0; i < MAX_SONG_ROWS; ++i) {
        // document.getElementById("spr" + i).className = ""; //
      }
      for (var i = 0; i < mSong.patternLen; ++i) {
        // document.getElementById("ppr" + i).className = ""; // TODO
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

    // stopAudio();
    // updateSongRanges();

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
    if (!e) var e = window.event;
    e.preventDefault();
    GUI.deselect_all();

    // Stop the currently playing audio
    stopAudio();

    // Update song ranges
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

    // Generate audio data
    var doneFun = function (wave)
    {
      if (mAudio == null)
      {
         alert("Audio element unavailable.");
         return;
      }

      try
      {
        // Restart the follower
        startFollower();

        // Load the data into the audio element (it will start playing as soon
        // as the data has been loaded)
        mAudio.src = URL.createObjectURL(new Blob([wave], {type: "audio/wav"}));

        // Hack
        mAudio.play();
        mAudioTimer.reset();
      }
      catch (err)
      {
        alert("Error playing: " + err.message);
      }
    };
    generateAudio(doneFun, opts);
  };

  var stopPlaying = function (e)
  {
    if (!e) var e = window.event;
    e.preventDefault();

    if (mAudio == null)
    {
       alert("Audio element unavailable.");
       return;
    }

    stopAudio();
  };

  // New methods

  this.update_status = function(log)
  {
    document.getElementById("statusText").innerHTML = log;
  }

  var boxMouseDown = function (e) {
    if (!e) var e = window.event;
    if (mSeqCol == mSeqCol2) {
      var o = getEventElement(e);

      // Check which instrument parameter was changed
      var fxCmd = -1;
      if (o.id === "osc1_xenv")
        fxCmd = OSC1_XENV;
      else if (o.id === "osc2_xenv")
        fxCmd = OSC2_XENV;
      else if (o.id === "lfo_fxfreq")
        fxCmd = LFO_FX_FREQ;

      // Update the instrument (toggle boolean)
      var fxValue;
      if (fxCmd >= 0) {
        fxValue = GUI.instrument().i[fxCmd] ? 0 : 1;
        GUI.instrument().i[fxCmd] = fxValue;
      }

      // Edit the fx track
      if (GUI.pattern_controller.is_mod_selected) {
        var pat = GUI.instrument().p[mSeqRow] - 1;
        if (pat >= 0) {
          GUI.instrument().c[pat].f[mFxTrackRow] = fxCmd + 1;
          GUI.instrument().c[pat].f[mFxTrackRow+mSong.patternLen] = fxValue;
          updateFxTrack();
        }
      }

      updateInstrument(true);
      unfocusHTMLInputElements();
      e.preventDefault();
    }
  };

  this.osc1_update = function(wave_name)
  {
    console.log(wave_name);
    var wave = 0;
    if (wave_name == "SIN") wave = 0;
    else if (wave_name === "SQR") wave = 1;
    else if (wave_name === "SAW") wave = 2;
    else if (wave_name === "TRI") wave = 3;

    if (GUI.pattern_controller.is_mod_selected) {
      var pat = GUI.instrument().p[mSeqRow] - 1;
      if (pat >= 0) {
        GUI.instrument().c[pat].f[mFxTrackRow] = OSC1_WAVEFORM + 1;
        GUI.instrument().c[pat].f[mFxTrackRow+mSong.patternLen] = wave;
        updateFxTrack();
      }
    }
    console.log(GUI.instrument())
    GUI.instrument().i[OSC1_WAVEFORM] = wave;
    updateInstrument();
  }

  this.osc2_update = function(wave_name)
  {
    console.log(wave_name);
    var wave = 0;
    if (wave_name == "SIN") wave = 0;
    else if (wave_name === "SQR") wave = 1;
    else if (wave_name === "SAW") wave = 2;
    else if (wave_name === "TRI") wave = 3;

    if (GUI.pattern_controller.is_mod_selected) {
      var pat = GUI.instrument().p[mSeqRow] - 1;
      if (pat >= 0) {
        GUI.instrument().c[pat].f[mFxTrackRow] = OSC2_WAVEFORM + 1;
        GUI.instrument().c[pat].f[mFxTrackRow+mSong.patternLen] = wave;
        updateFxTrack();
      }
    }
    GUI.instrument().i[OSC2_WAVEFORM] = wave;
    updateInstrument();
  }

  this.lfo_update = function(wave_name)
  {
    console.log(wave_name);
    var wave = 0;
    if (wave_name == "SIN") wave = 0;
    else if (wave_name === "SQR") wave = 1;
    else if (wave_name === "SAW") wave = 2;
    else if (wave_name === "TRI") wave = 3;

    if (GUI.pattern_controller.is_mod_selected) {
      var pat = GUI.instrument().p[mSeqRow] - 1;
      if (pat >= 0) {
        GUI.instrument().c[pat].f[mFxTrackRow] = LFO_WAVEFORM + 1;
        GUI.instrument().c[pat].f[mFxTrackRow+mSong.patternLen] = wave;
        updateFxTrack();
      }
    }
    GUI.instrument().i[LFO_WAVEFORM] = wave;
    updateInstrument(true);
  }

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
        updateFxTrack();
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
          updateFxTrack();
        }
      }
    }

    if (cmdNo >= 0){ instr.i[cmdNo] = value;}
    mJammer.updateInstr(instr.i);  
  }

  this.update_sequencer = function()
  {
    updateSequencer();
  }

  this.update_pattern = function()
  {
    updatePattern();
  }

  this.update_pattern_mod = function()
  {
    updateFxTrack();
  }

  this.update_sequencer_position = function(val)
  {
    GUI.instrument().p[mSeqRow] = val;
    GUI.update_sequencer();
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
    GUI.update_status("Loaded Instrument <b>"+instr_name+"</b>");
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
    GUI.update_status("Loaded Kit");
  }

  var export_instrument = function()
  {
    GUI.instrument_controller.export_instrument();
  }

  var export_kit = function()
  {
    GUI.instrument_controller.export_kit();
  }

  var getCurrentBeatDistance = function (table) {
    var beatDistance = 1;
    while (beatDistance < table.children.length) {
      if (table.children[beatDistance].className === "beat")
        break;
      beatDistance++;
    }
    return beatDistance;
  };

  var getBeatDistance = function () {
    var bpm = getBPM();
    var beatDistance = 4;
    if (mSong.patternLen % 3 === 0)
      beatDistance = 3;
    else if (mSong.patternLen % 4 === 0)
      beatDistance = 4;
    else if (mSong.patternLen % 2 === 0)
      beatDistance = 2;
    else if (mSong.patternLen % 5 === 0)
      beatDistance = 5;
    if ((bpm / beatDistance) >= 40 && mSong.patternLen > 24 && (mSong.patternLen % (beatDistance * 2) === 0))
      beatDistance *= 2;

    return beatDistance;
  };

  //--------------------------------------------------------------------------
  // Initialization
  //--------------------------------------------------------------------------

  this.sliders = {};
  this.choices = {};

  this.setup_sliders = function(sliders)
  {
    for(id in sliders){
      var slider = new Slider(sliders[id].id,sliders[id].name,sliders[id].min,sliders[id].max);
      this.sliders[new String(sliders[id].id)] = slider;
      slider.install();
    }
  }

  this.deselect_sliders = function()
  {
    for(id in this.sliders){
      this.sliders[id].deselect();
    }
  }

  this.deselect_all = function()
  {
    GUI.deselect_sliders();
    GUI.pattern_controller.deselect();
    GUI.sequence_controller.deselect();
    GUI.instrument_controller.deselect();
  }

  this.setup_choices = function(choices)
  {
    for(id in choices){
      var c = choices[id];
      var choice = new UI_Choice(c.id,c.name,c.choices);
      this.choices[new String(c.id)] = choice;
      choice.install();
    }
  }

  this.get_storage = function(id)
  {
    if      (id == "osc1_vol")    { return OSC1_VOL; }
    else if (id == "osc1_semi")   { return OSC1_SEMI; }
    else if (id == "osc2_vol")    { return OSC2_VOL; }
    else if (id == "osc2_semi")   { return OSC2_SEMI; }
    else if (id == "osc2_det")    { return OSC2_DETUNE; }
    else if (id == "noise_vol")   { return NOISE_VOL; }
    else if (id == "env_att")     { return ENV_ATTACK; }
    else if (id == "env_sust")    { return ENV_SUSTAIN; }
    else if (id == "env_rel")     { return ENV_RELEASE; }
    else if (id == "arp_note1")   { return ARP_CHORD; }
    else if (id == "arp_note2")   { return ARP_CHORD; }
    else if (id == "arp_speed")   { return ARP_SPEED; }
    else if (id == "lfo_amt")     { return LFO_AMT; }
    else if (id == "lfo_freq")    { return LFO_FREQ; }
    else if (id == "fx_freq")     { return FX_FREQ; }
    else if (id == "fx_res")      { return FX_RESONANCE; }
    else if (id == "fx_dist")     { return FX_DIST; }
    else if (id == "fx_drive")    { return FX_DRIVE; }
    else if (id == "fx_pan_amt")  { return FX_PAN_AMT; }
    else if (id == "fx_pan_freq") { return FX_PAN_FREQ; }
    else if (id == "fx_dly_amt")  { return FX_DELAY_AMT; }
    else if (id == "fx_dly_time") { return FX_DELAY_TIME; }

    return -1;
  }

  this.init = function ()
  {
    var i, j, o;

    // Parse URL
    mBaseURL = getURLBase(window.location.href);
    mGETParams = parseURLGetData(window.location.href);

    // Load images for the play graphics canvas
    mPlayGfxVUImg.onload = function () {
      redrawPlayerGfx(-1);
    };
    mPlayGfxLedOffImg.onload = function () {
      redrawPlayerGfx(-1);
    };

    // Build the UI tables
    lobby.apps.marabu.sequencer.build_sequence_table();

    // Create audio element, and always play the audio as soon as it's ready
    mAudio = new Audio();
    mAudioTimer.setAudioElement(mAudio);
    mAudio.addEventListener("canplay", function () { this.play(); }, true);

    mSong = makeNewSong();

    this.setup_sliders([
      {id: "osc1_vol", name: "VOL", min: 0, max: 255, percent: true },
      {id: "osc1_semi", name: "FRQ", min: 92, max: 164 },
      {id: "noise_vol", name: "NOI", min: 0, max: 255 },

      {id: "osc2_vol", name: "VOL", min: 0, max: 255, percent: true },
      {id: "osc2_semi", name: "FRQ", min: 92, max: 164 },
      {id: "osc2_det", name: "DET", min: 0, max: 255, percent: true, nonLinear: true },

      {id: "env_att", name: "ATK", min: 0, max: 255 },
      {id: "env_sust", name: "SUS", min: 0, max: 255 },
      {id: "env_rel", name: "REL", min: 0, max: 255 },

      {id: "arp_note1", name: "ARP", min: 0, max: 12 },
      {id: "arp_note2", name: "SEC", min: 0, max: 12 },
      {id: "arp_speed", name: "SPD", min: 0, max: 7 },

      {id: "lfo_amt", name: "AMT", min: 0, max: 255 },
      {id: "lfo_freq", name: "FRQ", min: 0, max: 254 },
      {id: "lfo_fxfreq", name: "MOD", min: 0, max: 255 },

      {id: "fx_freq", name: "FRQ", min: 0, max: 255, nonLinear: true },
      {id: "fx_res", name: "RES", min: 0, max: 254 },
      {id: "fx_dly_amt", name: "DLY", min: 0, max: 255 },
      {id: "fx_dly_time", name: "SPD", min: 0, max: 16 },
      {id: "fx_pan_amt", name: "PAN", min: 0, max: 255 },
      {id: "fx_pan_freq", name: "FRQ", min: 0, max: 16 },
      {id: "fx_dist", name: "DIS", min: 0, max: 255, nonLinear: true },
      {id: "fx_drive", name: "DRV", min: 0, max: 255 },
    ]);

    this.setup_choices([
      {id: "osc1_wave_select", name: "OSC", choices: ["SAW","SQR","TRI","SIN"]},
      {id: "osc2_wave_select", name: "OSC", choices: ["SAW","SQR","TRI","SIN"]},
      {id: "fx_filter_select", name: "EFX", choices: ["HP","BP","LP"]},
      {id: "lfo_wave_select", name: "LFO", choices: ["SAW","SQR","TRI","SIN"]}
    ])

    // Update UI according to the loaded song
    updateSongInfo();
    updateSequencer();
    updatePattern();
    updateFxTrack();
    updateInstrument(true);

    GUI.pattern_controller.load();
    GUI.sequence_controller.select();

    // Misc event handlers
    document.getElementById("exportJS").onmousedown = exportJS;
    document.getElementById("exportWAV").onmousedown = exportWAV;
    document.getElementById("exportBINARY").onmousedown = exportBINARY;
    document.getElementById("exportINSTRUMENT").onmousedown = export_instrument;
    document.getElementById("exportKIT").onmousedown = export_kit;

    document.getElementById("osc1_xenv").addEventListener("mousedown", boxMouseDown, false);
    document.getElementById("osc1_xenv").addEventListener("touchstart", boxMouseDown, false);

    document.getElementById("osc2_xenv").addEventListener("mousedown", boxMouseDown, false);
    document.getElementById("osc2_xenv").addEventListener("touchstart", boxMouseDown, false);

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
