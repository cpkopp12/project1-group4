var optionContainerEl = document.querySelector("#choices-container");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");


var teamWins = [{teamName:"team 1",wins:1},{teamName:"team 2",wins:2},{teamName:"team 3",wins:1}];

var loadFirstChoices = function(dataObj) {
    option1El.innerHTML=dataObj[0].teamName;
    option2El.innerHTML=dataObj[1].teamName;
};

var choiceHandler = function(event) {
    event.preventDefault();
    console.log(event.target);
};


loadFirstChoices(teamWins);
optionContainerEl.addEventListener("click",choiceHandler);

