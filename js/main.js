/*
 * Created by IevaSilina on 30/05/16.
 */
var stage;
var alertBg;
var score;
score = 0;
var clicks  = 15;
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

    // Is this necessary here?
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
    var lastG = g;
    var g,b;
    var randomPos = Math.floor(Math.random() * 7);
    g = new createjs.Bitmap("img/wind.svg");
    g.x = energyX[randomPos];
    g.y = energyY[randomPos];
    goodEnergy.push(g);
    stage.addChild(g);
    g.addEventListener('click', function(e){
        console.log('good');
        score++;
        clicks--;
        scoreText.text=score + '/' + totalEnergies + " energies";
        stage.removeChild(g, b);
        showEnergy();
        stage.update();
    });

    randomPos = Math.floor(Math.random() * 7);
    b = new createjs.Bitmap("img/coal.svg");
    badEnergy.push(b);
    stage.addChild(b);
    b.x = energyX[randomPos];
    b.y = energyY[randomPos];
    b.addEventListener('click', function(energyHit){
        console.log('bad');
        score--;
        clicks--;
        scoreText.text=score + '/' + totalEnergies + " energies";
        stage.removeChild(b, g);
        showEnergy();
        stage.update();
    });

    if (clicks === 0){
        showSummary();
    }
}

function tock(e) {

    stage.update(e);
}