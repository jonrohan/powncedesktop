/**
 * @author jr4409
 */
var digget = new Class.create();
digget.prototype = {
    initialize: function(options){
        if (!options.diggurl) 
            return;
        if (!options.container) 
            return;
        this.diggurl = options.diggurl;
        this.container = options.container;
        var oInst = this;
        var handlerFunc = function(t){
			var resp = t.responseText;
            air.trace(resp);
        };
        var errFunc = function(t){
        
        };
        new Ajax.Request(this.diggurl, {
            onSuccess: handlerFunc,
            onFailure: errFunc,
            method: 'get'
        });
    },
};