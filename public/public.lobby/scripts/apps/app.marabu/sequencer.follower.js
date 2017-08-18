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
    var app = lobby.apps.marabu;
    var t = app.song.mAudio_timer().currentTime();

    if (app.song.mAudio().ended || (app.song.mAudio().duration && ((app.song.mAudio().duration - t) < 0.1))) {
      stop();
      return;
    }

    var n = Math.floor(t * 44100 / app.song.song().rowLen);
    var seqPos = Math.floor(n / app.song.song().patternLen) + this.first_row;
    var patPos = n % app.song.song().patternLen;

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
