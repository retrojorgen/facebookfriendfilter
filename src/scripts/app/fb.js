define(['facebook'], function(){

    return {
        init : function (callback) { 

            FB.init({
                appId      : '494714660619366',
                channelUrl : '//http://www.hacklivet.no/likeapp/channel.php'
            });

            FB.getLoginStatus(function(response) {
                callback(response);
            });
        },

        login : function (callback) {

            FB.login(function(response) {
                callback(response);
            });
        },

        apiCall : function (call, callback) {

            FB.api(call, function(response) {
                    callback(response);
            });
        }
    }
});