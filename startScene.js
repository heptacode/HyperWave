var startScene = new Scene();


// ["monsterType"(String), monsterMax(int), spawnDelay(int), firstDelay(int)];
var waveInfo =
[
    ["TrackingEnemy", 1, 1, 0],
    ["TrackingEnemy", 2, 1, 0, "TrackingEnemy", 2, 1, 0.5],
    ["ShootingEnemy", 3, 1, 0, "ShootingEnemy", 3, 1, 0.5]
];


// spawnMonster 관리
class GameController
{
    constructor()
    {
        this.wave = 0;
        this.startWave = false;
        this.canStartWave = true;

        this.restLTime = Date.now();
        this.restRTime = 0;
        this.restTime = 5;
        this.startRest = false;
        this.monsterMakers = 
        [
            new monsterMaker(200, 200), new monsterMaker(700, 700)
        ];
        this.information = {wave : nowScene.addText(new GameText(150, 30, 30, "Arial", "wave : " + this.wave))};
        this.information.wave.isFixed = true;
    }
    // waveStart(현재 웨이브)
    waveStart(_wave)
    {
        let num = 0;
        for(let i = 0; i < waveInfo[_wave - 1].length; i += 4)
        {
            if(waveInfo[_wave - 1][i] != "")
            {
                this.monsterMakers[num].setWaveStart(waveInfo[_wave - 1][i], waveInfo[_wave - 1][i + 1], waveInfo[_wave - 1][i + 2], waveInfo[_wave - 1][i + 3]);
                this.monsterMakers[num].startSpawn = true;
            }
            num++;
        }
    }
    // 필드에 남아있는 몬스터가 있음 -> true
    areThereAnyMonsters()
    {
        return (nowScene.enemyList.length != 0)
    }
    // monsterMaker가 spawn을 멈춤(spawnCount >= spawnMax) -> true
    areMonsterMakersStop()
    {
        let num = 0;
        for(let i = 0; i < this.monsterMakers.length; i++)
        {
            if(this.monsterMakers[i].spawnCount >= this.monsterMakers[i].spawnMax)
            {
                num++;
            }
        }
        return (num == this.monsterMakers.length);
    }
    // restTime만큼 기다림
    restStart()
    {
        if(this.restLTime >= this.restRTime)
        {
            this.canStartWave = true;
            this.startRest = false;
        }
    }
    // player가 죽거나 마지막 웨이브가 끝나면 실행 // 작업중
    endGame()
    {

        nowScene.sceneImageList.length = 0;
        nowScene.collisionList.length = 0;
        nowScene.moveList.length = 0;
        nowScene.playerAndEnemyList.length = 0;
        nowScene.enemyList.length = 0;
        nowScene.updateList.length = 0;
        nowScene.effectList.length = 0;
        nowScene.makerList.length = 0;
        gameoverScene.start();
    }
    showInformation()
    {
        this.information.wave.text = "wave : " + this.wave;
    }
    update()
    {
        this.restLTime = Date.now();
        this.showInformation();
        if(this.canStartWave == true) // 웨이브를 시작 가능하면 한 번 실행
        {
            this.canStartWave = false;
            this.startWave = true;
            this.wave++;
            this.waveStart(this.wave);
        }
        if(this.startWave == true) // 웨이브 실행 중
        {
            if(this.areMonsterMakersStop() == true && this.areThereAnyMonsters() == false)
            {
                // 초기화 및 rest 시작
                for(let i = 0; i < this.monsterMakers.length; i++)
                {
                    this.monsterMakers[i].startSpawn = false;
                    this.monsterMakers[i].spawnCount = 0;
                }
                this.startRest = true;
                this.startWave = false;
                this.restRTime = this.restLTime + this.restTime * 1000;
            }
        }
        if(this.startRest == true) // rest 실행 중
        {
            this.restStart();
        }
        if(nowScene.player.isDelete == true || this.wave > waveInfo.length)
        {
            this.endGame();
        }
    }
}

var serverAddr = "https://sunrin.hyunwoo.org/dicon/";

startScene.init = function()
{
    preloadImage( "image/player/player.png",  "image/player/playerHand.png", 
                 "image/weapon/sword.png",  "image/effect/swordEffect.png", 
                 "image/weapon/spear.png", 
                 "image/player/sample/Warrior.png",  "image/player/sample/Lancer.png",  
                 "image/enemy/trackingEnemy.png", 
                 "image/enemy/shootingEnemy.png",  "image/effect/enemyBullet1.png",
                 "image/EnemyHpBarIn.png", 
                 "image/cursor.png", 
                 "image/hpBarOut.png",  "image/PlayerHpBarIn.png",
                 "image/tablet.png",  "image/tabletSample.png",
                 "image/button/leftArrow.png",  "image/button/rightArrow.png");

    this.cam = new Camera();
    this.cursor = nowScene.addImage(new MousePoint( "image/cursor.png", mouseX, mouseY));
    
    this.admitButton = nowScene.addImage(new Button( "image/tabletSample.png", canvas.width / 2, canvas.height));
    this.admitButton.clickEventSet(function()
    {
        this.update = () =>
        {
            this.pos.y -= (canvas.height - this.image.height) / 200;
            this.scale.x += 1 / 200;
            this.scale.y += 1 / 200;
            if((this.pos.y < canvas.height / 2 - this.image.height / 2) || mouseValue["Left"] == 1)
            {
                readyScene.start();
            }
        }
    });
    nowScene.updateList.push(this.admitButton);

}
startScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
}
startScene.start();