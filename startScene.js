var startScene = new Scene();


// ["monsterType"(String), monsterMax(int), spawnDelay(int), firstDelay(int)];
var waveInfo =
[
    ["TrackingEnemy", 1, 0, 0, "TrackingEnemy", 1, 1, 0.5, "TrackingEnemy", 1, 1, 1, "TrackingEnemy", 1, 1, 1.5],
    ["TrackingEnemy", 2, 1, 0.5, "TrackingEnemy", 2, 1, 1, "TrackingEnemy", 2, 1, 1.5, "TrackingEnemy", 2, 1, 0],
    ["ShootingEnemy", 3, 1, 1, "ShootingEnemy", 3, 1, 1.5, "TrackingEnemy", 3, 1, 0, "TrackingEnemy", 3, 1, 0.5],
    ["TrackingEnemy", 3, 1, 1.5, "TrackingEnemy", 3, 1, 0, "ShootingEnemy", 3, 1, 0.5, "ShootingEnemy", 3, 1, 1],
    ["Cube", 1, 0, 0],
    ["TrackingEnemy", 5, 0.5, 0, "TrackingEnemy", 5, 0.5, 0.5, "TrackingEnemy", 5, 0.5, 1, "TrackingEnemy", 5, 0.5, 1.5],
    ["ShootingEnemy", 7, 0.5, 0.5, "ShootingEnemy", 7, 0.5, 1, "ShootingEnemy", 7, 0.5, 1.5, "ShootingEnemy", 7, 0.5, 0],
    ["ShootingEnemy", 8, 0.5, 1, "ShootingEnemy", 8, 0.5, 1.5, "TrackingEnemy", 8, 0.5, 0, "TrackingEnemy", 8, 0.5, 0.5],
    ["TrackingEnemy", 10, 0.5, 1.5, "TrackingEnemy", 10, 0.5, 0, "ShootingEnemy", 10, 0.5, 0.5, "ShootingEnemy", 10, 0.5, 1],
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

        this.restRTime = 0;
        this.restTime = 5;
        this.startRest = false;
        this.monsterMakers = 
        [
            new monsterMaker(nowScene.background.pos.x + 350, nowScene.background.pos.y + 930), new monsterMaker(nowScene.background.pos.x + nowScene.background.image.width - 400, nowScene.background.pos.y + 930),
            new monsterMaker(nowScene.background.pos.x + 350, nowScene.background.pos.y + 1800), new monsterMaker(nowScene.background.pos.x + nowScene.background.image.width - 400, nowScene.background.pos.y + 1800)
        ];
        this.information = {wave : nowScene.addThing(new GameText(75, 20, 30, "Nanum Squre Bold", "wave : " + this.wave))};
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
    // player 회복
    healPlayer()
    {
        nowScene.player.heal(nowScene.player.restHeal);
    }
    // restTime만큼 기다림
    restStart()
    {
        if(Date.now() >= this.restRTime)
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
                    this.healPlayer();
                    this.startRest = true;
                    this.startWave = false;
                    this.restRTime = Date.now() + this.restTime * 1000;
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

startScene.init = function()
{
    preloadImage("image/player/Warrior/player.png", "image/player/Warrior/sample.png", 
                 "image/player/Lancer/player.png", "image/player/Lancer/sample.png", 
                 "image/player/Summoner/player.png", "image/player/Summoner/sample.png", 
                 "image/player/playerHand.png", 
                 "image/weapon/sword.png", "image/effect/swordEffect.png", 
                 "image/weapon/spear.png", 
                 "image/weapon/shooter-body.png", "image/weapon/shooter-weapon.png", "image/weapon/basicBullet.png", 
                 "image/enemy/trackingEnemy.png", 
                 "image/enemy/shootingEnemy.png",  "image/effect/enemyBullet1.png",
                 "image/boss/cube.png", 
                 "image/EnemyHpBarIn.png", 
                 "image/cursor.png", 
                 "image/hpBarOut.png",  "image/PlayerHpBarIn.png",
                 "image/tablet.png",  "image/tabletSample.png", 
                 "image/basic.png", "image/level.png", 
                 "image/button/leftArrow.png",  "image/button/rightArrow.png", "image/button/select.png", "image/button/start.png", "image/button/set.png", "image/button/restart.png", 
                 "image/icon/notSelected.png", "image/icon/lock.png", "image/icon/cantSelect.png",  
                 "image/icon/Warrior/passiveSkill/attackDamageUp.png", "image/icon/Warrior/passiveSkill/healthUp.png", "image/icon/Warrior/passiveSkill/attackSpeedUp.png", "image/icon/Warrior/passiveSkill/blooddrain.png",  "image/icon/Warrior/passiveSkill/attackRangeUp.png",
                 "image/icon/Warrior/activeSkill/swiftStrike.png", "image/icon/Warrior/activeSkill/swordShot.png",
                 "image/background/ingame.png", "image/result.png", 
                 "image/fade/black.png", "image/fade/white.png");

    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint( "image/cursor.png", mouseX, mouseY, ));
    
    this.background = nowScene.addThing(new GameImage("image/background/ingame.png", 0, 0));
    this.background.opacity = 0.3;
    this.background.moveX = 1;
    this.background.moveY = 1;
    this.background.update = () =>
    {
        this.background.pos.x -= this.background.moveX * 1;
        this.background.pos.y -= this.background.moveY * 1;
        if(this.background.pos.x + this.background.image.width < canvas.width || this.background.pos.x > 0)
        {
            this.background.moveX *= -1;
        }
        if(this.background.pos.y + this.background.image.height < canvas.height || this.background.pos.y > 0)
        {
            this.background.moveY *= -1;
        }
    }
    nowScene.updateList.push(this.background);

    this.admitButton = nowScene.addThing(new Button("image/tabletSample.png", canvas.width / 2, canvas.height, 3));
    this.admitButton.pos.y += this.admitButton.image.height / 4;
    this.admitButton.moveSpeed = 0.4;
    this.admitButton.upRTime = Date.now();
    this.admitButton.setClickEvent(function()
    {
        nowScene.admitButton.upRTime = Date.now() + 0.6 * 1000;

        nowScene.admitButton.update = () =>
        {
            if(nowScene.admitButton.pos.y <= canvas.height / 2 - nowScene.admitButton.image.height / 2 || Date.now() > nowScene.admitButton.upRTime)
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