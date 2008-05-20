/**
 * @author jr4409
 */
var digget = new Class.create();
digget.prototype = {
    initialize: function(options){
        if (!options.diggurl) 
            return;
        if (!options.container) 
            return;
        this.diggurl = options.diggurl;
		var clean_title = this.diggurl.substring(this.diggurl.lastIndexOf("/") + 1);
		this.container = options.container;
		this.text_color = options.text_color;
		var url = "http://services.digg.com/story/" + clean_title + "?type=json&appkey=http%3A%2F%2Fpowncemonkey.com%2f"
        var oInst = this;
        var handlerFunc = function(t){
			var resp = eval("(" + t.responseText + ")");
			if(resp.count==1)
				oInst.createDiggWidget(resp.stories[0]);
        };
        var errFunc = function(t){
        	
        };
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            method: 'get'
        });
    },
	createDiggWidget: function(story) {
		var digg_shade = document.createElement("a");
		digg_shade.className = "digg-shade";
		digg_shade.href = "#";
		digg_shade.addEventListener("click",function() {
	        var urlReq = new air.URLRequest(story.href);
	        air.navigateToURL(urlReq);
		});
		var diggs = document.createElement("strong");
		diggs.innerHTML = story.diggs;
		digg_shade.appendChild(diggs);
		this.container.appendChild(digg_shade);
		var digg_title = document.createElement("a");
		digg_title.className = "digg-title";
		digg_title.href = "#";
		digg_title.style.color = this.text_color;
		digg_title.innerHTML = story.title;
		digg_title.addEventListener("click",function() {
	        var urlReq = new air.URLRequest(story.link);
	        air.navigateToURL(urlReq);
		});
		this.container.appendChild(digg_title);
		var dets = document.createElement("div");
		var comments = document.createElement("a");
		comments.className = "digg-comments";
		comments.href = "#";
		comments.innerHTML = story.comments + " Comments";
		comments.style.color = this.text_color;
		comments.addEventListener("click",function() {
	        var urlReq = new air.URLRequest(story.href);
	        air.navigateToURL(urlReq);
		});
		dets.appendChild(comments);
		var digg_user = document.createElement("a");
		digg_user.className = "digg-user";
		digg_user.href = "#";
		digg_user.addEventListener("click",function() {
	        var urlReq = new air.URLRequest("http://digg.com/users/" + story.user.name);
	        air.navigateToURL(urlReq);
		});
		var digg_user_img = document.createElement("img");
		digg_user_img.src = story.user.icon;
		digg_user_img.style.width = "10px";
		digg_user_img.style.height = "10px";
		digg_user.style.color = this.text_color;
		digg_user.appendChild(digg_user_img);
		digg_user.appendChild(document.createTextNode(story.user.name));
		dets.appendChild(digg_user);
		this.container.appendChild(dets);
	}
};