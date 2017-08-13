function Sequencer_Follower()
{
  var mFollowerTimerID = -1;
  var mFollowerFirstRow = 0;
  var mFollowerLastRow = 0;
  var mFollowerFirstCol = 0;
  var mFollowerLastCol = 0;
  var mFollowerActive = false;
  var mFollowerLastVULeft = 0;
  var mFollowerLastVURight = 0;

  var mSong = null; // TODO

  var getSamplesSinceNote = function (t, chan)
  {
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

  var startFollower = function()
  {
    // Update the sequencer selection
    mSeqRow = mFollowerFirstRow;
    mSeqRow2 = mFollowerFirstRow;
    mSeqCol2 = 0;
    lobby.apps.marabu.sequencer.refresh();
    lobby.apps.marabu.editor.refresh();

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
      lobby.apps.marabu.editor.refresh();
      return;
    }

    // Calculate current song position
    var n = Math.floor(t * 44100 / mSong.rowLen);
    var seqPos = Math.floor(n / mSong.patternLen) + mFollowerFirstRow;
    var patPos = n % mSong.patternLen;

    document.getElementById("spr"+seqPos).className = "played";
    document.getElementById("ppr"+patPos).className = "played";

    // Player graphics
    // redrawPlayerGfx(t);
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
      // redrawPlayerGfx(-1);
      mFollowerActive = false;
    }
  };
}

lobby.apps.marabu.setup.confirm("sequencer.follower");
