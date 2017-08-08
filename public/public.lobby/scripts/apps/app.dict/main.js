function Dict()
{
  App.call(this);

  this.name = "dict";
  this.window.size = {width:600,height:360};
  this.window.pos = {x:120,y:120};

  this.methods.find = {name:"find", shortcut:"f", passive:true};
  this.methods.reset = {name:"reset", shortcut:"r", run_shortcut:true};

  this.payload = null;

  this.setup.start = function()
  {
    this.app.reload();
  }

  this.reload = function()
  {
    var app = this;
    app.wrapper_el.innerHTML = "Loading. ";

    $.ajax({url: '/dict.load',
      type: 'POST', 
      data: { date:"20170101" },
      success: function(response) {
        var a = JSON.parse(response);
        app.payload = a;
        app.wrapper_el.innerHTML = "Ready. ";
        app.find("");
      }
    })
  }

  this.reset = function()
  {
    this.find("");
  }

  this.find = function(q, is_passive = false)
  {
    var html = "";
    var count = 0;

    for(english in this.payload){
      var word = this.payload[english];
      if(english.indexOf(q) == -1){ continue; }
      if(q == "" && (!word.lietal || !word.russian)){ continue; }
      html += this.print_word(english,word,q);
      count += 1;
    }

    var header = q == "" ? "<hl style='margin-bottom:15px'>English - Lietal - Russian Dictionary</hl>" : "<hl style='margin-bottom:15px'>Found "+count+" results for \""+q+"\".</hl>";
    this.wrapper_el.innerHTML = header+"<list style='column-count:3'>"+html+"</list>";
    lobby.commander.update_status();
  }

  this.print_word = function(en,word,q)
  {
    var html = "";

    html += "<b>"+en.replace(q,"<t style='text-decoration:underline'>"+q+"</t>")+"</b> ";
    for(lang in word){
      html += "<i>"+lang.substr(0,2)+"</i> "+word[lang]+" ";
    }
    return "<ln class='lh15'>"+html+"</ln>";
  }

  this.status = function()
  {
    var html = "";
    var count = {sum:0,russian:0,lietal:0};
    console.log(this.payload)
    for(english in this.payload){
      count.sum += 1;
      if(this.payload[english].lietal){ count.lietal += 1; }
      if(this.payload[english].russian){ count.russian += 1; }
    }
    return count.sum+" words "+count.lietal+" lietal "+count.russian+" russian";
  }
}

lobby.summon.confirm("Dict");
