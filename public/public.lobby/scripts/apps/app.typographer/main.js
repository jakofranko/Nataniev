function Typographer()
{
  App.call(this);

  this.name = "typographer";
  this.window.size = {width:800,height:210};
  this.window.pos = {x:30,y:30};

  this.preview_el = document.createElement("yu");
  this.status_el = document.createElement("yu");

  this.settings = {};
  this.settings.width = this.window.size.width;
  this.settings.height = this.window.size.height - 30;
  this.settings.letter_spacing = 1.5;
  this.settings.letter_width = 30;
  this.settings.letter_height = 20;

  this.setup.includes = ["strokes"];

  this.setup.start = function()
  {
    this.app.wrapper_el.appendChild(this.app.preview_el);
    this.app.wrapper_el.appendChild(this.app.status_el);

    this.app.status_el.innerHTML = "hey";
    this.app.render("ABCDEFGHIJKLMNO");
  }

  this.render = function(word)
  {
    var path = "";
    for(letter_id in word){
      var letter = word[letter_id];
      path += this.render_letter(letter,letter_id);
    }
    this.preview_el.innerHTML = "<svg width='"+this.settings.width+"' height='"+this.settings.height+"' style='fill:none; border-bottom:1px solid black; stroke-width:1; stroke-linecap:square'><path class='fh' d='"+path+"'></path></svg>"
  }

  this.strokes = 
  {
    A : [
      [[0,1],[0.5,0],[1,1]],
      [[0.25,0.5],[0.75,0.5]]
    ],
    B : [
      [[0,0],[0.75,0],[1,0.25,"ac"],[0.75,0.5,"ac"],[0,0.5],[0.75,0.5],[1,0.75,"ac"],[0.75,1,"ac"],[0,1],[0,0]]
    ],
    C : [
      [[1,0.75],[1,0.75],[0.75,1,"ac"],[0.25,1],[0,0.75,"ac"],[0,0.25],[0.25,0,"ac"],[0.75,0],[1,0.25,"ac"]]
    ],
    D : [
      [[0,0],[0.75,0],[1,0.25,"ac"],[1,0.5],[1,0.75],[0.75,1,"ac"],[0,1],[0,0]]
    ],
    E : [
      [[1,0],[0,0],[0,1],[1,1]],
      [[0,0.5],[1,0.5]]
    ],
    F : [
      [[0,1],[0,0],[1,0]],
      [[0,0.5],[1,0.5]]
    ],
    I : [
      [[0.5,0],[0.5,1]]
    ],
    L : [
      [[0,0],[0,1],[1,1]]
    ],
    M : [
      [[0,1],[0,0],[0.5,1],[1,0],[1,1]]
    ],
    N : [
      [[0,1],[0,0]],
      [[0,0],[1,1]],
      [[1,1],[1,0]]
    ],
    R : [
      [[0,1],[0,0],[0.75,0],[1,0.25,"ac"],[0.75,0.5,"ac"],[0,0.5]],
      [[0.75,0.5,"ac"],[1,0.75,"ac"],[1,1]]
    ],
    T : [
      [[0,0],[1,0]],
      [[0.5,0],[0.5,1]]
    ],
    V : [
      [[0,0],[0.5,1],[1,0],[1,0]]
    ],
  }

  this.render_letter = function(letter,id)
  {
    var id = parseInt(id)+1;

    var l = {w:this.settings.letter_width,h:this.settings.letter_height,s:this.settings.letter_spacing};

    var path = "";
    var anchor_pos = {x:(l.s * id * l.w),y:l.h};

    var letter_path = "";
    for(stroke_id in this.strokes[letter]){
      var stroke = this.strokes[letter][stroke_id];
      for(vertex_id in stroke){
        var vertex = stroke[vertex_id];
        var offset = anchor_pos;
        if(vertex_id == 0){
          path += "M"+(vertex[0] * l.w + offset.x)+","+(vertex[1] * l.h + offset.y)+" "
        }
        else if(vertex[2] == "ac"){
          path += "A"+(l.w/4)+","+(l.h/4)+" 0 0,1 "+(vertex[0] * l.w + offset.x)+","+(vertex[1] * l.h + offset.y)+" ";
          // a60,60 0 0,1 60,60
        }
        else{
          path += "L"+(vertex[0] * l.w + offset.x)+","+(vertex[1] * l.h + offset.y)+" "
        }
      }
    }

    return path;
  }

}

lobby.summon.confirm("Typographer");
