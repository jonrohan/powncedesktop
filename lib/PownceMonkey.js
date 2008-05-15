/**
 * @project Pownce Monkey
 * @author Jon Rohan
 * 
 */

// Set by the <version></version> in the application.xml file
var VERSION = "";

/**
 * properties is a json object that contains settings, data, urls
 */
var properties = {
	
	// urls for accessing api endpoints
    api_urls: {
        login: "http://api.pownce.com/2.1/auth/verify.json?{app_key}",
        note: "http://api.pownce.com/2.1/notes/{note_id}.json?{app_key}{show_replies}",
        note_list: "http://api.pownce.com/2.1/note_lists/{username}.json?{app_key}{limit}{page}{filter}{since_id}{type}",
        note_recipient_list: "http://api.pownce.com/2.1/notes/{note_id}/recipients.json?{app_key}{limit}{page}",
        profile: "http://api.pownce.com/2.1/users/{username}.json?{app_key}",
        fffo: "http://api.pownce.com/2.1/users/{username}/{relationship}.json?{app_key}{limit}{page}",
        send_to_list: "http://api.pownce.com/2.1/send/send_to.json?{app_key}",
        post_a_message: "http://api.pownce.com/2.1/send/message.json",
        post_a_link: "http://api.pownce.com/2.1/send/link.json",
        post_an_event: "http://api.pownce.com/2.1/send/event.json",
        post_a_file: "http://api.pownce.com/2.1/send/file.json",
        post_a_file_pro: "http://api.pownce.com/2.1/send/file.json",
        post_a_reply: "http://api.pownce.com/2.1/send/reply.json",
		update_url: "http://powncemonkey.com/release/current",
		delete_note: "http://pownce.com/ajax/delete_note/",
		mark_downloaded: "http://pownce.com/ajax/update_url_click_count/",
		add_friend: "http://pownce.com/ajax/request_friend/",
		remove_friend: "http://pownce.com/ajax/remove_friend/",
		cancel_friend: "http://pownce.com/ajax/cancel_friend/"
    },
	
	// queries for SQL Lite DB
	sql : {
		count_people : "SELECT COUNT(*) as count FROM people",
		create_table_favorites : "CREATE TABLE IF NOT EXISTS favorites (id INTEGER UNIQUE, fav_id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT, permalink TEXT, sender_username TEXT, sender_short_name TEXT, sender_photo_url TEXT, sender_id INTEGER, sender_is_pro TEXT, timestamp TEXT, stars TEXT, type TEXT, reply_to INTEGER, link_url TEXT, link_oembed_type TEXT, link_oembed_provider_name TEXT, link_oembed_html TEXT, link_oembed_author_url TEXT, link_oembed_title TEXT, link_oembed_author_name TEXT, link_oembed_url TEXT, file_type TEXT, file_url TEXT, file_aws_url TEXT, event_name TEXT, event_location TEXT, event_date TEXT)",
		create_table_people : "CREATE TABLE IF NOT EXISTS people (id INTEGER PRIMARY KEY, name TEXT, visible TEXT, status TEXT, temp_visible TEXT, username TEXT, location TEXT, medium_photo_url TEXT, age INTEGER, gender TEXT, relationship TEXT, small_photo_url TEXT, large_photo_url TEXT, is_pro TEXT, blurb TEXT, permalink TEXT, friend_count INTEGER, fan_count INTEGER, fan_of_count INTEGER, country TEXT, max_upload_mb INTEGER, first_name TEXT, smedium_photo_url TEXT, tiny_photo_url TEXT)",
		delete_all_favorites : "DELETE FROM favorites",
		delete_all_people : "DELETE FROM people",
		delete_favorite_by_id : "DELETE FROM favorites WHERE id={id}",
		delete_person_by_id : "DELETE FROM people WHERE id={id}",
		get_person_relationship : "SELECT relationship FROM people WHERE id={id}",
		insert_favorites : "INSERT INTO favorites (id, body, permalink, sender_username, sender_short_name, sender_photo_url, sender_id, sender_is_pro, timestamp, stars, type, reply_to, link_url, link_oembed_type, link_oembed_provider_name, link_oembed_html, link_oembed_author_url, link_oembed_title, link_oembed_author_name, link_oembed_url, file_type, file_url, file_aws_url, event_name, event_location, event_date ) VALUES ({id},'{body}','{permalink}','{sender_username}','{sender_short_name}','{sender_photo_url}',{sender_id},'{sender_is_pro}','{timestamp}','{stars}','{type}',{reply_to},'{link_url}','{link_oembed_type}','{link_oembed_provider_name}','{link_oembed_html}','{link_oembed_author_url}','{link_oembed_title}','{link_oembed_author_name}','{link_oembed_url}','{file_type}','{file_url}','{file_aws_url}','{event_name}','{event_location}','{event_date}')",
		insert_person : "INSERT INTO people (id, name, visible, status, temp_visible, username, location, medium_photo_url, age, gender, relationship, small_photo_url, large_photo_url, is_pro, blurb, permalink, friend_count, fan_count, fan_of_count, country, max_upload_mb, first_name, smedium_photo_url, tiny_photo_url) VALUES ({id}, '{name}', '{visible}', '{status}', '{temp_visible}', '{username}', '{location}', '{medium_photo_url}', {age}, '{gender}', '{relationship}', '{small_photo_url}', '{large_photo_url}', '{is_pro}', '{blurb}', '{permalink}', {friend_count}, {fan_count}, {fan_of_count}, '{country}', {max_upload_mb}, '{first_name}', '{smedium_photo_url}', '{tiny_photo_url}')",
		select_favorties : "SELECT * FROM favorites ORDER BY {order_by} {direction}",
		select_people : "SELECT * FROM people ORDER BY {order_by} {direction}",
		select_person_by_id : "SELECT * FROM people WHERE id={id}",
		set_person_relationship : "UPDATE people SET relationship={relationship} WHERE id={id}",
		set_all_relationships : "UPDATE people SET relationship={relationship}"
	},
	
	// Contains the user info and profile from website
    user: {
        username: "",
        password: "",
        profile: {}
    },
	
	// Interval objects so they can be canceled and reinitiated
	interval: {
		getnotes: null,
		getfriends: null,
		getfanof: null,
		getreplies: null,
		newnotes: null
	},
	
	// Application settings
    settings: {
        minimize_to_tray: true,
        auto_login: false,
        max_notes: 20,
        remember_me: false,
        notes_collapsible: false,
        play_sound: true,
        friend_request_alert: true,
        font_size: 2,
        temp_font_size: 2,
        download_theme: true,
		repeat_song: false,
		shuffle_song: false,
		hide_offline: true,
		hide_list: true,
		hide_toolbar: false,
		width: 370,
		height: 400,
		x: 200,
		y: 200,
		transparency: .95,
		toolbar_icon_text : true
    },
    ui: {
        max: false,
        min: false,
        openWindow: null,
        aboutWindow: null,
        defaultSendto: {
			id: "public",
			fullname: "the public"
		},
        currentNoteDetail: null,
        current_mp3player: null,
        latestNoteId: null,
        is_win: false,
        is_osx: false,
        secondary_icon: [],
        primary_icon: [],
        link_color: "#2E8696",
        loading: true,
		has_next_notes_page: true,
		upload_file: null,
		added_oembed_data: false,
		logged_in: false,
		current_scroll_note: 0,
		current_view: ""
    },
	pages: {
		currentFriendPage: 0,
        currentFanofPage: 0,
        currentNotesPage: 0
	},
    oauth: {
        APP_KEY: "44ko89t89i4b9t15ull3cpgp5iu5387u",
        SECRET: "dvt915wf5ye07922o651a4090tk3624g",
        request_token_url: "http://api.pownce.com/2.1/oauth/request_token",
        user_authorization_url: "http://api.pownce.com/2.1/oauth/authorize",
        access_token_url: "http://api.pownce.com/2.1/oauth/access_token",
        signature_method: "HMAC-SHA1",
        token_secret: "",
        token: ""
    },
    json: {
        people: [],
        fan_of: [],
        send_to: {},
        notes: [],
		online_peeps: {},
        online_users: {
			count: 0
		},
        added_users: {
			count: 0
		},
		templates: [],
		fullname: {}
    },
    filter: {
		peoplestr: "",
		sendtostr: "",
		keywords: [],
        type: {
            message: true,
            link: true,
            file: true,
            event: true,
            privatenote: true,
            publicnote: true,
			reply: true
        },
        users: {
            count: 0
        },
        repliers: {
            count: 0
        }
    },
	menu: {
		template : null,
		main : null
	}
};

