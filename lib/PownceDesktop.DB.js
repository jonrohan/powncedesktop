/**
 * @author jon
 */
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
        catch (e) {
        }
    };
    this.prepareSQL = function(query, tokens){
        for (var token in tokens) {
            query = query.replace("{" + token + "}", tokens[token]);
        }
        return query;
    };
}


PownceDesktop.prototype.addPeopletoDB = function(){
    for (i = 0; i < properties.json.people.length; i++) {
        this.addPersonToDB(properties.json.people[i]);
    }
    this.loadPeople();
};

PownceDesktop.prototype.addFavoriteToDB = function(note){
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
};

PownceDesktop.prototype.saveNotesToDB = function(){
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
};
PownceDesktop.prototype.addPersonToDB = function(person){
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
};
PownceDesktop.prototype.updateFavorite = function(opts){
    var db = new PownceDesktop.DB();
    
    db.connect();
    
    db.query(properties.sql.update_favorite, opts);
    
    db.commit();
    
    return true;
};
PownceDesktop.prototype.deleteAllFavorites = function(){
    var db = new PownceDesktop.DB();
    
    db.connect();
    
    db.query(properties.sql.delete_all_favorites);
    
    db.commit();
    
    this.loadFavorites();
    
    return true;
};
PownceDesktop.prototype.deleteAllPeople = function(){
    var db = new PownceDesktop.DB();
    
    db.connect();
    
    db.query(properties.sql.delete_all_people);
    
    db.commit();
    
    return true;
};
PownceDesktop.prototype.deleteFavorite = function(id){
    var db = new PownceDesktop.DB();
    
    db.connect();
    
    db.query(properties.sql.delete_favorite_by_id, {
        id: id
    });
    
    db.commit();
    this.loadFavorites();
    return true;
};
PownceDesktop.prototype.getFriendCount = function(){
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
};
