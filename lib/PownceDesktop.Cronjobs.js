/**
 * @author jon
 */
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

PownceDesktop.CleanCacheCronJob = function() {
	
};

