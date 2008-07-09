/**
 * @project Pownce Desktop
 * @author Jon Rohan
 * 
 */

// Set by the <version></version> in the application.xml file
var VERSION = "";
var POWNCE_API_DOMAIN = "http://api.pownce.com/";
var POWNCE_API_VERSION = "2.1";
/**
 * properties is a json object that contains settings, data, urls
 */
var properties = {
	
	crons: {
		display_since: null
	},
	
	// urls for accessing api endpoints
    api_urls: {
        login: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/auth/verify.json?{app_key}",
        note: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/notes/{note_id}.json?{app_key}{show_replies}",
        note_list: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/note_lists/{username}.json?{app_key}{limit}{page}{filter}{since_id}{type}",
        note_recipient_list: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/notes/{note_id}/recipients.json?{app_key}{limit}{page}",
        profile: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/users/{username}.json?{app_key}",
        fffo: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/users/{username}/{relationship}.json?{app_key}{limit}{page}",
        send_to_list: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/send_to.json?{app_key}",
        post_a_message: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/message.json",
        post_a_link: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/link.json",
        post_an_event: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/event.json",
        post_a_file: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/file.json",
        post_a_file_pro: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/file.json",
        post_a_reply: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/send/reply.json",
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
		create_table_favorites : "CREATE TABLE IF NOT EXISTS favorites (note_id INTEGER UNIQUE, fav_id INTEGER PRIMARY KEY AUTOINCREMENT, body TEXT, permalink TEXT, sender_id INTEGER, timestamp TEXT, stars TEXT, type TEXT, reply_to INTEGER, num_replies TEXT, num_recipients TEXT, is_public TEXT, is_private TEXT, link_url TEXT, oembed_type TEXT, oembed_provider_name TEXT, oembed_html TEXT, oembed_author_url TEXT, oembed_title TEXT, oembed_author_name TEXT, oembed_url TEXT, oembed_provider_url TEXT, oembed_height INTEGER, oembed_width INTEGER, file_content_length INTEGER, file_name TEXT, file_storage_name TEXT, file_url TEXT, file_in_s3 TEXT, file_content_type TEXT, file_content_delivery TEXT, file_direct_url TEXT, file_type TEXT, event_name TEXT, event_location TEXT, event_date TEXT, event_google_map_url TEXT, event_ical TEXT, event_yahoo_map_url TEXT)",
		create_table_notes : "CREATE TABLE IF NOT EXISTS notes (note_id INTEGER PRIMARY KEY, body TEXT, permalink TEXT, sender_id INTEGER, timestamp TEXT, stars TEXT, type TEXT, reply_to INTEGER, num_replies TEXT, num_recipients TEXT, is_public TEXT, is_private TEXT, link_url TEXT, oembed_type TEXT, oembed_provider_name TEXT, oembed_html TEXT, oembed_author_url TEXT, oembed_title TEXT, oembed_author_name TEXT, oembed_url TEXT, oembed_provider_url TEXT, oembed_height INTEGER, oembed_width INTEGER, file_content_length INTEGER, file_name TEXT, file_storage_name TEXT, file_url TEXT, file_in_s3 TEXT, file_content_type TEXT, file_content_delivery TEXT, file_direct_url TEXT, file_type TEXT, event_name TEXT, event_location TEXT, event_date TEXT, event_google_map_url TEXT, event_ical TEXT, event_yahoo_map_url TEXT)",
		create_table_people : "CREATE TABLE IF NOT EXISTS people (person_id INTEGER PRIMARY KEY, first_name TEXT, last_name TEXT, short_name TEXT, visible TEXT, status TEXT, temp_visible TEXT, username TEXT, location TEXT, medium_photo_url TEXT, age INTEGER, gender TEXT, relationship TEXT, small_photo_url TEXT, large_photo_url TEXT, is_pro TEXT, blurb TEXT, permalink TEXT, friend_count INTEGER, fan_count INTEGER, fan_of_count INTEGER, country TEXT, max_upload_mb INTEGER, smedium_photo_url TEXT, tiny_photo_url TEXT)",
		delete_all_favorites : "DELETE FROM favorites",
		delete_all_notes : "DELETE FROM notes",
		delete_all_people : "DELETE FROM people",
		delete_favorite_by_id : "DELETE FROM favorites WHERE note_id={id}",
		delete_note_by_id : "DELETE FROM notes WHERE note_id={id}",
		delete_person_by_id : "DELETE FROM people WHERE person_id={id}",
		get_person_relationship : "SELECT relationship FROM people WHERE person_id={id}",
		insert_favorites : "INSERT INTO favorites (note_id, body, permalink, sender_id, timestamp, stars, type, reply_to, num_replies, num_recipients, is_public, is_private, link_url, oembed_type, oembed_provider_name, oembed_html, oembed_author_url, oembed_title, oembed_author_name, oembed_url, oembed_provider_url, oembed_height, oembed_width, file_content_length, file_name, file_storage_name, file_url, file_in_s3, file_content_type, file_content_delivery, file_direct_url, file_type, event_name, event_location, event_date, event_google_map_url, event_ical, event_yahoo_map_url) VALUES ({id}, '{body}', '{permalink}', {sender_id}, '{timestamp}', '{stars}', '{type}', {reply_to}, '{num_replies}', '{num_recipients}', '{is_public}', '{is_private}', '{link_url}', '{oembed_type}', '{oembed_provider_name}', '{oembed_html}', '{oembed_author_url}', '{oembed_title}', '{oembed_author_name}', '{oembed_url}', '{oembed_provider_url}', {oembed_height}, {oembed_width}, {file_content_length}, '{file_name}', '{file_storage_name}', '{file_url}', '{file_in_s3}', '{file_content_type}', '{file_content_delivery}', '{file_direct_url}', '{file_type}', '{event_name}', '{event_location}', '{event_date}', '{event_google_map_url}', '{event_ical}', '{event_yahoo_map_url}')",
		insert_notes : "INSERT INTO notes (note_id, body, permalink, sender_id, timestamp, stars, type, reply_to, num_replies, num_recipients, is_public, is_private, link_url, oembed_type, oembed_provider_name, oembed_html, oembed_author_url, oembed_title, oembed_author_name, oembed_url, oembed_provider_url, oembed_height, oembed_width, file_content_length, file_name, file_storage_name, file_url, file_in_s3, file_content_type, file_content_delivery, file_direct_url, file_type, event_name, event_location, event_date, event_google_map_url, event_ical, event_yahoo_map_url) VALUES ({id}, '{body}', '{permalink}', {sender_id}, '{timestamp}', '{stars}', '{type}', {reply_to}, '{num_replies}', '{num_recipients}', '{is_public}', '{is_private}', '{link_url}', '{oembed_type}', '{oembed_provider_name}', '{oembed_html}', '{oembed_author_url}', '{oembed_title}', '{oembed_author_name}', '{oembed_url}', '{oembed_provider_url}', {oembed_height}, {oembed_width}, {file_content_length}, '{file_name}', '{file_storage_name}', '{file_url}', '{file_in_s3}', '{file_content_type}', '{file_content_delivery}', '{file_direct_url}', '{file_type}', '{event_name}', '{event_location}', '{event_date}', '{event_google_map_url}', '{event_ical}', '{event_yahoo_map_url}')",
		insert_person : "INSERT INTO people (person_id, first_name, last_name, short_name, visible, status, temp_visible, username, location, medium_photo_url, age, gender, relationship, small_photo_url, large_photo_url, is_pro, blurb, permalink, friend_count, fan_count, fan_of_count, country, max_upload_mb, smedium_photo_url, tiny_photo_url) VALUES ({id}, '{first_name}', '{last_name}', '{short_name}', '{visible}', '{status}', '{temp_visible}', '{username}', '{location}', '{medium_photo_url}', {age}, '{gender}', '{relationship}', '{small_photo_url}', '{large_photo_url}', '{is_pro}', '{blurb}', '{permalink}', {friend_count}, {fan_count}, {fan_of_count}, '{country}', {max_upload_mb}, '{smedium_photo_url}', '{tiny_photo_url}')",
		select_favorties : "SELECT favorites.note_id id, * FROM favorites LEFT JOIN people ON people.person_id=favorites.sender_id ORDER BY {order_by} {direction}",
		select_notes : "SELECT notes.note_id id, * FROM notes LEFT JOIN people ON people.person_id=notes.sender_id ORDER BY {order_by} {direction}",
		select_people : "SELECT person_id id, * FROM people ORDER BY {order_by} {direction}",
		select_person_by_id : "SELECT person_id id, * FROM people WHERE person_id={id}",
		set_all_relationships : "UPDATE people SET relationship='{relationship}'",
		update_favorite : "UPDATE favorites SET num_replies={num_replies}, stars='{stars}' WHERE note_id={id}"
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
		repeat_song: false,
		shuffle_song: false,
		hide_list: true,
		width: 370,
		height: 400,
		x: 200,
		y: 200,
		toolbar_icon_text : true,
		sound: "default"
    },
	
	// Properties associated with the ui
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
        link_color: "#004899",
        loading: true,
		has_next_notes_page: true,
		upload_file: null,
		added_oembed_data: false,
		logged_in: false,
		current_scroll_note: 0,
		current_view: ""
    },
	
	// The current page number for api endpoints
	pages: {
		currentFriendPage: 0,
        currentFanofPage: 0,
        currentNotesPage: 0
	},
	
	
    oauth: {
        APP_KEY: "44ko89t89i4b9t15ull3cpgp5iu5387u",
        SECRET: "dvt915wf5ye07922o651a4090tk3624g",
        request_token_url: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/oauth/request_token",
        user_authorization_url: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/oauth/authorize",
        access_token_url: POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/oauth/access_token",
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

/**
 * PownceDesktop class
 */
function PownceDesktop() {
    
	// get VERSION from application.xml
    VERSION = (new DOMParser().parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml")).getElementsByTagName('application')[0].getElementsByTagName("version")[0].firstChild.data;
    
    this.ajaxWrapper = new PownceDesktop.AJAX();
	
	// If application supports system tray 
    if (navigator.userAgent.match("Windows")) {
        // it is windows
        properties.ui.is_win = true;
        this.ui.configureForOS("win-os");
    }    // else if the application supports a doc icon
    else if (navigator.userAgent.match("Macintosh")) {
        // it is OSX
        properties.ui.is_osx = true;
        this.ui.configureForOS("mac-os");
    }
    
	// get saved properties
    this.loadProperties();
    
    // refresh log file
    this.deleteLogfile();
    
    // Initialize the UI
    this.uiInitialize();
    
    $('username').value = properties.user.username;
    if (properties.settings.auto_login) {
        $('password').value = properties.user.password;
        $('auto-login').checked = properties.settings.auto_login;
        this.doLogin();
    }
}

PownceDesktop.prototype = {
	
    /** Sort Functions **/
    sortNotes: function(a, b){
        return (b.id - a.id);
    },
    sortPeople: function(a, b){
	    var x = a.short_name.toLowerCase();
	    var y = b.short_name.toLowerCase();
	    return ((x < y) ? -1 : ((x > y) ? 1 : 0));
    },
    
    /** API Functions **/
	authHTTPBasic: function() {
		this.ui.systemMessage({
			message: "Authorizing"
		});
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Authorizing error: " + t.responseText,
					level: 6
				});
				oInst.ui.systemMessage({
					message: "Ack! Server error, try again later.",
					level: 5
				});
				oInst.doLogout();
				return false;
			}
			else if (t.responseText.match("key\": \"" + properties.oauth.APP_KEY + "\"")) {
				var resp = eval('(' + t.responseText + ')');
            	oInst.ui.systemMessage({
					message: "Authorization successfull"
				});
				properties.user.username = $('username').value;
	            properties.user.password = $('password').value;
	            properties.settings.auto_login = $('auto-login').checked;
	            $('login-error').style.display = "none";
				properties.ui.logged_in = true;
	            properties.user.profile = resp.auth;
				if(properties.ui.is_win)
					oInst.ui.enableWindowMenu();
				else if(properties.ui.is_osx)
					oInst.ui.enableApplicationMenu();
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
	            if (properties.user.profile.friend_request_count > 0) {
					oInst.ui.alertNewFriendRequest();
	            }
	            oInst.collectNotes();
				oInst.getSendTo();
				var latest = resp.auth.app.version;
	            if (latest > VERSION) {
	                oInst.ui.systemMessage({
	                    title: "Update?",
	                    message: "There is an update(v" + latest + ") available! Install now?",
	                    level: 3,
	                    callback: function(){
	                        chat.getNewVersion(latest);
							chat.cancelDialog();
	                    }
	                });
	            }
				else {
					oInst.ui.systemMessage({
						message: "You have the latest version " + VERSION
					});
				}

            }
			else if(t.responseText.match("status_code\": 401")) {
				oInst.ui.systemMessage({
					message: "Authorizing error: " + t.responseText,
					level: 6
				});
				oInst.ui.systemMessage({
					message: "Ack! Username and password do not match.",
					level: 5
				});
				oInst.doLogout();
				return;
			}
        };

		this.ajaxWrapper.call({
			url : properties.api_urls.login,
			handlerFunc: handlerFunc,
			errFunc: function(t) {
				oInst.ui.systemMessage({
					message: "Ack! Username and password do not match.",
					level: 5
				});
				oInst.doLogout();
				return;
			},
			action: "Authorizing",
			auth: true
		});
		
	},
	cancelDialog: function() {
		$('dialog-ok').value = "OK";
        $('dialog').style.display = "none";
		$('screen').style.display = "none";
		$('dialog-ok').removeEventListener("click");
	},
    checkForUpdate: function(){
		this.ui.systemMessage({
			message: "Checking for update"
		});
        var oInst = this;
        var handlerFunc = function(t){
			var resp = eval('(' + t.responseText + ')');
            var latest = resp.auth.app.version;
	        if (latest > VERSION) {
                oInst.ui.systemMessage({
                    title: "Update?",
                    message: "There is an update(v" + latest + ") available! Install now?",
                    level: 3,
                    callback: function(){
                        chat.getNewVersion(latest);
						chat.cancelDialog();
                    }
                });
            }
			else {
				oInst.ui.systemMessage({
					message: "You have the latest version " + VERSION
				});
			}
        };
		
		this.ajaxWrapper.call({
			url : properties.api_urls.login,
			handlerFunc: handlerFunc,
			action: "Checking for update",
			auth: true
		});
    },
	deleteLogfile: function() {
		try {
			var file = air.File.applicationStorageDirectory.resolvePath("pownce.log");
			file.deleteFile();
		}
		catch(e) {
			this.ui.systemMessage({
				message: "trycatch error: " + e.message,
				level: 6
			});
		}
	},
    getFanof : function(){
		this.ui.systemMessage({
			message: "Getting fan of"
		});
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get FanOf error: " + t.responseText,
					level: 6
				});
				clearInterval(properties.interval.getfanof);
				return false;
			}
            var fan_of = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage({
				message: "Fan of received"
			});
            for (var i = 0; i < fan_of.fan_of.users.length; i++) {
				fan_of.fan_of.users[i].relationship = "fanof";
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

		this.ajaxWrapper.call({
			url : properties.api_urls.fffo,
			url_options: {
	            relationship: "fan_of",
				limit: 100,
				page: properties.pages.currentFanofPage
	        },
			handlerFunc: handlerFunc,
			errFunc: function() {
				clearInterval(properties.interval.getfanof);
        	},
			action: "Get Fan of",
			auth: true
		});
		
        properties.pages.currentFanofPage++;
    },
    getFriends : function(){
		this.ui.systemMessage({
			message: "Getting friends"
		});
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get Friends error: " + t.responseText,
					level: 6
				});
				clearInterval(properties.interval.getfriends);
				return false;
			}
            var friends = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage({
				message: "Friends received"
			});
            for (var i = 0; i < friends.friends.users.length; i++) {
				friends.friends.users[i].relationship = "friend";
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

		this.ajaxWrapper.call({
			url : properties.api_urls.fffo,
			url_options: {
	            relationship: "friends",
				limit: 100,
				page: properties.pages.currentFriendPage
	        },
			handlerFunc: handlerFunc,
			errFunc: function() {
				clearInterval(properties.interval.getfriends);
        	},
			action: "Get Friends",
			auth: true
		});

		properties.pages.currentFriendPage++;
    },
    getLatestNotes : function() {
		this.ui.systemMessage({
			message: "Checking for new notes"
		});
        var oInst = this;
        
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get Latest Notes error: " + t.responseText,
					level: 6
				});
                oInst.ui.systemMessage({
					message: "Ack! Server error, try again later.",
					level: 5
				});
				return false;
			}
            var response = t.responseText;
			//response = response.replace(/\\u00/gim, "\\\\u00");
            var notes = eval("(" + response + ")");
			if (notes.notes.length != 0&&properties.pages.currentNotesPage==0) {
				notes.notes.reverse();
				var newcnt = notes.notes.length;
				// remove newcnt notes from the end
				properties.json.notes.splice(properties.json.notes.length - 1 - newcnt,newcnt);
				var notified = false;
				for (var i = 0; i < notes.notes.length; i++) {
					if (!notified&&notes.notes[i].sender.username!=properties.user.username) {
						oInst.doPlayEventSound();
						oInst.ui.notify();
						notified = true;
					}
					properties.json.notes.push(notes.notes[i]);
				}
				oInst.addNewNotes(notes.notes);
                properties.json.notes.sort(oInst.sortNotes);
				properties.ui.latestNoteId = properties.json.notes[0].id;
                oInst.loadPeople();
           }
			else {
				oInst.ui.systemMessage({
					message: "No new notes"
				});
			}
        };
 
		this.ajaxWrapper.call({
			url : properties.api_urls.note_list,
			url_options: {
	            filter: "all",
				limit: 100,
				since_id: properties.ui.latestNoteId
	        },
			handlerFunc: handlerFunc,
			action: "Get Latest Notes",
			auth: true
		});
    },
    getNote : function(id) {
		if(!id)
			id = properties.ui.currentNoteDetail;
		if(id==-1) {
			if(properties.interval.getreplies) {
				clearInterval(properties.interval.getreplies);
			}
			return;
		}
		var oInst = this;
		var note = this.getNoteById(id);
		this.ui.systemMessage({
			message: "Getting note"
		});
        var handlerFunc = function(t) {
            var response = t.responseText;
			//response = response.replace(/\\u00/gim, "\\\\u00");
            var rnote = eval("(" + response + ")");
			oInst.ui.clearReply();
        	oInst.ui.systemMessage({
				message: "Replies received"
			});
			if (note) {
				note.replies = rnote.replies;
				note.stars = rnote.stars;
				note.num_replies = rnote.num_replies;
				oInst.updateFavorite({id:note.id,num_replies:note.num_replies,stars:note.stars});
	            for (i = 0; i < $("note_" + note.id).getElementsByTagName("div").length; i++) {
	                if ($("note_" + note.id).getElementsByTagName("div")[i].className == "bottomdetails") {
	                    //$("note_" + note.id).getElementsByTagName("div")[i].getElementsByTagName("a")[0].innerHTML = note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies");
	                    break;
	                }
	            }
			} else {
				note = rnote;
			}
			if (note.num_replies == 0) {
				oInst.ui.systemMessage({
					message: "No Replies Yet",
					level: 9,
					domobj: $('reply-notes')
				});
			}
			else {
	            oInst.loadReplies();
			}
			oInst.uiSetNoteDetail(note);
        };
		
		this.ajaxWrapper.call({
			url : properties.api_urls.note,
			url_options: {
	            note_id: id,
				show_replies: true
	        },
			handlerFunc: handlerFunc,
			errFunc: function() {
				clearInterval(properties.interval.getreplies);
			},
			action: "Get Note Detail",
			auth: true
		});
	},
	getNotes : function(){
		this.ui.systemMessage({
			message: "Getting notes"
		});
		this.ui.systemMessage({
			message: "Collecting notes from Pownce.",
			level: 9,
			domobj: $('notes')
		});
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get Notes error: " + t.responseText,
					level: 6
				});
				clearInterval(properties.interval.getnotes);
                oInst.ui.systemMessage({
					message: "Ack! Server error, try again later.",
					level: 5
				});
				oInst.doLogout();
				return false;
			}
			var response = t.responseText;
			//response = response.replace(/\\u00/gim, "\\\\u00");
            var notes = eval("(" + response + ")");
			oInst.ui.systemMessage({
				message: "Notes received"
			});
			properties.json.notes = notes.notes;
			properties.ui.has_next_notes_page = notes.notes.has_next_page;
			oInst.uiChangeView("notes");
			oInst.loadNotes();
        };
		this.ajaxWrapper.call({
			url : properties.api_urls.note_list,
			url_options: {
	            limit: properties.settings.max_notes,
				page: properties.pages.currentNotesPage
	        },
			handlerFunc: handlerFunc,
			errFunc: function() {
	            oInst.ui.systemMessage({
					message: "Ack! Server error, try again later.",
					level: 5
				});
				oInst.doLogout();
			},
			action: "Get Notes",
			auth: true
		});
    },
	getProfile: function(){
		this.ui.systemMessage({
			message: "Getting User Profile"
		});
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get Profile error: " + t.responseText,
					level: 6
				});
				oInst.ui.systemMessage({
					message: "Ack! Server error, try again later.",
					level: 5
				});
				oInst.doLogout();
				return false;
			}
            var user = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage({
				message: "Profile received"
			});
            properties.user.profile = user;
			if(properties.ui.is_win)
				oInst.ui.enableWindowMenu();
			else if(properties.ui.is_osx)
				oInst.ui.enableApplicationMenu();
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
            if (user.friend_request_count > 0) {
				oInst.ui.alertNewFriendRequest();
            }
            oInst.collectNotes();
        };
		this.ajaxWrapper.call({
			url : properties.api_urls.profile,
			handlerFunc: handlerFunc,
			action: "Get Profile",
			auth: true
		});
    },
    getSendTo : function(){
		this.ui.systemMessage({
			message: "Getting send to list"
		});
        var oInst = this;
        var handlerFunc = function(t){
			air.trace(t.responseText);
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get SendTo error: " + t.responseText,
					level: 6
				});
				oInst.ui.systemMessage({
					message: "Ack! Server error, try again later.",
					level: 5
				});
				oInst.doLogout();
				return false;
			}
            var sets = eval("(" + t.responseText + ")");
			oInst.ui.systemMessage({
				message: "Send to list received"
			});
            properties.json.send_to = sets;
            oInst.loadSendToList();
			$('send-to-id').value = properties.ui.defaultSendto.id;
			$('send-to-text').value = properties.ui.defaultSendto.fullname;
        };
		this.ajaxWrapper.call({
			url : properties.api_urls.send_to_list,
			handlerFunc: handlerFunc,
			action: "Get Send to",
			auth: true
		});
    },
    getUser: function(username,limit) {
		this.ui.systemMessage({
			message: "Getting User Profile"
		});
        var oInst = this;
        var handlerFunc = function(t){
			if(oInst.isError(t.responseText)) {
				oInst.ui.systemMessage({
					message: "Get Profile error: " + t.responseText,
					level: 6
				});
				return false;
			}
            var resp = eval("(" + t.responseText + ")");
			if (limit != 0) {
				if (resp.notes.length == 0) {
					oInst.getUser(username,0);
				} else {
					var user = resp.notes[0].sender;
					user.last_note_id = resp.notes[0].id;
					user.last_note_body = resp.notes[0].body;
					user.last_note_type = resp.notes[0].type;
					oInst.ui.systemMessage({
						message: "Profile received"
					});
					oInst.uiChangeView("profile",user);
				}
			} else {
				oInst.uiChangeView("profile",resp);
			}
        };

		var url = "";
		if(limit==0)
			url = POWNCE_API_DOMAIN + "2.0/users/" + username + ".json?{app_key}";
        else
			url = POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/note_lists/" + username + ".json?{app_key}&limit=" + limit;
		
		this.ajaxWrapper.call({
			url : url,
			url_options : {
				limit: limit
			},
			handlerFunc: handlerFunc,
			action: "Get User",
			auth: true
		});
	},
	
	addNewNotes: function(notes) {
		var noteobjs = $('notes').getElementsByTagName("li");
		var cnt = 0;
		for(i=noteobjs.length-1;i >= 0; i--) {
			$('notes').removeChild(noteobjs[i]);
			cnt++;
			if(cnt==notes.length+1)
				break;
		}
		for(i=0;i<notes.length;i++) {
            var note = notes[i];
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
            $('notes').insertBefore(notedom,noteobjs[0]);
		}
		var li = document.createElement("li");
		li.className = "paging";
		var nextdiv = document.createElement("div");
		nextdiv.className = "next-notes";
		//nextdiv.style.color = properties.ui.link_color;
		nextdiv.innerHTML = "Next Page";
		nextdiv.addEventListener('click',function() {
			chat.nextNotesPage();
		});
		li.appendChild(nextdiv);
		if (properties.pages.currentNotesPage > 0) {
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "Previous Page";
			//prevdiv.style.color = properties.ui.link_color;
			prevdiv.addEventListener('click', function(){
				chat.lastNotesPage();
			});
			li.appendChild(prevdiv);
		}
		this.ui.addNote(li);
	},
	
	/** DB Functions **/	
	addFavoriteToDB: function(note) {
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.create_table_favorites);
        
        note = this.prepareNoteForDB(note);
        
        db.query(properties.sql.insert_favorites, {
            id: note.id,
            body: note.body,
            permalink: note.permalink,
            sender_id: note.sender.id,
            timestamp: note.timestamp,
            stars: note.stars,
            type: note.type,
            reply_to: note.reply_to,
            link_url: note.link.url,
            oembed_type: note.oembed.type,
            oembed_provider_name: note.oembed.provider_name,
            oembed_provider_url: note.oembed.provider_url,
            oembed_html: note.oembed.html,
            oembed_author_url: note.oembed.author_url,
            oembed_title: note.oembed.title,
            oembed_author_name: note.oembed.author_name,
            oembed_url: note.oembed.url,
            oembed_height: note.oembed.height,
            oembed_width: note.oembed.width,
            file_type: note.file.type,
			file_content_type: note.file.content_type,
			file_name: note.file.name,
			file_storage_name: note.file.storage_name,
            file_url: note.file.url,
            file_direct_url: note.file.direct_url,
			file_content_length: note.file.content_length,
			file_content_delivery: note.file.content_delivery,
			file_in_s3: file.in_s3,
            event_name: note.event.name,
            event_location: note.event.location,
            event_date: note.event.date,
			event_google_map_url: note.event.google_map_url, 
			event_ical: note.event.ical, 
			event_yahoo_map_url: note.event.yahoo_map_url,
			num_replies: note.num_replies, 
			num_recipients: note.num_recipients, 
			is_public: note.is_public, 
			is_private: note.is_private
			
        });
        db.commit();
	},
	saveNotesToDB: function() {
		air.trace("saving notes");
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.create_table_notes);
        
		for (i = 0; i < properties.json.notes.length; i++) {
			
			var note = properties.json.notes[i];
			
			note = this.prepareNoteForDB(note);
			
			db.query(properties.sql.insert_notes, {
				id: note.id,
				body: note.body,
				permalink: note.permalink,
				sender_id: note.sender.id,
				timestamp: note.timestamp,
				stars: note.stars,
				type: note.type,
				reply_to: note.reply_to,
				link_url: note.link.url,
				oembed_type: note.oembed.type,
				oembed_provider_name: note.oembed.provider_name,
				oembed_provider_url: note.oembed.provider_url,
				oembed_html: note.oembed.html,
				oembed_author_url: note.oembed.author_url,
				oembed_title: note.oembed.title,
				oembed_author_name: note.oembed.author_name,
				oembed_url: note.oembed.url,
				oembed_height: note.oembed.height,
				oembed_width: note.oembed.width,
				file_type: note.file.type,
				file_content_type: note.file.content_type,
				file_name: note.file.name,
				file_storage_name: note.file.storage_name,
				file_url: note.file.url,
				file_direct_url: note.file.direct_url,
				file_content_length: note.file.content_length,
				file_content_delivery: note.file.content_delivery,
				file_in_s3: file.in_s3,
				event_name: note.event.name,
				event_location: note.event.location,
				event_date: note.event.date,
				event_google_map_url: note.event.google_map_url,
				event_ical: note.event.ical,
				event_yahoo_map_url: note.event.yahoo_map_url,
				num_replies: note.num_replies,
				num_recipients: note.num_recipients,
				is_public: note.is_public,
				is_private: note.is_private
			
			});
		}
        db.commit();
		air.trace("done saving notes");
	},
	addPersonToDB: function(person) {
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.create_table_people);
        
        person = this.preparePersonForDB(person);
        
        db.query(properties.sql.insert_person, {
            id: person.id,
            first_name: person.first_name,
			last_name: person.last_name,
			short_name: person.short_name,
            visible: person.visible,
            status: person.status,
            temp_visible: person.temp_visible,
            username: person.username,
            location: person.location,
            medium_photo_url: person.profile_photo_urls.medium_photo_url,
            age: person.age,
            gender: person.gender,
            relationship: person.relationship,
            small_photo_url: person.profile_photo_urls.small_photo_url,
            large_photo_url: person.profile_photo_urls.large_photo_url,
            is_pro: person.is_pro,
            blurb: person.blurb,
            permalink: person.permalink,
            friend_count: person.friend_count,
            fan_count: person.fan_count,
            fan_of_count: person.fan_of_count,
            country: person.country,
            max_upload_mb: person.max_upload_mb,
            first_name: person.first_name,
            smedium_photo_url: person.profile_photo_urls.smedium_photo_url,
            tiny_photo_url: person.profile_photo_urls.tiny_photo_url
        });
        db.commit();
	},
	updateFavorite: function(opts) {
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.update_favorite,opts);
        
        db.commit();
		
        return true;
	},
	deleteAllFavorites: function() {
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.delete_all_favorites);
        
        db.commit();
		
        this.loadFavorites();
		
        return true;
	},
	deleteAllPeople: function() {
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.delete_all_people);
		
        db.commit();
		
		return true;
	},
	deleteFavorite: function(id) {
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        db.query(properties.sql.delete_favorite_by_id, {
            id: id
        });
        
        db.commit();
        this.loadFavorites();
        return true;
	},
	getFriendCount : function() {
        var db = new PownceDesktop.DB();
        db.connect();
       	db.query(properties.sql.create_table_people);
        var count = 0;
        var result = db.query(properties.sql.count_people);
        if (!result || !result.data || result.data.length == 0) {
            return count;
        }
        db.commit();
        count = result.data[0].count;
        return count;
	},
	loadFavorites: function() {
        
        var db = new PownceDesktop.DB();
        
        this.ui.systemMessage({
            message: "Loading Favorites From DB ",
            level: 6
        });
        
        db.connect();
        
        db.query(properties.sql.create_table_favorites);

        // accessing the data is shown in a subsequent code listing
        var result = db.query(properties.sql.select_favorties, {
            order_by: "fav_id",
            direction: "DESC"
        });
		db.commit();
        if (!result || !result.data || result.data.length == 0) {
	        this.ui.systemMessage({
	            message: "Sorry no favorite notes yet.",
				domobj: $('favorites'),
	            level: 9
	        });
            return false;
        }
        $('favorites').innerHTML = "";
        for (i = 0; i < result.data.length; i++) {
            var note = result.data[i];
			note = this.prepareNoteFromDB(note);
            $('favorites').appendChild(this.uiCreateNote(note));
        }
		
        this.ui.systemMessage({
            message: "Done Loading Favorites From DB ",
            level: 6
        });
        return true;
	},
	loadNotesFromDB: function() {
        
        var db = new PownceDesktop.DB();
        
        this.ui.systemMessage({
            message: "Loading Notes From DB ",
            level: 6
        });
        
        db.connect();
        
        db.query(properties.sql.create_table_notes);

        // accessing the data is shown in a subsequent code listing
        var result = db.query(properties.sql.select_notes, {
            order_by: "note_id",
            direction: "DESC"
        });
		db.query(properties.sql.delete_all_notes);
		db.commit();
        if (!result || !result.data || result.data.length == 0) {
            return false;
        }
        $('notes').innerHTML = "";
		properties.filter.users = {};
		properties.filter.users.count = 0;
		properties.json.online_peeps = {};
		if (properties.pages.currentNotesPage > 0) {
			var li = document.createElement("li");
			li.className = "paging";
			var nextdiv = document.createElement("div");
			nextdiv.className = "next-notes";
			nextdiv.innerHTML = "Next Page";
			nextdiv.addEventListener('click',function() {
				chat.nextNotesPage();
			});
			li.appendChild(nextdiv);
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "Previous Page";
			prevdiv.addEventListener('click', function(){
				chat.lastNotesPage();
			});
			li.appendChild(prevdiv);
			this.ui.addNote(li);
		}
		
        for (i = 0; i < result.data.length; i++) {
            var note = result.data[i];
			note = this.prepareNoteFromDB(note);
			properties.json.notes.push(note);
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
            this.ui.addNote(this.uiCreateNote(note));
        }
		properties.ui.latestNoteId = properties.json.notes[0].id;
		
		var li = document.createElement("li");
		li.className = "paging";
		var nextdiv = document.createElement("div");
		nextdiv.className = "next-notes";
		//nextdiv.style.color = properties.ui.link_color;
		nextdiv.innerHTML = "Next Page";
		nextdiv.addEventListener('click',function() {
			chat.nextNotesPage();
		});
		li.appendChild(nextdiv);
		if (properties.pages.currentNotesPage > 0) {
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "Previous Page";
			//prevdiv.style.color = properties.ui.link_color;
			prevdiv.addEventListener('click', function(){
				chat.lastNotesPage();
			});
			li.appendChild(prevdiv);
		}
		this.ui.addNote(li);
        this.ui.systemMessage({
            message: "Done Loading Notes From DB ",
            level: 6
        });
        return true;
	},
	loadPeople: function() {
        var db = new PownceDesktop.DB();
        
        this.ui.systemMessage({
            message: "Loading People From DB ",
            level: 6
        });
        
        db.connect();
        
        // accessing the data is shown in a subsequent code listing
        var result = db.query(properties.sql.select_people, {
            order_by: "first_name",
            direction: "DESC"
        });
        db.commit();
        if (!result.data || result.data.length == 0) {
            $('favorites').innerHTML = "Sorry no favorite notes yet.";
            return false;
        }
        $('people').innerHTML = "";
        for (i = 0; i < result.data.length; i++) {
            var user = result.data[i];
            user.profile_photo_urls = {
                smedium_photo_url: user.smedium_photo_url,
                small_photo_url: user.small_photo_url,
                tiny_photo_url: user.tiny_photo_url,
                medium_photo_url: user.medium_photo_url,
                large_photo_url: user.large_photo_url
            };
			var fullname = ((user.last_name&&user.last_name!="")?user.first_name + " " + user.last_name:user.short_name);
			if (properties.json.online_peeps[user.id]) {
                user.visible = properties.json.online_peeps[user.id].visible;
                user.status = properties.json.online_peeps[user.id].status;
            }
            user.temp_visible = false;
            if (properties.filter.peoplestr != "" && properties.filter.peoplestr.length > 1) {
                var fullname_match = (fullname && fullname.toLowerCase().match(properties.filter.peoplestr.toLowerCase())) ? true : false;
                var username_match = (user.username.toLowerCase().match(properties.filter.peoplestr.toLowerCase())) ? true : false;
                var location_match = (user.location && user.location.toLowerCase().match(properties.filter.peoplestr.toLowerCase())) ? true : false;
                if (fullname_match || username_match || location_match) {
                    user.temp_visible = true;
                    user.visible = false;
                } else {
                    user.temp_visible = false;
                    user.visible = false;
                }
            }
            if ((user.visible == true || user.temp_visible == true)) {
                this.ui.addPerson(this.ui.createPerson(user));
            }
        }
        this.ui.systemMessage({
            message: "Done Loading People From DB ",
            level: 6
        });
        return true;
	},
	prepareNoteFromDB: function(note) {
		note.body = note.body.replace(/&#39;/gim, "'");
        note.body = note.body.replace(/\n\n/gim, "\n");
		note.id = note.note_id;
		note.is_public = (note.is_public=="true")?true:false;
		note.is_private = (note.is_private=="true")?true:false;
		note.seconds_since = getSecondsSince(note.timestamp);
		note.display_since = getDisplaySince(note.seconds_since);
		if (note.sender_id == properties.user.profile.id) {
			note.sender = properties.user.profile;
		} else {
			note.sender = {
				"username": note.username,
				"friend_count": note.friend_count,
				"permalink": note.permalink,
				"last_name": note.last_name,
				"fan_count": note.fan_count,
				"short_name": note.short_name,
				"country": note.country,
				"age": note.age,
				"max_upload_mb": note.max_upload_mb,
				"first_name": note.first_name,
				"profile_photo_urls": {
					"smedium_photo_url": note.smedium_photo_url,
					"small_photo_url": note.small_photo_url,
					"tiny_photo_url": note.tiny_photo_url,
					"medium_photo_url": note.medium_photo_url,
					"large_photo_url": note.large_photo_url
				},
				"relationship": note.relationship,
				"blurb": note.blurb,
				"gender": note.gender,
				"fan_of_count": note.fan_of_count,
				"id": note.sender_id,
				"is_pro": (note.is_pro == "true") ? true : false,
				"location": note.location
			};
		}
		if (note.oembed_url != "") {
			note.oembed = {
				"provider_url": note.oembed_provider_url,
				"title": note.oembed_title,
				"url": note.oembed_url,
				"author_name": note.oembed_author_name,
				"height": note.oembed_height,
				"width": note.oembed_width,
				"author_url": note.oembed_author_url,
				"provider_name": note.oembed_provider_name,
				"type": note.oembed_type,
				"html": note.oembed_html
			};
		}
		if (note.link_url != "") {
			note.link = {
				"url": note.link_url
			};
		}
		if (note.file_url!="") {
            note.file = {
                "content_length": note.file_content_length, 
                "name": note.file_name, 
                "storage_name": note.file_storage_name, 
                "url": note.file_url, 
                "in_s3": (note.file_in_s3=="true")?true:false, 
                "content_type": note.file_content_type, 
                "content_delivery": note.file_content_delivery, 
                "direct_url": note.file_direct_url, 
                "type": note.file_type
            }; 
		}
		if (note.event_date!="") {
            note.event = {
                "name": note.event_name, 
                "google_map_url": note.event_google_map_url, 
                "ical": note.event_ical, 
                "location": note.event_location, 
                "date": note.event_date, 
                "yahoo_map_url": note.event_yahoo_map_url
            }; 
		}
		return note;
	},
	prepareNoteForDB: function(note) {
		if(!note.body)
			note.body = "";
		if(!note.stars)
			note.stars = "";
		if(!note.reply_to)
			note.reply_to = -1;

        if (note.link) {
			if(!note.link.url)
				note.link.url = "";
        } else {
            note.link = {
                "url": "",
            };
        }
        if (note.oembed) {
            if (!note.oembed.url) 
                note.oembed.url = "";
            if (!note.oembed.title) 
                note.oembed.title = "";
            if (!note.oembed.html) 
                note.oembed.html = "";
            if (!note.oembed.author_name) 
                note.oembed.author_name = "";
            if (!note.oembed.author_url) 
                note.oembed.author_url = "";
            if (!note.oembed.provider_name) 
                note.oembed.provider_name = "";
            if (!note.oembed.provider_url) 
                note.oembed.provider_url = "";
            if (!note.oembed.type) 
                note.oembed.type = "";
            if (!note.oembed.width) 
                note.oembed.width = 0;
            if (!note.oembed.height) 
                note.oembed.height = 0;
            note.oembed.title = note.oembed.title.replace(/'/gim, "&#39;");
            note.oembed.title = note.oembed.title.replace(/{/gim, "&#123;");
            note.oembed.provider_name = note.oembed.provider_name.replace(/'/gim, "&#39;");
            note.oembed.provider_name = note.oembed.provider_name.replace(/{/gim, "&#123;");
            note.oembed.author_name = note.oembed.author_name.replace(/'/gim, "&#39;");
            note.oembed.author_name = note.oembed.author_name.replace(/{/gim, "&#123;");
        } else {
            note.oembed = {
                "url": "",
                "title": "",
                "html": "",
                "author_name": "",
                "author_url": "",
                "provider_name": "",
				"provider_url": "",
				"type": "",
				"height": 0,
				"width": 0
            };
        }
        if (note.file) {
            if (!note.file.type) 
                note.file.type = "";
            if (!note.file.url) 
                note.file.url = "";
            if (!note.file.direct_url) 
                note.file.direct_url = "";
			if(!note.file.content_type)
				note.file.content_type = "";
			if(!note.file.name)
				note.file.name = "";
			if(!note.file.storage_name)
				note.file.storage_name = "";
			if(!note.file.content_length)
				note.file.content_length = 0;
			if(!note.file.content_delivery)
				note.file.content_delivery = "";
			if(!note.file.in_s3)
				note.file.in_s3 = "";
        } else {
            note.file = {
                "type": "",
                "url": "",
                "direct_url": "",
				"content_type": "",
				"name": "",
				"storage_name": "",
				"content_length": 0,
				"content_delivery": "",
				"in_s3": ""				
            };
        }
        if (note.event) {
            if (!note.event.name) 
                note.event.name = "";
            if (!note.event.location) 
                note.event.location = "";
            if (!note.event.date) 
                note.event.date = "";
			if(!note.event.google_map_url)
				note.event.google_map_url = "";
			if(!note.event.ical)
				note.event.ical = "";
			if(!note.event.yahoo_map_url)
				note.event.yahoo_map_url = "";
            note.event.name = note.event.name.replace(/'/gim, "&#39;");
            note.event.name = note.event.name.replace(/{/gim, "&#123;");
            note.event.location = note.event.location.replace(/'/gim, "&#39;");
            note.event.location = note.event.location.replace(/{/gim, "&#123;");
        } else {
            note.event = {
                "name": "",
                "location": "",
                "date": "",
				"google_map_url": "",
				"ical": "",
				"yahoo_map_url": ""				
            };
        }
        
        if (note.event) {
            if (!note.event.name) 
                note.event.name = "";
            if (!note.event.location) 
                note.event.location = "";
            if (!note.event.date) 
                note.event.date = "";
            note.event.name = note.event.name.replace(/'/gim, "&#39;");
            note.event.name = note.event.name.replace(/{/gim, "&#123;");
            note.event.location = note.event.location.replace(/'/gim, "&#39;");
            note.event.location = note.event.location.replace(/{/gim, "&#123;");
        } else {
            note.event = {
                "name": "",
                "location": "",
                "date": ""
            };
        }
        
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
		if(!person.last_name)
			person.last_name = "";
		person.blurb = person.blurb.replace(/'/gim,"&#39;");
		return person;
	},
	prepareSQL: function(query, tokens) {
		for( var token in tokens) {
	        query = query.replace("{" + token + "}", tokens[token]);
		}
		return query;
	},
	
	/** Event Handlers **/
    doAddFriend: function(username){
		this.ui.systemMessage({
			message: "Sending Friend Request"
		});
        $('request-friend').style.display = "none";
		var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage({
				message: t.responseText,
				level: 6
			});
			oInst.ui.systemMessage({
				message: "Friend Request Sent"
			});
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
		
		this.ajaxWrapper.call({
			url : properties.api_urls.add_friend + "?" + params,
			handlerFunc: handlerFunc,
			action: "Add Friend",
			auth: true
		});
    },
    doRemoveFriend: function(username){
		this.ui.systemMessage({
			message: "Removing Friend"
		});
		$('request-friend').style.display = "none";
		var oInst = this;
		var handlerFunc = function(t){
			oInst.ui.systemMessage({
				message: t.responseText,
				level: 6
			});
			oInst.ui.systemMessage({
				message: "Friend Removed"
			});
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
			
		this.ajaxWrapper.call({
			url : properties.api_urls.remove_friend + "?" + params,
			handlerFunc: handlerFunc,
			action: "Remove Friend",
			auth: true
		});
    },
	doBrowseForFile: function() {
		properties.ui.upload_file.browseForOpen( 'Select File' );
	},
    doCancelRequest: function(username){
			this.ui.systemMessage({
				message: "Removing Friend"
			});
			$('request-friend').style.display = "none";
			var oInst = this;
			var handlerFunc = function(t){
				oInst.ui.systemMessage({
					message: t.responseText,
					level: 6
				});
				oInst.ui.systemMessage({
					message: "Friend Removed"
				});
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

		this.ajaxWrapper.call({
			url : properties.api_urls.cancel_friend + "?" + params,
			handlerFunc: handlerFunc,
			action: "Cancel Friend",
			auth: true
		});
    },
	doSelectFile: function(e) {
		$('file-url').value = properties.ui.upload_file.name;
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
				$('screen').style.display = "block";
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
    doLogout: function() {
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
	beforeClose: function() {
		if(window.nativeWindow.x > 0)
			properties.settings.x = window.nativeWindow.x;
		else
			properties.settings.x = 200;
			
		if(window.nativeWindow.y > 0)
			properties.settings.y = window.nativeWindow.y;
		else
			properties.settings.y = 200;
			
		properties.settings.width = window.nativeWindow.width;
		properties.settings.height = window.nativeWindow.height;

        chat.doSaveProperties();
		chat.saveNotesToDB();
		chat.doClose();
	},
    doClose: function(){
		if(properties.ui.is_win)
        	air.NativeApplication.nativeApplication.icon.bitmaps = [];
        if (properties.ui.openWindow) {
            properties.ui.openWindow.close();
        }
        window.nativeWindow.close();
        air.NativeApplication.nativeApplication.exit();
    },
    doDeleteNote: function(id){
    	var note = this.getNoteById(id);
		this.ui.systemMessage({
			message: "Deleting note"
		});
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage({
				message: "Note deleted"
			});
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

		this.ajaxWrapper.call({
			url : properties.api_urls.delete_note + "?" + params,
			handlerFunc: handlerFunc,
			action: "Delete Note",
			auth: true
		});
    },
    doDragOver: function(e){
        this.uiChangeView('new','file');
    	e.preventDefault();
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
		properties.ui.upload_file.addEventListener( air.IOErrorEvent.IO_ERROR, function(error) { chat.ui.systemMessage({
			message: "IO Upload Error: " + e.message,
			level: 6
		}); });
    },
    doForwardNote: function(id){
		$('screen').style.display = "none";
		$('forward-note').style.display = "none";
		var note = this.getNoteById(id);
        if (!note) {
            return;
        }
		this.ui.systemMessage({
			message: "Forwarding note"
		});
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage({
				message: "Note forwarded"
			});
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
			oInst.ui.systemMessage({
				message: "forward note failure: " + t.responseText,
				level: 6
			});
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
	        file = file.resolvePath("pownce.properties");
	        var props = "{version:" + VERSION + ",settings:{x:" + properties.settings.x + ",y:" + properties.settings.y + ",width:" + properties.settings.width + ",height:" + properties.settings.height + ",sound:'" + properties.settings.sound + "',max_notes:" + properties.settings.max_notes + ", minimize_to_tray: " + properties.settings.minimize_to_tray + ",auto_login:" + properties.settings.auto_login + "}}";
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
			this.ui.systemMessage({
				message: "Error: " + e.message,
				level: 6
			});
		}
    },
    doPostNewNote: function(){
        $('postit').disabled = true;
        var type = $('note-type').value;
		
        this.ui.systemMessage({
			message: "Sending " + type
		});
        
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
				this.ui.systemMessage({
					message: "You must enter a message in the message box.",
					level: 2
				});
				return;
			}
			url = properties.api_urls.post_a_message;
            params = "note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        } else if (type == "link") {
			if(link==""||link=="http://") {
				this.ui.systemMessage({
					message: "You must enter a url in the url box.",
					level: 2
				});
				return;
			}
			if(body=="post a note...") {
				body = "";
			}
            url = properties.api_urls.post_a_link;
            params = "url=" + link + "&note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        } else if (type == "file") {
			if($('file-url').value=="") {
				this.ui.systemMessage({
					message: "You must select a file to upload.",
					level: 2
				});
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
				this.ui.systemMessage({
					message: "You must enter an event name.",
					level: 2
				});
				return;
			}
			if(event_location==""||event_location=="Where at?") {
				this.ui.systemMessage({
					message: "You must enter a location.",
					level: 2
				});
				return;
			}
			if(date=="") {
				this.ui.systemMessage({
					message: "You must enter a date.",
					level: 2
				});
				return;
			}
			if(time=="") {
				this.ui.systemMessage({
					message: "You must enter a time.",
					level: 2
				});
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
			oInst.ui.systemMessage({
				message: "Sent new note"
			});
			oInst.ui.clearNewNote();
            oInst.uiChangeView("notes");
            oInst.getNotes();
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage({
				message: "post note failure: " + t.responseText,
				level: 6
			});
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
		this.ui.systemMessage({
			message: "Sending reply"
		});
        var id = properties.ui.currentNoteDetail;
        var note = this.getNoteById(id);
		$('reply-body').disabled = true;
		$('reply-button').disabled = true;
        var oInst = this;
        var handlerFunc = function(t){
			oInst.ui.systemMessage({
				message: t.responseText,
				level: 6
			});
            var resp = eval('(' + t.responseText + ')');
            if (resp.error) {
            	oInst.ui.systemMessage({
					message: "Could not send reply"
				});
                return;
            }
			oInst.ui.systemMessage({
				message: "Reply sent"
			});
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
            this.ui.systemMessage({
				message: "Did you put anything in?"
			})
            return;
        }
        var url = properties.api_urls.post_a_reply;
        var params = "reply_to=" + id + "&stars=" + stars + "&rsvp=" + rsvp + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
		var errFunc = function(t) {
			oInst.ui.systemMessage({
				message: "post reply failure: " + t.responseText,
				level: 6
			});
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
		if(!properties.settings.sound||properties.settings.sound=="none")
			return;
        var s = new air.Sound();
        s.addEventListener(air.Event.COMPLETE, onSoundLoaded);
        var req = new air.URLRequest("default/sounds/" + properties.settings.sound + ".mp3");
        s.load(req);
        
        function onSoundLoaded(event){
            var localSound = event.target;
            localSound.play();
        }
        
    },
	doUploadFileComplete: function(e) {
		this.ui.systemMessage({
			message: "Sent new note"
		});
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
		$('notes').scrollTop = pos[1] - offset;
	},
	nextNote: function() {
		if(properties.ui.current_scroll_note < properties.json.notes.length - 1) {
			properties.ui.current_scroll_note++;
			var id = properties.json.notes[properties.ui.current_scroll_note].id;
			this.scrollToNote(id);
		}
	},
	lastNote: function() {
		if(properties.ui.current_scroll_note > 0) {
			properties.ui.current_scroll_note--;
			var id = properties.json.notes[properties.ui.current_scroll_note].id;
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
		this.ui.systemMessage({
			message: "Marking as downloaded",
			level: 6
		});
        var handlerFunc = function(t){
			
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage({
				message: "mark as downloaded failure: " + t.responseText,
				level: 6
			});
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
    
    /** Get Functions **/
	getNewVersion: function(latest) {
        var urlString = "http://pownce.com/download/Pownce.air";
        var urlReq = new air.URLRequest(urlString);
        var urlStream = new air.URLStream();
        var fileData = new air.ByteArray();
        urlStream.addEventListener(air.Event.COMPLETE, loaded);
        urlStream.load(urlReq);
		var oInstk = oInst;
        function loaded(event) {
            urlStream.readBytes(fileData, 0, urlStream.bytesAvailable);
            writeAirFile();
        }
        function writeAirFile(){
            var file = air.File.desktopDirectory.resolvePath("Pownce.air");
            var fileStream = new air.FileStream();
            fileStream.open(file, air.FileMode.WRITE);
            fileStream.writeBytes(fileData, 0, fileData.length);
            fileStream.close();
            var updater = new air.Updater();
            var airFile = air.File.desktopDirectory.resolvePath("Pownce.air");
            updater.update(airFile, latest);
        }
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
        var db = new PownceDesktop.DB();
        
        db.connect();
        
        var result = db.query(properties.sql.select_person_by_id, {
            id: id
        });
        
        if (!result.data || result.data.length == 0) {
            return null;
        }
        db.commit();
        user = result.data[0];
        user.profile_photo_urls = {
            smedium_photo_url: user.smedium_photo_url,
            small_photo_url: user.small_photo_url,
            tiny_photo_url: user.tiny_photo_url,
            medium_photo_url: user.medium_photo_url,
            large_photo_url: user.large_photo_url
        };
        var fullname = user.name;
        if (this.getUserFullName(user.id)) 
            fullname = this.getUserFullName(user.id);
        user.name = fullname;
        return user;
   },
	getOtherProfiles: function(homepage) {
		this.ui.systemMessage({
			message: "Getting user profiles"
		});
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
			oInst.ui.systemMessage({
				message: "User profiles received"
			});
        };
		var errFunc = function(t) {
			oInst.ui.systemMessage({
				message: "get user theme failure: " + t.responseText,
				level: 6
			});
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
		this.ui.systemMessage({
			message: "Getting user theme"
		});
        var oInst = this;
        var handlerFunc = function(t){
            var page = t.responseText;
			if(page.match("<title>Pownce / 404</title>")||page.match("<title>Pownce / 500</title>")) {
				oInst.getNotes();
				return;
			}
			oInst.ui.systemMessage({
				message: "User theme received"
			});
            oInst.collectNotes();
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
			oInst.ui.systemMessage({
				message: "get user theme failure: " + t.responseText,
				level: 6
			});
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
        if (reply.sender.username != properties.user.profile.username) {
            var menu = new air.NativeMenu();
            if (reply.sender.relationship!="friend") {
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
		var ssname = (reply.sender.last_name)?reply.sender.first_name + " " + reply.sender.last_name : reply.sender.short_name;
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
        }
        
        if (reply.sender.username != properties.user.profile.username) {
			var replink = document.createElement("a");
			replink.href = "#";
			replink.innerHTML = "Reply";
			//replink.style.color = properties.ui.link_color;
			replink.addEventListener("click", function(){
				var text = "!" + reply.sender.username + " ";
				$('reply-body').value += text;
				$('reply-body').setSelectionRange($('reply-body').value.length, $('reply-body').value.length);
				$('reply-body').focus();
			});
			btmdet.appendChild(replink);
		}
        if (reply.sender.username == properties.user.username) {
            var del = document.createElement("a");
            del.href = "#";
            //del.style.color = properties.ui.link_color;
            del.className = "deletelink";
            del.innerHTML = "Delete";
            del.addEventListener("click", function(){
                chat.ui.systemMessage({
                    title: "Delete Note?",
                    message: "Yikes! You're about to delete this note! Are you sure?",
                    level: 3,
                    callback: function(){
                        chat.doDeleteNote(reply.id);
                        chat.cancelDialog();
                    }
                });
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
		notedom.className = note.type;
        var div = document.createElement("div");
        div.className = "note";
		
		var trim_body = note.body;
		var bdy;
		if (trim_body.length>385) {
			trim_body = trim_body.substring(0,385) + " ...";
			bdy = this.ui.prepareNoteBody(trim_body);
			var ctreading = document.createElement("a");
			ctreading.className = "continue-reading";
			ctreading.innerHTML = "continue reading...";
	        ctreading.addEventListener("click", function(){
	            chat.uiChangeView("reply", note);
	        });
			bdy.appendChild(ctreading);
        }
		else if (false&&trim_body.match(/\r{0,1}\n/gim).length > 12) {
			trim_body = trim_body.substring(0,385) + " ...";
			bdy = this.ui.prepareNoteBody(trim_body);
			var ctreading = document.createElement("a");
			ctreading.className = "continue-reading";
			ctreading.innerHTML = "continue reading...";
	        ctreading.addEventListener("click", function(){
	            chat.uiChangeView("reply", note);
	        });
			bdy.appendChild(ctreading);
        }
		else {
			bdy = this.ui.prepareNoteBody(trim_body);
		}
        var imglnk = document.createElement("a");
        imglnk.className = "imglnk";
        imglnk.addEventListener("click", function(){
            chat.uiChangeView("profile",note.sender);
        });

		var img = document.createElement("img");
        img.src = note.sender.profile_photo_urls.small_photo_url;
        imglnk.appendChild(img);

        

        var btmdet = document.createElement("div");
        if (note.type != "reply") {
	        var btmdet = document.createElement("div");
	        btmdet.className = "bottomdetails";
			
			var userName = document.createElement("span");
			userName.className = "note-username";
			userName.innerHTML = (note.sender.last_name)?note.sender.first_name + " " + note.sender.last_name : note.sender.short_name;
			btmdet.appendChild(userName);
			
			var time = document.createElement("span");
			time.className = "note-time";
			time.innerHTML = note.display_since;
			btmdet.appendChild(time);
			
	        var areplies = document.createElement("a");
	        areplies.href = "#";
	        //areplies.style.color = properties.ui.link_color;
			areplies.className = "note-replies";
			areplies.id = note.id + "_replies";
			var note_id = ((note.type=="reply")?note.reply_to:note.id);
	        areplies.addEventListener("click", function(){
	            chat.uiChangeView("reply", note);
	        });
			areplies.innerHTML = ((note.type=="reply")?"Reply":(note.num_replies==0?"Reply":(note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies"))));
	        btmdet.appendChild(areplies);
            var frwd = document.createElement("a");
			new Tooltip(frwd,"Forward Note");
            //frwd.style.color = properties.ui.link_color;
            frwd.className = "note-forward";
			frwd.href = "#";
            frwd.innerHTML = "Forward";
            frwd.addEventListener("click", function(){
				$('forward-message').value = "!" + note.sender.username + " says: " + note.body;
				$('forward-username').value = note.sender.username;
				$('forward-noteid').value = note.id;
				$('screen').style.display = "block";
				$('forward-note').style.display = "block";
           });
            btmdet.appendChild(frwd);
			var fav = document.createElement("a");
			new Tooltip(fav,"Add to Favorites");
            //fav.style.color = properties.ui.link_color;
			fav.className = "note-favorite";
			fav.href = "#";
			fav.innerHTML = "Favorite";
            fav.addEventListener("click", function(){
				chat.addFavoriteToDB(note);
            });
			btmdet.appendChild(fav);
						
			var recip = document.createElement("div");
			recip.className = "recipients";
			if (note.is_public == true) {
				recip.innerHTML = "Public";
			} else {
				recip.innerHTML = note.num_recipients + " Recipients";
			}
			if(note.num_recipients==1&&note.is_private&&note.sender.id==properties.user.profile.id) {
				recip.className = "recipients private-to-you";
				recip.innerHTML = "Private";
			}
			else if(note.num_recipients==1&&note.is_private) {
				recip.className = "recipients private-to-you";
				recip.innerHTML = "Private to you";
			}
			div.appendChild(recip);
        }
		else {
			var replytolink = document.createElement("a");
			replytolink.className = "reply-to-link";
			replytolink.innerHTML = ((note.sender.last_name)?note.sender.first_name + " " + note.sender.last_name : note.sender.short_name) + " replied <span class='note-time'>" + note.display_since + "</span>";
	        replytolink.addEventListener("click", function(){
	            chat.uiChangeView("reply", note.reply_to);
	        });
			div.appendChild(replytolink);
		}
		div.appendChild(imglnk);
        if (note.sender.username == properties.user.username) {
            var del = document.createElement("a");
            new Tooltip(del,"Delete Note");
            del.href = "#";
            //del.style.color = properties.ui.link_color;
            del.className = "note-delete";
			del.innerHTML = "Delete";
            del.addEventListener("click", function(){
                chat.ui.systemMessage({
                    title: "Delete Note?",
                    message: "Yikes! You're about to delete this note! Are you sure?",
                    level: 3,
                    callback: function(){
                        chat.doDeleteNote(note.id);
                        chat.cancelDialog();
                    }
                });
            });
            btmdet.appendChild(del);
        }
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
		if (note.type != "reply")
        	div.appendChild(btmdet);
        notedom.appendChild(div);
        notedom.addEventListener("mouseover", function() {
				properties.ui.current_scroll_note = chat.getNoteIndexById(note.id);
		});
        return notedom;
    },
    uiCreateReplier: function(user){
        var userdom = document.createElement("li");
        //userdom.style.color = properties.ui.link_color;
        var userimg = document.createElement("img");
        userimg.src = user.profile_photo_urls.tiny_photo_url;
        userdom.appendChild(userimg);
		var ssname = user.short_name;
		if(this.getUserFullName(user.id))
			ssname = this.getUserFullName(user.id);
        var name = document.createTextNode(ssname);
        if (user.username != properties.user.profile.username) {
            var menu = new air.NativeMenu();
            if (user.relationship!="friend") {
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
	selectSound: function(sound) {
		$('sound-default').className = "";
		$('sound-ting').className = "";
		$('sound-whoom').className = "";
		$('sound-none').className = "";
		$('sound-' + sound).className = "selected-sound";
	},
	addSettingsEvents: function() {
	    $('settings-max-notes').addEventListener('change', function(){
            properties.settings.max_notes = $('settings-max-notes').value;
			chat.getNotes();
        });
        $('settings-min-to-tray').addEventListener('click', function(){
            properties.settings.minimize_to_tray = $('settings-min-to-tray').checked;
        });
        $('settings-auto-login').addEventListener('click', function(){
            properties.settings.auto_login = $('settings-auto-login').checked;
        });
		$('sound-default').addEventListener('click', function(){
			properties.settings.sound = "default";
			chat.selectSound("default");
			chat.doPlayEventSound();
        });
		$('sound-ting').addEventListener('click', function(){
			properties.settings.sound = "ting";
			chat.selectSound("ting");
			chat.doPlayEventSound();
        });
		$('sound-whoom').addEventListener('click', function(){
			properties.settings.sound = "whoom";
			chat.selectSound("whoom");
			chat.doPlayEventSound();
        });
		$('sound-none').addEventListener('click', function(){
			properties.settings.sound = "none";
			chat.selectSound("none");
        });
	},
	addToolbarEvents: function() {
		// Toolbar events
        $('toolbutton-home').addEventListener('click', function() {
			if (properties.pages.currentNotesPage != 0) {
				properties.ui.current_scroll_note = 0;
				$('notes').innerHTML = "";
				properties.pages.currentNotesPage = 0;
				chat.getNotes();
			}
			chat.uiChangeView("notes");
		});
        $('toolbutton-new-note').addEventListener('click', function() { 
			chat.uiChangeView("new","message");
		});
        $('toolbutton-favorites').addEventListener('click', function() { 
			chat.uiChangeView("favorites");
		});
		$('refresh-button').addEventListener('click', function(){
            chat.getNotes();
        });
        $('toolbutton-people').addEventListener('click', function() {
			chat.uiChangeView("people");
		});
	},
	uiInitialize: function(){
		//this.ui.clearNewNote();
		
		this.addToolbarEvents();
		
		this.addSettingsEvents();
		
        $('filter-ok').addEventListener('click', function() { 
			$('filter-build-box').style.display = "none";
			chat.uiShowFilter();
			chat.uiChangeView("notes");
		});
		
        $('new-friends').addEventListener('click', function() { 
			$('new-friends').style.display = "none";
			chat.doNavigateToURL("http://pownce.com/friend_requests");
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
			$('screen').style.display = "none";
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
        // Move window
        $('statusbar').addEventListener('mousedown', this.doMove);
        $('toolbar').addEventListener('mousedown', this.doMove);
		
		$('alert-ok').addEventListener('click', function(e) {
			$('alert-box').style.display = "none";
			$('alert-message').innerHTML = "";
		});
		$('new-message').addEventListener('click', function(e) {
			chat.uiChangeView("new","message");
		});
		$('new-link').addEventListener('click', function(e) {
			chat.uiChangeView("new","link");
		});
		$('new-file').addEventListener('click', function(e) {
			chat.uiChangeView("new","file");
		});
		$('new-event').addEventListener('click', function(e) {
			chat.uiChangeView("new","event");
		});
		
		$('cancel-new').addEventListener('click', function(e) {
			chat.uiChangeView("notes");
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
        exitCommand.addEventListener(air.Event.SELECT, this.beforeClose);
        if (air.NativeApplication.supportsSystemTrayIcon) {
            air.NativeApplication.nativeApplication.autoExit = false;
            iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, iconLoadComplete);
            iconLoad.load(new air.URLRequest("icons/icon16.png"));
            secondaryIconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, secondaryIconLoadComplete);
            secondaryIconLoad.load(new air.URLRequest("icons/icon16.png"));
            air.NativeApplication.nativeApplication.icon.tooltip = "Pownce Desktop " + VERSION;
            air.NativeApplication.nativeApplication.icon.menu = iconMenu;
            air.NativeApplication.nativeApplication.icon.addEventListener("click", this.doRestore);
        }
        if (air.NativeApplication.supportsDockIcon) {
            iconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, iconLoadComplete);
            iconLoad.load(new air.URLRequest("icons/icon128.png"));
            secondaryIconLoad.contentLoaderInfo.addEventListener(air.Event.COMPLETE, secondaryIconLoadComplete);
            secondaryIconLoad.load(new air.URLRequest("icons/icon128.png"));
        }
        if (properties.ui.is_win)
		window.nativeWindow.addEventListener(air.NativeWindowDisplayStateEvent.DISPLAY_STATE_CHANGE, function(e) {
			if(e.afterDisplayState=="minimized")
				chat.doMin(e);
		});
		window.nativeWindow.addEventListener(air.Event.CLOSING, function() {
			chat.beforeClose();
		});
		
    },
    uiChangeView: function(view,type){
		properties.ui.currentNoteDetail = -1;
		if (properties.ui.current_mp3player) 
            properties.ui.current_mp3player.stop();
		if(view==null||view=="")
			view = "notes";
		properties.ui.current_view = view;
        $('refresh-button').style.display = "none";
        $('note-view').style.display = "none";
		$('reply-view').style.display = "none";
        $('new-view').style.display = "none";
        $('login').style.display = "none";
        $('settings').style.display = "none";
		$('people-view').style.display = "none";
		$('profile-view').style.display = "none";
		$('favorites-view').style.display = "none";
		$('toolbutton-home').className = "toolbutton";
		$('toolbutton-new-note').className = "toolbutton";
		$('toolbutton-people').className = "toolbutton";
		$('toolbutton-favorites').className = "toolbutton";
		$('reply-body').disabled = false;
		switch (view) {
            case "notes":
				$('toolbutton-home').className = "toolbutton selected-toolbutton";
				$('refresh-button').style.display = "block";
				this.ui.clearNewNote();
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
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				this.ui.clearReply();
                $('settings').style.display = "block";
                break;
			case "new":
				$('reply-button').disabled = false;
				$('id_stars').value = "";
		        $('current-rating').style.width = '0';
		        $('rsvp').selectedIndex = 0;
				$('reply-body').value = "";
				$('toolbutton-new-note').className = "toolbutton selected-toolbutton";
				this.ui.clearReply();
				$('new-view').style.display = "block";
				if(type==null||type=="")
					type = "message";
				$('note-type').value = type;
				$('new-message').className = "new-button";
				$('new-link').className = "new-button";
				$('new-file').className = "new-button";
				$('new-event').className = "new-button";
				switch(type){
					case "message":
						$('new-view').className = "toolwin new-message-type";
						$('new-message').className = "new-button new-selected";
					break;
					case "link":
						$('new-view').className = "toolwin new-link-type";
						$('new-link').className = "new-button new-selected";
					break;
					case "file":
						$('new-view').className = "toolwin new-file-type";
						$('new-file').className = "new-button new-selected";
					break;
					case "event":
						$('new-view').className = "toolwin new-event-type";
						$('new-event').className = "new-button new-selected";
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
				$('login').style.display = "block";
		        $('login-button').style.display = "block";
		        $('login-loading').style.display = "none";
		        $('username').disabled = false;
		        $('password').disabled = false;
		        $('auto-login').disabled = false;
		        $('auto_login').disabled = false;
				break;
			case "reply":
				if(type.id) {
					properties.ui.currentNoteDetail = type.id;
					this.uiSetNoteDetail(type);
					this.ui.systemMessage({
						message: "Collecting Replies from Pownce",
						level: 9,
						domobj: $('reply-notes')
					});
				}
				else {
					properties.ui.currentNoteDetail = type;
				}
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
				$('toolbutton-people').className = "toolbutton selected-toolbutton";
				$('people-view').style.display = "block";
				$('people-filter').focus();
				break;
			case "profile":
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
				$('toolbutton-favorites').className = "toolbutton selected-toolbutton";
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
		
		if (user.relationship=="friend") {
			var link = document.createElement("a");
			link.href = "#";
			link.innerHTML = "Send Note";
			//link.style.color = properties.ui.link_color;
			link.addEventListener("click", function(){
				chat.uiNewNoteTo(user.id);
			});
			$('profile-send-note').appendChild(link);
			var ulink = document.createElement("a");
			ulink.href = "#";
			ulink.innerHTML = "Unfriend";
			//ulink.style.color = properties.ui.link_color;
			ulink.addEventListener("click", function(){
                chat.ui.systemMessage({
                    title: "Remove Friend?",
                    message: "Are you sure you want to unfriend " + user.username + "? This will remove all their notes from your page as well.",
                    level: 3,
                    callback: function(){
                        chat.doRemoveFriend(user.username);
						chat.cancelDialog();
                    }
                });
			});
			$('profile-unfriend').appendChild(ulink);
		} else if (user.relationship=="fanof") {
			var ulink = document.createElement("a");
			ulink.href = "#";
			ulink.innerHTML = "Cancel Request";
			//ulink.style.color = properties.ui.link_color;
			ulink.addEventListener("click", function(){
                $('dialog-ok').value = "Cancel Friend Request";
                chat.ui.systemMessage({
                    title: "Cancel Friend Request?",
                    message: "Are you sure you want to unfriend " + user.username + "? This will remove all their notes from your page as well.",
                    level: 3,
                    callback: function(){
                        chat.doCancelRequest(user.username);
						chat.cancelDialog();
                    }
                });
			});
			$('profile-cancel-request').appendChild(ulink);
		} else {
			var ulink = document.createElement("a");
			ulink.href = "#";
			ulink.innerHTML = "Add Friend";
			//ulink.style.color = properties.ui.link_color;
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
		}
		
		var link = document.createElement("a");
		link.href = "#";
		link.innerHTML = "Homepage";
		//link.style.color = properties.ui.link_color;
		link.addEventListener("click", function() {
			chat.doNavigateToURL(user.permalink);
		});
		$('profile-link').appendChild(link);
		
		var frlink = document.createElement("a");
		frlink.href = "#";
		frlink.innerHTML = user.friend_count + " Friends";
		//frlink.style.color = properties.ui.link_color;
		frlink.addEventListener("click", function() {
			chat.doNavigateToURL("http://pownce.com/" + user.username + "/friends/");
		});
		$('profile-friend-count').innerHTML = "I have: ";
		$('profile-friend-count').appendChild(frlink);
		var falink = document.createElement("a");
		falink.href = "#";
		falink.innerHTML = user.fan_count;
		//falink.style.color = properties.ui.link_color;
		falink.addEventListener("click", function() {
			chat.doNavigateToURL("http://pownce.com/" + user.username + "/fans/");
		});
		$('profile-fan-count').appendChild(falink);
		$('profile-fan-count').appendChild(document.createTextNode(" people think I'm awesome."));
		var faolink = document.createElement("a");
		faolink.href = "#";
		faolink.innerHTML = user.fan_of_count;
		//faolink.style.color = properties.ui.link_color;
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
			var ssname = (note.sender.last_name)?note.sender.first_name + " " + note.sender.last_name : note.sender.short_name;
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
		
		$('note-detail-body').appendChild(this.ui.prepareNoteBody(note.body));
        
		var ssname = (note.sender.last_name)?note.sender.first_name + " " + note.sender.last_name : note.sender.short_name;;
		$('note-details').innerHTML = note.type + " by " + ssname + ", ";
		$('note-details').className = "details-" + note.type;
        var span = document.createElement("span");
        span.innerHTML = note.display_since;
        $('note-details').appendChild(span);
         var areplies = document.createElement("a");
            areplies.href = "#";
            //areplies.style.color = properties.ui.link_color;
            areplies.id = note.id + "_replies";
            areplies.innerHTML = note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies");
            $('note-bottom-details').appendChild(areplies);
            var frwd = document.createElement("a");
            //frwd.style.color = properties.ui.link_color;
            frwd.href = "#";
            frwd.className = "forwardlink";
            frwd.innerHTML = "Forward";
            frwd.addEventListener("click", function(){
				$('forward-message').value = "!" + note.sender.username + " says: " + note.body;
				$('forward-username').value = note.sender.username;
				$('forward-noteid').value = note.id;
				$('screen').style.display = "block";
				$('forward-note').style.display = "block";
            });
            $('note-bottom-details').appendChild(frwd);
            var fav = document.createElement("a");
			//fav.style.color = properties.ui.link_color;
			fav.href = "#";
			fav.className = "favoritelink";
			fav.innerHTML = "Favorite";
            fav.addEventListener("click", function(){
				chat.addFavoriteToDB(note);
            });
            $('note-bottom-details').appendChild(fav);
        if (note.sender.username == properties.user.username) {
            var del = document.createElement("a");
            del.href = "#";
            //del.style.color = properties.ui.link_color;
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
			var res = this.ui.prepareNoteLink(note);
			$('note-link').appendChild(res.medlnk);
			$('note-detail-media-object').appendChild(res.medobj);
		}
		if (note.file) {
			var res = this.ui.prepareNoteFile(note);
			$('note-link').appendChild(res.medlnk);
			$('note-detail-media-object').appendChild(res.medobj);
        } else if (note.event) {
			$('note-detail-event').appendChild(this.ui.prepareNoteEvent(note));
        }


	},
    uiSetTheme: function(header, note, link){
        properties.ui.link_color = link;
        $('user-current-header-color').innerHTML = header.substring(1);
        $('user-current-note-color').innerHTML = note.substring(1);
        $('note-body-style').href = "skin/default/images/n-" + note.substring(1) + "/" + note + ".css";
		$('header-style').href = "skin/default/images/h-" + header.substring(1) + "/" + header + ".css";
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
	
    /** Loading Functions **/
    loadReplies: function(){
		this.ui.systemMessage({
			message: "Loading Replies"
		});
        var id = properties.ui.currentNoteDetail;
        var note = this.getNoteById(id);
        if (!note) {
            this.ui.systemMessage({
				message: "Could not load Replies"
			});
            
            return;
        }
        properties.filter.repliers = {
            count: 0
        };
        note.authors = {};
        var a = 0;
        for (i = 0; i < note.replies.length; i++) {
            var reply = note.replies[i];
            var user = reply.sender;
            var replydom = this.uiCreateReply(reply);
            note.replies[i].replydomobj = replydom;
            this.ui.addReply(replydom);
            if (!note.authors[user.id]) {
                //var userdom = this.uiCreateReplier(user);
                //user.replydomobj = userdom;
                //this.ui.addReplier(userdom);
                //note.authors[user.id] = true;
                //a++;
            }
        }
		if (a == 0) {
            //$('repliers').parentNode.style.display = "none";
        }
        $('reply-notes').scrollTop = $('reply-notes').scrollHeight;
        this.ui.systemMessage({
			message: "Replies loaded"
		});
    },
    loadNotes: function(){
		this.ui.systemMessage({
			message: "Loading Notes"
		});
        if (!properties.json.notes) {
            this.ui.systemMessage({
				message: "Could not load Notes"
			});
            
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
			var nextdiv = document.createElement("div");
			nextdiv.className = "next-notes";
			nextdiv.innerHTML = "Next Page";
			nextdiv.addEventListener('click',function() {
				chat.nextNotesPage();
			});
			li.appendChild(nextdiv);
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "Previous Page";
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
		var nextdiv = document.createElement("div");
		nextdiv.className = "next-notes";
		//nextdiv.style.color = properties.ui.link_color;
		nextdiv.innerHTML = "Next Page";
		nextdiv.addEventListener('click',function() {
			chat.nextNotesPage();
		});
		li.appendChild(nextdiv);
		if (properties.pages.currentNotesPage > 0) {
			var prevdiv = document.createElement("div");
			prevdiv.className = "prev-notes";
			prevdiv.innerHTML = "Previous Page";
			//prevdiv.style.color = properties.ui.link_color;
			prevdiv.addEventListener('click', function(){
				chat.lastNotesPage();
			});
			li.appendChild(prevdiv);
		}
		this.ui.addNote(li);
        this.ui.systemMessage({
			message: "Notes loaded"
		});
		this.ui.refreshNotes();
    },
    loadProperties: function(){
		this.ui.systemMessage({
			message: "Loading properties"
		});
        var f = air.File.applicationStorageDirectory.resolvePath("pownce.properties");
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
						properties.settings[prop] = props.settings[prop];
					}
					
                    $('settings-min-to-tray').checked = properties.settings.minimize_to_tray;
                    $('settings-auto-login').checked = properties.settings.auto_login;
                    $('settings-max-notes').value = properties.settings.max_notes;
					this.selectSound(properties.settings.sound);
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
			this.ui.systemMessage({
				message: "Properties loaded"
			});
        } 
        catch (e) {
        }
    },
    loadSendToList: function(){
        if (!properties.json.send_to.options) {
            this.ui.systemMessage({
				message: "Could not load Send To List"
			});
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
			var pubau = this.ui.createAutocomplete({
				name: "the public",
				username: "",
				photo: POWNCE_API_DOMAIN + "profile_photos/p/o/w/pownce/4134_small.jpg",
				id: "public",
				classname: "to-public"
			});
			if(currentfilter.childNodes.length==0)
				pubau.id = "selectedsendto";
			currentfilter.appendChild(pubau);
		}
        if (sel == "public") 
            properties.ui.defaultSendto.fullname = "the public";
		if (properties.json.send_to.options["all"].toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
            var allau = this.ui.createAutocomplete({
                name: properties.json.send_to.options["all"],
                username: "",
                photo: "",
                id: "all",
                classname: "to-friends"
            });
			if(currentfilter.childNodes.length==0)
				allau.id = "selectedsendto";
			currentfilter.appendChild(allau);
		}
		if (properties.ui.current_view!="new"&&"my friends who haven't seen this yet".toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
			var newau = this.ui.createAutocomplete({
				name: "my friends who haven't seen this yet",
				username: "",
				photo: "",
				id: "newbies",
				classname: "to-newbies"
			});
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
				var setau = this.ui.createAutocomplete({
					name: setnamearray[s],
					username: "",
					photo: "",
					id: reversedsets[setnamearray[s]],
					classname: "to-set"
				});
				if(currentfilter.childNodes.length==0)
					setau.id = "selectedsendto";
				currentfilter.appendChild(setau);
			}
			if (sel == set) 
            	properties.ui.defaultSendto.fullname = setnamearray[s];
        }
		var namearray = [];
		var reversedfriends = {};
		var ids = [];
        for (var private_note in properties.json.send_to.options.private_note) {
            namearray.push(properties.json.send_to.options.private_note[private_note]);
			reversedfriends[properties.json.send_to.options.private_note[private_note]] = private_note;
            var id = private_note.substring(private_note.indexOf("_") + 1);
			ids.push(id);
        }
		namearray.sort();
		for (i = 0; i < namearray.length; i++) {
            var id = reversedfriends[namearray[i]].substring(reversedfriends[namearray[i]].indexOf("_") + 1);
			properties.json.fullname[id] = namearray[i];
			var user = this.getFriendById(id);
			if (namearray[i].toLowerCase().match(properties.filter.sendtostr.toLowerCase())||user.username.toLowerCase().match(properties.filter.sendtostr.toLowerCase())) {
				var pnau = this.ui.createAutocomplete({
					name: namearray[i],
					username: user.username,
					photo: user.profile_photo_urls.small_photo_url,
					id: reversedfriends[namearray[i]],
					classname: "to-user"
				});
				if(currentfilter.childNodes.length==0)
					pnau.id = "selectedsendto";
				currentfilter.appendChild(pnau);
			}
        }
    },
    doNavigateToURL: function(url){
        var urlReq = new air.URLRequest(url);
        air.navigateToURL(urlReq);
    }
};

function getSecondsSince(timestamp){
    timestamp++;
    timestamp--;
    var now = new Date();
    var nots = Math.floor(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), now.getUTCHours(), now.getUTCMinutes(), now.getUTCSeconds(), now.getUTCMilliseconds()) / 1000);
    var seconds_since = nots - timestamp;
    return seconds_since;
}

function getDisplaySince(seconds_since){
    var result = "";
    var montharr = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysuffixarr = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'];
    var now = new Date();
    if (seconds_since >= 604800) {
        var day = Math.floor(((seconds_since / 60) / 60) / 24);
        now.setDate(now.getDate() - day);
        result = montharr[now.getMonth()] + " " + now.getDate() + daysuffixarr[now.getDate()];
    } else if (seconds_since >= 86400) {
        var day = Math.floor(((seconds_since / 60) / 60) / 24);
        if (day == 1) 
            result = day + " day ago";
        else 
            result = day + " days ago";
    } else if (seconds_since >= 3600) {
        var hour = Math.floor((seconds_since / 60) / 60);
        if (hour == 1) 
            result = hour + " hour ago";
        else 
            result = hour + " hours ago";
    } else if (seconds_since >= 120) {
        result = Math.floor((seconds_since / 60)) + " min ago";
    } else {
        result = "just now!";
    }
    return result;
}

PownceDesktop.DisplaySinceCronJob = function() {
	var oInst = this;
	this.update = function() {
        for (i = 0; i < properties.json.notes.length; i++) {
        	var note = properties.json.notes[i];
			note.seconds_since = getSecondsSince(note.timestamp);
			note.display_since = getDisplaySince(note.seconds_since);
			var time = $$("#note_" + note.id + " .note-time");
			if(time.length>0)
				time[0].innerHTML = note.display_since;
        }
	};
	this.stop = function() {
		clearInterval(oInst.dispinterval);
	};
	this.dispinterval = setInterval(this.update,60000);
};

PownceDesktop.AJAX = function() {
	
	var _extraErrCall_;
	var _action_ = "";
	var oInst = this;
	
	this._authcall_ = function(options) {
		
		new Ajax.Request(this._prepareURL_(options.url, options.url_options), {
            onSuccess: options.handlerFunc,
            onFailure: this._errFunc_,
            requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
            method: 'get'
        });
	};
	
	this._hasMinOptions_ = function(options) {
		if(!options.url)
			return false;
		
		return true;
	};
	
	this._errFunc_ = function(t) {
		oInst.ui.systemMessage({
			message: oInst._action_ + " error: " + t.responseText,
			level: 6
		});
		if(oInst._extraErrCall_)
			oInst._extraErrCall_();
		return;
	};
	
	this.call = function (options) {
		
		// If the min options aren't passed in
		if(!this._hasMinOptions_(options))
			return;
		
		oInst._action_ = options.action;
		
		if(options.errFunc)
			this._extraErrCall_ = options.errFunc;
		
		if(!options.url_options)
			options.url_options = {};
		
		if (options.auth == true) {
			this._authcall_(options);
			return;
		}
			
		new Ajax.Request(this._prepareURL_(options.url, options.url_options), {
            onSuccess: options.handlerFunc,
            onFailure: this._errFunc_,
            method: 'get'
        });
	};
	
	this._prepareURL_ = function(url,options) {
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
};

PownceDesktop.DB = function(){

    this._connection;
	var oInst = this;
    this.connect = function(){
    	var dbfile = air.File.applicationStorageDirectory.resolvePath("pownce.db");
        oInst._connection = new air.SQLConnection();
        try {
            // open the database
            oInst._connection.open(dbfile, air.SQLMode.UPDATE);
        } 
        catch (e) {
            try {
                var stream = new air.FileStream();
                stream.open(dbfile, air.FileMode.WRITE);
                stream.close();
                this._connection.open(dbfile, air.SQLMode.UPDATE);
            } 
            catch (error) {
				air.trace(error.message);
				air.trace(error.details);
            }
        }
		oInst._connection.begin();
    };
    this.query = function(sqlStatement, options){
        var result = null;
        try {
            var selectStmt = new air.SQLStatement();
            selectStmt.sqlConnection = oInst._connection;
            selectStmt.text = oInst.prepareSQL(sqlStatement, options);
            try {
                selectStmt.execute();
                result = selectStmt.getResult();
            } 
            catch (error) {
				air.trace(error.message);
				air.trace(error.details);
                return null;
            }
        } 
        catch (error) {
            oInst._connection.rollback();
            return false;
        }
        return result;
    };
    this.commit = function(){
		try {
        oInst._connection.commit();
		}
		catch(e) {}
    };
	this.prepareSQL = function(query, tokens) {
		for( var token in tokens) {
	        query = query.replace("{" + token + "}", tokens[token]);
		}
		return query;
	};
}

PownceDesktop.AutoComplete = function() {
	
};

PownceDesktop.systemMessage = function(obj){
    if (!obj.message) 
        obj.message = obj;
    if (!obj.level) 
        obj.level = 1;
    switch (obj.level) {
        case 1: // status bar message
            $('status-message').innerHTML = obj.message;
            this.constructor({
                message: obj.message,
                level: 6
            });
            break;
        case 2: // alert message
            $('alert-box').style.display = "block";
            $('alert-message').innerHTML = obj.message;
            break;
        case 3: // confirm message
            $('dialog-title').innerHTML = obj.title;
            $('dialog-message').innerHTML = obj.message;
            $('dialog').style.display = "block";
            $('screen').style.display = "block";
            $('dialog-ok').addEventListener("click", obj.callback);
            break;
        case 4: // warning message popup alert box about error
            break;
        case 5: // error popup alert box, then logout
            $('login-error').innerHTML = obj.message;
            $('login-error').style.display = "block";
            break;
        case 6: // log write to log file
            try {
                var f = air.File.applicationStorageDirectory.resolvePath("pownce.log");
                var fs = new air.FileStream();
                var now = new Date();
                var logln = now.toGMTString() + " " + obj.message + "\n";
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
            air.trace(obj.message);
            break;
        case 8: // air.trace
            return prompt(obj.message, "");
            break;
        case 9: // inline-message
            obj.domobj.innerHTML = "<li><div class='inline-message'>" + obj.message + "</div></li>";
            break;
        default:
            $('status-message').innerHTML = obj.message;
            break;
    }
};

PownceDesktop.openImageWindow = function(type, imgsrc){
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
PownceDesktop.openVideoWindow = function(type, vid, streamname, user, base){
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
PownceDesktop.prepareAPIURL = function(url, options){
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

PownceDesktop.prototype.doLogin = function(){
    properties.ui.loading = true;
    properties.user.username = $('username').value;
    properties.user.password = $('password').value;
    $('login-button').value = "Logging In...";
    $('login-button').disabled = true;
    $('username').disabled = true;
    $('password').disabled = true;
    $('auto-login').disabled = true;
    this.authHTTPBasic();
};

/**
 * collectNotes
 */
PownceDesktop.prototype.collectNotes = function(){

    // if we cannot load notes from db
    if (!this.loadNotesFromDB()) 
        this.getNotes();
	
	this.uiChangeView("notes");
	this.loadPeople();
	this.getLatestNotes();
	if(properties.interval.newnotes)
		clearInterval(properties.interval.newnotes);
	properties.interval.newnotes = setInterval(function(){
		chat.getLatestNotes();
	}, 60000);
	if(!properties.crons.display_since)
		properties.crons.display_since = new PownceDesktop.DisplaySinceCronJob();
};

/** UI related Functions **/
PownceDesktop.prototype.ui = {
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
	addApplicationMenu: function() {
		var progmenuitem = air.NativeApplication.nativeApplication.menu.getItemAt(0);
		var progmenu = progmenuitem.submenu;
		// Preferences Menu Item
		var sep1 = new air.NativeMenuItem("1", true);
		progmenu.addItemAt(sep1,1);
		var prefMenuItem = new air.NativeMenuItem("Preferences", false);
		prefMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("settings");
		});
		prefMenuItem.keyEquivalent = "p";
		prefMenuItem.mnemonicIndex = 0;
		prefMenuItem.enabled = properties.ui.logged_in;
		progmenu.addItemAt(prefMenuItem,2);

		// View Submenu
		var viewSubmenu = new air.NativeMenu();

		// Notes Menu Item
		var notesMenuItem = new air.NativeMenuItem("Notes", false);
		notesMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("notes");
		});
		notesMenuItem.enabled = properties.ui.logged_in;
		notesMenuItem.keyEquivalent = "n";
		notesMenuItem.mnemonicIndex = 0;
		viewSubmenu.addItem(notesMenuItem);
		
		// People Menu Item
		var peepsMenuItem = new air.NativeMenuItem("People", false);
		peepsMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("people");
		});
		peepsMenuItem.enabled = properties.ui.logged_in;
		peepsMenuItem.keyEquivalent = "e";
		peepsMenuItem.mnemonicIndex = 2;
		viewSubmenu.addItem(peepsMenuItem);
		
		// Favorites Menu Item
		var favsMenuItem = new air.NativeMenuItem("Favorites", false);
		favsMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("favorites");
		});
		favsMenuItem.enabled = properties.ui.logged_in;
		favsMenuItem.keyEquivalent = "f";
		favsMenuItem.mnemonicIndex = 0;
		viewSubmenu.addItem(favsMenuItem);
		
		air.NativeApplication.nativeApplication.menu.addSubmenuAt(viewSubmenu, 3,"View");

		// Help Submenu
		var helpSubmenu = new air.NativeMenu();
		
		// Help Contents
		var helpMenuItem = new air.NativeMenuItem("Help Contents...", false);
		helpMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.doNavigateToURL("https://pownce.pbwiki.com/Pownce-Desktop");
		});
		helpMenuItem.keyEquivalent = "f1";
		helpSubmenu.addItem(helpMenuItem);
		
		var sep2 = new air.NativeMenuItem("2", true);
		helpSubmenu.addItem(sep2);
				
		// Check for updates Menu Item
		var updatesMenuItem = new air.NativeMenuItem("Check for updates", false);
		updatesMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.checkForUpdate();
		});
		helpSubmenu.addItem(updatesMenuItem);
		
		var sep3 = new air.NativeMenuItem("3", true);
		helpSubmenu.addItem(sep3);
				
		// About Menu Item
		var aboutMenuItem = new air.NativeMenuItem("About", false);
		aboutMenuItem.addEventListener(air.Event.SELECT, function() {
		});
		helpSubmenu.addItem(aboutMenuItem);
		
		
		air.NativeApplication.nativeApplication.menu.addSubmenuAt(helpSubmenu, 5, "Help");
	},
    addWindowMenu: function() {
		var windowMenu = new air.NativeMenu();
		
		// File Submenu
		var fileSubmenu = new air.NativeMenu();
		
		// Preferences Menu Item
		var prefMenuItem = new air.NativeMenuItem("Preferences", false);
		prefMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("settings");
		});
		prefMenuItem.enabled = properties.ui.logged_in;
		fileSubmenu.addItem(prefMenuItem);
		
		var sep1 = new air.NativeMenuItem("1", true);
		fileSubmenu.addItem(sep1);
		
		// Exit Menu Item
		var exitMenuItem = new air.NativeMenuItem("Exit", false);
		exitMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.beforeClose();
		});
		fileSubmenu.addItem(exitMenuItem);
		
		windowMenu.addSubmenu(fileSubmenu, "File");
		
		
		// View Submenu
		var viewSubmenu = new air.NativeMenu();

		// Notes Menu Item
		var notesMenuItem = new air.NativeMenuItem("Notes", false);
		notesMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("notes");
		});
		notesMenuItem.enabled = properties.ui.logged_in;
		notesMenuItem.keyEquivalent = "n";
		notesMenuItem.mnemonicIndex = 0;
		viewSubmenu.addItem(notesMenuItem);
		
		// People Menu Item
		var peepsMenuItem = new air.NativeMenuItem("Peeps", false);
		peepsMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("people");
		});
		peepsMenuItem.enabled = properties.ui.logged_in;
		peepsMenuItem.keyEquivalent = "p";
		peepsMenuItem.mnemonicIndex = 0;
		viewSubmenu.addItem(peepsMenuItem);
		
		// Favorites Menu Item
		var favsMenuItem = new air.NativeMenuItem("Favorites", false);
		favsMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.uiChangeView("favorites");
		});
		favsMenuItem.enabled = properties.ui.logged_in;
		favsMenuItem.keyEquivalent = "f";
		favsMenuItem.mnemonicIndex = 0;
		viewSubmenu.addItem(favsMenuItem);
		
		windowMenu.addSubmenu(viewSubmenu, "View");
		

		// Help Submenu
		var helpSubmenu = new air.NativeMenu();
		
		// Help Contents
		var helpMenuItem = new air.NativeMenuItem("Help Contents...", false);
		helpMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.doNavigateToURL("https://pownce.pbwiki.com/Pownce-Desktop");
		});
		helpMenuItem.keyEquivalent = "f1";
		helpSubmenu.addItem(helpMenuItem);
		
		var sep2 = new air.NativeMenuItem("2", true);
		helpSubmenu.addItem(sep2);
				
		// Check for updates Menu Item
		var updatesMenuItem = new air.NativeMenuItem("Check for updates", false);
		updatesMenuItem.addEventListener(air.Event.SELECT, function() {
			chat.checkForUpdate();
		});
		helpSubmenu.addItem(updatesMenuItem);
		
		var sep3 = new air.NativeMenuItem("3", true);
		helpSubmenu.addItem(sep3);
				
		// About Menu Item
		var aboutMenuItem = new air.NativeMenuItem("About", false);
		aboutMenuItem.addEventListener(air.Event.SELECT, function() {
		});
		helpSubmenu.addItem(aboutMenuItem);
		
		
		windowMenu.addSubmenu(helpSubmenu, "Help");
		
		window.nativeWindow.menu = windowMenu;
	},
	enableWindowMenu: function() {
		// file submenu
		var filemenuitem = window.nativeWindow.menu.getItemAt(0);
		var prefmenuitem = filemenuitem.submenu.getItemAt(0);
		prefmenuitem.enabled = true;

		var viewmenuitem = window.nativeWindow.menu.getItemAt(1);
		var notesmenuitem = viewmenuitem.submenu.getItemAt(0);
		notesmenuitem.enabled = true;
		var peoplemenuitem = viewmenuitem.submenu.getItemAt(1);
		peoplemenuitem.enabled = true;
		var favmenuitem = viewmenuitem.submenu.getItemAt(2);
		favmenuitem.enabled = true;
	},
	enableApplicationMenu: function() {
		var progmenuitem = air.NativeApplication.nativeApplication.menu.getItemAt(0);
		var progmenu = progmenuitem.submenu;
		var prefMenuItem = progmenu.getItemAt(2);
		prefMenuItem.enabled = true;
		var viewmenuitem = air.NativeApplication.nativeApplication.menu.getItemAt(3);
		var viewmenu = viewmenuitem.submenu;
		var notesMenuItem = viewmenu.getItemAt(0);
		notesMenuItem.enabled = true;
		var peopMenuItem = viewmenu.getItemAt(1);
		peopMenuItem.enabled = true;
		var favMenuItem = viewmenu.getItemAt(2);
		favMenuItem.enabled = true;
	},
	alertNewFriendRequest: function(){
        var num = properties.user.profile.friend_request_count;
		$('new-friends').style.display = "block";
		$('new-friends').innerHTML = num + " New";
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
            chat.ui.systemMessage({
				message: "trycatch error: " + e.message,
				level: 6
			});
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
        $('repliers').style.display = "block";
        $('note-details').innerHTML = "";
        $('note-detail-body').innerHTML = "";
        $('note-bottom-details').innerHTML = "";
        $('note-stars').innerHTML = "";
        $('note-link').innerHTML = "";
        $('note-detail-media-object').innerHTML = "";
		$('note-detail-event').innerHTML = "";
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
                $('system-style').href = "skin/osx.css";
                $('settings-min-to-tray').style.display = "none";
                $('min-to-tray-label').style.display = "none";
				this.addApplicationMenu();
                break;
            case "win-os":
				$('system-style').href = "skin/xp.css";
                this.addWindowMenu();
                break;
        }
    },
    createAutocomplete: function(obj){
        var li = document.createElement("li");
        li.setAttribute("sendtoid", obj.id);
        var photo = document.createElement("div");
        photo.className = "photo " + obj.classname;
        if (obj.photo != "") {
            var img = document.createElement("img");
            img.src = obj.photo;
            img.width = "24";
            img.height = "24";
            photo.appendChild(img);
        }
        li.appendChild(photo);
        var name = document.createElement("div");
        name.className = "name";
        name.innerHTML = obj.name;
        li.appendChild(name);
        var username = document.createElement("div");
        username.className = "username";
        if (obj.username != "") 
            username.innerHTML = "(" + obj.username + ")";
        li.appendChild(username);
        li.addEventListener('click', function(e){
            if (properties.ui.current_view == "new") {
                $('send-to-filter').style.display = "none";
                $('send-to-text').value = obj.name;
                $('send-to-id').value = obj.id;
            } else {
                $('forward-to-filter').style.display = "none";
                $('forward-to-text').value = obj.name;
                $('forward-to-id').value = obj.id;
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
        //authlink.style.color = properties.ui.link_color;
        authlink.addEventListener("click", function(event){
            chat.doNavigateToURL(link);
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
		//ulink.style.color = properties.ui.link_color;
		ulink.addEventListener("click", function(){
			chat.doNavigateToURL(url);
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
		name.innerHTML = ((user.last_name&&user.last_name!="")?user.first_name + " " + user.last_name:user.short_name);
		name.addEventListener("click",function(){
			chat.uiChangeView("profile",user.username);
		});
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
                chat.ui.systemMessage({
                    title: "Remove Friend?",
                    message: "Are you sure you want to unfriend " + user.username + "? This will remove all their notes from your page as well.",
                    level: 3,
                    callback: function(){
                        chat.doRemoveFriend(user.username);
						chat.cancelDialog();
                    }
                });
			});
			btmdet.appendChild(unfriend);
		}
		else if(user.relationship=="fanof") {
			var cancel = document.createElement("div");
			cancel.className = "cancel";
			cancel.innerHTML = "Cancel Request";
			cancel.addEventListener("click", function(){
				$('dialog-ok').value = "Cancel Friend Request";
                chat.ui.systemMessage({
                    title: "Cancel Friend Request?",
                    message: "Are you sure you want to unfriend " + user.username + "? This will remove all their notes from your page as well.",
                    level: 3,
                    callback: function(){
                        chat.doCancelRequest(user.username);
						chat.cancelDialog();
                    }
                });
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
                chat.ui.systemMessage({
                    title: "Remove Friend?",
                    message: "Are you sure you want to unfriend " + user.username + "? This will remove all their notes from your page as well.",
                    level: 3,
                    callback: function(){
                        chat.doRemoveFriend(user.username);
						chat.cancelDialog();
                    }
                });
			});
		} else if (user.relationship == "fanof") {
			var cancelRequest = menu.addItem(new air.NativeMenuItem("Cancel Request"));
			cancelRequest.addEventListener(air.Event.SELECT, function(){
                $('dialog-ok').value = "Cancel Friend Request";
                chat.ui.systemMessage({
                    title: "Cancel Friend Request?",
                    message: "Are you sure you want to unfriend " + user.username + "? This will remove all their notes from your page as well.",
                    level: 3,
                    callback: function(){
                        chat.doCancelRequest(user.username);
						chat.cancelDialog();
                    }
                });
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
	    
	    var USERNAME_CHAR = " /!/#/< ";
	    var URL_CHAR = " /!#/!/< ";
	    
	    body = body.replace(/</gim, "&lt;");
	    body = body.replace(/\r{0,1}\n/gim, " <br/> ");
	    
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
	    
	    /*body = body.replace(/\s:\-{0,1}\)/gim, "<span class='emo_smile'></span>");
	    body = body.replace(/\s:\-{0,1}\(/gim, "<span class='emo_frown'></span>");
	    body = body.replace(/\s;\-{0,1}[\)D]/gim, "<span class='emo_wink'></span>");
	    body = body.replace(/\s:\-{0,1}D/gim, "<span class='emo_grin'></span>");
	    body = body.replace(/\s:\-{0,1}P/gim, "<span class='emo_tongue'></span>");
	    body = body.replace(/\s>:\-{0,1}[\)D]/gim, "<span class='emo_evilgrin'></span>");
	    body = body.replace(/\s:\-{0,1}[0oO]/gim, "<span class='emo_surprise'></span>");*/
	    
	    bdy.innerHTML = body;
	    
	    var links = bdy.getElementsByTagName("a");
	    for (l = 0; l < links.length; l++) {
	        links[l].addEventListener("click", function(event){
	            var urllnk = event.target + "";
	            urllnk = urllnk.substring(urllnk.indexOf("#") + 1);
	            if (urllnk.indexOf("!") == 0) 
	                chat.uiChangeView("profile", urllnk.substring(1));
	            else 
	                chat.doNavigateToURL(urllnk);
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
	    var medlnk = document.createElement("div");
	    if (note.file.type == "image") {
	        medobj.className = "media-object";
	    	var imglnk = document.createElement("a");
	        imglnk.addEventListener("click", function(event){
	            chat.doNavigateToURL(note.file.url);
	            chat.doMarkAsDownloaded(note.id);
	        });
	        var img = document.createElement("img");
	        img.src = note.file.direct_url;
	        imglnk.appendChild(img);
	        medobj.appendChild(imglnk);
	    } else if (note.file.type == "audio") {
            medobj.className = "media-audio";
	    	if (!note.file.url||!note.file.direct_url) {
                return {
                    medobj: medobj,
                    medlnk: medlnk
                };
            }
			medobj.innerHTML = "<embed flashvars=\"url=" + escape(note.file.direct_url) + "\" wmode=\"transparent\" quality=\"high\" src=\"/lib/audioplayer.swf\" type=\"application/x-shockwave-flash\"/>";
	    }
	    medlnk.className = "media-link";
		var meda = document.createElement("a");
        meda.href = "#";
		var shorturl = note.file.url.replace("http://www.","");
		shorturl = shorturl.replace("http://","");
        shorturl = shorturl.replace("https://","");
        meda.innerHTML = shorturl;
        meda.addEventListener("click", function(event){
			chat.doDownloadFile(note.file.name, note.file.url);
        	chat.doMarkAsDownloaded(note.id);
	    });
		medlnk.appendChild(meda);
	    return {
	        medobj: medobj,
	        medlnk: medlnk
	    };
	},	
	prepareNoteLink: function(note,min) {
		var medobj = document.createElement("div");
		var medlnk = document.createElement("div");
			medobj.className = "media-object";
			medlnk.className = "media-link";
		if(note.oembed) {
				if(note.oembed.type == "video") {
		            if (note.oembed.title)
						medobj.appendChild(this.createMediaTitle(note.oembed.title));
					medobj.className = "media-object";
					var imglnk = document.createElement("a");
					imglnk.className = "media-object-link";
					imglnk.addEventListener("click", function(event){
	                   	chat.doMarkAsDownloaded(note.id);
					});
					imglnk.innerHTML = note.oembed.html;
					medobj.appendChild(imglnk);
					if(note.oembed.author_name&&note.oembed.author_name!="")
						medobj.appendChild(this.createMediaCredits(note.oembed.type,note.oembed.author_name,note.oembed.author_url,note.id));
				}
				else if(note.oembed.type == "photo") {
		            if(note.oembed.provider_name == "Flickr"||note.oembed.provider_name == "Zooomr"||note.oembed.provider_name == "static.zooomr.com") {
						var medobj = document.createElement("div");
						medobj.className = "media-object";
						if (note.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.oembed.title));
		                var imglnk = document.createElement("a");
		                imglnk.className = "media-object-link";
		                imglnk.addEventListener("click", function(event){
			                chat.doNavigateToURL(note.link.url);
			                chat.doMarkAsDownloaded(note.id);
		                });
		                var img = document.createElement("img");
		                img.src = note.oembed.url;
		                imglnk.appendChild(img);
						medobj.appendChild(imglnk);
						if(note.oembed.author_name&&note.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.oembed.type,note.oembed.author_name,note.oembed.author_url,note.id));
					}
					else {
						medobj.className = "media-object";
						if (note.oembed&&note.oembed.title)
							medobj.appendChild(this.createMediaTitle(note.oembed.title));
						var imglnk = document.createElement("a");
		                imglnk.className = "media-object-link";
		                imglnk.addEventListener("click", function(event){
		                    chat.doNavigateToURL(note.link.url);
		                    chat.doMarkAsDownloaded(note.id);
		                });
		                var img = document.createElement("img");
		                img.src = note.link.url;
		                imglnk.appendChild(img);
						medobj.appendChild(imglnk);
						if(note.oembed&&note.oembed.author_name&&note.oembed.author_name!="")
							medobj.appendChild(this.createMediaCredits(note.oembed.type,note.oembed.author_name,note.oembed.author_url,note.id));
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
			var meda = document.createElement("a");
            meda.href = "#";
			var shorturl = note.link.url.replace("http://www.","");
			shorturl = shorturl.replace("http://","");
            shorturl = shorturl.replace("https://","");
            meda.innerHTML = shorturl;
            meda.addEventListener("click", function(event){
                chat.doNavigateToURL(note.link.url);
                chat.doMarkAsDownloaded(note.id);
            });
			medlnk.appendChild(meda);
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
    systemMessage: function(obj){
		if(!obj.message)
			obj.message = obj;
        if (!obj.level) 
            obj.level = 1;
        switch (obj.level) {
            case 1: // status bar message
                $('status-message').innerHTML = obj.message;
                this.systemMessage({message:obj.message, level:6});
                break;
            case 2: // alert message
                $('alert-box').style.display = "block";
                $('alert-message').innerHTML = obj.message;
                break;
            case 3: // confirm message
            	$('dialog-title').innerHTML = obj.title;
				$('dialog-message').innerHTML = obj.message;
	            $('dialog').style.display = "block";
				$('screen').style.display = "block";
				$('dialog-ok').addEventListener("click",obj.callback);
            	break;
            case 4: // warning message popup alert box about error
                break;
            case 5: // error popup alert box, then logout
                $('login-error').innerHTML = obj.message;
                $('login-error').style.display = "block";
                break;
            case 6: // log write to log file
                try {
                    var f = air.File.applicationStorageDirectory.resolvePath("pownce.log");
                    var fs = new air.FileStream();
                    var now = new Date();
                    var logln = now.toGMTString() + " " + obj.message + "\n";
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
                air.trace(obj.message);
                break;
            case 8: // air.trace
                return prompt(obj.message, "");
                break;
			case 9: // inline-message
				obj.domobj.innerHTML = "<li><div class='inline-message'>" + obj.message + "</div></li>";
				break;
            default:
                $('status-message').innerHTML = obj.message;
                break;
        }
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
