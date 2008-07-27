/**
 * @author jon
 */
PownceDesktop.prototype.getFanof = function(){
    this.ui.systemMessage({
        message: "Getting fan of"
    });
    var oInst = this;
    var handlerFunc = function(t){
        if (oInst.isError(t.responseText)) {
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
            properties.json.people.push(fan_of.fan_of.users[i]);
        }
        if (!fan_of.fan_of.has_next_page) {
            oInst.addPeopletoDB();
            clearInterval(properties.interval.getfanof);
            return;
        }
    };
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get Fan of failure: " + t.responseText,
            level: 6
        });
        clearInterval(properties.interval.getfanof);
        return;
    };
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.fffo, {
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
};

PownceDesktop.prototype.getFriends = function(){
    this.ui.systemMessage({
        message: "Getting friends"
    });
    var oInst = this;
    var handlerFunc = function(t){
        //air.trace(t.responseText);
        if (oInst.isError(t.responseText)) {
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
            properties.json.people.push(friends.friends.users[i]);
        }
        if (!friends.friends.has_next_page) {
            clearInterval(properties.interval.getfriends);
            properties.pages.currentFanofPage = 0;
            if (properties.interval.getfanof) 
                clearInterval(properties.interval.getfanof);
            properties.interval.getfanof = setInterval(function(){
                chat.getFanof();
            }, 3000);
            return;
        }
    };
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get Friends failure: " + t.responseText,
            level: 6
        });
        clearInterval(properties.interval.getfriends);
        return false;
    };
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.fffo, {
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
};

PownceDesktop.prototype.checkForUpdate = function(){
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
    
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Check for update error: " + t.responseText,
            level: 6
        });
        return;
    };
    
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.login);
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        method: 'get'
    });
};

PownceDesktop.prototype.authHTTPBasic = function(){
    this.ui.systemMessage({
        message: "Authorizing"
    });
    var oInst = this;
    var handlerFunc = function(t){
        air.trace(t.responseText);
        if (oInst.isError(t.responseText)) {
            oInst.doLogout();
            oInst.ui.systemMessage({
                message: "Authorizing error: " + t.responseText,
                level: 6
            });
            oInst.ui.systemMessage({
                message: "Ack! Server error, try again later.",
                level: 5
            });
            return false;
        }
        else 
            if (t.responseText.match("key\": \"" + properties.oauth.APP_KEY + "\"")) {
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
                
                var db = new PownceDesktop.DB();
                db.connect();
                
                db.query(properties.sql.create_table_people);
                db.query(properties.sql.create_table_favorites);
                db.query(properties.sql.create_table_notes);
                
                db.commit();
                
                if (properties.ui.is_win) 
                    oInst.ui.enableWindowMenu();
                else 
                    if (properties.ui.is_osx) 
                        oInst.ui.enableApplicationMenu();
                var prof_count = properties.user.profile.friend_count + properties.user.profile.fan_of_count;
                oInst.collectNotes();
                if (oInst.getFriendCount() != prof_count) {
                    oInst.deleteAllPeople();
                    properties.pages.currentFriendPage = 0;
                    oInst.getFriends();
                    if (properties.interval.getfriends) 
                        clearInterval(properties.interval.getfriends);
                    properties.interval.getfriends = setInterval(function(){
                        chat.getFriends();
                    }, 3000);
                }
                else {
                    oInst.loadPeople();
                }
                if (properties.user.profile.friend_request_count > 0) {
                    oInst.ui.alertNewFriendRequest();
                }
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
            else 
                if (t.responseText.match("status_code\": 401")) {
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Authorizing failure: " + t.responseText,
            level: 6
        });
        oInst.ui.systemMessage({
            message: "Ack! Server error, try again later.",
            level: 5
        });
        oInst.doLogout();
        return;
    };
    var username = $('username').value;
    var password = $('password').value;
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.login);
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: ["Authorization", "Basic " + btoa(username + ":" + password)],
        method: 'get'
    });
};

