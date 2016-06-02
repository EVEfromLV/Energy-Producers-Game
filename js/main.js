/*
 * Created by IevaSilina on 30/05/16.
 */
var stage;
var alertBg;
var score;
var energy = [];
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
            startGame();
        });

    stage.update(s);
}

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

}

function tock (e) {
    if(gameIsRunning===true){
        startGame();
    }
    stage.update(e);
}