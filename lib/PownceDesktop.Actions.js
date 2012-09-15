/**
 * @author jon
 */
PownceDesktop.prototype.doLogin = function(){
    properties.ui.loading = true;
    properties.user.username = $('username').value;
    properties.user.password = $('password').value;
    $('login-button').value = "Logging In...";
    $('login-button').disabled = true;
    $('username').disabled = true;
    $('password').disabled = true;
    $('auto-login').disabled = true;
    this.authHTTPBasic();
};

