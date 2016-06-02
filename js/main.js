/*
 * Created by IevaSilina on 30/05/16.
 */

var stage;
var alertBg;
var score;
score = 0;
var g,b;
var overlay;
var tryAgain;
var clicks  = 10;
var scoreText;
var goodEnergy = [];
var badEnergy = [];
var lastEnergy;

var energyX = [210, 105, 340, 210, 520, 583, 659];
var energyY = [65, 235, 170, 425, 115, 418, 241];

var queue;
var preLoadText;
var gameIsRunning = false;

var timerSource;
var currentEnergies = 0;
var energiesHit = 0;
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
        "img/preload_bg.jpg"
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
                    stage.removeChild(rulesView);
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

        console.log(clicks);

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

            var timeOut = setTimeout( function () {
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
    overlay = new createjs.Shape();
    overlay.graphics.beginFill('#424242').drawRect(0, 0, 200, 200);
    overlay.width = 200;
    overlay.height = 200;
    overlay.alpha = 0.5;
    overlay.x = stage.canvas.width / 2 - overlay.width / 2;
    overlay.y = stage.canvas.height / 2 - overlay.height / 2;
    stage.addChild(overlay);
    b.removeEventListener();
    g.removeEventListener();

//text "Game Over"
    scoreText.regX = 0.5;
    scoreText.regY = 0.5;
    scoreText.x = stage.canvas.width / 2 - 70;
    scoreText.y = stage.canvas.height / 2;

    tryAgain = new createjs.Bitmap("img/try_again.svg");
    stage.addChild(tryAgain);
    tryAgain.addEventListener('click', function (e) {
        gameReset();
    });
}

function gameReset() {
    gameIsRunning = true;
    score = 0;
    clicks = 10;
    scoreText.x = scoreText.y = 20;
    goodEnergy = [];
    badEnergy = [];
    stage.removeChild(b);
    stage.removeChild(g);
    stage.removeChild(overlay);
    stage.removeChild(tryAgain);

    showEnergy();
}

function tock(e) {
    stage.update(e);
}