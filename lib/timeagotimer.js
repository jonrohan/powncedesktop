var TimeAgoTimer = Class.create();

TimeAgoTimer.prototype = {

    initialize: function(options){
    
        this.month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        this.daysuffix = ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th', 'th', 'st'];
        this._properties = {
            visible: false
        };
        
        this.options = Object.extend({
            obj: null,
            secondsSince: 0
        }, options ||
        {});
        
        this.secondsSince = this.options.secondsSince;
        
        this.obj = this.options.obj;
        if (!this.obj) {
            return;
        }
        this.failcnt = 0;
        
        var oInst = this;
        
        this.tick = function(){
            if ($(oInst.obj)) {
                if (oInst.failcnt > 3) 
                    return;
                var timeAgo = "";
                if (oInst.secondsSince >= 604800) {
                    oInst.stop();
                    var day = Math.floor(((oInst.secondsSince / 60) / 60) / 24);
                    var now = new Date();
                    now.setDate(now.getDate() - day);
                    timeAgo = oInst.month[now.getMonth()] + " " + now.getDate() + oInst.daysuffix[now.getDate()];
                    
                } else if (oInst.secondsSince >= 86400) {
                    var day = Math.floor(((oInst.secondsSince / 60) / 60) / 24);
                    if (day == 1) 
                        timeAgo = day + " day ago";
                    else 
                        timeAgo = day + " days ago";
                } else if (oInst.secondsSince >= 3600) {
                    var hour = Math.floor((oInst.secondsSince / 60) / 60);
                    if (hour == 1) 
                        timeAgo = hour + " hour ago";
                    else 
                        timeAgo = hour + " hours ago";
                } else if (oInst.secondsSince >= 120) {
                    timeAgo = Math.floor((oInst.secondsSince / 60)) + " min ago";
                } else {
                    timeAgo = "just now!";
                }
                $(oInst.obj).innerHTML = timeAgo;
                
            } else {
                oInst.failcnt++;
            }
            oInst.secondsSince++;
            oInst.secondsSince--;
            oInst.secondsSince += 10;
        }
        this.timer = setInterval(this.tick, 10000);
        
    },
    stop: function(){
        clearInterval(this.timer);
    }
};


