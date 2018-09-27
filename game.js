var gameScene = new Scene();

class Weapon extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "weapon");
        this.angle = 0;
    }
}

class PlayerHand extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "playerHand");
        this.playerToThis = 43;
    }
}

class Player extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "player");
        this.leftHand = nowScene.addImage(new PlayerHand("playerHand.png", _x, _y));
        this.rightHand = nowScene.addImage(new PlayerHand("playerHand.png", _x, _y));

        this.pos.x -= this.image.width / 2;
        this.pos.y -= this.image.height / 2;

        this.move = {speed : 500, crash : false, collideAngle : 0};
        this.velocity = new Vector(0, 0);
        
        this.attack = {canAttack : true, attacking : false, attackAngle : 0, weapon : nowScene.addImage(new Weapon("sword.png", this.rightHand.getCenter("x"), this.rightHand.getCenter("y")))};
        this.attack.weapon.setAnchor(-this.image.width - this.rightHand.image.width / 2, -this.attack.weapon.image.height / 2);
    }
    basicAttack() // 작업중
    {
        
        this.attack.canAttack = false;
    }
    playerAttack()
    {
        if(mouseValue == 1)
        {
            this.basicAttack();
        }
    }
    setAngle()
    {
        let playerToMouseAngle = Math.atan2(nowScene.cursor.getCenter("y") - this.getCenter("y"), nowScene.cursor.getCenter("x") - this.getCenter("x"));
        this.rot = playerToMouseAngle;
        this.leftHand.rot = playerToMouseAngle;
        if(this.attack.attacking == false)
        {
            this.rightHand.rot = playerToMouseAngle;
        }
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
        let leftHandPos = {x : this.getCenter("x") - this.leftHand.image.width / 2, y : this.getCenter("y") - this.leftHand.image.height / 2};
        let rightHandPos = {x : this.getCenter("x") - this.rightHand.image.width / 2, y : this.getCenter("y") - this.rightHand.image.height / 2};
        let handAngle = Math.atan2(nowScene.cursor.getCenter("y") - (this.getCenter("y")), nowScene.cursor.getCenter("x") - (this.getCenter("x")));

        this.leftHand.pos = leftHandPos;
        this.rightHand.pos = rightHandPos;

        this.leftHand.pos.x += Math.cos(handAngle) * this.leftHand.playerToThis;
        this.leftHand.pos.y += Math.sin(handAngle) * this.leftHand.playerToThis;
        let leftHandAngle = handAngle * (180 / Math.PI) - (handAngle < -90 ? (-270) : (90));
        this.leftHand.pos.x += Math.cos(leftHandAngle / 180 * Math.PI) * 32;
        this.leftHand.pos.y += Math.sin(leftHandAngle / 180 * Math.PI) * 32;
        this.leftHand.setZ(3);

        this.rightHand.pos.x += Math.cos(handAngle) * this.rightHand.playerToThis;
        this.rightHand.pos.y += Math.sin(handAngle) * this.rightHand.playerToThis;
        let rightHandAngle = handAngle * (180 / Math.PI) - (handAngle > 90 ? (270) : (-90));
        this.rightHand.pos.x += Math.cos(rightHandAngle / 180 * Math.PI) * 32;
        this.rightHand.pos.y += Math.sin(rightHandAngle / 180 * Math.PI) * 32;
        this.rightHand.setZ(3);
    }
    weaponUpdate()
    {
        this.attack.weapon.rot = this.rot + (this.attack.weapon.angle / 180 * Math.PI);
        this.attack.weapon.pos.x = this.rightHand.pos.x;
        this.attack.weapon.pos.y = this.rightHand.pos.y;

        this.attack.weapon.setZ(4);
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
        this.setAngle();
        this.moving();
        this.collisionSet();
        this.handMove();
        this.weaponUpdate();
        if(this.attack.canAttack == true)
        {
            this.playerAttack();
        }
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