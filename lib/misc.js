/**
 * @author jon
 */
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