var PownceMonkey = new Class.create();
PownceMonkey.prototype = {
	
	// Prototype function that is run upon initialization i.e. new PownceMonkey
    initialize: function(options) {
		
		// get VERSION from application.xml
		VERSION = (new DOMParser().parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml")).getElementsByTagName('application')[0].getElementsByTagName("version")[0].firstChild.data;
		
		// If application supports system tray 
        if (air.NativeApplication.supportsSystemTrayIcon) {
			// it is windows
            properties.ui.is_win = true;
			this.ui.configureForOS("win-os");
        }
		 
		// else if the application supports a doc icon
		else if (air.NativeApplication.supportsDockIcon) {
			// it is OSX
            properties.ui.is_osx = true;
            this.ui.configureForOS("mac-os");
        }
		
		// get saved properties
        this.loadProperties();
		
		// refresh log file
		this.deleteLogfile();
		
		// check for Pownce Monkey Update
        this.checkForUpdate();
		
		// Initialize the UI
        this.uiInitialize();
		
        if (properties.settings.remember_me) {
            $('username').value = properties.user.username;
            $('password').value = properties.user.password;
            $('remember_me').checked = properties.settings.remember_me;
        }
		
        if (properties.settings.auto_login) {
            $('auto_login').checked = properties.settings.auto_login;
            $('login-button').style.display = "none";
            $('login-loading').style.display = "block";
            $('username').disabled = true;
            $('password').disabled = true;
            $('remember_me').disabled = true;
            $('auto_login').disabled = true;
            this.authHTTPBasic();
        }
    },
	
    /** Sort Functions **/
    sortNotes: function(a, b){
        return (b.id - a.id);
    },
    sortTemplates: function(a, b){
	    var x = a.name.toLowerCase();
	    var y = b.name.toLowerCase();
	    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    },
    sortPeople: function(a, b){
	    var x = a.short_name.toLowerCase();
	    var y = b.short_name.toLowerCase();
	    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    },
    
    /** API Functions **/
	authHTTPBasic: function() {
		this.ui.systemMessage("Authorizing");
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Authorizing error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
			else if (t.responseText.match("key\": \"" + properties.oauth.APP_KEY + "\"")) {
				var resp = eval('(' + t.responseText + ')')
            	oInst.ui.systemMessage("Authorization successfull");
				properties.user.username = $('username').value;
	            properties.user.password = $('password').value;
	            properties.settings.remember_me = $('remember_me').checked;
	            properties.settings.auto_login = $('auto_login').checked;
	            $('login-error').style.display = "none";
				oInst.getProfile();
	            
	            if (properties.settings.download_theme) 
	                oInst.getUserTheme();
	            else 
	                oInst.getNotes();
				if (properties.interval.getnotes) 
						clearInterval(properties.interval.getnotes);
				properties.interval.getnotes = setInterval(function(){
					chat.getNotes();
				}, 600000);
            }
			else if(t.responseText.match("status_code\": 401")) {
				oInst.ui.systemMessage("Authorizing error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Username and password do not match.",5);
				oInst.doLogout();
				return;
			}
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage("Authorizing failure: " + t.responseText,6);
			oInst.ui.systemMessage("Ack! Server error, try again later.",5);
			oInst.doLogout();
			return;
		};
        var username = $('username').value;
        var password = $('password').value;
		var url = PownceMonkey.prepareAPIURL(properties.api_urls.login);
		air.trace(url);
		new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(username + ":" + password)],
            method: 'get'
        });
	},
	oauthAccessToken: function(){
		this.ui.systemMessage("Getting OAuth Access Token");
        var oInst = this;
        var successCallback = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("OAuth Access Token error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
            oInst.ui.systemMessage(t.responseText,6);
			var resp = t.responseText;
            var params = resp.split("&");
            properties.oauth.access_token_secret = params[0].split("=")[1];
            properties.oauth.access_token = params[1].split("=")[1];
			oInst.ui.systemMessage("Got OAuth Access Token");
            oInst.oauthVerify();
        };
		var failureCallback = function(t) {
			oInst.ui.systemMessage("failure: " + t.responseText,6);
			$('login-error').innerHTML = "Ack! Server error, try again later.";
			$('login-error').style.display = "block";
			oInst.doLogout();
			return;
		};
        var url = OAuth.getUrl("get", properties.oauth.access_token_url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.token, properties.oauth.token_secret, []);
		air.trace(url);
        var postVars = url.split("?")[1];
        new Ajax.Request(url, {
            onSuccess: successCallback,
			onFailure: failureCallback,
            //postBody: postVars,
            method: 'get'
        });
    },
   	oauthAuthorize: function(){
		this.ui.systemMessage("OAuth Authorizing");
        var oInst = this;
        var successCallback = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("OAuth Authorizing error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
			else if (t.responseText.match("You have successfully logged in. You may now return to Pownce Monkey")) {
            	oInst.ui.systemMessage("OAuth Authorization successfull");
                oInst.oauthAccessToken();
            }
			else if(t.responseText.match("Error: Username and password do not match.")) {
				oInst.ui.systemMessage("OAuth Authorizing error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Username and password do not match.",5);
				oInst.doLogout();
				return;
			}
			else {
            	oInst.ui.systemMessage("OAuth Authorization successfull");
				if(oInst.ui.systemMessage("You must Authorize Pownce Monkey. Once authorized press OK to continue.",3))
					oInst.oauthAccessToken();
			}
        };
		var failureCallback = function(t) {
			oInst.ui.systemMessage("failure: " + t.responseText,6);
			$('login-error').innerHTML = "Ack! Server error, try again later.";
			$('login-error').style.display = "block";
			oInst.doLogout();
			return;
		};
        var username = $('username').value;
        var password = $('password').value;
        var url = OAuth.getUrl("get", properties.oauth.user_authorization_url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.token, properties.oauth.token_secret, [["username", username], ["password", password]]);
        PownceMonkey.doNavigateToURL(url);
		//var postVars = url.split("?")[1];
		new Ajax.Request(url, {
            onSuccess: successCallback,
			onFailure: failureCallback,
            //postBody: postVars,
            method: 'get'
        });
    },
    oauthInit: function(){
        this.ui.systemMessage("OAuth Initializing");
		var oInst = this;
        var successCallback = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("OAuth Initializing error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
            oInst.ui.systemMessage("OAuth Initialized");
			var resp = t.responseText;
            var params = resp.split("&");
            properties.oauth.token_secret = params[0].split("=")[1];
            properties.oauth.token = params[1].split("=")[1];
            oInst.oauthAuthorize();
        };
		var failureCallback = function(t) {
			oInst.ui.systemMessage("OAuth Initializing error: " + t.responseText,6);
			oInst.ui.systemMessage("Ack! Server error, try again later.",5);
			oInst.doLogout();
			return false;
		};
        var url = OAuth.getUrl("get", properties.oauth.request_token_url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.token, properties.oauth.token_secret, []);
        var postVars = url.split("?")[1];
        new Ajax.Request(url, {
            onSuccess: successCallback,
            onFailure: failureCallback,
            //postBody: postVars,
            method: 'get'
        });
    },
    oauthVerify: function(){
		this.ui.systemMessage("OAuth Verifing");
        var oInst = this;
        var successCallback = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("OAuth Verify error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
			oInst.ui.systemMessage(t.responseText,6);
            var resp = eval('(' + t.responseText + ')');
            if (resp.error) {
				return;
			}
			properties.user.username = $('username').value;
            properties.user.password = $('password').value;
            properties.settings.remember_me = $('remember_me').checked;
            properties.settings.auto_login = $('auto_login').checked;
            $('login-error').style.display = "none";
			oInst.ui.systemMessage("OAuth Verified");
            oInst.getProfile();
            
            if (properties.settings.download_theme) 
                oInst.getUserTheme();
            else 
                oInst.getNotes();
			if (properties.interval.getnotes) 
						clearInterval(properties.interval.getnotes);
				properties.interval.getnotes = setInterval(oInst.getNotes, 300000);
        };
		var failureCallback = function(t) {
			oInst.ui.systemMessage("failure: " + t.responseText,6);
			$('login-error').innerHTML = "Ack! Server error, try again later.";
			$('login-error').style.display = "block";
			oInst.doLogout();
			return;
		};
        var url = OAuth.getUrl("get", "http://api.pownce.com/auth/verify.json", properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, []);
        new Ajax.Request(url, {
            onSuccess: successCallback,
			onFailure: failureCallback,
            method: 'get'
        });
    },
    checkForUpdate: function(){
		this.ui.systemMessage("Checking for update");
        var oInst = this;
        var handlerFunc = function(t){
            var latest = t.responseText;
            if (latest > VERSION) {
                chat.getNewVersion(latest);
            }
			else {
				oInst.ui.systemMessage("You have the latest version " + VERSION);
			}
        };
		
		var errFunc = function(t) {
			oInst.ui.systemMessage("Check for update error: " + t.responseText,6);
			return;
		};
		
        new Ajax.Request("http://powncemonkey.com/release/current", {
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
	deleteLogfile: function() {
		try {
			var file = air.File.applicationStorageDirectory.resolvePath("pm.log");
			file.deleteFile();
		}
		catch(e) {
			this.ui.systemMessage("trycatch error: " + e.message,6);
		}
	},
    getFanof : function(){
		this.ui.systemMessage("Getting fan of");
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get FanOf error: " + t.responseText,6);
				clearInterval(properties.interval.getfanof);
				return false;
			}
            var fan_of = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage("Fan of received");
            for (var i = 0; i < fan_of.fan_of.users.length; i++) {
				fan_of.fan_of.users[i].relationship = "fanof";
				if(properties.settings.hide_offline)
					fan_of.fan_of.users[i].visible = false;
				else
					fan_of.fan_of.users[i].visible = false;
				fan_of.fan_of.users[i].status = "offline";
				oInst.addPersonToDB(fan_of.fan_of.users[i]);
            }
			oInst.loadPeople();
            if (!fan_of.fan_of.has_next_page) {
                clearInterval(properties.interval.getfanof);
                return;
            }
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get Fan of failure: " + t.responseText,6);
			return;
        };
        var url = PownceMonkey.prepareAPIURL(properties.api_urls.fffo, {
            relationship: "fan_of",
			limit: 100,
			page: properties.pages.currentFanofPage
        });
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        	method: "get"
        });
		
        properties.pages.currentFanofPage++;
    },
    getFriends : function(){
		this.ui.systemMessage("Getting friends");
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get Friends error: " + t.responseText,6);
				clearInterval(properties.interval.getfriends);
				return false;
			}
            var friends = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage("Friends received");
            for (var i = 0; i < friends.friends.users.length; i++) {
				friends.friends.users[i].relationship = "friend";
				if(properties.settings.hide_offline)
					friends.friends.users[i].visible = false;
				else
					friends.friends.users[i].visible = false;
				friends.friends.users[i].status = "offline";
				oInst.addPersonToDB(friends.friends.users[i]);
            }
			oInst.loadPeople();
            if (!friends.friends.has_next_page) {
				clearInterval(properties.interval.getfriends);
				properties.pages.currentFanofPage = 0;
                if(properties.interval.getfanof)
					clearInterval(properties.interval.getfanof);
				properties.interval.getfanof = setInterval(function(){
					chat.getFanof();
				}, 3000);
               return;
            }
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get Friends failure: " + t.responseText,6);
			clearInterval(properties.interval.getfriends);
			return false;
        };
        var url = PownceMonkey.prepareAPIURL(properties.api_urls.fffo, {
            relationship: "friends",
			limit: 100,
			page: properties.pages.currentFriendPage
        });
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        	method: "get"
        });
		properties.pages.currentFriendPage++;
    },
    getLatestNotes : function() {
		this.ui.systemMessage("Checking for new notes");
        var oInst = this;
        
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get Latest Notes error: " + t.responseText,6);
				clearInterval(properties.interval.newnotes);
                oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
            var response = t.responseText;
			response = response.replace(/\\u00/gim, "\\\\u00");
            var notes = eval("(" + response + ")");
			if (notes.notes.length != 0&&properties.pages.currentNotesPage==0) {
                if (properties.settings.play_sound) {
                    oInst.doPlayEventSound();
                }
                oInst.ui.systemMessage(notes.notes.length + " new note" + ((notes.notes.length > 1) ? "s" : ""));
                oInst.ui.notify();
                var n = properties.json.notes.length;
				for (var i = 0; i < notes.notes.length; i++) {
					properties.json.notes[n] = notes.notes[i];
					n++;
				}
                properties.json.notes.sort(oInst.sortNotes);
                oInst.loadNotes();
                oInst.loadPeople();
           }
			else {
				oInst.ui.systemMessage("No new notes");
			}
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get Latest Notes failure: " + t.responseText,6);
			return;
        };
		var options = {};
		options.filter = "all";
		options.limit = properties.settings.max_notes;
		options.since_id = properties.ui.latestNoteId;
        var url = PownceMonkey.prepareAPIURL(properties.api_urls.note_list,options);
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        	method: "get"
        });
    },
    getNote : function(id) {
		if(!id)
			id = properties.ui.currentNoteDetail;
		var oInst = this;
		var note = this.getNoteById(id);
		this.ui.systemMessage("Getting note");
        var handlerFunc = function(t) {
            var response = t.responseText;
			response = response.replace(/\\u00/gim, "\\\\u00");
            var rnote = eval("(" + response + ")");
			oInst.ui.clearReply();
        	oInst.ui.systemMessage("Replies received");
			if (note) {
				note.replies = rnote.replies;
				note.stars = rnote.stars;
				note.num_replies = rnote.num_replies
	            for (i = 0; i < $("note_" + note.id).getElementsByTagName("div").length; i++) {
	                if ($("note_" + note.id).getElementsByTagName("div")[i].className == "bottomdetails") {
	                    $("note_" + note.id).getElementsByTagName("div")[i].getElementsByTagName("a")[0].innerHTML = note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies");
	                    break;
	                }
	            }
			} else {
				note = rnote;
			}
			if (note.num_replies == 0) {
				$('reply-notes').innerHTML = "<li class='nexpanded'><div class='note reply'><a class='imglnk' href='#'><img src='skin/default/images/ackbar.gif'/></a><div class='details'>Reply by Admiral A.</div><p>Ack! No replies yet.</p></div></li>";
				oInst.ui.hideRepliersList();
			}
			oInst.uiSetNoteDetail(note);
            oInst.loadReplies();
        };
		
        var options = {};
		options.note_id = id;
		options.show_replies = true;
		var url = PownceMonkey.prepareAPIURL(properties.api_urls.note,options);
		var errFunc = function(t) {
			oInst.ui.systemMessage("get note detail failure: " + t.responseText,6);
			return;
		};

        new Ajax.Request(url, {
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
	},
	getNotes : function(){
		this.ui.systemMessage("Getting notes");
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get Notes error: " + t.responseText,6);
				clearInterval(properties.interval.getnotes);
                oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
			var response = t.responseText;
			air.trace(response);
			response = response.replace(/\\u00/gim, "\\\\u00");
            var notes = eval("(" + response + ")");
			oInst.ui.systemMessage("Notes received");
			oInst.getSendTo();
            properties.json.notes = notes.notes;
			properties.ui.has_next_notes_page = notes.notes.has_next_page;
			var prof_count = properties.user.profile.friend_count + properties.user.profile.fan_of_count;
	        if(oInst.getFriendCount()!=prof_count) {
				oInst.deleteAllPeople();
				properties.pages.currentFriendPage = 0;
                oInst.getFriends();
				if(properties.interval.getfriends)
					clearInterval(properties.interval.getfriends);
				properties.interval.getfriends = setInterval(function(){
					chat.getFriends();
				}, 3000);
			} else {
                oInst.loadPeople();
			}
			oInst.uiChangeView("notes");
			if(properties.interval.newnotes)
				clearInterval(properties.interval.newnotes);
			properties.interval.newnotes = setInterval(function(){
				chat.getLatestNotes();
			}, 60000);
			oInst.loadNotes();
			oInst.addMenuEvents();
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get Notes failure: " + t.responseText,6);
			clearInterval(properties.interval.getnotes);
            oInst.ui.systemMessage("Ack! Server error, try again later.",5);
			oInst.doLogout();
			return;
        };
		var options = {};
		options.limit = properties.settings.max_notes;
		options.page = properties.pages.currentNotesPage;
        var url = PownceMonkey.prepareAPIURL(properties.api_urls.note_list,options);
		//url = OAuth.getUrl("get", url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, [["limit", properties.settings.max_notes], ["page", properties.pages.currentNotesPage]]);
		air.trace(url);
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        	method: "get"
        });
    },
	getProfile: function(){
		this.ui.systemMessage("Getting User Profile");
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get Profile error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
            var user = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage("Profile received");
            properties.user.profile = user;
            if (user.friend_request_count > 0) {
				oInst.ui.alertNewFriendRequest();
            }
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get Profile failure: " + t.responseText,6);
			return;
        };
        var url = PownceMonkey.prepareAPIURL(properties.api_urls.profile);
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        	method: "get"
        });
    },
    getSendTo : function(){
		this.ui.systemMessage("Getting send to list");
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get SendTo error: " + t.responseText,6);
				oInst.ui.systemMessage("Ack! Server error, try again later.",5);
				oInst.doLogout();
				return false;
			}
            var sets = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage("Send to list received");
            properties.json.send_to = sets;
            oInst.loadSendToList();
			$('send-to-id').value = properties.ui.defaultSendto.id;
			$('send-to-text').value = properties.ui.defaultSendto.fullname;
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get Send to failure: " + t.responseText,6);
			return;
        };
        var url = PownceMonkey.prepareAPIURL(properties.api_urls.send_to_list);
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        	method: "get"
        });
    },
    getUser: function(username,limit) {
		this.ui.systemMessage("Getting User Profile");
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage("Get Profile error: " + t.responseText,6);
				return false;
			}
			air.trace(t.responseText);
            var resp = eval("(" + t.responseText + ")");
			if (limit != 0) {
				if (resp.notes.length == 0) {
					oInst.getUser(username,0);
				} else {
					var user = resp.notes[0].sender;
					user.last_note_id = resp.notes[0].id;
					user.last_note_body = resp.notes[0].body;
					user.last_note_type = resp.notes[0].type;
					oInst.ui.systemMessage("Profile received");
					oInst.uiChangeView("profile",user);
				}
			} else {
				oInst.uiChangeView("profile",resp);
			}
        };
        var errFunc = function(t){
			oInst.ui.systemMessage("Get User failure: " + t.responseText,6);
			return;
        };
		var url = "";
		if(limit==0)
			url = PownceMonkey.prepareAPIURL("http://api.pownce.com/2.0/users/" + username + ".json?{app_key}");
        else
			url = PownceMonkey.prepareAPIURL("http://api.pownce.com/2.1/note_lists/" + username + ".json?{app_key}&limit=" + limit);
		var headers = [];
		if(username!=properties.user.profile.username)
			headers = ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)];
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: headers,
        	method: "get"
        });
	},
	
	/** DB Functions **/	
	addFavoriteToDB: function(note) {
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
        	
            var writeFiles = new air.SQLStatement();
            writeFiles.sqlConnection = conn;
            
            writeFiles.text = properties.sql.create_table_favorites;
            
            try {
                writeFiles.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
            }
            
			note = this.prepareNoteForDB(note);
			
            writeFiles.text = this.prepareSQL(properties.sql.insert_favorites,{
				id : note.id,
				body : note.body,
				permalink : note.permalink,
				sender_username : note.sender.username,
				sender_short_name : note.sender.short_name,
				sender_photo_url : note.sender.profile_photo_urls.smedium_photo_url,
				sender_id : note.sender.id,
				sender_is_pro : note.sender.is_pro,
				timestamp : note.timestamp,
				stars : note.stars,
				type : note.type,
				reply_to : note.reply_to,
				link_url : note.link.url,
				link_oembed_type : note.link.oembed.type,
				link_oembed_provider_name : note.link.oembed.provider_name,
				link_oembed_html : note.link.oembed.html,
				link_oembed_author_url : note.link.oembed.author_url,
				link_oembed_title : note.link.oembed.title,
				link_oembed_author_name : note.link.oembed.author_name,
				link_oembed_url : note.link.oembed.url,
				file_type : note.file.type,
				file_url : note.file.url,
				file_aws_url : note.file.aws_url,
				event_name : note.event.name,
				event_location : note.event.location,
				event_date : note.event.date
			});
			
            try {
                // execute the statement
                writeFiles.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
            }
			
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
			
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
        }
	},
	addPersonToDB: function(person) {
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
        	
            var writeFiles = new air.SQLStatement();
            writeFiles.sqlConnection = conn;
            
            writeFiles.text = properties.sql.create_table_people;
            air.trace("Create Table " + properties.sql.create_table_people);
            try {
                writeFiles.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
            }
            
			person = this.preparePersonForDB(person);
			
            var sql = this.prepareSQL(properties.sql.insert_person,{
				id : person.id,
				name : person.name,
				visible : person.visible,
				status : person.status,
				temp_visible : person.temp_visible,
				username : person.username,
				location : person.location,
				medium_photo_url : person.profile_photo_urls.medium_photo_url,
				age : person.age,
				gender : person.gender,
				relationship : person.relationship,
				small_photo_url : person.profile_photo_urls.small_photo_url,
				large_photo_url : person.profile_photo_urls.large_photo_url,
				is_pro : person.is_pro,
				blurb : person.blurb,
				permalink : person.permalink,
				friend_count : person.friend_count,
				fan_count : person.fan_count,
				fan_of_count : person.fan_of_count,
				country : person.country,
				max_upload_mb : person.max_upload_mb,
				first_name : person.first_name,
				smedium_photo_url : person.profile_photo_urls.smedium_photo_url,
				tiny_photo_url : person.profile_photo_urls.tiny_photo_url
			});
			air.trace("Add Person " + sql);
			writeFiles.text = sql;
            try {
                // execute the statement
                writeFiles.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
            }
			
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
			
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
        }
	},
	deleteAllFavorites: function() {
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = properties.sql.delete_all_favorites;
            
            // This try..catch block is fleshed out in
            // a subsequent code listing
            try {
                selectStmt.execute();
                // accessing the data is shown in a subsequent code listing

            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return false;
        }
		this.loadFavorites();
		return true;
	},
	deleteAllPeople: function() {
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = properties.sql.delete_all_people;
            
            // This try..catch block is fleshed out in
            // a subsequent code listing
            try {
                selectStmt.execute();
                // accessing the data is shown in a subsequent code listing

            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return false;
        }
		return true;
	},
	deleteFavorite: function(id) {
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.delete_favorite_by_id,{
				id : id
			});
			
            try {
                selectStmt.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return false;
        }
		this.loadFavorites();
		return true;
	},
	getDBConnection: function() {
        var conn = new air.SQLConnection();
        var dbFile = air.File.applicationStorageDirectory.resolvePath("pm.db");
        try {
        // open the database
        conn.open(dbFile, air.SQLMode.UPDATE);
        }
		catch(e) {
            this.ui.systemMessage(e.message,6);
            var file = air.File.applicationStorageDirectory;
            file = file.resolvePath("pm.db");
            try {
	            var stream = new air.FileStream();
	            stream.open(file, air.FileMode.WRITE);
	            stream.close();
                conn.open(dbFile, air.SQLMode.UPDATE);
            } 
            catch (e) {
                this.ui.systemMessage(e.message,6);
				return null;
            }
			$('favorites').innerHTML = "Sorry no favorite notes yet.";
		}
		return conn;
	},
	getFriendCount : function() {
		var count = 0;
        var conn = this.getDBConnection();
		if(!conn)
			return count;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = properties.sql.count_people;
			
            try {
                selectStmt.execute();
				var result = selectStmt.getResult();
				if(!result.data||result.data.length==0) {
					conn.rollback();
					return count;
				}
				count = result.data[0].count;
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return count;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return count;
        }
		return count;
	},
	loadFavorites: function() {
		this.ui.systemMessage("Loading Favorites From DB ",6);
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.select_favorties,{
				order_by : "fav_id",
				direction : "DESC"
			});
            
            // This try..catch block is fleshed out in
            // a subsequent code listing
            try {
                selectStmt.execute();
                // accessing the data is shown in a subsequent code listing
                var result = selectStmt.getResult();
				if(!result.data||result.data.length==0) {
					$('favorites').innerHTML = "Sorry no favorite notes yet.";
					conn.rollback();
					return false;
				}
				$('favorites').innerHTML = "";
				for(i=0 ; i < result.data.length;i++) {
					var note = result.data[i];
					note.body = note.body.replace(/&#39;/gim,"'");
					note.body = note.body.replace(/\n\n/gim,"\n");
					if(note.type=="link") {
						note.link = {
							url : note.link_url
						};
						if(note.link_oembed_type!="") {
							note.link.oembed = {
								"url" : note.link_oembed_url,
			                    "title": note.link_oembed_title.replace(/&#39;/gim,"'"), 
			                    "html": note.link_oembed_html, 
			                    "author_name": note.link_oembed_author_name.replace(/&#39;/gim,"'"), 
			                    "author_url": note.link_oembed_author_url, 
			                    "provider_name": note.link_oembed_provider_name.replace(/&#39;/gim,"'"), 
			                    "type": note.link_oembed_type
							};
						}
					}
					if(note.type=="file") {
						note.file = {
							"type" : note.file_type,
							"url" : [note.file_url],
							"aws_url" : [note.file_url]
						};
					}
					if(note.type=="event") {
						note.event = {
							"name" : note.event_name.replace(/&#39;/gim,"'"),
							"location" : note.event_location.replace(/&#39;/gim,"'"),
							"date" : note.event_date
						};
					}
					$('favorites').appendChild(this.uiCreateFavorite(note));
				}
            } 
            catch (error) {
				this.ui.systemMessage("trycatch error: " + error.message,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            // rollback the transaction
            conn.rollback();
			return false;
        }
		this.ui.systemMessage("Done Loading Favorites From DB ",6);
		return true;
	},
	loadPeople: function() {
		this.ui.systemMessage("Loading People From DB ",6);
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.select_people,{
				order_by : "name",
				direction : "DESC"
			});
            
            // This try..catch block is fleshed out in
            // a subsequent code listing
            try {
                selectStmt.execute();
                // accessing the data is shown in a subsequent code listing
                var result = selectStmt.getResult();
				if(!result.data||result.data.length==0) {
					$('favorites').innerHTML = "Sorry no favorite notes yet.";
					conn.rollback();
					return false;
				}
				$('people').innerHTML = "";
				for(i=0 ; i < result.data.length;i++) {
					var user = result.data[i];
					user.profile_photo_urls = {
	                    smedium_photo_url: user.smedium_photo_url, 
	                    small_photo_url: user.small_photo_url, 
	                    tiny_photo_url: user.tiny_photo_url, 
	                    medium_photo_url: user.medium_photo_url, 
	                    large_photo_url: user.large_photo_url
					};
					var fullname = user.name;
					if(this.getUserFullName(user.id)) 
						fullname = this.getUserFullName(user.id);
					user.name = fullname;
					if(properties.json.online_peeps[user.id]) {
						user.visible = properties.json.online_peeps[user.id].visible;
						user.status = properties.json.online_peeps[user.id].status;
					}
					user.temp_visible = false;
					if (properties.filter.peoplestr != "" && properties.filter.peoplestr.length > 1) {
						var fullname_match = (fullname && fullname.toLowerCase().match(properties.filter.peoplestr.toLowerCase()))?true:false;
						var shortname_match = (user.name.toLowerCase().match(properties.filter.peoplestr.toLowerCase()))?true:false;
						var username_match = (user.username.toLowerCase().match(properties.filter.peoplestr.toLowerCase()))?true:false;
						var location_match = (user.location && user.location.toLowerCase().match(properties.filter.peoplestr.toLowerCase()))?true:false;
						if ( fullname_match || shortname_match || username_match || location_match ) {
							user.temp_visible = true;
							user.visible = false;
						} else {
							user.temp_visible = false;
							user.visible = false;
						}
					}
					if ((user.visible==true||user.temp_visible==true)) {
						this.ui.addPerson(this.ui.createPerson(user));
					}
				}
            } 
            catch (error) {
				this.ui.systemMessage("trycatch error: " + error.message,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            // rollback the transaction
            conn.rollback();
			return false;
        }
		this.ui.systemMessage("Done Loading People From DB ",6);
		return true;
	},
	prepareNoteForDB: function(note) {
		if(note.link) {
			if(note.link.oembed) {
				if(!note.link.oembed.url)
					note.link.oembed.url = "";
				if(!note.link.oembed.title)
					note.link.oembed.title = "";
				if(!note.link.oembed.html)
					note.link.oembed.html = "";
				if(!note.link.oembed.author_name)
					note.link.oembed.author_name = "";
				if(!note.link.oembed.author_url)
					note.link.oembed.author_url = "";
				if(!note.link.oembed.provider_name)
					note.link.oembed.provider_name = "";
				if(!note.link.oembed.type)
					note.link.oembed.type = "";
				note.link.oembed.title = note.link.oembed.title.replace(/'/gim,"&#39;");
				note.link.oembed.title = note.link.oembed.title.replace(/{/gim,"&#123;");
				note.link.oembed.provider_name = note.link.oembed.provider_name.replace(/'/gim,"&#39;");
				note.link.oembed.provider_name = note.link.oembed.provider_name.replace(/{/gim,"&#123;");
				note.link.oembed.author_name = note.link.oembed.author_name.replace(/'/gim,"&#39;");
				note.link.oembed.author_name = note.link.oembed.author_name.replace(/{/gim,"&#123;");
			}
			else {
				note.link.oembed = {
					"url" : "",
                    "title": "", 
                    "html": "", 
                    "author_name": "", 
                    "author_url": "", 
                    "provider_name": "", 
                    "type": ""
				};
			}
		}
		else {
			note.link = {
                "url": "", 
                "oembed": {
					"url" : "",
                    "title": "", 
                    "html": "", 
                    "author_name": "", 
                    "author_url": "", 
                    "provider_name": "", 
                    "type": ""
                }
			};
			
		}
		
		if(note.file) {
			if(!note.file.type)
				note.file.type = "";
			if(!note.file.url)
				note.file.url = "";
			else
				note.file.url = note.file.url[0];
			if(!note.file.aws_url)
				note.file.aws_url = "";
			else
				note.file.aws_url = note.file.aws_url[0];
		}
		else {
			note.file = {
				"type" : "",
				"url" : "",
				"aws_url" : ""
			};
		}
		
		if(note.event) {
			if(!note.event.name)
				note.event.name = "";
			if(!note.event.location)
				note.event.location = "";
			if(!note.event.date)
				note.event.date = "";
			note.event.name = note.event.name.replace(/'/gim,"&#39;");
			note.event.name = note.event.name.replace(/{/gim,"&#123;");
			note.event.location = note.event.location.replace(/'/gim,"&#39;");
			note.event.location = note.event.location.replace(/{/gim,"&#123;");
		}
		else {
			note.event = {
				"name" : "",
				"location" : "",
				"date" : ""
			};
		}
		
		if(!note.reply_to)
			note.reply_to = "0";
		
		note.body = note.body.replace(/'/gim,"&#39;");
		note.body = note.body.replace(/{/gim,"&#123;");
		return note;
	},
	preparePersonForDB: function(person) {
		if(!person.visible)
			person.visible = "false";
		if(!person.temp_visible)
			person.temp_visible = "false";
		if(!person.status)
			person.status = "offline";
		if(!person.relationship)
			person.relationship = "none";
		if(!person.age)
			person.age = null;
		if(!person.friend_count)
			person.friend_count = null;
		if(!person.fan_count)
			person.fan_count = null;
		if(!person.fan_of_count)
			person.fan_of_count = null;
		if(!person.country)
			person.country = "";
		person.name = person.short_name;
		person.blurb = person.blurb.replace(/'/gim,"&#39;");
		return person;
	},
	prepareSQL: function(query, tokens) {
		for( var token in tokens) {
	        query = query.replace("{" + token + "}", tokens[token]);
		}
		return query;
	},
	setAllRelationships: function(rel) {
       var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.set_all_relationships,{
				relationship : rel
			});
			
            try {
                selectStmt.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return false;
        }
		return true;
	},
	setPersonRelationship: function(id,rel) {
       var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.set_person_relationship,{
				id : id,
				relationship : rel
			});
			
            try {
                selectStmt.execute();
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return false;
        }
		return true;
	},
	
	/** Event Handlers **/
    doAddFriend: function(username){
		this.ui.systemMessage("Sending Friend Request");
        $('request-friend').style.display = "none";
		var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage(t.responseText,6);
			oInst.ui.systemMessage("Friend Request Sent");
            oInst.getFanof();
			if (properties.interval.getfanof) 
					clearInterval(properties.interval.getfanof);
			properties.interval.getfanof = setInterval(function(){
				chat.getFanof();
			}, 3000);
            $('request-img').innerHTML = "";
			$('request-confirm').innerHTML = "";
			$('request-message').value = "";
			$('request-username').value = "";
        };
        var message = $('request-message').value;
        params = "action=ADD_FRIEND&friend=" + username + "&message=" + message;
		var errFunc = function(t) {
			oInst.ui.systemMessage("Add friend failure: " + t.responseText,6);
			return;
		};
		
        new Ajax.Request(properties.api_urls.add_friend, {
            asynchronous: true,
            parameters: params,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    doRemoveFriend: function(username){
		conf = this.ui.systemMessage("Are you sure you want to unfriend "+username+"? This will remove all their notes from your page as well.",3);
		if (conf) {
			this.ui.systemMessage("Removing Friend");
			$('request-friend').style.display = "none";
			var oInst = this;
			var handlerFunc = function(t){
				oInst.ui.systemMessage(t.responseText,6);
				oInst.ui.systemMessage("Friend Removed");
		        $('notes').innerHTML = "";
				$('people').innerHTML = "";
		        
				// Reset JSON
		        properties.json.send_to = {};
		        properties.json.online_users = {};
		        properties.user.profile = {};
		        properties.json.notes = [];
		        properties.json.people = [];
				
				// Reset Pages
		        properties.pages.currentFriendPage = 0;
		        properties.pages.currentFanofPage = 0;
		        properties.pages.currentNotesPage = 0;
                properties.ui.loading = true;
                oInst.getNotes();
				//properties.pages.currentCatalogPage = 0;
				//oInst.getPhotos();
               	//properties.interval.getphotos = setInterval(oInst.getPhotos, 4000);
			};
			params = "action=REMOVE_FRIEND&friend=" + username;
			var errFunc = function(t) {
				oInst.ui.systemMessage("Remove friend failure: " + t.responseText,6);
				return;
			};
		
			
			new Ajax.Request(properties.api_urls.remove_friend, {
				asynchronous: true,
				parameters: params,
				requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
	            onSuccess: handlerFunc,
	            onFailure: errFunc
			});
		}
    },
	doBrowseForFile: function() {
		properties.ui.upload_file.browseForOpen( 'Select File' );
	},
    doCancelRequest: function(username){
		conf = this.ui.systemMessage("Are you sure you want to unfriend "+username+"? This will remove all their notes from your page as well.",3);
		if (conf) {
			this.ui.systemMessage("Removing Friend");
			$('request-friend').style.display = "none";
			var oInst = this;
			var handlerFunc = function(t){
				oInst.ui.systemMessage(t.responseText,6);
				oInst.ui.systemMessage("Friend Removed");
		        $('people').innerHTML = "";
		        $('notes').innerHTML = "";
				
				// Reset JSON
		        properties.json.send_to = {};
		        properties.json.online_users = {};
		        properties.user.profile = {};
		        properties.json.notes = [];
		        properties.json.people = [];
				
				// Reset Pages
		        properties.pages.currentFriendPage = 0;
		        properties.pages.currentFanofPage = 0;
		        properties.pages.currentNotesPage = 0;
                properties.ui.loading = true;
                oInst.getNotes();
				//properties.pages.currentCatalogPage = 0;
				//oInst.getPhotos();
               	//properties.interval.getphotos = setInterval(oInst.getPhotos, 4000);
			};
			params = "action=CANCEL_FRIEND&friend=" + username;
			var errFunc = function(t) {
				oInst.ui.systemMessage("cancel friend failure: " + t.responseText,6);
				return;
			};
		
			new Ajax.Request(properties.api_urls.cancel_friend, {
				asynchronous: true,
				parameters: params,
				requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
	            onSuccess: handlerFunc,
	            onFailure: errFunc
			});
		}
    },
	doSelectFile: function(e) {
		$('file-url').value = properties.ui.upload_file.name;
	},
    doResize: function(){
        window.nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
    },
	doKeyboardShortcut: function(code) {
		switch(code) {
			case 67: // c - create new note
				this.uiChangeView("new");
			break;
			case 40: // arrow down - next note
			case 74: // j - next note
				this.nextNote();
			break;
			case 38: // arrow up - last note
			case 75: // k - last note
				this.lastNote();
			break;
			case 39: // arrow right - next page
				this.nextNotesPage();
			break;
			case 37: // arrow left - last page
				this.lastNotesPage();
			break;
			case 70: // f - forward
				$('forward-message').value = "!" + properties.json.notes[properties.ui.current_scroll_note].sender.username + " says: " + properties.json.notes[properties.ui.current_scroll_note].body;
				$('forward-username').value = properties.json.notes[properties.ui.current_scroll_note].sender.username;
				$('forward-noteid').value = properties.json.notes[properties.ui.current_scroll_note].id;
				$('forward-note').style.display = "block";
			break;
			case 82: // r - reply to note
				this.uiChangeView("reply", properties.json.notes[properties.ui.current_scroll_note].id);
			break;
			case 86: // v - view original note
				PownceMonkey.doNavigateToURL(properties.json.notes[properties.ui.current_scroll_note].permalink);
			break;
			case 76: // l - follow link url
				if(properties.json.notes[properties.ui.current_scroll_note].link)
				PownceMonkey.doNavigateToURL(properties.json.notes[properties.ui.current_scroll_note].link.url);
			break;
			case 78: // n - change to notes
				this.uiChangeView("notes");
			break;
			case 80: // p - change to people
				this.uiChangeView("people");
			break;
		}
	},
    doLogin: function(){
		properties.ui.loading = true;
        $('login-button').style.display = "none";
        $('login-loading').style.display = "block";
        $('username').disabled = true;
        $('password').disabled = true;
        $('remember_me').disabled = true;
        $('auto_login').disabled = true;
        chat.authHTTPBasic();
    },
    doLogout: function(){
		chat.uiChangeView("login");
        if (properties.ui.current_mp3player) 
            properties.ui.current_mp3player.stop();
        chat.doSaveProperties();
        chat.ui.clearNewNote();
        $('people').innerHTML = "";
        $('notes').innerHTML = "";
        chat.stopAllIntervals();
		properties.ui.logged_in = false;
		chat.addMenuEvents();
		
		// Reset JSON
        properties.json.send_to = {};
        properties.json.online_peeps = {};
        properties.user.profile = {};
        properties.json.notes = [];
        properties.json.people = [];
		
		// Reset Pages
        properties.pages.currentFriendPage = 0;
        properties.pages.currentFanofPage = 0;
        properties.pages.currentNotesPage = 0;
		
		// reset oauth
		properties.oauth.token_secret = "";
		properties.oauth.token = "";
    },
    doMax: function(){
        if (properties.ui.max) {
            window.nativeWindow.restore();
            properties.ui.max = false;
        } else {
            window.nativeWindow.maximize();
            properties.ui.max = true;
        }
    },
    doRestore: function(){
        if (properties.ui.is_win && properties.settings.minimize_to_tray)
            window.nativeWindow.visible = true;
        if (properties.ui.is_win)
			window.nativeWindow.activate();
		else
	        window.nativeWindow.restore();
    },
    doMin: function(){
        window.nativeWindow.minimize();
        if (properties.ui.is_win && properties.settings.minimize_to_tray)
            window.nativeWindow.visible = false;
        properties.ui.min = true;
    },
    doMove: function(){
        window.nativeWindow.startMove();
    },
    doClose: function(){
		properties.settings.x = window.nativeWindow.x;
		properties.settings.y = window.nativeWindow.y;
		properties.settings.width = window.nativeWindow.width;
		properties.settings.height = window.nativeWindow.height;

		if(properties.ui.is_win)
        	air.NativeApplication.nativeApplication.icon.bitmaps = [];
        chat.doSaveProperties();
        if (properties.ui.openWindow) {
            properties.ui.openWindow.close();
        }
        window.nativeWindow.close();
        air.NativeApplication.nativeApplication.exit();
    },
    doDeleteNote: function(id){
    	var note = this.getNoteById(id);
        if (!this.ui.systemMessage("Yikes! You're about to delete this note! Are you sure?",3)) {
            return false;
        }
		this.ui.systemMessage("Deleting note");
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage("Note deleted");
            if (properties.ui.currentNoteDetail == -1) {
				oInst.getNotes();
			}
			else if(note.type!="reply") {
				oInst.uiChangeView("notes");
				oInst.getNotes();
			}
			else {
				oInst.ui.clearReply();
				oInst.uiChangeView("reply",properties.ui.currentNoteDetail);
			}
			return true;
        };
        
        params = "ajax_action=DELETE_NOTE" +
        "&note_to_delete=" +
        id;
		var errFunc = function(t) {
			oInst.ui.systemMessage("delete note failure: " + t.responseText,6);
			return false;
		};
		
        
        new Ajax.Request(properties.api_urls.delete_note, {
            asynchronous: true,
            parameters: params,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password),"Referer",properties.user.profile.permalink,"Host","pownce.com"],
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    doDragOver: function(e){
        if (e.dataTransfer.types[0] == 'application/x-vnd.adobe.air.file-list') {
            this.uiChangeView('new','file');
            e.preventDefault();
        }
    },
    doDrop: function(e){
        var files = e.dataTransfer.getData('application/x-vnd.adobe.air.file-list');
        $('file-url').value = files[0].name;
		properties.ui.upload_file = files[0];
		properties.ui.upload_file.addEventListener( air.ProgressEvent.PROGRESS, function(e) {
			chat.doUploadFileProgress(e);
		} );	
		properties.ui.upload_file.addEventListener( air.Event.COMPLETE, function(e) {
			chat.doUploadFileComplete(e);
		} );
		properties.ui.upload_file.addEventListener( air.IOErrorEvent.IO_ERROR, function(error) { chat.ui.systemMessage("trycatch error: " + e.message,6); });
    },
    doDisclose: function(group){
        if ($(group + '-disclose').className == "disclose-open") {
            $(group + '-disclose').className = "disclose-close"
            $(group).style.display = "none";
        } else {
            $(group + '-disclose').className = "disclose-open"
            $(group).style.display = "block";
        }
    },
    doForwardNote: function(id){
		$('forward-note').style.display = "none";
		var note = this.getNoteById(id);
        if (!note) {
            return;
        }
		this.ui.systemMessage("Forwarding note");
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage("Note forwarded");
			oInst.uiChangeView("notes");
			oInst.getNotes();
			$('forward-to-id').value = "newbies";
			$('forward-to-text').value = "my friends who haven't seen this yet";
			$('forward-message').value = "";
			$('forward-username').value = "";
			$('forward-noteid').value = "";
        };
        
		var url = "http://pownce.com/" + $('forward-username').value + "/notes/" + id + "/forward/";
		
        var params = "note_type=" + note.type + "&note_to=" + $('forward-to-id').value + "&note_body=" + $('forward-message').value;
		var errFunc = function(t) {
			oInst.ui.systemMessage("forward note failure: " + t.responseText,6);
			return;
		};
		
        
        new Ajax.Request(url, {
            asynchronous: true,
			postBody: params,
			type: "post",
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    doFocusWindow: function(){
        air.NativeApplication.nativeApplication.icon.bitmaps = properties.ui.primary_icon;
    },
    doDownloadFile: function(filename, url){
        var urlReq = new air.URLRequest(url);
        var urlStream = new air.URLStream();
        var fileData = new air.ByteArray();
        urlStream.addEventListener(air.Event.COMPLETE, loaded);
        urlStream.load(urlReq);
        function loaded(event){
            urlStream.readBytes(fileData, 0, urlStream.bytesAvailable);
            writeAirFile();
        }
        function writeAirFile(){
            var file = air.File.desktopDirectory.resolvePath(filename);
            var fileStream = new air.FileStream();
            fileStream.open(file, air.FileMode.WRITE);
            fileStream.writeBytes(fileData, 0, fileData.length);
            fileStream.close();
        }
    },
    doSaveProperties: function(){
		try {
	        var file = air.File.applicationStorageDirectory;
	        file = file.resolvePath("pm.properties");
	        var props = "{version:" + VERSION + ",settings:{hide_toolbar:" + properties.settings.hide_toolbar + ",toolbar_icon_text:" + properties.settings.toolbar_icon_text + ",transparency:" + properties.settings.transparency + ",x:" + properties.settings.x + ",y:" + properties.settings.y + ",width:" + properties.settings.width + ",height:" + properties.settings.height + ",hide_list:" + properties.settings.hide_list + ",hide_offline: " + properties.settings.hide_offline + ",shuffle_song:" + properties.settings.shuffle_song + ",repeat_song:" + properties.settings.repeat_song + ",download_theme:" + properties.settings.download_theme + ",font_size:" + properties.settings.font_size + ",friend_request_alert:" + properties.settings.friend_request_alert + ",play_sound:" + properties.settings.play_sound + ",notes_collapsible:" + properties.settings.notes_collapsible + ",max_notes:" + properties.settings.max_notes + ", minimize_to_tray: " + properties.settings.minimize_to_tray + ",auto_login:" + properties.settings.auto_login + ",remember_me:" + properties.settings.remember_me + "}}";
	        var stream = new air.FileStream();
	        stream.open(file, air.FileMode.WRITE);
	        stream.writeMultiByte(props, air.File.systemCharset);
	        stream.close();
	        var bytes = new air.ByteArray();
	        bytes.writeUTFBytes(properties.user.username);
	        air.EncryptedLocalStore.setItem("username", bytes);
	        var bytes = new air.ByteArray();
	        bytes.writeUTFBytes(properties.user.password);
	        air.EncryptedLocalStore.setItem("password", bytes);
		} catch(e) {
			this.ui.systemMessage("Error: " + e.message,6);
		}
    },
    doPostNewNote: function(){
        $('postit').disabled = true;
        var type = $('note-type').value;
		
        this.ui.systemMessage("Sending " + type);
        
		var note_to = $('send-to-id').value;
        
		var body = $('body').value;
		body = body.replace(/;/gim,escape(";"));
		body = body.replace(/&/gim,escape("&"));
		body = body.replace(/</gim,escape("<"));
		body = body.replace(/>/gim,escape(">"));
		body = body.replace(/\+/gim,"%2B");
		var link = $('url').value;
        var event_location = $('where').value;
        var event_name = $('what').value;
        var time = $('time').value;
        var date = $('date').value;
        var event_date = date + " " + time;
        
		var options;
        var url;
        var postVars;
        var username = $('username').value;
        var password = $('password').value;
		var params;
        var reqheaders = ["Content-Type", "application/x-www-form-urlencoded"];
        if (type == "message") {
			if(body==""||body=="post a note...") {
				this.ui.systemMessage("You must enter a message in the message box.",2);
				return;
			}
			url = properties.api_urls.post_a_message;
            params = "note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        } else if (type == "link") {
			if(link==""||link=="http://") {
				this.ui.systemMessage("You must enter a url in the url box.",2);
				return;
			}
			if(body=="post a note...") {
				body = "";
			}
            url = properties.api_urls.post_a_link;
            params = "url=" + link + "&note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        } else if (type == "file") {
			if($('file-url').value=="") {
				this.ui.systemMessage("You must select a file to upload.",2);
				return;
			}
			$('body').style.display = "none";
			$('file-upload-progress').style.display = "block";
			if(properties.user.profile.is_pro) {
				url = properties.api_urls.post_a_file_pro + "?app_key=" + properties.oauth.APP_KEY;
			}
			else {
				url = properties.api_urls.post_a_file + "?app_key=" + properties.oauth.APP_KEY;
			}
			var request = new air.URLRequest( url );
			request.contentType = 'multipart/form-data';
			request.method = air.URLRequestMethod.POST;
			request.data = "note_to=" + note_to + "&note_body=" + escape(body);
			request.requestHeaders =[new air.URLRequestHeader("Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password))];
			properties.ui.upload_file.upload( request, 'media_file', false );
            return;
        } else if (type == "event") {
			if(event_name==""||event_name=="What's Happening?") {
				this.ui.systemMessage("You must enter an event name.",2);
				return;
			}
			if(event_location==""||event_location=="Where at?") {
				this.ui.systemMessage("You must enter a location.",2);
				return;
			}
			if(date=="") {
				this.ui.systemMessage("You must enter a date.",2);
				return;
			}
			if(time=="") {
				this.ui.systemMessage("You must enter a time.",2);
				return;
			}
			if(body=="post a note...") {
				body = "";
			}
            url = properties.api_urls.post_an_event;
            params = "event_date=" + event_date + "&event_name=" + event_name + "&event_location=" + event_location + "&note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        }
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage("Sent new note");
			oInst.ui.clearNewNote();
            oInst.uiChangeView("notes");
            oInst.getNotes();
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage("post note failure: " + t.responseText,6);
			return;
		};
		
		new Ajax.Request(url, {
            postBody: params,
            requestHeaders: ["Content-Type", "multipart/form-data","Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            method: 'post',
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    doRateIt: function(rating, width){
        // set the rating back to none if the rating is clicked again
        if ($('current-rating').style.width == width) {
            $('current-rating').style.width = '0';
            $('id_stars').value = '';
        } else {
            // set the style of the current rating
            $('current-rating').style.width = width;
            // set the form element to submit the user's rating choice
            $('id_stars').value = rating;
        }
    },
    doPostReply: function(){
		this.ui.systemMessage("Sending reply");
        var id = properties.ui.currentNoteDetail;
        var note = this.getNoteById(id);
		$('reply-body').disabled = true;
		$('reply-button').disabled = true;
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage(t.responseText,6);
            var resp = eval('(' + t.responseText + ')');
            if (resp.error) {
            	oInst.ui.systemMessage("Could not send reply");
                return;
            }
			oInst.ui.systemMessage("Reply sent");
            note.replies = resp.replies;
			note.stars = resp.stars;
			note.num_replies = resp.num_replies;
			note.seconds_since = resp.seconds_since;
			note.display_since = resp.display_since;
	       		$('reply-body').disabled = false;
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
			oInst.ui.clearReply();
            oInst.loadReplies();
			oInst.uiSetNoteDetail(note);
        };
        var body = $('reply-body').value;
		body = body.replace(/;/gim,escape(";"));
		body = body.replace(/&/gim,escape("&"));
		body = body.replace(/</gim,escape("<"));
		body = body.replace(/>/gim,escape(">"));
		body = body.replace(/\+/gim,"%2B");
		var stars = $('id_stars').value;
        var rsvp = $('rsvp').value;
        if ((body == "" && stars == "") || (body == "" && rsvp == "----")) {
            this.ui.systemMessage("Did you put anything in?")
            return;
        }
        var url = properties.api_urls.post_a_reply;
        var params = "reply_to=" + id + "&stars=" + stars + "&rsvp=" + rsvp + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
		var errFunc = function(t) {
			oInst.ui.systemMessage("post reply failure: " + t.responseText,6);
			return;
		};
		
        new Ajax.Request(url, {
            method: "post",
            requestHeaders: ["Content-Type", "multipart/form-data","Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            postBody: params,
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    doPlayEventSound: function(){
        var s = new air.Sound();
        s.addEventListener(air.Event.COMPLETE, onSoundLoaded);
        var req = new air.URLRequest("default/sounds/chimp.mp3");
        s.load(req);
        
        function onSoundLoaded(event){
            var localSound = event.target;
            localSound.play();
        }
        
    },
	doUploadFileComplete: function(e) {
		this.ui.systemMessage("Sent new note");
        this.ui.clearNewNote();
        this.uiChangeView("notes");
        this.getNotes();
	},
	doUploadFileProgress: function(e) {
		var loaded = e.bytesLoaded;
		var total = e.bytesTotal;
		var pct = Math.ceil( ( loaded / total ) * 100 );
		
		$( 'file-upload-message' ).innerHTML = 'Uploading... ' + pct.toString() + '%';
		$( 'file-upload-bar' ).style.width = pct.toString() + '%';
	},
	nextNotesPage: function() {
		//if (properties.ui.has_next_notes_page) {
			properties.ui.current_scroll_note = 0;
			$('notes').innerHTML = "";
			properties.pages.currentNotesPage++;
			this.getNotes();
		//}
	},
	scrollToNote: function(id) {
		var pos = Position.cumulativeOffset($('note_' + id));
		var offset = 90;
		if(properties.settings.hide_toolbar)
			offset = 40;
		$('notes').scrollTop = pos[1] - offset;
	},
	nextNote: function() {
		if(properties.ui.current_scroll_note < properties.json.notes.length - 1) {
			properties.ui.current_scroll_note++;
			var id = properties.json.notes[properties.ui.current_scroll_note].id;
			if (properties.settings.notes_collapsible) 
                this.uiShowNoteDetails(id);
			this.scrollToNote(id);
		}
	},
	lastNote: function() {
		if(properties.ui.current_scroll_note > 0) {
			properties.ui.current_scroll_note--;
			var id = properties.json.notes[properties.ui.current_scroll_note].id;
			if (properties.settings.notes_collapsible) 
                this.uiShowNoteDetails(id);
			this.scrollToNote(id);
		}
	},
	lastNotesPage: function() {
		if(properties.pages.currentNotesPage > 0) {
			properties.ui.current_scroll_note = 0;
			$('notes').innerHTML = "";
			properties.pages.currentNotesPage--;
			this.getNotes();
		}
	},
	doMarkAsDownloaded: function(id){
		this.ui.systemMessage("Marking as downloaded",6);
        var handlerFunc = function(t){
			
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage("mark as downloaded failure: " + t.responseText,6);
			return;
		};
		
        new Ajax.Request(properties.api_urls.mark_downloaded, {
            asynchronous: true,
            parameters: "note_id=" + id,
            requestHeaders: ['Authorization', "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    
    /** Filter Functions **/
    filterByReplier: function(id){
        var user = this.getUserById(id);
        if (user.replydomobj.className.match("usrunselected")) {
            user.replydomobj.className = user.replydomobj.className.replace("usrunselected", "usrselected");
            properties.filter.repliers[id] = true;
            properties.filter.repliers.count++;
        } else {
            user.replydomobj.className = user.replydomobj.className.replace("usrselected", "usrunselected");
            properties.filter.repliers[id] = false;
            properties.filter.repliers.count--;
        }
        this.uiRefreshReplies();
    },
    
    /** Get Functions **/
    getNewVersion: function(latest) {
		var oInst = this;
        var handlerFunc = function(t) {
            var result = oInst.ui.systemMessage("There is an update(v" + latest + ") available! Download?\n\n " + t.responseText,3);
            if (result) {
                var urlString = "http://powncemonkey.com/release/PownceMonkey-v" + latest + ".air";
                var urlReq = new air.URLRequest(urlString);
                var urlStream = new air.URLStream();
                var fileData = new air.ByteArray();
                urlStream.addEventListener(air.Event.COMPLETE, loaded);
                urlStream.load(urlReq);
				var oInstk = oInst;
                function loaded(event){
                    urlStream.readBytes(fileData, 0, urlStream.bytesAvailable);
                    writeAirFile();
                }
                function writeAirFile(){
                    var file = air.File.desktopDirectory.resolvePath("PownceMonkey-v" + latest + ".air");
                    var fileStream = new air.FileStream();
                    fileStream.open(file, air.FileMode.WRITE);
                    fileStream.writeBytes(fileData, 0, fileData.length);
                    fileStream.close();
                    //result = oInstk.ui.systemMessage("New version downloaded. Install now?",3);
                    //if (result) {
                        var updater = new air.Updater();
                        var airFile = air.File.desktopDirectory.resolvePath("PownceMonkey-v" + latest + ".air");
                        updater.update(airFile, latest);
                   	//}
                }
            }
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage("download release failure: " + t.responseText,6);
			return;
		};
		
        new Ajax.Request("http://powncemonkey.com/release/" + latest, {
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    getNoteById: function(id){
        for (i = 0; i < properties.json.notes.length; i++) {
            if (properties.json.notes[i].id == id) {
                return properties.json.notes[i];
            }
        }
        return null;
    },
    getNoteIndexById: function(id){
        for (i = 0; i < properties.json.notes.length; i++) {
            if (properties.json.notes[i].id == id) {
                return i;
            }
        }
        return 0;
    },
	getSelectedSendTo: function() {
		if (properties.ui.current_view == "new") {
			$('send-to-filter').style.display = "none";
			$('send-to-text').value = $('selectedsendto').getElementsByTagName("div")[1].innerHTML;
			$('send-to-id').value = $('selectedsendto').getAttribute("sendtoid");
		}
		else {
			$('forward-to-filter').style.display = "none";
			$('forward-to-text').value = $('selectedsendto').getElementsByTagName("div")[1].innerHTML;
			$('forward-to-id').value = $('selectedsendto').getAttribute("sendtoid");
		}
	},
	getTemplateByName: function(name) {
        for (i = 0; i < properties.json.templates.length; i++) {
            if (properties.json.templates[i].name&&properties.json.templates[i].name.toLowerCase() == name.toLowerCase()) {
                return properties.json.templates[i];
            }
        }
		return null;
	},
    getUserById: function(id){
        var frlength = properties.json.people.length;
        for (u = 0; u < properties.json.notes.length; u++) {
            var note = properties.json.notes[u];
            if (note.id == properties.ui.currentNoteDetail) {
                for (j = 0; j < note.replies.length; j++) {
                    var reply = note.replies[j];
                    if (reply.sender.id == id) {
                    	return reply.sender;
                    }
                }
                
                return null;
            }
        }
        return this.getFriendById(id);
    },
    getFriendById: function(id){
		var user = null;
		this.ui.systemMessage("Getting Friend From DB ",6);
        var conn = this.getDBConnection();
		if(!conn)
			return null;
        // start a transaction
        conn.begin();
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.select_person_by_id,{
				id : id
			});
            
            // This try..catch block is fleshed out in
            // a subsequent code listing
            try {
                selectStmt.execute();
                // accessing the data is shown in a subsequent code listing
                var result = selectStmt.getResult();
				if(!result.data||result.data.length==0) {
					conn.rollback();
					return false;
				}
					user = result.data[0];
					user.profile_photo_urls = {
	                    smedium_photo_url: user.smedium_photo_url, 
	                    small_photo_url: user.small_photo_url, 
	                    tiny_photo_url: user.tiny_photo_url, 
	                    medium_photo_url: user.medium_photo_url, 
	                    large_photo_url: user.large_photo_url
					};
					var fullname = user.name;
					if(this.getUserFullName(user.id)) 
						fullname = this.getUserFullName(user.id);
					user.name = fullname;
            } 
            catch (error) {
				this.ui.systemMessage("trycatch error: " + error.message,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return null;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            // rollback the transaction
            conn.rollback();
			return null;
        }
		this.ui.systemMessage("Done Getting Friend From DB ",6);
		return user;
   },
	getOtherProfiles: function(homepage) {
		this.ui.systemMessage("Getting user profiles");
        var oInst = this;
        var handlerFunc = function(t){
			if(t.responseText.match("<title>Pownce / 404</title>")||t.responseText.match("<title>Pownce / 500</title>")) {
				return;
			}
            var page = t.responseText;
			page = page.substring(page.indexOf("<ul class=\"network\">"));
			page = page.substring(0,page.indexOf("<\/ul>"));
			var profiles = page.match(/<a[a-zA-Z0-9=_\"\s\/:.\-]+>[a-zA-Z0-9\s\-\/.<>]+<\/a>/gim);
			for(i=0;i<profiles.length;i++) {
				var site = profiles[i].match(/class=\"[0-9a-zA-Z\-]+\"/)[0];
				site = site.substring(7,site.length-1);
				var url = profiles[i].match(/href=\"[0-9a-zA-Z:\/.\-_\?\#\%\&]+\"/)[0];
				url = url.substring(6,url.length-1);
				var name = profiles[i].match(/>[a-z0-9A-Z\s\-\/.<>]+<\/a>/)[0];
				name = name.substring(1,name.length-4);
				var div = oInst.ui.createOtherProfile(url,site,name);
				$('profile-other-profiles').appendChild(div);
			}
			oInst.ui.systemMessage("User profiles received");
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage("get user theme failure: " + t.responseText,6);
			return;
		};
		
		new Ajax.Request(homepage, {
            onSuccess: handlerFunc,
            onFailure: errFunc
        });	
	},
	getUserFullName: function(id) {
		if(properties.json.fullname[id])
			return properties.json.fullname[id];
		return null;
	},
    getUserTheme: function(){
		this.ui.systemMessage("Getting user theme");
        var oInst = this;
        var handlerFunc = function(t){
            var page = t.responseText;
			if(page.match("<title>Pownce / 404</title>")||page.match("<title>Pownce / 500</title>")) {
				oInst.getNotes();
				return;
			}
			oInst.ui.systemMessage("User theme received");
            oInst.getNotes();
            // Header color
            var is_h_brown = page.match('<link rel="stylesheet" href="/css/h-brown.css" media="all" type="text/css" />');
            var is_h_navy = page.match('<link rel="stylesheet" href="/css/h-navy.css" media="all" type="text/css" />');
            var is_h_pink = page.match('<link rel="stylesheet" href="/css/h-pink.css" media="all" type="text/css" />');
            var is_h_charcoal = page.match('<link rel="stylesheet" href="/css/h-charcoal.css" media="all" type="text/css" />');
            var is_h_green = page.match('<link rel="stylesheet" href="/css/h-green.css" media="all" type="text/css" />');
            var is_h_red = page.match('<link rel="stylesheet" href="/css/h-red.css" media="all" type="text/css" />');
            var is_h_violet = page.match('<link rel="stylesheet" href="/css/h-violet.css" media="all" type="text/css" />');
            var is_h_yellow = page.match('<link rel="stylesheet" href="/css/h-yellow.css" media="all" type="text/css" />');
            var is_h_black = page.match('<link rel="stylesheet" href="/css/h-black.css" media="all" type="text/css" />');
            var is_h_orange = page.match('<link rel="stylesheet" href="/css/h-orange.css" media="all" type="text/css" />');
            
            // Note color
            var is_n_blue = page.match('<link rel="stylesheet" href="/css/n-blue.css" media="all" type="text/css" />');
            var is_n_charcoal = page.match('<link rel="stylesheet" href="/css/n-charcoal.css" media="all" type="text/css" />');
            var is_n_wine = page.match('<link rel="stylesheet" href="/css/n-wine.css" media="all" type="text/css" />');
            var is_n_green = page.match('<link rel="stylesheet" href="/css/n-green.css" media="all" type="text/css" />');
            var is_n_pink = page.match('<link rel="stylesheet" href="/css/n-pink.css" media="all" type="text/css" />');
            var is_n_grey = page.match('<link rel="stylesheet" href="/css/n-grey.css" media="all" type="text/css" />');
            var is_n_black = page.match('<link rel="stylesheet" href="/css/n-black.css" media="all" type="text/css" />');
            var is_n_brown = page.match('<link rel="stylesheet" href="/css/n-brown.css" media="all" type="text/css" />');
            
            var header_color = "";
            var note_color = "";
            var link_color = "";
            link_color = page.match(/\scolor:\s#[0-9a-zA-Z]{6};/)[0];
            link_color = link_color.substring(link_color.indexOf("#"), link_color.length - 1);
            if (is_h_brown) {
                header_color = "hbrown";
            } else if (is_h_navy) {
                header_color = "hnavy";
            } else if (is_h_pink) {
                header_color = "hpink";
            } else if (is_h_charcoal) {
                header_color = "hcharcoal";
            } else if (is_h_green) {
                header_color = "hgreen";
            } else if (is_h_red) {
                header_color = "hred";
            } else if (is_h_violet) {
                header_color = "hviolet";
            } else if (is_h_yellow) {
                header_color = "hyellow";
            } else if (is_h_black) {
                header_color = "hblack";
            } else if (is_h_orange) {
                header_color = "horange";
            }
            
            if (is_n_blue) {
                note_color = "nblue";
            } else if (is_n_charcoal) {
                note_color = "ncharcoal";
            } else if (is_n_wine) {
                note_color = "nwine";
            } else if (is_n_green) {
                note_color = "ngreen";
            } else if (is_n_pink) {
                note_color = "npink";
            } else if (is_n_grey) {
                note_color = "ngrey";
            } else if (is_n_black) {
                note_color = "nblack";
            } else if (is_n_brown) {
                note_color = "nbrown";
            }
            
            oInst.uiSetTheme(header_color, note_color, link_color);
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage("get user theme failure: " + t.responseText,6);
			return;
		};
		
		var url = "http://pownce.com/" + properties.user.username + "/fan_of/";
        new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc
        });
    },
    
    /** Is Functions **/
	isError: function(response) {
		if(response.match("500 Internal Server Error")) {
			return true;
		}
		if(response.match("\"message\": \"Ack. Server error.\"")) {
			return true;
		}
		if(response.match("'message': 'Ack. Server error.'")) {
			return true;
		}
		if(response.match("\"message\": \"Ack. Not found.\"")) {
			return true;
		}
		return false;
	},
    isRelationship: function(id,rel){
		var isRel = false;
        var conn = this.getDBConnection();
		if(!conn)
			return isRel;
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = this.prepareSQL(properties.sql.get_person_relationship,{
				id : id
			});
            try {
                selectStmt.execute();
				var result = selectStmt.getResult();
				if(!result.data||result.data.length==0) {
					conn.rollback();
					return isRel;
				}
				air.trace(id);
				air.trace(result.data[0].relationship);
				air.trace(rel);
				if(result.data[0].relationship==rel)
					isRel = true;
				air.trace(isRel);
            } 
            catch (error) {
                this.ui.systemMessage("Error message: " + error.message,6);
                this.ui.systemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return isRel;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
            this.ui.systemMessage("Error message: " + error.message,6);
            this.ui.systemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return isRel;
        }
		return isRel;
    },
    /** Interval Functions **/
	stopAllIntervals: function(){
        window.clearInterval(properties.interval.getfanof);
        window.clearInterval(properties.interval.getfriends);
        window.clearInterval(properties.interval.getnotes);
        window.clearInterval(properties.interval.newnotes);
        window.clearInterval(properties.interval.songplayback);

		properties.interval.getfanof = null;
		properties.interval.getfiles = null;
		properties.interval.getfriends = null;
		properties.interval.getnotes = null;
		properties.interval.newnotes = null;
		properties.interval.songplayback = null;
	},
    
    uiCreateReply: function(reply){
		
        var replydom = document.createElement("li");
        var div = document.createElement("div");
        var isuser = "";
        div.className = "note reply";
        var bdy = this.ui.prepareNoteBody(reply.body);
		
        if (reply.stars && reply.stars != "None" && reply.stars != "0.0") {
            var strsn = document.createElement("div");
            strsn.className = "stars-note";
            var strs = document.createElement("div");
            strs.className = "stars";
            var strss = document.createElement("span");
            strss.innerHTML = reply.stars + " stars";
            strss.className = "stars-" + reply.stars.replace(".", "");
            strs.appendChild(strss);
            strsn.appendChild(strs);
            div.appendChild(strsn);
        }
        var imglnk = document.createElement("a");
        imglnk.className = "imglnk";
        imglnk.addEventListener("click", function(){
            chat.uiChangeView("profile",reply.sender.username);
        });
        var img = document.createElement("img");
        img.src = reply.sender.profile_photo_urls.smedium_photo_url;
        img.width = "32";
        img.height = "32";
        imglnk.appendChild(img);
        if (reply.sender.is_pro) {
            var empro = document.createElement("em");
            empro.className = "pro-2";
            empro.innerHTML = "Pro!";
            imglnk.appendChild(empro);
        }
        if (reply.sender.username != properties.user.profile.username) {
            var menu = new air.NativeMenu();
            if (!this.isRelationship(reply.sender.id,"friend")) {
                var addFriendMenuitem = menu.addItem(new air.NativeMenuItem("Add Friend"));
                addFriendMenuitem.addEventListener(air.Event.SELECT, function(){
			        var img = document.createElement("img");
			        img.src = reply.sender.profile_photo_urls.medium_photo_url;
			        img.width = "48";
			        img.height = "48";
					$('request-img').appendChild(img);
					$('request-confirm').innerHTML = "Add " + reply.sender.short_name + " as a friend?";
					$('request-username').value = reply.sender.username;
					$('request-friend').style.display = "block";
                });
            }
            var replyMenuitem = menu.addItem(new air.NativeMenuItem("Reply"));
            replyMenuitem.addEventListener(air.Event.SELECT, function(){
                var text = "!" + reply.sender.username + " ";
                $('reply-body').value += text;
                $('reply-body').setSelectionRange($('reply-body').value.length, $('reply-body').value.length);
                $('reply-body').focus();
            });
            imglnk.addEventListener("contextmenu", function(event){
                event.preventDefault();
                menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
            });
        }

        div.appendChild(imglnk);
        var det = document.createElement("div");
        det.className = "details";
		var ssname = reply.sender.short_name;
		if(this.getUserFullName(reply.sender.id)) 
			ssname = this.getUserFullName(reply.sender.id);
        det.innerHTML = "reply by " + ssname + ", ";
        var span = document.createElement("span");
        span.innerHTML = reply.display_since;
        det.appendChild(span);
        var btmdet = document.createElement("div");
        btmdet.className = "bottomdetails";
        div.appendChild(det);
        div.appendChild(bdy);
        if (reply.rsvp) {
            var rsvdiv = document.createElement("div");
            rsvdiv.className = "rsvp";
            var strrsv = document.createElement("strong");
            strrsv.innerHTML = "RSVP: ";
            rsvdiv.appendChild(strrsv);
            var rsvpstatus = "";
            switch (reply.rsvp) {
                case 1:
                    rsvpstatus = "Attending";
                    break;
                case 2:
                    rsvpstatus = "Busy Already";
                    break;
                case 3:
                    rsvpstatus = "Not Attending";
                    break;
                case 4:
                    rsvpstatus = "Running Late";
                    break;
                case 5:
                    rsvpstatus = "Bringing Friends";
                    break;
                case 6:
                    rsvpstatus = "Undecided";
                    break;
                case 7:
                    rsvpstatus = "Wishing I Could";
                    break;
            }
            rsvdiv.appendChild(document.createTextNode(rsvpstatus));
            div.appendChild(rsvdiv);
            btmdet.appendChild(document.createTextNode(" | "));
        }
        
        var replink = document.createElement("a");
        replink.href = "#";
        replink.innerHTML = "Reply";
        replink.style.color = properties.ui.link_color;
        replink.addEventListener("click", function(){
            var text = "!" + reply.sender.username + " ";
            $('reply-body').value += text;
            $('reply-body').setSelectionRange($('reply-body').value.length, $('reply-body').value.length);
            $('reply-body').focus();
        });
        btmdet.appendChild(replink);
        if (reply.sender.username == properties.user.username) {
            btmdet.appendChild(document.createTextNode(" | "));
            var del = document.createElement("a");
            del.href = "#";
            del.style.color = properties.ui.link_color;
            del.className = "deletelink";
            del.innerHTML = "Delete";
            del.addEventListener("click", function(){
                chat.doDeleteNote(reply.id);
            });
            btmdet.appendChild(del);
        }
        div.appendChild(btmdet);
        replydom.className = "nexpanded";
        replydom.appendChild(div);
        
        return replydom;
    },
    uiCreateNote: function(note){
        var notedom = document.createElement("li");
		notedom.id = "note_" + note.id;
        var div = document.createElement("div");
        div.className = "note " + note.type;
        var bdy = this.ui.prepareNoteBody(note.body);
        var imglnk = document.createElement("a");
        imglnk.className = "imglnk";
        imglnk.addEventListener("click", function(){
            chat.uiChangeView("profile",note.sender.username);
			if (properties.settings.notes_collapsible) 
                chat.uiShowNoteDetails(note.id);
        });

		var img = document.createElement("img");
        img.src = note.sender.profile_photo_urls.smedium_photo_url;
        img.width = "32";
        img.height = "32";
        imglnk.appendChild(img);
        if (note.sender.is_pro) {
            var empro = document.createElement("em");
            empro.className = "pro-2";
            empro.innerHTML = "Pro!";
            imglnk.appendChild(empro);
        }
        div.appendChild(imglnk);
        var det = document.createElement("div");
        det.className = "details";
		var name = note.sender.short_name;
		if(this.getUserFullName(note.sender.id))
			name = this.getUserFullName(note.sender.id);
        det.innerHTML = note.type + " by " + name + ", ";
        var span = document.createElement("span");
        span.innerHTML = note.display_since;
        det.appendChild(span);
        var btmdet = document.createElement("div");
        btmdet.className = "bottomdetails";
            var areplies = document.createElement("a");
            areplies.href = "#";
            areplies.style.color = properties.ui.link_color;
			areplies.id = note.id + "_replies";
			var note_id = ((note.type=="reply")?note.reply_to:note.id);
            areplies.addEventListener("click", function(){
                chat.uiChangeView("reply", note_id);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
            areplies.innerHTML = ((note.type=="reply")?"Reply":(note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies")));
            btmdet.appendChild(areplies);
        if (note.type != "reply") {
            btmdet.appendChild(document.createTextNode(" | "));
            var frwd = document.createElement("a");
            frwd.style.color = properties.ui.link_color;
            frwd.href = "#";
            frwd.className = "forwardlink";
            frwd.innerHTML = "Forward";
            frwd.addEventListener("click", function(){
				$('forward-message').value = "!" + note.sender.username + " says: " + note.body;
				$('forward-username').value = note.sender.username;
				$('forward-noteid').value = note.id;
				$('forward-note').style.display = "block";
            });
            btmdet.appendChild(frwd);
			btmdet.appendChild(document.createTextNode(" | "));
            var fav = document.createElement("a");
			fav.style.color = properties.ui.link_color;
			fav.href = "#";
			fav.className = "favoritelink";
			fav.innerHTML = "Favorite";
            fav.addEventListener("click", function(){
				chat.addFavoriteToDB(note);
            });
			btmdet.appendChild(fav);
						
			var recip = document.createElement("div");
			recip.className = "recipients";
			recip.innerHTML = note.num_recipients + " Recipients";
			if(note.num_recipients==1&&note.is_private&&note.sender.id==properties.user.profile.id) {
				recip.className = "recipients private-to-you";
				recip.innerHTML = "Private";
			}
			else if(note.num_recipients==1&&note.is_private) {
				recip.className = "recipients private-to-you";
				recip.innerHTML = "Private to you";
			}
			notedom.appendChild(recip);
        }
        if (note.sender.username == properties.user.username) {
            btmdet.appendChild(document.createTextNode(" | "));
            var del = document.createElement("a");
            del.href = "#";
            del.style.color = properties.ui.link_color;
            del.className = "deletelink";
            del.innerHTML = "Delete";
            del.addEventListener("click", function(){
                chat.doDeleteNote(note.id);
            });
            btmdet.appendChild(del);
        }
        div.appendChild(det);
        div.appendChild(bdy);
		
		if (note.link) {
			var res = this.ui.prepareNoteLink(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
		} else if (note.file) {
			var res = this.ui.prepareNoteFile(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
        } else if (note.event) {
			div.appendChild(this.ui.prepareNoteEvent(note));
        }
		
        if (note.stars && note.stars != "None" && note.stars != "0.0") {
            var strsn = document.createElement("div");
            strsn.className = "stars-note";
            if (note.type == "reply") {
                var iri = document.createElement("div");
                iri.innerHTML = "I rated it:";
                strsn.appendChild(iri);
            }
            var strs = document.createElement("div");
            strs.className = "stars";
            var strss = document.createElement("span");
            strss.innerHTML = note.stars + " stars";
            strss.className = "stars-" + note.stars.replace(".", "");
            strs.appendChild(strss);
            strsn.appendChild(strs);
            div.appendChild(strsn);
        }
        div.appendChild(btmdet);
        if (properties.settings.notes_collapsible) {
            notedom.className = "ncollapsed";
            notedom.addEventListener("click", function(){
				properties.ui.current_scroll_note = chat.getNoteIndexById(note.id);
                chat.uiShowNoteDetails(note.id);
            })
        } else {
            notedom.className = "nexpanded";
        }
        notedom.appendChild(div);
        notedom.addEventListener("mouseover", function() {
				properties.ui.current_scroll_note = chat.getNoteIndexById(note.id);
		});
        return notedom;
    },
    uiCreateFavorite: function(note){
        var notedom = document.createElement("li");
		notedom.id = "favorite_" + note.id;
        var div = document.createElement("div");
        div.className = "note " + note.type;
        var bdy = this.ui.prepareNoteBody(note.body);
        var imglnk = document.createElement("a");
        imglnk.className = "imglnk";
        imglnk.addEventListener("click", function(){
            chat.uiChangeView("profile",note.sender_username);
        });

		var img = document.createElement("img");
        img.src = note.sender_photo_url;
        img.width = "32";
        img.height = "32";
        imglnk.appendChild(img);
        if (note.sender_is_pro=="true") {
            var empro = document.createElement("em");
            empro.className = "pro-2";
            empro.innerHTML = "Pro!";
            imglnk.appendChild(empro);
        }
        div.appendChild(imglnk);
        var det = document.createElement("div");
        det.className = "details";
		var name = note.sender_short_name;
		if(this.getUserFullName(note.sender_id))
			name = this.getUserFullName(note.sender_id);
        det.innerHTML = note.type + " by " + name;
        var btmdet = document.createElement("div");
        btmdet.className = "bottomdetails";
        var areplies = document.createElement("a");
        areplies.href = "#";
        areplies.style.color = properties.ui.link_color;
        areplies.id = note.id + "_replies";
        areplies.addEventListener("click", function(){
            chat.uiChangeView("reply", note.id);
        });
        areplies.innerHTML = "Details";
        btmdet.appendChild(areplies);
        btmdet.appendChild(document.createTextNode(" | "));
        var frwd = document.createElement("a");
        frwd.style.color = properties.ui.link_color;
        frwd.href = "#";
        frwd.className = "forwardlink";
        frwd.innerHTML = "Forward";
        frwd.addEventListener("click", function(){
			$('forward-message').value = "!" + note.sender_username + " says: " + note.body;
			$('forward-username').value = note.sender_username;
			$('forward-noteid').value = note.id;
			$('forward-note').style.display = "block";
        });
        btmdet.appendChild(frwd);
		btmdet.appendChild(document.createTextNode(" | "));
        var fav = document.createElement("a");
		fav.style.color = properties.ui.link_color;
		fav.href = "#";
		fav.className = "unfavoritelink";
		fav.innerHTML = "Unfavorite";
        fav.addEventListener("click", function(){
			chat.deleteFavorite(note.id);
        });
		btmdet.appendChild(fav);
        
        if (note.sender_username == properties.user.username) {
            btmdet.appendChild(document.createTextNode(" | "));
        	var del = document.createElement("a");
            del.href = "#";
            del.style.color = properties.ui.link_color;
            del.className = "deletelink";
            del.innerHTML = "Delete";
            del.addEventListener("click", function(){
                if(chat.doDeleteNote(note.id)!=false)
					chat.deleteFavorite(note.id);
            });
            btmdet.appendChild(del);
        }
        div.appendChild(det);
        div.appendChild(bdy);
		
		if (note.link) {
			var res = this.ui.prepareNoteLink(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
		} else if (note.file) {
			var res = this.ui.prepareNoteFile(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
        } else if (note.event) {
			div.appendChild(this.ui.prepareNoteEvent(note));
        }
		
        if (note.stars && note.stars != "None" && note.stars != "0.0") {
            var strsn = document.createElement("div");
            strsn.className = "stars-note";
            var strs = document.createElement("div");
            strs.className = "stars";
            var strss = document.createElement("span");
            strss.innerHTML = note.stars + " stars";
            strss.className = "stars-" + note.stars.replace(".", "");
            strs.appendChild(strss);
            strsn.appendChild(strs);
            div.appendChild(strsn);
        }
        div.appendChild(btmdet);
        notedom.className = "nexpanded";
        notedom.appendChild(div);
        return notedom;
    },
    uiCreateReplier: function(user){
        var userdom = document.createElement("li");
        userdom.style.color = properties.ui.link_color;
        var userimg = document.createElement("img");
        userimg.src = user.profile_photo_urls.tiny_photo_url;
        userdom.appendChild(userimg);
		var ssname = user.short_name;
		if(this.getUserFullName(user.id))
			ssname = this.getUserFullName(user.id);
        var name = document.createTextNode(ssname);
        if (user.username != properties.user.profile.username) {
            var menu = new air.NativeMenu();
            if (!this.isRelationship(user.id,"friend")) {
                var addFriend = menu.addItem(new air.NativeMenuItem("Add Friend"));
                addFriend.addEventListener(air.Event.SELECT, function(){
			        var img = document.createElement("img");
			        img.src = reply.sender.profile_photo_urls.medium_photo_url;
			        img.width = "48";
			        img.height = "48";
					$('request-img').appendChild(img);
					var ssname = reply.sender.short_name;
					if(chat.getUserFullName(reply.sender.id))
						ssname = chat.getUserFullName(reply.sender.id);
					$('request-confirm').innerHTML = "Add " + ssname + " as a friend?";
					$('request-username').value = reply.sender.username;
					$('request-friend').style.display = "block";
                });
            }
            var reply = menu.addItem(new air.NativeMenuItem("Reply"));
            reply.addEventListener(air.Event.SELECT, function(){
                var text = "!" + user.username + " ";
                $('reply-body').value += text;
                $('reply-body').setSelectionRange($('reply-body').value.length, $('reply-body').value.length);
                $('reply-body').focus();
            });
            userdom.addEventListener("contextmenu", function(event){
                event.preventDefault();
                menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
            });
        }
        userdom.appendChild(name);
        userdom.addEventListener("click", function(){
            chat.filterByReplier(user.id);
        });
        userdom.className = "usrunselected";
        
        return userdom;
    },
    uiNewNoteTo: function(id) {
		var fname = properties.json.fullname[id];
		$('send-to-text').value = fname;
        $('send-to-id').value = "friend_" + id;
        this.uiChangeView("new","message");
    },
    uiShowNoteDetails: function(id){
        var note = this.getNoteById(id);
        var classn = $("note_" + id).className;
        if (classn == "nexpanded") {
            this.ui.collapseNote(note);
            return;
        }
        this.ui.collapseAllNotes();
        classn = classn.replace("ncollapsed", "nexpanded");
        $("note_" + id).className = classn;
    },
    uiViewFileDetails: function(id){
        var note = this.getFileById(id);
        if (!note) {
            return;
        }
        if (properties.ui.current_mp3player) 
            properties.ui.current_mp3player.stop();
        $('file-preview').innerHTML = "";
        if (note.type == "image") {
            var img = document.createElement("img");
            img.src = note.url;
            img.width = "90";
            $('file-preview').appendChild(img);
        } else if (note.type == "audio") {
            var mp3player = new AIRMP3Player({
                url: note.url
            });
            note.mp3player = mp3player;
            $('file-preview').appendChild(mp3player.getDOMObject());
        }
        
        var fn = document.createElement("div");
        var fnstr = document.createElement("strong");
        fnstr.innerHTML = "name: ";
        fn.appendChild(fnstr);
        fn.appendChild(document.createTextNode(note.name));
        $('file-preview').appendChild(fn);
        
        var usrn = document.createElement("div");
        var usrnstr = document.createElement("strong");
        usrnstr.innerHTML = "from: ";
        usrn.appendChild(usrnstr);
		var ssname = note.sender_short_name;
		if(this.getUserFullName(note.sender_id))
			ssname = this.getUserFullName(note.sender_id);
        usrn.appendChild(document.createTextNode(ssname));
        $('file-preview').appendChild(usrn);
        
        var bdy = document.createElement("div");
        var bdystr = document.createElement("strong");
        bdystr.innerHTML = "description: ";
        bdy.appendChild(bdystr);
        bdy.appendChild(document.createTextNode(note.body.substring(0, 50) + ((note.body.length > 50) ? "..." : "")));
        $('file-preview').appendChild(bdy);
        
        var lnkdiv = document.createElement("div");
        var link = document.createElement("a");
        link.innerHTML = "download";
        link.style.color = properties.ui.link_color;
        link.addEventListener("click", function(){
            chat.doMarkAsDownloaded(note.id);
            chat.doDownloadFile(note.name, note.url);
        });
        lnkdiv.appendChild(link);
        $('file-preview').appendChild(lnkdiv);
    },
    uiRefreshReplies: function(){
        var note = this.getNoteById(properties.ui.currentNoteDetail);
        if (!note) 
        
            return;
        for (i = 0; i < note.replies.length; i++) {
            var reply = note.replies[i];
            if (properties.filter.repliers.count != 0 && !properties.filter.repliers[reply.sender.id]) {
                reply.replydomobj.style.display = "none";
            } else {
                reply.replydomobj.style.display = "block";
            }
        }
    },
	addSettingsEvents: function() {
		$('settings-play-sound').addEventListener('click', function() { 
			properties.settings.play_sound = $('settings-play-sound').checked;
		});
		$('settings-friend-requests').addEventListener('click', function() { 
			properties.settings.friend_request_alert = $('settings-friend-requests').checked;
		});
        $('play-sound').addEventListener('click', function(){
            chat.doPlayEventSound();
        });
        $('settings-notes-collapsible').addEventListener('click', function(){
			properties.settings.notes_collapsible = $('settings-notes-collapsible').checked;
            chat.loadNotes();
        });
        $('settings-max-notes').addEventListener('change', function(){
            properties.settings.max_notes = $('settings-max-notes').value;
			chat.getNotes();
        });
        $('settings-hide-toolbar').addEventListener('click', function(){
            properties.settings.hide_toolbar = $('settings-hide-toolbar').checked;
			if(properties.settings.hide_toolbar)
				chat.ui.hideToolbar();
			else
				chat.ui.showToolbar();
        });
        $('settings-download-theme').addEventListener('click', function(){
            properties.settings.download_theme = $('settings-download-theme').checked;
			if(properties.settings.download_theme)
				chat.getUserTheme();
			else
				chat.uiSetTheme("hbrown", "nblue", "#2E8696");
        });
        $('settings-min-to-tray').addEventListener('click', function(){
            properties.settings.minimize_to_tray = $('settings-min-to-tray').checked;
        });
        $('settings-auto-login').addEventListener('click', function(){
            properties.settings.auto_login = $('settings-auto-login').checked;
        });
		$('font-size-1').addEventListener('click', function(){
			$('font-size-1').className = "current-font-size";
            $('font-size-2').className = "";
            $('font-size-3').className = "";
            $('font-size-4').className = "";
            properties.settings.font_size = 1;
			document.body.className = document.body.className.replace(/fontSize[1-4]/, "fontSize1");
        });	
		$('font-size-2').addEventListener('click', function(){
			$('font-size-1').className = "";
            $('font-size-2').className = "current-font-size";
            $('font-size-3').className = "";
            $('font-size-4').className = "";
            properties.settings.font_size = 2;
			document.body.className = document.body.className.replace(/fontSize[1-4]/, "fontSize2");
        });	
		$('font-size-3').addEventListener('click', function(){
			$('font-size-1').className = "";
            $('font-size-2').className = "";
            $('font-size-3').className = "current-font-size";
            $('font-size-4').className = "";
            properties.settings.font_size = 3;
			document.body.className = document.body.className.replace(/fontSize[1-4]/, "fontSize3");
        });	
		$('font-size-4').addEventListener('click', function(){
			$('font-size-1').className = "";
            $('font-size-2').className = "";
            $('font-size-3').className = "";
            $('font-size-4').className = "current-font-size";
            properties.settings.font_size = 4;
			document.body.className = document.body.className.replace(/fontSize[1-4]/, "fontSize4");
        });
		$('settings-toolbar-text').addEventListener('click', function(){
            properties.settings.toolbar_icon_text = $('settings-toolbar-text').checked;
			if(properties.settings.toolbar_icon_text)
				$('toolbar').className = "";
			else
				$('toolbar').className = "toolbar-icon";
        });
		new Control.Slider('settings-app-transparency-handle', 'settings-app-transparency-track', {
			onSlide: function(v) { $('settings-app-transparency').innerHTML = Math.floor(v * 100) + "%" },
			onChange: function(v) { chat.ui.transparency(v); },
			range: $R(.50, 1),
			sliderValue: properties.settings.transparency
		});
		
	},
	addToolbarEvents: function() {
		// Toolbar events
        $('toolbar-newnote').addEventListener('click', function() { 
			chat.uiChangeView("new","message");
		});
        $('toolbar-favorites').addEventListener('click', function() { 
			chat.uiChangeView("favorites");
		});
		$('toolbar-filter').addEventListener('click', function() { 
			$('filter-build-box').style.display = "block";
		});
		properties.menu.template = new air.NativeMenu();
		$('toolbar-template').addEventListener('click', function(event) { 
			var pos = Position.cumulativeOffset($('toolbar-template'));
			properties.menu.template.display(window.nativeWindow.stage, pos[0], pos[1] + 20);
		});
		$("toolbar-template-save").addEventListener('click', function() {
			chat.saveTemplate();
		});
        $('toolbar-people').addEventListener('click', function() {
			chat.uiChangeView("people");
		});
		$('toolbar-settings').addEventListener('click', function(){
			chat.uiChangeView("settings","general");
		});
		$('toolbar-new-message').addEventListener('click',function(){
			chat.uiChangeView("new","message");
		});
		$('toolbar-new-link').addEventListener('click',function(){
			chat.uiChangeView("new","link");
		});
		$('toolbar-new-file').addEventListener('click',function(){
			chat.uiChangeView("new","file");
		});
		$('toolbar-new-event').addEventListener('click',function(){
			chat.uiChangeView("new","event");
		});
        $('toolbar-settings-general').addEventListener('click', function(){
            chat.uiChangeView("settings","general");
        });
        $('toolbar-settings-notes').addEventListener('click', function(){
            chat.uiChangeView("settings","notes");
        });
        $('toolbar-settings-alerts').addEventListener('click', function(){
            chat.uiChangeView("settings","alerts");
        });
		$('toolbar-notes').addEventListener('click', function(){
            chat.uiChangeView('notes');
        });
		$('toolbar-refresh').addEventListener('click', function(){
            chat.getNotes();
        });
		var toolbarmenu = new air.NativeMenu();
        var hideToolbarMenu = toolbarmenu.addItem(new air.NativeMenuItem("Hide Toolbar"));
        hideToolbarMenu.addEventListener(air.Event.SELECT, function(){
			properties.settings.hide_toolbar = true;
			$('settings-hide-toolbar').checked = true;
			chat.ui.hideToolbar();
        });
		$('toolbar').addEventListener("contextmenu", function(event){
            event.preventDefault();
            toolbarmenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
        });
		$('toolbar-logout').addEventListener('click', function(){
			chat.doLogout();
        });
		$('toolbar-clear-favorites').addEventListener('click', function(){
			if(chat.ui.systemMessage("Are you sure you want to delete all your favorites?",3))
				chat.deleteAllFavorites();
        });
		$('toolbar-refresh-people').addEventListener('click', function(){
			chat.deleteAllPeople();
			properties.pages.currentFriendPage = 0;
            chat.getFriends();
			if(properties.interval.getfriends)
				clearInterval(properties.interval.getfriends);
			properties.interval.getfriends = setInterval(function(){
				chat.getFriends();
			}, 3000);
        });
	},
	addMenuEvents: function() {
		properties.menu.main = new air.NativeMenu();
		var about = new air.NativeMenuItem("About", false);
		about.addEventListener(air.Event.SELECT, function() {
	        if (properties.ui.aboutWindow) {
	            if (properties.ui.aboutWindow.window.nativeWindow) {
	                properties.ui.aboutWindow.window.nativeWindow.activate();
	                return;
	            } else 
	                properties.ui.aboutWindow = null;
	        }
	        var init = new air.NativeWindowInitOptions();
	        var bounds = null;
	        var login = air.File.applicationDirectory.resolvePath('about.html');
	        bounds = new air.Rectangle((air.Capabilities.screenResolutionX - 500) / 2, (air.Capabilities.screenResolutionY - 400) / 2, 500, 400);
	        init.systemChrome = air.NativeWindowSystemChrome.NONE;
	        init.type = air.NativeWindowType.UTILITY;
	        init.transparent = true;
	        init.minimizable = false;
	        init.maximizable = false;
	        init.resizable = true;
	        properties.ui.aboutWindow = air.HTMLLoader.createRootWindow(true, init, false, bounds);
	        properties.ui.aboutWindow.load(new air.URLRequest(login.url + "?version=" + VERSION));
		});
		properties.menu.main.addItem(about);
		var separatorA = new air.NativeMenuItem("A", true);
		properties.menu.main.addItem(separatorA);
		var newSubmenu = new air.NativeMenu();
		var newMessage = new air.NativeMenuItem("Message", false);
		newMessage.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("new","message");
		});
		newMessage.enabled = properties.ui.logged_in;
		newSubmenu.addItem(newMessage);
		var newLink = new air.NativeMenuItem("Link", false);
		newLink.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("new","link");
		});
		newLink.enabled = properties.ui.logged_in;
		newSubmenu.addItem(newLink);
		var newFile = new air.NativeMenuItem("File", false);
		newFile.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("new","file");
		});
		newSubmenu.addItem(newFile);
		newFile.enabled = properties.ui.logged_in;
		var newEvent = new air.NativeMenuItem("Event", false);
		newEvent.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("new","event");
		});
		newEvent.enabled = properties.ui.logged_in;
		newSubmenu.addItem(newEvent);
		properties.menu.main.addSubmenu(newSubmenu, "New");

		var viewSubmenu = new air.NativeMenu();
		var viewNotes = new air.NativeMenuItem("Notes", false);
		viewNotes.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("notes");
		});
		viewNotes.enabled = properties.ui.logged_in;
		viewSubmenu.addItem(viewNotes);
		var viewPeople = new air.NativeMenuItem("Peeps", false);
		viewPeople.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("people");
		});
		viewPeople.enabled = properties.ui.logged_in;
		viewSubmenu.addItem(viewPeople);
		var viewFavorites = new air.NativeMenuItem("Favorites", false);
		viewFavorites.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("favorites");
		});
		viewFavorites.enabled = properties.ui.logged_in;
		viewSubmenu.addItem(viewFavorites);
		var viewSettings = new air.NativeMenuItem("Settings", false);
		viewSettings.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("settings");
		});
		viewSettings.enabled = properties.ui.logged_in;
		viewSubmenu.addItem(viewSettings);
		var newMenuItem = properties.menu.main.addSubmenu(viewSubmenu, "View");
		
		var separatorB = new air.NativeMenuItem("B", true);
		properties.menu.main.addItem(separatorB);
		var logout = new air.NativeMenuItem("Logout", false);
		logout.addEventListener(air.Event.SELECT, function() {
			chat.doLogout();
		});
		logout.enabled = properties.ui.logged_in;
		properties.menu.main.addItem(logout);
		var exit = new air.NativeMenuItem("Exit", false);
		exit.addEventListener(air.Event.SELECT, function() {
			chat.doClose();
		});
		properties.menu.main.addItem(exit);
	},
	uiInitialize: function(){
		//this.ui.clearNewNote();
		
		this.addToolbarEvents();
		
		this.addSettingsEvents();
		
		this.addMenuEvents();

		$('appVersion').innerHTML = "v " + VERSION;
  		$('divMenu').addEventListener('click', function() {
			var pos = Position.cumulativeOffset($('divMenu'));
			properties.menu.main.display(window.nativeWindow.stage, pos[0], pos[1] + 20);
		});
		
        $('filter-ok').addEventListener('click', function() { 
			$('filter-build-box').style.display = "none";
			chat.uiShowFilter();
			chat.uiChangeView("notes");
		});
		
        
		$('people-filter').addEventListener('keyup',function() {
			properties.filter.peoplestr = $('people-filter').value;
			chat.loadPeople();
		});
		$('send-to-text').addEventListener('focus',function(){
			$('send-to-text').value = "";
			$('send-to-id').value = "";
		});
		$('send-to-text').addEventListener('blur',function(){
			if ($('send-to-id').value == "") {
				$('send-to-text').value = properties.ui.defaultSendto.fullname;
				$('send-to-id').value = properties.ui.defaultSendto.id;
			}
		});
		$('send-to-text').addEventListener('keyup',function(e) {
			properties.filter.sendtostr = $('send-to-text').value;
			if(properties.filter.sendtostr.length > 1) {
				$('send-to-filter').style.display = "block";
				chat.loadSendToList();
				if(e.keyCode==13) {
					chat.getSelectedSendTo();	
				}
			}
			else {
				$('send-to-filter').style.display = "none";
				return;
			}
		});
		$('forward-to-text').addEventListener('focus',function(){
			$('forward-to-text').value = "";
			$('forward-to-id').value = "";
			chat.uiChangeView("notes");
		});
		$('forward-to-text').addEventListener('blur',function(){
			if ($('forward-to-id').value == "") {
				$('forward-to-text').value = properties.ui.defaultSendto.fullname;
				$('forward-to-id').value = properties.ui.defaultSendto.id;
			}
		});
		$('forward-to-text').addEventListener('keyup',function(e) {
			properties.filter.sendtostr = $('forward-to-text').value;
			if(properties.filter.sendtostr.length > 1) {
				$('forward-to-filter').style.display = "block";
				chat.loadSendToList();
				if(e.keyCode==13) {
					chat.getSelectedSendTo();	
				}
			}
			else {
				$('forward-to-filter').style.display = "none";
				return;
			}
		});
		$('clear-people-filter').addEventListener('click',function() {
			properties.filter.peoplestr = "";
			$('people-filter').value = "";
			chat.loadPeople();
		});
		$('toggle-reply-list').addEventListener('click',function() {
			if($('toggle-reply-list').className=="list-hidden") {
				chat.uiShowRepliersList();
			}
			else {
				chat.ui.hideRepliersList();
			}
		});
		$('send-request').addEventListener('click',function(){
			chat.doAddFriend($('request-username').value);
		});
		$('cancel-request').addEventListener('click',function(){
			$('request-friend').style.display = "none";
			$('request-img').innerHTML = "";
			$('request-confirm').innerHTML = "";
			$('request-message').value = "";
			$('request-username').value = "";
		});
		$('forward-it').addEventListener('click',function(){
            chat.doForwardNote($('forward-noteid').value);
		});
		$('cancel-forward').addEventListener('click',function(){
			$('forward-note').style.display = "none";
			$('forward-message').value = "";
			$('forward-username').value = "";
			$('forward-noteid').value = "";
		});
		$('postit').addEventListener('click',function(){
			chat.doPostNewNote();
		});
		$('file-browse').addEventListener('click',function() {
			chat.doBrowseForFile();
		});
		$('delete-filter').addEventListener('click', function(){
            chat.ui.hideFilter();
        });
        // Close button
        $('divClose').addEventListener('click', this.doClose);
        // Maximize button
        $('divMax').addEventListener('click', this.doMax);
        // Minimize button
        $('divMin').addEventListener('click', this.doMin);
        // disclose
        $('repliers-disclose').addEventListener('click',  function(){
			chat.doDisclose("repliers");
		});
        // Resizing (from handle, counter-clockwise)
        $('divHandle').addEventListener('mousedown', this.doResize);
        // Move window
        $('divBar').addEventListener('mousedown', this.doMove);
        $('statusbar').addEventListener('mousedown', this.doMove);
		$('divTitle').addEventListener('mousedown', this.doMove);
		$('appVersion').addEventListener('mousedown', this.doMove);
		$('divTop').addEventListener('mousedown', this.doMove);
		$('divContentStrip').addEventListener('mousedown', this.doMove);
		$('toolbar-back').addEventListener('click',function() {
			chat.uiChangeView("notes");
			clearInterval(properties.interval.getreplies);
			properties.ui.currentNoteDetail = -1;
		});
		
		$('alert-ok').addEventListener('click', function(e) {
			$('alert-box').style.display = "none";
			$('alert-message').innerHTML = "";
		});

        // File drag and drop
        document.body.addEventListener('dragover', function(e){
			chat.doDragOver(e);
		});
        document.body.addEventListener('drop', function(e){
			chat.doDrop(e);
		});
        document.body.addEventListener('keyup', function(e){
			if(properties.ui.logged_in && e.target.nodeName=="BODY" && e.ctrlKey==0) {
				chat.doKeyboardShortcut(e.keyCode);
			}
		});
		
		window.nativeWindow.width = properties.settings.width;
		window.nativeWindow.height = properties.settings.height;
		
        window.nativeWindow.x = properties.settings.x;
		window.nativeWindow.y = properties.settings.y;
		
		window.nativeWindow.addEventListener(air.Event.ACTIVATE, this.doFocusWindow);
        var iconLoadComplete = function(event){
            properties.ui.primary_icon = new runtime.Array(event.target.content.bitmapData);
            air.NativeApplication.nativeApplication.icon.bitmaps = new runtime.Array(event.target.content.bitmapData);
        }
        var secondaryIconLoadComplete = function(event){
            properties.ui.secondary_icon = new runtime.Array(event.target.content.bitmapData);
        }
		air.NativeApplication.nativeApplication.autoExit = false;
        var iconLoad = new air.Loader();
        var secondaryIconLoad = new air.Loader();
        var iconMenu = new air.NativeMenu();
        var restoreCommand = iconMenu.addItem(new air.NativeMenuItem("Restore"));
        restoreCommand.addEventListener(air.Event.SELECT, this.doRestore);
        var exitCommand = iconMenu.addItem(new air.NativeMenuItem("Exit"));
        exitCommand.addEventListener(air.Event.SELECT, this.doClose);
        if (air.NativeApplication.supportsSystemTrayIcon) {
            air.NativeApplication.nativeApplication.autoExit = false;
            iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, iconLoadComplete);
            iconLoad.load(new air.URLRequest("icons/icon16.png"));
            secondaryIconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, secondaryIconLoadComplete);
            secondaryIconLoad.load(new air.URLRequest("icons/icon16-alternate.png"));
            air.NativeApplication.nativeApplication.icon.tooltip = "Pownce Monkey " + VERSION;
            air.NativeApplication.nativeApplication.icon.menu = iconMenu;
            air.NativeApplication.nativeApplication.icon.addEventListener("click", this.doRestore);
        }
        if (air.NativeApplication.supportsDockIcon) {
            iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, iconLoadComplete);
            iconLoad.load(new air.URLRequest("icons/icon128.png"));
            secondaryIconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, secondaryIconLoadComplete);
            secondaryIconLoad.load(new air.URLRequest("icons/icon128-alternate.png"));
        }
		this.getTemplates();
        if (properties.ui.is_win)
		window.nativeWindow.addEventListener(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGE, function(e) {
			if(e.afterDisplayState=="minimized")
				chat.doMin(e);
		});
		air.NativeApplication.nativeApplication.addEventListener(air.InvokeEvent.INVOKE, function(e) {
			chat.openFile(e);
		});
		
    },
    uiChangeView: function(view,type){
		properties.ui.currentNoteDetail = -1;
		if (properties.ui.current_mp3player) 
            properties.ui.current_mp3player.stop();
		if(view==null||view=="")
			view = "notes";
		properties.ui.current_view = view;
        $('note-view').style.display = "none";
		$('reply-view').style.display = "none";
        $('login').style.display = "none";
        $('settings').style.display = "none";
		$('people-view').style.display = "none";
		$('profile-view').style.display = "none";
		$('favorites-view').style.display = "none";
		$('sub-toolbar-notes').style.display = "none";
		$('sub-toolbar-new').style.display = "none";
		$('sub-toolbar-people').style.display = "none";
		$('sub-toolbar-favorites').style.display = "none";
		$('sub-toolbar-settings').style.display = "none";
		$('sub-toolbar-general').style.display = "none";
		$('toolbar-notes').className = "tool-button";
		$('toolbar-newnote').className = "tool-button";
		$('toolbar-people').className = "tool-button";
		$('toolbar-favorites').className = "tool-button";
		$('toolbar-settings').className = "tool-button-right";
		properties.ui.logged_in = true;
        $('reply-body').disabled = false;
		if(properties.settings.hide_toolbar==true) {
			this.ui.hideToolbar();
		}
		else {
			this.ui.showToolbar();
		}
		switch (view) {
            case "notes":
				$('new-box').style.display = "none";
				$('toolbar').style.display = "block";
				$('toolbar-notes').className = "tool-button tool-selected";
				this.ui.clearNewNote();
	       		$('sub-toolbar-notes').style.display = "block";
				$('filter-box').style.top = "0px";
				$('notes').style.top = "0px";
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.ui.clearReply();
                $('note-view').style.display = "block";
				if($('notes').childNodes.length > 9) {
					var id = properties.json.notes[properties.ui.current_scroll_note].id;
					this.scrollToNote(id);
				}
                break;
            case "settings":
                this.ui.clearNewNote();
				$('sub-toolbar-settings').style.display = "block";
				$('toolbar-settings').className = "tool-button-right tool-selected";
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.ui.clearReply();
                $('settings').style.display = "block";
				if(type==null||type=="")
					type = "general";
		        
		        $('settings-general-pane').style.display = "none";
		        $('settings-notes-pane').style.display = "none";
		        $('settings-alerts-pane').style.display = "none";
        		
				$('settings-' + type + '-pane').style.display = "block";
                break;
			case "new":
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				$('sub-toolbar-new').style.display = "block";
				$('toolbar-newnote').className = "tool-button tool-selected";
				this.ui.clearReply();
				$('note-view').style.display = "block";
				$('new-box').style.display = "block";
				if(type==null||type=="")
					type = "message";
				$('note-type').value = type;
				switch(type){
					case "message":
						$('filter-box').style.top = "127px";
						$('notes').style.top = "127px";
						$('new-box').className = "ca-type-message";
					break;
					case "link":
						$('filter-box').style.top = "152px";
						$('notes').style.top = "152px";
						$('new-box').className = "ca-type-link";
					break;
					case "file":
						$('filter-box').style.top = "152px";
						$('notes').style.top = "152px";
						$('new-box').className = "ca-type-file";
					break;
					case "event":
						$('filter-box').style.top = "195px";
						$('notes').style.top = "195px";
						$('new-box').className = "ca-type-event";
					break;
				}
				break;
			case "login":
				properties.ui.logged_in = false;
				this.ui.clearNewNote();
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.ui.clearReply();
				this.ui.hideToolbar();
		        $('login').style.display = "block";
		        $('login-button').style.display = "block";
		        $('login-loading').style.display = "none";
		        $('username').disabled = false;
		        $('password').disabled = false;
		        $('remember_me').disabled = false;
		        $('auto_login').disabled = false;
				$('toolbar').style.display = "none";
				break;
			case "reply":
				$('sub-toolbar-general').style.display = "block";
				var id = type;
				properties.ui.currentNoteDetail = id;
				if(!properties.settings.hide_list)
					this.uiShowRepliersList();
				this.getNote();
				if(properties.interval.getreplies) {
					clearInterval(properties.interval.getreplies);
				}
				properties.interval.getreplies = setInterval(function(){
					chat.getNote();
				},60000);
				$('reply-view').style.display = "block";
				break;
			case "people":
				$('sub-toolbar-people').style.display = "block";
				$('toolbar-people').className = "tool-button tool-selected";	
				$('people-view').style.display = "block";
				break;
			case "profile":
				$('sub-toolbar-general').style.display = "block";
				$('profile-view').style.display = "block";
				this.ui.clearProfileDetail();
				if (type.username) {
					this.uiSetProfileDetail(type);
					this.getOtherProfiles(type.permalink);
				}
				else {
					this.getUser(type,1);
				}
				break;
			case "favorites":
				$('sub-toolbar-favorites').style.display = "block";
				$('toolbar-favorites').className = "tool-button tool-selected";	
				$('favorites-view').style.display = "block";
				this.loadFavorites();
				break;
        }
    },
	uiSetProfileDetail: function(user) {
		var img = document.createElement("img");
		img.src = user.profile_photo_urls.large_photo_url;
		$('profile-image').appendChild(img);
		if(user.is_pro) {
			var em = document.createElement("em");
			em.className = "pro";
			$('profile-image').appendChild(em);
		}
		if(this.getUserFullName(user.id))
			$('profile-short-name').innerHTML = this.getUserFullName(user.id);
		else 
			$('profile-short-name').innerHTML = user.short_name;
		$('profile-username').innerHTML = "(" + user.username + ")";
		$('profile-blurb').innerHTML = user.blurb;
		var detstr = "";
		if(user.age)
			detstr += user.age + "-year-old ";
		if(user.gender)
			detstr += user.gender + " ";
		if(user.location)
			detstr += "from " + user.location;
		$('profile-details').innerHTML = detstr;
		
		if (this.isRelationship(user.id,"friend")) {
			var link = document.createElement("a");
			link.href = "#";
			link.innerHTML = "Send Note";
			link.style.color = properties.ui.link_color;
			link.addEventListener("click", function(){
				chat.uiNewNoteTo(user.id);
			});
			$('profile-send-note').appendChild(link);
			var ulink = document.createElement("a");
			ulink.href = "#";
			ulink.innerHTML = "Unfriend";
			ulink.style.color = properties.ui.link_color;
			ulink.addEventListener("click", function(){
				chat.doRemoveFriend(user.username);
			});
			$('profile-unfriend').appendChild(ulink);
		} else if (this.isRelationship(user.id,"fanof")) {
			var ulink = document.createElement("a");
			ulink.href = "#";
			ulink.innerHTML = "Cancel Request";
			ulink.style.color = properties.ui.link_color;
			ulink.addEventListener("click", function(){
				chat.doCancelRequest(user.username);
			});
			$('profile-cancel-request').appendChild(ulink);
		} else {
			var ulink = document.createElement("a");
			ulink.href = "#";
			ulink.innerHTML = "Add Friend";
			ulink.style.color = properties.ui.link_color;
			ulink.addEventListener("click", function(){
		        var img = document.createElement("img");
		        img.src = user.profile_photo_urls.medium_photo_url;
		        img.width = "48";
		        img.height = "48";
				$('request-img').appendChild(img);
				var ssname = user.short_name;
				if(chat.getUserFullName(user.id))
					ssname = chat.getUserFullName(user.id);
				$('request-confirm').innerHTML = "Add " + ssname + " as a friend?";
				$('request-username').value = user.username;
				$('request-friend').style.display = "block";
			});
			$('profile-addfriend').appendChild(ulink);
		}
		if(user.last_note_id) {
			var lastnotelnk = document.createElement("span");
			lastnotelnk.className = "link_" + user.last_note_type;
			lastnotelnk.addEventListener('click',function(e) {
				chat.uiChangeView("reply",user.last_note_id);
			});
			
			$('profile-last-pownce').appendChild(lastnotelnk);
			var lastnotebody = (user.last_note_body.length > 150)?user.last_note_body.substring(0,150) + "...":user.last_note_body;
			lastnotebody = this.ui.prepareNoteBody(lastnotebody);
			$('profile-last-pownce').appendChild(lastnotebody);
			air.trace($('profile-last-pownce').innerHTML);
		}
		
		var link = document.createElement("a");
		link.href = "#";
		link.innerHTML = "Homepage";
		link.style.color = properties.ui.link_color;
		link.addEventListener("click", function() {
			PownceMonkey.doNavigateToURL(user.permalink);
		});
		$('profile-link').appendChild(link);
		
		var frlink = document.createElement("a");
		frlink.href = "#";
		frlink.innerHTML = user.friend_count + " Friends";
		frlink.style.color = properties.ui.link_color;
		frlink.addEventListener("click", function() {
			PownceMonkey.doNavigateToURL("http://pownce.com/" + user.username + "/friends/");
		});
		$('profile-friend-count').innerHTML = "I have: ";
		$('profile-friend-count').appendChild(frlink);
		var falink = document.createElement("a");
		falink.href = "#";
		falink.innerHTML = user.fan_count;
		falink.style.color = properties.ui.link_color;
		falink.addEventListener("click", function() {
			PownceMonkey.doNavigateToURL("http://pownce.com/" + user.username + "/fans/");
		});
		$('profile-fan-count').appendChild(falink);
		$('profile-fan-count').appendChild(document.createTextNode(" people think I'm awesome."));
		var faolink = document.createElement("a");
		faolink.href = "#";
		faolink.innerHTML = user.fan_of_count;
		faolink.style.color = properties.ui.link_color;
		faolink.addEventListener("click", function() {
			PownceMonkey.doNavigateToURL("http://pownce.com/" + user.username + "/fan_of/");
		});
		$('profile-fanof-count').innerHTML = "I think ";
		$('profile-fanof-count').appendChild(faolink);
		$('profile-fanof-count').appendChild(document.createTextNode(" people rock the internet."));
		var join = user.id;
		join += '';
		x = join.split('.');
		x1 = x[0];
		x2 = x.length > 1 ? '.' + x[1] : '';
		var rgx = /(\d+)(\d{3})/;
		while (rgx.test(x1)) {
			x1 = x1.replace(rgx, '$1' + ',' + '$2');
		}
		join = x1 + x2;
		var suffx = "";
		switch(join.substring(join.length-1,join.length)) {
			case "1":
				suffx = "st";
			break;
			case "2":
				suffx = "nd";
			break;
			case "3":
				suffx = "rd";
			break;
			default:
				suffx = "th";
			break;
		}
		if(join.substring(join.length-2,join.length)=="11"||join.substring(join.length-2,join.length)=="12"||join.substring(join.length-2,join.length)=="13")
			suffx = "th";
		$('profile-member-join').innerHTML = "I was the " + join + suffx + " person to join pownce.";
	},
	uiSetNoteDetail: function(note) {
		if (note.type == "event") {
			$('rsvp_block').style.display = "block";
			$('rating').style.display = "none";
		}
		else {
			$('rsvp_block').style.display = "none";
			$('rating').style.display = "block";
			var ssname = note.sender.short_name;
			if(this.getUserFullName(note.sender.id))
				ssname = this.getUserFullName(note.sender.id);
			$('rate-user-note').innerHTML = "Rate " + ssname + "'s Note!";
		}
		var img = document.createElement("img");
        img.addEventListener("click", function(){
			chat.uiChangeView("profile",note.sender.username);
        });
		img.src = note.sender.profile_photo_urls.medium_photo_url;
        img.width = "48";
        img.height = "48";
        $('user-note-image').appendChild(img);
        if (note.sender.is_pro) {
            var empro = document.createElement("em");
            empro.className = "pro-2";
            empro.innerHTML = "Pro!";
            $('user-note-image').appendChild(empro);
        }
		
		$('note-detail-body').appendChild(this.ui.prepareNoteBody(note.body));
        
		var ssname = note.sender.short_name;
		if(this.getUserFullName(note.sender.id))
			ssname = this.getUserFullName(note.sender.id);
		$('note-details').innerHTML = note.type + " by " + ssname + ", ";
		$('note-details').className = "details-" + note.type;
        var span = document.createElement("span");
        span.innerHTML = note.display_since;
        $('note-details').appendChild(span);
         var areplies = document.createElement("a");
            areplies.href = "#";
            areplies.style.color = properties.ui.link_color;
            areplies.id = note.id + "_replies";
            areplies.innerHTML = note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies");
            $('note-bottom-details').appendChild(areplies);
            $('note-bottom-details').appendChild(document.createTextNode(" | "));
            var frwd = document.createElement("a");
            frwd.style.color = properties.ui.link_color;
            frwd.href = "#";
            frwd.className = "forwardlink";
            frwd.innerHTML = "Forward";
            frwd.addEventListener("click", function(){
				$('forward-message').value = "!" + note.sender.username + " says: " + note.body;
				$('forward-username').value = note.sender.username;
				$('forward-noteid').value = note.id;
				$('forward-note').style.display = "block";
            });
            $('note-bottom-details').appendChild(frwd);
            var fav = document.createElement("a");
			fav.style.color = properties.ui.link_color;
			fav.href = "#";
			fav.className = "favoritelink";
			fav.innerHTML = "Favorite";
            fav.addEventListener("click", function(){
				chat.addFavoriteToDB(note);
            });
			$('note-bottom-details').appendChild(document.createTextNode(" | "));
            $('note-bottom-details').appendChild(fav);
        if (note.sender.username == properties.user.username) {
			$('note-bottom-details').appendChild(document.createTextNode(" | "));
            var del = document.createElement("a");
            del.href = "#";
            del.style.color = properties.ui.link_color;
            del.className = "deletelink";
            del.innerHTML = "Delete";
            del.addEventListener("click", function(){
                chat.doDeleteNote(note.id);
            });
            $('note-bottom-details').appendChild(del);
        }
        if (note.stars && note.stars != "None" && note.stars != "0.0") {
            var strsn = document.createElement("div");
            strsn.className = "stars-note";
            var strs = document.createElement("div");
            strs.className = "stars";
            var strss = document.createElement("span");
            strss.innerHTML = note.stars + " stars";
            strss.className = "stars-" + note.stars.replace(".", "");
            strs.appendChild(strss);
            strsn.appendChild(strs);
            $('note-stars').appendChild(strsn);
        }
		$('note-link').innerHTML = "";
		if (note.link) {
			var res = this.ui.prepareNoteLink(note,true);
			$('note-link').appendChild(res.medlnk);
			$('note-detail-media-object').appendChild(res.medobj);
		}
		if (note.file) {
            var alink = document.createElement("a");
            alink.className = "media-link";
            alink.href = "#";
            alink.innerHTML = note.file.url[0].substring(0, 25) + ((note.file.url[0].length > 25) ? "..." : "");
            $('note-link').appendChild(alink);
            alink.addEventListener("click", function(event){
                PownceMonkey.doNavigateToURL(note.file.url[0]);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
        }


	},
    uiSetTheme: function(header, note, link){
        properties.ui.link_color = link;
        $('user-current-header-color').innerHTML = header.substring(1);
        $('user-current-note-color').innerHTML = note.substring(1);
        $('note-body-style').href = "skin/default/images/n-" + note.substring(1) + "/" + note + ".css";
		$('header-style').href = "skin/default/images/h-" + header.substring(1) + "/" + header + ".css";
        $('play-sound').style.color = link;
        this.loadNotes();
    },
	uiShowFilter: function() {
		if(!$('filter-messages').checked&&!$('filter-links').checked&&!$('filter-files').checked&&!$('filter-events').checked&&!$('filter-reply').checked&&$('filter-keyword').value=="")
			return;
		$('filter-box').style.display = "block";
		$('notes').style.marginTop = "20px";
		properties.filter.type.message = $('filter-messages').checked;
		properties.filter.type.link = $('filter-links').checked;
		properties.filter.type.file = $('filter-files').checked;
		properties.filter.type.event = $('filter-events').checked;
		properties.filter.type.reply = $('filter-reply').checked;
		var keywords = $('filter-keyword').value.split(/\s/gim);
		var filterstr = "";
		for(i=0;i<keywords.length;i++) {
			properties.filter.keywords.push(keywords[i]);
		}
		filterstr += $('filter-keyword').value;
		if(properties.filter.type.message||properties.filter.type.link||properties.filter.type.file||properties.filter.type.event||properties.filter.type.reply) {
			filterstr += " type:";
			if(properties.filter.type.message)
				filterstr += "messages,";
			if(properties.filter.type.link)
				filterstr += "links,";
			if(properties.filter.type.file)
				filterstr += "files,";
			if(properties.filter.type.event)
				filterstr += "events,";
			if(properties.filter.type.reply)
				filterstr += "replies,";
			filterstr = filterstr.substring(0,filterstr.length - 1) + " ";
		}
		else {
			properties.filter.type.message = true;
			properties.filter.type.link = true;
			properties.filter.type.file = true;
			properties.filter.type.event = true;
			properties.filter.type.reply = true;
		}
		$('filter-message').innerHTML = filterstr;
		this.ui.refreshNotes();
	},
	uiShowRepliersList: function() {
		var right = "170px";
		$('reply-people').style.display = "block";
		$('reply-button').style.right = right;
		$('reply-body').style.right = right;
		$('reply-notes').style.right = right;
		$('rating').style.right = "260px";
		$('rsvp_block').style.right = "260px";
		$('toggle-reply-list').innerHTML = "&#171;<br/>&#171;<br/>&#171;";
		$('toggle-reply-list').className = "list-shown";
		properties.settings.hide_list = false;
		//$('settings-hide-contact-list').checked = false;
	},
	
    /** Loading Functions **/
    loadReplies: function(){
		this.ui.systemMessage("Loading Replies");
        var id = properties.ui.currentNoteDetail;
        var note = this.getNoteById(id);
        if (!note) {
            this.ui.systemMessage("Could not load Replies");
            
            return;
        }
        properties.filter.repliers = {
            count: 0
        };
        $('repliers-cnt').innerHTML = "0 ";
        note.authors = {};
        var a = 0;
        for (i = 0; i < note.replies.length; i++) {
            var reply = note.replies[i];
            var user = reply.sender;
            var replydom = this.uiCreateReply(reply);
            note.replies[i].replydomobj = replydom;
            this.ui.addReply(replydom);
            if (!note.authors[user.id]) {
                var userdom = this.uiCreateReplier(user);
                user.replydomobj = userdom;
                this.ui.addReplier(userdom);
                note.authors[user.id] = true;
                a++;
            }
        }
		if (a == 0) {
            $('repliers').parentNode.style.display = "none";
        }
        $('reply-notes').scrollTop = $('reply-notes').scrollHeight;
        $('repliers-cnt').innerHTML = a + " ";
        this.ui.systemMessage("Replies loaded");
    },
    loadNotes: function(){
		this.ui.systemMessage("Loading Notes");
        if (!properties.json.notes) {
            this.ui.systemMessage("Could not load Notes");
            
            return;
        }
        $('notes').innerHTML = "";
		properties.filter.users = {};
		properties.filter.users.count = 0;
		properties.json.online_peeps = {};
        properties.ui.latestNoteId = properties.json.notes[0].id;
		
		if (properties.pages.currentNotesPage > 0) {
			var li = document.createElement("li");
			li.className = "paging";
			//li.appendChild(document.createTextNode(((properties.pages.currentNotesPage==0)?1:(properties.pages.currentNotesPage)*properties.settings.max_notes + 1) + "-" + ((properties.pages.currentNotesPage+1)*properties.settings.max_notes)));
			var firstdiv = document.createElement("div");
			firstdiv.className = "first-notes";
			firstdiv.style.color = properties.ui.link_color;
			firstdiv.innerHTML = "First Page";
			firstdiv.addEventListener('click',function() {
				properties.ui.current_scroll_note = 0;
				$('notes').innerHTML = "";
				properties.pages.currentNotesPage = 0;
				chat.getNotes();
			});
			li.appendChild(firstdiv);
			var nextdiv = document.createElement("div");
			nextdiv.className = "next-notes";
			nextdiv.style.color = properties.ui.link_color;
			nextdiv.innerHTML = "Next Page &#187;";
			nextdiv.addEventListener('click',function() {
				chat.nextNotesPage();
			});
			li.appendChild(nextdiv);
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "&#171; Previous Page";
			prevdiv.style.color = properties.ui.link_color;
			prevdiv.addEventListener('click', function(){
				chat.lastNotesPage();
			});
			li.appendChild(prevdiv);
			this.ui.addNote(li);
		}
        for (i = 0; i < properties.json.notes.length; i++) {
            var note = properties.json.notes[i];
			if (!properties.json.online_peeps[note.sender.id]) {
				var peep = {};
				peep.visible = true;
				if (note.seconds_since < 1801) {
					peep.status = "online";
				} else {
					peep.status = "away";
				}
				properties.json.online_peeps[note.sender.id] = peep;
			}
            var notedom = $("note_" + note.id);
            if (!notedom) {
                notedom = this.uiCreateNote(note);
            }
            this.ui.addNote(notedom);
        }
		this.loadPeople();
		var li = document.createElement("li");
		li.className = "paging";
		//li.appendChild(document.createTextNode(((properties.pages.currentNotesPage==0)?1:(properties.pages.currentNotesPage)*properties.settings.max_notes + 1) + "-" + ((properties.pages.currentNotesPage+1)*properties.settings.max_notes)));
		var nextdiv = document.createElement("div");
		nextdiv.className = "next-notes";
		nextdiv.style.color = properties.ui.link_color;
		nextdiv.innerHTML = "Next Page &#187;";
		nextdiv.addEventListener('click',function() {
			chat.nextNotesPage();
		});
		li.appendChild(nextdiv);
		if (properties.pages.currentNotesPage > 0) {
			var firstdiv = document.createElement("div");
			firstdiv.className = "first-notes";
			firstdiv.style.color = properties.ui.link_color;
			firstdiv.innerHTML = "First Page";
			firstdiv.addEventListener('click',function() {
				properties.ui.current_scroll_note = 0;
				$('notes').innerHTML = "";
				properties.pages.currentNotesPage = 0;
				chat.getNotes();
			});
			li.appendChild(firstdiv);
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "&#171; Previous Page";
			prevdiv.style.color = properties.ui.link_color;
			prevdiv.addEventListener('click', function(){
				chat.lastNotesPage();
			});
			li.appendChild(prevdiv);
		}
		this.ui.addNote(li);
        this.ui.systemMessage("Notes loaded");
		this.ui.refreshNotes();
    },
    loadProperties: function(){
		this.ui.systemMessage("Loading properties");
        var f = air.File.applicationStorageDirectory.resolvePath("pm.properties");
        var fs = new air.FileStream();
        try {
            fs.open(f, air.FileMode.READ);
            var content = fs.readUTFBytes(fs.bytesAvailable);
            fs.close();
            if (content) {
                var props = eval('(' + content + ')');
				if(!props.version||props.version < VERSION) {
					//new install
				}
                if (props.settings) {
					
					for(var prop in props.settings) {
						air.trace("props.settings." + prop + " = " + props.settings[prop]);
						properties.settings[prop] = props.settings[prop];
					}
					
					$('settings-app-transparency').innerHTML = Math.floor(properties.settings.transparency * 100) + "%"
					this.ui.transparency(properties.settings.transparency);
					$('font-size-1').className = "";
		            $('font-size-2').className = "";
		            $('font-size-3').className = "";
		            $('font-size-4').className = "";
                    $('font-size-' + props.settings.font_size).className = "current-font-size";
		            document.body.className = document.body.className.replace(/fontSize[1-4]/, "fontSize" + props.settings.font_size);
                    $('settings-download-theme').checked = properties.settings.download_theme;
                    $('settings-friend-requests').checked = properties.settings.friend_request_alert;
                    $('settings-min-to-tray').checked = properties.settings.minimize_to_tray;
                    $('settings-auto-login').checked = properties.settings.auto_login;
                    $('settings-notes-collapsible').checked = properties.settings.notes_collapsible;
                    $('settings-max-notes').value = properties.settings.max_notes;
                    $('settings-play-sound').checked = properties.settings.play_sound;
					$('settings-hide-offline-users').checked = properties.settings.hide_offline;
					$('settings-hide-toolbar').checked = properties.settings.hide_toolbar;
					//$('settings-hide-contact-list').checked = properties.settings.hide_list;
					if (properties.settings.hide_list) {
						this.ui.hideRepliersList();
					}
					else {
						this.uiShowRepliersList();
					}
					$('settings-toolbar-text').checked = properties.settings.toolbar_icon_text;
					if(properties.settings.toolbar_icon_text)
						$('toolbar').className = "";
					else
						$('toolbar').className = "toolbar-icon";
					
                }
            }
            var storedValue = air.EncryptedLocalStore.getItem("username");
            if (storedValue) {
                properties.user.username = storedValue.readUTFBytes(storedValue.length);
            }
            var storedValue = air.EncryptedLocalStore.getItem("password");
            if (storedValue) {
                properties.user.password = storedValue.readUTFBytes(storedValue.length);
            }
			this.ui.systemMessage("Properties loaded");
        } 
        catch (e) {
        }
    },
    loadSendToList: function(){
        if (!properties.json.send_to.options) {
            this.ui.systemMessage("Could not load Send To List");
            return;
        }
		var currentfilter = $('send-to-filter');
		if(properties.ui.current_view!="new")
			currentfilter = $('forward-to-filter');
		$('send-to-filter').innerHTML = "";
		$('forward-to-filter').innerHTML = "";
        var sel = properties.json.send_to.selected;
        properties.ui.defaultSendto.id = sel;
		if ("the public".match(properties.filter.sendtostr.toLowerCase())) {
			var pubau = this.ui.createAutocomplete("the public", "", "http://api.pownce.com/profile_photos/p/o/w/pownce/4134_small.jpg", "public");
			if(currentfilter.childNodes.length==0)
				pubau.id = "selectedsendto";
			currentfilter.appendChild(pubau);
		}
        if (sel == "public") 
            properties.ui.defaultSendto.fullname = "the public";
		if (properties.json.send_to.options["all"].toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
			var allau = this.ui.createAutocomplete(properties.json.send_to.options["all"], "", "", "all");
			if(currentfilter.childNodes.length==0)
				allau.id = "selectedsendto";
			currentfilter.appendChild(allau);
		}
		if (properties.ui.current_view!="new"&&"my friends who haven't seen this yet".toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
			var newau = this.ui.createAutocomplete("my friends who haven't seen this yet", "", "", "newbies");
			if(currentfilter.childNodes.length==0)
				newau.id = "selectedsendto";
			currentfilter.appendChild(newau);
		}
        if (sel == "all") 
            properties.ui.defaultSendto.fullname = "all my friends";
		var setnamearray = [];
		var reversedsets = {};
        for (var set in properties.json.send_to.options.set) {
            setnamearray.push(properties.json.send_to.options.set[set]);
			reversedsets[properties.json.send_to.options.set[set]] = set;
        }
		setnamearray.sort();
        for (var s = 0; s < setnamearray.length; s++) {
            if (setnamearray[s].toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
				var setau = this.ui.createAutocomplete(setnamearray[s], "", "", reversedsets[setnamearray[s]]);
				if(currentfilter.childNodes.length==0)
					setau.id = "selectedsendto";
				currentfilter.appendChild(setau);
			}
			if (sel == set) 
            	properties.ui.defaultSendto.fullname = setnamearray[s];
        }
		var namearray = [];
		var reversedfriends = {};
        for (var private_note in properties.json.send_to.options.private_note) {
            namearray.push(properties.json.send_to.options.private_note[private_note]);
			reversedfriends[properties.json.send_to.options.private_note[private_note]] = private_note;
        }
		namearray.sort();
		this.setAllRelationships("fanof");
		for (i = 0; i < namearray.length; i++) {
            var id = reversedfriends[namearray[i]].substring(reversedfriends[namearray[i]].indexOf("_") + 1);
			this.setPersonRelationship(id,"friend");
			properties.json.fullname[id] = namearray[i];
			var user = this.getFriendById(id);
			if (namearray[i].toLowerCase().match(properties.filter.sendtostr.toLowerCase())||user.username.toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
				var pnau = this.ui.createAutocomplete(namearray[i], user.username, user.profile_photo_urls.small_photo_url, reversedfriends[namearray[i]]);
				if(currentfilter.childNodes.length==0)
					pnau.id = "selectedsendto";
				currentfilter.appendChild(pnau);
			}
        }
    },
	openFile: function(event) {
	    if (event.arguments.length > 0){
	        var path = event.arguments[0];
			alert(path);
			var template = {};
			if (path.match(/.pmxml$/)) {
				var file = new air.File();
				file.nativePath = path;
				var fileStream = new air.FileStream();
				fileStream.open(file, air.FileMode.READ);
				var prefsXMLstr = fileStream.readUTFBytes(fileStream.bytesAvailable);
				fileStream.close();
				template = this.readXMLTemplate(prefsXMLstr);
				
			}
			properties.json.templates.sort(this.sortTemplates);
			this.loadTemplates();
			chat.uiChangeView("new",template.type);
			$('send-to-id').value = template.to;
			$('body').value = template.body;
	    }
	},
    getTemplates: function() {
        var dir = air.File.applicationStorageDirectory.resolvePath("templates");
		dir.createDirectory();
		var contents = dir.getDirectoryListing();
		
		var defdir = air.File.applicationDirectory.resolvePath("default/templates");
		var defcontents = defdir.getDirectoryListing();
		for (d = 0; d < defcontents.length; d++) 
		{
			var newFile = air.File.applicationStorageDirectory.resolvePath("templates/" + defcontents[d].name);
			if(!newFile.exists&&newFile.name.match(/.pmxml$/))
		    	defcontents[d].copyTo(newFile, true);
		}
		contents = dir.getDirectoryListing();
		
		for (i = 0; i < contents.length; i++) 
		{
			if (contents[i].nativePath.match(/.pmxml$/)) {
				var fileStream = new air.FileStream();
				fileStream.open(contents[i], air.FileMode.READ);
				var prefsXMLstr = fileStream.readUTFBytes(fileStream.bytesAvailable);
				fileStream.close();
				this.readXMLTemplate(prefsXMLstr);
			}
		}
		properties.json.templates.sort(this.sortTemplates);
		this.loadTemplates();
	},
	readXMLTemplate: function(prefsXMLstr) {
		try {
			var domParser = new DOMParser();
			var prefsXML = domParser.parseFromString(prefsXMLstr, "text/xml");
			var template = {};
			template.name = prefsXML.getElementsByTagName('name')[0].firstChild.nodeValue;
			template.type = prefsXML.getElementsByTagName('type')[0].firstChild.nodeValue;
			template.to = prefsXML.getElementsByTagName('to')[0].firstChild.nodeValue;
			template.body = prefsXML.getElementsByTagName('body')[0].childNodes[0].nodeValue;
			properties.json.templates.push(template);
			return template;
		}
		catch(error) {
			this.ui.systemMessage("Loading Template error: " + error.message + " \nxmlstr: " + prefsXMLstr,6);
		}
	},
	loadTemplates: function() {
		for (i = 0; i < properties.json.templates.length; i++) {
			var template = properties.json.templates[i];
			this.processTemplate(template,i);
		}
	},
	processTemplate: function(template,index) {
		var command = properties.menu.template.addItem(new air.NativeMenuItem(template.name));
	    command.addEventListener(air.Event.SELECT, function(){
			chat.uiChangeView("new",template.type);
			$('send-to-id').value = template.to;
			$('body').value = template.body;
		});
	},
	saveTemplate: function() {
		var name = this.ui.systemMessage("What would you like to call this template?",8);
		if(this.getTemplateByName(name)) {
			if (!this.ui.systemMessage("A template of that name already exists, would you like to overwrite it?", 3)) {
				this.ui.systemMessage("Save template canceled");
				return;
			}
			else {
				for (t = 0; t < properties.json.templates.length; t++) {
		            if (properties.json.templates[t].name == name) {
		                properties.json.templates = properties.json.templates.splice(t,1);
						break;
		            }
		        }
			}
		}
		properties.menu.template = new air.NativeMenu();
		var template = {};
		template.name = name;
		template.type = $('note-type').value;
		template.to = $('send-to-id').value;
		template.body = $('body').value;
		var filename = name.toLowerCase().replace(/\s/g,"_");
		properties.json.templates.push(template);
		properties.json.templates.sort(this.sortTemplates);
		this.loadTemplates();
		var file = air.File.applicationStorageDirectory;
        file = file.resolvePath("templates/" + filename + ".pmxml");
		var xmlvalue = "<?xml version=\"1.0\" encoding=\"utf-8\"?>\n<pmtemplate>\n<name>" + template.name + "</name>\n<type>" + template.type + "</type>\n<to>" + template.to + "</to>\n<body><![CDATA[" + template.body + "]]></body>\n</pmtemplate>";
        var stream = new air.FileStream();
        stream.open(file, air.FileMode.WRITE);
        stream.writeMultiByte(xmlvalue, air.File.systemCharset);
        stream.close();
	}
};

PownceMonkey.doNavigateToURL = function(url){
    var urlReq = new air.URLRequest(url);
    air.navigateToURL(urlReq);
};
PownceMonkey.openImageWindow = function(type, imgsrc){
        //create the init options
        var init = new air.NativeWindowInitOptions();
        var bounds = null;
        var win = null;
        var login;
        var params = "";
		var width;
		var height;
        if (type == "Flickr") {
			login = air.File.applicationDirectory.resolvePath('photo.html');
			imgsrc =  imgsrc.replace(/_m.jpg$/,"_b.jpg");
			params = "?imgsrc=" + imgsrc;
			width = 722;
			height = 479;
		}
        else if (type == "Zooomr") {
			login = air.File.applicationDirectory.resolvePath('photo.html');
			imgsrc =  imgsrc.replace(/_m.jpg$/,".jpg");
			params = "?imgsrc=" + imgsrc;
			width = 722;
			height = 479;
		}
        bounds = new air.Rectangle((air.Capabilities.screenResolutionX - width) / 2, (air.Capabilities.screenResolutionY - height) / 2, width, height);
        init.systemChrome = air.NativeWindowSystemChrome.NONE;
        init.type = air.NativeWindowType.UTILITY;
        init.transparent = false;
        init.minimizable = false;
        init.maximizable = false;
        init.resizable = true;
        win = air.HTMLLoader.createRootWindow(true, init, false, bounds);
        win.load(new air.URLRequest(login.url + params));
    };
PownceMonkey.openVideoWindow = function(type, vid, streamname, user, base){
        //create the init options
        var init = new air.NativeWindowInitOptions();
        var bounds = null;
        var win = null;
        var login;
        var params = "";
		var width;
		var height;
        if (type == "youtube") {
			login = air.File.applicationDirectory.resolvePath('youtube.html');
			params = "?type=" + type + "&vid=" + vid;
			width = 722;
			height = 479;
		} else if (type == "qik") {
			login = air.File.applicationDirectory.resolvePath('qik.html');
			if (vid) {
				params = "?vid=" + vid + "&streamname=" + streamname;
			} else {
				params = "?user=" + user;
			}
			width = 320;
			height = 340;
		} else if (type == "general") {
			login = air.File.applicationDirectory.resolvePath('video.html');
			params = "?vidsrc=" + vid + "&base=" + base;
			width = 320;
			height = 340;
		}
        bounds = new air.Rectangle((air.Capabilities.screenResolutionX - width) / 2, (air.Capabilities.screenResolutionY - height) / 2, width, height);
        init.systemChrome = air.NativeWindowSystemChrome.NONE;
        init.type = air.NativeWindowType.UTILITY;
        init.transparent = false;
        init.minimizable = false;
        init.maximizable = false;
        init.resizable = true;
        win = air.HTMLLoader.createRootWindow(true, init, false, bounds);
        win.load(new air.URLRequest(login.url + params));
    };
PownceMonkey.prepareAPIURL = function(url, options){
    if (!options) 
        options = {};
    url = url.replace(/{filter}/, ((options.filter) ? "&filter=" + options.filter : ""));
    url = url.replace(/{set_id}/, ((options.set_id) ? "&set_id=" + options.set_id : ""));
    url = url.replace(/{type}/, ((options.type) ? "&type=" + options.type : ""));
    url = url.replace(/{since_id}/, ((options.since_id) ? "&since_id=" + options.since_id : ""));
    url = url.replace(/{limit}/, ((options.limit) ? "&limit=" + options.limit : ""));
    url = url.replace(/{page}/, ((options.page) ? "&page=" + options.page : ""));
    url = url.replace(/{note_id}/, ((options.note_id) ? options.note_id : ""));
    url = url.replace(/{show_replies}/, ((options.show_replies) ? "&show_replies=" + options.show_replies : ""));
    url = url.replace(/{recipient_limit}/, ((options.recipient_limit) ? "&recipient_limit=" + options.recipient_limit : ""));
    url = url.replace(/{username}/, properties.user.username);
    url = url.replace(/{rel}/, ((options.rel) ? options.rel : ""));
    url = url.replace(/{relationship}/, ((options.relationship) ? options.relationship : ""));
    url = url.replace(/{app_key}/, "app_key=" + properties.oauth.APP_KEY);
    return url;
};

/** UI related Functions **/
PownceMonkey.prototype.ui = {
    addNote: function(note){
        $('notes').appendChild(note);
    },
    addPerson: function(user){
        $('people').appendChild(user);
    },
    addReplier: function(replier){
        $('repliers').appendChild(replier);
    },
    addReply: function(reply){
        $('reply-notes').appendChild(reply);
    },
    alertNewFriendRequest: function(){
        if (properties.settings.friend_request_alert) {
            var num = properties.user.profile.friend_request_count;
            var res = this.systemMessage("You have " + num + " new friend requests. Accept or deny now?", 3);
            if (res) {
                PownceMonkey.doNavigateToURL("http://pownce.com/friend_requests/");
            }
        }
    },
    clearNewNote: function(){
        properties.ui.upload_file = null;
        properties.ui.upload_file = air.File.desktopDirectory;
        properties.ui.upload_file.addEventListener(air.Event.SELECT, function(e){
            chat.doSelectFile(e);
        });
        properties.ui.upload_file.addEventListener(air.ProgressEvent.PROGRESS, function(e){
            chat.doUploadFileProgress(e);
        });
        properties.ui.upload_file.addEventListener(air.Event.COMPLETE, function(e){
            chat.doUploadFileComplete(e);
        });
        properties.ui.upload_file.addEventListener(air.IOErrorEvent.IO_ERROR, function(error){
            chat.ui.systemMessage("trycatch error: " + e.message, 6);
        });
        $('body').style.display = "block";
        $('file-upload-progress').style.display = "none";
        $('file-upload-message').innerHTML = "";
        $('file-upload-bar').style.width = "0px";
        $('postit').disabled = false;
        $('send-to-id').value = properties.ui.defaultSendto.id;
        $('send-to-text').value = properties.ui.defaultSendto.fullname;
        $('where').value = "Where at?";
        $('what').value = "What's Happening?";
        var today = new Date();
        
        //2008-01-16 20:00
        var month = today.getMonth() + 1;
        if (month < 10) {
            month = "0" + month;
        }
        
        var ampm = "AM"
        
        $('date').value = today.getFullYear() + "-" + month + "-" + today.getDate();
        var min = today.getMinutes();
        if (min < 10) {
            min = "0" + min;
        }
        
        var hr = today.getHours();
        if (hr > 12) {
            hr = hr - 12;
            ampm = "PM";
        }
        
        $('time').value = hr + ":" + min + " " + ampm;
        $('file-url').value = "";
        $('url').value = "http://";
        $('body').value = "post a note...";
    },
    clearProfileDetail: function(){
        $('profile-image').innerHTML = "";
        $('profile-short-name').innerHTML = "";
        $('profile-username').innerHTML = "";
        $('profile-blurb').innerHTML = "";
        $('profile-details').innerHTML = "";
        $('profile-link').innerHTML = "";
        $('profile-friend-count').innerHTML = "";
        $('profile-fan-count').innerHTML = "";
        $('profile-fanof-count').innerHTML = "";
        $('profile-member-join').innerHTML = "";
        $('profile-send-note').innerHTML = "";
        $('profile-unfriend').innerHTML = "";
        $('profile-cancel-request').innerHTML = "";
        $('profile-addfriend').innerHTML = "";
        $('profile-other-profiles').innerHTML = "";
        $('profile-last-pownce').innerHTML = "";
    },
    clearReply: function(){
        $('user-note-image').innerHTML = "";
        $('reply-notes').innerHTML = "";
        $('repliers').innerHTML = "";
        $('rate-user-note').innerHTML = "";
        $('repliers-disclose').className = "disclose-open";
        $('repliers').style.display = "block";
        $('note-details').innerHTML = "";
        $('note-detail-body').innerHTML = "";
        $('note-bottom-details').innerHTML = "";
        $('note-stars').innerHTML = "";
        $('note-link').innerHTML = "";
        $('note-detail-media-object').innerHTML = "";
    },
    collapseAllNotes: function(){
        for (i = 0; i < properties.json.notes.length; i++) {
            var note = properties.json.notes[i];
            $("note_" + note.id).className = $("note_" + note.id).className.replace("nexpanded", "ncollapsed");
        }
    },
    collapseNote: function(note){
        $("note_" + note.id).className = $("note_" + note.id).className.replace("nexpanded", "ncollapsed");
    },
    configureForOS: function(os){
        switch (os) {
            case "mac-os":
                $('settings-min-to-tray').style.display = "none";
                $('min-to-tray-label').style.display = "none";
                break;
            case "win-os":
                
                break;
        }
    },
    createAutocomplete: function(fname, fusername, imgurl, id){
        var li = document.createElement("li");
        li.setAttribute("sendtoid", id);
        var photo = document.createElement("div");
        photo.className = "photo";
        if (imgurl != "") {
            var img = document.createElement("img");
            img.src = imgurl;
            img.width = "24";
            img.height = "24";
            photo.appendChild(img);
        }
        li.appendChild(photo);
        var name = document.createElement("div");
        name.className = "name";
        name.innerHTML = fname;
        li.appendChild(name);
        var username = document.createElement("div");
        username.className = "username";
        if (fusername != "") 
            username.innerHTML = "(" + fusername + ")";
        li.appendChild(username);
        li.addEventListener('click', function(e){
            if (properties.ui.current_view == "new") {
                $('send-to-filter').style.display = "none";
                $('send-to-text').value = fname;
                $('send-to-id').value = id;
            } else {
                $('forward-to-filter').style.display = "none";
                $('forward-to-text').value = fname;
                $('forward-to-id').value = id;
            }
        });
        return li;
    },
    createMediaCredits: function(type, author, link, note_id){
        var medobjcred = document.createElement("div");
        medobjcred.className = "media-object-credits";
        medobjcred.innerHTML = type + " by ";
        var authlink = document.createElement("a");
        authlink.innerHTML = author;
        authlink.style.color = properties.ui.link_color;
        authlink.addEventListener("click", function(event){
            PownceMonkey.doNavigateToURL(link);
            if (properties.settings.notes_collapsible) 
                chat.uiShowNoteDetails(note_id);
        });
        medobjcred.appendChild(authlink);
        return medobjcred;
    },
    createMediaTitle: function(title){
        var medobjtitle = document.createElement("div");
        medobjtitle.className = "media-object-title";
        medobjtitle.innerHTML = title;
        return medobjtitle;
    },
	createOtherProfile: function(url,site,name) {
		var div = document.createElement("div");
		var ulink = document.createElement("a");
		ulink.href = "#";
		ulink.innerHTML = name;
		ulink.className = site;
		ulink.style.color = properties.ui.link_color;
		ulink.addEventListener("click", function(){
			PownceMonkey.doNavigateToURL(url);
		});
		div.appendChild(ulink);
		return div;
	},
    createPerson: function(user){
        var userdom = document.createElement("li");
        userdom.className = "person";
		
		var divimglnk = document.createElement("div");
		divimglnk.className = "img-link";
		var userimg = document.createElement("img");
        userimg.src = user.profile_photo_urls.medium_photo_url;
        divimglnk.appendChild(userimg);
		divimglnk.addEventListener("click",function(){
			chat.uiChangeView("profile",user.username);
		});
		userdom.appendChild(divimglnk);
		
        var name = document.createElement("div");
		name.className = "name";
		name.innerHTML = user.name;
		var status = document.createElement("span");
		status.className = user.status;
		if(user.status=="online")
			status.innerHTML = "Online";
		if(user.status=="offline")
			status.innerHTML = "Offline";
		if(user.status=="away")
			status.innerHTML = "Away";
		name.appendChild(status);
		userdom.appendChild(name);
		
		var usrnspan = document.createElement("div");
		usrnspan.className = "username";
		usrnspan.innerHTML = "(" + user.username + ")";
		userdom.appendChild(usrnspan);

		var det = document.createElement("div");
		det.className = "details";
		var detstr = "";
		if(user.age)
			detstr += user.age + "-year-old ";
		if(user.gender)
			detstr += user.gender + " ";
		if(user.location)
			detstr += "from " + user.location;
		if(detstr!="")
			det.innerHTML = detstr;
		else
			det.innerHTML = "&nbsp;";
		userdom.appendChild(det);
		
		
		var btmdet = document.createElement("div");
		btmdet.className = "bottom-details";
		if(user.relationship=="friend") {
			var prvnote = document.createElement("div");
			prvnote.className = "private-note";
			prvnote.innerHTML = "Send Note";
			prvnote.addEventListener("click", function(){
				chat.uiNewNoteTo(user.id);
			});
			btmdet.appendChild(prvnote);
			
			var unfriend = document.createElement("div");
			unfriend.className = "unfriend";
			unfriend.innerHTML = "Unfriend";
			unfriend.addEventListener("click", function(){
				chat.doRemoveFriend(user.username);
			});
			btmdet.appendChild(unfriend);
		}
		else if(user.relationship=="fanof") {
			var cancel = document.createElement("div");
			cancel.className = "cancel";
			cancel.innerHTML = "Cancel Request";
			cancel.addEventListener("click", function(){
				chat.doCancelRequest(user.username);
			});
			btmdet.appendChild(cancel);
		}
		userdom.appendChild(btmdet);
				
        var menu = new air.NativeMenu();
		if (user.relationship == "friend") {
			var sendNote = menu.addItem(new air.NativeMenuItem("Send Note"));
			sendNote.addEventListener(air.Event.SELECT, function(){
				chat.uiNewNoteTo(user.id);
			});
			var addFriend = menu.addItem(new air.NativeMenuItem("Remove Friend"));
			addFriend.addEventListener(air.Event.SELECT, function(){
				chat.doRemoveFriend(user.username);
			});
		} else if (user.relationship == "fanof") {
			var cancelRequest = menu.addItem(new air.NativeMenuItem("Cancel Request"));
			cancelRequest.addEventListener(air.Event.SELECT, function(){
				chat.doCancelRequest(user.username);
			});
		}
		userdom.addEventListener("contextmenu", function(event){
            event.preventDefault();
            menu.display(window.nativeWindow.stage, event.clientX, event.clientY);
        });
		return userdom;
    },
	hideFilter: function() {
		$('filter-box').style.display = "none";
		$('filter-message').innerHTML = "";
		properties.filter.type.message = true;
		properties.filter.type.link = true;
		properties.filter.type.file = true;
		properties.filter.type.event = true;
		properties.filter.type.reply = true;
		properties.filter.keywords = [];
		$('filter-messages').checked = false;
		$('filter-links').checked = false;
		$('filter-files').checked = false;
		$('filter-events').checked = false;
		$('filter-reply').checked = false;
		$('filter-keyword').value = "";
		$('notes').style.marginTop = "0px";
		this.refreshNotes();
	},
    hideRepliersList: function() {
		var right = "5px";
		$('reply-people').style.display = "none";
		$('reply-button').style.right = right;
		$('reply-body').style.right = right;
		$('reply-notes').style.right = right;
		$('rating').style.right = "100px";
		$('rsvp_block').style.right = "100px";
		$('toggle-reply-list').innerHTML = "&#187;<br/>&#187;<br/>&#187;";
		$('toggle-reply-list').className = "list-hidden";
		properties.settings.hide_list = true;
		//$('settings-hide-contact-list').checked = true;
	},
	hideToolbar: function() {
		$('toolbar').style.display = "none";
		$('reply-view').style.top = "40px";
		$('note-view').style.top = "40px";
		$('settings').style.top = "40px";
	},
    notify: function(){
    
        if (properties.ui.is_osx) {
            air.NativeApplication.nativeApplication.icon.bounce();
        } else if (properties.ui.is_win) {
        
        }
        air.NativeApplication.nativeApplication.icon.bitmaps = properties.ui.secondary_icon;
        window.nativeWindow.notifyUser(air.NotificationType.INFORMATIONAL);
    },
	prepareNoteBody : function(body){
	    //body = unescape(body);
	    var bdy = document.createElement("p");
	    
	    var UNICODE_CHAR = " //#/< ";
	    var USERNAME_CHAR = " /!/#/< ";
	    var URL_CHAR = " /!#/!/< ";
	    
	    body = body.replace(/</gim, "&lt;");
	    body = body.replace(/\r{0,1}\n/gim, " <br/> ");
	    var uni = body.match(/(\\u00[0-9a-f]{2})+/gim);
	    
	    if (uni) {
	        body = body.replace(/(\\u00[0-9a-f]{2})+/gim, UNICODE_CHAR);
	        ;
	        var tempbdy = body.split(UNICODE_CHAR);
	        body = "";
	        for (c = 0; c < uni.length; c++) {
	            var unc = uni[c].replace(/\\u00/gim, " ");
	            unc = unc.substring(1);
	            text = convertUTF82CP(unc);
	            body += tempbdy[c] + text;
	        }
	        if (tempbdy[tempbdy.length - 1]) {
	            body += tempbdy[tempbdy.length - 1];
	        }
	    }
	    
	    var urls = body.match(/(ftp|http|https|file)(:\/\/[\S]+)/gim);
	    if (urls) {
	        body = body.replace(/(ftp|http|https|file)(:\/\/[\S]+)/gim, URL_CHAR);
	        var tempbdy = body.split(URL_CHAR);
	        body = "";
	        for (c = 0; c < urls.length; c++) {
	            var url = urls[c];
	            body += tempbdy[c] + '<a href="#' + url + '" style="color:' + properties.ui.link_color + ';">' + url.substring(0, 25) + ((url.length > 25) ? "..." : "") + '</a>';
	        }
	        if (tempbdy[tempbdy.length - 1]) {
	            body += tempbdy[tempbdy.length - 1];
	        }
	    }
	    
	    var usernames = body.match(/!\w[\w\d_]{0,15}/gim);
	    if (usernames) {
	        body = body.replace(/!\w[\w\d_]{0,15}/gim, USERNAME_CHAR);
	        ;
	        var tempbdy = body.split(USERNAME_CHAR);
	        body = "";
	        for (c = 0; c < usernames.length; c++) {
	            var username = usernames[c];
	            username = username.substring(1);
	            body += tempbdy[c] + '!<a href="#!' + username + '" style="color:' + properties.ui.link_color + ';">' + username + '</a>';
	        }
	        if (tempbdy[tempbdy.length - 1]) {
	            body += tempbdy[tempbdy.length - 1];
	        }
	    }
	    
	    body = body.replace(/\s:\-{0,1}\)/gim, "<span class='emo_smile'></span>");
	    body = body.replace(/\s:\-{0,1}\(/gim, "<span class='emo_frown'></span>");
	    body = body.replace(/\s;\-{0,1}[\)D]/gim, "<span class='emo_wink'></span>");
	    body = body.replace(/\s:\-{0,1}D/gim, "<span class='emo_grin'></span>");
	    body = body.replace(/\s:\-{0,1}P/gim, "<span class='emo_tongue'></span>");
	    body = body.replace(/\s>:\-{0,1}[\)D]/gim, "<span class='emo_evilgrin'></span>");
	    body = body.replace(/\s:\-{0,1}[0oO]/gim, "<span class='emo_surprise'></span>");
	    
	    bdy.innerHTML = body;
	    
	    var links = bdy.getElementsByTagName("a");
	    for (l = 0; l < links.length; l++) {
	        links[l].addEventListener("click", function(event){
	            var urllnk = event.target + "";
	            urllnk = urllnk.substring(urllnk.indexOf("#") + 1);
	            if (urllnk.indexOf("!") == 0) 
	                chat.uiChangeView("profile", urllnk.substring(1));
	            else 
	                PownceMonkey.doNavigateToURL(urllnk);
	        });
	    }
	    return bdy;
	},
	prepareNoteEvent : function(note){
	    var dl = document.createElement("dl");
	    var dtwhat = document.createElement("dt");
	    dtwhat.innerHTML = "What";
	    var ddwhat = document.createElement("dd");
	    ddwhat.innerHTML = note.event.name;
	    var dtwhere = document.createElement("dt");
	    dtwhere.innerHTML = "Where";
	    var ddwhere = document.createElement("dd");
	    ddwhere.innerHTML = note.event.location;
	    var dtwhen = document.createElement("dt");
	    dtwhen.innerHTML = "When";
	    var ddwhen = document.createElement("dd");
	    var date = new Date(); //2008-05-03 15:00:00
	    date.setYear(note.event.date.substring(0, 4));
	    date.setMonth(note.event.date.substring(5, 7) - 1);
	    date.setDate(note.event.date.substring(8, 10));
	    date.setHours(note.event.date.substring(11, 13));
	    date.setMinutes(note.event.date.substring(14, 16));
	    date.setSeconds(note.event.date.substring(17, 19));
	    ddwhen.innerHTML = formatDate(date, 'E, MMM yyyy ') + "at" + formatDate(date, ' h:mm a');
	    dl.appendChild(dtwhat);
	    dl.appendChild(ddwhat);
	    dl.appendChild(dtwhere);
	    dl.appendChild(ddwhere);
	    dl.appendChild(dtwhen);
	    dl.appendChild(ddwhen);
	    return dl;
	},
	prepareNoteFile : function(note){
	    var medobj = document.createElement("div");
	    var medlnk = document.createElement("a");
	    if (note.file.type == "image") {
	        var imglnk = document.createElement("a");
	        imglnk.className = "media-object";
	        imglnk.addEventListener("click", function(event){
	            PownceMonkey.doNavigateToURL(note.file.url[0]);
	            chat.doMarkAsDownloaded(note.id);
	            if (properties.settings.notes_collapsible) 
	                chat.uiShowNoteDetails(note.id);
	        });
	        var img = document.createElement("img");
	        img.src = note.file.aws_url[0];
	        imglnk.appendChild(img);
	        medobj.appendChild(imglnk);
	    } else if (note.file.type == "audio") {
	        var mp3player = new AIRMP3Player({
	            url: note.file.url[0]
	        });
	        var playr = mp3player.getDOMObject();
	        playr.style.marginLeft = "-20px";
	        medobj.appendChild(playr);
	    }
	    var medlnk = document.createElement("a");
	    medlnk.className = "media-link";
	    medlnk.href = "#";
	    medlnk.innerHTML = note.file.url[0].substring(0, 25) + ((note.file.url[0].length > 25) ? "..." : "");
	    medlnk.addEventListener("click", function(event){
	        PownceMonkey.doNavigateToURL(note.file.url[0]);
	        chat.doMarkAsDownloaded(note.id);
	    });
	    return {
	        medobj: medobj,
	        medlnk: medlnk
	    };
	},	
	prepareNoteLink: function(note,min) {
		var medobj = document.createElement("div");
		var medlnk = document.createElement("a");
			medlnk.className = "media-link";
			if(note.link.oembed) {
				if(note.link.oembed.type == "video") {
		            medlnk.className += " play-video-link";
					if (note.link.oembed.provider_name == "YouTube") {
						var vidid = note.link.url.after("?v=");
						if(vidid.match("&"))
							vidid = vidid.substring(0,vidid.indexOf("&"));
						if (note.link.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.link.oembed.title));
						if (!min) {
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								PownceMonkey.openVideoWindow("youtube", vidid);
								chat.doMarkAsDownloaded(note.id);
								if (properties.settings.notes_collapsible) 
									chat.uiShowNoteDetails(note.id);
							});
							
							var img = document.createElement("img");
							img.src = "http://img.youtube.com/vi/" + vidid + "/0.jpg";
							imglnk.appendChild(img);
							medobj.appendChild(imglnk);
						}
						var popout = document.createElement("div");
						popout.className = "popout";
						popout.addEventListener("click", function(event){
		                    PownceMonkey.openVideoWindow("youtube", vidid);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
					else if (note.link.oembed.provider_name == "qik") {
						var streamname = note.link.oembed.html.substring(note.link.oembed.html.indexOf("?streamname=") + 12, note.link.oembed.html.indexOf("&vid="));
						var vid = note.link.oembed.html.substring(note.link.oembed.html.indexOf("&vid=") + 5, note.link.oembed.html.indexOf("&playback="));
						var user = note.link.oembed.html.substring(note.link.oembed.html.indexOf("&user=") + 6, note.link.oembed.html.indexOf("&userlock="));
						note.link.oembed.streamname = streamname;
						if (note.link.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.link.oembed.title));
						if (!min) {
							var medobj = document.createElement("div");
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								PownceMonkey.openVideoWindow("qik", vid, streamname, user);
								chat.doMarkAsDownloaded(note.id);
								if (properties.settings.notes_collapsible) 
									chat.uiShowNoteDetails(note.id);
							});
							
							var img = document.createElement("img");
							img.src = "http://qik.com/redir/" + note.link.oembed.streamname + ".jpg";
							img.style.width = "250px";
							imglnk.appendChild(img);
							medobj.appendChild(imglnk);
						}
						var popout = document.createElement("div");
						popout.className = "popout";
						popout.addEventListener("click", function(event){
		                    PownceMonkey.openVideoWindow("qik", vidid);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
					else if (note.link.oembed.provider_name == "Revision3") {
						var thumburl = note.link.oembed.html.substring(note.link.oembed.html.indexOf("Thumb=") + 6);
						thumburl = thumburl.substring(0,thumburl.indexOf("&amp;"));
						var vidsrc = note.link.oembed.html.substring(note.link.oembed.html.indexOf("value=\"") + 7);
						vidsrc = vidsrc.substring(0,vidsrc.indexOf("\""));
						vidsrc = vidsrc.replace(/&amp;/gim,"&");
						vidsrc = escape(vidsrc);
						var base = note.link.oembed.html.substring(note.link.oembed.html.indexOf("base=\"") + 6);
						base = base.substring(0,base.indexOf("\""));
						if (note.link.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.link.oembed.title));
						if (!min) {
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								PownceMonkey.openVideoWindow("general", vidsrc, null, null, base);
		                    	chat.doMarkAsDownloaded(note.id);
								if (properties.settings.notes_collapsible) 
									chat.uiShowNoteDetails(note.id);
							});
							var img = document.createElement("img");
							img.src = thumburl;
							imglnk.appendChild(img);
							medobj.appendChild(imglnk);
						}
						var popout = document.createElement("div");
						popout.className = "popout";
						popout.addEventListener("click", function(event){
		                    PownceMonkey.openVideoWindow("general", vidsrc, null, null, base);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
					else if (note.link.oembed.provider_name == "pownce") {
						var vidid = note.link.oembed.html.substring(note.link.oembed.html.indexOf("viddlerplayer-") + 14);
						vidid = vidid.substring(0,vidid.indexOf("\""));
						var vidsrc = note.link.oembed.html.substring(note.link.oembed.html.indexOf("value=\"") + 7);
						var thumburl = "http://cdn-ll-83.viddler.com/e2/thumbnail_2_" + vidid + ".jpg"
						vidsrc = vidsrc.substring(0,vidsrc.indexOf("\""));
						vidsrc = vidsrc.replace(/&amp;/gim,"&");
						vidsrc = escape(vidsrc);
						if (note.link.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.link.oembed.title));
						if (!min) {
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								PownceMonkey.openVideoWindow("general", vidsrc, null, null, base);
		                    	chat.doMarkAsDownloaded(note.id);
								if (properties.settings.notes_collapsible) 
									chat.uiShowNoteDetails(note.id);
							});
							var img = document.createElement("img");
							img.src = thumburl;
							imglnk.appendChild(img);
							medobj.appendChild(imglnk);
						}
						var popout = document.createElement("div");
						popout.className = "popout";
						popout.addEventListener("click", function(event){
		                    PownceMonkey.openVideoWindow("general", vidsrc, null, null, base);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
				}
				else if(note.link.oembed.type == "photo") {
		            medlnk.className += " photo-link";
					if(!min&&note.link.oembed.provider_name == "Flickr"||note.link.oembed.provider_name == "Zooomr"||note.link.oembed.provider_name == "static.zooomr.com") {
						var medobj = document.createElement("div");
						medobj.className = "media-object";
						if (note.link.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.link.oembed.title));
		                var imglnk = document.createElement("a");
		                imglnk.className = "media-object-link";
		                imglnk.addEventListener("click", function(event){
		                    PownceMonkey.openImageWindow(note.link.oembed.provider_name, note.link.oembed.url);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
		                var img = document.createElement("img");
		                img.src = note.link.oembed.url;
		                imglnk.appendChild(img);
						medobj.appendChild(imglnk);
						var popout = document.createElement("div");
						popout.className = "popout";
						popout.addEventListener("click", function(event){
		                    PownceMonkey.openImageWindow(note.link.oembed.provider_name, note.link.oembed.url);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
					else {
						medobj.className = "media-object";
						if (note.link.oembed&&note.link.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.link.oembed.title));
						var imglnk = document.createElement("a");
		                imglnk.className = "media-object-link";
		                imglnk.addEventListener("click", function(event){
		                    PownceMonkey.doNavigateToURL(note.link.url);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
		                var img = document.createElement("img");
		                img.src = note.link.url;
		                imglnk.appendChild(img);
						medobj.appendChild(imglnk);
						if(note.link.oembed&&note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
				}
			}
			else if(note.link.url.match(/^http:\/\/[a-z0-9]+.muxtape.com\/$/)&&!note.link.url.match("http://www.muxtape.com/")) {
				medobj.className = "media-object";
				new MUXTAPE({muxurl:note.link.url,container:medobj,note_id:note.id})
			}
			else if(isDiggLink(note.link.url)) {
				medobj.className = "media-object";
				new digget({diggurl:note.link.url,container:medobj,text_color:properties.ui.link_color});
			}
            medlnk.href = "#";
            medlnk.innerHTML = note.link.url.substring(0, 25) + ((note.link.url.length > 25) ? "..." : "");
            medlnk.addEventListener("click", function(event){
                PownceMonkey.doNavigateToURL(note.link.url);
                chat.doMarkAsDownloaded(note.id);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
		return {medobj:medobj,medlnk:medlnk};
	},
    refreshNotes: function(){
		for (i = 0; i < properties.json.notes.length; i++) {
            var note = properties.json.notes[i];
			var keymatch = false;
        	for(k=0;k<properties.filter.keywords.length;k++){
				if(note.body.toLowerCase().match(properties.filter.keywords[k])) {
					keymatch = true;
					break;
				}
			}
            if (properties.filter.type[note.type] == false || (properties.filter.users.count != 0 && !properties.filter.users[note.sender.id])||(!keymatch&&properties.filter.keywords.length!=0)) {
                $("note_" + note.id).style.display = "none";
            } else {
                $("note_" + note.id).style.display = "block";
            }
        }
    },
	showToolbar: function() {
		$('toolbar').style.display = "block";
		$('reply-view').style.top = "90px";
		$('note-view').style.top = "90px";
		$('settings').style.top = "90px";
		properties.settings.hide_toolbar = false;
		$('settings-hide-toolbar').checked = false;
	},
    systemMessage: function(message, level){
        if (!level) 
            level = 1;
        switch (level) {
            case 1: // status bar message
                $('statusbar').innerHTML = message;
                this.systemMessage(message, 6);
                break;
            case 2: // alert message
                $('alert-box').style.display = "block";
                $('alert-message').innerHTML = message;
                break;
            case 3: // confirm message
                return confirm(message);
                break;
            case 4: // warning message popup alert box about error
                break;
            case 5: // error popup alert box, then logout
                $('login-error').innerHTML = message;
                $('login-error').style.display = "block";
                break;
            case 6: // log write to log file
                try {
                    var f = air.File.applicationStorageDirectory.resolvePath("pm.log");
                    var fs = new air.FileStream();
                    var now = new Date();
                    var logln = now.toGMTString() + " " + message + "\n";
                    fs.open(f, air.FileMode.APPEND);
                    fs.writeMultiByte(logln, air.File.systemCharset);
                    fs.close();
                    air.trace(logln);
                } 
                catch (e) {
                    air.trace(e.message);
                }
                break;
            case 7: // air.trace
                air.trace(message);
                break;
            case 8: // air.trace
                return prompt(message, "");
                break;
            default:
                $('statusbar').innerHTML = message;
                break;
        }
    },
	transparency: function(v) {
		document.body.style.opacity = v;
		properties.settings.transparency = v;
	}
};

String.prototype.after = function(delim){
    if (delim == null || delim == "") 
    
        return this;
    var index = this.indexOf(delim);
    
    return index > -1 ? this.substring(index + delim.length, this.length) : this;
}


function isDiggLink(url){
    if (!url.match(/^http:\/\/[www.]{0,1}digg.com\//)) 
        return false;
    var categories = ["technology", "apple", "design", "gadgets", "hardware", "tech_news", "linux_unix", "microsoft", "mods", "programming", "security", "software", "world_business", "business_finance", "world_news", "politics", "political_opinion", "2008_us_elections", "science", "environment", "general_sciences", "space", "gaming", "gaming_news", "pc_games", "playable_web_games", "nintendo", "playstation", "xbox", "lifestyle", "arts_culture", "autos", "educational", "food_drink", "health", "travel_places", "entertainment", "celebrity", "movies", "music", "television", "comics_animation", "sports", "baseball", "basketball", "extreme_sports", "football", "golf", "hockey", "motorsport", "soccer", "tennis", "other_sports", "offbeat", "comedy", "odd_stuff", "people", "pets_animals"];
    for (di = 0; di < categories.length; di++) {
        var str = "^http:\/\/[www.]{0,1}digg.com\/" + categories[di] + "\/";
        var diggcat = new RegExp(str, "g");
        if (url.match(diggcat)) 
            return true;
    }
    return false;
};

var MONTH_NAMES = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec');
var DAY_NAMES = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat');

function LZ(x){
    return (x < 0 || x > 9 ? "" : "0") + x
}
function formatDate(date, format){
    format = format + "";
    var result = "";
    var i_format = 0;
    var c = "";
    var token = "";
    var y = date.getYear() + "";
    var M = date.getMonth() + 1;
    var d = date.getDate();
    var E = date.getDay();
    var H = date.getHours();
    var m = date.getMinutes();
    var s = date.getSeconds();
    var yyyy, yy, MMM, MM, dd, hh, h, mm, ss, ampm, HH, H, KK, K, kk, k;
    // Convert real date parts into formatted versions
    var value = new Object();
    if (y.length < 4) {
        y = "" + (y - 0 + 1900);
    }
    value["y"] = "" + y;
    value["yyyy"] = y;
    value["yy"] = y.substring(2, 4);
    value["M"] = M;
    value["MM"] = LZ(M);
    value["MMM"] = MONTH_NAMES[M - 1];
    value["NNN"] = MONTH_NAMES[M + 11];
    value["d"] = d;
    value["dd"] = LZ(d);
    value["E"] = DAY_NAMES[E + 7];
    value["EE"] = DAY_NAMES[E];
    value["H"] = H;
    value["HH"] = LZ(H);
    if (H == 0) {
        value["h"] = 12;
    } else if (H > 12) {
        value["h"] = H - 12;
    } else {
        value["h"] = H;
    }
    value["hh"] = LZ(value["h"]);
    if (H > 11) {
        value["K"] = H - 12;
    } else {
        value["K"] = H;
    }
    value["k"] = H + 1;
    value["KK"] = LZ(value["K"]);
    value["kk"] = LZ(value["k"]);
    if (H > 11) {
        value["a"] = "PM";
    } else {
        value["a"] = "AM";
    }
    value["m"] = m;
    value["mm"] = LZ(m);
    value["s"] = s;
    value["ss"] = LZ(s);
    while (i_format < format.length) {
        c = format.charAt(i_format);
        token = "";
        while ((format.charAt(i_format) == c) && (i_format < format.length)) {
            token += format.charAt(i_format++);
        }
        if (value[token] != null) {
            result = result + value[token];
        } else {
            result = result + token;
        }
    }
    return result;
}
function dec2hex(textString){
    return (textString + 0).toString(16).toUpperCase();
}
function convertCP2DecNCR(textString){
    var outputString = "";
    textString = textString.replace(/^\s+/, "");
    if (textString.length == 0) {
        return "";
    }
    textString = textString.replace(/\s+/g, " ");
    var listArray = textString.split(" ");
    for (var i = 0; i < listArray.length; i++) {
        var n = parseInt(listArray[i], 16);
        outputString += ("&#" + n + ";");
    }
    return outputString;
}
function convertUTF82CP(textString){
    var outputString = "";
    CPstring = "";
    var compte = 0;
    var n = 0;
    textString = textString.replace(/^\s+/, "");
    if (textString.length == 0) {
        return "";
    }
    textString = textString.replace(/\s+/g, " ");
    var listArray = textString.split(" ");
    for (var i = 0; i < listArray.length; i++) {
        var b = parseInt(listArray[i], 16);
        switch (compte) {
            case 0:
                if (0 <= b && b <= 127) {
                    outputString += dec2hex(b) + " ";
                } else if (192 <= b && b <= 223) {
                    compte = 1;
                    n = b & 31;
                } else if (224 <= b && b <= 239) {
                    compte = 2;
                    n = b & 15;
                } else if (240 <= b && b <= 247) {
                    compte = 3;
                    n = b & 7;
                } else {
                    outputString += "!erreur " + dec2hex(b) + "! ";
                }
                break;
            case 1:
                if (b < 128 || b > 191) {
                    outputString += "!erreur " + dec2hex(b) + "! ";
                }
                compte--;
                outputString += dec2hex(n << 6 | b - 128) + " ";
                n = 0;
                break;
            case 2:
            case 3:
                if (b < 128 || b > 191) {
                    outputString += "!erreur " + dec2hex(b) + "! ";
                }
                n = n << 6 | b - 128;
                compte--;
                break;
            default:
                ;
        }
    }
    CPstring = outputString.replace(/ $/, "");
    return convertCP2DecNCR(CPstring);
}