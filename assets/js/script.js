// --- --- GAME FLOW SCRIPT --- ---
// --- DOM/ VARIABLE DECLARATION --
// DOM Elements: General
var gameContainerEl = document.querySelector("#game");
var optionContainerEl = document.querySelector("#choices-container");
var seasonContainerEl = document.querySelector("#select-season");
var option1El = document.querySelector("#option1");
var option2El = document.querySelector("#option2");
var option1TextEl = document.querySelector("#option1Text");
var option2TextEl = document.querySelector("#option2Text");
var img1El = document.querySelector("#image1");
var img2El = document.querySelector("#image2");

//DOM Elements: Game Selection
var gameOptionContainerEl = document.querySelector("#select-game");

// DOM Elements: High Score Functionality
var highscoreContainerEl = document.querySelector("#highscore-container");
var highscoreFormEl = document.querySelector("#highscore-form-col");
var goBackBtn = document.querySelector("#go-back-btn");
var highscoreListEl = document.querySelector("#highscore-list-col");
var highscoreListNHLEl = document.querySelector("#highscore-list-NHL");
var highscoreListPLEl = document.querySelector("#highscore-list-PL");

// Keep track of index for game flow.
var indexCounter = 0;
var numCorrect = 0;

// Other global variables for storing game mode information.
var teamArray = [];
var imgSrc;

// --- GAME MODE AND SEASON SELECTIOn --
// Determines game type that user selected
var gameOptionHandler = function(event) {
    event.preventDefault();

    indexCounter = 0;
    numCorrect = 0;

    if(event.target.parentElement.id == "optionNHL") {
        localStorage.setItem("Game Type", "NHL");
    }
    else if(event.target.parentElement.id == "optionPL") {
        localStorage.setItem("Game Type", "PL");
    }
    console.log(localStorage.getItem("Game Type"));
    gameOptionContainerEl.style = "display:none;"
    gameContainerEl.style= "display:none;"
    seasonContainerEl.style = "display:block;"
    
};

// Season selection event handler.
$("#season-button").on("click", function() {
    var season = $("#season-select").val();
    var gameSelection = localStorage.getItem("Game Type");
    if (gameSelection == "PL") {
    getPLInfo(season);
    teamArray = localStorage.getItem("PL Info");
    teamArray = JSON.parse(teamArray);
    teamArray = arrayShuffler(teamArray);
    imgSrc = "./assets/images/Premier League/";
    }
    else {
    getNHLInfo(season);
    teamArray = localStorage.getItem("NHL Info");
    teamArray = JSON.parse(teamArray);
    teamArray = arrayShuffler(teamArray);
    imgSrc = "./assets/images/NHL/" ;
    }
    loadFirstChoices(teamArray);
    console.log(teamArray);

    gameOptionContainerEl.style = "display:none;"
    gameContainerEl.style= "display:block;"
    seasonContainerEl.style = "display:none;"
})

// --- GAME FLOW EVENT LISTENERS AND FUNCTIONALITY ---
// Function to suffle array of API data.
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

// Function to Generate random index for next question.
var randIndex = function(maxIndex) {
    return Math.floor(Math.random()*(maxIndex+1));
}; 

// Loads the fist two teams form the array.
var loadFirstChoices = function(dataObj) {
    option1TextEl.innerHTML=dataObj[0].name;
    option2TextEl.innerHTML=dataObj[1].name;
    // Images added using JQuery.
    $("#image1").attr("src", imgSrc + dataObj[0].name +".png");
    $("#image2").attr("src", imgSrc + dataObj[1].name +".png");
    $("#image1").innerHTML = dataObj[0].name;
    $("#image2").innerHTML = dataObj[1].name;
    // If tied, skip and load next choices.
    if (dataObj[0].wins==dataObj[1].wins) {
        loadNextChoices(0, indexCounter, dataObj);
        indexCounter++;
    }
};

// Loads next choices to DOM els, checks to see if teams are tied.
// If they are: add one to index counter and call the the method again,
// skipping the tied team before it loads to DOM els
var loadNextChoices = function(lastIndex,indexCount,dataObj) {
    if (dataObj[lastIndex].wins==dataObj[indexCount+2].wins) {
        indexCounter++;
        loadNextChoices(lastIndex, indexCounter, dataObj);
    }
    option1TextEl.innerHTML = dataObj[lastIndex].name;
    option2TextEl.innerHTML = dataObj[indexCount+2].name;
    $("#image1").attr("src", imgSrc + dataObj[lastIndex].name +".png");
    $("#image2").attr("src", imgSrc + dataObj[indexCount+2].name +".png");
};

