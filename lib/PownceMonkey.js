/**
 * @author Jon Rohan
 */
var VERSION = "";
var properties = {
    api_urls: {
        login: "http://api.pownce.com/2.0/auth/verify.json?{app_key}",
        note: "http://api.pownce.com/2.0/notes/{note_id}.json?{app_key}{show_replies}",
        note_list: "http://api.pownce.com/2.1/note_lists/{username}.json?{app_key}{limit}{page}{filter}{since_id}{type}",
        note_recipient_list: "http://api.pownce.com/2.0/notes/{note_id}/recipients.json?{app_key}{limit}{page}",
        profile: "http://api.pownce.com/2.0/users/{username}.json?{app_key}",
        fffo: "http://api.pownce.com/2.0/users/{username}/{relationship}.json?{app_key}{limit}{page}",
        send_to_list: "http://api.pownce.com/2.0/send/send_to.json?{app_key}",
        post_a_message: "http://api.pownce.com/2.0/send/message.json",
        post_a_link: "http://api.pownce.com/2.0/send/link.json",
        post_an_event: "http://api.pownce.com/2.0/send/event.json",
        post_a_file: "http://api.pownce.com/2.0/send/file.json",
        post_a_file_pro: "http://api.pownce.com/2.0/send/file_pro.json",
        post_a_reply: "http://api.pownce.com/2.0/send/reply.json",
		update_url: "http://powncemonkey.com/release/current",
		delete_note: "http://pownce.com/ajax/delete_note/",
		mark_downloaded: "http://pownce.com/ajax/update_url_click_count/",
		add_friend: "http://pownce.com/ajax/request_friend/",
		remove_friend: "http://pownce.com/ajax/remove_friend/",
		cancel_friend: "http://pownce.com/ajax/cancel_friend/"
    },
    user: {
        username: "",
        password: "",
        profile: {}
    },
	interval: {
		getnotes: null,
		getfriends: null,
		getfanof: null,
		getreplies: null,
		newnotes: null
	},
    timeout: {
        statusBar: null,
        icon_flash: null
    },
    settings: {
        minimize_to_tray: true,
        auto_login: false,
        max_notes: 20,
        remember_me: false,
        notes_collapsible: true,
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
		transparency: .95
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
        APP_KEY: "44ko89t89i4b9t15ull3cpgp5iu5387u"
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
        isFriend: {},
        isFanof: {},
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
		template : null
	}
};
var PownceChat = new Class.create();
PownceChat.prototype = {
    initialize: function(options){
		var xmlString = air.NativeApplication.nativeApplication.applicationDescriptor;
		var appXml = new DOMParser();
		var xmlobject = appXml.parseFromString(xmlString, "text/xml");
		var root = xmlobject.getElementsByTagName('application')[0];
		VERSION = root.getElementsByTagName("version")[0].firstChild.data;
        if (air.NativeApplication.supportsSystemTrayIcon) {
            properties.ui.is_win = true;
            this.uiConfigureForOS("win-os");
        } else if (air.NativeApplication.supportsDockIcon) {
            properties.ui.is_osx = true;
            this.uiConfigureForOS("mac-os");
        }
        $('appVersion').innerHTML = "v " + VERSION;
        var oInst = this;
        this.getFriends = function(){
			oInst.uiSystemMessage("Getting friends");
            var oInstk = oInst;
            var handlerFunc = function(t){
				if(oInst.isError(t.responseText)) {
					oInst.uiSystemMessage("Get Friends error: " + t.responseText,6);
					clearInterval(properties.interval.getfriends);
					return false;
				}
                var friends = eval("(" + t.responseText + ")");
				oInstk.uiSystemMessage("Friends received");
                for (var i = 0; i < friends.friends.users.length; i++) {
					friends.friends.users[i].type = "friend";
					properties.json.isFriend[friends.friends.users[i].id] = true;
					if(properties.settings.hide_offline)
						friends.friends.users[i].visible = false;
					else
						friends.friends.users[i].visible = false;
					friends.friends.users[i].status = "offline";
                    properties.json.people.push(friends.friends.users[i]);
                }
                properties.json.people.sort(oInstk.sortPeople);
				oInstk.loadPeople();
                if (!friends.friends.has_next_page) {
					oInstk.getSendTo();
	                clearInterval(properties.interval.getfriends);
                    return;
                }
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get Friends failure: " + t.responseText,6);
				clearInterval(properties.interval.getfriends);
				return false;
            };
            var url = oInst.utilPrepareAPIURL(properties.api_urls.fffo, {
                relationship: "friends",
				limit: 100,
				page: properties.pages.currentFriendPage
            });
            //url = OAuth.getUrl("get", url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, [["limit", 100], ["page", properties.pages.currentFriendPage]]);
            new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            	method: "get"
            });
			properties.pages.currentFriendPage++;
        };
        this.getFanof = function(){
			oInst.uiSystemMessage("Getting fan of");
            var oInstk = oInst;
            var handlerFunc = function(t){
				if(oInst.isError(t.responseText)) {
					oInst.uiSystemMessage("Get FanOf error: " + t.responseText,6);
					clearInterval(properties.interval.getfanof);
					return false;
				}
                var fan_of = eval("(" + t.responseText + ")");
				oInstk.uiSystemMessage("Fan of received");
                for (var i = 0; i < fan_of.fan_of.users.length; i++) {
					fan_of.fan_of.users[i].type = "fanof";
					properties.json.isFanof[fan_of.fan_of.users[i].id] = true;
					if(properties.settings.hide_offline)
						fan_of.fan_of.users[i].visible = false;
					else
						fan_of.fan_of.users[i].visible = false;
					fan_of.fan_of.users[i].status = "offline";
                    properties.json.people.push(fan_of.fan_of.users[i]);
                }
				properties.json.people.sort(oInstk.sortPeople);
				oInstk.loadPeople();
                if (!fan_of.fan_of.has_next_page) {
                    clearInterval(properties.interval.getfanof);
                    return;
                }
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get Fan of failure: " + t.responseText,6);
				return;
            };
            var url = oInst.utilPrepareAPIURL(properties.api_urls.fffo, {
                relationship: "fan_of",
				limit: 100,
				page: properties.pages.currentFanofPage
            });
            //url = OAuth.getUrl("get", url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, [["limit", 100], ["page", properties.pages.currentFanofPage]]);
            new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            	method: "get"
            });
			
            properties.pages.currentFanofPage++;
        };
        this.getSendTo = function(){
			oInst.uiSystemMessage("Getting send to list");
            var oInstk = oInst;
            var handlerFunc = function(t){
				if(oInst.isError(t.responseText)) {
					oInst.uiSystemMessage("Get SendTo error: " + t.responseText,6);
					oInst.uiSystemMessage("Ack! Server error, try again later.",5);
					return false;
				}
                var sets = eval("(" + t.responseText + ")");
				oInstk.uiSystemMessage("Send to list received");
                properties.json.send_to = sets;
                oInst.loadSendToList();
				$('send-to-id').value = properties.ui.defaultSendto.id;
				$('send-to-text').value = properties.ui.defaultSendto.fullname;
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get Send to failure: " + t.responseText,6);
				return;
            };
            var url = this.utilPrepareAPIURL(properties.api_urls.send_to_list);
            //var url = OAuth.getUrl("get", properties.api_urls.send_to_list, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, []);
            new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            	method: "get"
            });
        };
        this.getNote = function(id) {
				if(!id)
					id = properties.ui.currentNoteDetail;
				var oInstk = oInst;
				var note = oInst.getNoteById(id);
				oInst.uiSystemMessage("Getting note");
		        var handlerFunc = function(t) {
		            var response = t.responseText;
					response = response.replace(/\\u00/gim, "\\\\u00");
	                var rnote = eval("(" + response + ")");
					oInstk.uiClearReply();
                	oInstk.uiSystemMessage("Replies received");
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
						oInstk.uiHideRepliersList();
					}
					oInstk.uiSetNoteDetail(note);
		            oInstk.loadReplies();
		        };
				
		        var options = {};
				options.note_id = id;
				options.show_replies = true;
				var url = oInst.utilPrepareAPIURL(properties.api_urls.note,options);
				var errFunc = function(t) {
					oInst.uiSystemMessage("get note detail failure: " + t.responseText,6);
					return;
				};
		
	            new Ajax.Request(url, {
		            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
		            onSuccess: handlerFunc,
		            onFailure: errFunc
		        });
		},
		this.getNotes = function(){
			oInst.uiSystemMessage("Getting notes");
            var oInstk = oInst;
            var handlerFunc = function(t){
				if(oInstk.isError(t.responseText)) {
					if(properties.api_urls.note_list=="http://api.pownce.com/2.1/note_lists/{username}.json?{app_key}{limit}{page}{filter}{since_id}{type}") {
						properties.api_urls.note_list="http://api.pownce.com/2.0/note_lists/{username}.json?{app_key}{limit}{page}{filter}{since_id}{type}";
						oInstk.getNotes();
						return;
					}
					oInstk.uiSystemMessage("Get Notes error: " + t.responseText,6);
					clearInterval(properties.interval.getnotes);
                    oInstk.uiSystemMessage("Ack! Server error, try again later.",5);
					return false;
				}
				var response = t.responseText;
				air.trace(response);
				response = response.replace(/\\u00/gim, "\\\\u00");
                var notes = eval("(" + response + ")");
				oInstk.uiSystemMessage("Notes received");
                properties.json.notes = notes.notes;
				properties.ui.has_next_notes_page = notes.notes.has_next_page;
				if (properties.ui.loading) {
                    properties.ui.loading = false;
					oInstk.uiChangeView("notes");
					properties.pages.currentFriendPage = 0;
                    oInstk.getFriends();
					if(properties.interval.getfriends)
						clearInterval(properties.interval.getfriends);
					properties.interval.getfriends = setInterval(oInstk.getFriends, 3000);
					properties.pages.currentFanofPage = 0;
                    oInstk.getFanof();
                    if(properties.interval.getfanof)
						clearInterval(properties.interval.getfanof);
					properties.interval.getfanof = setInterval(oInstk.getFanof, 3000);
					if(properties.interval.newnotes)
						clearInterval(properties.interval.newnotes);
					properties.interval.newnotes = setInterval(oInstk.getLatestNotes, 60000);
					oInstk.loadNotes();
                }
				else {
	                oInstk.loadNotes();
                    oInstk.loadPeople();
				}
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get Notes failure: " + t.responseText,6);
				return;
            };
			var options = {};
			options.limit = properties.settings.max_notes;
			options.page = properties.pages.currentNotesPage;
            var url = oInst.utilPrepareAPIURL(properties.api_urls.note_list,options);
			new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            	method: "get"
            });
        };
        this.getLatestNotes = function(){
			oInst.uiSystemMessage("Checking for new notes");
            var oInstk = oInst;
            
            var handlerFunc = function(t){
				if(oInst.isError(t.responseText)) {
					oInst.uiSystemMessage("Get Latest Notes error: " + t.responseText,6);
					clearInterval(properties.interval.newnotes);
                    oInst.uiSystemMessage("Ack! Server error, try again later.",5);
					return false;
				}
                var response = t.responseText;
				response = response.replace(/\\u00/gim, "\\\\u00");
                var notes = eval("(" + response + ")");
				if (notes.notes.length != 0&&properties.pages.currentNotesPage==0) {
                    if (properties.settings.play_sound) {
                        oInst.doPlayEventSound();
                    }
                    oInstk.uiSystemMessage(notes.notes.length + " new note" + ((notes.notes.length > 1) ? "s" : ""));
                    oInstk.uiNotify();
	                var n = properties.json.notes.length;
					for (var i = 0; i < notes.notes.length; i++) {
						properties.json.notes[n] = notes.notes[i];
						n++;
					}
	                properties.json.notes.sort(oInstk.sortNotes);
	                oInstk.loadNotes();
                    oInstk.loadPeople();
               }
				else {
					oInstk.uiSystemMessage("No new notes");
				}
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get Latest Notes failure: " + t.responseText,6);
				return;
            };
			var options = {};
			options.filter = "all";
			options.limit = properties.settings.max_notes;
			options.since_id = properties.ui.latestNoteId;
            var url = oInst.utilPrepareAPIURL(properties.api_urls.note_list,options);
            //url = OAuth.getUrl("get", url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, [["filter", "all"], ["limit", properties.settings.max_notes], ["since_id", properties.ui.latestNoteId]]);
            new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            	method: "get"
            });
        };
        this.getUser = function(username,limit) {
			this.uiSystemMessage("Getting User Profile");
            var oInstk = oInst;
            var handlerFunc = function(t){
				if(oInst.isError(t.responseText)) {
					oInst.uiSystemMessage("Get Profile error: " + t.responseText,6);
					oInst.uiSystemMessage("Ack! Server error, try again later.",5);
					return false;
				}
				air.trace(t.responseText);
                var resp = eval("(" + t.responseText + ")");
				if (limit != 0) {
					if (resp.notes.length == 0) {
						oInstk.getUser(username,0);
					} else {
						var user = resp.notes[0].sender;
						user.last_note_id = resp.notes[0].id;
						user.last_note_body = resp.notes[0].body;
						user.last_note_type = resp.notes[0].type;
						oInstk.uiSystemMessage("Profile received");
						oInstk.uiChangeView("profile",user);
					}
				} else {
					oInstk.uiChangeView("profile",resp);
				}
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get User failure: " + t.responseText,6);
				return;
            };
			var url = "";
			if(limit==0)
				url = oInst.utilPrepareAPIURL("http://api.pownce.com/2.0/users/" + username + ".json?{app_key}");
            else
				url = oInst.utilPrepareAPIURL("http://api.pownce.com/2.1/note_lists/" + username + ".json?{app_key}&limit=" + limit);
			var headers = [];
			if(username!=properties.user.profile.username)
				headers = ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)];
            new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: headers,
            	method: "get"
            });
		};
		this.getProfile = function(){
			this.uiSystemMessage("Getting User Profile");
            var oInstk = oInst;
            var handlerFunc = function(t){
				if(oInst.isError(t.responseText)) {
					oInst.uiSystemMessage("Get Profile error: " + t.responseText,6);
					oInst.uiSystemMessage("Ack! Server error, try again later.",5);
					return false;
				}
                var user = eval("(" + t.responseText + ")");
				oInstk.uiSystemMessage("Profile received");
                properties.user.profile = user;
                if (user.friend_request_count != 0) {
                    oInstk.uiAlertNewFriendRequest();
                }
                $('menu-home').addEventListener("click", function(event){
                    chat.uiChangeView("profile",user.username);
                });
            };
            var errFunc = function(t){
				oInst.uiSystemMessage("Get Profile failure: " + t.responseText,6);
				return;
            };
            var url = oInst.utilPrepareAPIURL(properties.api_urls.profile);
            //url = OAuth.getUrl("get", url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, []);
            new Ajax.Request(url, {
                onSuccess: handlerFunc,
                onFailure: errFunc,
                requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            	method: "get"
            });
        };
        this.loadProperties();
		this.deleteLogfile();
        this.checkForUpdate();
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
		this.uiSystemMessage("Authorizing");
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.getAllResponseHeaders());
			air.trace(document.cookie);
			if(oInst.isError(t.responseText)) {
				oInst.uiSystemMessage("Authorizing error: " + t.responseText,6);
				oInst.uiSystemMessage("Ack! Server error, try again later.",5);
				return false;
			}
			else if (t.responseText.match("key\": \"" + properties.oauth.APP_KEY + "\"")) {
				var resp = eval('(' + t.responseText + ')')
            	oInst.uiSystemMessage("Authorization successfull");
				properties.user.username = resp.auth.username;
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
				properties.interval.getnotes = setInterval(oInst.getNotes, 600000);
            }
			else if(t.responseText.match("status_code\": 401")) {
				oInst.uiSystemMessage("Authorizing error: " + t.responseText,6);
				oInst.uiSystemMessage("Ack! Username and password do not match.",5);
				return;
			}
        };
		var errFunc = function(t) {
			oInst.uiSystemMessage("Authorizing failure: " + t.responseText,6);
			oInst.uiSystemMessage("Ack! Server error, try again later.",5);
			return;
		};
        var username = $('username').value;
        var password = $('password').value;
		var url = this.utilPrepareAPIURL(properties.api_urls.login);
		new Ajax.Request(url, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            requestHeaders: ["Authorization", "Basic " + btoa(username + ":" + password)],
            method: 'get'
        });
	},
	deleteFavorite: function(id) {
        var conn = new air.SQLConnection();
        var dbFile = air.File.applicationStorageDirectory.resolvePath("pm.db");
        try {
        // open the database
        conn.open(dbFile, air.SQLMode.UPDATE);
        }
		catch(e) {
			this.uiSystemMessage("trycatch error: No Favorite DB" + e.message,6);
			return false;
		}
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = "DELETE FROM favorites WHERE id=" + id + "";
            
            // This try..catch block is fleshed out in
            // a subsequent code listing
            try {
                selectStmt.execute();
                // accessing the data is shown in a subsequent code listing

            } 
            catch (error) {
                this.uiSystemMessage("Error message: " + error.message,6);
                this.uiSystemMessage("Details: " + error.details,6);
				conn.rollback();
                // error handling is shown in a subsequent code listing
				return false;
            }
            
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
        } 
        catch (error) {
                this.uiSystemMessage("Error message: " + error.message,6);
                this.uiSystemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
			return false;
        }
		this.loadFavorites();
		return true;
	},
	addFavorite: function(note) {
        var conn = new air.SQLConnection();
        var dbFile = air.File.applicationStorageDirectory.resolvePath("pm.db");
        
        try {
            // open the database
            conn.open(dbFile, air.SQLMode.UPDATE);
        } 
        catch (e) {
            this.uiSystemMessage(e.message,6);
            var file = air.File.applicationStorageDirectory;
            file = file.resolvePath("pm.db");
            try {
            var stream = new air.FileStream();
            stream.open(file, air.FileMode.WRITE);
            stream.close();
                conn.open(dbFile, air.SQLMode.UPDATE);
            } 
            catch (e) {
                this.uiSystemMessage(e.message,6);
            }
        }
        // start a transaction
        conn.begin();
        
        try {
        
            var writeFiles = new air.SQLStatement();
            writeFiles.sqlConnection = conn;
            
            var sql = "CREATE TABLE IF NOT EXISTS favorites (" +
            "    id INTEGER UNIQUE, " +
            "    fav_id INTEGER PRIMARY KEY AUTOINCREMENT, " +
            "    body TEXT, " +
            "    permalink TEXT, " +
            "    sender_username TEXT, " +
            "    sender_short_name TEXT, " +
            "    sender_photo_url TEXT, " +
            "    sender_id INTEGER, " +
            "    sender_is_pro TEXT, " +
            "    timestamp TEXT, " +
            "    stars TEXT, " +
            "    type TEXT, " +
            "    reply_to INTEGER, " +
            "    link_url TEXT, " +
            "    link_oembed_type TEXT, " +
            "    link_oembed_provider_name TEXT, " +
            "    link_oembed_html TEXT, " +
            "    link_oembed_author_url TEXT, " +
            "    link_oembed_title TEXT, " +
            "    link_oembed_author_name TEXT, " +
            "    link_oembed_url TEXT, " +
            "    file_type TEXT, " +
            "    file_url TEXT, " +
            "    file_aws_url TEXT, " +
            "    event_name TEXT, " +
            "    event_location TEXT, " +
            "    event_date TEXT" +
            ")";
            writeFiles.text = sql;
            
            try {
                writeFiles.execute();
            } 
            catch (error) {
                this.uiSystemMessage("Error message: " + error.message,6);
                this.uiSystemMessage("Details: " + error.details,6);
            }
            
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
					note.link.oembed.provider_name = note.link.oembed.provider_name.replace(/'/gim,"&#39;");
					note.link.oembed.author_name = note.link.oembed.author_name.replace(/'/gim,"&#39;");
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
				if(!note.file.aws_url)
					note.file.aws_url = "";
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
				note.event.location = note.event.location.replace(/'/gim,"&#39;");
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
			
            var sql = "INSERT INTO favorites (" +
					   "id, " +
					   "body, " +
					   "permalink, " +
					   "sender_username, " +
					   "sender_short_name, " +
					   "sender_photo_url, " +
					   "sender_id, " +
					   "sender_is_pro, " +
					   "timestamp, " +
					   "stars, " +
					   "type, " +
					   "reply_to, " +
					   "link_url, " +
					   "link_oembed_type, " +
					   "link_oembed_provider_name, " +
					   "link_oembed_html, " +
					   "link_oembed_author_url, " +
					   "link_oembed_title, " +
					   "link_oembed_author_name, " +
					   "link_oembed_url, " +
					   "file_type, " +
					   "file_url, " +
					   "file_aws_url, " +
					   "event_name, " +
					   "event_location, " +
					   "event_date " +
					   ") VALUES (" + 
					   note.id + "," + 
					   "'" + note.body + "'," + 
					   "'" + note.permalink + "'," +
					   "'" + note.sender.username + "'," +
					   "'" + note.sender.short_name + "'," +
					   "'" + note.sender.profile_photo_urls.smedium_photo_url + "'," +
					   note.sender.id + "," +
					   "'" + note.sender.is_pro + "'," +
					   "'" + note.timestamp + "'," +
					   "'" + note.stars + "'," +
					   "'" + note.type + "'," +
					   note.reply_to + "," +
					   "'" + note.link.url + "'," +
					   "'" + note.link.oembed.type + "'," +
					   "'" + note.link.oembed.provider_name + "'," +
					   "'" + note.link.oembed.html + "'," +
					   "'" + note.link.oembed.author_url + "'," +
					   "'" + note.link.oembed.title + "'," +
					   "'" + note.link.oembed.author_name + "'," +
					   "'" + note.link.oembed.url + "'," +
					   "'" + note.file.type + "'," +
					   "'" + note.file.url + "'," +
					   "'" + note.file.aws_url + "'," +
					   "'" + note.event.name + "'," +
					   "'" + note.event.location + "'," +
					   "'" + note.event.date + "'" +
					   ")";
					   air.trace(sql);
            writeFiles.text = sql;
            
            try {
                // execute the statement
                writeFiles.execute();
            } 
            catch (error) {
                this.uiSystemMessage("Error message: " + error.message,6);
                this.uiSystemMessage("Details: " + error.details,6);
            }
            // if we've gotten to this point without errors, commit the transaction
            conn.commit();
			this.loadFavorites();
        } 
        catch (error) {
                this.uiSystemMessage("Error message: " + error.message,6);
                this.uiSystemMessage("Details: " + error.details,6);
            // rollback the transaction
            conn.rollback();
        }
	},
	loadFavorites: function() {
		this.uiSystemMessage("Loading Favorites From DB ",6);
        var conn = new air.SQLConnection();
        var dbFile = air.File.applicationStorageDirectory.resolvePath("pm.db");
        try {
        // open the database
        conn.open(dbFile, air.SQLMode.UPDATE);
        }
		catch(e) {
			this.uiSystemMessage("trycatch error: No Files DB " + e.message,6);
			return false;
		}
        // start a transaction
        conn.begin();
        
        try {
            var selectStmt = new air.SQLStatement();
            
            // A SQLConnection named "conn" has been created previously
            selectStmt.sqlConnection = conn;
            
            selectStmt.text = "SELECT * FROM favorites ORDER BY fav_id DESC";
            
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
							"url" : note.file_url,
							"aws_url" : note.file_url
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
				air.trace(error.message);
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
		this.uiSystemMessage("Done Loading Favorites From DB ",6);
		return true;
	},
    checkForUpdate: function(){
		this.uiSystemMessage("Checking for update");
        var oInst = this;
        var handlerFunc = function(t){
            var latest = t.responseText;
            if (latest > VERSION) {
                chat.getNewVersion(latest);
            }
			else {
				oInst.uiSystemMessage("You have the latest version " + VERSION);
			}
        };
		
		var errFunc = function(t) {
			oInst.uiSystemMessage("Check for update error: " + t.responseText,6);
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
			this.uiSystemMessage("trycatch error: " + e.message,6);
		}
	},
	deleteDB: function() {
		try {
		var file = air.File.applicationStorageDirectory.resolvePath("pm.db");
		file.deleteFile();
		}
		catch(e) {
			this.uiSystemMessage("trycatch error: " + e.message,6);
		}
	},
	
	/** Event Handlers **/
    doAddFriend: function(username){
		this.uiSystemMessage("Sending Friend Request");
        $('request-friend').style.display = "none";
		var oInst = this;
        var handlerFunc = function(t){
			oInst.uiSystemMessage(t.responseText,6);
			oInst.uiSystemMessage("Friend Request Sent");
            oInst.getFanof();
			if (properties.interval.getfanof) 
					clearInterval(properties.interval.getfanof);
			properties.interval.getfanof = setInterval(oInst.getFanof, 3000);
            $('request-img').innerHTML = "";
			$('request-confirm').innerHTML = "";
			$('request-message').value = "";
			$('request-username').value = "";
        };
        var message = $('request-message').value;
        params = "action=ADD_FRIEND&friend=" + username + "&message=" + message;
		var errFunc = function(t) {
			oInst.uiSystemMessage("Add friend failure: " + t.responseText,6);
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
		conf = this.uiSystemMessage("Are you sure you want to unfriend "+username+"? This will remove all their notes from your page as well.",3);
		if (conf) {
			this.uiSystemMessage("Removing Friend");
			$('request-friend').style.display = "none";
			var oInst = this;
			var handlerFunc = function(t){
				oInst.uiSystemMessage(t.responseText,6);
				oInst.uiSystemMessage("Friend Removed");
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
				oInst.uiSystemMessage("Remove friend failure: " + t.responseText,6);
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
		conf = this.uiSystemMessage("Are you sure you want to unfriend "+username+"? This will remove all their notes from your page as well.",3);
		if (conf) {
			this.uiSystemMessage("Removing Friend");
			$('request-friend').style.display = "none";
			var oInst = this;
			var handlerFunc = function(t){
				oInst.uiSystemMessage(t.responseText,6);
				oInst.uiSystemMessage("Friend Removed");
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
				oInst.uiSystemMessage("cancel friend failure: " + t.responseText,6);
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
    doSaveSettings: function(){
        properties.settings.minimize_to_tray = $('settings-min-to-tray').checked;
        properties.settings.auto_login = $('settings-auto-login').checked;
        properties.settings.notes_collapsible = $('settings-notes-collapsible').checked;
        properties.settings.play_sound = $('settings-play-sound').checked;
        properties.settings.max_notes = $('settings-max-notes').value;
        properties.settings.friend_request_alert = $('settings-friend-requests').checked;
        properties.settings.font_size = properties.settings.temp_font_size;
        properties.settings.download_theme = $('settings-download-theme').checked;
		properties.settings.hide_offline = $('settings-hide-offline-users').checked;
		properties.settings.hide_toolbar = $('settings-hide-toolbar').checked;
		properties.settings.transparency = document.body.style.opacity;
		
		if (properties.settings.hide_list) {
			this.uiHideRepliersList();
		}
		else {
			this.uiShowRepliersList();
		}
		if(properties.settings.hide_toolbar) {
			this.uiHideToolbar();
		}
		else {
			this.uiShowToolbar();
		}
        document.body.className = document.body.className.replace(/fontSize[1-4]/, "fontSize" + properties.settings.temp_font_size);
        this.getNotes();
        if (properties.settings.download_theme) 
            this.getUserTheme();
        else 
            this.uiSetTheme("hbrown", "nblue", "#2E8696");
		this.loadPeople();
		this.uiChangeView("notes");
    },
	doSelectFile: function(e) {
		$('file-url').value = properties.ui.upload_file.name;
	},
    doCancelSettings: function(){
        $('settings-notes-text-size').style.fontSize = "10pt";
        $('settings-notes-size').value = 2;
        properties.settings.font_size = 2;
        $('settings-download-theme').checked = properties.settings.download_theme;
        $('settings-min-to-tray').checked = properties.settings.minimize_to_tray;
        $('settings-auto-login').checked = properties.settings.auto_login;
        $('settings-notes-collapsible').checked = properties.settings.notes_collapsible;
        $('settings-play-sound').checked = properties.settings.play_sound;
        $('settings-max-notes').value = properties.settings.max_notes;
        $('settings-friend-requests').checked = properties.settings.friend_request_alert;
		$('settings-hide-offline-users').checked = properties.settings.hide_offline;
		$('settings-hide-toolbar').checked = properties.settings.hide_toolbar;
		document.body.style.opacity = properties.settings.transparency;
		//$('settings-hide-contact-list').checked = properties.settings.hide_list;
        chat.uiChangeView("notes");
    },
    doResize: function(){
        window.nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
    },
	doKeyboardShortcut: function(code) {
		air.trace(code);
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
				this.doNavigateToURL(properties.json.notes[properties.ui.current_scroll_note].permalink);
			break;
			case 76: // l - follow link url
				if(properties.json.notes[properties.ui.current_scroll_note].link)
				this.doNavigateToURL(properties.json.notes[properties.ui.current_scroll_note].link.url);
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
        chat.uiClearNewNote();
        $('people').innerHTML = "";
        $('notes').innerHTML = "";
        chat.stopAllIntervals();
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
        if (!this.uiSystemMessage("Yikes! You're about to delete this note! Are you sure?",3)) {
            return false;
        }
		this.uiSystemMessage("Deleting note");
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			air.trace(t.getAllResponseHeaders());
			oInst.uiSystemMessage("Note deleted");
            if (properties.ui.currentNoteDetail == -1) {
				oInst.getNotes();
			}
			else if(note.type!="reply") {
				oInst.uiChangeView("notes");
				oInst.getNotes();
			}
			else {
				oInst.uiClearReply();
				oInst.uiChangeView("reply",properties.ui.currentNoteDetail);
			}
			return true;
        };
        
        params = "ajax_action=DELETE_NOTE" +
        "&note_to_delete=" +
        id;
		var errFunc = function(t) {
			oInst.uiSystemMessage("delete note failure: " + t.responseText,6);
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
		properties.ui.upload_file.addEventListener( air.IOErrorEvent.IO_ERROR, function(error) { air.trace(error); });
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
		this.uiSystemMessage("Forwarding note");
        var oInst = this;
        var handlerFunc = function(t){
			oInst.uiSystemMessage("Note forwarded");
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
			oInst.uiSystemMessage("forward note failure: " + t.responseText,6);
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
        var file = air.File.applicationStorageDirectory;
        file = file.resolvePath("powncechat.properties");
        var props = "{version:" + VERSION + ",settings:{transparency:" + properties.settings.transparency + ",x:" + properties.settings.x + ",y:" + properties.settings.y + ",width:" + properties.settings.width + ",height:" + properties.settings.height + ",hide_list:" + properties.settings.hide_list + ",hide_offline: " + properties.settings.hide_offline + ",shuffle_song:" + properties.settings.shuffle_song + ",repeat_song:" + properties.settings.repeat_song + ",download_theme:" + properties.settings.download_theme + ",font_size:" + properties.settings.font_size + ",friend_request_alert:" + properties.settings.friend_request_alert + ",play_sound:" + properties.settings.play_sound + ",notes_collapsible:" + properties.settings.notes_collapsible + ",max_notes:" + properties.settings.max_notes + ", minimize_to_tray: " + properties.settings.minimize_to_tray + ",auto_login:" + properties.settings.auto_login + ",remember_me:" + properties.settings.remember_me + "}}";
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
    },
    doNavigateToURL: function(url){
        var urlReq = new air.URLRequest(url);
        air.navigateToURL(urlReq);
    },
    doPostNewNote: function(){
        $('postit').disabled = true;
        var type = $('note-type').value;
		
        this.uiSystemMessage("Sending " + type);
        
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
            url = properties.api_urls.post_a_message;
            params = "note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        } else if (type == "link") {
            url = properties.api_urls.post_a_link;
            params = "url=" + link + "&note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        } else if (type == "file") {
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
            url = properties.api_urls.post_an_event;
            params = "event_date=" + event_date + "&event_name=" + event_name + "&event_location=" + event_location + "&note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        }
        var oInst = this;
        var handlerFunc = function(t){
			oInst.uiSystemMessage("Sent new note");
			oInst.uiClearNewNote();
            oInst.uiChangeView("notes");
            oInst.getNotes();
        };
		var errFunc = function(t) {
			oInst.uiSystemMessage("post note failure: " + t.responseText,6);
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
		this.uiSystemMessage("Sending reply");
        var id = properties.ui.currentNoteDetail;
        var note = this.getNoteById(id);
		$('reply-body').disabled = true;
		$('reply-button').disabled = true;
        var oInst = this;
        var handlerFunc = function(t){
			oInst.uiSystemMessage(t.responseText,6);
            var resp = eval('(' + t.responseText + ')');
            if (resp.error) {
            	oInst.uiSystemMessage("Could not send reply");
                return;
            }
			oInst.uiSystemMessage("Reply sent");
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
			oInst.uiClearReply();
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
            this.uiSystemMessage("Did you put anything in?")
            return;
        }
        var url = properties.api_urls.post_a_reply;
        var params = "reply_to=" + id + "&stars=" + stars + "&rsvp=" + rsvp + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
		var errFunc = function(t) {
			oInst.uiSystemMessage("post reply failure: " + t.responseText,6);
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
	uiClearNewNote: function() {
		properties.ui.upload_file = null;
		properties.ui.upload_file = air.File.desktopDirectory;
		properties.ui.upload_file.addEventListener( air.Event.SELECT, function(e){
			chat.doSelectFile(e);
		});
		properties.ui.upload_file.addEventListener( air.ProgressEvent.PROGRESS, function(e) {
			chat.doUploadFileProgress(e);
		} );	
		properties.ui.upload_file.addEventListener( air.Event.COMPLETE, function(e) {
			chat.doUploadFileComplete(e);
		} );
		properties.ui.upload_file.addEventListener( air.IOErrorEvent.IO_ERROR, function(error) { air.trace(error); });
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
		if(hr > 12) {
			hr = hr - 12;
			ampm = "PM";
		}
		
        $('time').value = hr + ":" + min + " " + ampm;
		$('file-url').value = "";
		$('url').value = "http://";
		$('body').value = "post a note...";
	},
	uiClearReply: function() {
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
	doUploadFileComplete: function(e) {
		this.uiSystemMessage("Sent new note");
        this.uiClearNewNote();
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
			air.trace(properties.ui.current_scroll_note);
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
		this.uiSystemMessage("Marking as downloaded",6);
        var handlerFunc = function(t){
			
        };
		var errFunc = function(t) {
			oInst.uiSystemMessage("mark as downloaded failure: " + t.responseText,6);
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
            var result = oInst.uiSystemMessage("There is an update(v" + latest + ") available! Download?\n\n " + t.responseText,3);
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
                    result = oInstk.uiSystemMessage("New version downloaded. Install now?",3);
                    if (result) {
                        var updater = new air.Updater();
                        var airFile = air.File.desktopDirectory.resolvePath("PownceMonkey-v" + latest + ".air");
                        updater.update(airFile, latest);
                    }
                }
            }
        };
		var errFunc = function(t) {
			oInst.uiSystemMessage("download release failure: " + t.responseText,6);
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
		air.trace(properties.ui.current_view);
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
        var frlength = properties.json.people.length;
        for (f = 0; f < frlength; f++) {
            if (properties.json.people[f].id == id) {
            
                return properties.json.people[f];
            }
        }
        return null;
    },
	getOtherProfiles: function(homepage) {
		this.uiSystemMessage("Getting user profiles");
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
				var div = oInst.uiCreateOtherProfile(url,site,name);
				$('profile-other-profiles').appendChild(div);
			}
			oInst.uiSystemMessage("User profiles received");
        };
		var errFunc = function(t) {
			oInst.uiSystemMessage("get user theme failure: " + t.responseText,6);
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
		this.uiSystemMessage("Getting user theme");
        var oInst = this;
        var handlerFunc = function(t){
            var page = t.responseText;
			if(page.match("<title>Pownce / 404</title>")||page.match("<title>Pownce / 500</title>")) {
				oInst.getNotes();
				return;
			}
			oInst.uiSystemMessage("User theme received");
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
			oInst.uiSystemMessage("get user theme failure: " + t.responseText,6);
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
	isDiggLink: function(url) {
		if(!url.match(/^http:\/\/[www.]{0,1}digg.com\//))
			return false;
		var categories = [
			"technology","apple","design","gadgets","hardware","tech_news","linux_unix","microsoft","mods","programming","security","software",
			"world_business","business_finance","world_news","politics","political_opinion","2008_us_elections",
			"science","environment","general_sciences","space",
			"gaming","gaming_news","pc_games","playable_web_games","nintendo","playstation","xbox",
			"lifestyle","arts_culture","autos","educational","food_drink","health","travel_places",
			"entertainment","celebrity","movies","music","television","comics_animation",
			"sports","baseball","basketball","extreme_sports","football","golf","hockey","motorsport","soccer","tennis","other_sports",
			"offbeat","comedy","odd_stuff","people","pets_animals"
		];
		for (di = 0; di < categories.length; di++) {
			var str = "^http:\/\/[www.]{0,1}digg.com\/" + categories[di] + "\/";
			var diggcat = new RegExp(str, "g");
			if (url.match(diggcat)) 
				return true;
		}
		return false;
	},
    isFriend: function(id){
        return properties.json.isFriend[id];
    },
    isFanof: function(id){
        return properties.json.isFanof[id];
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
    
    /** UI related Functions **/
    uiAddNote: function(note){
        $('notes').appendChild(note);
    },
    uiAddReply: function(reply){
        $('reply-notes').appendChild(reply);
    },
    uiAddReplier: function(replier){
        $('repliers').appendChild(replier);
    },
    uiAddPerson: function(user){
        $('people').appendChild(user);
    },
    uiAlertNewFriendRequest: function(){
        if (properties.settings.friend_request_alert) {
            var num = properties.user.profile.friend_request_count;
            var res = this.uiSystemMessage("You have " + num + " new friend requests. Accept or deny now?",3);
            if (res) {
                this.doNavigateToURL("http://pownce.com/friend_requests/");
            }
        }
    },
    uiCollapseAllNotes: function(){
        for (i = 0; i < properties.json.notes.length; i++) {
            var note = properties.json.notes[i];
            $("note_" + note.id).className = $("note_" + note.id).className.replace("nexpanded", "ncollapsed");
        }
    },
    uiCollapseNote: function(note){
        $("note_" + note.id).className = $("note_" + note.id).className.replace("nexpanded", "ncollapsed");
    },
    uiConfigureForOS: function(os){
        switch (os) {
            case "mac-os":
                $('settings-min-to-tray').style.display = "none";
                $('min-to-tray-label').style.display = "none";
                break;
            case "win-os":
                
                break;
        }
    },
    uiCreateOption: function(name, value){
        var opt = document.createElement("option");
        opt.value = value;
        opt.innerHTML = name;
        
        return opt;
    },
    uiCreateReply: function(reply){
		
        var replydom = document.createElement("li");
        var div = document.createElement("div");
        var isuser = "";
        div.className = "note reply";
        var bdy = this.uiPrepareNoteBody(reply.body);
		
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
            if (!this.isFriend(reply.sender.id)) {
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
        replink.innerHTML = "reply";
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
	uiCreateOtherProfile: function(url,site,name) {
		var div = document.createElement("div");
		var ulink = document.createElement("a");
		ulink.href = "#";
		ulink.innerHTML = name;
		ulink.className = site;
		ulink.style.color = properties.ui.link_color;
		ulink.addEventListener("click", function(){
			chat.doNavigateToURL(url);
		});
		div.appendChild(ulink);
		return div;
	},
    uiCreateNote: function(note){
        var notedom = document.createElement("li");
		notedom.id = "note_" + note.id;
        var div = document.createElement("div");
        div.className = "note " + note.type;
        var bdy = this.uiPrepareNoteBody(note.body);
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
        if (note.type != "reply") {
            var areplies = document.createElement("a");
            areplies.href = "#";
            areplies.style.color = properties.ui.link_color;
            areplies.id = note.id + "_replies";
            areplies.addEventListener("click", function(){
                chat.uiChangeView("reply", note.id);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
            areplies.innerHTML = note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies");
            btmdet.appendChild(areplies);
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
				chat.addFavorite(note);
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
            if (note.type != "reply") 
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
			var res = this.uiPrepareNoteLink(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
		} else if (note.file) {
			var res = this.uiPrepareNoteFile(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
        } else if (note.event) {
			div.appendChild(this.uiPrepareNoteEvent(note));
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
        var bdy = this.uiPrepareNoteBody(note.body);
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
			var res = this.uiPrepareNoteLink(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
		} else if (note.file) {
			var res = this.uiPrepareNoteFile(note);
			div.appendChild(res.medobj);
			div.appendChild(res.medlnk);
        } else if (note.event) {
			div.appendChild(this.uiPrepareNoteEvent(note));
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
    uiCreatePerson: function(user){
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
		var ssname = user.short_name;
		if(this.getUserFullName(user.id))
			ssname = this.getUserFullName(user.id);
		name.innerHTML = ssname;
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
		if(user.type=="friend") {
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
		else if(user.type=="fanof") {
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
		if (user.type == "friend") {
			var sendNote = menu.addItem(new air.NativeMenuItem("Send Note"));
			sendNote.addEventListener(air.Event.SELECT, function(){
				chat.uiNewNoteTo(user.id);
			});
			var addFriend = menu.addItem(new air.NativeMenuItem("Remove Friend"));
			addFriend.addEventListener(air.Event.SELECT, function(){
				chat.doRemoveFriend(user.username);
			});
		} else if (user.type == "fanof") {
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
            if (!this.isFriend(user.id)) {
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
    uiDecreaseSettingsSize: function(){
        if (!properties.settings.temp_font_size) 
            properties.settings.temp_font_size = 2;
        if (properties.settings.temp_font_size > 1) {
            properties.settings.temp_font_size--;
            switch (properties.settings.temp_font_size) {
                case 1:
                    $('settings-notes-text-size').style.fontSize = "8pt";
                    break;
                case 2:
                    $('settings-notes-text-size').style.fontSize = "10pt";
                    break;
                case 3:
                    $('settings-notes-text-size').style.fontSize = "12pt";
                    break;
            }
            $('settings-notes-size').value = properties.settings.temp_font_size;
        }
    },
    uiIncreaseSettingsSize: function(){
        if (!properties.settings.temp_font_size) 
            properties.settings.temp_font_size = 2;
        if (properties.settings.temp_font_size < 4) {
            properties.settings.temp_font_size++;
            switch (properties.settings.temp_font_size) {
                case 2:
                    $('settings-notes-text-size').style.fontSize = "10pt";
                    break;
                case 3:
                    $('settings-notes-text-size').style.fontSize = "12pt";
                    break;
                case 4:
                    $('settings-notes-text-size').style.fontSize = "14pt";
                    break;
            }
            $('settings-notes-size').value = properties.settings.temp_font_size;
        }
    },
    uiNotify: function(){
    
        if (properties.ui.is_osx) {
            air.NativeApplication.nativeApplication.icon.bounce();
        } else if (properties.ui.is_win) {
        
        }
        air.NativeApplication.nativeApplication.icon.bitmaps = properties.ui.secondary_icon;
        window.nativeWindow.notifyUser(air.NotificationType.INFORMATIONAL);
    },
    uiNewNoteTo: function(id) {
		var fname = properties.json.fullname[id];
		$('send-to-text').value = fname;
        $('send-to-id').value = "friend_" + id;
        this.uiChangeView("new","message");
    },
    uiOpenVideoWindow: function(type, vid, streamname, user, base){
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
			air.trace(vid);
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
    },
	dec2hex: function(textString) {
    return (textString + 0).toString(16).toUpperCase();
},
	convertCP2DecNCR: function(textString) {
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
	},
	convertUTF82CP: function(textString) {
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
                outputString += this.dec2hex(b) + " ";
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
                outputString += "!erreur " + this.dec2hex(b) + "! ";
            }
            break;
          case 1:
            if (b < 128 || b > 191) {
                outputString += "!erreur " + this.dec2hex(b) + "! ";
            }
            compte--;
            outputString += this.dec2hex(n << 6 | b - 128) + " ";
            n = 0;
            break;
          case 2:
          case 3:
            if (b < 128 || b > 191) {
                outputString += "!erreur " + this.dec2hex(b) + "! ";
            }
            n = n << 6 | b - 128;
            compte--;
            break;
          default:;
        }
    }
    CPstring = outputString.replace(/ $/, "");
    return this.convertCP2DecNCR(CPstring);
},
	uiPrepareNoteLink: function(note,min) {
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
							medobj.appendChild(this.uiCreateMediaTitle(note.link.oembed.title));
						if (!min) {
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								chat.uiOpenVideoWindow("youtube", vidid);
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
		                    chat.uiOpenVideoWindow("youtube", vidid);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.uiCreateMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
					else if (note.link.oembed.provider_name == "qik") {
						var streamname = note.link.oembed.html.substring(note.link.oembed.html.indexOf("?streamname=") + 12, note.link.oembed.html.indexOf("&vid="));
						var vid = note.link.oembed.html.substring(note.link.oembed.html.indexOf("&vid=") + 5, note.link.oembed.html.indexOf("&playback="));
						var user = note.link.oembed.html.substring(note.link.oembed.html.indexOf("&user=") + 6, note.link.oembed.html.indexOf("&userlock="));
						note.link.oembed.streamname = streamname;
						if (note.link.oembed.title)
							medobj.appendChild(this.uiCreateMediaTitle(note.link.oembed.title));
						if (!min) {
							var medobj = document.createElement("div");
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								chat.uiOpenVideoWindow("qik", vid, streamname, user);
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
		                    chat.uiOpenVideoWindow("qik", vidid);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.uiCreateMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
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
							medobj.appendChild(this.uiCreateMediaTitle(note.link.oembed.title));
						if (!min) {
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								chat.uiOpenVideoWindow("general", vidsrc, null, null, base);
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
		                    chat.uiOpenVideoWindow("general", vidsrc, null, null, base);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.uiCreateMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
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
							medobj.appendChild(this.uiCreateMediaTitle(note.link.oembed.title));
						if (!min) {
							medobj.className = "media-object";
							var imglnk = document.createElement("a");
							imglnk.className = "media-object-link";
							imglnk.addEventListener("click", function(event){
								chat.uiOpenVideoWindow("general", vidsrc, null, null, base);
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
		                    chat.uiOpenVideoWindow("general", vidsrc, null, null, base);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
						medobj.appendChild(popout);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.uiCreateMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
				}
				else if(note.link.oembed.type == "photo") {
		            medlnk.className += " photo-link";
					if(!min&&note.link.oembed.provider_name == "Flickr"||note.link.oembed.provider_name == "Zooomr"||note.link.oembed.provider_name == "static.zooomr.com") {
						var medobj = document.createElement("div");
						medobj.className = "media-object";
						if (note.link.oembed.title)
							medobj.appendChild(this.uiCreateMediaTitle(note.link.oembed.title));
		                var imglnk = document.createElement("a");
		                imglnk.className = "media-object-link";
		                imglnk.addEventListener("click", function(event){
		                    chat.doNavigateToURL(note.link.url);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
		                var img = document.createElement("img");
		                img.src = note.link.oembed.url;
		                imglnk.appendChild(img);
						medobj.appendChild(imglnk);
						if(note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.uiCreateMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
					else {
						medobj.className = "media-object";
						if (note.link.oembed&&note.link.oembed.title)
							medobj.appendChild(this.uiCreateMediaTitle(note.link.oembed.title));
						var imglnk = document.createElement("a");
		                imglnk.className = "media-object-link";
		                imglnk.addEventListener("click", function(event){
		                    chat.doNavigateToURL(note.link.url);
		                    chat.doMarkAsDownloaded(note.id);
		                    if (properties.settings.notes_collapsible) 
		                        chat.uiShowNoteDetails(note.id);
		                });
		                var img = document.createElement("img");
		                img.src = note.link.url;
		                imglnk.appendChild(img);
						medobj.appendChild(imglnk);
						if(note.link.oembed&&note.link.oembed.author_name&&note.link.oembed.author_name!="")
							medobj.appendChild(this.uiCreateMediaCredits(note.link.oembed.type,note.link.oembed.author_name,note.link.oembed.author_url,note.id));
					}
				}
			}
			else if(note.link.url.match(/^http:\/\/[a-z0-9]+.muxtape.com\/$/)&&!note.link.url.match("http://www.muxtape.com/")) {
				medobj.className = "media-object";
				new MUXTAPE({muxurl:note.link.url,container:medobj,note_id:note.id})
			}
			else if(this.isDiggLink(note.link.url)) {
				medobj.className = "media-object";
				new digget({diggurl:note.link.url,container:medobj,text_color:properties.ui.link_color});
			}
            medlnk.href = "#";
            medlnk.innerHTML = note.link.url.substring(0, 25) + ((note.link.url.length > 25) ? "..." : "");
            medlnk.addEventListener("click", function(event){
                chat.doNavigateToURL(note.link.url);
                chat.doMarkAsDownloaded(note.id);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
		return {medobj:medobj,medlnk:medlnk};
	},
	uiPrepareNoteFile: function(note) {
		var medobj = document.createElement("div");
		var medlnk = document.createElement("a");
        if (note.file.type == "image") {
            var imglnk = document.createElement("a");
            imglnk.className = "media-object";
            imglnk.addEventListener("click", function(event){
                chat.doNavigateToURL(note.file.url);
                chat.doMarkAsDownloaded(note.id);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
            var img = document.createElement("img");
            img.src = note.file.aws_url;
            imglnk.appendChild(img);
            medobj.appendChild(imglnk);
        } else if (note.file.type == "audio") {
            var mp3player = new AIRMP3Player({
                url: note.file.url
            });
            var playr = mp3player.getDOMObject();
            playr.style.marginLeft = "-20px";
            medobj.appendChild(playr);
        }
        var medlnk = document.createElement("a");
        medlnk.className = "media-link";
        medlnk.href = "#";
        medlnk.innerHTML = note.file.url.substring(0, 25) + ((note.file.url.length > 25) ? "..." : "");
        medlnk.addEventListener("click", function(event){
            chat.doNavigateToURL(note.file.url);
            chat.doMarkAsDownloaded(note.id);
        });
		return {medobj:medobj,medlnk:medlnk};
	},
	uiPrepareNoteEvent: function(note) {
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
		date.setYear(note.event.date.substring(0,4));
		date.setMonth(note.event.date.substring(5,7) - 1);
		date.setDate(note.event.date.substring(8,10));
		date.setHours(note.event.date.substring(11,13));
		date.setMinutes(note.event.date.substring(14,16));
		date.setSeconds(note.event.date.substring(17,19));
		ddwhen.innerHTML = formatDate(date,'E, MMM yyyy ') + "at" + formatDate(date,' h:mm a');
        dl.appendChild(dtwhat);
        dl.appendChild(ddwhat);
        dl.appendChild(dtwhere);
        dl.appendChild(ddwhere);
        dl.appendChild(dtwhen);
        dl.appendChild(ddwhen);
        return dl;
	},
	uiCreateAutocomplete: function(fname,fusername,imgurl,id) {
		var li = document.createElement("li");
		li.setAttribute("sendtoid",id);
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
		if(fusername!="")
			username.innerHTML = "(" + fusername + ")";
		li.appendChild(username);
		li.addEventListener('click',function(e) {
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
	uiCreateMediaTitle: function(title) {
		var medobjtitle = document.createElement("div");
		medobjtitle.className = "media-object-title";
		medobjtitle.innerHTML = title;
		return medobjtitle;
	},
	uiCreateMediaCredits: function(type,author,link,note_id) {
		var medobjcred = document.createElement("div");
		medobjcred.className = "media-object-credits";
		medobjcred.innerHTML = type + " by ";
		var authlink = document.createElement("a");
		authlink.innerHTML = author;
		authlink.style.color = properties.ui.link_color;
        authlink.addEventListener("click", function(event){
            chat.doNavigateToURL(link);
            if (properties.settings.notes_collapsible) 
                chat.uiShowNoteDetails(note_id);
        });
		medobjcred.appendChild(authlink);
		return medobjcred;
	},
	uiPrepareNoteBody: function(body) {
		//body = unescape(body);
		var bdy = document.createElement("p");
		
		var UNICODE_CHAR = " //#/< ";
		var USERNAME_CHAR = " /!/#/< ";
		var URL_CHAR = " /!#/!/< ";
		
		body = body.replace(/</gim,"&lt;");
		body = body.replace(/\r{0,1}\n/gim," <br/> ");
		var uni = body.match(/(\\u00[0-9a-f]{2})+/gim);
		
		if (uni) {
			body = body.replace(/(\\u00[0-9a-f]{2})+/gim,UNICODE_CHAR);;
			var tempbdy = body.split(UNICODE_CHAR);
			body = "";
			for(c=0;c<uni.length;c++) {
				var unc = uni[c].replace(/\\u00/gim, " ");
				unc = unc.substring(1);
				text = this.convertUTF82CP(unc);
				body += tempbdy[c] + text;
			}
			if(tempbdy[tempbdy.length-1]) {
				body += tempbdy[tempbdy.length-1];
			}
		}
		
        var urls = body.match(/(ftp|http|https|file)(:\/\/[\S]+)/gim);
		if(urls) {
			body = body.replace(/(ftp|http|https|file)(:\/\/[\S]+)/gim,URL_CHAR);
			var tempbdy = body.split(URL_CHAR);
			body = "";
			for(c=0;c<urls.length;c++) {
				var url = urls[c];
				body += tempbdy[c] + '<a href="#' +  url + '" style="color:' + properties.ui.link_color + ';">' + url.substring(0, 25) + ((url.length > 25) ? "..." : "") + '</a>';
			}
			if(tempbdy[tempbdy.length-1]) {
				body += tempbdy[tempbdy.length-1];
			}
		}
		
		var usernames = body.match(/!\w[\w\d_]{0,15}/gim);
		if(usernames) {
			body = body.replace(/!\w[\w\d_]{0,15}/gim,USERNAME_CHAR);;
			var tempbdy = body.split(USERNAME_CHAR);
			body = "";
			for(c=0;c<usernames.length;c++) {
				var username = usernames[c];
				username = username.substring(1);
				body += tempbdy[c] + '!<a href="#!' +  username + '" style="color:' + properties.ui.link_color + ';">' + username + '</a>';
			}
			if(tempbdy[tempbdy.length-1]) {
				body += tempbdy[tempbdy.length-1];
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
		for(l=0;l<links.length;l++) {
			links[l].addEventListener("click", function(event){
                    var urllnk = event.target + "";
                    urllnk = urllnk.substring(urllnk.indexOf("#") + 1);
					if(urllnk.indexOf("!")==0)
						chat.uiChangeView("profile",urllnk.substring(1));
					else
                    	chat.doNavigateToURL(urllnk);
            });
		}
		return bdy;	
	},
    uiOpenAboutWindow: function(){
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
    },
    uiShowNoteDetails: function(id){
        var note = this.getNoteById(id);
        var classn = $("note_" + id).className;
        if (classn == "nexpanded") {
            this.uiCollapseNote(note);
            
            return;
        }
        this.uiCollapseAllNotes();
        classn = classn.replace("ncollapsed", "nexpanded");
        $("note_" + id).className = classn;
    },
    uiSystemMessage: function(message,level){
		if(!level)
			level = 1;
		switch(level) {
			case 1: // status bar message
        		$('statusbar').innerHTML = message;
				this.uiSystemMessage(message,6);
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
				this.doLogout();
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
				catch(e) {
					air.trace(e.message);
				}
			break;
			case 7: // air.trace
				air.trace(message);
			break;
			case 8: // air.trace
				return prompt(message,"");
			break;
			default:
        		$('statusbar').innerHTML = message;
			break;
		}
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
    uiRefreshNotes: function(){
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
    uiInitialize: function(){
		this.uiClearNewNote();
		
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
		
		$('filter-ok').addEventListener('click', function() { 
			$('filter-build-box').style.display = "none";
			chat.uiShowFilter();
			chat.uiChangeView("notes");
		});
        $('divMenu').addEventListener('click', this.uiShowHideMenu);
        $('menu-view-peeps').addEventListener('click', function() {
			chat.uiChangeView("people");
		});
		$('menu').addEventListener('click', this.uiShowHideMenu);
        
		$('menu-logout').addEventListener('click', this.doLogout);
        $('menu-settings').addEventListener('click', function(){
			chat.uiChangeView("settings","general");
		});
        $('menu-about').addEventListener('click', this.uiOpenAboutWindow);
        $('cancel-settings').addEventListener('click', this.doCancelSettings);
        $('save-settings').addEventListener('click', function(){
			chat.doSaveSettings()
		});
        $('settings-decrease-font-size').addEventListener('click', this.uiDecreaseSettingsSize);
        $('settings-increase-font-size').addEventListener('click', this.uiIncreaseSettingsSize);
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
				chat.uiHideRepliersList();
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
		$('toolbar-first-page').addEventListener('click',function(){
			properties.ui.current_scroll_note = 0;
			$('notes').innerHTML = "";
			properties.pages.currentNotesPage = 0;
			chat.getNotes();
		});
		$('toolbar-last-page').addEventListener('click',function(){
			chat.lastNotesPage();
		});
		$('toolbar-next-page').addEventListener('click',function(){
			chat.nextNotesPage();
		});
		$('postit').addEventListener('click',function(){
			chat.doPostNewNote();
		});
		$('file-browse').addEventListener('click',function() {
			chat.doBrowseForFile();
		});
        $('settings-general-tab').addEventListener('click', function(){
            chat.uiChangeView("settings","general");
        });
        $('settings-notes-tab').addEventListener('click', function(){
            chat.uiChangeView("settings","notes");
        });
        $('settings-alerts-tab').addEventListener('click', function(){
            chat.uiChangeView("settings","alerts");
        });
        $('menu-view-notes').addEventListener('click', function(){
            chat.uiChangeView('notes');
        });
		$('toolbar-notes').addEventListener('click', function(){
            chat.uiChangeView('notes');
        });
		$('toolbar-refresh').addEventListener('click', function(){
            chat.getNotes();
        });
        $('play-sound').addEventListener('click', function(){
            chat.doPlayEventSound();
        });
		$('delete-filter').addEventListener('click', function(){
            chat.uiHideFilter();
        });
        // Close button
        $('divClose').addEventListener('click', this.doClose);
        $('menu-exit').addEventListener('click', this.doClose);
        $('menu-new-message').addEventListener('click', function(){
			chat.uiChangeView("new","message");
        });
        $('menu-new-link').addEventListener('click', function(){
			chat.uiChangeView("new","link");
        });
        $('menu-new-file').addEventListener('click', function(){
			chat.uiChangeView("new","file");
        });
        $('menu-new-event').addEventListener('click', function(){
			chat.uiChangeView("new","event");
        });
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
        $('divHandle').addEventListener('mouseup', function() {
			properties.settings.width = window.nativeWindow.width;
			properties.settings.height = window.nativeWindow.height;
		});
        // Move window
        $('divBar').addEventListener('mousedown', this.doMove);
        $('divBar').addEventListener('mouseup', function() {
			properties.settings.x = window.nativeWindow.x;
			properties.settings.y = window.nativeWindow.y;
		});
        $('statusbar').addEventListener('mousedown', this.doMove);
        $('statusbar').addEventListener('mouseup', function() {
			properties.settings.x = window.nativeWindow.x;
			properties.settings.y = window.nativeWindow.y;
		});
		$('divTitle').addEventListener('mousedown', this.doMove);
        $('divTitle').addEventListener('mouseup', function() {
			properties.settings.x = window.nativeWindow.x;
			properties.settings.y = window.nativeWindow.y;
		});
		$('appVersion').addEventListener('mousedown', this.doMove);
        $('appVersion').addEventListener('mouseup', function() {
			properties.settings.x = window.nativeWindow.x;
			properties.settings.y = window.nativeWindow.y;
		});
		$('divTop').addEventListener('mousedown', this.doMove);
        $('divTop').addEventListener('mouseup', function() {
			properties.settings.x = window.nativeWindow.x;
			properties.settings.y = window.nativeWindow.y;
		});
		$('divContentStrip').addEventListener('mousedown', this.doMove);
        $('divContentStrip').addEventListener('mouseup', function() {
			properties.settings.x = window.nativeWindow.x;
			properties.settings.y = window.nativeWindow.y;
		});
		$('back-button').addEventListener('click',function() {
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
			if(properties.ui.logged_in && e.target.nodeName=="BODY") {
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
		var toolbarmenu = new air.NativeMenu();
        var hideToolbar = toolbarmenu.addItem(new air.NativeMenuItem("Hide Toolbar"));
        hideToolbar.addEventListener(air.Event.SELECT, function(){
			chat.uiHideToolbar();
        });
		$('toolbar').addEventListener("contextmenu", function(event){
            event.preventDefault();
            toolbarmenu.display(window.nativeWindow.stage, event.clientX, event.clientY);
        });
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
		new Control.Slider('settings-app-transparency-handle', 'settings-app-transparency-track', {
			onSlide: function(v) { $('settings-app-transparency').innerHTML = Math.floor(v * 100) + "%" },
			onChange: function(v) { chat.uiSetTransparency(v); },
			range: $R(.50, 1),
			sliderValue: properties.settings.transparency
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
		$('toolbar-notes').className = "tool-button";
		$('toolbar-newnote').className = "tool-button";
		$('toolbar-people').className = "tool-button";
		$('toolbar-favorites').className = "tool-button";
		properties.ui.logged_in = true;
        $('reply-body').disabled = false;
		switch (view) {
            case "notes":
				if(properties.settings.hide_toolbar) {
					this.uiHideToolbar();
				}
				else {
					this.uiShowToolbar();
				}
				$('new-box').style.display = "none";
                $('menu-logout').style.display = "block";
                $('menu-home').style.display = "block";
                $('menu-new').style.display = "block";
                $('menu-settings').style.display = "block";
                $('menu-view').style.display = "block";
				$('toolbar').style.display = "block";
				$('toolbar-notes').className = "tool-button tool-selected";
				this.uiClearNewNote();
	       		$('sub-toolbar-notes').style.display = "block";
				$('filter-box').style.top = "0px";
				$('notes').style.top = "0px";
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.uiClearReply();
                $('note-view').style.display = "block";
				if($('notes').childNodes.length > 9) {
					var id = properties.json.notes[properties.ui.current_scroll_note].id;
					this.scrollToNote(id);
				}
                break;
            case "settings":
                this.uiClearNewNote();
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.uiClearReply();
                $('settings').style.display = "block";
				if(type==null||type=="")
					type = "general";
		        $('settings-general-tab').className = $('settings-general-tab').className.replace("tab-selected", "tab-unselected");
		        $('settings-notes-tab').className = $('settings-notes-tab').className.replace("tab-selected", "tab-unselected");
		        $('settings-alerts-tab').className = $('settings-alerts-tab').className.replace("tab-selected", "tab-unselected");
		        
		        $('settings-general-pane').style.display = "none";
		        $('settings-notes-pane').style.display = "none";
		        $('settings-alerts-pane').style.display = "none";
        
				switch(type){
					case "general":
		                $('settings-general-tab').className = $('settings-general-tab').className.replace("tab-unselected", "tab-selected");
		                $('settings-general-pane').style.display = "block";
					break;
		            case "notes":
		                $('settings-notes-tab').className = $('settings-notes-tab').className.replace("tab-unselected", "tab-selected");
		                $('settings-notes-pane').style.display = "block";
		                break;
		            case "alerts":
		                $('settings-alerts-tab').className = $('settings-alerts-tab').className.replace("tab-unselected", "tab-selected");
		                $('settings-alerts-pane').style.display = "block";
		                break;
				}
                break;
			case "new":
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				$('sub-toolbar-new').style.display = "block";
				$('toolbar-newnote').className = "tool-button tool-selected";
				this.uiClearReply();
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
						if($('send-to-id').value=="public") {
							if(properties.ui.defaultSendto.id!="public") {
								$('send-to-id').value = properties.ui.defaultSendto.id;
								$('send-to-text').value = properties.ui.defaultSendto.fullname;
							}
							else {
								$('send-to-id').value = "all";
								$('send-to-text').value = "all my friends";
							}
						}
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
				this.uiClearNewNote();
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.uiClearReply();
				this.uiHideToolbar();
		        $('login').style.display = "block";
		        $('login-button').style.display = "block";
		        $('login-loading').style.display = "none";
		        $('username').disabled = false;
		        $('password').disabled = false;
		        $('remember_me').disabled = false;
		        $('auto_login').disabled = false;
		        $('menu-logout').style.display = "none";
		        $('menu-home').style.display = "none";
		        $('menu-new').style.display = "none";
		        $('menu-settings').style.display = "none";
		        $('menu-view').style.display = "none";
				$('toolbar').style.display = "none";
				break;
			case "reply":
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
				$('profile-view').style.display = "block";
				this.uiClearProfileDetail();
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
	uiClearProfileDetail: function() {
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
		
		if (this.isFriend(user.id)) {
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
		} else if (this.isFanof(user.id)) {
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
			
			lastnotelnk.innerHTML = "&nbsp;";
			$('profile-last-pownce').appendChild(lastnotelnk);
			var lastnotebody = (user.last_note_body.length > 150)?user.last_note_body.substring(0,150) + "...":user.last_note_body;
			$('profile-last-pownce').appendChild(document.createTextNode(lastnotebody));
			air.trace($('profile-last-pownce').innerHTML);
		}
		
		var link = document.createElement("a");
		link.href = "#";
		link.innerHTML = "Homepage";
		link.style.color = properties.ui.link_color;
		link.addEventListener("click", function() {
			chat.doNavigateToURL(user.permalink);
		});
		$('profile-link').appendChild(link);
		
		var frlink = document.createElement("a");
		frlink.href = "#";
		frlink.innerHTML = user.friend_count + " Friends";
		frlink.style.color = properties.ui.link_color;
		frlink.addEventListener("click", function() {
			chat.doNavigateToURL("http://pownce.com/" + user.username + "/friends/");
		});
		$('profile-friend-count').innerHTML = "I have: ";
		$('profile-friend-count').appendChild(frlink);
		var falink = document.createElement("a");
		falink.href = "#";
		falink.innerHTML = user.fan_count;
		falink.style.color = properties.ui.link_color;
		falink.addEventListener("click", function() {
			chat.doNavigateToURL("http://pownce.com/" + user.username + "/fans/");
		});
		$('profile-fan-count').appendChild(falink);
		$('profile-fan-count').appendChild(document.createTextNode(" people think I'm awesome."));
		var faolink = document.createElement("a");
		faolink.href = "#";
		faolink.innerHTML = user.fan_of_count;
		faolink.style.color = properties.ui.link_color;
		faolink.addEventListener("click", function() {
			chat.doNavigateToURL("http://pownce.com/" + user.username + "/fan_of/");
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
		air.trace(join.substring(join.length-1,join.length));
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
		
		$('note-detail-body').appendChild(this.uiPrepareNoteBody(note.body));
        
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
				chat.addFavorite(note);
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
			var res = this.uiPrepareNoteLink(note,true);
			$('note-link').appendChild(res.medlnk);
			$('note-detail-media-object').appendChild(res.medobj);
		}
		if (note.file) {
            var alink = document.createElement("a");
            alink.className = "media-link";
            alink.href = "#";
            alink.innerHTML = note.file.url.substring(0, 25) + ((note.file.url.length > 25) ? "..." : "");
            $('note-link').appendChild(alink);
            alink.addEventListener("click", function(event){
                chat.doNavigateToURL(note.file.url);
                chat.doMarkAsDownloaded(note.id);
                if (properties.settings.notes_collapsible) 
                    chat.uiShowNoteDetails(note.id);
            });
        }


	},
	uiSetTransparency: function(v) {
		document.body.style.opacity = v;
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
    uiShowHideMenu: function(){
        if ($('menu').style.display == "none" || $('menu').style.display == "") {
            $('menu').style.display = "block";
        } else {
            $('menu').style.display = "none";
        }
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
		this.uiRefreshNotes();
	},
	uiHideFilter: function() {
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
		this.uiRefreshNotes();
	},
	uiHideToolbar: function() {
		$('toolbar').style.display = "none";
		$('reply-view').style.top = "40px";
		$('note-view').style.top = "40px";
		$('settings').style.top = "40px";
		properties.settings.hide_toolbar = true;
		$('settings-hide-toolbar').checked = true;
	},
	uiShowToolbar: function() {
		$('toolbar').style.display = "block";
		$('reply-view').style.top = "90px";
		$('note-view').style.top = "90px";
		$('settings').style.top = "90px";
		properties.settings.hide_toolbar = false;
		$('settings-hide-toolbar').checked = false;
	},
    uiHideRepliersList: function() {
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
	
    /** Util Functions **/
    utilPrepareAPIURL: function(url, options){
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
    },
    
    /** Loading Functions **/
    loadReplies: function(){
		this.uiSystemMessage("Loading Replies");
        var id = properties.ui.currentNoteDetail;
        var note = this.getNoteById(id);
        if (!note) {
            this.uiSystemMessage("Could not load Replies");
            
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
            this.uiAddReply(replydom);
            if (!note.authors[user.id]) {
                var userdom = this.uiCreateReplier(user);
                user.replydomobj = userdom;
                this.uiAddReplier(userdom);
                note.authors[user.id] = true;
                a++;
            }
        }
		if (a == 0) {
            $('repliers').parentNode.style.display = "none";
        }
        $('reply-notes').scrollTop = $('reply-notes').scrollHeight;
        $('repliers-cnt').innerHTML = a + " ";
        this.uiSystemMessage("Replies loaded");
    },
    loadNotes: function(){
		this.uiSystemMessage("Loading Notes");
        if (!properties.json.notes) {
            this.uiSystemMessage("Could not load Notes");
            
            return;
        }
        $('notes').innerHTML = "";
		properties.filter.users = {};
		properties.filter.users.count = 0;
		properties.json.online_peeps = {};
        properties.ui.latestNoteId = properties.json.notes[0].id;
		$('toolbar-first-page').style.display = "none";
		$('toolbar-last-page').style.display = "none";
		$('toolbar-next-page').style.display = "none";
		
		if (properties.pages.currentNotesPage > 0) {
			var li = document.createElement("li");
			li.className = "paging";
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
			this.uiAddNote(li);
			$('toolbar-first-page').style.display = "block";
			$('toolbar-last-page').style.display = "block";
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
            this.uiAddNote(notedom);
        }
		this.loadPeople();
		var li = document.createElement("li");
		li.className = "paging";
		var nextdiv = document.createElement("div");
		nextdiv.className = "next-notes";
		nextdiv.style.color = properties.ui.link_color;
		nextdiv.innerHTML = "Next Page &#187;";
		nextdiv.addEventListener('click',function() {
			chat.nextNotesPage();
		});
		li.appendChild(nextdiv);
		$('toolbar-next-page').style.display = "block";
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
		this.uiAddNote(li);
        this.uiSystemMessage("Notes loaded");
		this.uiRefreshNotes();
    },
    loadPeople: function(){
		this.uiSystemMessage("Loading Peeps");
        if (!properties.json.people) {
            this.uiSystemMessage("Could not load Peeps");
            return;
        }
		$('people').innerHTML = "";
		for (i = 0; i < properties.json.people.length; i++) {
			var user = properties.json.people[i];
			var fullname = "";
			if(this.getUserFullName(user.id)) 
				fullname = this.getUserFullName(user.id);
			if(properties.json.online_peeps[user.id]) {
				user.visible = properties.json.online_peeps[user.id].visible;
				user.status = properties.json.online_peeps[user.id].status;
			}
			user.temp_visible = false;
			if (properties.filter.peoplestr != "" && properties.filter.peoplestr.length > 1) {
				var fullname_match = (fullname && fullname.toLowerCase().match(properties.filter.peoplestr.toLowerCase()))?true:false;
				var shortname_match = (user.short_name.toLowerCase().match(properties.filter.peoplestr.toLowerCase()))?true:false;
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
			if ((user.visible||user.temp_visible)) {
				this.uiAddPerson(this.uiCreatePerson(user));
			}
		}
		this.uiSystemMessage("Friends loaded");
    },
    loadProperties: function(){
		this.uiSystemMessage("Loading properties");
        var f = air.File.applicationStorageDirectory.resolvePath("powncechat.properties");
        var fs = new air.FileStream();
        try {
            fs.open(f, air.FileMode.READ);
            var content = fs.readUTFBytes(fs.bytesAvailable);
            fs.close();
            if (content) {
                var props = eval('(' + content + ')');
				if(!props.version||props.version < VERSION) {
					this.deleteDB();
				}
                if (props.settings) {
					properties.settings = props.settings;
                    properties.settings.temp_font_size = props.settings.font_size;
					if(!properties.settings.transparency)
						properties.settings.transparency = .95;
					$('settings-app-transparency').innerHTML = Math.floor(properties.settings.transparency * 100) + "%"
					this.uiSetTransparency(properties.settings.transparency);
					if(!props.settings.width)
						properties.settings.width = 370;
					if(!props.settings.height)
						properties.settings.height = 400;
					if(!props.settings.x)
						properties.settings.x = 200;
					if(!props.settings.y)
						properties.settings.y = 200;
					
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
						this.uiHideRepliersList();
					}
					else {
						this.uiShowRepliersList();
					}
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
			this.uiSystemMessage("Properties loaded");
        } 
        catch (e) {
        }
    },
    loadSendToList: function(){
        if (!properties.json.send_to.options) {
            this.uiSystemMessage("Could not load Send To List");
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
			var pubau = this.uiCreateAutocomplete("the public", "", "http://pownce.com/profile_photos/p/o/w/pownce/4134_small.jpg", "public");
			if(currentfilter.childNodes.length==0)
				pubau.id = "selectedsendto";
			currentfilter.appendChild(pubau);
		}
        if (sel == "public") 
            properties.ui.defaultSendto.fullname = "the public";
		if (properties.json.send_to.options["all"].toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
			var allau = this.uiCreateAutocomplete(properties.json.send_to.options["all"], "", "", "all");
			if(currentfilter.childNodes.length==0)
				allau.id = "selectedsendto";
			currentfilter.appendChild(allau);
		}
		if (properties.ui.current_view!="new"&&"my friends who haven't seen this yet".toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
			var newau = this.uiCreateAutocomplete("my friends who haven't seen this yet", "", "", "newbies");
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
				var setau = this.uiCreateAutocomplete(setnamearray[s], "", "", reversedsets[setnamearray[s]]);
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
		for (i = 0; i < namearray.length; i++) {
            var id = reversedfriends[namearray[i]].substring(reversedfriends[namearray[i]].indexOf("_") + 1);
			properties.json.fullname[id] = namearray[i];
			var user = this.getFriendById(id);
			if (namearray[i].toLowerCase().match(properties.filter.sendtostr.toLowerCase())||user.username.toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
				var pnau = this.uiCreateAutocomplete(namearray[i], user.username, user.profile_photo_urls.small_photo_url, reversedfriends[namearray[i]]);
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
			this.uiSystemMessage("Loading Template error: " + error.message + " \nxmlstr: " + prefsXMLstr,6);
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
		var name = this.uiSystemMessage("What would you like to call this template?",8);
		if(this.getTemplateByName(name)) {
			if (!this.uiSystemMessage("A template of that name already exists, would you like to overwrite it?", 3)) {
				this.uiSystemMessage("Save template canceled");
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
String.prototype.after = function(delim){
    if (delim == null || delim == "") 
    
        return this;
    var index = this.indexOf(delim);
    
    return index > -1 ? this.substring(index + delim.length, this.length) : this;
}
String.prototype.endsWith = function(s){
    if (s.length == 0) 
    
        return true;
    if (s.length > this.length) 
    
        return false;
    
    return this.slice(this.length - s.length) == s;
}
var MONTH_NAMES=new Array('January','February','March','April','May','June','July','August','September','October','November','December','Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec');
var DAY_NAMES=new Array('Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sun','Mon','Tue','Wed','Thu','Fri','Sat');
function LZ(x) {return(x<0||x>9?"":"0")+x}
function formatDate(date,format) {
	format=format+"";
	var result="";
	var i_format=0;
	var c="";
	var token="";
	var y=date.getYear()+"";
	var M=date.getMonth()+1;
	var d=date.getDate();
	var E=date.getDay();
	var H=date.getHours();
	var m=date.getMinutes();
	var s=date.getSeconds();
	var yyyy,yy,MMM,MM,dd,hh,h,mm,ss,ampm,HH,H,KK,K,kk,k;
	// Convert real date parts into formatted versions
	var value=new Object();
	if (y.length < 4) {y=""+(y-0+1900);}
	value["y"]=""+y;
	value["yyyy"]=y;
	value["yy"]=y.substring(2,4);
	value["M"]=M;
	value["MM"]=LZ(M);
	value["MMM"]=MONTH_NAMES[M-1];
	value["NNN"]=MONTH_NAMES[M+11];
	value["d"]=d;
	value["dd"]=LZ(d);
	value["E"]=DAY_NAMES[E+7];
	value["EE"]=DAY_NAMES[E];
	value["H"]=H;
	value["HH"]=LZ(H);
	if (H==0){value["h"]=12;}
	else if (H>12){value["h"]=H-12;}
	else {value["h"]=H;}
	value["hh"]=LZ(value["h"]);
	if (H>11){value["K"]=H-12;} else {value["K"]=H;}
	value["k"]=H+1;
	value["KK"]=LZ(value["K"]);
	value["kk"]=LZ(value["k"]);
	if (H > 11) { value["a"]="PM"; }
	else { value["a"]="AM"; }
	value["m"]=m;
	value["mm"]=LZ(m);
	value["s"]=s;
	value["ss"]=LZ(s);
	while (i_format < format.length) {
		c=format.charAt(i_format);
		token="";
		while ((format.charAt(i_format)==c) && (i_format < format.length)) {
			token += format.charAt(i_format++);
			}
		if (value[token] != null) { result=result + value[token]; }
		else { result=result + token; }
		}
	return result;
	}