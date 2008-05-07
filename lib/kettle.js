var Kettle = new Class({
	initialize: function(hexes,sigs) {
		this.hexes = hexes;
		this.ladles = {};
		this.playing = false;
		this.pageTitle = document.title;

		document.addEvent('keydown',function(event) {
			if(event.key == 'enter') this.globalToggle();
			if(event.key == 'left') this.playPrevious(this.playing ? this.playing : this.hexes[0]);
			if(event.key == 'right') this.playNext(this.playing ? this.playing : this.hexes[this.hexes.length]);
		}.bind(this));

		for(i = 0; i < hexes.length; i++) {
			this.ladles['player'+hexes[i]] = new Ladle(hexes[i],sigs[i],this);
		}
		
		getUpdate = function(typ,pr1,pr2,swf) {
			this.ladles[swf].getUpdate(typ,pr1,pr2);
		}.bind(this);
		
		$E('ul.songs').setStyle('visibility','visible');
	},
	stopAll: function(except) {
		for(var name in this.ladles) {
			if(name != ('player'+except.hex)) this.ladles[name].stop();
		}
	},
	nowPlaying: function(hex) {
		this.playing = hex;	
	},
	stoppedPlaying: function() {
		this.playing = false;
	},
	playNext: function(hex) {
		var next = this.getNext(hex,this.hexes);
		this.ladles['player'+next].play();
	},
	playPrevious: function(hex) {
		var prev = this.getPrevious(hex,this.hexes);
		this.ladles['player'+prev].play();
	},	
	getNext: function(current,arr) {
		var i = arr.indexOf(current);
		var next = i < arr.length - 1 ? i + 1 : 0;
		return arr[next];
	},
	getPrevious: function(current,arr) {
		var i = arr.indexOf(current);
		var prev = i > 0 ? i - 1 : arr.length - 1;
		return arr[prev];
	},	
	globalToggle: function() {
		if(this.playing) this.ladles['player'+this.playing].togglePlayback();
		else this.ladles['player'+this.hexes[0]].togglePlayback();
	}
});

var Ladle = new Class({
	initialize: function(hex,sig,kettle) {
		this.hex = hex;
		this.kettle = kettle;
		this.songurl = 'http://muxtape.s3.amazonaws.com/songs/'+hex+'?PLEASE=DO_NOT_STEAL_MUSIC&'+sig;
		this.player = false;
		this.startedLoading = false;
		this.clock = $E('#song'+hex+' .clock');
		this.percentage = $E('#song'+hex+' .loaded');
		this.li = $('song'+hex);
		this.is_playing = false;

		if(!navigator.userAgent.match(/iPhone|iPod/i)) {
			$E('.container').adopt(new Element('div',{'id':'embed'+hex}));
			var so = new SWFObject('/res/mediaplayer.swf','player'+hex,'0','0','8');
			so.addParam('allowscriptaccess','always');
			so.addVariable('type','mp3');
			so.addVariable('width','0');
			so.addVariable('height','0');
			so.addVariable('file',escape(this.songurl));
			so.addVariable('javascriptid','player'+hex);
			so.addVariable('enablejs','true');
			so.write('embed'+hex);
					
			if(Browser.Engine.trident) this.player = window['player'+hex];
	  		else this.player = document['player'+hex];
		}

		if(this.li) {
			this.li.addEvent('mouseover',function() {
				this.li.addClass('hover');
			}.bind(this));
			
			this.li.addEvent('mouseout',function() {
				this.li.removeClass('hover');
			}.bind(this));
			
			if(navigator.userAgent.match(/iPhone|iPod/i)) {
				this.li.addEvent('click',function() {
					window.location.href = this.songurl;
				}.bind(this));
			} else {
				this.li.addEvent('click',function(e) {
					if(e.target.tagName != 'A') this.togglePlayback();		
				}.bind(this));
			}
		}
	},
	getUpdate: function(typ,pr1,pr2) {
		switch(typ) {
			case 'time':
				var string = '';
				if(!(pr1 < 1 && !this.is_playing)) {
					var sec = pr1 % 60;
					var min = (pr1 - sec) / 60;
					var min_formatted = min ? min+':' : '';
					var sec_formatted = min ? (sec < 10 ? '0'+sec : sec) : sec;
					string = min_formatted + sec_formatted;
				}
				this.clock.setHTML(string);
			break;
			case 'state':
				if(pr1 == 2) {
					this.clock.removeClass('grey');
					this.clock.addClass('green');
				} else {
					this.clock.removeClass('green');
					this.clock.addClass('grey');
				}
				if(pr1 == 3) {
					this.stop();
					this.kettle.playNext(this.hex);
				}
			break;
			case 'load':
				if(pr1 > 0) this.startedLoading = true;
				if(!(this.startedLoading && pr1 == 0)) this.percentage.setHTML(pr1+'%');
			break;
		}
	},
	togglePlayback: function(e) {
		if(this.is_playing) this.pause();
		else this.play();
	},
	pause: function() {
		if(this.is_playing) {
			this.player.sendEvent('playpause');
			this.is_playing = false;
			document.title = this.kettle.pageTitle;
		}
	},
	play: function() {
		if(!this.is_playing) {
			if(this.clock.getHTML() == '') this.clock.setHTML('&mdash;');
			this.li.addClass('hilite');
			this.kettle.stopAll(this);
			this.player.sendEvent('playpause');
			this.is_playing = true;
			this.kettle.nowPlaying(this.hex);
			
			var name = $E('#song'+this.hex+' .name').getHTML().replace('&amp;','&');
			document.title = name.trim() + ' / ' + this.kettle.pageTitle;
		}
	},
	stop: function() {
		this.li.removeClass('hilite');		
		this.pause();
		this.player.sendEvent('stop');
		this.kettle.stoppedPlaying();
		this.clock.setHTML('');
	}
});