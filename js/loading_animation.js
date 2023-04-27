function loadingObject(){
	this.container = null;
	this.config = {
		container:$(document.body),
		loadingtext:'Loading...',
		loadinggif:'images/elements/loading.gif',
		zIndex: 1000
	}
	this.show = function(config){
		if (this.container == null){
			var this_obj = this;
			setTimeout(function(){
				$.extend(this_obj.config, config);
				this_obj.container = $('<div class="loading-container" style="position:absolute;top:0;bottom:0;left:0;right:0;background:rgba(0,0,0,0.3);z-index:'+this_obj.config.zIndex+'"></div>');
				this_obj.container.append('<div style="position:fixed;top:49%;left:49%;text-align:center"><img src="'+this_obj.config.loadinggif+'" style="width:50px"><p style="font-size: 20px; color: #3a94d1; font-family:sans-serif; font-weight: bold; margin: 10px 0;">'+this_obj.config.loadingtext+'</p></div>')
				this_obj.config.container.append(this_obj.container);
			},100)
		}
	};
	this.hide = function(){
		var this_obj = this;
		setTimeout(function(){
			// this_obj.config.container.remove("#loading-container");
			this_obj.config.container.find(".loading-container").remove();
			// this_obj.container.remove();
		},100)
		
	};
}