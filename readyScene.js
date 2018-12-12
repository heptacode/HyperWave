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

    this.index = 0;
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

    this.selectSkills = [[[new Button("image/icon/notSelected.png", 0, 0, 3), new Button("image/icon/cantSelect.png", 0, 0, 3)],
                        [new Button("image/icon/notSelected.png", 0, 0, 3), new Button("image/icon/notSelected.png", 0, 0, 3)]], 

                        [[new Button("image/icon/notSelected.png", 0, 0, 3), new Button("image/icon/cantSelect.png", 0, 0, 3)],
                        [new Button("image/icon/notSelected.png", 0, 0, 3), new Button("image/icon/notSelected.png", 0, 0, 3)]]];

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

    this.jobName = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameText(nowScene.middlePannel.getCenter("x"), nowScene.playerImage.pos.y + nowScene.playerImage.image.height + 50, 30, "Gugi", nowScene.jobs[nowScene.index][1])));
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
            GameController.sendInfo("player", "job", nowScene.jobs[nowScene.index][1]);
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
                    nowScene.selectPassiveSkills[_num - 1].path = _skill.path;
                    nowScene.selectPassiveSkills[_num - 1].name = _skill.name;
                    nowScene.selectPassiveSkills[_num - 1].isSelected = true;
                }
                else
                {
                    nowScene.selectPassiveSkills[_num - 1].path = "image/icon/notSelected.png";
                    nowScene.selectPassiveSkills[_num - 1].name = "none";
                    nowScene.selectPassiveSkills[_num - 1].isSelected = false;
                    _skill.isSelected = false;
                }
                nowScene.selectPassiveSkills[_num - 1].setImage();
                nowScene.selectPassiveSkills[_num - 1].setAnchor(-nowScene.selectPassiveSkills[_num - 1].image.width / 2, -nowScene.selectPassiveSkills[_num - 1].image.height / 2); break;

            case "active" : 
                if(_how == true)
                {
                    nowScene.selectActiveSkills[_num - 1].path = _skill.path;
                    nowScene.selectActiveSkills[_num - 1].name = _skill.name;
                    nowScene.selectActiveSkills[_num - 1].isSelected = true;
                }
                else
                {
                    nowScene.selectActiveSkills[_num - 1].path = "image/icon/notSelected.png";
                    nowScene.selectActiveSkills[_num - 1].name = "none";
                    nowScene.selectActiveSkills[_num - 1].isSelected = false;
                    _skill.isSelected = false;
                }
                nowScene.selectActiveSkills[_num - 1].setImage();
                nowScene.selectActiveSkills[_num - 1].setAnchor(-nowScene.selectActiveSkills[_num - 1].image.width / 2, -nowScene.selectActiveSkills[_num - 1].image.height / 2); break;
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
            if(nowScene.selectPassiveSkills[i].name != "none")
            {
                nowScene.selectPassiveSkills[i].isSelected = true;
            }
            nowScene.selectPassiveSkills[i].update = () =>
            {
                if(nowScene.selectPassiveSkills[i].isSelected == true)
                {
                    if(Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i]) && nowScene.selectPassiveSkills[i].isShowedImage == false)
                    {
                        // 선택된 스킬의 설명을 보여줌 -> GameImage위에 GameText띄우기
                        nowScene.selectPassiveSkills[i].isShowedImage = true;
                    }
                    else
                    {
                        // 설명 이미지가 있고 그 이미지에서 마우스가 나오면 설명 이미지를 삭제
                    }
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
            nowScene.leftDownPannel.setOnPannel(nowScene.passiveSkills[i]);
            nowScene.passiveSkills[i].setZ(3);
            if(nowScene.passiveSkills[i].name != "none")
            {
                nowScene.passiveSkills[i].setClickEvent(function()
                {
                    if(nowScene.passiveSkills[i].isClicked2 == false)
                    {
                        nowScene.selectButtons.forEach(button => button.isDelete = true);
                        nowScene.selectButtons.forEach(button => button.text.isDelete = true);
    
                        nowScene.passiveSkills.forEach(skill => skill.isClicked2 = false);
                        nowScene.activeSkills.forEach(skill => skill.isClicked2 = false);
                        nowScene.passiveSkills[i].isClicked2 = true;
    
                        let button = nowScene.addThing(new Button("image/button/set.png", nowScene.passiveSkills[i].pos.x + nowScene.passiveSkills[i].image.width * 1.5, nowScene.passiveSkills[i].getCenter("y"), nowScene.passiveSkills[i].z + 1, "selectButton", "장착", 16));
                        button.text.color = {r : 6, g : 226, b : 224};
                        if(nowScene.passiveSkills[i].isSelected == false) // path = 선택버튼
                        {
                            button.setClickEvent(function()
                            {
                                if(nowScene.passiveSkills[i].isClicked2 == true)
                                {
                                    nowScene.selectSkill(nowScene.passiveSkills[i], "passive", 1, true);
                                    nowScene.passiveSkills.forEach(button => button.isSelected = false);
                                    nowScene.passiveSkills[i].isSelected = true;
                                    nowScene.passiveSkills[i].isClicked2 = false;
            
                                    button.isDelete = true;
                                    button.text.isDelete = true;
                                }
                            });
                        }
                        else // path = 해제버튼
                        {
                            button.changeText("해제");
        
                            button.setClickEvent(function()
                            {
                                if(nowScene.passiveSkills[i].isClicked2 == true)
                                {
                                    nowScene.selectSkill(nowScene.passiveSkills[i], "passive", 1, false);
                                    nowScene.passiveSkills[i].isSelected = false;
                                    nowScene.passiveSkills[i].isClicked2 = false;
            
                                    button.isDelete = true;
                                    button.text.isDelete = true;

                                    nowScene.isSelected = false;
                                }
                            });
                        }
                        button.showRTime = Date.now() + 2.5 * 1000;
                        button.updating = () =>
                        {
                            if(Date.now() >= button.showRTime)
                            {
                                if(button.opacity <= 0)
                                {
                                    nowScene.passiveSkills[i].isClicked2 = false;
                                    button.isDelete = true;
                                    button.text.isDelete = true;
                                }
                                button.opacity -= 0.02;
                                button.text.opacity -= 0.02;
                            }
                        }
                        nowScene.selectButtons.push(button);
                        nowScene.passiveSkills[i].isClicked2 = true;
                    }
                });
                nowScene.passiveSkills[i].information = {name : new GameText(nowScene.passiveSkills[i].getCenter("x"), nowScene.passiveSkills[i].pos.y + nowScene.passiveSkills[i].image.height + 2, 15, "Gugi", nowScene.passiveSkills[i].name)}
                nowScene.passiveSkills[i].information.name.pos.y += nowScene.passiveSkills[i].information.name.size;
                nowScene.passiveSkills[i].information.name.color = {r : 6, g : 226, b : 224};
                nowScene.passiveSkills[i].onmouseover = false;
                nowScene.passiveSkills[i].updating = () => // 마우스를 갔다대면 스킬의 이름과 설명 띄우기
                {
                    if(mouseValue["Left"] == 0 && Collision.dotToRect(nowScene.cursor, nowScene.passiveSkills[i]) && nowScene.cursor.isOnTop(nowScene.passiveSkills[i]) == true && nowScene.passiveSkills[i].onmouseover == false)
                    {
                        nowScene.passiveSkills[i].information.name.setZ(nowScene.passiveSkills[i].z + 2);
                        nowScene.passiveSkills[i].information.name.isDelete = false;
                        nowScene.addThing(nowScene.passiveSkills[i].information.name);
    
                        nowScene.passiveSkills[i].onmouseover = true;
                    }
                    else if(mouseValue["Left"] == 0 && !Collision.dotToRect(nowScene.cursor, nowScene.passiveSkills[i]))
                    {
                        nowScene.passiveSkills[i].information.name.isDelete = true;
                        nowScene.passiveSkills[i].onmouseover = false;
                    }
                }
            }
            else
            {
                // 자물쇠 이미지
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
            nowScene.activeSkills[i].selectSkillNum;
            nowScene.leftDownPannel.setOnPannel(nowScene.activeSkills[i]);
            nowScene.activeSkills[i].setZ(3);
            if(nowScene.activeSkills[i].name != "none")
            {
                nowScene.activeSkills[i].setClickEvent(function()
                {
                    if(nowScene.activeSkills[i].isClicked2 == false)
                    {
                        nowScene.selectButtons.forEach(button => button.isDelete = true);
                        nowScene.selectButtons.forEach(button => button.text.isDelete = true);
    
                        nowScene.passiveSkills.forEach(skill => skill.isClicked2 = false);
                        nowScene.activeSkills.forEach(skill => skill.isClicked2 = false);
                        nowScene.activeSkills[i].isClicked2 = true;
    
                        let button1, button2;
    
                        button1 = nowScene.addThing(new Button("image/button/set.png", nowScene.activeSkills[i].pos.x + nowScene.activeSkills[i].image.width * 1.5, nowScene.activeSkills[i].pos.y + 15, nowScene.passiveSkills[i].z + 1, "selectToSkill1", "skill1", 16));
                        button1.text.color = {r : 6, g : 226, b : 224};
                        if(nowScene.activeSkills[i].isSelected == false) // path = 선택버튼
                        {
                            button1.setClickEvent(function()
                            {
                                if(nowScene.activeSkills[i].isClicked2 == true)
                                {
                                    nowScene.selectSkill(nowScene.activeSkills[i], "active", 1, true);
                                    for(let i = 0; i < nowScene.activeSkills.length; i++)
                                    {
                                        if(nowScene.activeSkills[i].selectSkillNum == 1)
                                        {
                                            nowScene.activeSkills[i].isSelected = false;
                                            nowScene.activeSkills[i].selectSkillNum = 0;
                                        }
                                    }
                                    nowScene.activeSkills[i].isSelected = true;
                                    nowScene.activeSkills[i].isClicked2 = false;
                                    nowScene.activeSkills[i].selectSkillNum = 1;
            
            
                                    button1.isDelete = true;
                                    button1.text.isDelete = true;
                                    button2.isDelete = true;
                                    button2.text.isDelete = true;
                                }
                            });
                        }
                        else // path = 해제버튼
                        {
                            button1.pos.y += button1.image.height / 2;
                            button1.changeText("해제");
        
                            button1.setClickEvent(function()
                            {
                                if(nowScene.activeSkills[i].isClicked2 == true)
                                {
                                    nowScene.selectSkill(nowScene.activeSkills[i], "active", nowScene.activeSkills[i].selectSkillNum, false);
                                    nowScene.activeSkills[i].isSelected = false;
                                    nowScene.activeSkills[i].isClicked2 = false;
                                    nowScene.activeSkills[i].selectSkillNum = 0;
            
                                    button1.isDelete = true;
                                    button1.text.isDelete = true;

                                    nowScene.isSelected = false;
                                }
                            });
                        }
                        button1.showRTime = Date.now() + 2.5 * 1000;
                        button1.updating = () =>
                        {
                            if(Date.now() >= button1.showRTime)
                            {
                                if(button1.opacity <= 0)
                                {
                                    nowScene.activeSkills[i].isClicked2 = false;
                                    button1.isDelete = true;
                                    button1.text.isDelete = true;
                                }
                                button1.opacity -= 0.02;
                                button1.text.opacity -= 0.02;
                            }
                        }
                        nowScene.selectButtons.push(button1);
    
                        if(nowScene.activeSkills[i].isSelected == false) // path = 선택버튼
                        {
                            button2 = nowScene.addThing(new Button("image/button/set.png", nowScene.activeSkills[i].pos.x + nowScene.activeSkills[i].image.width * 1.5, nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height - 15, nowScene.passiveSkills[i].z + 1, "selectToSkill2", "skill2", 16));
                            button2.text.color = {r : 6, g : 226, b : 224};
                            button2.setClickEvent(function()
                            {
                                if(nowScene.activeSkills[i].isClicked2 == true)
                                {
                                    nowScene.selectSkill(nowScene.activeSkills[i], "active", 2, true);
                                    for(let i = 0; i < nowScene.activeSkills.length; i++)
                                    {
                                        if(nowScene.activeSkills[i].selectSkillNum == 2)
                                        {
                                            nowScene.activeSkills[i].isSelected = false;
                                            nowScene.activeSkills[i].selectSkillNum = 0;
                                        }
                                    }
                                    nowScene.activeSkills[i].isSelected = true;
                                    nowScene.activeSkills[i].isClicked2 = false;
                                    nowScene.activeSkills[i].selectSkillNum = 2;
            
            
                                    button1.isDelete = true;
                                    button1.text.isDelete = true;
                                    button2.isDelete = true;
                                    button2.text.isDelete = true;
                                }
                            });
                            button2.showRTime = Date.now() + 2.5 * 1000;
                            button2.updating = () =>
                            {
                                if(Date.now() >= button2.showRTime)
                                {
                                    if(button2.opacity <= 0)
                                    {
                                        nowScene.activeSkills[i].isClicked2 = false;
                                        button2.isDelete = true;
                                        button2.text.isDelete = true;
                                    }
                                    button2.opacity -= 0.02;
                                    button2.text.opacity -= 0.02;
                                    }
                            }
                            nowScene.selectButtons.push(button2);
                        }
    
                        nowScene.activeSkills[i].isClicked2 = true;
                    }
                });
                nowScene.activeSkills[i].information = {name : new GameText(nowScene.activeSkills[i].getCenter("x"), nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height + 2, 15, "Gugi", nowScene.activeSkills[i].name)}
                nowScene.activeSkills[i].information.name.pos.y += nowScene.activeSkills[i].information.name.size;
                nowScene.activeSkills[i].information.name.color = {r : 6, g : 226, b : 224};
                nowScene.activeSkills[i].onmouseover = false;
                nowScene.activeSkills[i].updating = () => // 마우스를 갔다대면 스킬의 이름과 설명 띄우기
                {
                    if(mouseValue["Left"] == 0 && Collision.dotToRect(nowScene.cursor, nowScene.activeSkills[i]) && nowScene.cursor.isOnTop(nowScene.activeSkills[i]) == true && nowScene.activeSkills[i].onmouseover == false)
                    {
                        nowScene.activeSkills[i].information.name.setZ(nowScene.activeSkills[i].z + 2);
                        nowScene.activeSkills[i].information.name.isDelete = false;
                        nowScene.addThing(nowScene.activeSkills[i].information.name);
    
                        nowScene.activeSkills[i].onmouseover = true;
                    }
                    else if(mouseValue["Left"] == 0 && !Collision.dotToRect(nowScene.cursor, nowScene.activeSkills[i]))
                    {
                        nowScene.activeSkills[i].information.name.isDelete = true;
                        nowScene.activeSkills[i].onmouseover = false;
                    }
                }
            }
            else if(nowScene.activeSkills[i].name == "none")
            {
                let lock = nowScene.addThing(new GameImage("image/icon/lock.png", nowScene.activeSkills[i].pos.x, nowScene.activeSkills[i].pos.y, "lock"));
                nowScene.leftDownPannel.setOnPannel(lock);
                lock.setZ(nowScene.passiveSkills[i].z + 1);
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

        nowScene.selectButtons.forEach(button => button.isDelete = true);
        nowScene.selectButtons.forEach(button => button.text.isDelete = true);
        nowScene.selectButtons.length = 0;
        nowScene.locks.forEach(lock => lock.isDelete = true);
        nowScene.locks.length = 0;

        if(_dir == "left")
        {
            if(--nowScene.index < 0)
            {
                nowScene.index = nowScene.jobs.length - 1;
            }
        }
        else if(_dir == "right")
        {
            if(++nowScene.index > nowScene.jobs.length - 1)
            {
                nowScene.index = 0;
            }
        }

        nowScene.playerImage.path = nowScene.jobs[nowScene.index][0];
        nowScene.playerImage.setImage();
        nowScene.jobName.text = nowScene.jobs[nowScene.index][1];

        nowScene.skills[nowScene.index][0].forEach(passive => passive.isDelete = false);
        nowScene.skills[nowScene.index][1].forEach(active => active.isDelete = false);
        nowScene.passiveSkills = nowScene.skills[nowScene.index][0].slice();
        nowScene.activeSkills = nowScene.skills[nowScene.index][1].slice();

        nowScene.selectSkills[nowScene.index][0].forEach(passive => passive.isDelete = false);
        nowScene.selectSkills[nowScene.index][1].forEach(active => active.isDelete = false);
        nowScene.selectPassiveSkills = nowScene.selectSkills[nowScene.index][0].slice();
        nowScene.selectActiveSkills = nowScene.selectSkills[nowScene.index][1].slice();
        
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

    this.selectButtons.forEach(button => button.update());
    this.delete(this.selectButtons);
    
    this.cautionList.forEach(caution => caution.update());
    this.delete(this.cautionList);

    this.updateList.forEach(obj => obj.update());
    this.delete(this.updateList);

    this.cam.showFade();
}