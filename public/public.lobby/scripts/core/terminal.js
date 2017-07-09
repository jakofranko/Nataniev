function Terminal()
{
  Invocate.call(this);

  this.invoke_style("/public.lobby/links","terminal");

  this.queue = [];

  this.is_active = false
  this.is_visible = false
  this.el = document.createElement("yu")
  this.el.id = "terminal"

  this.history_el = document.createElement("list");
  this.history_el.className = "history";
  this.el.appendChild(this.history_el);

  this.input_wr = document.createElement("wr");
  this.el.appendChild(this.input_wr);

  this.who_el = document.createElement("t");
  this.who_el.className = "who";
  this.who_el.innerHTML = "@oscean.ghost > "
  this.input_wr.appendChild(this.who_el);
  
  this.input_el = document.createElement("input");
  this.input_wr.appendChild(this.input_el);

  document.onkeydown = function myFunction(){ terminal.on_keydown(event); };
  document.onkeyup = function myFunction(){ terminal.on_keyup(event); };

  this.append = function(entry)
  {
    console.log(entry);
    this.queue.push(entry);
  }

  this.refresh = function()
  {
    if(this.queue.length > 0){
      var line = document.createElement("ln");
      var entry = this.queue[0];
      line.innerHTML = "<t class='timestamp'>"+this.clock(true)+"</t> <t class='host'>@"+entry.host+" </t><t class='text'>"+entry.text+"</t>";
      this.history_el.appendChild(line);    
      this.queue.shift();  
    }

    setTimeout(function(){ terminal.refresh(); }, 500);
  }

  this.command = function(val)
  {
    this.append({host:"oscean.ghost",text:val,class:"client"});
    this.input_el.value = "";
  }

  // 

  this.on_keydown = function(e)
  {
    if(e.keyCode == 192 && e.key == "~"){
      this.toggle();
      e.preventDefault();
      return false;
    }
  }

  this.on_keyup = function(e)
  {
    if(e.keyCode == 14 || e.key == "Enter"){
      if(this.input_el.value){
        this.command(this.input_el.value);
        e.preventDefault();
        return false;
      }
    }

  }

  this.toggle = function()
  {
    if(!this.is_active){
      this.activate();
    }
    if(this.is_visible){
      this.hide();
    }
    else{
      this.show();
    }
  }

  this.activate = function()
  {
    if(this.is_active){ return; }

    this.is_active = true;
    document.body.appendChild(this.el);
    this.append({host:"nataniev",text:"Connecting.."});
    this.append({host:"nataniev.maeve",text:"Welcome back."});

    this.refresh();
  }

  this.show = function()
  {
    this.is_visible = true;
    this.el.style.height = 'auto';
    this.el.style.padding = '15px 0px';
    this.input_el.focus();
  }

  this.hide = function()
  {
    this.is_visible = false;
    this.el.style.height = 0+'px';
    this.el.style.padding = 0+'px';
    this.input_el.blur();
  }

  this.clock = function(show_all = false)
  {
    var d = new Date(), e = new Date(d);
    var msSinceMidnight = e - d.setHours(0,0,0,0);
    var val = (msSinceMidnight/864) * 10;
    var val_s = new String(val);
    return val_s.substr(0,3)+(show_all ? ":"+val_s.substr(3,3) : '');
  }
}