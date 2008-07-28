/**
 * @project Pownce Desktop
 * @author Jon Rohan
 * 
 */

// Set by the <version></version> in the application.xml file
/**
 * PownceDesktop class
 */
function PownceDesktop() {
    // get VERSION from application.xml
    VERSION = (new DOMParser().parseFromString(air.NativeApplication.nativeApplication.applicationDescriptor, "text/xml")).getElementsByTagName('application')[0].getElementsByTagName("version")[0].firstChild.data;
    
	air.trace(air.Capabilities.os);
	
    // If application supports system tray 
    if (navigator.userAgent.match("Windows")) {
        // it is windows
        properties.ui.is_win = true;
        this.ui.configureForOS("win-os");
    }    // else if the application supports a doc icon
    else if (air.Capabilities.os.match("Mac OS")) {
        // it is OSX
        properties.ui.is_osx = true;
        this.ui.configureForOS("mac-os");
    }
	else if (air.Capabilities.os.match("Linux")){
		properties.ui.is_linux = true;
		this.ui.configureForOS("linux-os");
	}
    // get saved properties
    this.loadProperties();
    
    // refresh log file
    this.deleteLogfile();
    
    // check for Pownce Desktop Update
    // this.checkForUpdate();
    
    // Initialize the UI
    this.uiInitialize();
    
	window.nativeWindow.visible = true;
	
    $('username').value = properties.user.username;
    if (properties.settings.auto_login&&properties.user.password&&properties.user.password!='') {
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
    
	cancelDialog: function() {
		$('dialog-ok').value = "OK";
        $('dialog').style.display = "none";
		$('screen').style.display = "none";
		$('dialog-ok').removeEventListener("click");
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
	
	addPeopletoDB: function() {
		for(i=0;i<properties.json.people.length;i++) {
			this.addPersonToDB(properties.json.people[i]);
		}
		this.loadPeople();
 	},
		
	addFavoriteToDB: function(note) {
        var db = new PownceDesktop.DB();
        
        db.connect();
                
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
        
        person = this.preparePersonForDB(person);
        air.trace("gothere")
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
            smedium_photo_url: person.profile_photo_urls.smedium_photo_url,
            tiny_photo_url: person.profile_photo_urls.tiny_photo_url
        });
        air.trace("gothere")
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
            $('favorites').appendChild(this.uiCreateNote(note,true));
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
	doBrowseForFile: function() {
		properties.ui.upload_file.browseForOpen( 'Select File' );
	},
	doSelectFile: function(e) {
		air.trace(properties.ui.upload_file.type);
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
	    $('login-button').value = "Login";
	    $('login-button').disabled = false;
	    $('username').disabled = false;
	    $('password').disabled = false;
	    $('auto-login').disabled = false;
		
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
    doResize: function(){
        window.nativeWindow.startResize(air.NativeWindowResize.BOTTOM_RIGHT);
    },
    doMin: function(){
        window.nativeWindow.minimize();
        if (properties.ui.is_win && properties.settings.minimize_to_tray)
            window.nativeWindow.visible = false;
        properties.ui.min = true;
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
    doMove: function(){
        window.nativeWindow.startMove();
    },
	doActivate: function(e) {
		if (!properties.ui.is_linux) {
			air.NativeApplication.nativeApplication.icon.bitmaps = properties.ui.primary_icon;
		}
		document.body.className = document.body.className.replace("deactive","active");
	},
	doDeactivate: function(e) {
		document.body.className = document.body.className.replace("active","deactive");
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
    
    /** Get Functions **/
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
    loadDefaultSkin: function() {
        var dir = air.File.applicationStorageDirectory.resolvePath("skins");
		dir.createDirectory();
		var contents = dir.getDirectoryListing();
		
		var defdir = air.File.applicationDirectory.resolvePath("default/skins");
		var defcontents = defdir.getDirectoryListing();
		for (d = 0; d < defcontents.length; d++) 
		{
			var newFile = air.File.applicationStorageDirectory.resolvePath("skins/" + defcontents[d].name);
	    	//if(!newFile.exists)
		    	defcontents[d].copyTo(newFile, true);
		}
		$('current-skin').href = "app-storage:/skins/default/main.css";
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
			db.commit();
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
    uiCreateNote: function(note,isFav){
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
			if (isFav) {
				var fav = document.createElement("a");
				new Tooltip(fav, "Remove Favorite");
				//fav.style.color = properties.ui.link_color;
				fav.className = "note-favorite";
				fav.href = "#";
				fav.innerHTML = "Remove";
				fav.addEventListener("click", function(){
					chat.deleteFavorite(note.id);
				});
				btmdet.appendChild(fav);
			}
			else {
				var fav = document.createElement("a");
				new Tooltip(fav, "Add to Favorites");
				//fav.style.color = properties.ui.link_color;
				fav.className = "note-favorite";
				fav.href = "#";
				fav.innerHTML = "Favorite";
				fav.addEventListener("click", function(){
					chat.addFavoriteToDB(note);
				});
				btmdet.appendChild(fav);
			}	
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
		$('sound-chimp').className = "";
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
		$('sound-chimp').addEventListener('click', function(){
			properties.settings.sound = "chimp";
			chat.selectSound("chimp");
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
		
		this.addToolbarEvents();
		
		this.addSettingsEvents();
		
		this.loadDefaultSkin();
		
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
        $('title-bar').addEventListener('mousedown', this.doMove);
        $('statusbar').addEventListener('mousedown', this.doMove);
        $('toolbar').addEventListener('mousedown', this.doMove);
		
		$('controls-resize').addEventListener('mousedown', function(e) {
			chat.doResize();
		});
		$('controls-close').addEventListener('click', function(e) {
			chat.beforeClose();
		});
		$('controls-min').addEventListener('click', function(e) {
			chat.doMin(e);
		});
		$('controls-max').addEventListener('click', function(e) {
			chat.doMax(e);
		});
		
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
			air.trace("DISPLAY STATE CHANGE");
			if(e.afterDisplayState=="minimized")
				chat.doMin(e);
		});
		window.nativeWindow.addEventListener(air.Event.CLOSING, function() {
			chat.beforeClose();
		});
		window.nativeWindow.addEventListener(air.Event.ACTIVATE, function(e) {
			air.trace("ACTIVATE");
			chat.doActivate(e);
		});
		window.nativeWindow.addEventListener(air.Event.DEACTIVATE, function(e) {
			air.trace("DEACTIVATE");
			chat.doDeactivate(e);
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

PownceDesktop.prototype.doLogin = function(){
    properties.ui.loading = true;
    $('login-button').value = "Logging In...";
    $('login-button').disabled = true;
    $('username').disabled = true;
    $('password').disabled = true;
    $('auto-login').disabled = true;
    this.authHTTPBasic();
};


PownceDesktop.prototype.cacheImage = function(url) {
	
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
