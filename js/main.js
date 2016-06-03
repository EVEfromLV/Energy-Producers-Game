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

var energyX = [210, 105, 340, 210, 520, 583, 659];
var energyY = [65, 235, 170, 425, 115, 418, 241];

var queue;
var preLoadText;
var gameIsRunning = false;

var totalEnergies = 10;


function preLoad(){
    stage = new createjs.Stage("WhackField");

    var preLoadBg = new createjs.Bitmap("img/preload_bg.jpg");
    stage.addChild(preLoadBg);

    preLoadText = new createjs.Text("0%", "40px Helvetica", "white");
    stage.addChild(preLoadText);
    preLoadText.x = stage.canvas.width-430;
    preLoadText.y = stage.canvas.height/1.8;

    queue = new createjs.LoadQueue(true);
    queue.on("progress", progressIs);
    queue.on("complete", showTitle);

    queue.loadManifest([
        "img/biofuel.svg",
        "img/coal.svg",
        "img/fuel.svg",
        "img/geothermal.svg",
        "img/hydro.svg",
        "img/naturalGas.svg",
        "img/nuclear.svg",
        "img/solar.svg",
        "img/wind.svg",
        "img/bg.jpg",
        "img/start_bg.jpg",
        "img/start_btn.png",
        "img/rules_btn.png",
        "img/preload_bg.jpg",
        "img/pdf.svg",
        "img/github.svg",
        "img/game_over.svg"
        // audio also goes in
    ])
}

function progressIs(e) {
    preLoadText.text = Math.round(e.progress*100) + "%";
    stage.update();
}

function showTitle(s) {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

    var gameBg = new createjs.Bitmap("img/bg.jpg");
    stage.addChild(gameBg);

    var titleBg = new createjs.Bitmap("img/start_bg.jpg");
    stage.addChild(titleBg);

    var startBtn = new createjs.Bitmap("img/start_btn.png");
    stage.addChild(startBtn);
    startBtn.x = stage.canvas.width/2.9;
    startBtn.y = stage.canvas.height/1.9;

    var rulesBtn = new createjs.Bitmap("img/rules_btn.png");
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
            var rulesView = new createjs.Bitmap("img/rules_bg.jpg");
            stage.addChild(rulesView);

            var backToStartBtn = new createjs.Bitmap("img/back_btn.png");
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

            var gitHubBtn = new createjs.Bitmap("img/github.svg");
            stage.addChild(gitHubBtn);
            gitHubBtn.x = 640;
            gitHubBtn.y = 520;

            gitHubBtn.addEventListener('click',
                function(){
                    window.open("https://github.com/EVEfromLV/Energy-Producers-Game");
                });

            var pdfBBtn = new createjs.Bitmap("img/pdf.svg");
            stage.addChild(pdfBBtn);
            pdfBBtn.x = 700;
            pdfBBtn.y = 520;

            pdfBBtn.addEventListener('click',
                function(p){
                    window.open("http://evecreative.net/exercises/whack-that-energy-report.pdf");
                });
        });

    startBtn.addEventListener('click',
        function(){
            stage.removeChild(this.target);
            stage.removeChild(titleView);

            gameIsRunning = true;
            showGame();
        });

    stage.update(s);
}

function showGame() {
    // first Energy appears ///////////
    scoreText = new createjs.Text('0' + '/' + totalEnergies + " energies", '20px Verdana', 'white');
    scoreText.x = scoreText.y = 20;
    stage.addChild(scoreText);
    showEnergy();
}

function showEnergy() {

    if (gameIsRunning === true) {

        gRand = generateRandomNumber(7);
        bRand = generateRandomNumber(7);

        if (gRand === bRand) {
            showEnergy();
        }

        else {
            g = new createjs.Bitmap("img/wind.svg");
            g.x = energyX[gRand];
            g.y = energyY[gRand];
            if (gameIsRunning === true) {
                goodEnergy.push(g);
                stage.addChild(g);
            }
            g.addEventListener('click', function(e){
                score++;
                lostClick();
                clearTimeout(timeOut);
                stage.update();
            });

            b = new createjs.Bitmap("img/coal.svg");
            if (gameIsRunning === true) {
                badEnergy.push(b);
                stage.addChild(b);
            }
            stage.addChild(b);
            b.x = energyX[bRand];
            b.y = energyY[bRand];
            b.addEventListener('click', function(energyHit){
                lostClick();
                clearTimeout(timeOut);
                stage.update();
            });

            timeOut = setTimeout( function () {
                lostClick();
            }, 2000);
        }

        if (clicks === 1){
            gameEnded();
        }

    } else {
        return;
    }
}

function generateRandomNumber(max) {
    return Math.floor(Math.random() * max);
}

function lostClick() {
    clicks--;
    scoreText.text=score + '/' + totalEnergies + " energies";
    if (clicks !== 0) {
        stage.removeChild(g, b);
    }
    showEnergy();
}

function gameEnded() {
    gameIsRunning = false;

    ///////////////////// remember to change back "to >5" ///////////////
    if (score > 2) {
        clearTimeout(timeOut);
        stage.removeChild(b);
        stage.removeChild(g);
        stage.removeChild(gameOver);
        stage.removeChild(tryAgain);

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

        reward = new createjs.Bitmap("img/next_level_bg.svg");
        reward.width = 800;
        reward.height = 365;
        reward.x = stage.canvas.width / 2 - reward.width / 2;
        reward.y = stage.canvas.height / 2 - reward.height / 2 - 60;
        stage.addChild(reward);

        nextLevelBtn = new createjs.Bitmap("img/next_level.png");
        nextLevelBtn.x = stage.canvas.width / 2 - 270;
        nextLevelBtn.y = stage.canvas.height / 2 + 140;
        stage.addChild(nextLevelBtn);
        nextLevelBtn.addEventListener('click', function (e) {
            console.log("Next Level starts");
        });

        gotReward = true;

    } else {
        overlay = new createjs.Shape();
        overlay.graphics.beginFill('black').drawRect(0, 0, 800, 300);
        overlay.width = 800;
        overlay.height = 300;
        overlay.alpha = 0.4;
        overlay.x = stage.canvas.width / 2 - overlay.width / 2;
        overlay.y = stage.canvas.height / 2 - overlay.height / 2;
        stage.addChild(overlay);
        b.removeEventListener();
        g.removeEventListener();

        tryAgain = new createjs.Bitmap("img/try_again.svg");
        tryAgain.x = stage.canvas.width / 2 - 90;
        tryAgain.y = stage.canvas.height / 2 + 10;
        stage.addChild(tryAgain);
        tryAgain.addEventListener('click', function (e) {
            stage.removeChild(overlay);
            stage.removeChild(gameOver);
            stage.removeChild(tryAgain);
            gameReset();
        });

        gameOver = new createjs.Bitmap("img/game_over.svg");
        gameOver.x = 90;
        gameOver.y = 220;
        stage.addChild(gameOver);

        gotReward = false;
    }
}

function gameReset() {
    gameIsRunning = true;
    globalTimer = 1200;
    score = 0;
    clicks = 10;
    scoreText.x = scoreText.y = 20;
    goodEnergy = [];
    badEnergy = [];
    clearTimeout(timeOut);
    stage.removeChild(b);
    stage.removeChild(g);
    stage.removeChild(overlay);
    stage.removeChild(gameOver);
    stage.removeChild(tryAgain);
    if (gotReward === true) {
        stage.removeChild(reward);
    }

    showEnergy();
}

function tock(e) {
    stage.update(e);

    if (gameIsRunning) {
        globalTimer--;

        if (globalTimer === 0) {
            gameEnded();
        }
    }
}