function Sequencer_Follower()
{
  var timer = -1;
  this.first_row = 0;
  this.last_row = 0;
  this.first_col = 0;
  this.last_col = 0;

  this.start = function()
  {
    lobby.apps.marabu.sequencer.refresh();
    lobby.apps.marabu.editor.refresh();

    timer = setInterval(this.update, 16);

    var table = document.getElementById("pattern-table");
    table.className = "tracks playing";
    console.log("follower","start");
  }

  this.update = function()
  {
    var t = GUI.mAudio_timer().currentTime();

    if (GUI.mAudio().ended || (GUI.mAudio().duration && ((GUI.mAudio().duration - t) < 0.1))) {
      stop();
      return;
    }

    var n = Math.floor(t * 44100 / GUI.song().rowLen);
    var seqPos = Math.floor(n / GUI.song().patternLen) + this.first_row;
    var patPos = n % GUI.song().patternLen;

    // document.getElementById("spr"+seqPos).className = "played";
    document.getElementById("ppr"+patPos).className = "played";
  }

  function stop()
  {
    console.log("follower","stop");
    clearInterval(timer);
    timer = -1;
    lobby.apps.marabu.editor.refresh();
  }

  this.stop = function()
  {
    stop();
  }
}

lobby.apps.marabu.setup.confirm("sequencer.follower");
