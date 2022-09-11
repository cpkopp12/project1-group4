//DOM els: game
var optionContainerEl = document.querySelector("#choices-container");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");
var option1TextEl = document.querySelector("#option1Text");
var option2TextEl = document.querySelector("#option2Text");
var img1El = document.querySelector("#image1");
var img2El = document.querySelector("#image2");

//DOM els: select game
var gameOptionContainerEl = document.querySelector("#select-game")
var gameContainerEl = document.querySelector("#game");

//DOM els: high score form
var scoreForm = document.createElement("form");
scoreForm.setAttribute("id","score-form");
// submit score button
var scoreSubmit = document.createElement("button");
scoreSubmit.setAttribute("id","score-submit-btn");
scoreSubmit.setAttribute("type","submit");
scoreSubmit.textContent = "Submit";
// high score input
var scoreInput = document.createElement("input");
scoreInput.setAttribute("type","text");
scoreInput.setAttribute("name","score-input");
scoreInput.setAttribute("placeholder", "Enter your initials.");
//Append to form element
scoreForm.appendChild(scoreInput);
scoreForm.appendChild(scoreSubmit);

//keeps track of index for container handler function
var indexCounter = 0;

//other global vars
var teamArray = [];
var imgSrc;
var highScores = [];

//go back btn handler
var goBackHandler = function(event) {
    event.preventDefault();
    gameOptionContainerEl.setAttribute("style","display:block");
    gameContainerEl.setAttribute("style","display:none");
    
    //replace high score elements with quiz elements
    option1TextEl = document.createElement("h1");
    option1TextEl.innerHTML = "option 1";
    option1TextEl.setAttribute("id","option1Text");
    option1TextEl.setAttribute("class","card-header");
    option1TextEl = document.createElement("h1");
    option2TextEl.innerHTML = "option 2";
    option1TextEl.setAttribute("id","option1Text");
    option1TextEl.setAttribute("class","card-header");
    img1El = document.createElement("img");
    img1El.setAttribute("id","image1");
    img2El = document.createElement("img");
    img2El.setAttribute("id","image2");

    option1El.replaceChildren(option1TextEl,img1El);
    option2El.replaceChildren(option2TextEl,img2El);
};
//clear scores btn handler
var clearScoresHandler = function(event) {
    event.preventDefault();
    highScores = [];
    localStorage.setItem("highScores",JSON.stringify(highScores));
    showHighScoreList();
};

//funtion to handle highscore input, has to also reset elements
var highScoreHandler = function(event,newScore) {
    event.preventDefault();
    highScores = localStorage.getItem("highScores");
    if (highScores === null) {
        highScores = [];
    } else {
        highScores = JSON.parse(highScores);
    }

    var storeScore = {
        initial : scoreInput.value,
        quizScore : newScore
    }
    highScores.push(storeScore);
    localStorage.setItem("highScores",JSON.stringify(highScores));
    showHighScoreList();
    // need to add event listner we removed in last function showHighScoreForm
    //optionContainerEl.addEventListener("click",choiceHandler);
};

//highscore list
var showHighScoreList = function() {
    // create button to take us back to main page
    var goBackBtn = document.createElement("button");
    goBackBtn.setAttribute("id","go-back-btn");
    goBackBtn.innerHTML = "Go Back To Main Page";
    var clearScoresBtn = document.createElement("button");
    clearScoresBtn.setAttribute("id","clear-scores-btn");
    clearScoresBtn.innerHTML = "Clear High Scores";
    
    goBackBtn.addEventListener("click",goBackHandler);
    clearScoresBtn.addEventListener("click",clearScoresHandler);

    var cardHeaderEl = document.createElement("h1");
    cardHeaderEl.innerHTML = "High Scores";
    cardHeaderEl.setAttribute("class","card-header");

    //read from local storage and create ul
    highScores = localStorage.getItem("highScores");
    highScores = JSON.parse(highScores);
    console.log(highScores);
    //check if empty
    if (highScores == null || highScores.length == 0) {
        var noScoresEl = document.createElement("h1");
        noScoresEl.setAttribute("class","card-title");
        noScoresEl.innerHTML = "No highscores yet!";
        option2El.replaceChildren(cardHeaderEl,noScoresEl,goBackBtn); 
        return;
    } 
    

    //Create list of previous scores, ul = scoreList, li = scoreListEl[i], same index as allScores
    var scoreList = document.createElement("ul");
    scoreList.setAttribute("class","list-group list-group-flush");
    var scoreListEls = [];
    for (let i = 0; i < highScores.length;i++) {
        scoreListEls[i] = document.createElement("li");
        scoreListEls[i].setAttribute("class","list-group-item");
        scoreListEls[i].innerHTML = highScores[i].initial + ": " + highScores[i].quizScore + " correct"; 
        scoreList.appendChild(scoreListEls[i]);
    }

    option2El.replaceChildren(cardHeaderEl,scoreList,goBackBtn,clearScoresBtn);
    
    
};

//highscore form
var showHighScoreForm = function (numCorrect) {
    //show user score
    var titleString = "Your score is: " + numCorrect;
    var scoreFormTitleEl = document.createElement("h1");
    scoreFormTitleEl.setAttribute("class","card-header");
    scoreFormTitleEl.innerHTML = titleString;

    //form for initials
    scoreForm.setAttribute("class","card-body");
    option1El.replaceChildren(scoreFormTitleEl, scoreForm);

    //Same els as quiz, need to remove that eventListener
    optionContainerEl.removeEventListener("click",choiceHandler);
    optionContainerEl.removeEventListener("click",choiceHandler);
    option1El.addEventListener("submit", (event) => { highScoreHandler(event,numCorrect); });
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
        loadNextChoices(correctIndex,indexCounter, teamArray);
    } else {
        showHighScoreForm(indexCounter);
        showHighScoreList();
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
    optionContainerEl.addEventListener("click",choiceHandler);
    
};

//call methods and add event listeners

gameOptionContainerEl.addEventListener("click",gameOptionHandler);

