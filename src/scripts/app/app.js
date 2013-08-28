define(['jquery', 'app/fb'], function(jq,fb) {

    var app = {
        gvar : {
            that : app,
            userinfo : {},
            friends : {},
            questions : new Array(
                'hometown', 'likes', 'education', 'work'
            ),
            answer : undefined
        },

        el : {
            loadingView : $('#loading-view'),
            loginView : $('#login-view'),
            loggedInView : $('#logged-in-view'),
            quizView : $('#quiz-view'),
            resultsView : $('#results-view'),
            startButton : $('#start-button'),
            loginButton : $('#login-button'),
            question : $('#question'),
            category : $('#category'),
            answer : $('#answer'),
            personOneImage : $('#img-1'),
            personTwoImage : $('#img-2'),
            personThreeImage : $('#img-3'),
            personOneName : $('#name-1'),
            personTwoName : $('#name-2'),
            personThreeName : $('#name-3'),
            answerImage : $('#img-answer-1'),
            answerName : $('#correct-answer-name'),
            imageSection : $('#image-section'),
            answerSection : $('#answer-section'),
            nextButton : $('#next-question-button')
        },

        init : function () {
            this.el.loginView.show();
            this.el.startButton.on('click', this.setFriends);
            this.el.loginButton.on('click', this.loginPrompt);
            this.el.loginButton.on('click', this.loginPrompt);
            this.el.imageSection.on('click', this.showAnswer);
            this.el.nextButton.on('click', this.nextQuestion);
        },

        authenticationResponse : function (response) {
            if(response.authResponse !== undefined) {
                app.setLoginCredentials();
            } else {
                fb.login(function(response) {
                    if(response.authResponse !== null) {
                        app.setLoginCredentials();
                    } else {
                        app.el.loadingView.hide();
                        app.el.loginView.show();

                    }
                });
            }
        },
        nextQuestion : function () {
            app.createQuiz();
        },

        showAnswer : function (event) {
            target = $(event.target);
            if(target.attr('data-answer') === 'yes') {
                app.el.answerSection.addClass('correct');
            } else {
                app.el.answerSection.addClass('false');
            }
            app.el.answerSection.show();
            app.el.imageSection.hide();
        },

        loginPrompt : function () {
            fb.init(app.authenticationResponse);
            app.el.loadingView.show();
            app.el.loginView.hide();
        },

        createQuiz : function () {

            // clean
            app.el.answerSection.removeClass('correct').removeClass('false');
            app.el.loadingView.show();
            app.el.quizView.hide();
            app.el.answerSection.hide();

            var numberOfFriends = app.gvar.friends.data.length-1;
            
            selectableFriends = new Array();
            // Get alternatives
            selectableFriends.push(app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)]);
            selectableFriends.push(app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)]);

            app.getAnswer(function (randomPerson, response) {
                app.el.category.text(response.category);
                app.el.answer.text(response.name);
                randomPerson.correct = true;
                selectableFriends.push(randomPerson);

                selectableFriends = selectableFriends.sort(function() {return 0.5 - Math.random()}); // randomise friends
                fb.apiCall('/' + selectableFriends[0].id + '?fields=picture.width(200).height(200).type(square)', function (response) {
                    app.el.personOneImage.attr('src', response.picture.data.url);
                    if(selectableFriends[0].hasOwnProperty('correct')) {
                        app.el.personOneImage.attr('data-answer', 'yes');
                        app.el.answerImage.attr('src', response.picture.data.url);
                        app.el.answerName.text(selectableFriends[0].name);
                    } else {
                        app.el.personOneImage.attr('data-answer', 'no');
                    }
                    app.el.personOneName.text(selectableFriends[0].name);

                    fb.apiCall('/' + selectableFriends[1].id + '?fields=picture.width(200).height(200).type(square)', function (response) {
                        app.el.personTwoImage.attr('src', response.picture.data.url);
                        if(selectableFriends[1].hasOwnProperty('correct')) {
                            app.el.personTwoImage.attr('data-answer', 'yes');
                            app.el.answerImage.attr('src', response.picture.data.url);
                            app.el.answerName.text(selectableFriends[1].name);
                        } else {
                            app.el.personTwoImage.attr('data-answer', 'no');
                        }
                        app.el.personTwoName.text(selectableFriends[1].name);

                        fb.apiCall('/' + selectableFriends[2].id + '?fields=picture.width(200).height(200).type(square)', function (response) {
                            app.el.personThreeImage.attr('src', response.picture.data.url);

                            if(selectableFriends[2].hasOwnProperty('correct')) {
                                app.el.personThreeImage.attr('data-answer', 'yes');
                                app.el.answerImage.attr('src', response.picture.data.url);
                                app.el.answerName.text(selectableFriends[2].name);
                            } else {
                                app.el.personThreeImage.attr('data-answer', 'no');
                            }

                            app.el.personThreeName.text(selectableFriends[2].name);


                            app.el.loadingView.hide();
                            app.el.quizView.show();
                            app.el.imageSection.show();
                        });
                    });
                });
            });
        },

        getAnswer : function (callback) {
            var like = undefined,
                mycallback = callback;
                numberOfFriends = app.gvar.friends.data.length-1,
                randomPerson = app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)];
                
            
            fb.apiCall('/' + randomPerson.id + '?fields=likes', function (response) {
                if(response.hasOwnProperty('likes')) {
                    console.log(response);
                    console.log("apepenis");
                    callback(randomPerson, app.pickRandomProperty(response.likes.data));
                } else {
                    app.getAnswerRecursive(function (randomPerson, response) {
                        console.log(randomPerson, response);
                        mycallback(randomPerson, response);
                    });
                }
            });

        },

        getAnswerRecursive : function (callback) { // Recursive callback madness
            var numberOfFriends = app.gvar.friends.data.length-1,
                randomPerson = app.gvar.friends.data[app.getRandomArbitraryNumber(0,numberOfFriends)];

            fb.apiCall('/' + randomPerson.id + '?fields=likes', function (response) {
                if(response.hasOwnProperty('likes')) {
                    var property = app.pickRandomProperty(response.likes.data);
                    console.log(property);
                    console.log("kattepenis");
                    console.log(callback);
                    callback(randomPerson, property);
                } else {
                    app.getAnswerRecursive(callback);
                }
            });

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