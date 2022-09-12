//DOM els: game
var gameContainerEl = document.querySelector("#game");
var optionContainerEl = document.querySelector("#choices-container");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");
var option1TextEl = document.querySelector("#option1Text");
var option2TextEl = document.querySelector("#option2Text");
var img1El = document.querySelector("#image1");
var img2El = document.querySelector("#image2");

//DOM els: select game
var gameOptionContainerEl = document.querySelector("#select-game");

//HighScore DOM Els
var highscoreContainerEl = document.querySelector("#highscore-container");
var highscoreFormEl = document.querySelector("#highscore-form");
var goBackBtn = document.querySelector("#go-back-btn");
var highscoreListEl = document.querySelector("#highscore-list");

//keeps track of index for container handler function
var indexCounter = 0;
var numCorrect = 0;

//other global vars
var teamArray = [];
var imgSrc;


// var load scores
var loadScores = function() {
    var scs = localStorage.getItem("highScores");
    if(scs == null) {
        scs = [];
    } else {
        scs = JSON.parse(scs);
    }
    
    return scs;
}

//go back btn handler
var goBackHandler = function(event) {
    event.preventDefault();
    gameOptionContainerEl.setAttribute("style","display:block");
    gameContainerEl.setAttribute("style","display:none");
    highscoreContainerEl.setAttribute("style","display:none");
    
    
};


//funtion to handle highscore input, has to also reset elements
var highscoreFormHandler = function(event) {
    event.preventDefault();
    var highScores = loadScores();
    if(highScores==null||highScores.length==0){
        highScores = [];
    }

    var storeScore = {
        initial : document.querySelector("#initial").value,
        quizScore : numCorrect
    }
    highScores.push(storeScore);
    localStorage.setItem("highScores",JSON.stringify(highScores));
    showHighScore();
    document.querySelector("#initial").value = "";

    
};



//highscore form
var showHighScore = function () {
    gameContainerEl.setAttribute("style","display:none;");
    gameOptionContainerEl.setAttribute("style","display:none;");
    highscoreContainerEl.setAttribute("style","display:block;");

    var scores = loadScores();

    //show user score
    var titleString = "Your score is: " + numCorrect;
    document.querySelector("#highscore-form-header").innerHTML = titleString;

    highscoreListEl.replaceChildren();
    var scoreListEls = [];
    for (let i = 0; i < scores.length;i++) {
        scoreListEls[i] = document.createElement("li");
        scoreListEls[i].setAttribute("class","list-group-item");
        scoreListEls[i].innerHTML = scores[i].initial + ": " + scores[i].quizScore + " correct"; 
        highscoreListEl.appendChild(scoreListEls[i]);
    }

    

    
}

//function to generate random index 
var randIndex = function(maxIndex) {
    return Math.floor(Math.random()*(maxIndex+1));
}; 

//function to suffle array of API data
var arrayShuffler = function(dataObj) {
    var shuffledDataObj = [];
    var mxIndex = dataObj.length - 1;
    for (let i = 0; i <= mxIndex; i++) {
        var currentMxIndex = mxIndex - i;
        var randomIndex = randIndex(currentMxIndex);
        var randomObj = dataObj[randomIndex];
        shuffledDataObj.push(randomObj);
        dataObj.splice(randomIndex,1);
    }
    return shuffledDataObj;
};


//loads the fist two teams form the array
var loadFirstChoices = function(dataObj) {
    option1TextEl.innerHTML=dataObj[0].teamName;
    option2TextEl.innerHTML=dataObj[1].teamName;
    // Images added using JQuery
    $("#image1").attr("src", imgSrc + dataObj[0].teamName +".png");
    $("#image2").attr("src", imgSrc + dataObj[1].teamName +".png");
    $("#image1").innerHTML = dataObj[0].teamName;
    $("#image2").innerHTML = dataObj[1].teamName;
    //if tied, skip and load next choices
    if (dataObj[0].wins==dataObj[1].wins) {
        loadNextChoices(0, indexCounter, dataObj);
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

// loads next choices to DOM els, checks to see if teams are tied
// if they are: add one to index counter and call the the method again,
// skipping the tied team before it loads to DOM els
var loadNextChoices = function(lastIndex,indexCount,dataObj) {
    if (dataObj[lastIndex].wins==dataObj[indexCount+2].wins) {
        indexCounter++;
        loadNextChoices(lastIndex, indexCounter, dataObj);
    }
    option1TextEl.innerHTML = dataObj[lastIndex].teamName;
    option2TextEl.innerHTML = dataObj[indexCount+2].teamName;
    $("#image1").attr("src", imgSrc + dataObj[lastIndex].teamName +".png");
    $("#image2").attr("src", imgSrc + dataObj[indexCount+2].teamName +".png");
};

var choiceHandler = function(event) {
    event.preventDefault();

    var correctIndex = correctAnswer(teamArray);
    var choiceContainerEl = event.target.parentElement;
    var choiceName = choiceContainerEl.children[0].innerHTML;
    var choiceIndex = getDataObjIndex(choiceName,teamArray);
    if (correctIndex == choiceIndex) {
        console.log("correct");
        numCorrect++;
        loadNextChoices(correctIndex,indexCounter, teamArray);
    } else {
        
        showHighScore();
        //showHighScoreList();
        //console.log("incorrect");
        //indexCounter = 0;
        //teamArray = arrayShuffler(teamArray);
        //loadFirstChoices(teamArray);
    }

    indexCounter++;
};

var gameOptionHandler = function(event) {
    event.preventDefault();

    indexCounter = 0;
    numCorrect = 0;

    if(event.target.parentElement.id == "optionNHL") {
        teamArray = localStorage.getItem("NHL Info");
        teamArray = JSON.parse(teamArray);
        teamArray = arrayShuffler(teamArray);
        imgSrc = "./assets/images/NHL/" ;
        loadFirstChoices(teamArray);
        console.log(teamArray);
    }
    if(event.target.parentElement.id == "optionPL") {
        teamArray = localStorage.getItem("PL Info");
        teamArray = JSON.parse(teamArray);
        teamArray = arrayShuffler(teamArray);
        imgSrc = "./assets/images/Premier League/";
        loadFirstChoices(teamArray);
        console.log(teamArray);
    }
    gameOptionContainerEl.style = "display:none;"
    gameContainerEl.style= "display:block;"
    
    
};

//call methods and add event listeners
highScores = loadScores();
gameOptionContainerEl.addEventListener("click",gameOptionHandler);
optionContainerEl.addEventListener("click",choiceHandler);
highscoreFormEl.addEventListener("submit",highscoreFormHandler);
goBackBtn.addEventListener("click",goBackHandler);

