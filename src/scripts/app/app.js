define(['jquery', 'app/fb'], function(jq,fb) {

    var app = {
        gvar : {
            that : app,
            userinfo : {}
        },

        el : {
            loadingView : $('#loading-view'),
            loginView : $('#login-view'),
            loggedInView : $('#logged-in-view'),
            quizView : $('#quiz-view'),
            resultsView : $('#results-view'),
            startButton : $('#start-button')
        },

        init : function () {
            this.el.loadingView.show();
            fb.init(this.authenticationResponse);
            this.el.startButton.on('click', this.setFriends);
        },
        authenticationResponse : function (response) {
            if(response.authResponse !== undefined) {
                app.setLoginCredentials();
            } else {
                fb.login(function(response) {
                    if(response.authResponse !== undefined) {
                        app.setLoginCredentials();
                    }
                });
            }
        },
        setFriends : function () {
            console.log('hest');
            //fb.apiCall('/me/friends', function (response) {
              //  console.log(response);
            //});
            fb.apiCall('/1429936551/picture', function (response) {
                console.log(response);
            });
            fb.apiCall('/1429936551/user_birthday', function (response) {
                console.log(response);
            });
            fb.apiCall('/1429936551/likes', function (response) {
                console.log(response);
            });
        },
        setLoginCredentials : function () {
            username = this.el.loggedInView.find('#logged-in-username');

            fb.apiCall('/me', function (response) {
                if(response) {
                    username.text(response.name);
                    app.userinfo = response;
                    app.el.loadingView.hide();
                    app.el.loggedInView.show();
                }
            });
        }
    };
    app.init();
});