var readyScene = new Scene();

class parts extends GameImage
{    
	constructor(_path, _x, _y)
	{
		super(_path, _x, _y, "parts");
		this.target;
		this.startPos = {x : 0, y : 0};
        this.isClicked = false;
        this.setZ(3);

        this.status = nowScene.addText(new GameText(this.pos.x, this.pos.y + 20, 10, "Arial", "isClicked : "));
	}
	ability()
	{

	}
	clickMove()
	{
		if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, this) && this.isClicked == false)
		{
			this.startPos.x = nowScene.cursor.pos.x;
			this.startPos.y = nowScene.cursor.pos.y;
			this.isClicked = true;
		}
		else if(mouseValue["Left"] <= 0 && this.isClicked == true)
		{
			this.isClicked = false;
		}
		if(mouseValue["Left"] == 2 && this.isClicked == true)
		{
			this.pos.x += nowScene.cursor.pos.x - this.startPos.x;
            this.pos.y += nowScene.cursor.pos.y - this.startPos.y;
            this.startPos.x = nowScene.cursor.pos.x;
			this.startPos.y = nowScene.cursor.pos.y;
		}
    }
	update()
	{
        this.clickMove();
        this.status.pos.x = this.pos.x;
        this.status.pos.y = this.pos.y;
        this.status.text = "isClicked : " + this.isClicked;
	}
}
class Helmet extends parts // 작업중
{
	constructor()
	{
		super("image/parts/head/helmet.png", 100, 100); // x : (pannel.pos.x + pannel.range.x * pannel.partsCnt) y : (pannel.pos.y + pannel.range.y * pannel.partsCnt) 
    }
    ability()
    {

    }
}

readyScene.init = function()
{

    this.jobs = [["image/player/sample/Warrior.png", "Warrior"], 
                ["image/player/sample/Lancer.png", "Lancer"]];
    this.index = 0;
    this.isSelected = false;
    
    this.selectPannel = nowScene.addImage(new GameImage("image/tablet.png", 0, 0, "none"));
    this.selectPannel.name = this.jobs[nowScene.index][1];
    this.selectPannel.setZ(2);
    this.selectPannel.setCanvasCenter();
    
    this.playerImage = nowScene.addImage(new GameImage( "image/player/sample/Warrior.png", canvas.width / 2, canvas.height / 2, "none"));
    this.playerImage.setZ(5);
    this.playerImage.setCenter();
    this.playerImage.changeImage = (_leftRight) =>
    {
        if(_leftRight == "left")
        {
            nowScene.index--;
        }
        else if(_leftRight == "right")
        {
            nowScene.index++;
        }
        this.playerImage.path = this.jobs[nowScene.index][0];
        this.playerImage.setImage();
    }

    this.leftButton = nowScene.addImage(new Button( "image/button/leftArrow.png", canvas.width / 2 - 280, canvas.height / 2));
    this.leftButton.setZ(5);
    this.leftButton.clickEventSet(function()
    {
        if(nowScene.index == 0)
        {
            nowScene.index = nowScene.jobs.length;
        }
        nowScene.playerImage.changeImage("left");
        nowScene.isSelected = false;
    });
    nowScene.updateList.push(this.leftButton);

    this.rightButton = nowScene.addImage(new Button( "image/button/rightArrow.png", canvas.width / 2 + 280, canvas.height / 2));
    this.rightButton.setZ(5);
    this.rightButton.clickEventSet(function()
    {
        if(nowScene.index == nowScene.jobs.length - 1)
        {
            nowScene.index = -1;
        }
        nowScene.playerImage.changeImage("right");
        nowScene.isSelected = false;
    });
    nowScene.updateList.push(this.rightButton);

    this.selectButton = nowScene.addImage(new Button( "image/player/playerHand.png", canvas.width - 400, canvas.height - 200));
    this.selectButton.setZ(5);
    this.selectButton.clickEventSet(function()
    {
        nowScene.isSelected = true;
    });
    nowScene.updateList.push(this.selectButton);

    this.startButton = nowScene.addImage(new Button( "image/player/playerHand.png", canvas.width - 200, canvas.height - 200));
    this.startButton.setZ(5);
    this.startButton.clickEventSet(function()
    {
        if(nowScene.isSelected == true) // 캐릭터가 선택됬는지
        {
            gameScene.settedJob = nowScene.jobs[nowScene.index][1];
            gameScene.start();
        }
        else
        {
            let caution = nowScene.addText(new GameText(canvas.width / 2, 20, 30, "Arial", "직업을 선택하세요!"));
            caution.color.r = 255;

            caution.RTime = Date.now() + 1000;
            caution.update = () =>
            {
                if(LTime >= caution.RTime)
                {
                    caution.opacity -= 0.02;
                }
            }

            caution.isFixed = true;
            caution.setZ(5);
            nowScene.updateList.push(caution);
        }
    });
    nowScene.updateList.push(this.startButton);

    this.helmet = nowScene.addImage(new Helmet());

    this.cam = new Camera();
    this.cursor = nowScene.addImage(new MousePoint( "image/cursor.png", mouseX, mouseY));
}
readyScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
}