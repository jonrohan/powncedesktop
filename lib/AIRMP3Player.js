/**
 * @author Jon
 */
var AIRMP3Player = new Class.create();
AIRMP3Player.prototype = {
    initialize: function(options){
        this.s = new air.Sound();
		this.artist;
		this.album;
		this.name;
		
        this.domobj;
        this.artdiv;
        this.sngdiv;
        this.progbar;
        this.slider;
        this.playbtn;
		try {
        var req = new air.URLRequest(options.url);
        var context = new air.SoundLoaderContext(8000, true);
        this.s.addEventListener(air.Event.ID3, onID3InfoReceived);
        this.s.load(req, context);
		}
		catch(e) {
			air.trace(e.message);
			return;
		}
        var oInst = this;
        this.channel = null;
        this.id3properties = null;
        this.timer;
        this.s.addEventListener(air.Event.SOUND_COMPLETE, onPlaybackComplete);
        this.s.addEventListener(air.Event.COMPLETE, onLoad);
        
        this.monitorProgress = function(event){
            var estimatedLength = Math.ceil(oInst.s.length / (oInst.s.bytesLoaded / oInst.s.bytesTotal));
            var playbackPercent = Math.round(100 * oInst.channel.position / estimatedLength);
            if(oInst.progbar)
				oInst.progbar.style.width = playbackPercent + "%";
        }
        
        function onPlaybackComplete(event){
            clearInterval(oInst.timer);
        }
        
		function onLoad(event) {
			if(options.autoplay)
				oInst.play();
		}
        
        function onID3InfoReceived(event){
            if (oInst.id3properties) 
                return;
            var id3 = event.target.id3;
            oInst.id3properties = id3;
			if (oInst.artdiv&&oInst.sngdiv) {
				oInst.artdiv.appendChild(document.createTextNode(id3.TPE1));
				oInst.sngdiv.appendChild(document.createTextNode(id3.TIT2));
			}
        }
        
        this.play = function(){
            if (oInst.channel) {
                clearInterval(oInst.timer);
                oInst.channel.stop();
				if (oInst.playbtn) {
					oInst.playbtn.innerHTML = "";
					oInst.playbtn.className = "play-button";
				}
                oInst.channel = null;
            } else {
				properties.ui.current_mp3player = oInst;
                oInst.timer = setInterval(oInst.monitorProgress, 100);
                oInst.channel = oInst.s.play();
				if (oInst.playbtn) {
					oInst.playbtn.innerHTML = "";
					oInst.playbtn.className = "stop-button";
				}
            }
        };
        
        this.stop = function(){
			if (oInst.channel) {
            clearInterval(oInst.timer);
				oInst.channel.stop();
				oInst.playbtn.innerHTML = "";
				oInst.playbtn.className = "play-button";
				oInst.channel = null;
			}
        };
    },
    getDOMObject: function(){
        this.domobj = document.createElement("div");
        this.domobj.className = "mp3-player";
        
        this.playbtn = document.createElement("span");
        this.playbtn.className = "play-button";
        this.playbtn.innerHTML = "";
        this.playbtn.addEventListener("click", this.play);
        this.domobj.appendChild(this.playbtn);
        
		var detdiv = document.createElement("div");
		
        this.sngdiv = document.createElement("span");
        this.sngdiv.className = "song-name";
        detdiv.appendChild(this.sngdiv);
        
		detdiv.appendChild(document.createTextNode(" by "));
		
        this.artdiv = document.createElement("span");
        this.artdiv.className = "artist-name";
        detdiv.appendChild(this.artdiv);
        
		this.domobj.appendChild(detdiv);
		
        var npdiv = document.createElement("div");
        npdiv.className = "progress";
        this.progbar = document.createElement("div");
        this.progbar.className = "progress-bar";
        npdiv.appendChild(this.progbar);
        this.domobj.appendChild(npdiv);
        
        //var stop = document.createElement("span");
        //stop.innerHTML = " stop";
        //stop.addEventListener("click", this.stop);
        //this.domobj.appendChild(stop);
        
        return this.domobj;
    }
};
