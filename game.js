var gameScene = new Scene();

class Weapon extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "weapon");
        this.angle = 100;
        this.attackAngle = -90;
        this.attackLTime = Date.now();
        this.attackRTime = 0;
        this.attackTime = 0.3;
        this.attackPattern = 1;
    }
    update()
    {
        this.attackLTime = Date.now();
        this.rot =  nowScene.player.rot + this.angle / 180 * Math.PI;
        this.pos.x = nowScene.player.rightHand.pos.x;
        this.pos.y = nowScene.player.rightHand.pos.y;

        this.setZ(3);
    }
    setBasic()
    {
        this.angle = 100;
        this.attackRTime = 0;
        this.attackPattern = 1;
    }
}

class PlayerHand extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "playerHand");
        this.playerToThis1 = 42;
        this.playerToThis2 = 42;

        this.attackPoint1 = 0;
        this.attackPoint2 = 0;
    }
    setAttackPoint(num, point)
    {
        eval("this.attackPoint" + num + " = " + "this.playerToThis" + num + " - " + point + ";");
    }
    setBasic()
    {
        this.playerToThis1 = 42;
        this.playerToThis2 = 42;
    }
}

class Player extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "player");
        this.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", _x, _y));
        this.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", _x, _y));
        this.leftHand.setAttackPoint(1, 12);
        this.leftHand.setAttackPoint(2, 55);
        this.rightHand.setAttackPoint(1, 77);
        this.rightHand.setAttackPoint(2, -40);

        this.pos.x -= this.image.width / 2;
        this.pos.y -= this.image.height / 2;

        this.move = {speed : 500, crash : false, collideAngle : 0};
        this.velocity = new Vector(0, 0);
        this.playerToMouseAngle = 0;
        
        this.attack = {canAttack : true, attacking : false, click : false, weapon : nowScene.addImage(new Weapon("sword.png", this.rightHand.getCenter("x"), this.rightHand.getCenter("y")))};
        this.attack.weapon.setAnchor(-this.image.width - this.rightHand.image.width / 2, -this.attack.weapon.image.height / 2);
    }
    basicAttack() // 작업중
    {
        if(this.attack.weapon.attackPattern == 1)
        {
            if(this.rightHand.playerToThis1 <= 77 && this.rightHand.playerToThis2 >= -40)
            {
                this.rightHand.playerToThis1 -= this.rightHand.attackPoint1 / 10 * 2;
                this.rightHand.playerToThis2 -= this.rightHand.attackPoint2 / 10 * 2;
                this.attack.weapon.angle += this.attack.weapon.attackAngle / 7 * 2;
            }
            else if(this.attack.weapon.attackLTime >= this.attack.weapon.attackRTime + this.attack.weapon.attackTime * 1000)
            {
                this.attack.weapon.attackPattern++;
                this.attack.canAttack = true;
            }
        }
        else if(this.attack.weapon.attackPattern == 2)
        {
            if(this.rightHand.playerToThis1 >= 42 && this.rightHand.playerToThis2 <= 42)
            {
                this.rightHand.playerToThis1 += this.rightHand.attackPoint1 / 10 / 1.5;
                this.rightHand.playerToThis2 += this.rightHand.attackPoint2 / 10 / 1.5;
                this.attack.weapon.angle -= this.attack.weapon.attackAngle / 7 / 1.5;
            }
            else
            {
                this.rightHand.setBasic();
                this.attack.weapon.setBasic();
                this.attack.attacking = false;
            }
        }
    }
    playerAttack()
    {
        if(mouseValue == 1 && this.attack.canAttack == true)
        {
            this.rightHand.setBasic();
            this.attack.canAttack = false;
            this.attack.attacking = true;
            this.attack.click = true;
            this.attack.weapon.attackRTime = Date.now();
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

        if (keys["KeyW"] > 0)
        {
            vY += 10;
        }
        else if (keys["KeyS"] > 0)
        {
            vY -= 10;
        }
        if (keys["KeyA"] > 0)
        {
            vX += 10;
        }
        else if (keys["KeyD"] > 0)
        {
            vX -= 10;
        }

        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(this.move.speed);

        for(let i = 0; i < collisionList.length; i++)
        {
            collisionList[i].pos.x += this.velocity.x * deltaTime;
            collisionList[i].pos.y += this.velocity.y * deltaTime;
        }
    }
    handMove()
    {
        this.leftHand.pos = {x : this.getCenter("x") - this.leftHand.image.width / 2, y : this.getCenter("y") - this.leftHand.image.height / 2};
        this.rightHand.pos = {x : this.getCenter("x") - this.rightHand.image.width / 2, y : this.getCenter("y") - this.rightHand.image.height / 2};

        this.leftHand.pos.x += Math.cos(this.playerToMouseAngle) * this.leftHand.playerToThis1;
        this.leftHand.pos.y += Math.sin(this.playerToMouseAngle) * this.leftHand.playerToThis1;
        let leftHandAngle = this.playerToMouseAngle * (180 / Math.PI) - (this.playerToMouseAngle < -90 ? (-270) : (90));
        this.leftHand.pos.x += Math.cos(leftHandAngle / 180 * Math.PI) * this.leftHand.playerToThis2;
        this.leftHand.pos.y += Math.sin(leftHandAngle / 180 * Math.PI) * this.leftHand.playerToThis2;
        this.leftHand.setZ(4);

        this.rightHand.pos.x += Math.cos(this.playerToMouseAngle) * this.rightHand.playerToThis1;
        this.rightHand.pos.y += Math.sin(this.playerToMouseAngle) * this.rightHand.playerToThis1;
        let rightHandAngle = this.playerToMouseAngle * (180 / Math.PI) - (this.playerToMouseAngle > 90 ? (270) : (-90));
        this.rightHand.pos.x += Math.cos(rightHandAngle / 180 * Math.PI) * this.rightHand.playerToThis2;
        this.rightHand.pos.y += Math.sin(rightHandAngle / 180 * Math.PI) * this.rightHand.playerToThis2;
        this.rightHand.setZ(4);
    }
    collisionSet()
    {
        for(let i = 0; i < collisionList.length; i++)
        {
            if(collisionList[i].type != "enemy")
            {
                if(Math.sqrt(Math.pow(this.getCenter("x") - collisionList[i].getCenter("x"), 2) + Math.pow(this.getCenter("y") - collisionList[i].getCenter("y"), 2)) <= (this.image.height / 2 + collisionList[i].image.height / 2))
                {
                    this.move.crash = true;
                    this.move.collideAngle = Math.atan2(this.pos.y - collisionList[i].pos.y, this.pos.x - collisionList[i].pos.x);
                    this.velocity.set(Math.cos(this.move.collideAngle), Math.sin(this.move.collideAngle));
                    this.velocity.fixSpeed(this.move.speed);

                    for(let i = 0; i < collisionList.length; i++)
                    {
                        collisionList[i].pos.x -= this.velocity.x * deltaTime;
                        collisionList[i].pos.y -= this.velocity.y * deltaTime;
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
        this.attack.weapon.update();
        this.playerAttack();
        this.setAngle();
        this.handMove();
        this.setZ(2);
    }
}
class Enemy extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "enemy");
        this.velocity = new Vector(0, 0);
        this.trackingOn = true;
    }
    playerTracking()
    {
        let enemyToPlayerAngle = Math.atan2(nowScene.player.pos.y - this.pos.y, nowScene.player.pos.x - this.pos.x);
        this.rot = enemyToPlayerAngle;
        let vX = nowScene.player.pos.x - this.pos.x;
        let vY = nowScene.player.pos.y - this.pos.y;
        this.velocity.set(vX, vY);
        this.velocity.fixSpeed(1);
        this.pos.x += this.velocity.x;
        this.pos.y += this.velocity.y;
    }
    collisionSet()
    {
        for(let i = 0; i < collisionList.length; i++)
        {
            if(collisionList[i] != this)
            {
                if(Math.sqrt(Math.pow(this.getCenter("x") - collisionList[i].getCenter("x"), 2) + Math.pow(this.getCenter("y") - collisionList[i].getCenter("y"), 2)) <= (this.image.height / 2 + collisionList[i].image.height / 2))
                {
                    let collideAngle = Math.atan2(collisionList[i].pos.y - this.pos.y, collisionList[i].pos.x - this.pos.x);
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
    preloadImage("player.png");
    preloadImage("playerHand.png");
    preloadImage("sword.png");
    preloadImage("enemy1.png");
    preloadImage("cursor.png");
    this.player = nowScene.addImage(new Player("player.png", canvas.width / 2, canvas.height / 2));
    this.enemy1 = nowScene.addImage(new Enemy("enemy1.png", 100, 400));
    this.cursor = nowScene.addImage(new MousePoint("cursor.png", mouseX, mouseY));
    for(let i = -10; i < 10; i++)
    {
        for(let j = -10; j < 10; j++)
        {
            eval("var object" + (i + 10) + " = " + "nowScene.addImage(new GameImage(" + "\"playerHand.png\"," + (i * 200) + ", " + (j * 200) + ", " + "\"object\"));");
        }
    }
}
gameScene.update = function()
{
    this.player.update();
    this.enemy1.update();
    this.cursor.update();
}
gameScene.start();