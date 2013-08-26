define(['jquery', 'app/fb'], function(jq,fb) {

    var app = {
        gvar : {
            that : app,
            userinfo : {},
            friends : {},
            questions : new Array(
                'hometown', 'likes', 'education', 'work'
            )
        },

        el : {
            loadingView : $('#loading-view'),
            loginView : $('#login-view'),
            loggedInView : $('#logged-in-view'),
            quizView : $('#quiz-view'),
            resultsView : $('#results-view'),
            startButton : $('#start-button'),
            loginButton : $('#login-button')
        },

        init : function () {
            this.el.loginView.show();
            this.el.startButton.on('click', this.setFriends);
            this.el.loginButton.on('click', this.loginPrompt);
        },

        authenticationResponse : function (response) {
            console.log(response.authResponse);
            if(response.authResponse !== undefined) {
                app.setLoginCredentials();
            } else {
                fb.login(function(response) {
                    console.log(response);
                    if(response.authResponse !== null) {
                        app.setLoginCredentials();
                    } else {
                        app.el.loadingView.hide();
                        app.el.loginView.show();

                    }
                });
            }
        },

        loginPrompt : function () {
            fb.init(app.authenticationResponse);
            app.el.loadingView.show();
            app.el.loginView.hide();
        },

        createQuiz : function () {
            var numberOfFriends   = app.gvar.friends.data.length-1,
                selectableFriends = new Array(),
                arbiTraryPerson;

            selectableFriends.push(app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)]);
            selectableFriends.push(app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)]);
            selectableFriends.push(app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)]);

            arbiTraryPerson = selectableFriends[app.getRandomArbitraryNumber(0,2)];
            console.log(arbiTraryPerson);

            app.getQuestion(arbiTraryPerson, function (response) {
                app.el.quizView.show();
                app.el.loadingView.hide();
                console.log(response);
            });
        },

        getQuestion : function (person,callback) {
            fb.apiCall('/' + person.id + '?fields=likes', function (response) {
                callback(app.pickRandomProperty(response.likes.data));
            })
        },

        pickRandomProperty : function (obj) {
            var result;
            var count = 0;
            for (var prop in obj) {
                if (Math.random() < 1/++count)
                    result = prop;
            }
            return obj[result];
        },

        setFriends : function () {
            app.el.loadingView.show();
            app.el.loggedInView.hide();
            app.getFriends('/me/friends', function (response) {
                app.gvar.friends = response;
                app.createQuiz();
            });
        },

        getFriends : function (call,callback) {
            fb.apiCall(call, function (response) {
                callback(response);
            });
        },

        getRandomArbitraryNumber : function (min, max) {
            return Math.round(Math.random() * (max - min) + min);
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