var level = 0;

var started = false;

var gamePattern = [];

var userClickedPattern = [];

var buttonColours = ["red", "blue", "green", "yellow"];


$(document).keypress(function () {
    if (!started) {
        $("#level-title").text("Level " + level);
        nextSequence();
        started = true;
    }
});


$(".btn").click(function () {

    var userChosenColor = $(this).attr("id");
    userClickedPattern.push(userChosenColor);

    playSound(userChosenColor);
    animatePress(userChosenColor);
    checkAnswer(userClickedPattern.length - 1);
    console.log(gamePattern);
});


function checkAnswer(currentLevel) {

    if (userClickedPattern[currentLevel] == gamePattern[currentLevel]) {
        console.log("success");

        if (userClickedPattern.length == gamePattern.length) {
            setTimeout(function () {
                nextSequence();
            }, 1000);
        }
    } else {
        console.log("wrong");
        playSound("wrong");

        $("body").addClass("game-over");
        setTimeout(function () {
            $("body").removeClass("game-over");
        }, 1000);

        $("#level-title").text("Game Over, Press Any Key to Restart");
        resetValues();
    }
}


function resetValues() {
    started = false;
    level = 0;
    gamePattern = [];
}

function nextSequence() {

    level++;
    $("#level-title").text("Level " + level);

    userClickedPattern = [];

    var randomNumber = Math.floor(Math.random() * 4);
    var randomChosenColour = buttonColours[randomNumber];
    gamePattern.push(randomChosenColour);

    $("#" + randomChosenColour).fadeIn(100).fadeOut(100).fadeIn(100);

    playSound(randomChosenColour);
}

function playSound(name) {
    var audio = new Audio("sounds/" + name + ".mp3");
    audio.play();
}

function animatePress(currentColor) {
    $("#" + currentColor).addClass("pressed");
    setTimeout(function () {
        $("#" + currentColor).removeClass("pressed");
    }, 100);
}
