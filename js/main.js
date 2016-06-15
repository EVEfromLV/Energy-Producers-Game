/*
 * Created by IevaSilina on 30/05/16.
 */

var stage;
var score;
score = 0;
var g,b;
var overlay;
var gameOver;
var tryAgain;
var nextLevelBtn;
var timeOut;
var reward;
var globalTimer = 1200;
var gotReward;
var clicks  = 10;
var scoreText;
var goodEnergy = [];
var badEnergy = [];

var currentLevel = 1;

var levels = [
    {
        clicks: 10,
        globalTimer: 10,
        requiredClicks: 8,
        timeToClick: 2000,
        good:'wind2',
        bad:'coal2',
        nextLevel:'second_level_bg'
    }, {
        clicks: 10,
        globalTimer: 15,
        requiredClicks: 9,
        timeToClick: 2000,
        good:'geothermal2',
        bad:'',
        nextLevel:'third_level_bg'
    }, {
        clicks: 10,
        globalTimer: 20,
        requiredClicks: 8,
        timeToClick: 2000,
        good:'biofuel2',
        bad:'nuclear2',
        nextLevel:'fourth_level_bg'
    }, {
        clicks: 10,
        globalTimer: 25,
        requiredClicks: 8,
        timeToClick: 2000,
        good:'hydro2',
        bad:'',
        nextLevel:'fifth_level_bg'
    }, {
        clicks: 10,
        globalTimer: 30,
        requiredClicks:9,
        timeToClick: 2000,
        good:'naturalGas2',
        bad:'fuel2',
        nextLevel:'sixth_level_bg'
    }, {
        clicks: 10,
        globalTimer: 45,
        requiredClicks: 9,
        timeToClick: 2000,
        good:'solar2',
        bad:'',
        nextLevel:''
    }
];

var energyX = [199, 94, 331, 198, 509, 572, 648];
var energyY = [58, 225, 162, 415, 106, 412, 235];

var queue;
var preLoadText;
var gameIsRunning = false;

var totalEnergies = 10;

overlay = new createjs.Shape();
overlay.graphics.beginFill('black').drawRect(0, 0, 800, 300);
overlay.width = 800;
overlay.height = 300;
overlay.alpha = 0.4;

function convertTimeToSeconds(time) {
    return time*60;
}

function preLoad(){
    stage = new createjs.Stage("WhackField");

    var preLoadBg = new createjs.Bitmap("img/preload_bg.jpg");
    stage.addChild(preLoadBg);

    preLoadText = new createjs.Text("0%", "40px Helvetica", "white");
    stage.addChild(preLoadText);
    preLoadText.x = stage.canvas.width-430;
    preLoadText.y = stage.canvas.height/1.8;

    queue = new createjs.LoadQueue(true);
    queue.installPlugin(createjs.Sound);
    queue.on("progress", progressIs);
    queue.on("complete", showTitle);

    queue.loadManifest([
        "img/biofuel2.svg",
        "img/coal2.svg",
        "img/fuel2.svg",
        "img/geothermal2.svg",
        "img/hydro2.svg",
        "img/naturalGas2.svg",
        "img/nuclear2.svg",
        "img/solar2.svg",
        "img/wind2.svg",
        "img/bg.jpg",
        "img/start_bg.jpg",
        "img/start_btn.png",
        "img/rules_btn.png",
        "img/rules_bg.jpg",
        "img/back_btn.png",
        "img/preload_bg.jpg",
        "img/pdf.svg",
        "img/github.svg",
        "img/game_over.svg",
        "img/try_again.svg",
        "img/next_level.png",
        "img/second_level_bg.svg",
        "img/third_level_bg.svg",
        "img/fourth_level_bg.svg",
        "img/fifth_level_bg.svg",
        "img/sixth_level_bg.svg",
        "img/final_level_bg.svg",
        "img/bulb.svg",
        "img/final_bg.jpg",
        "img/final_text.svg",

        {id: "goodHit", src:"sound/switch.mp3"},
        {id: "badHit", src:"sound/breaking.mp3"},
        {id: "playGameOver", src:"sound/game_over.mp3"},
        {id: "playGameWon", src:"sound/level_won1.mp3"},
        {id: "gameWon", src:"sound/game_won2.mp3"},
        {id: "electricity", src:"sound/electric_lights.mp3"}
    ])
}

