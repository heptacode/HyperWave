var gameScene = new Scene();

class Skill
{
    constructor(_coolTime, _key, _player)
    {
        this.yourPlayer = _player;
        this.coolTime = _coolTime;
        this.lTime = Date.now();
        this.rTime = 0;
        this.key = _key;
        this.canAttack = true;
    }
    update()
    {
        this.lTime = Date.now();
        if (keys[this.key] == 1 && this.lTime >= this.rTime)
        {
            this.cast();
            this.rTime = this.lTime + this.coolTime * 1000;
        }
    }
}
class Skill1 extends Skill
{
    constructor(_key, _player)
    {
        super(1, _key, _player);
        this.effect = new Effect("swordEffect.png", this.yourPlayer.pos.x, this.yourPlayer.pos.y, 2, this.yourPlayer);
        this.maxCnt = 3;
        this.nowCnt = 0;
        this.DTime = 0.3;
        this.RTime = 0;
        this.moveSpeed = 2;
    }
    cast()
    { 
        this.canAttack = true;
        let tempEffect = new Effect(this.effect.image.src, this.yourPlayer.pos.x, this.yourPlayer.pos.y, this.effect.showTime, this.yourPlayer);
        tempEffect.firstSet = () =>
        {
            tempEffect.pos = {x : this.yourPlayer.pos.x, y : this.yourPlayer.pos.y + this.yourPlayer.getImageLength("height") / 2 - tempEffect.getImageLength("height") / 2};
            tempEffect.angle = this.yourPlayer.rot;
            tempEffect.rot = tempEffect.angle;
            Util.moveByAngle(tempEffect.pos, tempEffect.angle, this.yourPlayer.image.width / 2 + this.yourPlayer.weapon.image.width);
            tempEffect.setZ(5);
            
            tempEffect.update = () =>
            {
                if(this.canAttack == true)
                {
                    if(this.lTime >= this.RTime && this.nowCnt <= this.maxCnt)
                    {
                        this.yourPlayer.playerHandsBasic();
                        this.cast();
                        this.nowCnt++;
                        this.playerHandsMove();
                        nowScene.cam.shaking(10, 10, this.DTime);
                        this.RTime = this.lTime + this.DTime * 1000;
                    }
                    if(this.nowCnt == this.maxCnt)
                    {
                        this.yourPlayer.weapon.attackRTime = nowScene.LTime + this.yourPlayer.weapon.attackTime * 1000 / 2;
                    }
                }
                if(this.nowCnt == this.maxCnt)
                {
                    this.nowCnt = 0;
                    this.canAttack = false;
                    this.yourPlayer.playerHandSlowBasic(this.yourPlayer.weapon.attackTime, this.yourPlayer.weapon.attackRTime);
                }
                Util.moveByAngle(tempEffect.pos, tempEffect.angle, this.moveSpeed);
                tempEffect.basicSet();
            }
        }
        nowScene.effectList.push(nowScene.addImage(tempEffect));
        tempEffect.firstSet();
    }
    update()
    {
        this.lTime = Date.now();
        if (keys[this.key] == 1 && this.lTime >= this.rTime)
        {
            this.cast();
            this.rTime = this.lTime + this.coolTime * 1000;
        }
    }
    playerHandsMove()
    {
        if(this.nowCnt % 2 != 0)
        {
            this.yourPlayer.leftHand.playerToThis1 -= this.yourPlayer.leftHand.attackPoint1;
            this.yourPlayer.leftHand.playerToThis2 -= this.yourPlayer.leftHand.attackPoint2;

            this.yourPlayer.rightHand.playerToThis1 -= this.yourPlayer.rightHand.attackPoint1;
            this.yourPlayer.rightHand.playerToThis2 -= this.yourPlayer.rightHand.attackPoint2;

            this.yourPlayer.weapon.angle = this.yourPlayer.weapon.attackAngle;
        }
        else
        {
            //this.yourPlayer.leftHand.playerToThis1 += this.yourPlayer.leftHand.attackPoint1;
            this.yourPlayer.leftHand.playerToThis2 += 20;

            this.yourPlayer.rightHand.playerToThis1 += 50;
            this.yourPlayer.rightHand.playerToThis2 -= 20;

            this.yourPlayer.weapon.angle = 50;
        }
    }
}

