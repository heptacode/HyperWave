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
    this.skills = [[[new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0, "passive1"), new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0, "passvie2")], 
                  [new Button("image/icon/warrior/activeSkill1.png", 0, 0, 0, "SwordShot"), new Button("image/icon/warrior/activeSkill2.png", 0, 0, 0, "SwiftStrike")]],

                  [[new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0)], 
                  [new Button("image/icon/warrior/passiveSkill2.png", 0, 0, 0), new Button("image/icon/warrior/passiveSkill1.png", 0, 0, 0)]]];

    this.index = 0;
    this.activeSkillsKey = ["ShiftLeft", "Space"];
    this.isSelected = false;

    this.cautionList = [];
    
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

    this.readyButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/select.png", canvas.width / 2, canvas.height - 150, 5, "readyButton", "ready?")));
    this.readyButton.setClickEvent(function()
    {
        if(nowScene.selectPassiveSkills[0].isSelected == true && nowScene.selectActiveSkills[0].isSelected == true && nowScene.selectActiveSkills[1].isSelected)
        {
            nowScene.isSelected = true;
        }
        else
        {
            let caution = nowScene.addThing(new GameText(canvas.width / 2, 30, 30, "Arial", "스킬을 선택하세요!"));
            caution.color.r = 255;
            caution.setCenter();

            caution.RTime = Date.now() + 1000;
            caution.update = () =>
            {
                if(LTime >= caution.RTime)
                {
                    if(caution.opacity <= 0)
                    {
                        caution.isDelete = true;
                        caution.text.isDelete = true;
                    }
                    caution.opacity -= 0.02;
                    caution.pos.y += 0.2;
                }
            }

            caution.setZ(5);
            nowScene.cautionList.push(caution);
        }
    });
    this.readyButton.updating = () =>
    {
        if(nowScene.isSelected == true && this.readyButton.isChanged == false)
        {
            this.readyButton.path = "image/button/selected.png";
            this.readyButton.setImage();
            
            this.readyButton.changeText("ready");
            this.readyButton.text.opacity = 0.5;
        }
        else if(nowScene.isSelected == false && this.readyButton.isChanged == true)
        {
            this.readyButton.path = "image/button/select.png";
            this.readyButton.setImage();

            this.readyButton.changeText("ready");
            this.readyButton.text.opacity = 1;
            this.readyButton.isChanged = false;
        }
    }
    nowScene.updateList.push(this.readyButton);


    // right pannel
    this.rightPannel = new Pannel(nowScene.middlePannel.pos.x + nowScene.middlePannel.image.width, nowScene.middlePannel.pos.y, 557, nowScene.middlePannel.image.height);

    this.startButton = nowScene.rightPannel.setOnPannel(nowScene.addThing(new Button("image/button/start.png", nowScene.rightPannel.getCenter("x"), canvas.height - 150, 5, "startButton", "start", 50)));
    this.startButton.setClickEvent(function()
    {
        if(nowScene.isSelected == true) // 캐릭터가 선택됬는지
        {
            GameController.sendInfo("player", "job", nowScene.jobs[nowScene.index][1]);
            GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[0].name, nowScene.activeSkillsKey[0]);
            GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[1].name, nowScene.activeSkillsKey[1]);
            gameScene.start();
        }
        else
        {
            let caution = nowScene.addThing(new GameText(canvas.width / 2, 30, 30, "Arial", "준비버튼을 누르세요!"));
            caution.color.r = 255;
            caution.setCenter();

            caution.RTime = Date.now() + 1000;
            caution.update = () =>
            {
                if(LTime >= caution.RTime)
                {
                    if(caution.opacity <= 0)
                    {
                        caution.isDelete = true;
                        caution.text.isDelete = true;
                    }
                    caution.opacity -= 0.02;
                    caution.pos.y += 0.2;
                }
            }

            caution.setZ(5);
            nowScene.cautionList.push(caution);
        }
    });
    nowScene.updateList.push(this.startButton);


    // functions
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
                    _skill.isSelected = false;
                }
                nowScene.selectPassiveSkills[_num - 1].setImage(); break;

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
                    _skill.isSelected = false;
                }
                nowScene.selectActiveSkills[_num - 1].setImage(); break;
        }
    }

    this.setSelectIcon = () => // 나중에 작업
    {
        for(let i = 0; i < 1; i++)
        {
            let selectImage = new GameImage("image/icon/notSelected.png", nowScene.leftDownPannel.pos.x + 100 + i * 95, nowScene.leftDownPannel.pos.y + nowScene.leftDownPannel.image.height - 75 * 2, "skillIcon", 10, "#00ccff");
            selectImage.isSetted
            selectImage.isSelected = false;
            selectImage.isShowedImage = false;
            selectImage.update = () =>
            {
                if(selectImage.isSelected == true)
                {
                    if(Collision.dotToRect(nowScene.cursor, selectImage) && selectImage.isShowedImage == false)
                    {
                        // 선택된 스킬의 설명을 보여줌 -> GameImage위에 GameText띄우기
                        selectImage.isShowedImage = true;
                    }
                    else
                    {
                        // 설명 이미지가 있고 그 이미지에서 마우스가 나오면 설명 이미지를 삭제
                    }
                }
            }
            selectImage.setZ(3);
            nowScene.selectPassiveSkills.push(selectImage);
            nowScene.addThing(selectImage);
        }
        
        for(let i = 0; i < 2; i++)
        {
            let selectImage = new GameImage("image/icon/notSelected.png", nowScene.leftDownPannel.pos.x + nowScene.leftDownPannel.image.width / 2 + 20 + i * 135, nowScene.leftDownPannel.pos.y + nowScene.leftDownPannel.image.height - 75 * 2, "skillIcon", 10, "#00ccff");
            selectImage.isSelected = false;
            selectImage.update = () =>
            {
    
            }
            selectImage.setZ(3);
            nowScene.selectActiveSkills.push(selectImage);
            nowScene.addThing(selectImage);
        }
    }

    this.placeSkills = () => // image 추가만 하면됨
    {
        // passive
        for(let i = 0; i < nowScene.passiveSkills.length; i++)
        {
            nowScene.passiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + nowScene.passiveSkills[i].image.width * 1.5 * i + 20, y : nowScene.leftDownPannel.pos.y};
            nowScene.passiveSkills[i].isSelected = false;
            nowScene.passiveSkills[i].isClicked2 = false;
            nowScene.passiveSkills[i].setZ(3);
            nowScene.passiveSkills[i].setClickEvent(function()
            {
                if(nowScene.passiveSkills[i].isClicked2 == false)
                {
                    nowScene.selectButtons.forEach(button => button.isDelete = true);
                    nowScene.selectButtons.forEach(button => button.text.isDelete = true);

                    nowScene.passiveSkills.forEach(skill => skill.isClicked2 = false);
                    nowScene.activeSkills.forEach(skill => skill.isClicked2 = false);
                    nowScene.passiveSkills[i].isClicked2 = true;

                    let button = nowScene.addThing(new Button("image/player/playerHand.png", nowScene.passiveSkills[i].pos.x + nowScene.passiveSkills[i].image.width * 1.5, nowScene.passiveSkills[i].getCenter("y"), nowScene.passiveSkills[i].z + 1, "selectButton", "장착", 10));
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
                        button.path = "image/player/playerHand.png";
                        button.setImage();
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
            nowScene.passiveSkills[i].updating = () => // 마우스를 갔다대면 스킬의 이름과 설명 띄우기
            {

            }
            nowScene.addThing(nowScene.passiveSkills[i]);
        }
        // active
        for(let i = 0; i < nowScene.activeSkills.length; i++)
        {
            nowScene.activeSkills[i].pos = {x : nowScene.leftDownPannel.getCenter("x") + nowScene.activeSkills[i].image.width * 1.5 * i + 20, y : nowScene.leftDownPannel.pos.y};
            nowScene.activeSkills[i].isSelected = false;
            nowScene.activeSkills[i].isClicked2 = false;
            nowScene.activeSkills[i].selectSkillNum;
            nowScene.activeSkills[i].setZ(3);
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

                    button1 = nowScene.addThing(new Button("image/player/playerHand.png", nowScene.activeSkills[i].pos.x + nowScene.activeSkills[i].image.width * 1.5, nowScene.activeSkills[i].pos.y + 15, nowScene.passiveSkills[i].z + 1, "selectToSkill1", "skill1에 장착", 10));
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
                        button1.path = "image/player/playerHand.png";
                        button1.setImage();
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
                                button2.isDelete = true;
                                button2.text.isDelete = true;
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
                        button2 = nowScene.addThing(new Button("image/player/playerHand.png", nowScene.activeSkills[i].pos.x + nowScene.activeSkills[i].image.width * 1.5, nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height - 15, nowScene.passiveSkills[i].z + 1, "selectToSkill2", "skill2에 장착", 10));
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
            nowScene.activeSkills[i].updating = () => // 마우스를 갔다대면 스킬의 이름과 설명 띄우기
            {

            }
            nowScene.addThing(nowScene.activeSkills[i]);
        
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
        nowScene.selectButtons.forEach(button => button.isDelete = true);
        nowScene.selectButtons.forEach(button => button.text.isDelete = true);
        nowScene.selectButtons.length = 0;

        nowScene.playerImage.path = nowScene.jobs[nowScene.index][0];
        nowScene.playerImage.setImage();

        nowScene.skills[nowScene.index][0].forEach(passive => passive.isDelete = false);
        nowScene.skills[nowScene.index][1].forEach(active => active.isDelete = false);

        nowScene.passiveSkills = nowScene.skills[nowScene.index][0].slice();
        nowScene.activeSkills = nowScene.skills[nowScene.index][1].slice();
        
        nowScene.setSelectIcon();
        nowScene.placeSkills();
        console.log(nowScene.sceneThingList);
    }
    this.switchSetting();

    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint("image/cursor.png", mouseX, mouseY));
}
readyScene.update = function()
{
    this.updateList.forEach(obj => obj.update());
    this.delete(this.updateList);

    this.passiveSkills.forEach(skill => skill.update());
    this.delete(this.passiveSkills);
    this.activeSkills.forEach(skill => skill.update());
    this.delete(this.activeSkills);

    this.selectPassiveSkills.forEach(skill => skill.update());
    this.delete(this.selectPassiveSkills);
    this.selectActiveSkills.forEach(skill => skill.update());
    this.delete(this.selectActiveSkills);
    this.selectButtons.forEach(button => button.update());
    this.delete(this.selectButtons);
    
    this.cautionList.forEach(caution => caution.update());
    this.delete(this.cautionList);
}