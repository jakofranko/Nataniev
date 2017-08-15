lobby.apps.marabu.methods.save = {name:"save", shortcut:"s", run_shortcut:true}

var format_json = function(song)
{
  var OSC1_WAVEFORM = 0, OSC1_VOL = 1, OSC1_SEMI = 2, OSC1_XENV = 3, OSC2_WAVEFORM = 4, OSC2_VOL = 5, OSC2_SEMI = 6, OSC2_DETUNE = 7, OSC2_XENV = 8, NOISE_VOL = 9, ENV_ATTACK = 10, ENV_SUSTAIN = 11, ENV_RELEASE = 12, ARP_CHORD = 13, ARP_SPEED = 14, LFO_WAVEFORM = 15, LFO_AMT = 16, LFO_FREQ = 17, LFO_FX_FREQ = 18, FX_FILTER = 19, FX_FREQ = 20, FX_RESONANCE = 21, FX_DIST = 22, FX_DRIVE = 23, FX_PAN_AMT = 24, FX_PAN_FREQ = 25, FX_DELAY_AMT = 26, FX_DELAY_TIME = 27; 
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
}

lobby.apps.marabu.save = function(val, is_passive = false)
{
  GUI.update_ranges();

  if(lobby.apps.marabu.location){
    console.log("overwrite "+lobby.apps.marabu.location,format_json(GUI.song()));
  }
  else{
    var dataURI = "data:text/javascript;base64," + btoa(format_json(GUI.song()));
    window.open(dataURI);
    return false;
  }
}

lobby.apps.marabu.setup.confirm("methods/save");
