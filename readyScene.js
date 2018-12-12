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

        this.status = nowScene.addThing(new GameText(this.pos.x, this.pos.y + 20, 10, "Gugi", "isClicked : "));
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

var selectSkills = [[[new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/cantSelect.png", 0, 0, 2)],
                        [new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/notSelected.png", 0, 0, 2)]], 

                        [[new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/cantSelect.png", 0, 0, 2)],
                        [new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/notSelected.png", 0, 0, 2)]]];

var jobIndex = 0;

readyScene.init = function()
{
    this.cam = new Camera(this.selectPannel);
    this.cursor = nowScene.addThing(new MousePoint("image/cursor.png", mouseX, mouseY));

    gameScene.selectedInfo = {player : {skill : {passive :  [], active : []}, job : null}};

    this.jobs = [["image/player/sample/player.png", "Warrior"], 
                ["image/player/sample/player.png", "Lancer"]];
    this.skills = [[[new Button("image/icon/warrior/passiveSkill/basicAttackDamageUp.png", 0, 0, 0, "basicAttackDamageUp"), new Button("image/icon/warrior/passiveSkill/healthUp.png", 0, 0, 0, "healthUp"),
                  new Button("image/icon/warrior/passiveSkill/basicAttackDamageUp.png", 0, 0, 0, "blooddrain"), new Button("image/icon/warrior/passiveSkill/healthUp.png", 0, 0, 0, "attackSpeedUp"),
                  new Button("image/icon/warrior/passiveSkill/basicAttackDamageUp.png", 0, 0, 0, "attackRangeUp"), new Button("image/icon/warrior/passiveSkill/healthUp.png", 0, 0, 0, "MOD:Berserker")], 

                  [new Button("image/icon/warrior/activeSkill/swordShot.png", 0, 0, 0, "SwordShot"), new Button("image/icon/warrior/activeSkill/swiftStrike.png", 0, 0, 0, "SwiftStrike"),
                  new Button("image/icon/warrior/activeSkill/swordShot.png", 0, 0, 0, "SpinShot"), new Button("image/icon/notSelected.png", 0, 0, 0, "none"),
                  new Button("image/icon/notSelected.png", 0, 0, 0, "none"), new Button("image/icon/notSelected.png", 0, 0, 0, "none")]],


                  [[new Button("image/icon/warrior/passiveSkill/healthUp.png", 0, 0, 0, "basicAttackDamageUp"), new Button("image/icon/warrior/passiveSkill/basicAttackDamageUp.png", 0, 0, 0, "attackSpeedUp"),
                  new Button("image/icon/notSelected.png", 0, 0, 0), new Button("image/icon/notSelected.png", 0, 0, 0),
                  new Button("image/icon/notSelected.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill/basicAttackDamageUp.png", 0, 0, 0, "MOD:Destroyer")],

                  [new Button("image/icon/warrior/activeSkill/swiftStrike.png", 0, 0, 0, "Swing"), new Button("image/icon/warrior/activeSkill/swordShot.png", 0, 0, 0, "Bu-Wang"),
                  new Button("image/icon/notSelected.png", 0, 0, 0), new Button("image/icon/notSelected.png", 0, 0, 0),
                  new Button("image/icon/notSelected.png", 0, 0, 0), new Button("image/icon/notSelected.png", 0, 0, 0)]]];

    this.activeSkillsKey = ["ShiftLeft", "Space"];
    this.isSelected = false;

    this.cautionList = [];
    
    this.background = nowScene.addThing(new GameImage("image/tablet.png", 0, -(1080 - canvas.height) / 2, "none"));
    this.background.update = () =>
    {
        this.background.pos.y = -(1080 - canvas.height) / 2;
    }
    nowScene.updateList.push(this.background);
    this.background.setZ(2);

    this.selectPannel = new Pannel(nowScene.background.pos.x, nowScene.background.pos.y, canvas.width, canvas.height);
    this.selectPannel.update = () =>
    {
        this.selectPannel.setPosition(nowScene.background.pos.x, nowScene.background.pos.y);
    }
    nowScene.updateList.push(this.selectPannel);
    
    
    // leftDown pannel
    this.leftDownPannel = new Pannel(nowScene.selectPannel.pos.x + 52, nowScene.selectPannel.pos.y + 507, 583, 500);
    this.leftDownPannel.update = () =>
    {
        this.leftDownPannel.setPosition(nowScene.selectPannel.pos.x + 52, nowScene.selectPannel.pos.y + 507);

    }
    nowScene.updateList.push(this.leftDownPannel);

    this.passiveSkills = [];
    this.activeSkills = [];

    this.selectPassiveSkills = [];
    this.selectActiveSkills = [];


    this.selectButtons = [];
    this.locks = [];


    // middle pannel
    this.middlePannel = new Pannel(nowScene.selectPannel.pos.x + 648, nowScene.selectPannel.pos.y + 50, 624, 981);
    this.middlePannel.update = () =>
    {
        this.middlePannel.setPosition(nowScene.selectPannel.pos.x + 648, nowScene.selectPannel.pos.y + 50);
    }
    nowScene.updateList.push(this.middlePannel);
    
    this.playerImage = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameImage("image/player/sample/player.png", nowScene.middlePannel.getCenter("x"), nowScene.middlePannel.getCenter("y"), "none")));
    nowScene.middlePannel.setOnPannel(this.playerImage);
    this.playerImage.setZ(5);
    this.playerImage.setCenter();

    this.jobName = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameText(nowScene.middlePannel.getCenter("x"), nowScene.playerImage.pos.y + nowScene.playerImage.image.height + 50, 30, "Gugi", nowScene.jobs[jobIndex][1])));
    this.jobName.color = {r : 6, g : 226, b : 224};
    nowScene.middlePannel.setOnPannel(this.jobName);
    this.jobName.setZ(5);

    this.leftButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/leftArrow.png", nowScene.middlePannel.pos.x + 35, nowScene.middlePannel.getCenter("y"), 3)));
    this.leftButton.setClickEvent(function()
    {
        nowScene.switchSetting("left");
        nowScene.isSelected = false;
    });
    nowScene.middlePannel.setOnPannel(this.leftButton);
    nowScene.updateList.push(this.leftButton);

    this.rightButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/rightArrow.png", nowScene.middlePannel.pos.x + nowScene.middlePannel.image.width - 20, nowScene.middlePannel.getCenter("y"), 3)));
    this.rightButton.setClickEvent(function()
    {
        nowScene.switchSetting("right");
        nowScene.isSelected = false;
    });
    nowScene.middlePannel.setOnPannel(this.rightButton);
    nowScene.updateList.push(this.rightButton);

    this.readyButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/select.png", nowScene.middlePannel.pos.x + 159, nowScene.middlePannel.pos.y + 879, 5, "readyButton")));
    this.readyButton.pos.x += this.readyButton.image.width / 2;
    this.readyButton.strokeWidth = 10;
    this.readyButton.strokeStyle = "#06e2e0"
    this.readyButton.setClickEvent(function()
    {
        if(nowScene.selectPassiveSkills[0].isSelected == true && nowScene.selectActiveSkills[0].isSelected == true && nowScene.selectActiveSkills[1].isSelected == true)
        {
            nowScene.isSelected = true;
        }
        else
        {
            nowScene.addCaution("스킬을 선택하세요!");
        }
    });
    this.readyButton.updating = () =>
    {
        if(nowScene.isSelected == true && this.readyButton.isChanged == false)
        {
            this.readyButton.opacity = 0.3;
        }
        else if(nowScene.isSelected == false)
        {
            this.readyButton.opacity = 1;
            this.readyButton.isChanged = false;
        }
    }
    nowScene.middlePannel.setOnPannel(this.readyButton);
    nowScene.updateList.push(this.readyButton);


    // right pannel
    this.rightPannel = new Pannel(nowScene.selectPannel.pos.x + 1304, nowScene.selectPannel.pos.y, 557, 981);
    this.rightPannel.update = () =>
    {
        this.rightPannel.setPosition(nowScene.selectPannel.pos.x + 1304, nowScene.selectPannel.pos.y);
    }
    nowScene.updateList.push(this.rightPannel);

    this.startButton = nowScene.rightPannel.setOnPannel(nowScene.addThing(new Button("image/button/start.png", nowScene.rightPannel.pos.x + 36, nowScene.rightPannel.pos.y + 835, 5, "startButton")));
    this.startButton.pos.x += this.startButton.image.width / 2;
    this.startButton.pos.y += this.startButton.image.height / 2;
    this.startButton.setClickEvent(function()
    {
        if(nowScene.isSelected == true) // 캐릭터가 선택됬는지
        {
            GameController.sendInfo("player", "job", nowScene.jobs[jobIndex][1]);
            GameController.sendInfo("player", "skill", "passive", nowScene.selectPassiveSkills[0].name);
            GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[0].name, nowScene.activeSkillsKey[0]);
            GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[1].name, nowScene.activeSkillsKey[1]);
            gameScene.start();
        }
        else
        {
            nowScene.addCaution("SELECT 버튼을 누르세요!");
        }
    });
    nowScene.rightPannel.setOnPannel(this.startButton);
    nowScene.updateList.push(this.startButton);


    // functions
    this.addCaution = (_text) =>
    {
        nowScene.cautionList.forEach(caution => caution.maxY += caution.size);

        let caution = nowScene.addThing(new GameText(canvas.width / 2, -20, 30, "Jua", _text));
        caution.opacity = 0;
        caution.color.r = 255;
        caution.maxY = caution.pos.y;
        caution.setCenter();

        caution.RTime = Date.now() + 1000;
        caution.update = () =>
        {
            if(LTime >= caution.RTime)
            {
                caution.opacity -= 0.02;
                caution.pos.y += 0.2;

                if(caution.opacity <= 0)
                {
                    caution.isDelete = true;
                    caution.text.isDelete = true;
                }
            }
            else if(caution.opacity < 1)
            {
                caution.opacity += 0.1;
                caution.pos.y += 4;
            }
            else
            {
                caution.opacity = 1;
            }


            if(caution.pos.y < caution.maxY)
            {
                caution.pos.y += 4;
            }
            else
            {
                caution.maxY = caution.pos.y;
            }
        }

        caution.setZ(5);
        nowScene.cautionList.push(caution);
    }

    this.selectSkill = (_skill, _type, _num, _how) =>
    {
        switch(_type)
        {
            case "passive" : 
                if(_how == true)
                {
                    nowScene.selectPassiveSkills[_num].path = _skill.path;
                    nowScene.selectPassiveSkills[_num].name = _skill.name;
                    nowScene.selectPassiveSkills[_num].isSelected = true;
                }
                else
                {
                    nowScene.selectPassiveSkills[_num].path = "image/icon/notSelected.png";
                    nowScene.selectPassiveSkills[_num].name = "none";
                    nowScene.selectPassiveSkills[_num].isSelected = false;
                    _skill.isSelected = false;
                }
                nowScene.isSelected = false;
                nowScene.selectPassiveSkills[_num].setImage();
                nowScene.selectPassiveSkills[_num].setAnchor(-nowScene.selectPassiveSkills[_num].image.width / 2, -nowScene.selectPassiveSkills[_num].image.height / 2); break;

            case "active" : 
                if(_how == true)
                {
                    if(_num == 0)
                    {
                        if(nowScene.selectActiveSkills[1].name == _skill.name)
                        {
                            let temp = nowScene.selectActiveSkills[0].name;

                            nowScene.selectActiveSkills[0].path = _skill.path;
                            nowScene.selectActiveSkills[0].name = _skill.name;
                            nowScene.selectActiveSkills[0].isSelected = true;

                            for(let i = 0; i < nowScene.activeSkills.length; i++)
                            {
                                if(temp == nowScene.activeSkills[i].name)
                                {
                                    nowScene.selectActiveSkills[1].path = nowScene.activeSkills[i].path;
                                    nowScene.selectActiveSkills[1].name = nowScene.activeSkills[i].name;
                                    nowScene.selectActiveSkills[1].isSelected = true;
                                    nowScene.selectActiveSkills[1].setImage();
                                    nowScene.selectActiveSkills[1].setAnchor(-nowScene.selectActiveSkills[1].image.width / 2, -nowScene.selectActiveSkills[1].image.height / 2);
                                    break;
                                }
                            }
                        }
                        else
                        {
                            nowScene.selectActiveSkills[0].path = _skill.path;
                            nowScene.selectActiveSkills[0].name = _skill.name;
                            nowScene.selectActiveSkills[0].isSelected = true;
                        }
                    }
                    else if(_num == 1)
                    {
                        if(nowScene.selectActiveSkills[0].name == _skill.name)
                        {
                            let temp = nowScene.selectActiveSkills[1].name;
                            
                            nowScene.selectActiveSkills[1].path = _skill.path;
                            nowScene.selectActiveSkills[1].name = _skill.name;
                            nowScene.selectActiveSkills[1].isSelected = true;

                            for(let i = 0; i < nowScene.activeSkills.length; i++)
                            {
                                if(temp == nowScene.activeSkills[i].name)
                                {
                                    nowScene.selectActiveSkills[0].path = nowScene.activeSkills[i].path;
                                    nowScene.selectActiveSkills[0].name = nowScene.activeSkills[i].name;
                                    nowScene.selectActiveSkills[0].isSelected = true;
                                    nowScene.selectActiveSkills[0].setImage();
                                    nowScene.selectActiveSkills[0].setAnchor(-nowScene.selectActiveSkills[0].image.width / 2, -nowScene.selectActiveSkills[0].image.height / 2);
                                    break;
                                }
                            }
                        }
                        else
                        {
                            nowScene.selectActiveSkills[1].path = _skill.path;
                            nowScene.selectActiveSkills[1].name = _skill.name;
                            nowScene.selectActiveSkills[1].isSelected = true;
                        }
                    }
                }
                else
                {
                    nowScene.selectActiveSkills[_num].path = "image/icon/notSelected.png";
                    nowScene.selectActiveSkills[_num].name = "none";
                    nowScene.selectActiveSkills[_num].isSelected = false;
                    _skill.isSelected = false;
                }
                nowScene.isSelected = false;
                nowScene.selectActiveSkills[_num].setImage();
                nowScene.selectActiveSkills[_num].setAnchor(-nowScene.selectActiveSkills[_num].image.width / 2, -nowScene.selectActiveSkills[_num].image.height / 2); break;
        }
    }

    this.setSelectIcon = () =>
    {
        for(let i = 0; i < 2; i++)
        {
            nowScene.selectPassiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + 24 + i * 129, y : nowScene.leftDownPannel.pos.y + 374};
            nowScene.selectPassiveSkills[i].anchor = {x : -nowScene.selectPassiveSkills[i].image.width, y : -nowScene.selectPassiveSkills[i].image.height};
            nowScene.selectPassiveSkills[i].scale = {x : 1.3, y : 1.3};

            nowScene.selectPassiveSkills[i].strokeStyle = "#06e2e0";
            nowScene.selectPassiveSkills[i].strokeWidth = 4;

            nowScene.selectPassiveSkills[i].isShowedImage = false;
            nowScene.selectPassiveSkills[i].isSelected = false;
            nowScene.selectPassiveSkills[i].canChoose = false;

            nowScene.selectPassiveSkills[i].chooseRTime = Date.now();
            nowScene.selectPassiveSkills[i].chooseTime = 7;
            nowScene.selectPassiveSkills[i].blinkRTime = Date.now();
            nowScene.selectPassiveSkills[i].blinkNum = 0;

            if(nowScene.selectPassiveSkills[i].name != "none")
            {
                nowScene.selectPassiveSkills[i].isSelected = true;
            }
            nowScene.selectPassiveSkills[i].update = () =>
            {
                if(nowScene.selectPassiveSkills[i].isSelected == true)
                {
                    if(Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i]))
                    {
                        if(nowScene.selectPassiveSkills[i].isShowedImage == false)
                        {
                            // 선택된 스킬의 설명을 보여줌 -> GameImage위에 GameText띄우기
                            nowScene.selectPassiveSkills[i].isShowedImage = true;
                        }
                    }
                    else
                    {
                        // 설명 이미지가 있고 그 이미지에서 마우스가 나오면 설명 이미지를 삭제
                    }
                    if(mouseValue["Right"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i]))
                    {
                        nowScene.selectSkill(nowScene.selectPassiveSkills[i], "passive", 0, false);
                    }
                }

                if(nowScene.selectPassiveSkills[i].canChoose == true)
                {
                    if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i]))
                    {
                        for(let i = 0; i < nowScene.passiveSkills.length; i++)
                        {
                            if(nowScene.passiveSkills[i].doubleClicked == true)
                            {
                                nowScene.selectSkill(nowScene.passiveSkills[i], "passive", 0, true);

                                nowScene.selectPassiveSkills[0].canChoose = false;
                                nowScene.selectPassiveSkills[0].chooseRTime = 0;
                                nowScene.selectPassiveSkills[0].blinkRTime = 0;
                                nowScene.selectPassiveSkills[0].blinkNum = 0;

                                nowScene.passiveSkills[i].doubleClicked = false;
                                break;
                            }
                        }
                    }
                    if(Date.now() > nowScene.selectPassiveSkills[i].chooseRTime)
                    {
                        nowScene.selectPassiveSkills[i].canChoose = false;
                    }
                    if(Date.now() > nowScene.selectPassiveSkills[i].blinkRTime)
                    {
                        if(nowScene.selectPassiveSkills[i].blinkNum % 2 == 0)
                        {
                            nowScene.selectPassiveSkills[i].strokeStyle = "#ffffff";
                            nowScene.selectPassiveSkills[i].strokeWidth = 6;
                        }
                        else
                        {
                            nowScene.selectPassiveSkills[i].strokeStyle = "#06e2e0";
                            nowScene.selectPassiveSkills[i].strokeWidth = 4;
                        }
                        nowScene.selectPassiveSkills[i].blinkRTime = Date.now() + 0.5 * 1000;
                        nowScene.selectPassiveSkills[i].blinkNum++;
                    }
                }
                else
                {
                    nowScene.selectPassiveSkills[i].strokeStyle = "#06e2e0";
                    nowScene.selectPassiveSkills[i].strokeWidth = 4;
                }
            }
            nowScene.leftDownPannel.setOnPannel(nowScene.addThing(nowScene.selectPassiveSkills[i]));
        }
        
        for(let i = 0; i < 2; i++)
        {
            nowScene.selectActiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + 318 + i * 131, y : nowScene.leftDownPannel.pos.y + 374};
            nowScene.selectActiveSkills[i].anchor = {x : -nowScene.selectActiveSkills[i].image.width, y : -nowScene.selectActiveSkills[i].image.height};
            nowScene.selectActiveSkills[i].scale = {x : 1.3, y : 1.3};

            nowScene.selectActiveSkills[i].strokeStyle = "#06e2e0";
            nowScene.selectActiveSkills[i].strokeWidth = 4;

            nowScene.selectActiveSkills[i].isShowedImage = false;
            nowScene.selectActiveSkills[i].isSelected = false;
            nowScene.selectActiveSkills[i].canChoose = false;

            nowScene.selectActiveSkills[i].chooseRTime = Date.now();
            nowScene.selectActiveSkills[i].chooseTime = 7;
            nowScene.selectActiveSkills[i].blinkRTime = Date.now();
            nowScene.selectActiveSkills[i].blinkNum = 0;
            
            if(nowScene.selectActiveSkills[i].name != "none")
            {
                nowScene.selectActiveSkills[i].isSelected = true;
            }
            nowScene.selectActiveSkills[i].update = () =>
            {
                if(nowScene.selectActiveSkills[i].isSelected == true)
                {
                    if(Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i]) && nowScene.selectActiveSkills[i].isShowedImage == false)
                    {
                        // 선택된 스킬의 설명을 보여줌 -> GameImage위에 GameText띄우기
                        nowScene.selectActiveSkills[i].isShowedImage = true;
                    }
                    else
                    {
                        // 설명 이미지가 있고 그 이미지에서 마우스가 나오면 설명 이미지를 삭제
                    }
                    if(mouseValue["Right"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i]))
                    {
                        nowScene.selectSkill(nowScene.selectActiveSkills[i], "active", i, false);
                    }
                }

                if(nowScene.selectActiveSkills[i].canChoose == true)
                {
                    if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i]))
                    {
                        for(let j = 0; j < nowScene.activeSkills.length; j++)
                        {
                            if(nowScene.activeSkills[j].doubleClicked == true)
                            {
                                nowScene.selectSkill(nowScene.activeSkills[j], "active", i, true);

                                nowScene.selectActiveSkills[0].canChoose = false;
                                nowScene.selectActiveSkills[0].chooseRTime = 0;
                                nowScene.selectActiveSkills[0].blinkRTime = 0;
                                nowScene.selectActiveSkills[0].blinkNum = 0;
                                
                                nowScene.selectActiveSkills[1].canChoose = false;
                                nowScene.selectActiveSkills[1].chooseRTime = 0;
                                nowScene.selectActiveSkills[1].blinkRTime = 0;
                                nowScene.selectActiveSkills[1].blinkNum = 0;

                                nowScene.activeSkills[j].doubleClicked = false;
                                break;
                            }
                        }
                    }
                    if(Date.now() > nowScene.selectActiveSkills[i].chooseRTime)
                    {
                        nowScene.selectActiveSkills[0].canChoose = false;
                        nowScene.selectActiveSkills[0].chooseRTime = 0;
                        nowScene.selectActiveSkills[0].blinkRTime = 0;
                        nowScene.selectActiveSkills[0].blinkNum = 0;
                        
                        nowScene.selectActiveSkills[1].canChoose = false;
                        nowScene.selectActiveSkills[1].chooseRTime = 0;
                        nowScene.selectActiveSkills[1].blinkRTime = 0;
                        nowScene.selectActiveSkills[1].blinkNum = 0;
                    }
                    else if(Date.now() > nowScene.selectActiveSkills[i].blinkRTime)
                    {
                        if(nowScene.selectActiveSkills[i].blinkNum % 2 == 0)
                        {
                            nowScene.selectActiveSkills[i].strokeStyle = "#ffffff";
                            nowScene.selectActiveSkills[i].strokeWidth = 6;
                        }
                        else
                        {
                            nowScene.selectActiveSkills[i].strokeStyle = "#06e2e0";
                            nowScene.selectActiveSkills[i].strokeWidth = 4;
                        }
                        nowScene.selectActiveSkills[i].blinkRTime = Date.now() + 0.5 * 1000;
                        nowScene.selectActiveSkills[i].blinkNum++;
                        console.log("i : " + i + ", num : " + nowScene.selectActiveSkills[i].blinkNum);
                    }
                }
                else
                {
                    nowScene.selectActiveSkills[i].strokeStyle = "#06e2e0";
                    nowScene.selectActiveSkills[i].strokeWidth = 4;
                }
            }
            nowScene.leftDownPannel.setOnPannel(nowScene.addThing(nowScene.selectActiveSkills[i]));
        }
    }

    this.placeSkills = () => // image 추가만 하면됨
    {
        // passive
        let numY = 0;
        for(let i = 0; i < nowScene.passiveSkills.length; i++)
        {
            if(i % 2 == 0 && i != 0)
            {
                numY++;
            }
            nowScene.passiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + nowScene.passiveSkills[i].image.width / 2 + (i % 2) * (nowScene.passiveSkills[i].image.width + 70), y : nowScene.leftDownPannel.pos.y + 18 + numY * (nowScene.passiveSkills[i].image.height + 29)};
            nowScene.passiveSkills[i].strokeWidth = 5;
            nowScene.passiveSkills[i].strokeStyle = "#06e2e0";

            nowScene.passiveSkills[i].isSelected = false;
            nowScene.passiveSkills[i].isClicked2 = false;
            nowScene.passiveSkills[i].isClicked3 = false;

            nowScene.passiveSkills[i].doubleRTime = Date.now();
            nowScene.passiveSkills[i].doubleClicked = false;

            nowScene.passiveSkills[i].startPos = {x : 0, y : 0};
            nowScene.passiveSkills[i].tempPos = {x : 0, y : 0};

            nowScene.passiveSkills[i].information = {name : new GameText(nowScene.passiveSkills[i].getCenter("x"), nowScene.passiveSkills[i].pos.y + nowScene.passiveSkills[i].image.height + 2, 15, "Gugi", nowScene.passiveSkills[i].name)}
            nowScene.passiveSkills[i].information.name.pos.y += nowScene.passiveSkills[i].information.name.size;
            nowScene.passiveSkills[i].information.name.color = {r : 6, g : 226, b : 224};
            nowScene.passiveSkills[i].onmouseover = false;

            nowScene.leftDownPannel.setOnPannel(nowScene.passiveSkills[i]);
            nowScene.passiveSkills[i].setZ(3);

            if(nowScene.passiveSkills[i].name != "none")
            {
                nowScene.passiveSkills[i].updating = () =>
                {
                    if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.passiveSkills[i]) && nowScene.passiveSkills[i].isClicked3 == false && nowScene.cursor.isOnTop(nowScene.passiveSkills[i]) == true)
                    {
                        if(nowScene.passiveSkills[i].doubleRTime > Date.now())
                        {
                            nowScene.selectPassiveSkills[0].canChoose = true;
                            nowScene.selectPassiveSkills[0].chooseRTime = Date.now() + nowScene.selectPassiveSkills[0].chooseTime * 1000;
                            nowScene.selectPassiveSkills[0].blinkRTime = Date.now();

                            nowScene.passiveSkills[i].doubleClicked = true;
                        }
                        else
                        {
                            nowScene.passiveSkills[i].doubleRTime = Date.now() + 0.3 * 1000;
                        }
                        nowScene.passiveSkills[i].startPos = {x : nowScene.cursor.pos.x, y : nowScene.cursor.pos.y};
                        nowScene.passiveSkills[i].tempPos = {x : nowScene.passiveSkills[i].pos.x, y : nowScene.passiveSkills[i].pos.y};
                        nowScene.passiveSkills[i].isClicked3 = true;
                        nowScene.passiveSkills[i].setZ(4);
                    }
                    else if(mouseValue["Left"] <= 0 && nowScene.passiveSkills[i].isClicked3 == true)
                    {
                        nowScene.passiveSkills[i].isClicked3 = false;
                        if(Collision.rect(nowScene.passiveSkills[i], nowScene.selectPassiveSkills[0]) == true)
                        {
                            nowScene.selectSkill(nowScene.passiveSkills[i], "passive", 0, true);
                            nowScene.passiveSkills[i].isSelected = true;
                            nowScene.passiveSkills[i].isClicked2 = false;
                            nowScene.passiveSkills[i].setZ(2);
                        }
                        nowScene.passiveSkills[i].pos = nowScene.passiveSkills[i].tempPos;
                    }
                    if(mouseValue["Left"] == 2 && nowScene.passiveSkills[i].isClicked3 == true)
                    {
                        nowScene.passiveSkills[i].pos.x += nowScene.cursor.pos.x - nowScene.passiveSkills[i].startPos.x;
                        nowScene.passiveSkills[i].pos.y += nowScene.cursor.pos.y - nowScene.passiveSkills[i].startPos.y;
                        nowScene.passiveSkills[i].startPos.x = nowScene.cursor.pos.x;
                        nowScene.passiveSkills[i].startPos.y = nowScene.cursor.pos.y;
                    }
                    if(mouseValue["Left"] == 0 && Collision.dotToRect(nowScene.cursor, nowScene.passiveSkills[i]) && nowScene.cursor.isOnTop(nowScene.passiveSkills[i]) == true && nowScene.passiveSkills[i].onmouseover == false)
                    {
                        nowScene.passiveSkills[i].information.name.setZ(nowScene.passiveSkills[i].z);
                        nowScene.passiveSkills[i].information.name.isDelete = false;
                        nowScene.addThing(nowScene.passiveSkills[i].information.name);
    
                        nowScene.passiveSkills[i].onmouseover = true;
                    }
                    else if(mouseValue["Left"] == 0 && !Collision.dotToRect(nowScene.cursor, nowScene.passiveSkills[i]))
                    {
                        nowScene.passiveSkills[i].information.name.isDelete = true;
                        nowScene.passiveSkills[i].onmouseover = false;
                    }

                    nowScene.passiveSkills[i].information.name.pos = {x : nowScene.passiveSkills[i].getCenter("x"), y : nowScene.passiveSkills[i].pos.y + nowScene.passiveSkills[i].image.height + 2 + nowScene.passiveSkills[i].information.name.size};
                }
            }
            else
            {   
                nowScene.passiveSkills[i].setZ(nowScene.passiveSkills[i].z - 1);
                let lock = nowScene.addThing(new GameImage("image/icon/lock.png", nowScene.passiveSkills[i].pos.x, nowScene.passiveSkills[i].pos.y, "lock"));
                nowScene.leftDownPannel.setOnPannel(lock);
                lock.setZ(nowScene.passiveSkills[i].z + 1);
                nowScene.locks.push(lock);
            }
            nowScene.addThing(nowScene.passiveSkills[i]);
        }
        numY = 0;

        // active
        for(let i = 0; i < nowScene.activeSkills.length; i++)
        {
            if(i % 2 == 0 && i != 0)
            {
                numY++;
            }
            nowScene.activeSkills[i].pos = {x : nowScene.leftDownPannel.getCenter("x") - 5 + nowScene.activeSkills[i].image.width / 2 + (i % 2) * (nowScene.activeSkills[i].image.width + 70), y : nowScene.leftDownPannel.pos.y + 18 + numY * (nowScene.activeSkills[i].image.height + 29)};
            nowScene.activeSkills[i].strokeWidth = 5;
            nowScene.activeSkills[i].strokeStyle = "#06e2e0";

            nowScene.activeSkills[i].isSelected = false;
            nowScene.activeSkills[i].isClicked2 = false;
            nowScene.activeSkills[i].isClicked3 = false;

            nowScene.activeSkills[i].doubleRTime = Date.now();
            nowScene.activeSkills[i].doubleClicked = false;

            nowScene.activeSkills[i].startPos = {x : 0, y : 0};
            nowScene.activeSkills[i].tempPos = {x : 0, y : 0};

            nowScene.activeSkills[i].information = {name : new GameText(nowScene.activeSkills[i].getCenter("x"), nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height + 2, 15, "Gugi", nowScene.activeSkills[i].name)}
            nowScene.activeSkills[i].information.name.pos.y += nowScene.activeSkills[i].information.name.size;
            nowScene.activeSkills[i].information.name.color = {r : 6, g : 226, b : 224};
            nowScene.activeSkills[i].onmouseover = false;

            nowScene.leftDownPannel.setOnPannel(nowScene.activeSkills[i]);
            nowScene.activeSkills[i].setZ(3);

            if(nowScene.activeSkills[i].name != "none")
            {
                nowScene.activeSkills[i].updating = () =>
                {
                    if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.activeSkills[i]) && nowScene.activeSkills[i].isClicked3 == false && nowScene.cursor.isOnTop(nowScene.activeSkills[i]) == true)
                    {
                        if(nowScene.activeSkills[i].doubleRTime > Date.now())
                        {
                            nowScene.selectActiveSkills[0].canChoose = true;
                            nowScene.selectActiveSkills[0].chooseRTime = Date.now() + nowScene.selectActiveSkills[0].chooseTime * 1000;
                            nowScene.selectActiveSkills[0].blinkRTime = Date.now();

                            nowScene.selectActiveSkills[1].canChoose = true;
                            nowScene.selectActiveSkills[1].chooseRTime = Date.now() + nowScene.selectActiveSkills[1].chooseTime * 1000;
                            nowScene.selectActiveSkills[1].blinkRTime = Date.now();

                            nowScene.activeSkills[i].doubleClicked = true;
                        }
                        else
                        {
                            nowScene.activeSkills[i].doubleRTime = Date.now() + 0.3 * 1000;
                        }

                        nowScene.activeSkills[i].startPos = {x : nowScene.cursor.pos.x, y : nowScene.cursor.pos.y};
                        nowScene.activeSkills[i].tempPos = {x : nowScene.activeSkills[i].pos.x, y : nowScene.activeSkills[i].pos.y};
                        nowScene.activeSkills[i].isClicked3 = true;
                        nowScene.activeSkills[i].setZ(4);
                    }
                    else if(mouseValue["Left"] <= 0 && nowScene.activeSkills[i].isClicked3 == true)
                    {
                        nowScene.activeSkills[i].isClicked3 = false;
                        if(Collision.rect(nowScene.activeSkills[i], nowScene.selectActiveSkills[0]) == true)
                        {
                            nowScene.selectSkill(nowScene.activeSkills[i], "active", 0, true);
                            nowScene.activeSkills[i].isSelected = true;
                            nowScene.activeSkills[i].isClicked2 = false;
                            nowScene.activeSkills[i].setZ(2);
                        }
                        else if(Collision.rect(nowScene.activeSkills[i], nowScene.selectActiveSkills[1]) == true)
                        {
                            nowScene.selectSkill(nowScene.activeSkills[i], "active", 1, true);
                            nowScene.activeSkills[i].isSelected = true;
                            nowScene.activeSkills[i].isClicked2 = false;
                            nowScene.activeSkills[i].setZ(2);
                        }
                        nowScene.activeSkills[i].pos = nowScene.activeSkills[i].tempPos;
                    }
                    if(mouseValue["Left"] == 2 && nowScene.activeSkills[i].isClicked3 == true)
                    {
                        nowScene.activeSkills[i].pos.x += nowScene.cursor.pos.x - nowScene.activeSkills[i].startPos.x;
                        nowScene.activeSkills[i].pos.y += nowScene.cursor.pos.y - nowScene.activeSkills[i].startPos.y;
                        nowScene.activeSkills[i].startPos.x = nowScene.cursor.pos.x;
                        nowScene.activeSkills[i].startPos.y = nowScene.cursor.pos.y;
                    }
                    if(mouseValue["Left"] == 0 && Collision.dotToRect(nowScene.cursor, nowScene.activeSkills[i]) && nowScene.cursor.isOnTop(nowScene.activeSkills[i]) == true && nowScene.activeSkills[i].onmouseover == false)
                    {
                        nowScene.activeSkills[i].information.name.setZ(nowScene.activeSkills[i].z);
                        nowScene.activeSkills[i].information.name.isDelete = false;
                        nowScene.addThing(nowScene.activeSkills[i].information.name);
    
                        nowScene.activeSkills[i].onmouseover = true;
                    }
                    else if(mouseValue["Left"] == 0 && !Collision.dotToRect(nowScene.cursor, nowScene.activeSkills[i]))
                    {
                        nowScene.activeSkills[i].information.name.isDelete = true;
                        nowScene.activeSkills[i].onmouseover = false;
                    }

                    nowScene.activeSkills[i].information.name.pos = {x : nowScene.activeSkills[i].getCenter("x"), y : nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height + 2 + nowScene.activeSkills[i].information.name.size};
                }
            }
            else
            {   
                nowScene.activeSkills[i].setZ(nowScene.activeSkills[i].z - 1);
                let lock = nowScene.addThing(new GameImage("image/icon/lock.png", nowScene.activeSkills[i].pos.x, nowScene.activeSkills[i].pos.y, "lock"));
                nowScene.leftDownPannel.setOnPannel(lock);
                lock.setZ(nowScene.activeSkills[i].z + 1);
                nowScene.locks.push(lock);
            }
            nowScene.addThing(nowScene.activeSkills[i]);
        }
    }

    this.switchSetting = (_dir) =>
    {
        nowScene.passiveSkills.forEach(skill => skill.isDelete = true);
        nowScene.passiveSkills.length = 0;
        nowScene.activeSkills.forEach(skill => skill.isDelete = true);
        nowScene.activeSkills.length = 0;

        nowScene.selectPassiveSkills.forEach(passive => passive.isDelete = true);
        nowScene.selectPassiveSkills.length = 0;
        nowScene.selectActiveSkills.forEach(active => active.isDelete = true);
        nowScene.selectActiveSkills.length = 0;

        nowScene.locks.forEach(lock => lock.isDelete = true);
        nowScene.locks.length = 0;

        if(_dir == "left")
        {
            if(--jobIndex < 0)
            {
                jobIndex = nowScene.jobs.length - 1;
            }
        }
        else if(_dir == "right")
        {
            if(++jobIndex > nowScene.jobs.length - 1)
            {
                jobIndex = 0;
            }
        }

        nowScene.playerImage.path = nowScene.jobs[jobIndex][0];
        nowScene.playerImage.setImage();
        nowScene.jobName.text = nowScene.jobs[jobIndex][1];

        nowScene.skills[jobIndex][0].forEach(passive => passive.isDelete = false);
        nowScene.skills[jobIndex][1].forEach(active => active.isDelete = false);
        nowScene.passiveSkills = nowScene.skills[jobIndex][0].slice();
        nowScene.activeSkills = nowScene.skills[jobIndex][1].slice();

        selectSkills[jobIndex][0].forEach(passive => passive.isDelete = false);
        selectSkills[jobIndex][1].forEach(active => active.isDelete = false);
        nowScene.selectPassiveSkills = selectSkills[jobIndex][0].slice();
        nowScene.selectActiveSkills = selectSkills[jobIndex][1].slice();
        
        nowScene.setSelectIcon();
        nowScene.placeSkills();
    }

    this.switchSetting();
}
readyScene.update = function()
{
    this.passiveSkills.forEach(skill => skill.update());
    this.delete(this.passiveSkills);
    this.activeSkills.forEach(skill => skill.update());
    this.delete(this.activeSkills);

    this.selectPassiveSkills.forEach(passive => passive.update());
    this.delete(this.selectPassiveSkills);
    this.selectActiveSkills.forEach(acitve => acitve.update());
    this.delete(this.selectActiveSkills);
    
    this.cautionList.forEach(caution => caution.update());
    this.delete(this.cautionList);

    this.updateList.forEach(obj => obj.update());
    this.delete(this.updateList);

    this.cam.showFade();
}