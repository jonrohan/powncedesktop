/**
 * @author Jon
 */
var MUXTAPE = new Class.create();
MUXTAPE.prototype = {
    initialize: function(options){
        if (!options.muxurl) 
            return;
        if (!options.container) 
            return;
        this.muxurl = options.muxurl;
        this.muxname = options.muxurl.substring(7, options.muxurl.indexOf("."));
        this.container = options.container;
        this.songs = [];
        this.current_sound;
        this.current_channel;
        this.current_song_hex = 0;
        this.current_song_clock;
        this.progress;
		this.current_song_position = 0;
		this.isPaused = false;
        var oInst = this;
        var handlerFunc = function(t){
            var resp = t.responseText;
            var temp = document.createElement("div");
            temp.innerHTML = resp;
            var ul = null;
            var uls = temp.getElementsByTagName("ul");
            for (i = 0; i < uls.length; i++) {
                if (uls[i].className == "songs") {
                    ul = uls[i];
                }
            }
            temp = null;
            var headcolor = resp.match(/div.banner, div.drawer_handle \{ background: #[0-9a-zA-Z]{6}; \}/)[0];
            headcolor = headcolor.substring(headcolor.indexOf("#"), headcolor.indexOf(";"));
            var hexsigs = resp.match(/new Kettle\([',a-zA-Z0-9&=%\[\]]+\);/)[0];
            hexsigs = hexsigs.substring(11, hexsigs.indexOf(")"));
            var hexs = hexsigs.split("]")[0];
            hexs = hexs.split(",");
            var temp = [];
            for (h = 0; h < hexs.length; h++) {
                var hex = hexs[h].replace(/[\[']/gim, "");
                var song = {};
                song.hex = hex;
                temp.push(song);
            }
            var sigs = hexsigs.split("]")[1];
            sigs = sigs.substring(1);
            sigs = sigs.split(",");
            for (s = 0; s < sigs.length; s++) {
                var sig = sigs[s].replace(/[\[']/gim, "");
                var song = temp[s];
                song.sig = sig;
                oInst.songs.push(song);
            }
            oInst.createMUXWidget(headcolor, ul);
        };
        var errFunc = function(t){
        
        };
        new Ajax.Request(this.muxurl, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            method: 'get'
        });
    },
    createMUXWidget: function(hcolor, ul){
        var mwidget = document.createElement("div");
        mwidget.className = "mux-widget";
        
        var mhead = document.createElement("div");
        mhead.className = "mux-head";
        mhead.innerHTML = this.muxname;
        mhead.style.backgroundColor = hcolor;
        mwidget.appendChild(mhead);
        mwidget.appendChild(ul);
        this.container.appendChild(mwidget);
        for (k = 0; k < this.songs.length; k++) {
            var song = this.songs[k];
            this.addEventHandler(song.hex, song.sig);
        }
    },
    addEventHandler: function(hex, sig){
        var oInst = this;
        $('song' + hex).addEventListener('click', function(){
            var url = 'http://muxtape.s3.amazonaws.com/songs/' + hex + '?PLEASE=DO_NOT_STEAL_MUSIC&' + sig;
            if (oInst.current_song_hex == hex&&!oInst.isPaused) {
                oInst.pause();
            } else {
                oInst.play(url, hex);
            }
        });
    },
    play: function(url, hex){
        var oInst = this;
        if (this.current_channel) {
            this.current_channel.stop();
            clearInterval(this.progress);
        }
        if (this.isPaused == false) {
			this.current_sound = new air.Sound();
			var req = new air.URLRequest(url);
			var context = new air.SoundLoaderContext(8000, true);
			this.current_sound.load(req, context);
			this.current_channel = this.current_sound.play();
		}
		else {
			this.current_channel = this.current_sound.play(this.current_song_position);
		}
		this.current_channel.addEventListener(air.Event.SOUND_COMPLETE, function(){
			oInst.nextSong();
		});
		this.isPaused = false;
        this.current_song_hex = hex;
		this.clearPlaying();
        $('song' + hex).className = "song playing";
        if (this.current_song_clock) 
            this.current_song_clock.innerHTML = "";
        this.current_song_clock = null;
        for (i = 0; i < $('song' + hex).childNodes.length; i++) {
            if ($('song' + hex).childNodes[i].className == "clock") {
                this.current_song_clock = $('song' + hex).childNodes[i];
            }
        }
        this.progress = setInterval(function(e){
            oInst.monitorProgress(e);
        }, 100);
    },
    stop: function(){
        clearInterval(this.progress);
        this.current_channel.stop();
        this.current_channel = null;
        air.trace($('song' + this.current_song_hex).className);
        this.current_song_hex = 0;
        this.progress = null;
    },
	pause: function() {
		this.isPaused = true;
		this.current_song_position = this.current_channel.position;
		this.current_channel.stop();
	},
	nextSong: function() {
		var index = this.getIndexByHex(this.current_song_hex);
		if(index==this.songs.length-1)
			index=0;
		else
			index++;
		var song = this.songs[index];
        var url = 'http://muxtape.s3.amazonaws.com/songs/' + song.hex + '?PLEASE=DO_NOT_STEAL_MUSIC&' + song.sig;
		this.play(url, song.hex);
	},
	getIndexByHex: function(hex) {
		for(i=0;i<this.songs.length;i++) {
			if(this.songs[i].hex==hex)
				return i;
		}
	},
    monitorProgress: function(event){
        if (this.current_song_hex == 0&&!$('song' + this.current_song_hex)) {
            clearInterval(this.progress);
            this.current_channel.stop();
            return;
        }
		var estimatedLength = Math.ceil(this.current_sound.length / (this.current_sound.bytesLoaded / this.current_sound.bytesTotal));
        var playbackPercent = Math.round(100 * this.current_channel.position / estimatedLength);
        this.setProgress(playbackPercent);
    },
    setProgress: function(num){
        if (!num||isNaN(num)) 
            num = "-";
        this.current_song_clock.innerHTML = num;
    },
    clearPlaying: function(){
        var lis = this.container.getElementsByTagName("li");
        for (i = 0; i < lis.length; i++) {
        	lis[i].className = "song";
        }
    }
};