class Effect extends GameImage
{
    constructor(path, _x, _y, _showTime, _player)
    {
        super(path, _x, _y, "effect");
        this.yourPlayer = _player;
        
        this.LTime = Date.now();
        this.RTime = 0;
        this.showTime = _showTime;
        
        this.information = [path, _x, _y, _showTime, _player];
        
        this.effectOn = false;
    }
    firstSet()
    {
        this.pos = {x : this.yourPlayer.pos.x, y : this.yourPlayer.pos.y + this.yourPlayer.getImageLength("height") / 2 - this.getImageLength("height") / 2};
        Util.moveByAngle(this.pos, this.yourPlayer.rot, this.yourPlayer.getImageLength("width") / 2 + this.yourPlayer.weapon.getImageLength("width"));

        this.rot = this.yourPlayer.rot;
        this.setZ(5);
    }
    basicSet()
    {
        this.LTime = Date.now();
        if(this.effectOn == false)
        {
            this.RTime = this.LTime + this.showTime * 1000;
            this.effectOn = true;
        }
        if(this.LTime >= this.RTime)
        {
            this.opacity -= 0.01;
        }
        if(this.opacity <= 0.02)
        {
            this.isDelete = true;
        }
    }
    update()
    {
        this.basicSet();
    }
}
class Weapon extends GameImage
{
    constructor(path, _x, _y, _angle, _attackAngle, _attackTime, _player)
    {
        super(path, _x, _y, "weapon");
        this.angle = _angle;
        this.tempAngle = this.angle;
        this.attackAngle = _attackAngle;
        this.attackLTime = Date.now();
        this.attackRTime = 0;
        this.attackTime = _attackTime;
        this.attackBTime = 0;
        this.attackPattern = 1;
        this.damage = 10;
        this.yourPlayer = _player;
        this.attackEffect = new Effect("swordEffect.png", this.yourPlayer.pos.x, this.yourPlayer.pos.y, 0.3, this.yourPlayer);
        this.attackLength = this.yourPlayer.image.width / 2 + this.image.width + this.attackEffect.image.width;
    }
    firstSet()
    {
        this.yourPlayer.job.setAttackRange(this.yourPlayer);
    }
    setBasic()
    {
        this.angle = this.tempAngle;
        this.attackRTime = 0;
        this.attackPattern = 1;
    }
    isInRange()
    {
        
    }
    isInAngle()
    {
        
    }
    attackCheck()
    {
        for(let i = 0; i < nowScene.enemyList.length; i++)
        {
            if(this.isInRange(nowScene.enemyList[i]) && this.isInAngle(i))
            {
                nowScene.enemyList[i].hp -= this.damage;
                nowScene.enemyList[i].damaged = true;
                nowScene.enemyList[i].damagedRTime = nowScene.enemyList[i].damagedLTime + nowScene.enemyList[i].InvincibleTime * 1000;
            }
        }
    }
    update()
    {
        
    }
}
class PlayerHand extends GameImage
{
    constructor(path, _player, _PPT1, _PPT2)
    {
        super(path, _player.pos.x, _player.pos.y, "playerHand");
        this.playerToThis1 = _PPT1;
        this.playerToThis2 = _PPT2;
        this.tempPTT1 = this.playerToThis1;
        this.tempPTT2 = this.playerToThis2;
        
        this.yourPlayer = _player;

        this.attackPoint1 = 0;
        this.attackPoint2 = 0;
    }
    setAttackPoint(num, point)
    {
        eval("this.attackPoint" + num + " = " + "this.playerToThis" + num + " - " + point + ";");
    }
    setBasic()
    {
        this.playerToThis1 = this.tempPTT1;
        this.playerToThis2 = this.tempPTT2;
    }
}
class Player extends GameImage
{
    constructor(path, _x, _y, _job)
    {
        super(path, _x, _y, "player");
        this.job = _job;
        
        this.pos = {x : this.pos.x - this.getImageLength("width") / 2, y : this.pos.y - this.getImageLength("height") / 2};
        
        this.move = {speed : 500, crash : false, collideAngle : 0};
        this.setHandMove = false;
        this.velocity = new Vector(0, 0);
        this.playerToMouseAngle = 0;

        this.hp = 1000000000;
        this.damaged = false;
        this.InvincibleTime = 0.3;
        this.damagedLTime = Date.now();
        this.damagedRTime = 0;
        
        this.attack = {canAttack : true, attacking : false, click : false};
        this.skills = [];
        this.firstSet();
        
        this.information = {hp : nowScene.addText(new GameText(this.pos.x, this.pos.y, "Arial", ("hp : " + this.hp)))};
        
        nowScene.cam = new Camera(this);
        
    }
    firstSet()
    {
        setJob(this);
        this.job.setPlayerHand(this);
        this.job.setAttackHandPoint(this);
        this.job.setWeapon(this);
        this.job.setPlayerAttackMotion(this);
        this.job.setAttackRange(this);
        this.job.setSkills(this);
    }
    playerHandsBasic()
    {
        this.leftHand.setBasic();
        this.rightHand.setBasic();
        this.weapon.setBasic();
    }
    playerHandSlowBasic(_Time, _RTime)
    {
        this.leftHand.playerToThis1 += this.leftHand.attackPoint1 / _Time / 100;
        this.leftHand.playerToThis2 += this.leftHand.attackPoint2 / _Time / 100;

        this.rightHand.playerToThis1 += this.rightHand.attackPoint1 / _Time / 100;
        this.rightHand.playerToThis2 += this.rightHand.attackPoint2 / _Time / 100;

        this.weapon.angle -= this.weapon.attackAngle / _Time / 100;
        
        if(nowScene.LTime >= _RTime)
        {
            this.playerHandsBasic();
            this.attack.attacking = false;
        }
    }
    basicAttack()
    {

    }
    playerAttack()
    {
        if(mouseValue["Left"] == 1 && this.attack.canAttack == true && this.attack.attacking == false)
        {
            this.playerHandsBasic();
            this.attack.attacking = true;
            this.attack.canAttack = false;
            this.attack.click = true;
            this.weapon.attackRTime = Date.now();
        }
        if(this.attack.attacking == true)
        {
            this.basicAttack();
        }
        if(keys["KeyE"] == 1)
        {
            this.skills[0].acting = true;
        }
    }
    setAngle()
    {
        this.playerToMouseAngle = Math.atan2(Util.getCenter(nowScene.cursor, "y") - Util.getCenter(this, "y") + nowScene.cam.pos.y, Util.getCenter(nowScene.cursor, "x") - Util.getCenter(this, "x") + nowScene.cam.pos.x);
        this.rot = this.playerToMouseAngle;
        this.leftHand.rot = this.playerToMouseAngle;
        this.rightHand.rot = this.playerToMouseAngle;
    }
    moving()
    {
        let vX = 0;
        let vY = 0;
        
        if(keys["KeyW"] > 0)
        {
            vY -= 10;
        }
        else if(keys["KeyS"] > 0)
        {
            vY += 10;
        }
        if(keys["KeyA"] > 0)
        {
            vX -= 10;
        }
        else if(keys["KeyD"] > 0)
        {
            vX += 10;
        }

        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(this.move.speed);

        this.pos.x += this.velocity.x * deltaTime;
        this.pos.y += this.velocity.y * deltaTime;
    }
    handMove()
    {
        
    }
    collisionSet()
    {
        this.damagedLTime = Date.now();
        if(this.damaged == true && (this.damagedLTime >= this.damagedRTime))
        {
            this.damaged = false;
        }
        if(this.hp <= 0)
        {
            this.isDelete = true;
            this.leftHand.isDelete = true;
            this.rightHand.isDelete = true;
            this.weapon.isDelete = true;
        }

        for(let i = 0; i < nowScene.collisionList.length; i++)
        {
            if(Collision.circle(this, nowScene.collisionList[i]))
            {
                this.move.crash = true;
                this.move.collideAngle = Math.atan2(this.pos.y - nowScene.collisionList[i].pos.y, this.pos.x - nowScene.collisionList[i].pos.x);
                this.velocity.set(Math.cos(this.move.collideAngle), Math.sin(this.move.collideAngle));
                this.velocity.fixSpeed(this.move.speed);

                this.pos.x += this.velocity.x * 1.25 * deltaTime;
                this.pos.y += this.velocity.y * 1.25 * deltaTime;
                if(nowScene.collisionList[i].type == "enemy" && this.damaged == false)
                {
                    this.hp -= 1;
                    this.damaged = true;
                    this.damagedRTime = this.damagedLTime + this.InvincibleTime * 1000;
                }
                break;
            }
        }
    }
    showInformation()
    {
        this.information.hp
        this.information.hp.text = ("hp : " + this.hp);
        this.information.hp.pos.x = this.pos.x;
        this.information.hp.pos.y = this.pos.y - 20;
    }
    update()
    {
        this.moving();
        this.collisionSet();
        this.playerAttack();
        this.setAngle();
        this.showInformation();
        this.handMove();
        this.weapon.update();
        this.setZ(2);
        this.skills.forEach(skill => skill.update());
    }
}
class Enemy extends GameImage
{
    constructor(path, _x, _y, _player)
    {
        super(path, _x, _y, "enemy");
        this.velocity = new Vector(0, 0);
        this.yourPlayer = _player;
        this.trackingOn = true;

        this.hp = 10;
        this.damaged = false;
        this.InvincibleTime = 0.1;
        this.damagedLTime = Date.now();
        this.damagedRTime = 0;
    }
    playerTracking()
    {
        let enemyToPlayerAngle = Math.atan2(this.yourPlayer.pos.y - this.pos.y, this.yourPlayer.pos.x - this.pos.x);
        this.rot = enemyToPlayerAngle;
        let vX = this.yourPlayer.pos.x - this.pos.x;
        let vY = this.yourPlayer.pos.y - this.pos.y;
        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(1);
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }
    collisionSet()
    {
        this.damagedLTime = Date.now();
        if(this.damaged == true && (this.damagedLTime >= this.damagedRTime))
        {
            this.damaged = false;
        }
        if(this.hp <= 0)
        {
            this.isDelete = true;
        }
        for(let i = 0; i < nowScene.collisionList.length; i++)
        {
            if(nowScene.collisionList[i] != this)
            {
                if(Collision.circle(this, nowScene.collisionList[i]))
                {
                    if(nowScene.collisionList[i].type == "enemy" || nowScene.collisionList[i].type == "object")
                    {
                        let collideAngle = Math.atan2(nowScene.collisionList[i].pos.y - this.pos.y, nowScene.collisionList[i].pos.x - this.pos.x);
                        this.pos.x -= Math.cos(collideAngle);
                        this.pos.y -= Math.sin(collideAngle);
                    }
                }
            }
        }
    }
    update()
    {
        if(this.trackingOn)
        {
            this.playerTracking();
        }
        this.collisionSet();
    }
}
class monsterMaker extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "maker");
        this.pos.x -= this.getImageLength("width") / 2;
        this.pos.y -= this.getImageLength("height") / 2;
        this.setZ(1);

        this.spawnLTime = Date.now();
        this.spawnRTime = 0;
        this.spawnDelay = 1;
        this.spawnCount = 0;
        this.spawnMax = 0;
        this.canSpawn = true;

        
    }
    update()
    {
        if(this.spawnCount < this.spawnMax)
        {
            this.spawnMonster();
        }
    }
    spawnMonster()
    {
        this.spawnLTime = Date.now();
        if(this.canSpawn == true)
        {
            nowScene.makeEnemy("enemy", "enemy1.png", this.pos.x - this.getImageLength("width") / 2, this.pos.y - this.getImageLength("height") / 2);
            this.spawnRTime = this.spawnLTime + this.spawnDelay * 1000;
            this.spawnCount++;
            this.canSpawn = false;
        }
        if(this.spawnLTime >= this.spawnRTime)
        {
            this.canSpawn = true;
            nowScene.restWave();
        }
    }
}
class GameController
{
    constructor(_restTime)
    {
        this.wave = 0;
        this.waveStart = false;

        this.restLTime = Date.now();
        this.restRTime = 0;
        this.restTime = _restTime;
        this.startRest = true;
    }
    startSpawn(_wave)
    {
        for(let i = 0; i < nowScene.makerList.length; i++)
        {
            nowScene.makerList[i].spawnMax = (_wave * 2 + 2);
            nowScene.makerList[i].spawnCount = 0;
        }
    }
    setStartRest(_time)
    {
        this.restRTime = this.restLTime + _time * 1000;
        this.startRest = false;
    }
    rest()
    {
        if(this.restLTime >= this.restRTime)
        {
            this.wave++;
            this.waveStart = true;
        }
    }
    update()
    {
        if(this.waveStart == false)
        {
            if(this.startRest == true)
            {
                this.setStartRest(this.restTime);
            }
            this.rest()
        }
        else if(this.waveStart == true)
        {
            this.startSpawn(this.wave);
        }
    }
}

