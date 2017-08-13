lobby.apps.ide.methods.export = {name:"export", shortcut:"s"}

var CBinWriter = function ()
{
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

lobby.apps.ide.export = function(val, is_passive = false)
{
  var song = null;

  return;

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
}

lobby.apps.marabu.setup.confirm("methods/export");