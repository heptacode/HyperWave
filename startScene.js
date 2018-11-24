var startScene = new Scene();


// ["monsterType"(String), monsterMax(int), spawnDelay(int), firstDelay(int)];
var waveInfo =
[
    ["TrackingEnemy", 1, 0.5, 0],
    ["TrackingEnemy", 2, 1, 0, "TrackingEnemy", 2, 1, 0.5],
    ["TrackingEnemy", 3, 1, 0, "ShootingEnemy", 3, 1, 0.5],
    ["ShootingEnemy", 3, 1, 0, "ShootingEnemy", 3, 1, 0.5],
    ["HyunWoo", 1, 0, 0]
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
        this.information = {wave : nowScene.addThing(new GameText(75, 30, 30, "Arial", "wave : " + this.wave))};
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
    endGame(_ending)
    {
        if(_ending == "clear")
        {
            nowScene.sceneThingList.length = 0;
            gameoverScene.start();
        }
        else if(_ending == "fail")
        {
            nowScene.sceneThingList.length = 0;
            gameoverScene.start();
        }
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
        if(nowScene.player.isDelete == false && this.wave == waveInfo.length && this.areMonsterMakersStop() == true && this.areThereAnyMonsters() == false)
        {
            this.endGame("clear");
        }
        else if(nowScene.player.isDelete == true && this.wave < waveInfo.length && nowScene.enemyList.length != 0)
        {
            this.endGame("fail")
        }
    }
    // readyScene에서 선택한 정보를 옮겨줌 // 작업중
    static sendInfo(_type, _info)
    {
        for(let i = 0; i < arguments.length; i++)
        {
            switch(arguments[i])
            {
                case "player" : 
                    switch(arguments[++i])
                    {
                        case "job" : gameScene.selectedInfo.player.job = arguments[++i]; break;
                        case "skill" : 
                            switch(arguments[++i])
                            {
                                case "passive" : gameScene.selectedInfo.player.skill.passive.push(arguments[++i]); break;
                                case "active" : gameScene.selectedInfo.player.skill.active.push(arguments[++i]); 
                                                gameScene.selectedInfo.player.skill.active.push(arguments[++i]);break;
                            }
                    } break;
            }
        }
    }
}

var serverAddr = "https://sunrin.hyunwoo.org/dicon/"; // 서버 제작중

startScene.init = function()
{
    preloadImage( "image/player/player.png",  "image/player/playerHand.png", 
                 "image/weapon/sword.png",  "image/effect/swordEffect.png", 
                 "image/weapon/spear.png", 
                 "image/player/sample/player.png",  
                 "image/enemy/trackingEnemy.png", 
                 "image/enemy/shootingEnemy.png",  "image/effect/enemyBullet1.png",
                 "image/EnemyHpBarIn.png", 
                 "image/cursor.png", 
                 "image/hpBarOut.png",  "image/PlayerHpBarIn.png",
                 "image/tablet.png",  "image/tabletSample.png",
                 "image/button/leftArrow.png",  "image/button/rightArrow.png", "image/button/select.png", "image/button/start.png", "image/button/set.png",
                 "image/icon/notSelected.png", "image/icon/lock.png",  
                 "image/icon/warrior/passiveSkill/basicAttackDamageUp.png", "image/icon/warrior/passiveSkill/healthUp.png",
                 "image/icon/warrior/activeSkill/swiftStrike.png", "image/icon/warrior/activeSkill/swordShot.png",
                 "image/background/ingame.png");

    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint( "image/cursor.png", mouseX, mouseY, ));
    
    //this.background = nowScene.addThing(new GameImage("image/"))

    this.admitButton = nowScene.addThing(new Button("image/tabletSample.png", canvas.width / 2, canvas.height, 3));
    this.admitButton.pos.y += this.admitButton.image.height / 4;
    this.admitButton.moveSpeed = 0.4;
    this.admitButton.setClickEvent(function()
    {
        nowScene.admitButton.update = () =>
        {
            if(nowScene.admitButton.pos.y <= canvas.height / 2 - nowScene.admitButton.image.height / 2)
            {
                nowScene.admitButton.pos.y = canvas.height / 2 - nowScene.admitButton.image.height / 2;
                nowScene.admitButton.RTime = Date.now() + 1 * 1000;
                nowScene.cam.setFade(0, 0, 0, 1, 2);
                nowScene.admitButton.update = () =>
                {
                    if(Date.now() > nowScene.admitButton.RTime)
                    {
                        readyScene.start();
                    }
                    else
                    {
                        nowScene.admitButton.scale.x += 0.0038;
                        nowScene.admitButton.scale.y += 0.0038;
                    }
                }
            }
            else if(nowScene.admitButton.pos.y > canvas.height / 2 + nowScene.admitButton.image.height * 1 / 4)
            {
                nowScene.admitButton.pos.y -= (nowScene.admitButton.moveSpeed * 1.005);
                nowScene.admitButton.moveSpeed += 0.08;
            }
            else
            {
                nowScene.admitButton.pos.y -= (nowScene.admitButton.moveSpeed * 1.0023);
                nowScene.admitButton.moveSpeed -= 0.02;
            }
        }
    });
    nowScene.updateList.push(this.admitButton);
}
startScene.update = function()
{
    this.updateList.forEach(obj => obj.update());
    this.cam.update();
}
startScene.start();