function progressIs(e) {
    preLoadText.text = Math.round(e.progress*100) + "%";
    stage.update();
}

function blinking(object, times){
    createjs.Tween.get(object).to({alpha: 0.3}, 100, createjs.Ease.sineInOut).to({
        alpha: 0.8}, 100, createjs.Ease.sineInOut).to({
        alpha: 0.1}, 100, createjs.Ease.sineInOut).to({
        alpha: 0.9}, 200, createjs.Ease.sineInOut).to({
        alpha: 0.1}, 200, createjs.Ease.sineInOut).to({
        alpha: 0.9}, 100, createjs.Ease.sineInOut).to({
        alpha: 0.7}, 100, createjs.Ease.sineInOut).to({
        alpha: 1}, 100, createjs.Ease.sineInOut).call(function(){
            times--;
            if(times >= 0){
                blinking(object, times)
            }
        });
}

function showTitle(s) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

    var electricity = createjs.Sound.play("electricity");
    electricity.setVolume(0.8);

    var gameBg = new createjs.Bitmap(queue.getResult("img/bg.jpg"));
    stage.addChild(gameBg);

    var preLoadBg = new createjs.Bitmap("img/preload_bg.jpg");
    stage.addChild(preLoadBg);

    var titleBg = new createjs.Bitmap(queue.getResult("img/start_bg.jpg"));
    stage.addChild(titleBg);
    blinking (titleBg, 2);

    var startBtn = new createjs.Bitmap(queue.getResult("img/start_btn.png"));
    stage.addChild(startBtn);
    startBtn.x = stage.canvas.width/2.9;
    startBtn.y = stage.canvas.height/1.9;

    var rulesBtn = new createjs.Bitmap(queue.getResult("img/rules_btn.png"));
    stage.addChild(rulesBtn);
    rulesBtn.x = stage.canvas.width/2.15;
    rulesBtn.y = stage.canvas.height/1.45;

    var titleView = new createjs.Container();
    titleView.addChild(titleBg, startBtn, rulesBtn);
    stage.addChild(titleView);

    rulesBtn.addEventListener('click',
        function(r){
            stage.removeChild(r.target);
            stage.removeChild(rulesBtn);
            var rulesView = new createjs.Bitmap(queue.getResult("img/rules_bg.jpg"));
            stage.addChild(rulesView);

            var backToStartBtn = new createjs.Bitmap(queue.getResult("img/back_btn.png"));
            stage.addChild(backToStartBtn);
            backToStartBtn.x = stage.canvas.width - 145;
            backToStartBtn.y = stage.canvas.height - 300;

            backToStartBtn.addEventListener('click',
                function(b){
                    stage.removeChild(b.target);
                    stage.removeChild(gitHubBtn);
                    stage.removeChild(pdfBBtn);
                    stage.removeChild(rulesView);
                });

            var gitHubBtn = new createjs.Bitmap(queue.getResult("img/github.svg"));
            stage.addChild(gitHubBtn);
            gitHubBtn.x = 640;
            gitHubBtn.y = 520;

            gitHubBtn.addEventListener('click',
                function(){
                    window.open("https://github.com/EVEfromLV/Energy-Producers-Game");
                });

            var pdfBBtn = new createjs.Bitmap(queue.getResult("img/pdf.svg"));
            stage.addChild(pdfBBtn);
            pdfBBtn.x = 700;
            pdfBBtn.y = 520;

            pdfBBtn.addEventListener('click',
                function(){
                    window.open("http://evecreative.net/exercises/whack-that-energy-report.pdf");
                });
        });

    startBtn.addEventListener('click',
        function(){
            stage.removeChild(preLoadBg);
            stage.removeChild(this.target);
            stage.removeChild(titleView);

            gameIsRunning = true;
            showGame();
        });

    stage.update(s);
}

