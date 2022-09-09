var optionContainerEl = document.querySelector("#choices-container");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");

var indexCounter = 0;

var teamWins = [{teamName:"team 1",wins:1},{teamName:"team 2",wins:2},{teamName:"team 3",wins:1}];

var loadFirstChoices = function(dataObj) {
    option1El.innerHTML=dataObj[0].teamName;
    option2El.innerHTML=dataObj[1].teamName;
};

var getDataObjIndex = function(name,dataObj) {
    for (i = 0; i < dataObj.length; i++) {
        if (name == dataObj[i].teamName) {
            return i;
        }
    }
};

var correctAnswer = function(dataObj){
    var option1Name = document.querySelector("#option1").innerHTML;
    var option2Name = document.querySelector("#option2").innerHTML;
    var option1Index = getDataObjIndex(option1Name,dataObj);
    var option2Index = getDataObjIndex(option2Name,dataObj);
    if (dataObj[option1Index].wins>dataObj[option2Index].wins) {
        return option1Index;
    } else {
        return option2Index;
    }
};

var choiceHandler = function(event) {
    event.preventDefault();

    var correctIndex = correctAnswer(teamWins);
    var choiceName = event.target.innerHTML;
    var choiceIndex = getDataObjIndex(choiceName,teamWins);
    if (correctIndex == choiceIndex) {
        console.log("correct");
    } else {
        console.log("incorrect");
    }

    indexCounter++;
};


loadFirstChoices(teamWins);
optionContainerEl.addEventListener("click",choiceHandler);