var JobWarrior =
{
    setPlayerHand : (player) =>
    {
        player.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));
        player.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));
        player.handMove = () =>
        {
            player.leftHand.pos = {x : Util.getCenter(player, "x") - player.leftHand.image.width / 2, y : Util.getCenter(player, "y") - player.leftHand.image.height / 2};
            player.rightHand.pos = {x : Util.getCenter(player, "x") - player.rightHand.image.width / 2, y : Util.getCenter(player, "y") - player.rightHand.image.height / 2};

            Util.moveByAngle(player.leftHand.pos, player.playerToMouseAngle, player.leftHand.playerToThis1);
            let leftHandAngle = player.playerToMouseAngle * 180 / Math.PI - (player.playerToMouseAngle < -90 ? (-270) : (90));
            Util.moveByAngle(player.leftHand.pos, leftHandAngle / 180 * Math.PI, player.leftHand.playerToThis2);
            player.leftHand.setZ(4);

            Util.moveByAngle(player.rightHand.pos, player.playerToMouseAngle, player.rightHand.playerToThis1);
            let rightHandAngle = player.playerToMouseAngle * 180 / Math.PI - (player.playerToMouseAngle > 90 ? (270) : (-90));
            Util.moveByAngle(player.rightHand.pos, rightHandAngle / 180 * Math.PI, player.rightHand.playerToThis2);
            player.rightHand.setZ(4);
        }
    },
    setAttackHandPoint : (player) =>
    {
        player.leftHand.setAttackPoint(1, 12);
        player.leftHand.setAttackPoint(2, 55);
        player.rightHand.setAttackPoint(1, 60);
        player.rightHand.setAttackPoint(2, -30);
    },
    setPlayerAttackMotion : (player) =>
    {
        player.basicAttack = () =>
        {
            if(player.weapon.attackPattern == 1)
            {
                if(player.attack.click == true)
                {
                    player.weapon.attackCheck();
                    let tempEffect = new Effect(player.weapon.attackEffect.image.src, 0, 0, player.weapon.attackEffect.showTime, player);
                    tempEffect.firstSet();
                    nowScene.effectList.push(nowScene.addImage(tempEffect));
    
                    player.leftHand.playerToThis1 -= player.leftHand.attackPoint1;
                    player.leftHand.playerToThis2 -= player.leftHand.attackPoint2;
    
                    player.rightHand.playerToThis1 -= player.rightHand.attackPoint1;
                    player.rightHand.playerToThis2 -= player.rightHand.attackPoint2;
    
                    player.weapon.angle = player.weapon.attackAngle;
    
                    player.attack.click = false;
                    nowScene.cam.shaking(10, 10, 0.1);
                }
                if(player.weapon.attackLTime >= player.weapon.attackRTime + player.weapon.attackTime * 1000)
                {
                    player.weapon.attackRTime = nowScene.LTime + player.weapon.attackTime * 1000 / 2;
                    player.weapon.attackPattern++;
                    player.attack.canAttack = true;
                }
            }
            else if(player.weapon.attackPattern == 2)
            {           
                // player.leftHand.playerToThis1 += player.leftHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                // player.leftHand.playerToThis2 += player.leftHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                // player.rightHand.playerToThis1 += player.rightHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                // player.rightHand.playerToThis2 += player.rightHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                // player.weapon.angle -= player.weapon.attackAngle * player.weapon.attackTime * deltaTime * 100;
                
                // if(player.rightHand.playerToThis1 <= player.rightHand.tempPTT1 && player.rightHand.playerToThis2 >= player.rightHand.tempPTT2 && player.weapon.angle <= player.weapon.tempAngle)
                // {
                //     player.playerHandsBasic();
                //     player.attack.attacking = false;
                // }
                player.playerHandSlowBasic(player.weapon.attackTime, player.weapon.attackRTime);
            }
        }
    },
    setWeapon : (player) =>
    {
        player.weapon = nowScene.addImage(new Weapon("sword.png", player.rightHand.pos.x, player.rightHand.pos.y, 120, -100, 0.3, player));
        player.weapon.setAnchor((-player.weapon.getImageLength("width") / 2 + player.rightHand.getImageLength("width") / 2), (-player.weapon.getImageLength("height") / 2 + player.rightHand.getImageLength("height") / 2));
        player.weapon.update = () =>
        {
            player.weapon.attackLTime = Date.now();
            player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
            player.weapon.pos = player.rightHand.pos;
            Util.moveByAngle(player.weapon.pos, player.playerToMouseAngle, (player.weapon.getImageLength("height") - player.rightHand.getImageLength("height")) / 2)
            player.weapon.setZ(3);
            for(let i = 0; i < nowScene.effectList.length; i++)
            {
                nowScene.effectList[i].update();
            }
        }
    },
    setAttackRange : (player) =>
    {
        player.weapon.isInRange = (obj) =>
        {
            return (Collision.circle(player, obj, player.weapon.attackLength, obj.image.width / 2));
        }
        player.weapon.isInAngle = (_index) =>
        {
            let basicPlayerRot = nowScene.getAngleBasic(player.rot * 180 / Math.PI);
            let playerToEnemy = nowScene.getAngleBasic(Util.getAngle(player, nowScene.enemyList[_index]));
    
            if((basicPlayerRot < -player.weapon.attackAngle / 2) && playerToEnemy > (360 + player.weapon.attackAngle / 2))
            {
                basicPlayerRot += 360;
            }
            else if((basicPlayerRot > 360 + player.weapon.attackAngle / 2) && playerToEnemy < -player.weapon.attackAngle / 2)
            {
                basicPlayerRot -= 360;
            }
    
            let minusAngle = (basicPlayerRot + player.weapon.attackAngle / 2);
            let plusAngle = (basicPlayerRot - player.weapon.attackAngle / 2);
            
            return (playerToEnemy >= minusAngle && playerToEnemy <= plusAngle);
        }
    },
    setSkills : (player) => 
    {
        player.skills.push(new Skill1("KeyK", player));
    }
}
var JobSpearMan = 
{
    setPlayerHand : (player) =>
    {
        player.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));
        player.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));
        player.handMove = () =>
        {
            player.leftHand.pos = {x : Util.getCenter(player, "x") - player.leftHand.image.width / 2, y : Util.getCenter(player, "y") - player.leftHand.image.height / 2};
            player.rightHand.pos = {x : Util.getCenter(player, "x") - player.rightHand.image.width / 2, y : Util.getCenter(player, "y") - player.rightHand.image.height / 2};

            Util.moveByAngle(player.leftHand.pos, player.playerToMouseAngle, player.leftHand.playerToThis1);
            let leftHandAngle = player.playerToMouseAngle * 180 / Math.PI - (player.playerToMouseAngle < -90 ? (-270) : (90));
            Util.moveByAngle(player.leftHand.pos, leftHandAngle / 180 * Math.PI, player.leftHand.playerToThis2);
            player.leftHand.setZ(4);

            Util.moveByAngle(player.rightHand.pos, player.playerToMouseAngle, player.rightHand.playerToThis1);
            let rightHandAngle = player.playerToMouseAngle * 180 / Math.PI - (player.playerToMouseAngle > 90 ? (270) : (-90));
            Util.moveByAngle(player.rightHand.pos, rightHandAngle / 180 * Math.PI, player.rightHand.playerToThis2);
            player.rightHand.setZ(4);
        }
    },
    setAttackHandPoint : (player) =>
    {
        player.leftHand.setAttackPoint(1, 12);
        player.leftHand.setAttackPoint(2, 55);
        player.rightHand.setAttackPoint(1, 77);
        player.rightHand.setAttackPoint(2, 30);
    },
    setPlayerAttackMotion : (player) =>
    {
        player.basicAttack = () =>
        {
            if(player.weapon.attackPattern == 1)
            {
                if(player.attack.click == true)
                {
                    player.leftHand.playerToThis1 -= player.leftHand.attackPoint1;
                    player.leftHand.playerToThis2 -= player.leftHand.attackPoint2;

                    player.rightHand.playerToThis1 -= player.rightHand.attackPoint1;
                    player.rightHand.playerToThis2 -= player.rightHand.attackPoint2;
                    
                    player.weapon.angle += player.weapon.attackAngle;

                    player.attack.click = false;
                }
                else if(player.weapon.attackLTime >= player.weapon.attackRTime + player.weapon.attackTime * 1000)
                {
                    player.weapon.attackPattern++;
                    player.attack.canAttack = true;
                }
            }
            else if(player.weapon.attackPattern == 2)
            {
                if(player.rightHand.playerToThis1 >= player.rightHand.tempPTT1 && player.rightHand.playerToThis2 <= player.rightHand.tempPTT2)
                {
                    player.leftHand.playerToThis1 += player.leftHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                    player.leftHand.playerToThis2 += player.leftHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                    player.rightHand.playerToThis1 += player.rightHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                    player.rightHand.playerToThis2 += player.rightHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                    player.weapon.angle -= player.weapon.attackAngle * player.weapon.attackTime * deltaTime * 100;
                }
                else
                {
                    player.leftHand.setBasic();
                    player.rightHand.setBasic();
                    player.weapon.setBasic();
                    player.attack.attacking = false;
                }
            }
        }
    },
    setWeapon : (player) =>
    {
        player.weapon = nowScene.addImage(new Weapon("spear.png", Util.getCenter(player.rightHand, "x"), Util.getCenter(player.rightHand, "y"), -10, 0, 0.15, player));
        player.weapon.setAnchor((player.rightHand.pos.x - Util.getCenter(player, "x")), 0);
        player.weapon.update = function()
        {
            player.weapon.attackLTime = Date.now();
            player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
            player.weapon.pos.x = player.rightHand.pos.x - player.weapon.getImageLength("width") / 5;
            player.weapon.pos.y = player.rightHand.pos.y + player.weapon.image.height / 3;
            player.weapon.setZ(3);
        }
    },
    setAttackRange : (player) =>
    {
        player.weapon.isInRange = (obj) =>
        {
            return (Collision.circle(player, obj, player.weapon.attackLength, obj.image.width / 2));
        }
        player.weapon.isInAngle = (_index) =>
        {
            let basicPlayerRot = nowScene.getAngleBasic(player.rot * 180 / Math.PI);
            let playerToEnemy = nowScene.getAngleBasic(Util.getAngle(player, nowScene.enemyList[_index]));
    
            if((basicPlayerRot < -player.weapon.attackAngle / 2) && playerToEnemy > (360 + player.weapon.attackAngle / 2))
            {
                basicPlayerRot += 360;
            }
            else if((basicPlayerRot > 360 + player.weapon.attackAngle / 2) && playerToEnemy < -player.weapon.attackAngle / 2)
            {
                basicPlayerRot -= 360;
            }
    
            let minusAngle = (basicPlayerRot + player.weapon.attackAngle / 2);
            let plusAngle = (basicPlayerRot - player.weapon.attackAngle / 2);
            
            return (playerToEnemy >= minusAngle && playerToEnemy <= plusAngle);
        }
    }
}
var setJob = function(player)
{
    switch(player.job)
    {
        case "Warrior" : player.job = JobWarrior; break;
        case "SpearMan" : player.job = JobSpearMan; break;
    }
}