function showGame() {
    if(levels[currentLevel-1].good){
        goodEnergy.push(levels[currentLevel-1].good);
    }
    if(levels[currentLevel-1].bad){
        badEnergy.push(levels[currentLevel-1].bad);
    }
    globalTimer = convertTimeToSeconds(levels[currentLevel - 1].globalTimer);
    clicks = levels[currentLevel - 1].clicks;
    console.log(globalTimer);
    console.log(clicks);

    scoreText = new createjs.Text('0' + '/' + totalEnergies + " energies", '20px Verdana', 'white');
    scoreText.x = scoreText.y = 20;
    stage.addChild(scoreText);
    showEnergy();
}

function showEnergy() {

    console.log("current level " + currentLevel);
    console.log("currentLevel clicks " + clicks);
    console.log("currentLevel globalTimer " + globalTimer);

    clearInterval(timeOut);

    if (gameIsRunning === true) {

        var gRand = generateRandomNumber(7);
        var bRand = generateRandomNumber(7);

        if (gRand === bRand) {
            showEnergy();
        }

        else {
            var r = Math.floor(Math.random()*goodEnergy.length);
            g = new createjs.Bitmap("img/"+goodEnergy[r]+".svg");
            g.x = energyX[gRand];
            g.y = energyY[gRand];
            if (gameIsRunning === true) {
                stage.addChild(g);
            }
            g.addEventListener('click', function(){
                var goodHit = createjs.Sound.play("goodHit");
                goodHit.setVolume(0.8);

                score++;
                lostClick();
                stage.update();
            });

            r = Math.floor(Math.random()*badEnergy.length);
            b = new createjs.Bitmap("img/"+badEnergy[r]+".svg");
            if (gameIsRunning === true) {
                stage.addChild(b);
            }
            stage.addChild(b);
            b.x = energyX[bRand];
            b.y = energyY[bRand];
            b.addEventListener('click', function(){
                var badHit =  createjs.Sound.play("badHit");
                badHit.setVolume(0.3);

                lostClick();
                stage.update();
            });

            timeOut = setInterval( function () {
                lostClick();
            }, 2000);
        }

    }
}

function generateRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function lostClick() {
    clicks--;
    if (clicks === 0) {
        stage.removeChild(gameOver);
        stage.removeChild(tryAgain);
        stage.removeChild(overlay);

        gameEnded();
    } else {
        scoreText.text = score + '/' + totalEnergies + " energies";
        if (clicks !== 0) {
            stage.removeChild(g, b);
        }
        showEnergy();
    }
}

function gameEnded() {
    gameIsRunning = false;

    if (score > levels[currentLevel - 1].requiredClicks) {

        levelWon();

    } else {
        levelLost();
    }
}

function levelWon() {

    if (currentLevel === 6) {
        reachedFinalLevel();
    }

    else {
        clearInterval(timeOut);
        stage.removeChild(b,g);
        stage.removeChild(gameOver);
        stage.removeChild(tryAgain);

        var playGameWon = createjs.Sound.play("playGameWon");
        playGameWon.setVolume(0.5);

        overlay = new createjs.Shape();
        overlay.graphics.beginFill('black').drawRect(0, 0, 800, 500);
        overlay.width = 800;
        overlay.height = 500;
        overlay.alpha = 0.4;
        overlay.x = stage.canvas.width / 2 - overlay.width / 2;
        overlay.y = stage.canvas.height / 2 - overlay.height / 2 + 10;
        stage.addChild(overlay);
        b.removeEventListener();
        g.removeEventListener();

        reward = new createjs.Bitmap("img/"+levels[currentLevel-1].nextLevel+".svg");
        reward.width = 800;
        reward.height = 365;
        reward.x = stage.canvas.width / 2 - reward.width / 2;
        reward.y = stage.canvas.height / 2 - reward.height / 2 - 60;
        stage.addChild(reward);

        nextLevelBtn = new createjs.Bitmap(queue.getResult("img/next_level.png"));
        nextLevelBtn.x = stage.canvas.width / 2 - 270;
        nextLevelBtn.y = stage.canvas.height / 2 + 140;
        stage.addChild(nextLevelBtn);
        nextLevelBtn.addEventListener('click', function () {
            playGameWon.stop();
            currentLevel++;
            console.log("nextLevel btn clicked");
            stage.removeChild(reward, nextLevelBtn, scoreText);
            scoreText = new createjs.Text('0' + '/' + totalEnergies + " energies", '20px Verdana', 'white');
            scoreText.x = scoreText.y = 20;
            stage.addChild(scoreText);
            stage.removeChild(g);
            stage.removeChild(b);
            gameReset();
        });

        gotReward = true;
    }
}

