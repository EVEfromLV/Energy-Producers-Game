/**
 * Created by IevaSilina on 30/05/16.
 */
var stage;
var titleBg;
var playBtn;
var rulesBtn;
var titleView = new Container();
var rulesView;
var gameBg;
var alertBg;
var score;
var energy = [biofuel.svg, coal.svg, fuel.svg, geothermal.svg, hydro.svg, naturalGas.svg, nuclear.svg, solar.svg, wind.svg];
var lastEnergy;

var energyX = [80, 198, 338, 70, 225, 376, 142, 356];
var energyY = [11, 51, 34, 110, 136, 96, 211, 186];

var queue;
var preLoadText;
var gameIsRunning = false;


function preLoad(){
    stage = new createjs.Stage("WhackField");

    preLoadText = new createjs.Text("0%", "40px Helvetica", "brown");
    stage.addChild(preLoadText);
    preLoadText.x = stage.canvas.width-490;
    preLoadText.y = stage.canvas.height/3.1;

    queue = new createjs.LoadQueue(true);
    queue.on("progress", progressIs);
    queue.on("complete", startGame);

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
        "img/rules_btn.png"
        // audio also goes in
    ])
}

function progressIs(e) {
    preLoadText.text = Math.round(e.progress*100) + "%";
    stage.update();
}

function startGame() {
    createjs.Ticker.setFPS(60);
    createjs.Ticker.addEventListener("tick", tock);

    gameBg = createjs.Bitmap("img/bg.jpg");
    stage.addChild(gameBg);

    var startBtn = new createjs.Bitmap("img/start_btn.png");
    stage.addChild(startBtn);

    startBtn.addEventListener('click',
        function(e){
            stage.removeChild(e.target);
            stage.removeChild(preLoadText);
            gameIsRunning = true;
        });
}

function tock (e) {
    if(gameIsRunning===true){
    }
    stage.update(e);
}