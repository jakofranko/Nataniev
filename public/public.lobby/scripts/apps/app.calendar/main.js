function Calendar()
{
	App.call(this);

  this.name = "calendar";

  this.window.size = {width:720,height:450};
  this.window.pos = {x:90,y:90};

  this.widget_el = document.createElement("t"); this.widget_el.className = "toggle";

  this.setup.ready = function()
  {
    lobby.commander.install_widget(this.app.widget_el);
    this.app.update();

    var app = this.app;
    this.app.widget_el.addEventListener("mousedown", function(){ app.toggle() }, true);
  }

  this.setup.start = function()
  {
    this.app.call("get_calendar",null);  
  }

  this.on_launch = function()
  {
    console.log("!")
    this.call("get_calendar",null);  
  }

  this.draw = function(logs = null)
  {
    var html = "";
    var m = 1;
    while(m <= 13){
      html += "<yu class='di w7 mr30 lh15'>";
      html += "<yu>"+(new Date().desamber_dict[m-1])+"</yu>";
      var d = 1;
      while(d <= 28){
        var stamp = "2017"+(m < 10 ? '0'+m : m)+(d < 10 ? '0'+d : d);
        var cl = "f9 ";
        var day_number = (d < 10 ? '0'+d : d);
        day_number += logs && logs[stamp] ? "<t class='fc'>"+logs[stamp].value+"</t>" : '';
        html += "<t class='di w1 "+(logs && logs[stamp] ? 'f0 ' : 'f9')+" "+(stamp == new Date().desamber_stamp() ? 'fu' : '')+"'>"+day_number+"</t>";
        d += 1;
      }
      html += "</yu>";
      m += 1;
    }
    html += "<yu class='di w7 mr30 lh15'>";
    html += "<yu>Year Days</yu>";
    html += "<t class='di w1 f9'>LP</t>";
    html += "<t class='di w1 f9'>YD</t>";
    html += "</yu>";

    this.el.innerHTML = html;
  }

  this.call_back = function(m,r)
  {
    this.draw(r[0].payload);
  }

  this.update = function()
  {
    this.widget_el.innerHTML = new Date().desamber_month_name().substr(0,3)+" "+new Date().desamber_day();
  }
}

Date.prototype.desamber_dict = ['Unesamber', 'Dutesamber', 'Trisesamber', 'Tetresamber', 'Pentesamber', 'Hexesamber', 'Sevesamber', 'Octesamber', 'Novesamber', 'Desamber', 'Undesamber', 'Dodesamber', 'Tridesamber', 'Year Day'];

Date.prototype.desamber_month_name = function()
{
  return this.desamber_dict[parseInt(this.day_of_year()/28)];
}

Date.prototype.desamber_day = function()
{
  return (this.day_of_year()%28 + 1);
}

Date.prototype.desamber_stamp = function()
{
  var y = this.getFullYear();
  var m = parseInt(this.day_of_year()/28)+1;
  var d = (this.day_of_year()%28 + 1);
  return y+""+(m < 10 ? '0'+m : m)+""+(d < 10 ? '0'+d : d);
}

Date.prototype.desamber = function()
{
  var month_number = parseInt(this.day_of_year()/28);
  var day_number = (this.day_of_year()%28 + 1);
  return this.desamber_dict[month_number]+" "+day_number;
}

Date.prototype.is_leap_year = function()
{
  var year = this.getFullYear();
  if((year & 3) != 0) return false;
  return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.day_of_year = function()
{
  var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
  var mn = this.getMonth();
  var dn = this.getDate();
  var dayOfYear = dayCount[mn] + dn;
  if(mn > 1 && this.is_leap_year()) dayOfYear++;
  return dayOfYear - 1;
};

lobby.summon.confirm("Calendar");
