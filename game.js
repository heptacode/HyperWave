var gameScene = new Scene();

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
    }
    setBasic()
    {
        this.angle = this.tempAngle;
        this.attackRTime = 0;
        this.attackPattern = 1;
    }
    attackCheck()
    {
        for(let i = 0; i < nowScene.enemyList.length; i++)
        {
            if(Math.sqrt(Math.pow(this.getCenter("x") - nowScene.enemyList[i].getCenter("x"), 2) + Math.pow(this.getCenter("y") - nowScene.enemyList[i].getCenter("y"), 2)) <= (this.image.height / 2 + nowScene.enemyList[i].image.height / 2) && nowScene.enemyList[i].damaged == false)
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
    constructor(path, _x, _y, _PPT1, _PPT2)
    {
        super(path, _x, _y, "playerHand");
        this.playerToThis1 = _PPT1;
        this.playerToThis2 = _PPT2;
        this.tempPTT1 = this.playerToThis1;
        this.tempPTT2 = this.playerToThis2;

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

        this.attack = {canAttack : true, attacking : false, click : false};
        this.firstSet();
    }
    firstSet()
    {
        nowScene.setPlayerHand(this);
        nowScene.setAttackHandPoint(this);
        nowScene.setWeapon(this);
        nowScene.setPlayerAttackMotion(this);
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
        this.playerToMouseAngle = Math.atan2(nowScene.cursor.getCenter("y") - this.getCenter("y"), nowScene.cursor.getCenter("x") - this.getCenter("x"));
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
            vY += 10;
        }
        else if(keys["KeyS"] > 0)
        {
            vY -= 10;
        }
        if(keys["KeyA"] > 0)
        {
            vX += 10;
        }
        else if(keys["KeyD"] > 0)
        {
            vX -= 10;
        }

        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(this.move.speed);

        for(let i = 0; i < nowScene.collisionList.length; i++)
        {
            nowScene.collisionList[i].pos.x += this.velocity.x * deltaTime;
            nowScene.collisionList[i].pos.y += this.velocity.y * deltaTime;
        }
    }
    handMove()
    {
        
    }
    collisionSet()
    {
        for(let i = 0; i < nowScene.collisionList.length; i++)
        {
            if(nowScene.collisionList[i].type != "enemy")
            {
                if(Math.sqrt(Math.pow(this.getCenter("x") - nowScene.collisionList[i].getCenter("x"), 2) + Math.pow(this.getCenter("y") - nowScene.collisionList[i].getCenter("y"), 2)) <= (this.image.height / 2 + nowScene.collisionList[i].image.height / 2))
                {
                    this.move.crash = true;
                    this.move.collideAngle = Math.atan2(this.pos.y - nowScene.collisionList[i].pos.y, this.pos.x - nowScene.collisionList[i].pos.x);
                    this.velocity.set(Math.cos(this.move.collideAngle), Math.sin(this.move.collideAngle));
                    this.velocity.fixSpeed(this.move.speed);

                    for(let i = 0; i < nowScene.collisionList.length; i++)
                    {
                        nowScene.collisionList[i].pos.x -= this.velocity.x * 1.25 * deltaTime;
                        nowScene.collisionList[i].pos.y -= this.velocity.y * 1.25 * deltaTime;
                    }
                    break;
                }
            }
        }
    }
    update()
    {
        this.moving();
        this.collisionSet();
        this.weapon.update();
        this.playerAttack();
        this.setAngle();
        this.handMove();
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

        this.hp = 50;
        this.damaged = false;
        this.InvincibleTime = 0.5;
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
                    let collideAngle = Math.atan2(nowScene.collisionList[i].pos.y - this.pos.y, nowScene.collisionList[i].pos.x - this.pos.x);
                    this.pos.x -= Math.cos(collideAngle);
                    this.pos.y -= Math.sin(collideAngle);
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
class MousePoint extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "cursor");
    }
    update()
    {
        this.pos.x = mouseX - this.image.width / 2;
        this.pos.y = mouseY - this.image.height / 2;
        this.setZ(10);
    }
}

