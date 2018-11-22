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

        this.status = nowScene.addThing(new GameText(this.pos.x, this.pos.y + 20, 10, "Arial", "isClicked : "));
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

class Pannel
{
    constructor( _x, _y, _width, _heigth)
    {
        this.pos = {x : _x, y : _y};
        this.image = {width : _width, height : _heigth};

        this.onPannel = [];
    }
    getCenter(_xy)
    {
        if(_xy == "x")
        {
            return this.pos.x + this.image.width / 2;
        }
        else if(_xy == "y")
        {
            return this.pos.y + this.image.height / 2;
        }
    }
    setOpacity(_opacity)
    {
        for(let i = 0; i < this.onPannel.length; i++)
        {
            this.onPannel[i].opacity = _opacity;
        }
        this.opacity = _opacity;
    }
    setPosition(_x, _y)
    {
        for(let i = 0; i < this.onPannel.length; i++)
        {
            this.onPannel[i].pos.x += _x - this.pos.x;
            this.onPannel[i].pos.y += _y - this.pos.y;
        }
        this.pos.x = _x;
        this.pos.y = _y;
    }
    setOnPannel(_obj)
    {
        this.onPannel.push(_obj);
        return _obj;
    }
}

readyScene.init = function()
{
    gameScene.selectedInfo = {player : {skill : {passive :  [], active : []}, job : null}};

    this.jobs = [["image/player/sample/Warrior.png", "Warrior"], 
                ["image/player/sample/Lancer.png", "Lancer"]];
    this.skills = [[[new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0)], 
                  [new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0)]],

                  [[new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0)], 
                  [new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0)]]];

    this.index = 0;
    this.isSelected = false;
    
    this.selectPannel = nowScene.addThing(new GameImage("image/tablet.png", 0, 0, "none"));
    this.selectPannel.name = this.jobs[nowScene.index][1];
    this.selectPannel.setZ(2);
    this.selectPannel.setCanvasCenter();
    
    
    // leftDown pannel
    this.leftDownPannel = new Pannel(91, 620, 541, 411);

    this.passiveSkills = [];
    this.activeSkills = [];

    this.selectPassiveSkills = [];
    this.selectActiveSkills = [];

    this.selectButtons = [];


    // middle pannel
    this.middlePannel = new Pannel(648, 50, 624, 981);
    
    this.playerImage = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameImage("image/player/sample/Warrior.png", canvas.width / 2, canvas.height / 2, "none")));
    this.playerImage.setZ(5);
    this.playerImage.setCenter();

    this.leftButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/leftArrow.png", canvas.width / 2 - 280, canvas.height / 2, 5)));
    this.leftButton.setClickEvent(function()
    {
        if(--nowScene.index < 0)
        {
            nowScene.index = nowScene.jobs.length - 1;
        }
        nowScene.switchSetting();
        nowScene.isSelected = false;
    });
    nowScene.updateList.push(this.leftButton);

    this.rightButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/rightArrow.png", canvas.width / 2 + 280, canvas.height / 2, 5)));
    this.rightButton.setClickEvent(function()
    {
        if(++nowScene.index > nowScene.jobs.length - 1)
        {
            nowScene.index = 0;
        }
        nowScene.switchSetting();
        nowScene.isSelected = false;
    });
    nowScene.updateList.push(this.rightButton);

    this.selectButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/select.png", canvas.width / 2, canvas.height - 150, 5, "select")));
    this.selectButton.setClickEvent(function()
    {
        nowScene.isSelected = true;
    });
    this.selectButton.updating = () =>
    {
        if(nowScene.isSelected == true && this.selectButton.isChanged == false)
        {
            this.selectButton.path = "image/button/selected.png";
            this.selectButton.setImage();
            
            this.selectButton.changeText("selected");
            this.selectButton.text.opacity = 0.5;
        }
        else if(nowScene.isSelected == false && this.selectButton.isChanged == true)
        {
            this.selectButton.path = "image/button/select.png";
            this.selectButton.setImage();

            this.selectButton.changeText("select");
            this.selectButton.text.opacity = 1;
            this.selectButton.isChanged = false;
        }
    }
    nowScene.updateList.push(this.selectButton);


    // right pannel
    this.rightPannel = new Pannel(nowScene.middlePannel.pos.x + nowScene.middlePannel.image.width, nowScene.middlePannel.pos.y, 557, nowScene.middlePannel.image.height);

    this.startButton = nowScene.rightPannel.setOnPannel(nowScene.addThing(new Button("image/button/start.png", nowScene.rightPannel.getCenter("x"), canvas.height - 150, 5, "start", 50)));
    this.startButton.setClickEvent(function()
    {
        if(nowScene.isSelected == true) // 캐릭터가 선택됬는지
        {
            GameController.sendInfo("player", "job", nowScene.jobs[nowScene.index][1]);
            GameController.sendInfo("player", "skill", "active", "SwordShot", "KeyK");
            GameController.sendInfo("player", "skill", "active", "SwiftStrike", "ShiftLeft");
            gameScene.start();
        }
        else
        {
            let caution = nowScene.addThing(new GameText(canvas.width / 2, 30, 30, "Arial", "직업을 선택하세요!"));
            caution.color.r = 255;
            caution.setCenter();

            caution.RTime = Date.now() + 1000;
            caution.update = () =>
            {
                if(LTime >= caution.RTime)
                {
                    caution.opacity -= 0.02;
                }
            }

            caution.setZ(5);
            nowScene.updateList.push(caution);
        }
    });
    nowScene.updateList.push(this.startButton);


    // functions
    this.selectSkill = (_skill, _type, _num, _how) =>
    {
        console.log(_skill);
        switch(_type)
        {
            case "passive" : nowScene.selectPassiveSkills[_num - 1].path = _skill.path;
                            nowScene.selectPassiveSkills[_num - 1].setImage();
                            break;
            case "active" : nowScene.selectActiveSkills[_num - 1].path = _skill.path;
                            nowScene.selectActiveSkills[_num - 1].setImage();
                            break;
        }
    }

    this.setSelectIcon = () =>
    {
        for(let i = 0; i < 1; i++)
        {
            let selectImage = new GameImage("image/icon/notSelected.png", nowScene.leftDownPannel.pos.x + 100 + i * 95, canvas.height - 100, "skillIcon", 10, "#00ccff");
            selectImage.isSelected = false;
            selectImage.update = () =>
            {
                if(selectImage.isSelected == true)
                {
                    console.log("^");
                }
            }
            selectImage.setZ(3);
            nowScene.selectPassiveSkills.push(selectImage);
            nowScene.addThing(selectImage);
        }
        
        for(let i = 0; i < 2; i++)
        {
            let selectImage = new GameImage("image/icon/notSelected.png", nowScene.leftDownPannel.pos.x + nowScene.leftDownPannel.image.width / 2 + 20 + i * 135, canvas.height - 100, "skillIcon", 10, "#00ccff");
            selectImage.isSelected = false;
            selectImage.update = () =>
            {
    
            }
            selectImage.setZ(3);
            nowScene.selectPassiveSkills.push(selectImage);
            nowScene.addThing(selectImage);
        }
    }

    this.placeSkills = () => // 작업중
    {
        for(let i = 0; i < nowScene.passiveSkills.length; i++)
        {
            nowScene.passiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + nowScene.passiveSkills[i].image.width * 1.5 * i + 20, y : nowScene.leftDownPannel.pos.y};
            nowScene.passiveSkills[i].isSelected = false;
            nowScene.passiveSkills[i].setZ(3);
            nowScene.passiveSkills[i].setClickEvent(function()
            {
                let button = nowScene.addThing(new Button("image/player/playerHand.png", nowScene.passiveSkills[i].pos.x + nowScene.passiveSkills[i].image.width * 1.5, nowScene.passiveSkills[i].pos.y, nowScene.passiveSkills[i].z + 1));
                if(nowScene.passiveSkills[i].isSelected == false) // path = 선택버튼
                {
                    button.setClickEvent(function()
                    {
                        nowScene.selectSkill(nowScene.passiveSkills[i], "passive", 1, true);
                        nowScene.passiveSkills[i].isSelected = true;
                        button.isDelete = true;
                    });
                }
                else // path = 해제버튼
                {
                    button.path = "image/player/playerHand.png";
                    button.setImage();

                    button.setClickEvent(function()
                    {
                        nowScene.passiveSkills[i].isSelected = false;
                        button.isDelete = true;
                    });
                }
                nowScene.selectButtons.push(button);
            });
            nowScene.addThing(nowScene.passiveSkills[i]);
        }
        for(let i = 0; i < nowScene.activeSkills.length; i++)
        {
            //nowScene.addThing(nowScene.activeSkills[i]);
        }
    }

    this.switchSetting = () =>
    {
        nowScene.passiveSkills.forEach(skill => skill.isDelete = true);
        nowScene.passiveSkills.length = 0;
        nowScene.activeSkills.forEach(skill => skill.isDelete = true);
        nowScene.activeSkills.length = 0;
        nowScene.selectPassiveSkills.forEach(skill => skill.isDelete = true);
        nowScene.selectPassiveSkills.length = 0;
        nowScene.selectActiveSkills.forEach(skill => skill.isDelete = true);
        nowScene.selectActiveSkills.length = 0;

        let passiveSkillslength, activeSkillslength;

        passiveSkillslength = nowScene.skills[nowScene.index][0].length;
        activeSkillslength = nowScene.skills[nowScene.index][1].length;

        nowScene.playerImage.path = nowScene.jobs[nowScene.index][0];
        nowScene.playerImage.setImage();

        for(let i = 0; i < passiveSkillslength; i++)
        {
            nowScene.passiveSkills.push(nowScene.skills[nowScene.index][0][i]);
        }
        for(let i = 0; i < activeSkillslength; i++)
        {
            nowScene.activeSkills.push(nowScene.skills[nowScene.index][1][i]);
        }
        nowScene.placeSkills();
        nowScene.setSelectIcon();
        console.log(nowScene.sceneThingList);
    }
    this.switchSetting();

    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint("image/cursor.png", mouseX, mouseY));
}
readyScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    for(let i = 0; i < this.passiveSkills.length; i++)
    {
        this.passiveSkills[i].update();
    }
    for(let i = 0; i < this.activeSkills.length; i++)
    {
        this.activeSkills[i].update();
    }
    for(let i = 0; i < this.selectPassiveSkills.length; i++)
    {
        this.selectPassiveSkills[i].update();
    }
    for(let i = 0; i < this.selectButtons.length; i++)
    {
        this.selectButtons[i].update();
    }
    this.delete(this.updateList);
    this.delete(this.passiveSkills);
    this.delete(this.activeSkills);
    this.delete(this.selectPassiveSkills);
    this.delete(this.selectActiveSkills);
    this.delete(this.selectButtons);
}