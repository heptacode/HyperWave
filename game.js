var gameScene = new Scene();

gameScene.init = function()
{
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
            this.pos.x = this.yourPlayer.pos.x;
            this.pos.y = this.yourPlayer.pos.y + (this.yourPlayer.image.height / 2 - this.image.height / 2);
            this.pos.x += Math.cos(this.yourPlayer.rot) * (this.yourPlayer.image.width / 2 + this.yourPlayer.weapon.image.width);
            this.pos.y += Math.sin(this.yourPlayer.rot) * (this.yourPlayer.image.width / 2 + this.yourPlayer.weapon.image.width);

            this.rot = this.yourPlayer.rot;
            this.setZ(5);

            return this;
        }
        update()
        {
            this.LTime = Date.now();
            if(this.effectOn == false)
            {
                this.RTime = this.LTime + this.showTime * 1000;
                this.effectOn = true;
            }
            if(this.LTime >= this.RTime)
            {
                this.isDelete = true;
            }
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
            this.attackPattern = 1;
            this.damage = 10;
            this.yourPlayer = _player;
            this.attackEffect = new Effect("swordEffect.png", this.yourPlayer.pos.x, this.yourPlayer.pos.y, 0.3, this.yourPlayer);
            this.effectArray = [];
        }
        firstSet()
        {
            nowScene.setAttackRange(this.yourPlayer);
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
                if(this.isInRange(i) && this.isInAngle(i))
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

            this.pos = {x : this.pos.x - this.image.width / 2, y : this.pos.y - this.image.height / 2};

            this.move = {speed : 500, crash : false, collideAngle : 0};
            this.setHandMove = false;
            this.velocity = new Vector(0, 0);
            this.playerToMouseAngle = 0;

            this.hp = 10;
            this.damaged = false;
            this.InvincibleTime = 0.3;
            this.damagedLTime = Date.now();
            this.damagedRTime = 0;

            this.attack = {canAttack : true, attacking : false, click : false};
            this.firstSet();

            this.information = {hp : nowScene.addText(new GameText(this.pos.x, this.pos.y, "Arial", ("hp : " + this.hp)))};

            nowScene.cam = new Camera(this);

        }
        firstSet()
        {
            nowScene.setPlayerHand(this);
            nowScene.setAttackHandPoint(this);
            nowScene.setWeapon(this);
            nowScene.setPlayerAttackMotion(this);
            nowScene.setAttackRange(this);
        }
        basicAttack()
        {

        }
        playerAttack()
        {
            if(mouseValue["Left"] == 1 && this.attack.canAttack == true && this.attack.attacking == false)
            {
                this.rightHand.setBasic();
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
        setAngle()
        {
            this.playerToMouseAngle = Math.atan2(nowScene.cursor.getCenter("y") - this.getCenter("y") + nowScene.cam.pos.y, nowScene.cursor.getCenter("x") - this.getCenter("x") + nowScene.cam.pos.x);
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
                if(Math.sqrt(Math.pow(this.getCenter("x") - nowScene.collisionList[i].getCenter("x"), 2) + Math.pow(this.getCenter("y") - nowScene.collisionList[i].getCenter("y"), 2)) <= (this.image.height / 2 + nowScene.collisionList[i].image.height / 2))
                {
                    this.move.crash = true;
                    this.move.collideAngle = Math.atan2(this.pos.y - nowScene.collisionList[i].pos.y, this.pos.x - nowScene.collisionList[i].pos.x);
                    this.velocity.set(Math.cos(this.move.collideAngle), Math.sin(this.move.collideAngle));
                    this.velocity.fixSpeed(this.move.speed);

                    this.pos.x += this.velocity.x * 1.5 * deltaTime;
                    this.pos.y += this.velocity.y * 1.5 * deltaTime;
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
            this.handMove();
            this.showInformation();
            this.weapon.update();
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
                    if(Math.sqrt(Math.pow(this.getCenter("x") - nowScene.collisionList[i].getCenter("x"), 2) + Math.pow(this.getCenter("y") - nowScene.collisionList[i].getCenter("y"), 2)) <= (this.image.height / 2 + nowScene.collisionList[i].image.height / 2))
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
            this.pos.x = this.getCenter("x");
            this.pos.y = this.getCenter("y");
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
                nowScene.makeEnemy("enemy", "enemy1.png", this.pos.x - this.image.width / 2, this.pos.y - this.image.height / 2);
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

    preloadImage("player.png", "playerHand.png", "sword.png", "spear.png", "enemy1.png", "cursor.png");

    this.collisionList = [];
    this.moveList = [];
    this.playerAndEnemyList = [];
    this.enemyList = [];
    this.updateList = [];
    this.effectList = [];
    this.makerList = [];

    this.setAttackHandPoint = function(player)
    {
        switch(player.job)
        {
            case "Warrior" :
                player.leftHand.setAttackPoint(1, 12);
                player.leftHand.setAttackPoint(2, 55);
                player.rightHand.setAttackPoint(1, 60);
                player.rightHand.setAttackPoint(2, -30); break;
            case "SpearMan" :
                player.leftHand.setAttackPoint(1, 12);
                player.leftHand.setAttackPoint(2, 55);
                player.rightHand.setAttackPoint(1, 77);
                player.rightHand.setAttackPoint(2, 30); break;
        }
    }
    this.setPlayerHand = function(player)
    {
        switch(player.job)
        {
            case "Warrior" :
                player.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));
                player.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));

                player.handMove = function()
                {
                    player.leftHand.pos = {x : player.getCenter("x") - player.leftHand.image.width / 2, y : player.getCenter("y") - player.leftHand.image.height / 2};
                    player.rightHand.pos = {x : player.getCenter("x") - player.rightHand.image.width / 2, y : player.getCenter("y") - player.rightHand.image.height / 2};

                    player.leftHand.pos.x += Math.cos(player.playerToMouseAngle) * player.leftHand.playerToThis1;
                    player.leftHand.pos.y += Math.sin(player.playerToMouseAngle) * player.leftHand.playerToThis1;
                    let leftHandAngle = player.playerToMouseAngle * 180 / Math.PI - (player.playerToMouseAngle < -90 ? (-270) : (90));
                    player.leftHand.pos.x += Math.cos(leftHandAngle / 180 * Math.PI) * player.leftHand.playerToThis2;
                    player.leftHand.pos.y += Math.sin(leftHandAngle / 180 * Math.PI) * player.leftHand.playerToThis2;
                    player.leftHand.setZ(4);

                    player.rightHand.pos.x += Math.cos(player.playerToMouseAngle) * player.rightHand.playerToThis1;
                    player.rightHand.pos.y += Math.sin(player.playerToMouseAngle) * player.rightHand.playerToThis1;
                    let rightHandAngle = player.playerToMouseAngle * 180 / Math.PI - (player.playerToMouseAngle > 90 ? (270) : (-90));
                    player.rightHand.pos.x += Math.cos(rightHandAngle / 180 * Math.PI) * player.rightHand.playerToThis2;
                    player.rightHand.pos.y += Math.sin(rightHandAngle / 180 * Math.PI) * player.rightHand.playerToThis2;
                    player.rightHand.setZ(4);
                }; break;
            case "SpearMan" :
                player.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 42, 42));
                player.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", player, 32, 47));

                player.handMove = function()
                {
                    player.leftHand.pos = {x : player.getCenter("x") - player.leftHand.image.width / 2, y : player.getCenter("y") - player.leftHand.image.height / 2};
                    player.rightHand.pos = {x : player.getCenter("x") - player.rightHand.image.width / 2, y : player.getCenter("y") - player.rightHand.image.height / 2};

                    player.leftHand.pos.x += Math.cos(player.playerToMouseAngle) * player.leftHand.playerToThis1;
                    player.leftHand.pos.y += Math.sin(player.playerToMouseAngle) * player.leftHand.playerToThis1;
                    let leftHandAngle = player.playerToMouseAngle * (180 / Math.PI) - (player.playerToMouseAngle < -90 ? (-270) : (90));
                    player.leftHand.pos.x += Math.cos(leftHandAngle / 180 * Math.PI) * player.leftHand.playerToThis2;
                    player.leftHand.pos.y += Math.sin(leftHandAngle / 180 * Math.PI) * player.leftHand.playerToThis2;
                    player.leftHand.setZ(4);

                    player.rightHand.pos.x += Math.cos(player.playerToMouseAngle) * player.rightHand.playerToThis1;
                    player.rightHand.pos.y += Math.sin(player.playerToMouseAngle) * player.rightHand.playerToThis1;
                    let rightHandAngle = player.playerToMouseAngle * (180 / Math.PI) - (player.playerToMouseAngle > 90 ? (270) : (-90));
                    player.rightHand.pos.x += Math.cos(rightHandAngle / 180 * Math.PI) * player.rightHand.playerToThis2;
                    player.rightHand.pos.y += Math.sin(rightHandAngle / 180 * Math.PI) * player.rightHand.playerToThis2;
                    player.rightHand.setZ(4);
                }; break;
        }
    }
    this.setPlayerAttackMotion = function(player)
    {
        switch(player.job)
        {
            case "Warrior":
                player.basicAttack = function()
                {
                    if(player.weapon.attackPattern == 1)
                    {
                        if(player.attack.click == true)
                        {
                            player.weapon.attackCheck();
                            let tempEffect = nowScene.addImage(new Effect(player.weapon.attackEffect.image.src, 0, 0, player.weapon.attackEffect.showTime, player));
                            player.weapon.effectArray.push(tempEffect);
                            player.weapon.effectArray[player.weapon.effectArray.length - 1].firstSet();


                            player.leftHand.playerToThis1 -= player.leftHand.attackPoint1;
                            player.leftHand.playerToThis2 -= player.leftHand.attackPoint2;
    
                            player.rightHand.playerToThis1 -= player.rightHand.attackPoint1;
                            player.rightHand.playerToThis2 -= player.rightHand.attackPoint2;
    
                            player.weapon.angle = player.weapon.attackAngle;

                            player.attack.click = false;
                        }
                        if(player.weapon.attackLTime >= player.weapon.attackRTime + player.weapon.attackTime * 1000)
                        {
                            player.weapon.attackPattern++;
                            player.attack.canAttack = true;
                        }
                    }
                    else if(player.weapon.attackPattern == 2)
                    {           
                        player.leftHand.playerToThis1 += player.leftHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                        player.leftHand.playerToThis2 += player.leftHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                        player.rightHand.playerToThis1 += player.rightHand.attackPoint1 * player.weapon.attackTime * deltaTime * 100;
                        player.rightHand.playerToThis2 += player.rightHand.attackPoint2 * player.weapon.attackTime * deltaTime * 100;

                        player.weapon.angle -= player.weapon.attackAngle * player.weapon.attackTime * deltaTime * 100;
                        
                        if(player.rightHand.playerToThis1 <= player.rightHand.tempPTT1 && player.rightHand.playerToThis2 >= player.rightHand.tempPTT2 && player.weapon.angle <= player.weapon.tempAngle)
                        {
                            player.leftHand.setBasic();
                            player.rightHand.setBasic();
                            player.weapon.setBasic();
                            player.attack.attacking = false;
                        }
                    }
                    for(let i = 0; i < player.weapon.effectArray.length; i++)
                    {
                        player.weapon.effectArray[i].update();
                    }
                }; break;
            case "SpearMan":
                player.basicAttack = function()
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
                    }; break;
                
        }
    }
    this.setWeapon = function(player)
    {
        switch(player.job)
        {
            case "Warrior" :
            player.weapon = nowScene.addImage(new Weapon("sword.png", player.rightHand.getCenter("x"), player.rightHand.getCenter("y"), 120, -100, 0.3, player));
            player.weapon.setAnchor((player.rightHand.pos.x - player.getCenter("x")), 0);
                player.weapon.update = function()
                {
                    player.weapon.attackLTime = Date.now();
                    player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
                    player.weapon.pos = player.rightHand.pos;
                    player.weapon.setZ(3);
                }; break;
            case "SpearMan" :
                player.weapon = nowScene.addImage(new Weapon("spear.png", player.rightHand.getCenter("x"), player.rightHand.getCenter("y"), -10, 0, 0.15, player));
                player.weapon.setAnchor((player.rightHand.pos.x - player.getCenter("x")), 0);
                player.weapon.update = function()
                {
                    player.weapon.attackLTime = Date.now();
                    player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
                    player.weapon.pos.x = player.rightHand.pos.x - player.weapon.image.width / 5;
                    player.weapon.pos.y = player.rightHand.pos.y + player.weapon.image.height / 3;
                    player.weapon.setZ(3);
                }; break;
        }
    }
    this.setAttackRange = function(player)
    {
        switch(player.job)
        {
            case "Warrior" :
                player.weapon.isInRange = function(_index)
                {
                    return (Math.sqrt(Math.pow(player.getCenter("x") - nowScene.enemyList[_index].getCenter("x"), 2) + Math.pow(player.getCenter("y") - nowScene.enemyList[_index].getCenter("y"), 2)) <= 
                    (player.weapon.image.height + player.image.width + player.weapon.attackEffect.image.width + nowScene.enemyList[_index].image.height / 2))
                }
                player.weapon.isInAngle = function(_index)
                {
                    let basicPlayerRot = nowScene.getAngleBasic(player.rot * 180 / Math.PI);
                    let playerToEnemy = nowScene.getAngleBasic(Math.atan2(nowScene.enemyList[_index].getCenter("y") - player.getCenter("y"), nowScene.enemyList[_index].getCenter("x") - player.getCenter("x")) * 180 / Math.PI);

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
            case "SpearMan" :
        }
    }
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

    this.player = nowScene.addImage(new Player("player.png", canvas.width / 2, canvas.height / 2, "SpearMan"));
    this.cursor = nowScene.addImage(new MousePoint("cursor.png", mouseX, mouseY));
    this.cursor.isFixed = true;
    this.monsterMaker1 = nowScene.addImage(new monsterMaker("playerHand.png", 200, 500));
    this.monsterMaker2 = nowScene.addImage(new monsterMaker("playerHand.png", 1720, 500));

    this.gameController = new GameController(2);
}
gameScene.update = function()
{
    if(nowScene.player.isDelete == false)
    {
        this.checkDeleteImage();
        for(let i = 0; i < this.updateList.length; i++)
        {
            this.updateList[i].update();
        }
        this.gameController.update();
        if(keys["KeyK"] == 1)
        {
            this.makeShape("object", "playerHand.png", canvas.width, canvas.height, "object");
        }
        this.cam.update();
    }
    // else
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