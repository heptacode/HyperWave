var startScene = new Scene();


// ["monsterType"(String), monsterMax(int), spawnDelay(int), firstDelay(int)];
var waveInfo =
[
    ["TrackingEnemy", 1, 0, 0],
    ["TrackingEnemy", 2, 1, 0, "TrackingEnemy", 2, 1, 0.5],
    ["TrackingEnemy", 3, 1, 0, "ShootingEnemy", 3, 1, 0.5],
    ["ShootingEnemy", 3, 1, 0, "ShootingEnemy", 3, 1, 0.5],
    ["Cube", 1, 0, 0],
    ["TraclingEnemy", 4, 2, 0, "TrackingEnemy", 4, 2, 1],
    ["ShootingEnemy", 4, 2, 0, "ShootingEnemy", 4, 2, 1],
    ["TrackingEnemy", 5, 2, 0, "ShootingEnemy", 5, 2, 1],
    ["TrackingEnemy", 10, 2, 0, "ShootingEnemy", 10, 2, 1],
    ["Cube", 1, 0, 0]
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
            new monsterMaker(nowScene.background.pos.x + 350, nowScene.background.pos.y + 930), new monsterMaker(nowScene.background.pos.x + nowScene.background.image.width - 400, nowScene.background.pos.y + 930),
            new monsterMaker(nowScene.background.pos.x + 350, nowScene.background.pos.y + 1800), new monsterMaker(nowScene.background.pos.x + nowScene.background.image.width - 400, nowScene.background.pos.y + 1800)
        ];
        this.information = {wave : nowScene.addThing(new GameText(75, 20, 30, "Nanum Squre", "wave : " + this.wave))};
        this.information.wave.pos.y += this.information.wave.size;
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
        let num1 = 0, num2 = 0;
        for(let i = 0; i < this.monsterMakers.length; i++)
        {
            if(this.monsterMakers[i].spawnCount >= this.monsterMakers[i].spawnMax && this.monsterMakers[i].startSpawn == true)
            {
                num1++;
            }
            if(this.monsterMakers[i].startSpawn == true)
            {
                num2++;
            }
        }
        return (num1 == num2);
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
            gameoverScene.clearFail = "clear!";
        }
        else if(_ending == "fail")
        {
            gameoverScene.clearFail = "fail...";
        }
        nowScene.sceneThingList.length = 0;
        gameoverScene.killCnt = [[nowScene.player.jobName, nowScene.player.killCnt]];
        gameoverScene.start();
    }
    isEnd()
    {
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
        if(this.startWave == true) // 웨이브 실행 중일 때
        {
            if(nowScene.player.isDelete == true)
            {
                this.endGame("fail");
            }
            else if(this.areMonsterMakersStop() == true && this.areThereAnyMonsters() == false)
            {
                // 초기화 및 rest 시작
                if(this.wave != waveInfo.length)
                {
                    for(let i = 0; i < this.monsterMakers.length; i++)
                    {
                        this.monsterMakers[i].startSpawn = false;
                        this.monsterMakers[i].spawnCount = 0;
                    }
                    this.startRest = true;
                    this.startWave = false;
                    this.restRTime = this.restLTime + this.restTime * 1000;
                }
                else
                {
                    this.endGame("clear");
                }
            }
        }
        if(this.startRest == true) // rest 실행 중일 떄
        {
            this.restStart();
        }
    }
    // readyScene에서 선택한 정보를 옮겨줌
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

var serverAddr = "https://hyperwave.hyunwoo.org"; // 서버 제작중

startScene.init = function()
{
    // preloadImage( serverAddr + "/image/player/player.png",  serverAddr + "/image/player/playerHand.png", 
    //              serverAddr + "/image/weapon/sword.png",  serverAddr + "/image/effect/swordEffect.png", 
    //              serverAddr + "/image/weapon/spear.png", 
    //              serverAddr + "/image/player/sample/player.png",  
    //              serverAddr + "/image/enemy/trackingEnemy.png", 
    //              serverAddr + "/image/enemy/shootingEnemy.png",  serverAddr + "/image/effect/enemyBullet1.png",
    //              serverAddr + "/image/boss/cube.png", 
    //              serverAddr + "/image/EnemyHpBarIn.png", 
    //              serverAddr + "/image/cursor.png", 
    //              serverAddr + "/image/hpBarOut.png",  serverAddr + "/image/PlayerHpBarIn.png",
    //              serverAddr + "/image/tablet.png",  serverAddr + "/image/tabletSample.png",
    //              serverAddr + "/image/button/leftArrow.png",  serverAddr + "/image/button/rightArrow.png", serverAddr + "/image/button/select.png", serverAddr + "/image/button/start.png", serverAddr + "/image/button/set.png", serverAddr + "/image/button/restart.png", 
    //              serverAddr + "/image/icon/notSelected.png", serverAddr + "/image/icon/lock.png", serverAddr + "/image/icon/cantSelect.png",  
    //              serverAddr + "/image/icon/warrior/passiveSkill/basicAttackDamageUp.png", serverAddr + "/image/icon/warrior/passiveSkill/healthUp.png",
    //              serverAddr + "/image/icon/warrior/activeSkill/swiftStrike.png", serverAddr + "/image/icon/warrior/activeSkill/swordShot.png",
    //              serverAddr + "/image/background/ingame.png", serverAddr + "/image/result.png", 
    //              serverAddr + "/image/fade/black.png", serverAddr + "/image/fade/white.png");

    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint( serverAddr + "/image/cursor.png", mouseX, mouseY, ));
    
    //this.background = nowScene.addThing(new GameImage(serverAddr + "/image/"))

    this.admitButton = nowScene.addThing(new Button(serverAddr + "/image/tabletSample.png", canvas.width / 2, canvas.height, 3));
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