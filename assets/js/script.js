//DOM els
var optionContainerEl = document.querySelector("#choices-container");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");
//keeps track of index for container handler function
var indexCounter = 0;
//test obj
//var teamWins = [{teamName:"team 1",wins:1},{teamName:"team 2",wins:2},{teamName:"team 3",wins:1},{teamName:"team 4",wins:5},{teamName:"team 5",wins:1}];
// get array objs from local storage
var teamArray = localStorage.getItem("NHL Info");
teamArray = JSON.parse(teamArray);
console.log(teamArray);

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

var loadNextChoices = function(lastIndex,indexCount,dataObj) {
    option1El.innerHTML = dataObj[lastIndex].teamName;
    option2El.innerHTML = dataObj[indexCount+2].teamName;
};

var choiceHandler = function(event) {
    event.preventDefault();

    var correctIndex = correctAnswer(teamArray);
    var choiceName = event.target.innerHTML;
    var choiceIndex = getDataObjIndex(choiceName,teamArray);
    if (correctIndex == choiceIndex) {
        console.log("correct");
        loadNextChoices(correctIndex,indexCounter, teamArray);
    } else {
        console.log("incorrect");
        loadFirstChoices(teamArray);
        indexCounter = 0;
        return;
    }

    indexCounter++;
};


loadFirstChoices(teamArray);
optionContainerEl.addEventListener("click",choiceHandler);

