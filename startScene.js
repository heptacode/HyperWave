var startScene = new Scene();

var waveInfo =
[
    [5, 0.5, 3, 1],
    [2, 5, 6]
];

class GameController
{
    constructor()
    {
        this.wave = 0;
        this.startWave = false;

        this.restLTime = Date.now();
        this.restRTime = 0;
        this.restTime = 0;
        this.startRest = true;
        this.monsterMakers = 
        [
            new monsterMaker(200, 200), new monsterMaker(700, 700)
        ];
    }
    waveStart(_wave)
    {
        let num = 0;
        for(let i = 0; i < waveInfo[_wave - 1].length; i += 2)
        {
            this.monsterMakers[num].setWaveStart(waveInfo[_wave - 1][i], waveInfo[_wave - 1][i + 1]);
            this.monsterMakers[num].startSpawn = true;
            num++;
        }
    }
    update()
    {
        if(this.startWave == false)
        {
            this.startWave = true;
            this.wave++;
            this.waveStart(this.wave);
        }
    }
}

startScene.init = function()
{
    preloadImage("player.png", "playerHand.png", "sword.png", "spear.png", "enemy1.png", "cursor.png");

    this.updateList = [];

    this.startButton = nowScene.addImage(new Button("playerHand.png", canvas.width / 2, canvas.height / 2));
    this.startButton.clickEventSet(function()
    {
        gameScene.start();
    })

    this.cursor = nowScene.addImage(new MousePoint("cursor.png", mouseX, mouseY));
    this.cam = new Camera();
}
startScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    this.startButton.update()
}
startScene.start();