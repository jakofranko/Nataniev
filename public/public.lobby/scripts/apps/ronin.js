function App_Ronin()
{
	App.call(this);

	this.name = "ronin";
	this.size = {width:400,height:400};
	this.origin = {x:30,y:30};

	this.start = function()
	{
    this.el.style.width = this.size.width+"px";
    this.el.style.height = this.size.height+"px";
    this.el.style.top = this.origin.y+"px"; 
    this.el.style.left = this.origin.x+"px";
    
    lobby.el.appendChild(this.el);
	}
}