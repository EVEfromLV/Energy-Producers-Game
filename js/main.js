/*
 * Created by IevaSilina on 30/05/16.
 */
var stage;
var alertBg;
var score;
score = 0;
var scoreText;
var goodEnergy = [];
var badEnergy = [];
var lastEnergy;

var energyX = [80, 198, 338, 70, 225, 376, 142, 356];
var energyY = [11, 51, 34, 110, 136, 96, 211, 186];

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

    if (currentEnergies === totalEnergies){
        showSummary();
    } //else {
       // if (lastEnergy !== null) {
       //     lastEnergy.onClick = null;
       //     stage.removeChild(lastEnergy);
       //     lastEnergy = null;
       //     stage.update();
       // }
    //}

    var randomPos = Math.floor(Math.random() * 8);
    var g = new createjs.Bitmap("img/wind.svg");
    g.x = energyX[randomPos];
    g.y = energyY[randomPos];
    goodEnergy.push(g);
    stage.addChild(g);
    g.addEventListener('click', function(e){
        console.log('good');
        score++;
        scoreText.text=score + '/' + totalEnergies + " energies";
        stage.removeChild(g);
        lastEnergy = null;
        stage.update();
    });

    randomPos = Math.floor(Math.random() * 8);
    b = new createjs.Bitmap("img/coal.svg");
    badEnergy.push(b);
    stage.addChild(b);
    b.x = energyX[randomPos];
    b.y = energyY[randomPos];
    b.addEventListener('click', function(energyHit){
        console.log('bad');
        score--;
        scoreText.text=score + '/' + totalEnergies + " energies";
        stage.removeChild(b);
        lastEnergy = null;
        stage.update();
    });

 //   lastEnergy = energy;
//    lastEnergy.scaleY = 0.3;
//    lastEnergy.y +=42;
//    stage.update();
}

function tock(e) {
    stage.update(e);
}