PownceDesktop.prototype.getProfile = function(){
    this.ui.systemMessage({
        message: "Getting User Profile"
    });
    var oInst = this;
    var handlerFunc = function(t){
        //air.trace(t.responseText);
        if (oInst.isError(t.responseText)) {
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
        if (properties.ui.is_win) 
            oInst.ui.enableWindowMenu();
        else 
            if (properties.ui.is_osx) 
                oInst.ui.enableApplicationMenu();
        var prof_count = properties.user.profile.friend_count + properties.user.profile.fan_of_count;
        if (oInst.getFriendCount() != prof_count) {
            oInst.deleteAllPeople();
            properties.pages.currentFriendPage = 0;
            oInst.getFriends();
            if (properties.interval.getfriends) 
                clearInterval(properties.interval.getfriends);
            properties.interval.getfriends = setInterval(function(){
                chat.getFriends();
            }, 3000);
        }
        else {
            oInst.loadPeople();
        }
        if (user.friend_request_count > 0) {
            oInst.ui.alertNewFriendRequest();
        }
        oInst.collectNotes();
    };
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get Profile failure: " + t.responseText,
            level: 6
        });
        return;
    };
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.profile);
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        method: "get"
    });
};

PownceDesktop.prototype.getLatestNotes = function(){
    this.ui.systemMessage({
        message: "Checking for new notes"
    });
    var oInst = this;
    
    var handlerFunc = function(t){
        if (oInst.isError(t.responseText)) {
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
        if (notes.notes.length != 0 && properties.pages.currentNotesPage == 0) {
            notes.notes.reverse();
            var newcnt = notes.notes.length;
            // remove newcnt notes from the end
            properties.json.notes.splice(properties.json.notes.length - 1 - newcnt, newcnt);
            var notified = false;
            for (var i = 0; i < notes.notes.length; i++) {
                if (!notified && notes.notes[i].sender.username != properties.user.username) {
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get Latest Notes failure: " + t.responseText,
            level: 6
        });
        return;
    };
    var options = {};
    options.filter = "all";
    options.limit = properties.settings.max_notes;
    options.since_id = properties.ui.latestNoteId;
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.note_list, options);
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        method: "get"
    });
};

PownceDesktop.prototype.getNote = function(id){
    if (!id) 
        id = properties.ui.currentNoteDetail;
    if (id == -1) {
        if (properties.interval.getreplies) {
            clearInterval(properties.interval.getreplies);
        }
        return;
    }
    var oInst = this;
    var note = this.getNoteById(id);
    this.ui.systemMessage({
        message: "Getting note"
    });
    var handlerFunc = function(t){
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
            oInst.updateFavorite({
                id: note.id,
                num_replies: note.num_replies,
                stars: note.stars
            });
            for (i = 0; i < $("note_" + note.id).getElementsByTagName("div").length; i++) {
                if ($("note_" + note.id).getElementsByTagName("div")[i].className == "bottomdetails") {
                    //$("note_" + note.id).getElementsByTagName("div")[i].getElementsByTagName("a")[0].innerHTML = note.num_replies + ((note.num_replies == 1) ? " Reply" : " Replies");
                    break;
                }
            }
        }
        else {
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
    
    var options = {};
    options.note_id = id;
    options.show_replies = true;
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.note, options);
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "get note detail failure: " + t.responseText,
            level: 6
        });
        if (properties.interval.getreplies) {
            clearInterval(properties.interval.getreplies);
        }
        return;
    };
    
    new Ajax.Request(url, {
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.getNotes = function(){
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
        if (oInst.isError(t.responseText)) {
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get Notes failure: " + t.responseText,
            level: 6
        });
        clearInterval(properties.interval.getnotes);
        oInst.ui.systemMessage({
            message: "Ack! Server error, try again later.",
            level: 5
        });
        oInst.doLogout();
        return;
    };
    var options = {};
    options.limit = properties.settings.max_notes;
    options.page = properties.pages.currentNotesPage;
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.note_list, options);
    //url = OAuth.getUrl("get", url, properties.oauth.APP_KEY, properties.oauth.SECRET, properties.oauth.signature_method, properties.oauth.access_token, properties.oauth.access_token_secret, [["limit", properties.settings.max_notes], ["page", properties.pages.currentNotesPage]]);
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        method: "get"
    });
};

PownceDesktop.prototype.getSendTo = function(){
    this.ui.systemMessage({
        message: "Getting send to list"
    });
    var oInst = this;
    var handlerFunc = function(t){
        //air.trace(t.responseText);
        if (oInst.isError(t.responseText)) {
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get Send to failure: " + t.responseText,
            level: 6
        });
        return;
    };
    var url = PownceDesktop.prepareAPIURL(properties.api_urls.send_to_list);
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        method: "get"
    });
};

