function Calendar()
{
	App.call(this);

  this.name = "calendar";
  this.size = {width:210,height:210};
  this.origin = {x:120,y:120};
  this.widget_el = document.createElement("t");

  this.on_start = function()
  {
    lobby.commander.install_widget(this.widget_el);
    this.update();
  }

  this.update = function()
  {
    this.widget_el.innerHTML = new Date().desamber()
  }
}

Date.prototype.desamber = function()
{
  var month_number = parseInt(this.day_of_year()/28);
  var month_names = ['Unesamber', 'Dutesamber', 'Trisesamber', 'Tetresamber', 'Pentesamber', 'Hexesamber', 'Sevesamber', 'Octesamber', 'Novesamber', 'Desamber', 'Undesamber', 'Dodesamber', 'Tridesamber', 'Year Day'];
  var day_number = (this.day_of_year()%28 + 1);
  return month_names[month_number]+" "+day_number;
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
  return dayOfYear;
};

lobby.install_callback("Calendar");