/**
 * @author jon
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