PownceDesktop.prototype.getUser = function(username, limit){
    this.ui.systemMessage({
        message: "Getting User Profile"
    });
    var oInst = this;
    var handlerFunc = function(t){
        if (oInst.isError(t.responseText)) {
            oInst.ui.systemMessage({
                message: "Get Profile error: " + t.responseText,
                level: 6
            });
            return false;
        }
        var resp = eval("(" + t.responseText + ")");
        if (limit != 0) {
            if (resp.notes.length == 0) {
                oInst.getUser(username, 0);
            }
            else {
                var user = resp.notes[0].sender;
                user.last_note_id = resp.notes[0].id;
                user.last_note_body = resp.notes[0].body;
                user.last_note_type = resp.notes[0].type;
                oInst.ui.systemMessage({
                    message: "Profile received"
                });
                oInst.uiChangeView("profile", user);
            }
        }
        else {
            oInst.uiChangeView("profile", resp);
        }
    };
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Get User failure: " + t.responseText,
            level: 6
        });
        return;
    };
    var url = "";
    if (limit == 0) 
        url = PownceDesktop.prepareAPIURL(POWNCE_API_DOMAIN + "2.0/users/" + username + ".json?{app_key}");
    else 
        url = PownceDesktop.prepareAPIURL(POWNCE_API_DOMAIN + POWNCE_API_VERSION + "/note_lists/" + username + ".json?{app_key}&limit=" + limit);
    var headers = [];
    if (username != properties.user.profile.username) 
        headers = ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)];
    new Ajax.Request(url, {
        onSuccess: handlerFunc,
        onFailure: errFunc,
        requestHeaders: headers,
        method: "get"
    });
};

