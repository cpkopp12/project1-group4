// Retrieves info from both API
// FOR GROUP: WE CAN PROMPT USER FOR SEASON WHEN DOING EITHER QUIZ

// NHL Data - from https://github.com/dword4/nhlapi#team-stats
function getNHLInfo(season){
//Reformats NHL season to be compatible with statsapi before fetching
season = (season-1).toString() + season.toString();
console.log(season);
fetch("https://statsapi.web.nhl.com/api/v1/standings?season=" + season)
.then(response => response.json())
.then(NHLData => extractNHLData(NHLData));

function extractNHLData(data) {
    //console.log(data);
    var array = [];
    // Stores team name, wins and loses.
    for (i = 0; i < data.records.length; i++) {
        for (j = 0; j < data.records[i].teamRecords.length; j++) {
        array.push({
          name: data.records[i].teamRecords[j].team.name,
          wins: data.records[i].teamRecords[j].leagueRecord.wins,
          loses: data.records[i].teamRecords[j].leagueRecord.losses,
        })
    }
   };
   console.log(array);
   localStorage.setItem("NHL Info", JSON.stringify(array));
}
}

// Left in console.log to show what data is stored to global variable NHLArray
// console.log(NHLArray);

// ---------------------------------------------------------------------------------------------------------------------------------------------

// Premiere League Data - From https://rapidapi.com/api-sports/api/api-football/
// FOR GROUP: WHEN USING, PLEASE SIGN UP AND REPLACE THE "'X-RapidAPI-Key'" VALUE WITH YOUR OWN KEY, OR USE THIS ONE SPARINGLY. 
// It only takes 100 calls a day. Please spare my wallet :)
function getPLInfo(season) {
    console.log(season);
    const options = {
	    method: 'GET',
	    headers: {
	        'X-RapidAPI-Key': '46126e8422msh602a18bec5f96b1p1c20b9jsn42582ba3613a',
	        'X-RapidAPI-Host': 'api-football-v1.p.rapidapi.com'
	        }
    };

fetch('https://api-football-v1.p.rapidapi.com/v3/standings?season='+ season + '&league=39', options)
	.then(response => (response.json()))
    .then(PLData => extractPLData(PLData))
	.catch(err => console.error(err));

    function extractPLData(data) {
        //console.log(data);
        var array = [];
        // Stores Team Name, Wins, loses, draws, and points (Wins = 3, Draws = 1, Loses = 0)
        for (i = 0; i < data.response[0].league.standings[0].length; i++) {
            array.push({
              teamName: data.response[0].league.standings[0][i].team.name,
              wins: data.response[0].league.standings[0][i].all.win,
              loses: data.response[0].league.standings[0][i].all.lose,
              draws: data.response[0].league.standings[0][i].all.draw,
              points: data.response[0].league.standings[0][i].points,
            })
        };
       console.log(array);
       localStorage.setItem("PL Info", JSON.stringify(array));
    }
}
// Left

//console.log(PLArray);