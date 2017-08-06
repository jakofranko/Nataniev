function App_Touch()
{
  var target = this;

  this.touch = 
  {
    app : target,
    from : null,

    down : function(e)
    {
      lobby.touch.bind(target);
      $(target.el).addClass("dragged");
    },

    move : function(e)
    {

    },

    up : function(e)
    {
      lobby.touch.release(target);
      $(target.el).removeClass("dragged");
    }
  }
}