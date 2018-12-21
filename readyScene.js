var readyScene = new Scene();

var selectSkills = [[[new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/cantSelect.png", 0, 0, 2)],
                   [new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/notSelected.png", 0, 0, 2)]], 

                   [[new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/cantSelect.png", 0, 0, 2)],
                   [new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/notSelected.png", 0, 0, 2)]],
                
                   [[new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/cantSelect.png", 0, 0, 2)],
                   [new Button("image/icon/notSelected.png", 0, 0, 2), new Button("image/icon/notSelected.png", 0, 0, 2)]]];

var jobIndex = 0;

function updateJob(job){
    $.post("proxy.php", { do: "updateJob", uId: Cookies.get("uId"), code: Cookies.get("code"), job: job }, function(response){
        response ? console.log("%c" + job, "display: block; background: blue; color: white; text-align: center; font-size: 14px")
        : console.log("%c직업 변경 실패 : ", "display: block; background: red; color: white; text-align: center; font-size: 14px");
    });
}

function updateReadyState(readyState){
    $.post("proxy.php", { do: "updateReadyState", uId: Cookies.get("uId"), code: Cookies.get("code"), readyState: readyState }, function(response){
        response ? console.log(readyState ? "%c준비 완료!" : "%c준비 안됨", "display: block; background: #C56C30; color: white; text-align: center; font-size: 14px")
        : console.log("%c준비 업데이트 실패", "display: block; background: red; color: white; text-align: center; font-size: 14px")
    });
}

function queLeave() {
    $.post("proxy.php", { do: "queLeave", uId: Cookies.get("uId"), code: Cookies.get("code") }, function(response) {
        response ? ($(".notice-game").html("큐에서 떠났습니다. <b>[" + Cookies.get("code") + "]</b>").slideDown().delay(3000).slideUp(), $(".btn-codeView").fadeOut(), Cookies.remove("code"), startScene.start()) : console.log("큐 나가기 실패");
    });
}

function fetchPlayer(){
    $.post("proxy.php", { do: "fetchPlayer", code: Cookies.get("code") }, function(response) {
        let data = JSON.parse(response);

        nowScene.tempPlayers.forEach(info => info.isDelete = true);
        nowScene.tempPlayers.length = 0;

        for(let i = 0; i < data.length; i++)
        {
            nowScene.tempPlayers[i] = {
                "uId" : data[i]["uId"],
                "job" : data[i]["job"],
                "readyState" : data[i]["readyState"],
                "wave" : data[i]["readyState"],
                "hp" : data[i]["hp"],
                "killCnt" : data[i]["killCnt"]
            };
        }
    },
    nowScene.updatePlayers(),
    )
}

// 게임 시작 함수 - 방장만 사용
function gameStart(){
    $.post("proxy.php", { do: "gameStart", code: Cookies.get("code") });
}

// 게임이 시작되었는지 확인하는 함수
function fetchGameState(){
    $.post("proxy.php", { do: "fetchGameState", code: Cookies.get("code") }, function(response){
        response ? (GameController.sendInfo("player", "job", nowScene.jobs[jobIndex][1]),
                    GameController.sendInfo("player", "skill", "passive", nowScene.selectPassiveSkills[0].name),
                    GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[0].name, nowScene.activeSkillsKey[0]),
                    GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[1].name, nowScene.activeSkillsKey[1]),
                    gameScene.selectedInfo.player.skill.activeImage = [],
                    gameScene.selectedInfo.player.skill.activeImage.push(nowScene.selectActiveSkills[0].path, nowScene.selectActiveSkills[1].path),
                    gameScene.start())
                 : null;
    });
}

readyScene.init = function()
{
    this.cam = new Camera(this.selectPannel);
    this.cursor = nowScene.addThing(new MousePoint("image/cursor.png", mouseX, mouseY));

    gameScene.selectedInfo = {player : {skill : {passive :  [], active : []}, job : null}};

    this.jobs = [["image/player/Warrior/sample.png", "Warrior"], 
                ["image/player/Lancer/sample.png", "Lancer"],
                ["image/player/Summoner/sample.png", "Summoner"]];

    this.skills = [[[new Button("image/icon/Warrior/passiveSkill/attackDamageUp.png", 0, 0, 0, "attackDamageUp"), new Button("image/icon/Warrior/passiveSkill/healthUp.png", 0, 0, 0, "healthUp"),
                  new Button("image/icon/Warrior/passiveSkill/blooddrain.png", 0, 0, 0, "blooddrain"), new Button("image/icon/Warrior/passiveSkill/attackSpeedUp.png", 0, 0, 0, "attackSpeedUp"),
                  new Button("image/icon/Warrior/passiveSkill/attackRangeUp.png", 0, 0, 0, "attackRangeUp"), new Button("image/icon/Warrior/passiveSkill/MODBerserker.png", 0, 0, 0, "MOD:Berserker")], 

                  [new Button("image/icon/Warrior/activeSkill/swordShot.png", 0, 0, 0, "SwordShot"), new Button("image/icon/Warrior/activeSkill/swiftStrike.png", 0, 0, 0, "SwiftStrike"),
                  new Button("image/icon/Warrior/activeSkill/spinShot.png", 0, 0, 0, "SpinShot"), new Button("image/icon/Warrior/activeSkill/wheelWind.png", 0, 0, 0, "WheelWind"),
                  new Button("image/icon/notSelected.png", 0, 0, 0, "none"), new Button("image/icon/notSelected.png", 0, 0, 0, "none")]],


                  [[new Button("image/icon/Warrior/passiveSkill/attackDamageUp.png", 0, 0, 0, "attackDamageUp"), new Button("image/icon/Warrior/passiveSkill/attackSpeedUp.png", 0, 0, 0, "attackSpeedUp"),
                  new Button("image/icon/Summoner/passiveSkill/chargeElectSpeedUp.png", 0, 0, 0, "chargeElectSpeedUp"), new Button("image/icon/Warrior/passiveSkill/blooddrain.png", 0, 0, 0, "blooddrain"),
                  new Button("image/icon/Lancer/passiveSkill/backDashAttack.png", 0, 0, 0, "backDashAttack"), new Button("image/icon/Lancer/passiveSkill/MODDestroyer.png", 0, 0, 0, "MOD:Destroyer")],

                  [new Button("image/icon/Lancer/activeSkill/swing.png", 0, 0, 0, "Swing"), new Button("image/icon/Warrior/passiveSkill/attackDamageUp.png", 0, 0, 0, "AttackDamageBuff"),
                  new Button("image/icon/Lancer/activeSkill/continuousAttack.png", 0, 0, 0, "ContinuousAttack"), new Button("image/icon/Warrior/activeSkill/swordShot.png", 0, 0, 0, "ThrowSpear"),
                  new Button("image/icon/notSelected.png", 0, 0, 0, "none"), new Button("image/icon/notSelected.png", 0, 0, 0, "none")]],
                
                
                  [[new Button("image/icon/Summoner/passiveSkill/chargeElectSpeedUp.png", 0, 0, 0, "chargeElectSpeedUp"), new Button("image/icon/Summoner/passiveSkill/shotSpeedUp.png", 0, 0, 0, "shotSpeedUp"),
                  new Button("image/icon/Summoner/passiveSkill/attackRangeUp.png", 0, 0, 0, "attackRangeUp"), new Button("image/icon/Summoner/passiveSkill/skillDamageUp.png", 0, 0, 0, "skillDamageUp"),
                  new Button("image/icon/Summoner/passiveSkill/addShooter.png", 0, 0, 0, "addShooters"), new Button("image/icon/Summoner/passiveSkill/penetrationAttack.png", 0, 0, 0, "penetrationAttack")],
                
                  [new Button("image/icon/Summoner/activeSkill/MODKnockbackUp.png", 0, 0, 0, "MOD:KnockbackUp"), new Button("image/icon/Summoner/activeSkill/MODSpeedUp.png", 0, 0, 0, "MOD:SpeedUp"),
                  new Button("image/icon/Summoner/activeSkill/MODDamageUp.png", 0, 0, 0, "MOD:DamageUp"), new Button("image/icon/Warrior/activeSkill/swiftStrike.png", 0, 0, 0, "AddShooter"),
                  new Button("image/icon/Summoner/activeSkill/laserAttack.png", 0, 0, 0, "LaserAttack"), new Button("image/icon/Warrior/activeSkill/swiftStrike.png", 0, 0, 0, "BulletParty")]]];
    
    this.activeSkillsKey = ["ShiftLeft", "Space"];
    this.isSelected = false;

    this.cautionList = [];
    
    this.background = nowScene.addThing(new GameImage("image/tablet.png", 0, canvas.height / 2 - 1080 / 2, "none"));
    this.background.update = () =>
    {
        this.background.pos.y = canvas.height / 2 - this.background.image.height / 2;
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
    this.leftDownPannel = new Pannel(nowScene.selectPannel.pos.x + 52, nowScene.selectPannel.pos.y + 438, 583, 500);
    this.leftDownPannel.update = () =>
    {
        this.leftDownPannel.setPosition(nowScene.selectPannel.pos.x + 52, nowScene.selectPannel.pos.y + 438);

    }
    nowScene.updateList.push(this.leftDownPannel);

    this.descriptionPannel = nowScene.addThing(new GameImage("image/descriptionPannel.png", nowScene.leftDownPannel.pos.x - 2.25, nowScene.leftDownPannel.pos.y + nowScene.leftDownPannel.image.height + 5, "none"));
    this.descriptionPannel.setZ(3);

    this.description_coolTime = nowScene.addThing(new GameText(nowScene.descriptionPannel.pos.x + 70, nowScene.descriptionPannel.pos.y + 5, 20, "Jua", ""));
    this.description_coolTime.pos.y += this.description_coolTime.size;
    this.description_coolTime.color = {r : 6, g : 226, b : 224};
    this.description_coolTime.opacity = 0;
    this.description_coolTime.setZ(nowScene.descriptionPannel.z + 1);
    this.description_elect = nowScene.addThing(new GameText(nowScene.descriptionPannel.pos.x + nowScene.descriptionPannel.image.width - 70, nowScene.descriptionPannel.pos.y + 5, 20, "Jua", ""));
    this.description_elect.pos.y += this.description_elect.size;
    this.description_elect.color = {r : 6, g : 226, b : 224};
    this.description_elect.opacity = 0;
    this.description_elect.setZ(nowScene.descriptionPannel.z + 1);
    this.description_text = nowScene.addThing(new GameText(Util.getCenter(nowScene.descriptionPannel, "x"), nowScene.descriptionPannel.pos.y + 60, 25, "Jua", ""));
    this.description_text.pos.y += this.description_text.size;
    this.description_text.color = {r : 6, g : 226, b : 224};
    this.description_text.opacity = 0;
    this.description_text.setZ(nowScene.descriptionPannel.z + 1);

    this.stats = [[], [], []];

    this.passiveSkills = [];
    this.activeSkills = [];

    this.selectPassiveSkills = [];
    this.selectActiveSkills = [];


    this.selectButtons = [];
    this.locks = [];


    // middle pannel
    this.middlePannel = new Pannel(nowScene.leftDownPannel.pos.x + nowScene.leftDownPannel.image.width + 15, nowScene.leftDownPannel.pos.y + 100, 624, 981);
    this.middlePannel.update = () =>
    {
        this.middlePannel.setPosition(nowScene.leftDownPannel.pos.x + nowScene.leftDownPannel.image.width + 15, nowScene.leftDownPannel.pos.y + 100);
    }
    nowScene.updateList.push(this.middlePannel);
    
    this.playerImage = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameImage("image/player/Warrior/sample.png", Util.getCenter(nowScene.middlePannel, "x"), nowScene.middlePannel.pos.y, "none")));
    nowScene.middlePannel.setOnPannel(this.playerImage);
    this.playerImage.setZ(5);
    this.playerImage.setCenter();

    this.level = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameText(Util.getCenter(nowScene.playerImage, "x"), nowScene.playerImage.pos.y + 20, 40, "Gugi", "")));
    this.level.pos.y -= this.level.size;
    this.level.color = {r : 6, g : 226, b : 224};
    this.level.setZ(5);

    this.jobName = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameText(Util.getCenter(nowScene.middlePannel, "x"), nowScene.playerImage.pos.y + nowScene.playerImage.image.height + 50, 30, "Gugi", nowScene.jobs[jobIndex][1])));
    this.jobName.color = {r : 6, g : 226, b : 224};
    this.jobName.setZ(5);

    this.hightScore = nowScene.middlePannel.setOnPannel(nowScene.addThing(new GameText(Util.getCenter(nowScene.playerImage, "x"), nowScene.jobName.pos.y + 15, 30, "Gugi", "")));
    this.hightScore.pos.y += this.hightScore.size;
    this.hightScore.color = {r : 6, g : 226, b : 224};
    this.hightScore.setZ(5);

    this.leftButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/leftArrow.png", nowScene.middlePannel.pos.x + 35, nowScene.middlePannel.pos.y, 3)));
    this.leftButton.setClickEvent(function()
    {
        nowScene.switchSetting("left");
        nowScene.isSelected = false;
        updateReadyState(nowScene.isSelected);
    });
    nowScene.updateList.push(this.leftButton);

    this.rightButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/rightArrow.png", nowScene.middlePannel.pos.x + nowScene.middlePannel.image.width - 20, nowScene.middlePannel.pos.y, 3)));
    this.rightButton.setClickEvent(function()
    {
        nowScene.switchSetting("right");
        nowScene.isSelected = false;
        updateReadyState(nowScene.isSelected);
    });
    nowScene.updateList.push(this.rightButton);

    this.readyButton = nowScene.middlePannel.setOnPannel(nowScene.addThing(new Button("image/button/select.png", Util.getCenter(nowScene.middlePannel, "x"), nowScene.jobName.pos.y + 200, 5, "readyButton")));
    this.readyButton.pos.y -= this.readyButton.image.height / 2;
    this.readyButton.setClickEvent(function()
    {
        if(nowScene.selectPassiveSkills[0].isSelected == true && nowScene.selectActiveSkills[0].isSelected == true && nowScene.selectActiveSkills[1].isSelected == true)
        {
            nowScene.isSelected = true;
            updateReadyState(nowScene.isSelected);
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
        if(nowScene.isSelected == true && (nowScene.tempPlayers[0]["uId"] == Cookies.get("uId")) && nowScene.isReady())
        {
            $(".btn-codeView").css("display", "none");

            GameController.sendInfo("player", "job", nowScene.jobs[jobIndex][1]);
            GameController.sendInfo("player", "skill", "passive", nowScene.selectPassiveSkills[0].name);
            GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[0].name, nowScene.activeSkillsKey[0]);
            GameController.sendInfo("player", "skill", "active", nowScene.selectActiveSkills[1].name, nowScene.activeSkillsKey[1]);
            gameScene.selectedInfo.player.skill.activeImage = [];
            gameScene.selectedInfo.player.skill.activeImage.push(nowScene.selectActiveSkills[0].path, nowScene.selectActiveSkills[1].path);

            gameScene.start();
        }
        else if((nowScene.tempPlayers[0]["uId"] != Cookies.get("uId")))
        {
            nowScene.addCaution("방장이 아닙니다!");
        }
        else if((nowScene.tempPlayers[0]["uId"] == Cookies.get("uId")) && !nowScene.isReady())
        {
            nowScene.addCaution("팀원이 준비되지 않았습니다!");
        }
        else
        {
            nowScene.addCaution("SELECT 버튼을 누르세요!");
        }
    });
    nowScene.updateList.push(this.startButton);

    this.exitButton = nowScene.rightPannel.setOnPannel(nowScene.addThing(new Button("image/button/exit.png", nowScene.startButton.pos.x + nowScene.startButton.image.width + 90, nowScene.startButton.pos.y + nowScene.startButton.image.height, 5, "exitButton")));
    this.exitButton.pos.x += this.exitButton.image.width / 2;
    this.exitButton.pos.y += this.exitButton.image.height / 2;
    this.exitButton.setClickEvent(function()
    {
        queLeave();
    });
    nowScene.updateList.push(this.exitButton);


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
            if(Date.now() >= caution.RTime)
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

    this.updatePlayers = () =>
    {
        for(let i = 0; i < nowScene.players.length; i++)
        {
            nowScene.players[i][0].text = "";
            nowScene.players[i][1].opacity = 0;
            nowScene.players[i][2].text = "";
        }
        for(let i = 0; i < nowScene.tempPlayers.length; i++)
        {
            nowScene.players[i][0].text = nowScene.tempPlayers[i]["uId"];
            nowScene.players[i][2].text = nowScene.tempPlayers[i]["readyState"] ? "READY!" : "";
            let image;
            switch(nowScene.tempPlayers[i]["job"])
            {
                case "Warrior" : image = "image/player/Warrior/player.png"; break;
                case "Lancer" : image = "image/player/Lancer/player.png"; break;
                case "Summoner" : image = "image/player/Summoner/player.png"; break;
            }
            nowScene.players[i][1].path = image;
            nowScene.players[i][1].setImage();
            nowScene.players[i][1].rot = 270 / 180 * Math.PI;
            nowScene.players[i][1].opacity = 1;
        }
    }

    this.isReady = () =>
    {
        let num1 = 0, num2 = 0;
        for(let i = 0; i < nowScene.tempPlayers.length; i++)
        {
            if(nowScene.tempPlayers[i]["readyState"] == true)
            {
                num1++;
            }
            num2++;
        }
        return (num1 == num2);
    }
    
    this.setDescription = (_selectSkill) =>
    {
        switch(nowScene.jobs[jobIndex][1])
        {
            case "Warrior" : 
            switch(_selectSkill.name)
            {
                case "attackDamageUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격력 20% 상승" ; break;
                case "healthUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "체력 50% 상승"; break;
                    case "blooddrain" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격 시 최대체력의 5% 회복, 공격력 20% 감소"; break;
                    case "attackSpeedUp" :nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격속도 20% 상승"; break;
                    case "attackRangeUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격사거리 50% 상승"; break;
                    case "MOD:Berserker" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "체력이 40% 이하로 떨어졌을 때 공격력 100% 상승"; break;
                    
                    case "SwordShot" : nowScene.description_coolTime.text = "쿨타임 : 3초"; nowScene.description_elect.text = "사용전력 : 2"; nowScene.description_text.text = "전방으로 70%의 데미지를 가진 검기 3개를 발사" ; break;
                    case "SwiftStrike" : nowScene.description_coolTime.text = "쿨타임 : 0.5초"; nowScene.description_elect.text = "사용전력 : 1"; nowScene.description_text.text = "전방으로 돌진하며 충돌한 적에게 50%의 데미지" ; break;
                    case "SpinShot" : nowScene.description_coolTime.text = "쿨타임 : 5초"; nowScene.description_elect.text = "사용전력 : 3"; nowScene.description_text.text = "8방향으로 100%의 데미지를 가진 검기를 발사" ; break;
                    case "WheelWind" : nowScene.description_coolTime.text = "쿨타임 : 5초"; nowScene.description_elect.text = "사용전력 : 5"; nowScene.description_text.text = "2초동안 회전하여 주변 적에게 일정 시간마다 10%의 데미지" ; break;
                } break;
            case "Lancer" : 
            switch(_selectSkill.name)
            {
                    case "attackDamageUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격력 20% 상승"; break;
                    case "attackSpeedUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격속도 40% 상승"; break;
                    case "chargeElectSpeedUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "전력회복속도 3초 -> 1.5초로 감소"; break;
                    case "blooddrain" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격 시 최대체력의 5% 회복, 공격력 20% 감소"; break;
                    case "backDashAttack" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격 시 뒤로 약진"; break;
                    case "MOD:Destroyer" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "3번째 공격마다 전방에 큰 타격을 입히는 공격게시"; break;

                    case "Swing" : nowScene.description_coolTime.text = "쿨타임 : 2초"; nowScene.description_elect.text = "사용전력 : 1"; nowScene.description_text.text = "주변 적에게 100%의 데미지, 멀리 넉백" ; break;
                    case "AttackDamageBuff" : nowScene.description_coolTime.text = "쿨타임 : 30초"; nowScene.description_elect.text = "사용전력 : 3"; nowScene.description_text.text = "10초동안 공격력 50% 상승 버프시전" ; break;
                    case "ContinuousAttack" : nowScene.description_coolTime.text = "쿨타임 : 2초"; nowScene.description_elect.text = "사용전력 : 3"; nowScene.description_text.text = "전방으로 적에게 일정 시간마다 20%의 데미지" ; break;
                    case "ThrowSpear" : nowScene.description_coolTime.text = "쿨타임 : 3초"; nowScene.description_elect.text = "사용전력 : 2"; nowScene.description_text.text = "창을 던져 200%의 데미지" ; break;
                } break;
            case "Summoner" : 
                switch(_selectSkill.name)
                {
                    case "chargeElectSpeedUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "전력회복속도 3초 -> 1.5초로 감소"; break;
                    case "shotSpeedUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "투사체속도 50% 상승"; break;
                    case "attackRangeUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "공격사거리 100% 상승"; break;
                    case "skillDamageUp" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "스킬공격력 50% 상승"; break;
                    case "addShooters" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "로봇의 개체수 2개 추가"; break;
                    case "penetrationAttack" : nowScene.description_coolTime.text = "쿨타임 : X"; nowScene.description_elect.text = "사용전력 : X"; nowScene.description_text.text = "투사체 관통공격판정 설정"; break;

                    case "MOD:KnockbackUp" : nowScene.description_coolTime.text = "쿨타임 : 30초"; nowScene.description_elect.text = "사용전력 : 5"; nowScene.description_text.text = "20초동안 넉백거리 1000% 상승" ; break;
                    case "MOD:SpeedUP" : nowScene.description_coolTime.text = "쿨타임 : 60초"; nowScene.description_elect.text = "사용전력 : 8"; nowScene.description_text.text = "5초동안 공격속도 200% 상승, 공격력 50% 감소" ; break;
                    case "MOD:DamageUp" : nowScene.description_coolTime.text = "쿨타임 : 60초"; nowScene.description_elect.text = "사용전력 : 8"; nowScene.description_text.text = "10초동안 공격력 100% 상승, 공격속도 75% 감소" ; break;
                    case "AddShooter" : nowScene.description_coolTime.text = "쿨타임 : 120초"; nowScene.description_elect.text = "사용전력 : 8"; nowScene.description_text.text = "로봇의 개체수 1개 추가" ; break;
                    case "LaserAttack" : nowScene.description_coolTime.text = "쿨타임 : 1초"; nowScene.description_elect.text = "사용전력 : 1"; nowScene.description_text.text = "전방으로 적에게 100%의 데미지를 주는 레이저 발사" ; break;
                    case "BulletParty" : nowScene.description_coolTime.text = "쿨타임 : 30초"; nowScene.description_elect.text = "사용전력 : 8"; nowScene.description_text.text = "5초동안 난사" ; break;
                } break;
        }
    }

    this.setInformations = () =>
    {
        let jobName = nowScene.jobs[jobIndex][1];

        nowScene.hightScore.text = "high score : " + nowScene.playerHighScore[jobName];
        nowScene.level.text = "Lv." + nowScene.playerLevel[jobName];
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
                updateReadyState(nowScene.isSelected);
                nowScene.setDescription(nowScene.selectPassiveSkills[_num]);
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
                updateReadyState(nowScene.isSelected);
                nowScene.setDescription(nowScene.selectActiveSkills[_num]);
                nowScene.selectActiveSkills[_num].setImage();
                nowScene.selectActiveSkills[_num].setAnchor(-nowScene.selectActiveSkills[_num].image.width / 2, -nowScene.selectActiveSkills[_num].image.height / 2); break;
        }
    }

    this.setSelectIcon = () =>
    {
        for(let i = 0; i < 2; i++)
        {
            nowScene.selectPassiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + 40 + i * 129, y : nowScene.leftDownPannel.pos.y + 370};
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
            nowScene.selectPassiveSkills[i].delayRTime = Date.now();

            if(nowScene.selectPassiveSkills[i].name != "none")
            {
                nowScene.selectPassiveSkills[i].isSelected = true;
            }
            nowScene.selectPassiveSkills[i].update = () =>
            {
                let realImage = {width : nowScene.selectPassiveSkills[i].image.width * nowScene.selectPassiveSkills[i].scale.x, height : nowScene.selectPassiveSkills[i].image.height * nowScene.selectPassiveSkills[i].scale.y};
                if(nowScene.selectPassiveSkills[i].isSelected == true)
                {
                    if(Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i], nowScene.cursor.image, realImage))
                    {
                        if(nowScene.selectPassiveSkills[i].isShowedImage == false)
                        {
                            // 선택된 스킬의 설명을 보여줌 -> GameImage위에 GameText띄우기
                            nowScene.setDescription(nowScene.selectPassiveSkills[i]);
                            nowScene.description_coolTime.opacity = 1;
                            nowScene.description_elect.opacity = 1;
                            nowScene.description_text.opacity = 1;
                            nowScene.selectPassiveSkills[i].isShowedImage = true;
                        }
                    }
                    else if(!Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i], nowScene.cursor.image, realImage) && nowScene.selectPassiveSkills[i].isShowedImage == true)
                    {
                        // 설명 이미지가 있고 그 이미지에서 마우스가 나오면 설명 이미지를 삭제
                        nowScene.description_coolTime.opacity = 0;
                        nowScene.description_elect.opacity = 0;
                        nowScene.description_text.opacity = 0;
                        nowScene.selectPassiveSkills[i].isShowedImage = false;
                    }
                    if(mouseValue["Right"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[i], nowScene.cursor.image, realImage))
                    {
                        nowScene.selectSkill(nowScene.selectPassiveSkills[i], "passive", 0, false);
                    }
                }

                if(nowScene.selectPassiveSkills[i].canChoose == true)
                {
                    if(mouseValue["Left"] == 1 && Date.now() > nowScene.selectPassiveSkills[i].delayRTime)
                    {
                        if(Collision.dotToRect(nowScene.cursor, nowScene.selectPassiveSkills[0]))
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
                        else
                        {
                            nowScene.selectPassiveSkills[0].canChoose = false;
                            nowScene.selectPassiveSkills[0].canChoose = false;
                            nowScene.selectPassiveSkills[0].chooseRTime = 0;
                            nowScene.selectPassiveSkills[0].blinkRTime = 0;
                            nowScene.selectPassiveSkills[0].blinkNum = 0;

                            for(let i = 0; i < nowScene.passiveSkills.length; i++)
                            {
                                if(nowScene.passiveSkills[i].doubleClicked == true)
                                {
                                    nowScene.passiveSkills[i].doubleClicked = false;
                                    break;
                                }
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
            nowScene.selectActiveSkills[i].pos = {x : nowScene.leftDownPannel.pos.x + 325 + i * 131, y : nowScene.leftDownPannel.pos.y + 370};
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
            nowScene.selectActiveSkills[i].delayRTime = Date.now();

            nowScene.setDescription(nowScene.selectActiveSkills[i])
            
            if(nowScene.selectActiveSkills[i].name != "none")
            {
                nowScene.selectActiveSkills[i].isSelected = true;
            }
            nowScene.selectActiveSkills[i].update = () =>
            {
                let realImage = {width : nowScene.selectActiveSkills[i].image.width * nowScene.selectActiveSkills[i].scale.x, height : nowScene.selectActiveSkills[i].image.height * nowScene.selectActiveSkills[i].scale.y};
                if(nowScene.selectActiveSkills[i].isSelected == true)
                {
                    if(Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i], nowScene.cursor.image, realImage))
                    {
                        // 선택된 스킬의 설명을 보여줌 -> GameImage위에 GameText띄우기
                        if(nowScene.selectActiveSkills[i].isShowedImage == false)
                        {
                            nowScene.setDescription(nowScene.selectActiveSkills[i]);
                            nowScene.description_coolTime.opacity = 1;
                            nowScene.description_elect.opacity = 1;
                            nowScene.description_text.opacity = 1;
                            nowScene.selectActiveSkills[i].isShowedImage = true;
                        }
                    }
                    else if(!Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i], nowScene.cursor.image, realImage) && nowScene.selectActiveSkills[i].isShowedImage == true)
                    {
                        // 설명 이미지가 있고 그 이미지에서 마우스가 나오면 설명 이미지를 삭제
                        nowScene.description_coolTime.opacity = 0;
                        nowScene.description_elect.opacity = 0;
                        nowScene.description_text.opacity = 0;
                        nowScene.selectActiveSkills[i].isShowedImage = false;
                    }
                    if(mouseValue["Right"] == 1 && Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i], nowScene.cursor.image, realImage))
                    {
                        nowScene.selectSkill(nowScene.selectActiveSkills[i], "active", i, false);
                    }
                }

                if(nowScene.selectActiveSkills[i].canChoose == true)
                {
                    if(mouseValue["Left"] == 1 && Date.now() > nowScene.selectActiveSkills[i].delayRTime)
                    {
                        if(Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i], nowScene.cursor.image, realImage))
                        {
                            for(let j = 0; j < nowScene.activeSkills.length; j++)
                            {
                                if(nowScene.activeSkills[j].doubleClicked == true)
                                {
                                    nowScene.selectSkill(nowScene.activeSkills[j], "active", 0, true);
    
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
                        else if(Collision.dotToRect(nowScene.cursor, nowScene.selectActiveSkills[i], nowScene.cursor.image, realImage))
                        {
                            for(let j = 0; j < nowScene.activeSkills.length; j++)
                            {
                                if(nowScene.activeSkills[j].doubleClicked == true)
                                {
                                    nowScene.selectSkill(nowScene.activeSkills[j], "active", 1, true);
    
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
                        else
                        {
                            nowScene.selectActiveSkills[0].canChoose = false;
                            nowScene.selectActiveSkills[0].chooseRTime = 0;
                            nowScene.selectActiveSkills[0].blinkRTime = 0;
                            nowScene.selectActiveSkills[0].blinkNum = 0;
                            
                            nowScene.selectActiveSkills[1].canChoose = false;
                            nowScene.selectActiveSkills[1].chooseRTime = 0;
                            nowScene.selectActiveSkills[1].blinkRTime = 0;
                            nowScene.selectActiveSkills[1].blinkNum = 0;

                            for(let i = 0; i < nowScene.activeSkills.length; i++)
                            {
                                if(nowScene.activeSkills[i].doubleClicked == true)
                                {
                                    nowScene.activeSkills[i].doubleClicked = false;
                                    break;
                                }
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
        let jobName = nowScene.jobs[jobIndex][1];
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

            nowScene.passiveSkills[i].information = {name : new GameText(Util.getCenter(nowScene.passiveSkills[i], "x"), nowScene.passiveSkills[i].pos.y + nowScene.passiveSkills[i].image.height + 2, 15, "Gugi", nowScene.passiveSkills[i].name)}
            nowScene.passiveSkills[i].information.name.pos.y += nowScene.passiveSkills[i].information.name.size;
            nowScene.passiveSkills[i].information.name.color = {r : 6, g : 226, b : 224};
            nowScene.passiveSkills[i].onmouseover = false;

            nowScene.leftDownPannel.setOnPannel(nowScene.passiveSkills[i]);
            nowScene.passiveSkills[i].setZ(3);

            if(nowScene.passiveSkills[i].name != "none" && nowScene.playerLevel[jobName] >= (i >= 2 ? (i - 1) * 5 : 1))
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
                            nowScene.selectPassiveSkills[0].delayRTime = Date.now() + 0.1 * 1000;

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

                    nowScene.passiveSkills[i].information.name.pos = {x : Util.getCenter(nowScene.passiveSkills[i], "x"), y : nowScene.passiveSkills[i].pos.y + nowScene.passiveSkills[i].image.height + 2 + nowScene.passiveSkills[i].information.name.size};
                }
            }
            else
            {   
                nowScene.passiveSkills[i].setZ(nowScene.passiveSkills[i].z - 1);

                let lock = nowScene.addThing(new GameImage("image/icon/lock.png", nowScene.passiveSkills[i].pos.x, nowScene.passiveSkills[i].pos.y, "lock"));
                nowScene.leftDownPannel.setOnPannel(lock);
                lock.setZ(nowScene.passiveSkills[i].z + 1);
                nowScene.locks.push(lock);

                let text = nowScene.addThing(new GameText(Util.getCenter(lock, "x"), lock.pos.y + lock.image.height + 2, 15, "Gugi", "Lv." + ((i - 1) * 5)));
                text.pos.y += text.size;
                text.color = {r : 6, g : 226, b : 224};
                nowScene.leftDownPannel.setOnPannel(text);
                text.setZ(lock.z);
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
            nowScene.activeSkills[i].pos = {x : Util.getCenter(nowScene.leftDownPannel, "x") - 5 + nowScene.activeSkills[i].image.width / 2 + (i % 2) * (nowScene.activeSkills[i].image.width + 70), y : nowScene.leftDownPannel.pos.y + 18 + numY * (nowScene.activeSkills[i].image.height + 29)};
            nowScene.activeSkills[i].strokeWidth = 5;
            nowScene.activeSkills[i].strokeStyle = "#06e2e0";

            nowScene.activeSkills[i].isSelected = false;
            nowScene.activeSkills[i].isClicked2 = false;
            nowScene.activeSkills[i].isClicked3 = false;

            nowScene.activeSkills[i].doubleRTime = Date.now();
            nowScene.activeSkills[i].doubleClicked = false;

            nowScene.activeSkills[i].startPos = {x : 0, y : 0};
            nowScene.activeSkills[i].tempPos = {x : 0, y : 0};

            nowScene.activeSkills[i].information = {name : new GameText(Util.getCenter(nowScene.activeSkills[i], "x"), nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height + 2, 15, "Gugi", nowScene.activeSkills[i].name)}
            nowScene.activeSkills[i].information.name.pos.y += nowScene.activeSkills[i].information.name.size;
            nowScene.activeSkills[i].information.name.color = {r : 6, g : 226, b : 224};
            nowScene.activeSkills[i].onmouseover = false;

            nowScene.leftDownPannel.setOnPannel(nowScene.activeSkills[i]);
            nowScene.activeSkills[i].setZ(3);

            if(nowScene.activeSkills[i].name != "none" && nowScene.playerLevel[jobName] >= (i >= 2 ? (i - 1) * 5 : 1))
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
                            nowScene.selectActiveSkills[0].delayRTime = Date.now() + 0.1 * 1000;

                            nowScene.selectActiveSkills[1].canChoose = true;
                            nowScene.selectActiveSkills[1].chooseRTime = Date.now() + nowScene.selectActiveSkills[1].chooseTime * 1000;
                            nowScene.selectActiveSkills[1].blinkRTime = Date.now();
                            nowScene.selectActiveSkills[1].delayRTime = Date.now() + 0.1 * 1000;

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

                    nowScene.activeSkills[i].information.name.pos = {x : Util.getCenter(nowScene.activeSkills[i], "x"), y : nowScene.activeSkills[i].pos.y + nowScene.activeSkills[i].image.height + 2 + nowScene.activeSkills[i].information.name.size};
                }
            }
            else
            {   
                nowScene.activeSkills[i].setZ(nowScene.activeSkills[i].z - 1);

                let lock = nowScene.addThing(new GameImage("image/icon/lock.png", nowScene.activeSkills[i].pos.x, nowScene.activeSkills[i].pos.y, "lock"));
                nowScene.leftDownPannel.setOnPannel(lock);
                lock.setZ(nowScene.activeSkills[i].z + 1);
                nowScene.locks.push(lock);

                let text = nowScene.addThing(new GameText(Util.getCenter(lock, "x"), lock.pos.y + lock.image.height + 2, 15, "Gugi", "Lv." + ((i - 1) * 5)));
                text.pos.y += text.size;
                text.color = {r : 6, g : 226, b : 224};
                nowScene.leftDownPannel.setOnPannel(text);
                text.setZ(lock.z);
            }
            nowScene.addThing(nowScene.activeSkills[i]);
        }
    }

    this.setStats = () =>
    {
        let basicLength = [];
        //let levelLength = [];

        switch (nowScene.jobs[jobIndex][1])
        {
            case "Warrior" : basicLength[0] = 3; basicLength[1] = 5; basicLength[2] = 6; break;
            case "Lancer" : basicLength[0] = 5; basicLength[1] = 3; basicLength[2] = 4; break;
            case "Summoner" : basicLength[0] = 6; basicLength[1] = 2; basicLength[2] = 8; break;
        }

        for(let i = 0; i < basicLength.length; i++)
        {
            for(let j = 0; j < basicLength[i]; j++)
            {
                let stat = nowScene.addThing(new GameImage("image/basic.png", nowScene.leftDownPannel.pos.x + 110 + j * 30, nowScene.leftDownPannel.pos.y - 300 + i * 85, "stat"))
                stat.setZ(3);
                nowScene.stats[i].push(nowScene.leftDownPannel.setOnPannel(stat));
            }
        }
    }

    this.switchSetting = (_dir) =>
    {
        nowScene.stats[0].forEach(hp => hp.isDelete = true);
        nowScene.stats[0].length = 0;
        nowScene.stats[1].forEach(damage => damage.isDelete = true);
        nowScene.stats[1].length = 0;
        nowScene.stats[2].forEach(elect => elect.isDelete = true);
        nowScene.stats[2].length = 0;

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

        nowScene.setStats();
        nowScene.setInformations();

        updateJob(nowScene.jobs[jobIndex][1]);
        updateReadyState(nowScene.isSelected);
    }

    this.switchSetting();

    this.players = [[],[],[],[]];
    this.tempPlayers = [];

    let numY = 0;
    for(let i = 0; i < 4; i++)
    {
        if(i % 2 == 0 && i != 0)
        {
            numY++;
        }
        let playerUId = nowScene.addThing(new GameText(canvas.width - 480 + (i % 2 * 280), 75 + numY * 210, 20, "Gugi", ""));
        playerUId.color = {r : 6, g : 226, b : 224};
        playerUId.setZ(4);
        this.players[i].push(playerUId);

        let playerImage = nowScene.addThing(new GameImage("image/player/Warrior/player.png", canvas.width - 480 + (i % 2 * 280), 125 + numY * 210, "nome"));
        playerImage.pos.x -= playerImage.image.width / 2;
        playerImage.opacity = 0;
        playerImage.setZ(4);
        this.players[i].push(playerImage);

        let ready = nowScene.addThing(new GameText(canvas.width - 480 + (i % 2 * 280), 245 + numY * 210, 20, "Gugi", ""));
        ready.color = {r : 6, g : 226, b : 224};
        ready.setZ(4);
        this.players[i].push(ready);
    }
    // numY = 0;
    // for(let i = 0; i < 4; i++)
    // {
    //     if(i % 2 == 0 && i != 0)
    //     {
    //         numY++;
    //     }
    //     let path;
    //     playerImage.setZ(4);
    //     this.players.push(playerUId);
    // }

    this.fetchRTime = Date.now();
    this.fetchTime = 0.1;
}
readyScene.update = function()
{
    if(Date.now() >= nowScene.fetchRTime)
    {
        fetchPlayer()
        fetchGameState()
        nowScene.fetchRTime += nowScene.fetchTime * 1000;
    }
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