PownceDesktop.prototype.doAddFriend = function(username){
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
    params = "action=ADD_FRIEND&friend=" + username + "&message=" + message;
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Add friend failure: " + t.responseText,
            level: 6
        });
        return;
    };
    
    new Ajax.Request(properties.api_urls.add_friend, {
        asynchronous: true,
        parameters: params,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.doRemoveFriend = function(username){
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "Remove friend failure: " + t.responseText,
            level: 6
        });
        return;
    };
    
    
    new Ajax.Request(properties.api_urls.remove_friend, {
        asynchronous: true,
        parameters: params,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.doCancelRequest = function(username){
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "cancel friend failure: " + t.responseText,
            level: 6
        });
        return;
    };
    
    new Ajax.Request(properties.api_urls.cancel_friend, {
        asynchronous: true,
        parameters: params,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.doDeleteNote = function(id){
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
        else 
            if (note.type != "reply") {
                oInst.uiChangeView("notes");
                oInst.getNotes();
            }
            else {
                oInst.ui.clearReply();
                oInst.uiChangeView("reply", properties.ui.currentNoteDetail);
            }
        return true;
    };
    
    params = "ajax_action=DELETE_NOTE" +
    "&note_to_delete=" +
    id;
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "delete note failure: " + t.responseText,
            level: 6
        });
        return false;
    };
    
    
    new Ajax.Request(properties.api_urls.delete_note, {
        asynchronous: true,
        parameters: params,
        requestHeaders: ["Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password), "Referer", properties.user.profile.permalink, "Host", "pownce.com"],
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.doForwardNote = function(id){
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
    var errFunc = function(t){
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
};

PownceDesktop.prototype.doPostNewNote = function(){
    $('postit').disabled = true;
    var type = $('note-type').value;
    
    this.ui.systemMessage({
        message: "Sending " + type
    });
    
    var note_to = $('send-to-id').value;
    
    var body = $('body').value;
    body = body.replace(/;/gim, escape(";"));
    body = body.replace(/&/gim, escape("&"));
    body = body.replace(/</gim, escape("<"));
    body = body.replace(/>/gim, escape(">"));
    body = body.replace(/\+/gim, "%2B");
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
        if (body == "" || body == "post a note...") {
            this.ui.systemMessage({
                message: "You must enter a message in the message box.",
                level: 2
            });
            return;
        }
        url = properties.api_urls.post_a_message;
        params = "note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
    }
    else 
        if (type == "link") {
            if (link == "" || link == "http://") {
                this.ui.systemMessage({
                    message: "You must enter a url in the url box.",
                    level: 2
                });
                return;
            }
            if (body == "post a note...") {
                body = "";
            }
            url = properties.api_urls.post_a_link;
            params = "url=" + link + "&note_to=" + note_to + "&note_body=" + body + "&app_key=" + properties.oauth.APP_KEY;
        }
        else 
            if (type == "file") {
                if ($('file-url').value == "") {
                    this.ui.systemMessage({
                        message: "You must select a file to upload.",
                        level: 2
                    });
                    return;
                }
                $('body').style.display = "none";
                $('file-upload-progress').style.display = "block";
                url = properties.api_urls.post_a_file + "?app_key=" + properties.oauth.APP_KEY;
                air.trace(url);
                var request = new air.URLRequest(url);
                var content_type = (properties.ui.upload_file.extension == "mp3" ? "audio/mp3" : "");
                request.method = air.URLRequestMethod.POST;
                request.data = "note_to=" + note_to + "&note_body=" + escape(body);
                request.requestHeaders = [new air.URLRequestHeader("Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password))];
                request.contentType = "audio/mpeg";
                properties.ui.upload_file.upload(request, 'media_file');
                return;
            }
            else 
                if (type == "event") {
                    if (event_name == "" || event_name == "What's Happening?") {
                        this.ui.systemMessage({
                            message: "You must enter an event name.",
                            level: 2
                        });
                        return;
                    }
                    if (event_location == "" || event_location == "Where at?") {
                        this.ui.systemMessage({
                            message: "You must enter a location.",
                            level: 2
                        });
                        return;
                    }
                    if (date == "") {
                        this.ui.systemMessage({
                            message: "You must enter a date.",
                            level: 2
                        });
                        return;
                    }
                    if (time == "") {
                        this.ui.systemMessage({
                            message: "You must enter a time.",
                            level: 2
                        });
                        return;
                    }
                    if (body == "post a note...") {
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "post note failure: " + t.responseText,
            level: 6
        });
        return;
    };
    
    new Ajax.Request(url, {
        postBody: params,
        requestHeaders: ["Content-Type", "multipart/form-data", "Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        method: 'post',
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.doPostReply = function(){
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
    body = body.replace(/;/gim, escape(";"));
    body = body.replace(/&/gim, escape("&"));
    body = body.replace(/</gim, escape("<"));
    body = body.replace(/>/gim, escape(">"));
    body = body.replace(/\+/gim, "%2B");
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
    var errFunc = function(t){
        oInst.ui.systemMessage({
            message: "post reply failure: " + t.responseText,
            level: 6
        });
        return;
    };
    
    new Ajax.Request(url, {
        method: "post",
        requestHeaders: ["Content-Type", "multipart/form-data", "Authorization", "Basic " + btoa(properties.user.username + ":" + properties.user.password)],
        postBody: params,
        onSuccess: handlerFunc,
        onFailure: errFunc
    });
};

PownceDesktop.prototype.doMarkAsDownloaded = function(id){
    this.ui.systemMessage({
        message: "Marking as downloaded",
        level: 6
    });
    var handlerFunc = function(t){
    
    };
    var errFunc = function(t){
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
};

PownceDesktop.prototype.getNewVersion = function(latest){
    var oInst = this;
    var urlString = "http://pownce.com/download/Pownce.air";
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
        var file = air.File.desktopDirectory.resolvePath("Pownce.air");
        var fileStream = new air.FileStream();
        fileStream.open(file, air.FileMode.WRITE);
        fileStream.writeBytes(fileData, 0, fileData.length);
        fileStream.close();
        //result = oInstk.ui.systemMessage("New version downloaded. Install now?",3);
        //if (result) {
        var updater = new air.Updater();
        var airFile = air.File.desktopDirectory.resolvePath("Pownce.air");
        updater.update(airFile, latest);
        //}
    }
    function deleteAirFile(){
        try {
            var file = air.File.desktopDirectory.resolvePath("Pownce.air");
            file.deleteFile();
        } 
        catch (e) {
            this.ui.systemMessage({
                message: "trycatch error: " + e.message,
                level: 6
            });
        }
    }
    
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

