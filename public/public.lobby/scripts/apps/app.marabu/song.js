function Song()
{
  this.create = function()
  {
    var song = {}, i, j, k, instr, col;
    song.rowLen = calcSamplesPerRow(120);
    song.endPattern = 2;
    song.patternLen = 32;
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
      for (j = 0; j < MAX_SONG_ROWS; j++){
        instr.p[j] = 0;
      }

      // Patterns
      instr.c = [];
      for (j = 0; j < MAX_PATTERNS; j++)
      {
        col = {n:[],f:[]};
        for (k = 0; k < song.patternLen * 4; k++){
          col.n[k] = 0;
        }
        for (k = 0; k < song.patternLen * 2; k++){
          col.f[k] = 0;
        }
        instr.c[j] = col;
      }
      
      // Save
      song.songData[i] = instr;
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

    // Create a pattern
    song.songData[0].p[0] = 1;
    return song;
  }
}

lobby.apps.marabu.setup.confirm("song");
