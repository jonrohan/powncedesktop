/**
 * @author jon
 */

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
		prefMenuItem.keyEquivalent = ",";
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
			chat.doNavigateToURL("http://pownce.com/download/");
		});
		helpSubmenu.addItem(aboutMenuItem);
		
		
		air.NativeApplication.nativeApplication.menu.addSubmenuAt(helpSubmenu, 5, "Help");
	},
    addWindowMenu: function() {
		
		
		//var windowMenu = new air.NativeMenu();
		
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
		
		//windowMenu.addSubmenu(fileSubmenu, "File");
		
		$('file-menu-item').addEventListener("click",function(e){
			var pos = Position.cumulativeOffset($('file-menu-item'));
			fileSubmenu.display(window.nativeWindow.stage,pos[0],pos[1] + 20);
		});
		
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
		
		$('view-menu-item').addEventListener("click",function(e){
			var pos = Position.cumulativeOffset($('view-menu-item'));
			viewSubmenu.display(window.nativeWindow.stage,pos[0],pos[1] + 20);
		});
		
		

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
			chat.doNavigateToURL("http://pownce.com/download/");
		});
		helpSubmenu.addItem(aboutMenuItem);
		
		
		$('help-menu-item').addEventListener("click",function(e){
			var pos = Position.cumulativeOffset($('help-menu-item'));
			helpSubmenu.display(window.nativeWindow.stage,pos[0],pos[1] + 20);
		});
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
		function uploadDone(event) {
			air.trace(event.target.data);
			chat.doUploadFileComplete(event);
		};
        properties.ui.upload_file.addEventListener(air.Event.COMPLETE, uploadDone);
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
    configureForOS: function(os){
        switch (os) {
            case "mac-os":
				document.body.className += " mac-os";
                $('settings-min-to-tray').style.display = "none";
                $('min-to-tray-label').style.display = "none";
				this.addApplicationMenu();
                break;
            case "win-os":
				document.body.className += " win-os";
                this.addWindowMenu();
                break;
            case "linux-os":
				document.body.className += " linux-os";
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