gameScene.init = function()
{
    preloadImage("player.png", "playerHand.png", "sword.png", "spear.png", "enemy1.png", "cursor.png");

    this.collisionList = [];
    this.moveList = [];
    this.playerAndEnemyList = [];
    this.enemyList = [];
    this.updateList = [];
    this.effectList = [];
    this.makerList = [];

    this.LTime = Date.now();
    
    this.makeShape = function(_name, _image, _width, _height, _type)
    {
        let count = 0;
        let tempImage = new Image();
        tempImage.src = _image;

        for(let i = 0; i < (_height / tempImage.height); i++)
        {
            for(let j = 0; j < (_width / tempImage.width); j++)
            {
                if(!((i > 0) && (i < (_height / tempImage.height - 1))) || !((j > 0) && (j < (_width / tempImage.width - 1))))
                {
                    this[toString(_name) + (count++)] = nowScene.addImage(new GameImage(_image, (j * tempImage.width - this.player.pos.x), (i * tempImage.height - this.player.pos.y), _type));
                }
            }
        }
    }
    this.makeEnemy = function(_name, _image, _x, _y)
    {
        this[toString(_name) + (nowScene.enemyList.length)] = nowScene.addImage(new Enemy(_image, _x, _y, this.player))
    }
    this.getAngleBasic = function(_angle)
    {
        return (_angle < 0 ? (360 + _angle) : _angle);
    }
    this.windowShaking = function(_count, _power)
    {
        
    }
    this.restWave = function()
    {
        this.gameController.restTime = 5;
        this.gameController.restRTime = this.gameController.restLTime + this.gameController.restTime * 1000;
        this.gameController.canRest = true;
    }

    this.player = nowScene.addImage(new Player("player.png", canvas.width / 2, canvas.height / 2, "Warrior"));
    
    this.cursor = nowScene.addImage(new MousePoint("cursor.png", mouseX, mouseY));
    this.cursor.isFixed = true;
    this.monsterMaker1 = nowScene.addImage(new monsterMaker("playerHand.png", 200, 500));
    this.monsterMaker2 = nowScene.addImage(new monsterMaker("playerHand.png", 1720, 500));

    this.gameController = new GameController(2);
}
gameScene.update = function()
{
    this.LTime = Date.now();

    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    nowScene.effectList.forEach(effect => effect.update());
    this.gameController.update();
    this.cam.update();
    this.checkDeleteImage();
    // if(this.player.isDelete == true)
    // {
    //     this.sceneImageList.length = 0;
    //     this.collisionList = 0;
    //     this.moveList.length = 0;
    //     this.playerAndEnemyList.length = 0;
    //     this.enemyList.length = 0;
    //     this.updateList.length = 0;
    //     this.effectList.length = 0;
    //     this.makerList.length = 0;
    //     gameoverScene.start();
    // }
}
gameScene.start();