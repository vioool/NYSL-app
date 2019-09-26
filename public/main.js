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
        shine: '',
        route: [],
    },

    created: function () {
        this.getData();
        this.getPosts();
        this.isLogged();
    },

    methods: {
        getData: async function () {

            await fetch("https://api.myjson.com/bins/1ck2px", {
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

        isLogged() {

            firebase.auth().onAuthStateChanged(function (user) {
                console.log(user)
                if (user) {
                    // User is signed in.
                    app.shine = 'login'
                } else {
                    // No user is signed in.
                    app.shine = 'logout'
                }
            });
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

            document.getElementById("textInput").value = "";

            // A post entry.

            //Write data
        },

        getPosts: function () {
            // https://firebase.google.com/docs/database/web/read-and-write

            console.log("getting logs");

            firebase
                .database()
                .ref("myChat")
                .on("value", function (data) {
                    console.log("data: ", data);

                    var posts = data.val();
                    //                    console.log("msgs: ", posts);

                    var template = "";

                    var logs = document.getElementById("posts");
                    logs.innerHTML = "";

                    for (var key in posts) {

                        var everyMessage = posts[key];
                        //                        console.log(key, everyMessage);

                        var userImage = document.createElement("IMG");
                        userImage.setAttribute("id", "user_image");
                        userImage.setAttribute("src", everyMessage.image)
                        logs.append(userImage);

                        var h5 = document.createElement("h5");
                        h5.append(everyMessage.mensaje);
                        logs.append(h5);

                        var messageTag = document.createElement("DIV");
                        messageTag.setAttribute("class", "messagetag");
                        logs.append(messageTag);

                        var nameTag = document.createElement("p");
                        nameTag.setAttribute("class", "nametag");
                        nameTag.append(everyMessage.user);
                        messageTag.append(nameTag);

                        var timeStamp = document.createElement("p");
                        timeStamp.setAttribute("class", "time_stamp");
                        let hours = new Date(everyMessage.currentDate).getHours()
                        if (hours < 10) hours = '0' + hours;

                        let minutes = new Date(everyMessage.currentDate).getMinutes()
                        if (minutes < 10) minutes = '0' + minutes;

                        let day = new Date(everyMessage.currentDate).getDate()
                        if (day < 10) day = '0' + day;

                        let month = new Date(everyMessage.currentDate).getMonth()
                        if (month < 10) month = '0' + (month + 1);

                        let year = new Date(everyMessage.currentDate).getFullYear()
                        let dateString = hours + ":" + minutes + " " + day + "/" + (month) + "/" + year
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

        followRoute: function () {
            app.route.push(app.display);

            console.log(app.route);
        },

        prevPage: function (last) {
            app.display = app.route[app.route.length - 1];
            app.route.splice(-1, 1);
        },

        //is deze nog nodig??
        changeStatus: function (status) {
            app.shine = status
        },

        changeGame: function (game) { // 1. first make the function B that changes the game
            app.selectedGame = game // 2a than make a new var A at data
            // 3. pass the function, access the new var A here with app. in front, and give it a parameter()
            // 4. go to your HTML to call the funcion
        },

        //        nextGame: function (next) {
        //            app.show = next
        //        },

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

// When the user scrolls down 15px from the top of the document, show the button
window.onscroll = function () {
    scrollFunction()
};

function scrollFunction() {
    if (document.body.scrollTop > 150 || document.documentElement.scrollTop > 150) {
        document.getElementById("myBtn").style.display = "block";
    } else {
        document.getElementById("myBtn").style.display = "none";
    }
}

// When the user clicks on the button, scroll to the top of the document
function topFunction() {
   $("html, body").animate({scrollTop: "0"});
}

 var map, infoWindow;
      function initMap() {
        map = new google.maps.Map(document.getElementById('map'), {
          center: {lat: -34.397, lng: 150.644},
          zoom: 15
        });
        infoWindow = new google.maps.InfoWindow;

        // Try HTML5 geolocation.
        if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };

            infoWindow.setPosition(pos);
            infoWindow.setContent('Location found.');
            infoWindow.open(map);
            map.setCenter(pos);
          }, function() {
            handleLocationError(true, infoWindow, map.getCenter());
          });
        } else {
          // Browser doesn't support Geolocation
          handleLocationError(false, infoWindow, map.getCenter());
        }
      }

      function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }

