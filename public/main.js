var app = new Vue({
    el: '#main',
    data: {
        display: 'game_schedule', // 2b. make a new var A with the value of the id of the default page div
        gameData: [],
        teamList: [],
        filtered: [],
        teamSelected: "all",
        selectedGame: {},
        show: 'next_game',
        message: '',
        shine: 'login',
    },

    created: function () {
        this.getData();
        this.getPosts();
    },

    methods: {
        getData: async function () {

            await fetch("https://api.myjson.com/bins/8ngnc", {
                    method: 'GET',
                })
                .then(response => response.json())
                .then(json => {
                    app.gameData = json.game_schedule;
                    app.teamList = json.teams;
                    app.filtered = app.gameData;
                })
                .catch(err => console.error(err))
        },

        login: function () {
            // https://firebase.google.com/docs/auth/web/google-signin

            // Provider
            var provider = new firebase.auth.GoogleAuthProvider();

            // How to Log In
            firebase
                .auth()
                .signInWithPopup(provider)
                .then(res => {
                    console.log(res);
                    console.log(res.user.displayName)
                });

            console.log("login");
        },

        logout: function () {

            firebase
                .auth()
                .signOut()
                .then(function () {
                    // Sign-out successful.
                })
                .catch(function (error) {
                    // An error happened
                });

            console.log("logout");
        },

        writeNewPost: function () {
            // https://firebase.google.com/docs/database/web/read-and-write

            // Values
            var text = document.getElementById("textInput").value;
            console.log(text);
            var name = firebase.auth().currentUser.displayName;
            console.log(name);
            var image = firebase.auth().currentUser.photoURL;

            var message = {
                mensaje: text,
                user: name,
                image: image,
                currentDate: Date.now(),


            };

            console.log(message);

            firebase
                .database()
                .ref("myChat")
                .push(message);

            //document.getElementsByTagName('h5').value='';
            document.getElementById("textInput").value = "";

            // A post entry.

            //Write data
        },

        getPosts: function () {
            // https://firebase.google.com/docs/database/web/read-and-write

            console.log("getting posts");

            firebase
                .database()
                .ref("myChat")
                .on("value", function (data) {
                    console.log("data: ", data);
                    var mensajes = data.val();
                    console.log("msgs: ", mensajes);

                    var posts = document.getElementById("posts");
                    posts.innerHTML = "";
                    for (var key in mensajes) {
                        var everyMessage = mensajes[key];
                        console.log(key, everyMessage);

                        var userImage = document.createElement("IMG");
                        userImage.setAttribute("id", "user_image");
                        userImage.setAttribute("src", everyMessage.image)
                        posts.append(userImage);

                        var h5 = document.createElement("h5");
                        h5.append(everyMessage.mensaje);
                        posts.append(h5);
                        
                        var messageTag = document.createElement("DIV");
                        messageTag.setAttribute("class", "messagetag");
                        posts.append(messageTag);

                        var nameTag = document.createElement("p");
                        nameTag.setAttribute("class", "nametag");
                        nameTag.append(everyMessage.user);
                        messageTag.append(nameTag);

                        var timeStamp = document.createElement("p");
                        timeStamp.setAttribute("class", "time_stamp");
                        let day = new Date(everyMessage.currentDate).getDate()
                        let month = new Date(everyMessage.currentDate).getMonth()
                        let year = new Date(everyMessage.currentDate).getFullYear()
                        let dateString = day + "-" + (month + 1) + "-" + year
                        timeStamp.append(dateString);
                        messageTag.append(timeStamp);

                    }
                });
        }, // JavaScript source code

        filterGames: function () {
            app.filtered = [];

            for (var i = 0; i < app.gameData.length; i++) {
                if (app.teamSelected == app.gameData[i].teamA || app.teamSelected == app.gameData[i].teamB || app.teamSelected == "all") {
                    app.filtered.push(app.gameData[i]);
                }
            }
            console.log(app.filtered)
        },

        changeDisplay: function (page) {
            app.display = page
            
            console.log(page);
        },

        changeStatus: function (status) {
            app.shine = status
        },

        changeGame: function (game) { // 1. first make the function B that changes the game
            app.selectedGame = game // 2a than make a new var A at data
            // 3. pass the function, access the new var A here with app. in front, and give it a parameter()
            // 4. go to your HTML
        },

        nextGame: function (next) {
            app.show = next
        },

        getIndex: function () {
            return this.filtered.findIndex(item => item === this.selectedGame)
        },

        prevGame: function () {
            if (this.getIndex() > 0) {
                var prevIndex = this.getIndex() - 1;
                this.selectedGame = this.filtered[prevIndex]
            }
        },

        nextGame: function () {
            if (this.getIndex() < this.filtered.length - 1) {
                var nextIndex = this.getIndex() + 1;
                this.selectedGame = this.filtered[nextIndex]
            }
        }
    }

})