gameScene.init = function()
{
    preloadImage("player.png", "playerHand.png", "sword.png", "spear.png", "enemy1.png", "cursor.png");

    this.collisionList = [];
    this.playerAndEnemyList = [];
    this.enemyList = [];
    this.updateList = [];

    this.setAttackHandPoint = function(player)
    {
        switch(player.job)
        {
            case "Warrior" :
                player.leftHand.setAttackPoint(1, 12);
                player.leftHand.setAttackPoint(2, 55);
                player.rightHand.setAttackPoint(1, 77);
                player.rightHand.setAttackPoint(2, -40); break;
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
                player.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", player.pos.x, player.pos.y, 42, 42));
                player.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", player.pos.x, player.pos.y, 42, 42));

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
            case "SpearMan" :
                player.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", player.pos.x, player.pos.y, 42, 42));
                player.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", player.pos.x, player.pos.y, 32, 47));

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
    this.setPlayerAttackMotion = function(player) // 작업중
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
                        if(player.rightHand.playerToThis1 >= player.rightHand.tempPTT1 && player.rightHand.playerToThis2 <= player.rightHand.tempPTT2 && player.weapon.angle >= player.weapon.attackAngle)
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
            case "SpearMan":
                player.basicAttack = function()
                    {
                        if(player.weapon.attackPattern == 1)
                        {
                            if(player.rightHand.playerToThis1 <= (player.rightHand.tempPTT1 - player.rightHand.attackPoint1) && player.rightHand.playerToThis2 >= (player.rightHand.tempPTT2 - player.rightHand.attackPoint2))
                            {
                                player.leftHand.playerToThis1 -= player.leftHand.attackPoint1 / (10 * 4);
                                player.leftHand.playerToThis2 -= player.leftHand.attackPoint2 / (10 * 4);

                                player.rightHand.playerToThis1 -= player.rightHand.attackPoint1 / (10 * 4);
                                player.rightHand.playerToThis2 -= player.rightHand.attackPoint2 / (10 * 4);

                                player.weapon.angle += player.weapon.attackAngle / 7 * 2;
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
                                player.leftHand.playerToThis1 += player.leftHand.attackPoint1 / 10 / 1.5;
                                player.leftHand.playerToThis2 += player.leftHand.attackPoint2 / 10 / 1.5;

                                player.rightHand.playerToThis1 += player.rightHand.attackPoint1 / 10 / 1.5;
                                player.rightHand.playerToThis2 += player.rightHand.attackPoint2 / 10 / 1.5;

                                player.weapon.angle -= player.weapon.attackAngle / 7 / 1.5;
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
                player.weapon = nowScene.addImage(new Weapon("sword.png", player.rightHand.getCenter("x"), player.rightHand.getCenter("y"), 100, -90, 0.3, player));
                player.weapon.setAnchor(-player.image.width - player.rightHand.image.width / 2, -player.weapon.image.height / 2);
                player.weapon.update = function()
                {
                    player.weapon.attackLTime = Date.now();
                    player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
                    player.weapon.pos.x = player.rightHand.pos.x;
                    player.weapon.pos.y = player.rightHand.pos.y;
                    if(player.attack.attacking == true)
                    {
                        player.weapon.attackCheck();
                    }
                    player.weapon.setZ(3);
                }; break;
            case "SpearMan" :
                player.weapon = nowScene.addImage(new Weapon("spear.png", player.rightHand.getCenter("x"), player.rightHand.getCenter("y"), -10, 0, 0.15, player));
                player.weapon.setAnchor(-player.image.width - player.rightHand.image.width * 3 / 2, -player.weapon.image.height / 2);
                player.weapon.update = function()
                {
                    player.weapon.attackLTime = Date.now();
                    player.weapon.rot =  player.rot + player.weapon.angle / 180 * Math.PI;
                    player.weapon.pos.x = player.rightHand.pos.x - player.weapon.image.width / 5;
                    player.weapon.pos.y = player.rightHand.pos.y + player.weapon.image.height / 3;
                    if(player.attack.attacking == true)
                    {
                        player.weapon.attackCheck();
                    }
                    player.weapon.setZ(3);
                }; break;
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
                    eval("this." + _name + (count++) + " = " + "nowScene.addImage(new GameImage(" + "\"" + _image + "\", " + (j * tempImage.width) + ", " + (i * tempImage.height) + ", " + "\"" + _type + "\"));");
                }
            }
        }
    }
    this.makeEnemy = function(_name, _image)
    {
        eval("this." + _name + (nowScene.enemyList.length) + " = " + "nowScene.addImage(new Enemy(\"" + _image + "\", " + 100 + ", " + 300 + ", " + "this.player" + "));");
    }

    this.player = nowScene.addImage(new Player("player.png", canvas.width / 2, canvas.height / 2, "Warrior"));
    this.enemy1 = nowScene.addImage(new Enemy("enemy1.png", 100, 400, this.player));
    this.cursor = nowScene.addImage(new MousePoint("cursor.png", mouseX, mouseY));
}
gameScene.update = function()
{
    this.checkDeleteImage();
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    if(keys["KeyK"] == 1)
    {
        this.makeShape("object", "playerHand.png", canvas.width, canvas.height, "object");
    }
    if(keys["KeyP"] == 1)
    {
        this.makeEnemy("enemy", "enemy1.png");
    }
}
gameScene.start();