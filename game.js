var gameScene = new Scene();


// class

class Skill
{
    constructor(_player, _type)
    {
        this.type = _type;
        this.yourPlayer = _player;
    }
    start()
    {

    }
    updating()
    {

    }
    update()
    {
        this.updating();
    }
}
class ActiveSkill extends Skill
{
    constructor(_player, _key, _coolTime)
    {
        super(_player, "active");

        this.key = _key;
        this.coolTime = _coolTime;
        this.coolRTime = 0;
    }
    motion()
    {

    }
    updating2()
    {

    }
    updating()
    {
        if(keys[this.key] == 1 && Date.now() >= this.coolRTime)
        {
            this.start();
            this.coolRTime = Date.now() + this.coolTime * 1000;
        }
        this.motion();
        this.updating2();
    }
}
class SwordShot extends ActiveSkill
{
    constructor(_player, _key)
    {
        super(_player, _key, 3);
        
        this.sampleEffect = {image :  "image/effect/swordEffect.png", showTime : 2};
        
        this.moveSpeed = 10;

        this.nowCnt = 0;
        this.maxCnt = 3;

        this.delayTime = 0.1;
        this.delayRTime = 0;

        this.backRTime = Date.now();

        this.damage = 7;

        this.attackedList = [];
    }
    end()
    {
        this.nowCnt = 0;
        this.attackedList.length = 0;
        this.updating2 = () => {};
    }
    set()
    {
        this.yourPlayer.leftHand.playerToThis1 = 20;
        this.yourPlayer.leftHand.playerToThis2 = 40;

        this.yourPlayer.rightHand.playerToThis1 = 70;
        this.yourPlayer.rightHand.playerToThis2 = 0;
        
        this.yourPlayer.weapon.angle = 0;
    }
    isAttackedList(_index)
    {
        for(let i = 0; i < this.attackedList.length; i++)
        {
            if(nowScene.enemyList[_index] == this.attackedList[i])
            {
                return true;
            }
        }
        return false;
    }
    collide(_effect)
    {
        for(let i = 0; i < nowScene.enemyList.length; i++)
        {
            if(Collision.circleToRotatedRect(nowScene.enemyList[i], _effect) == true && !this.isAttackedList(i))
            {
                nowScene.enemyList[i].damaged(this.damage, Util.getAngle(_effect, nowScene.enemyList[i]), 20);
                this.attackedList.push(nowScene.enemyList[i]);
            }
        }
    }
    start()
    {
        this.set();
        this.updating2 = () =>
        {
            if(this.nowCnt < this.maxCnt && Date.now() >= this.delayRTime)
            {
                let tempEffect = nowScene.addThing(new Effect(this.sampleEffect.image, this.yourPlayer.getCenter("x"), this.yourPlayer.getCenter("y"), this.sampleEffect.showTime, this.yourPlayer));
                tempEffect.tempAngle = this.yourPlayer.playerToMouseAngle;
                tempEffect.firstSet();
                Util.moveByAngle(tempEffect.pos, tempEffect.tempAngle, this.yourPlayer.image.width / 2 + tempEffect.image.width);
                tempEffect.move = () =>
                {
                    Util.moveByAngle(tempEffect.pos, tempEffect.tempAngle, this.moveSpeed);
                    this.collide(tempEffect);
                }
                this.nowCnt++;

                nowScene.cam.shaking(15, 15, 0.1);
                this.delayRTime = Date.now() + this.delayTime * 1000;
            }
            if(this.nowCnt == this.maxCnt)
            {
                this.backRTime = Date.now() + 0.2 * 1000;
                this.yourPlayer.setPlayerTemp();
                this.motion = () =>
                {
                    if(this.yourPlayer.playerHandSlowBasic(0.2, this.backRTime) == true)
                    {
                        this.motion = () => {};
                    }
                }
                this.end();
            }
        }
    }
}
class SwiftStrike extends ActiveSkill
{
    constructor(_player, _key)
    {
        super(_player, _key, 0.5);

        this.activeNowRange = 0;
        this.activeMaxRange = 600;
        this.activeSpeed = 50;
        this.activeDir = this.yourPlayer.playerToMouseAngle;

        this.attackRect = {pos : {x : this.yourPlayer.getCenter("x") - 125 / 2, y : this.yourPlayer.getCenter("y") - 125 / 2}, rot : this.yourPlayer.rot, image : {width : 125, height : 125}};

        this.spectrum = new GameImage(this.yourPlayer.image.src, this.yourPlayer.pos.x, this.yourPlayer.pos.y, "none");
        this.spectrumTime = 0.005;
        this.spectrumRTime = Date.now();

        this.backRTime = Date.now();

        this.delayRTime = Date.now();
        this.delayTime = 0.15;

        this.damage = 15;

        this.attackedList = [];
    }
    makeSpectrum()
    {
        let tempSpectrum = [];

        tempSpectrum.push(new GameImage(this.yourPlayer.path, this.yourPlayer.pos.x, this.yourPlayer.pos.y, "effect"));
        tempSpectrum[0].rot = this.yourPlayer.rot;
        tempSpectrum[0].setZ(this.yourPlayer.z);

        tempSpectrum.push(new GameImage(this.yourPlayer.leftHand.path, this.yourPlayer.leftHand.pos.x, this.yourPlayer.leftHand.pos.y, "effect"));
        tempSpectrum[1].rot = this.yourPlayer.leftHand.rot;
        tempSpectrum[1].setZ(this.yourPlayer.leftHand.z);

        tempSpectrum.push(new GameImage(this.yourPlayer.rightHand.path, this.yourPlayer.rightHand.pos.x, this.yourPlayer.rightHand.pos.y, "effect"));
        tempSpectrum[2].rot = this.yourPlayer.rightHand.rot;
        tempSpectrum[2].setZ(this.yourPlayer.rightHand.z);

        tempSpectrum.push(new GameImage(this.yourPlayer.weapon.path, this.yourPlayer.weapon.pos.x, this.yourPlayer.weapon.pos.y, "effect"));
        tempSpectrum[3].setAnchor((-this.yourPlayer.weapon.getImageLength("width") / 2 + this.yourPlayer.rightHand.getImageLength("width") / 2), (-this.yourPlayer.weapon.getImageLength("height") / 2 + this.yourPlayer.rightHand.getImageLength("height") / 2));
        tempSpectrum[3].rot = this.yourPlayer.weapon.rot;
        tempSpectrum[3].setZ(this.yourPlayer.weapon.z);

        for(let i = 0; i < tempSpectrum.length; i++)
        {
            tempSpectrum[i].update = () =>
            {
                tempSpectrum[i].opacity -= 0.01;
                if(tempSpectrum[i].opacity <= 0)
                {
                    tempSpectrum[i].isDelete = true;
                }
            }
            nowScene.addThing(tempSpectrum[i]);
        }
    }
    end()
    {
        this.activeNowRange = 0;
        this.attackedList.length = 0;
        this.yourPlayer.InvincibleRTime = Date.now() + 0.5 * 1000;
        this.yourPlayer.setStatus("notCollision", false, "invincible", false);
        this.updating2 = () => {};
    }
    set()
    {
        this.yourPlayer.leftHand.playerToThis1 = 0;
        this.yourPlayer.leftHand.playerToThis2 = 50;

        this.yourPlayer.rightHand.playerToThis1 = 80;
        this.yourPlayer.rightHand.playerToThis2 = -20;

        this.yourPlayer.weapon.angle = -135;

        this.activeDir = this.yourPlayer.playerToMouseAngle;

        this.attackRect.pos = {x : this.yourPlayer.getCenter("x") - this.attackRect.image.width / 2, y : this.yourPlayer.getCenter("y") - this.attackRect.image.height / 2};

        this.yourPlayer.setStatus("notCollision", true, "invincible", true);
        this.yourPlayer.isDamaged = true;

        nowScene.cam.shaking(5, 5, 0.2);
    }
    moving()
    {
        Util.moveByAngle(this.yourPlayer.pos, this.activeDir, this.activeSpeed);
        Util.moveByAngle(this.yourPlayer.leftHand.pos, this.activeDir, this.activeSpeed);
        Util.moveByAngle(this.yourPlayer.rightHand.pos, this.activeDir, this.activeSpeed);
        Util.moveByAngle(this.yourPlayer.information.hp.pos, this.activeDir, this.activeSpeed);
        this.attackRect.pos = {x : this.yourPlayer.getCenter("x") - this.attackRect.image.width / 2, y : this.yourPlayer.getCenter("y") - this.attackRect.image.height / 2};
    }
    isAttackedList(_index)
    {
        for(let i = 0; i < this.attackedList.length; i++)
        {
            if(nowScene.enemyList[_index] == this.attackedList[i])
            {
                return true;
            }
        }
        return false;
    }
    collide()
    {
        for(let i = 0; i < nowScene.enemyList.length; i++)
        {
            if(Collision.circleToRotatedRect(nowScene.enemyList[i], this.attackRect) == true && !this.isAttackedList(i))
            {
                nowScene.enemyList[i].damaged(this.damage, Util.getAngle(this.yourPlayer, nowScene.enemyList[i]), 30);
                this.attackedList.push(nowScene.enemyList[i]);
            }
        }
    }
    start()
    {
        this.set();
        this.updating2 = () =>
        {
            this.moving();
            this.collide();
            this.activeNowRange += this.activeSpeed;
            if(Date.now() >= this.spectrumRTime)
            {
                this.makeSpectrum();
                this.spectrumRTime = Date.now() + this.spectrumTime * 1000;
            }
            if(this.activeNowRange >= this.activeMaxRange)
            {
                this.delayRTime = Date.now() + this.delayTime * 1000;
                this.backRTime = Date.now() + 0.2 * 1000;
                this.yourPlayer.setPlayerTemp();
                this.motion = () =>
                {
                    if(Date.now() >= this.delayRTime)
                    {
                        if(this.yourPlayer.playerHandSlowBasic(0.2, this.backRTime) == true)
                        {
                            this.delayRTime = Date.now() + this.delayTime * 1000;
                            this.motion = () => {};
                        }
                    }
                }
                this.end();
            }
        }
    }
}

