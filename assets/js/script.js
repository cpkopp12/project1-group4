//DOM els
var optionContainerEl = document.querySelector("#choices-container");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");
var option1TextEl = document.querySelector("#option1Text");
var option2TextEl = document.querySelector("#option2Text");

//keeps track of index for container handler function
var indexCounter = 0;
//test obj
//var teamWins = [{teamName:"team 1",wins:1},{teamName:"team 2",wins:2},{teamName:"team 3",wins:1},{teamName:"team 4",wins:5},{teamName:"team 5",wins:1}];
// get array objs from local storage
var teamArray = localStorage.getItem("NHL Info");
teamArray = JSON.parse(teamArray);
console.log(teamArray);

//loads the fist two teams form the array
var loadFirstChoices = function(dataObj) {
    option1TextEl.innerHTML=dataObj[0].teamName;
    option2TextEl.innerHTML=dataObj[1].teamName;
    // Images added using JQuery
    $("#image1").attr("src", "./assets/images/NHL/" + dataObj[0].teamName +".png");
    $("#image2").attr("src", "./assets/images/NHL/" + dataObj[1].teamName +".png");
    $("#image1").innerHTML = dataObj[0].teamName;
    $("#image2").innerHTML = dataObj[1].teamName;
    //if tied, skip and load next choices
    if (dataObj[0].wins==dataObj[1].wins) {
        loadNextChoices(0, indexCounter, teamArray);
        indexCounter++;
    }
};

//from team name, get the index of team object within the dataObj array
var getDataObjIndex = function(name,dataObj) {
    for (i = 0; i < dataObj.length; i++) {
        if (name == dataObj[i].teamName) {
            return i;
        }
    }
};

//figure out which option is correct and return the index of the object
//gets the team names from the current DOM elements, finds their indices based
//on the team names inorder to compar the wins of each
var correctAnswer = function(dataObj){
    var option1Name = document.querySelector("#option1Text").innerHTML;
    var option2Name = document.querySelector("#option2Text").innerHTML;
    var option1Index = getDataObjIndex(option1Name,dataObj);
    var option2Index = getDataObjIndex(option2Name,dataObj);
    //no chance of tie, handled in loadNextChoices function
    if (dataObj[option1Index].wins>dataObj[option2Index].wins){
        return option1Index;
    } else {
        return option2Index;
    }
};

var loadNextChoices = function(lastIndex,indexCount,dataObj) {
    option1TextEl.innerHTML = dataObj[lastIndex].teamName;
    option2TextEl.innerHTML = dataObj[indexCount+2].teamName;
    $("#image1").attr("src", "./assets/images/NHL/" + dataObj[lastIndex].teamName +".png");
    $("#image2").attr("src", "./assets/images/NHL/" + dataObj[indexCount+2].teamName +".png");
    if (dataObj[lastIndex].wins==dataObj[indexCount+2].wins) {
        indexCounter++;
        loadNextChoices(lastIndex, indexCounter, teamArray);
    }
};

var choiceHandler = function(event) {
    event.preventDefault();

    var correctIndex = correctAnswer(teamArray);
    var choiceContainerEl = event.target.parentElement;
    var choiceName = choiceContainerEl.children[0].innerHTML;
    console.log(choiceName);
    var choiceIndex = getDataObjIndex(choiceName,teamArray);
    if (correctIndex == choiceIndex) {
        console.log("correct");
        loadNextChoices(correctIndex,indexCounter, teamArray);
    } else {
        console.log("incorrect");
        indexCounter = 0;
        loadFirstChoices(teamArray);
        
        return;
    }

    indexCounter++;
};


loadFirstChoices(teamArray);
optionContainerEl.addEventListener("click",choiceHandler);

