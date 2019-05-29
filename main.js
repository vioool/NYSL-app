var app = new Vue({
    el: '#main',
    data: {
        message: 'Hello Vue!',
        array: ["hello", "hi", "Yeah!"],
        gameData: [],
        teamList: [],
        filtered: [],
        teamSelected: "anyTeam",
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
        
        filterGames: function () {
            app.filtered = [];

            for (var i = 0; i < app.gameData.length; i++) {
                if (app.teamSelected == app.gameData[i].teamA || app.teamSelected == app.gameData[i].teamB || app.teamSelected == "all") {
                    app.filtered.push(app.gameData[i]);
                }
            }
            console.log(app.filtered)
        }
    }

})