class PassiveSkill extends Skill
{
    constructor(_player)
    {
        super(_player, "passive");
    }
}

class Effect extends GameImage
{
    constructor(path, _x, _y, _showTime, _unit)
    {
        super(path, _x, _y, "effect");
        this.unit = _unit;
        
        this.LTime = Date.now();
        this.RTime = 0;
        this.showTime = _showTime;
        
        this.effectOn = false;
    }
    firstSet()
    {
        this.pos = {x : this.unit.pos.x + this.unit.image.width / 2 - this.image.width / 2, y : this.unit.pos.y + this.unit.image.height / 2 - this.image.height / 2};

        this.rot = this.unit.rot;
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
        if(this.opacity <= 0)
        {
            this.isDelete = true;
        }
    }
    collsion()
    {

    }
    move()
    {

    }
    update()
    {
        this.move();
        this.collsion();
        this.basicSet();
    }
}
class Weapon extends GameImage
{
    constructor(path, _x, _y, _angle, _attackAngle, _attackTime, _player)
    {
        super(path, _x, _y, "weapon");
        this.angle = _angle;
        this.basicAngle = _angle;
        this.tempAngle = this.angle;
        this.attackAngle = _attackAngle;

        this.attackLTime = Date.now();
        this.attackRTime = 0;
        this.attackTime = _attackTime;
        this.attackBTime = 0;
        this.attackPattern = 1;
        this.damage = 10;
        this.yourPlayer = _player;
        this.attackEffect = new Effect("image/effect/swordEffect.png", this.yourPlayer.pos.x, this.yourPlayer.pos.y, 0.3, this.yourPlayer);
        this.attackLength = this.yourPlayer.image.width / 2 + this.image.width + this.attackEffect.image.width;

        this.attackedList = [];
    }
    firstSet()
    {
        this.yourPlayer.job.setAttackRange(this.yourPlayer);
    }
    setBasic()
    {
        this.angle = this.basicAngle;
        this.attackRTime = 0;
        this.attackPattern = 1;
    }
    isInRange()
    {
        
    }
    isInAngle()
    {
        
    }
    isAttackedList(_index)
    {
        for(let i = 0; i < this.attackedList.length; i++)
        {
            if(nowScene.enemyList[_index] == this.attackedList[i])
            {
                return true;
            }
        }
        return false;
    }
    attackCheck()
    {
        for(let i = 0; i < nowScene.enemyList.length; i++)
        {
            if(this.isInRange(nowScene.enemyList[i]) && this.isInAngle(i) && !this.isAttackedList(i))
            {
                nowScene.enemyList[i].damaged(this.damage, this.yourPlayer.rot, 30);
                this.attackedList.push(nowScene.enemyList[i]);
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

        this.basic1 = _PPT1;
        this.basic2 = _PPT2;

        this.tempPTT1 = this.playerToThis1;
        this.tempPTT2 = this.playerToThis2;
        
        this.yourPlayer = _player;

        this.attackPoint1 = 0;
        this.attackPoint2 = 0;
    }
    setAttackPoint(num, point)
    {
        eval("this.attackPoint" + num + "= this.playerToThis" + num + "- " + point);
    }
    setTempPoint(num, nowPoint, point)
    {
        eval("this.tempPTT" + num + "= " + (nowPoint - point));
    }
    setBasic()
    {
        this.playerToThis1 = this.basic1;
        this.playerToThis2 = this.basic2;
    }
}
class HpBar extends GameImage
{
    constructor(_inPath, _outPath, _unit)
    {
        super(_inPath, _unit.pos.x, _unit.pos.y, "hpBar");
        this.unit = _unit;
        this.hpBarOut = nowScene.addThing(new GameImage(_outPath, this.unit.pos.x, this.unit.pos.y, "hpBar"));

        this.setAnchor(-this.image.width / 2, -this.image.height / 2);
        this.tempScaleX = this.scale.x;

        this.setZ(19);
        this.hpBarOut.setZ(20);
    }
    setPos(_x, _y)
    {
        this.pos = {x : _x, y : _y};
        this.hpBarOut.pos = this.pos;
    }
    update()
    {
        if(this.isFixed != true)
        {
            this.pos = {x : this.unit.getCenter("x") - this.image.width / 2, y : this.unit.pos.y - this.unit.image.height / 2};
            this.hpBarOut.pos = this.pos;
        }

        let ratio = this.tempScaleX / this.unit.maxHp;
        this.scale.x = ratio * this.unit.hp;
        if(this.unit.isDelete == true)
        {
            this.hpBarOut.isDelete = true;
            this.isDelete = true;
        }
    }
}
class Player extends GameImage
{
    constructor(path, _x, _y, _job)
    {
        super(path, _x, _y, "player");
        this.job = _job;
        
        this.pos = {x : this.pos.x - this.getImageLength("width") / 2, y : this.pos.y - this.getImageLength("height") / 2};
        
        this.move = {speed : 500, crash : false};
        this.setHandMove = false;
        this.velocity = new Vector(0, 0);
        this.playerToMouseAngle = 0;

        this.maxHp = 10;
        this.hp = 10;

        this.isDamaged = false;
        this.InvincibleTime = 0.3;
        this.InvincibleRTime = Date.now();
        
        this.attack = {canAttack : true, attacking : false, click : false};
        this.passiveSkills = [];
        this.activeSkills = [];
        this.parts = [];
        this.firstSet();
        
        this.information = {hp : nowScene.addThing(new HpBar("image/PlayerHpBarIn.png", "image/hpBarOut.png", this))};
        this.status = {notCollision : false, invincible : false, cantSkill : false};
    }
    setStatus(_status, _trueFalse)
    {
        for(let i = 0; i < arguments.length; i+=2)
        {
            switch(arguments[i])
            {
                case "notCollision" : this.status.notCollision = arguments[i + 1]; break;
                case "invincible" : this.status.invincible = arguments[i + 1]; break;
                case "cantSkill" : this.status.cantSkill = arguments[i + 1]; break;
            }
        }
    }
    statusUpdating()
    {
        if(this.status.notCollision == true) // 충돌처리 x
        {
            // nowScene.collisionList에서 뺌
        }
        if(this.status.invincible == true) // 무적
        {
            // 무적시간 = Date.now()
            this.InvincibleRTime = Date.now();
        }
        if(this.status.cantSkill == false) // skill 사용 못함
        {
            // activeSkill 업데이트 x
        }
    }
    setPlayerTemp()
    {
        this.leftHand.tempPTT1 = this.leftHand.playerToThis1 - this.leftHand.basic1;
        this.leftHand.tempPTT2 = this.leftHand.playerToThis2 - this.leftHand.basic2;

        this.rightHand.tempPTT1 = this.rightHand.playerToThis1 - this.rightHand.basic1;
        this.rightHand.tempPTT2 = this.rightHand.playerToThis2 - this.rightHand.basic2;

        this.weapon.tempAngle = this.weapon.angle - this.weapon.basicAngle;
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
        this.leftHand.playerToThis1 -= this.leftHand.tempPTT1 / (_Time * frame);
        this.leftHand.playerToThis2 -= this.leftHand.tempPTT2 / (_Time * frame);

        this.rightHand.playerToThis1 -= this.rightHand.tempPTT1 / (_Time * frame);
        this.rightHand.playerToThis2 -= this.rightHand.tempPTT2 / (_Time * frame);

        this.weapon.angle -= this.weapon.tempAngle / (_Time * frame);
        
        if(nowScene.LTime >= _RTime)
        {
            this.playerHandsBasic();
            return true;
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
    }
    passiveSkillUpdating()
    {
        this.passiveSkills.forEach(skill => skill.update());
    }
    activeSkillUpdating()
    {
        this.activeSkills.forEach(skill => skill.update());
    }
    skillUpdate()
    {
        this.passiveSkillUpdating();
        this.activeSkillUpdating();
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
    damaged(_damge)
    {
        if(this.isDamaged == false && this.status.invincible == false)
        {
            this.hp -= _damge;
            this.InvincibleRTime = Date.now() + this.InvincibleTime * 1000;
            this.isDamaged = true;
        }
    }
    deadCheck()
    {
        if(this.hp <= 0)
        {
            this.isDelete = true;
            this.leftHand.isDelete = true;
            this.rightHand.isDelete = true;
            this.weapon.isDelete = true;
            this.information.hp.isDelete = true;
        }
    }
    collisionSet()
    {
        if(this.isDamaged == true && (Date.now() > this.InvincibleRTime))
        {
            this.isDamaged = false;
        }

        this.deadCheck();

        if(this.status.notCollision == false)
        {
            for(let i = 0; i < nowScene.collisionList.length; i++)
            {
                if(nowScene.collisionList[i] != this)
                {
                    if(Collision.circle(this, nowScene.collisionList[i]))
                    {
                        this.move.crash = true;
                        let collideAngle = Math.atan2(this.pos.y - nowScene.collisionList[i].pos.y, this.pos.x - nowScene.collisionList[i].pos.x);
                        this.velocity.set(Math.cos(collideAngle), Math.sin(collideAngle));
                        this.velocity.fixSpeed(this.move.speed);
        
                        this.pos.x += this.velocity.x * 1.25 * deltaTime;
                        this.pos.y += this.velocity.y * 1.25 * deltaTime;
                    }
                }
            }
        }
    }
    showInformation()
    {
        this.information.hp.update();
    }
    update()
    {
        this.statusUpdating();
        this.moving();
        this.collisionSet();
        this.playerAttack();
        this.setAngle();
        this.showInformation();
        this.handMove();
        this.weapon.update();
        this.skillUpdate();
        this.setZ(2);
    }
}

class Enemy extends GameImage
{
    constructor(path, _x, _y, _player)
    {
        super(path, _x, _y, "enemy");
        this.velocity = new Vector(0, 0);
        this.yourPlayer = _player;

        this.maxHp = 10;
        this.hp = this.maxHp;
        this.isDamaged = false;
        this.InvincibleTime = 0.2;
        this.damagedLTime = Date.now();
        this.damagedRTime = 0;
        this.bodyDamage = 1;

        this.enemyToPlayerAngle = Math.atan2(this.yourPlayer.pos.y - this.pos.y, this.yourPlayer.pos.x - this.pos.x);

        this.information = {hp : nowScene.addThing(new HpBar("image/EnemyHpBarIn.png", "image/hpBarOut.png", this))};
    }
    damaged(_damage, _angle, _force)
    {
        this.hp -= _damage;

        Util.moveByAngle(this.pos, _angle, _force);
    }
    watchPlayer()
    {
        this.enemyToPlayerAngle = Math.atan2(this.yourPlayer.pos.y - this.pos.y, this.yourPlayer.pos.x - this.pos.x);
        this.rot = this.enemyToPlayerAngle;
    }
    collisionSet()
    {
        this.damagedLTime = Date.now();
        if(this.isDamaged == true && (this.damagedLTime >= this.damagedRTime))
        {
            this.isDamaged = false;
        }
        if(this.hp <= 0)
        {
            this.isDelete = true;
            this.information.hp.isDelete = true;
        }
        for(let i = 0; i < nowScene.collisionList.length; i++)
        {
            if(nowScene.collisionList[i] != this)
            {
                if(Collision.circle(this, nowScene.collisionList[i]))
                {
                    if(nowScene.collisionList[i].type == "enemy" || nowScene.collisionList[i].type == "object" || nowScene.collisionList[i].type == "player")
                    {
                        if(nowScene.collisionList[i].type == "player")
                        {
                            this.bodyAttack();
                        }
                        let collideAngle = Math.atan2(nowScene.collisionList[i].pos.y - this.pos.y, nowScene.collisionList[i].pos.x - this.pos.x);
                        this.pos.x -= Math.cos(collideAngle);
                        this.pos.y -= Math.sin(collideAngle);
                    }
                }
            }
        }
    }
    bodyAttack()
    {
        this.yourPlayer.damaged(this.bodyDamage);
    }
    attack()
    {

    }
    showInformation()
    {
        this.information.hp.update();
    }
    update()
    {
        this.attack();
        this.collisionSet();
        this.showInformation();
    }
}
class TrackingEnemy extends Enemy
{
    constructor(_x, _y)
    {
        super( "image/enemy/trackingEnemy.png", _x, _y, nowScene.player);
        this.trackOn = true;
        this.maxHp = 50;
        this.hp = this.maxHp;
    }
    playerTracking()
    {
        let vX = this.yourPlayer.pos.x - this.pos.x;
        let vY = this.yourPlayer.pos.y - this.pos.y;
        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(1);
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }
    attack()
    {
        this.watchPlayer();
        if(this.trackOn == true)
        {
            this.playerTracking();
        }
    }
}
class ShootingEnemy extends Enemy
{
    constructor(_x, _y)
    {
        super( "image/enemy/shootingEnemy.png", _x, _y, nowScene.player);

        this.pattern = 1;

        this.range = 400;
        this.attackRange = 600;
        this.bullet = {image :  "image/effect/enemyBullet1.png", showTime : 5};
        this.shotSpeed = 2;
        this.shotDamage = 2;
        this.shotRTime = 0;
        this.shotDelay = 2;

        this.maxHp = 20;
        this.hp = this.maxHp;
    }
    playerTracking()
    {
        let vX = this.yourPlayer.pos.x - this.pos.x;
        let vY = this.yourPlayer.pos.y - this.pos.y;
        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(1);
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }
    shooting()
    {
        let tempBullet = new Effect(this.bullet.image, 0, 0, this.bullet.showTime, this);
        tempBullet.tempAngle = this.enemyToPlayerAngle;
        nowScene.effectList.push(nowScene.addThing(tempBullet));
        tempBullet.firstSet();
        Util.moveByAngle(tempBullet.pos, tempBullet.rot, tempBullet.image.width / 2);
        tempBullet.move = () =>
        {
            Util.moveByAngle(tempBullet.pos, tempBullet.tempAngle, this.shotSpeed);
        }
        tempBullet.collsion = () =>
        {
            if(Collision.circle(tempBullet, this.yourPlayer))
            {
                this.yourPlayer.damaged(this.shotDamage);
            }
        }
        this.shotRTime = nowScene.LTime + this.shotDelay * 1000;
    }
    checkRange()
    {
        if(this.pattern == 1)
        {
            if(Collision.circle(this, this.yourPlayer, this.range, this.yourPlayer.image.width))
            {
                this.pattern = 2;
                this.shotRTime = nowScene.LTime + this.shotDelay * 1000;
            }
        }
        else if(this.pattern == 2)
        {
            if(Collision.circle(this, this.yourPlayer, this.attackRange, this.yourPlayer.image.width) == false)
            {
                this.pattern = 1;
            }
        }
    }
    attack()
    {
        this.watchPlayer();
        if(this.pattern == 1)
        {
            this.playerTracking();
        }
        else if(this.pattern == 2)
        {
            if(nowScene.LTime >= this.shotRTime)
            {
                this.shooting();
            }
        }
        this.checkRange();
    }
}

class Boss extends GameImage // 작업중
{
    constructor(_path, _x, _y)
    {
        super(_path, _x, _y, "boss");

        this.maxHp = 200;
        this.hp = this.maxHp;

        this.information = {hp : nowScene.addThing(new HpBar("image/EnemyHpBarIn.png", "image/hpBarOut.png", this))};
        this.information.hp.isFixed = true;
        this.information.hp.hpBarOut.isFixed = true;
        this.information.hp.setPos(canvas.width / 2 - this.information.hp.image.width / 2, canvas.height - this.information.hp.image.height - 30)
    }
    damaged(_damage)
    {
        this.hp -= _damage;
    }
    showInformation()
    {
        this.information.hp.update();
    }
    updating()
    {

    }
    update()
    {
        this.updating();
        this.showInformation();
    }
}
class HyunWoo extends Boss
{
    constructor()
    {
        super( "image/enemy/trackingEnemy.png", canvas.width / 2, canvas.height / 2 - 200);
    }
}

class monsterMaker
{
    constructor(_x, _y)
    {
        this.pos = {x : _x, y : _y};

        this.spawnLTime = Date.now();
        this.spawnRTime = 0;
        this.spawnDelay = 1;
        this.spawnCount = 0;
        this.spawnMax = 0;
        this.spawnMonsterType = "TrackingEnemy";
        this.startSpawn = false;

        nowScene.updateList.push(this);
    }
    spawnMonsters()
    {
        if(this.spawnLTime >= this.spawnRTime)
        {
            nowScene.makeEnemy(this.spawnMonsterType, this.pos);
            this.spawnCount++;
            this.spawnRTime = this.spawnLTime + this.spawnDelay * 1000;
        }
    }
    spawnFinish()
    {
        return (this.spawnCount >= this.spawnMax);
    }
    setWaveStart(_type, _max, _delay, _firstD)
    {
        this.spawnMonsterType = _type;
        this.spawnMax = _max;
        this.spawnDelay = _delay;
        this.spawnRTime = Date.now() + _firstD * 1000;
    }
    update()
    {
        this.spawnLTime = Date.now();
        if(this.spawnCount < this.spawnMax && this.startSpawn == true)
        {
            this.spawnMonsters();
        }
    }
}

var JobWarrior =
{
    setPlayerHand : (player) =>
    {
        player.leftHand = nowScene.addThing(new PlayerHand( "image/player/playerHand.png", player, 42, 42));
        player.rightHand = nowScene.addThing(new PlayerHand( "image/player/playerHand.png", player, 42, 42));
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
                    let tempEffect = new Effect(player.weapon.attackEffect.src, 0, 0, player.weapon.attackEffect.showTime, player);
                    tempEffect.firstSet();
                    Util.moveByAngle(tempEffect.pos, player.rot, player.image.width / 2 + player.weapon.image.width);
                    nowScene.effectList.push(nowScene.addThing(tempEffect));
    
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
                    player.weapon.attackRTime = nowScene.LTime + (player.weapon.attackTime / 2) * 1000;
                    player.weapon.attackPattern++;
                    player.attack.canAttack = true;

                    player.weapon.attackedList.length = 0;
                    player.setPlayerTemp();
                }
            }
            else if(player.weapon.attackPattern == 2)
            {
                if(player.playerHandSlowBasic(player.weapon.attackTime / 2, player.weapon.attackRTime) == true)
                {
                    player.attack.attacking = false;
                };
            }
        }
    },
    setWeapon : (player) =>
    {
        player.weapon = nowScene.addThing(new Weapon( "image/weapon/sword.png", player.rightHand.pos.x, player.rightHand.pos.y, 120, -90, 0.3, player));
        player.weapon.damage = 10;
        player.weapon.attackEffect = {src :  "image/effect/swordEffect.png", showTime : 0.3};    
        player.weapon.attackLength = player.image.width / 2 + player.weapon.image.width + 50;
        player.weapon.setAnchor((-player.weapon.getImageLength("width") / 2 + player.rightHand.getImageLength("width") / 2), (-player.weapon.getImageLength("height") / 2 + player.rightHand.getImageLength("height") / 2));
        player.weapon.update = () =>
        {
            player.weapon.attackLTime = Date.now();
            player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
            player.weapon.pos = player.rightHand.pos;
            Util.moveByAngle(player.weapon.pos, player.playerToMouseAngle, (player.weapon.getImageLength("height") - player.rightHand.getImageLength("height")) / 2);
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
            let basicPlayerRot = Util.getAngleBasic(player.rot * 180 / Math.PI);
            let playerToEnemy = Util.getAngleBasic(Util.getAngle(player, nowScene.enemyList[_index]));
    
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
        for(let i = 0; i < nowScene.selectedInfo.player.skill.passive.length; i+=2)
        {
            let passiveSkill;
            switch(nowScene.selectedInfo.player.skill.passive[i])
            {
                case "" : break;
            }
            passiveSkill.setPlayer(player);
            player.passiveSkills.push(passiveSkill);
        }
        
        for(let i = 0; i < nowScene.selectedInfo.player.skill.active.length; i+=2)
        {
            let activeSkill;
            switch(nowScene.selectedInfo.player.skill.active[i])
            {
                case "SwordShot" : activeSkill = new SwordShot(player, nowScene.selectedInfo.player.skill.active[i + 1]); break;
                case "SwiftStrike" : activeSkill = new SwiftStrike(player, nowScene.selectedInfo.player.skill.active[i + 1]); break;
            }
            player.activeSkills.push(activeSkill);
        }
    }
}
var JobLancer =
{
    setPlayerHand : (player) =>
    {
        player.leftHand = nowScene.addThing(new PlayerHand( "image/player/playerHand.png", player, 42, 42));
        player.rightHand = nowScene.addThing(new PlayerHand( "image/player/playerHand.png", player, 42, 42));
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
                    player.setPlayerTemp();
                }
            }
            else if(player.weapon.attackPattern == 2)
            {
                // if(player.rightHand.playerToThis1 >= player.rightHand.tempPTT1 && player.rightHand.playerToThis2 <= player.rightHand.tempPTT2)
                // {
                //     player.leftHand.playerToThis1 += player.leftHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                //     player.leftHand.playerToThis2 += player.leftHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                //     player.rightHand.playerToThis1 += player.rightHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                //     player.rightHand.playerToThis2 += player.rightHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                //     player.weapon.angle -= player.weapon.attackAngle * player.weapon.attackTime * deltaTime * 100;
                // }
                if(player.playerHandSlowBasic(player.weapon.attackTime, player.weapon.attackRTime) == true)
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
        player.weapon = nowScene.addThing(new Weapon( "image/weapon/spear.png", Util.getCenter(player.rightHand, "x"), Util.getCenter(player.rightHand, "y"), -10, 0, 0.15, player));
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
            let basicPlayerRot = Util.getAngleBasic(player.rot * 180 / Math.PI);
            let playerToEnemy = Util.getAngleBasic(Util.getAngle(player, nowScene.enemyList[_index]));
    
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

    }
}
var setJob = (player) =>
{
    switch(player.job)
    {
        case "Warrior" : player.job = JobWarrior; break;
        case "Lancer" : player.job = JobLancer; break;
    }
}

gameScene.init = function()
{
    this.collisionList = [];
    this.moveList = [];
    this.playerAndEnemyList = [];
    this.enemyList = [];
    this.effectList = [];
    this.makerList = [];

    this.LTime = Date.now();
    

    // function

    this.makeEnemy = function(_type, _pos)
    {
        switch(_type)
        {
            case "TrackingEnemy" : nowScene.addThing(new TrackingEnemy(_pos.x, _pos.y)); break;
            case "ShootingEnemy" : nowScene.addThing(new ShootingEnemy(_pos.x, _pos.y)); break;
        }
    }
    this.getAngleBasic = function(_angle)
    {
        return (_angle < 0 ? (360 + _angle) : _angle);
    }

    this.player = nowScene.addThing(new Player( "image/player/player.png", canvas.width / 2, canvas.height / 2, this.selectedInfo.player.job));
    
    this.gameController = new GameController();
    
    this.cam = new Camera(this.player);
    this.cursor = nowScene.addThing(new MousePoint( "image/cursor.png", mouseX, mouseY));
}
gameScene.update = function()
{
    this.LTime = Date.now();

    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    this.effectList.forEach(effect => effect.update());
    this.gameController.update();
    this.cam.update();
    this.delete(this.updateList);
    this.delete(this.collisionList);
    this.delete(this.moveList);
    this.delete(this.playerAndEnemyList);
    this.delete(this.enemyList);
    this.delete(this.effectList);
    this.delete(this.makerList);
}