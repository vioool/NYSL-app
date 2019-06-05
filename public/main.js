var app = new Vue({
    el: '#main',
    data: {
        display: 'game_schedule', // 2b. make a new var A with the value of the id of the default page div
        gameData: [],
        teamList: [],
        filtered: [],
        teamSelected: "anyTeam",
        selectedGame: {},
        show: 'next_game',
        message: '',
        textInput: ''
    },

    created: function () {
        this.getData();
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

        writeNewPost: function () {
            // https://firebase.google.com/docs/database/web/read-and-write

            // Values
            var text = document.getElementById("textInput").value;
            console.log(text);
            var name = firebase.auth().currentUser.displayName;
            console.log(name);

            var message = {
                mensaje: text,
                user: name
            };

            console.log(message);

            firebase
                .database()
                .ref("myChat")
                .push(message);

            // A post entry.

            //Write data
        },

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
