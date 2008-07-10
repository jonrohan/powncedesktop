/**
 * @author jon
 */
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
