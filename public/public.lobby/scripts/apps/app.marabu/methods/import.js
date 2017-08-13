lobby.apps.marabu.methods.import = {name:"import", shortcut:"i"}

var binToSong = function (d)
{
  // Try to parse the binary data as a SoundBox song
  var song = soundboxBinToSong(d);

  // If we couldn't parse the song, just make a clean new song
  if (!song) {
    alert("Song format not recognized.");
    return undefined;
  }

  return song;
};

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

lobby.apps.ide.import = function(val, is_passive = false)
{
  var d = null;
  return;

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
}

lobby.apps.marabu.setup.confirm("methods/import");