function levelLost() {
    var playGameOver = createjs.Sound.play("playGameOver");
    playGameOver.setVolume(0.5);

    overlay = new createjs.Shape();
    overlay.graphics.beginFill('black').drawRect(0, 0, 800, 300);
    overlay.width = 800;
    overlay.height = 300;
    overlay.alpha = 0.4;
    overlay.x = stage.canvas.width / 2 - overlay.width / 2;
    overlay.y = stage.canvas.height / 2 - overlay.height / 2;
    stage.addChild(overlay);
    stage.removeChild(g);
    stage.removeChild(b);
    b.removeEventListener();
    g.removeEventListener();

    gameOver = new createjs.Bitmap("img/game_over.svg");
    gameOver.x = 90;
    gameOver.y = 220;
    stage.addChild(gameOver);

    tryAgain = new createjs.Bitmap("img/try_again.svg");
    tryAgain.x = stage.canvas.width / 2 - 90;
    tryAgain.y = stage.canvas.height / 2 + 10;
    stage.addChild(tryAgain);
    tryAgain.addEventListener('click', function () {
        playGameOver.stop();
        stage.removeChild(overlay);
        stage.removeChild(gameOver);
        stage.removeChild(tryAgain);
        gameReset();
    });

    gotReward = false;
}

function reachedFinalLevel() {
    var gameWon = createjs.Sound.play("gameWon");
    gameWon.setVolume(0.5);

    console.log("Reached final level");
    stage.removeChild(overlay);
    stage.removeChild(gameOver);
    stage.removeChild(tryAgain);
    stage.removeChild(scoreText);
    stage.removeChild(g);
    stage.removeChild(b);

    var finalBg = new createjs.Bitmap(queue.getResult("img/final_bg.jpg"));
    stage.addChild(finalBg);

    var finalObject = new createjs.Bitmap("img/bulb.svg");
    finalObject.width = 393;
    finalObject.height = 520;
    finalObject.regX = finalObject.width/2;
    finalObject.regY = finalObject.height/2;
    finalObject.x = stage.canvas.width/2;
    finalObject.y = stage.canvas.height/2;
    stage.addChild(finalObject);

    blinking (finalObject, 1);

    var smallOverlay = new createjs.Shape();
    smallOverlay.alpha = 0;
    smallOverlay.graphics.beginFill('black').drawRect(0, 0, 800, 100);
    smallOverlay.y = 400;
    stage.addChild(smallOverlay);

    var finalText = new createjs.Bitmap("img/final_text.svg");
    finalText.alpha = 0;
    finalText.width = 526;
    finalText.regX = finalText.width/2;
    finalText.x = stage.canvas.width/2;
    finalText.y = 405;
    stage.addChild(finalText);

    new createjs.Tween.get(smallOverlay).wait(3000).to({alpha:0.4}, 2000);
    new createjs.Tween.get(finalText).wait(3000).to({alpha:1}, 2000);
}

function gameReset() {

    console.log("gameReset ran");

    globalTimer = convertTimeToSeconds(levels[currentLevel - 1].globalTimer);
    clicks = levels[currentLevel - 1].clicks;
    score = 0;
    scoreText.x = scoreText.y = 20;

    console.log(goodEnergy, badEnergy);
    clearInterval(timeOut);
    stage.removeChild(overlay);
    stage.removeChild(gameOver);
    stage.removeChild(tryAgain);
    if (gotReward === true) {
        if(levels[currentLevel-1].good){
            goodEnergy.push(levels[currentLevel-1].good);
        }

        if(levels[currentLevel-1].bad){
            badEnergy.push(levels[currentLevel-1].bad);
        }
        stage.removeChild(reward);

    }

    gameIsRunning = true;
    showEnergy();
}

function tock(e) {
    stage.update(e);

    if (gameIsRunning) {
        globalTimer--;

        if (globalTimer === 0) {
            stage.removeChild(overlay);
            stage.removeChild(gameOver);
            stage.removeChild(tryAgain);
            gameEnded();
        }
    }
}