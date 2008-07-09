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
		catch(e) {}
    };
	this.prepareSQL = function(query, tokens) {
		for( var token in tokens) {
	        query = query.replace("{" + token + "}", tokens[token]);
		}
		return query;
	};
}