// Determines if selected option during the game is correct. If not, it prompts the user to
// enter their high score.
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
        
        enterHighScore();
    }

    indexCounter++;
};

// Function to determine which option is correct and return the index of the object.
// Gets the team names from the current DOM elements, finds their indices based
// on the team names inorder to compar the wins of each.
var correctAnswer = function(dataObj){
    var option1Name = document.querySelector("#option1Text").innerHTML;
    var option2Name = document.querySelector("#option2Text").innerHTML;
    var option1Index = getDataObjIndex(option1Name,dataObj);
    var option2Index = getDataObjIndex(option2Name,dataObj);
    // No chance of tie, handled in loadNextChoices function
    if (dataObj[option1Index].wins>dataObj[option2Index].wins){
        return option1Index;
    } else {
        return option2Index;
    }
};

// From team name, get the index of team object within the dataObj array.
var getDataObjIndex = function(name,dataObj) {
    for (i = 0; i < dataObj.length; i++) {
        if (name == dataObj[i].name) {
            return i;
        }
    }
};

// --- HIGH SCORE LOADING, ENTRY, AND DISPLAY ---

// Highscore entry form
var enterHighScore = function () {
    gameContainerEl.setAttribute("style","display:none;");
    gameOptionContainerEl.setAttribute("style","display:none;");
    highscoreContainerEl.setAttribute("style","display:block;");
    highscoreFormEl.setAttribute("style","display:block;");
    highscoreListEl.setAttribute("style","display:none;");

    // Display user score for this round
    var titleString = "Your score is: " + numCorrect;
    document.querySelector("#highscore-form-header").innerHTML = titleString;
}

// Displays high scores, with option to clear high scores and return to main page
var highscoreDisplay = function(event) {
    event.preventDefault();
    gameContainerEl.setAttribute("style","display:none;");
    gameOptionContainerEl.setAttribute("style","display:none;");
    highscoreContainerEl.setAttribute("style","display:block;");
    highscoreFormEl.setAttribute("style","display:none;");
    highscoreListEl.setAttribute("style","display:block;");
    var highScores = loadScores();
    if(highScores==null||highScores.length==0){
        highScores = [];
    }

    var storeScore = {
        initial : document.querySelector("#initial").value,
        quizScore : numCorrect,
        gameType : localStorage.getItem("Game Type")
    }
    highScores.push(storeScore);

    // Sorts high scores in descending order.
    highScores.sort(function(a, b) {
        return b.quizScore - a.quizScore;
      });

    localStorage.setItem("highScores",JSON.stringify(highScores));
    document.querySelector("#initial").value = "";
    highscoreListNHLEl.replaceChildren();
    highscoreListPLEl.replaceChildren();
    var scoreListEls = [];
    for (let i = 0; i < highScores.length;i++) {
        scoreListEls[i] = document.createElement("li");
        scoreListEls[i].setAttribute("class","list-group-item");
        scoreListEls[i].innerHTML = highScores[i].initial + ": " + highScores[i].quizScore + " correct"; 
        if (highScores[i].gameType == "NHL") {
            highscoreListNHLEl.appendChild(scoreListEls[i]);
        }
        else {
            highscoreListPLEl.appendChild(scoreListEls[i]);
        }
        
    }   
};

// Load Scores
var loadScores = function() {
    var scs = localStorage.getItem("highScores");
    if(scs == null) {
        scs = [];
    } else {
        scs = JSON.parse(scs);
    }
    
    return scs;
}

// Clears High Scores
$("#clear-btn").on("click", function () {
    localStorage.removeItem("highScores");
    highscoreListNHLEl.replaceChildren();
    highscoreListPLEl.replaceChildren();
  });

// Event Handler for "Return to Main Menu" button
var goBackHandler = function(event) {
    event.preventDefault();
    gameOptionContainerEl.setAttribute("style","display:block");
    gameContainerEl.setAttribute("style","display:none");
    highscoreContainerEl.setAttribute("style","display:none");
};

// Call methods and add event listeners.
highScores = loadScores();
gameOptionContainerEl.addEventListener("click",gameOptionHandler);
optionContainerEl.addEventListener("click",choiceHandler);
highscoreFormEl.addEventListener("submit",highscoreDisplay);
goBackBtn.addEventListener("click",goBackHandler);