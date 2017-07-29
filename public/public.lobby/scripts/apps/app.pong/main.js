function Pong()
{
  App.call(this);

  this.name = "pong";
  this.size = {width:210,height:210};
  this.origin = {x:120,y:30};
  this.theme = "noir";
  this.methods.new = {name:"new",shortcut:"n",run_shortcut:true};

  this.on_launch = function()
  {
    this.new();
  }

  this.paddle = null;
  this.ball = null;

  this.new = function()
  {
    if(this.paddle  && this.paddle.is_alive){ this.paddle.is_alive = false; return; }

    this.paddle = {x:(this.size.width/2)-15,is_alive:true,score:0};
    this.ball = {x:this.size.width/2,y:this.size.height/2,prev_x:0,prev_y:0,old_x:0,old_y:0,direction:{v:true,h:null},speed:3, fx:{x:1,y:1}};

    this.update();
  }

  this.update = function()
  {
    this.ball.old_x = this.ball.prev_x;
    this.ball.old_y = this.ball.prev_y;

    this.ball.prev_x = this.ball.x;
    this.ball.prev_y = this.ball.y;

    // Update Ball
    if(this.ball.direction.v == true){ this.ball.y += this.ball.speed * this.ball.fx.y; }
    if(this.ball.direction.v == false){ this.ball.y -= this.ball.speed * this.ball.fx.y; }
    if(this.ball.direction.h == true){ this.ball.x += this.ball.speed * this.ball.fx.x; }
    if(this.ball.direction.h == false){ this.ball.x -= this.ball.speed * this.ball.fx.x; }

    // Collide Ball
    if(this.ball.y <= 0){ this.ball.direction.v = true; }
    if(this.ball.x <= 0){ this.ball.direction.h = true; }
    if(this.ball.x >= this.size.width){ this.ball.direction.h = false; }
    
    // Collide with Paddle
    if(this.ball.y >= this.size.height){ 
      if(this.paddle.x < this.ball.x && this.paddle.x+30 > this.ball.x){
        this.ball.direction.v = false;
        if( this.ball.direction.h == null){ this.ball.direction.h = true; }
        this.ball.speed += 0.25;
        this.paddle.score += 1;
        lobby.commander.notify("Pong +"+this.paddle.score);
        this.ball.fx.x = (1 + Math.random() + Math.random())/3;
        this.ball.fx.y = (1 + Math.random() + Math.random())/3;
      }
      else{
        this.paddle.is_alive = false;
        lobby.commander.notify("Died "+this.paddle.score,5);
      }
    }

    if(this.paddle.is_alive){
      var app = this;
      setTimeout(function(){ app.update(); }, 50);  
    }

    this.draw();
  }

  this.draw = function()
  {
    var path = "";
    // Draw Paddle
    path += "M"+this.paddle.x+","+(this.size.height-1)+" l30,0 ";
    // Draw Ball
    path += "M"+this.ball.x+","+this.ball.y+" L"+this.ball.prev_x+","+this.ball.prev_y+" L"+this.ball.old_x+","+this.ball.old_y+" ";
    // Generate
    this.wrapper_el.innerHTML = '<svg width="'+this.size.width+'" height="'+this.size.height+'" style="stroke:white; fill:none; stroke-width:1; stroke-linecap:butt"><path d="'+path+'"></path></svg>';
  }

  this.key_arrow_left  = function()
  {
    this.move_paddle(-1);
  }

  this.key_arrow_right = function()
  {
    this.move_paddle(1);
  }

  this.move_paddle = function(mod)
  {
    this.paddle.x += mod * 30;
    if(this.paddle.x < 0){ this.paddle.x = 0; }
    if(this.paddle.x > this.size.width - 30){ this.paddle.x = this.size.width - 30; }
    this.draw();
  }
}

lobby.install_callback("Pong");
