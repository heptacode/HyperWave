var readyScene = new Scene();

readyScene.init = function()
{
    this.jobList = [];

    this.yourJob = ""

    this.seletPannel = nowScene.addImage(new GameImage("image/tablet.png", 0, 0, ""));
    this.seletPannel.setZ(2);

    this.WarriorButton = nowScene.addImage(new Button("image/player/sample/Warrior.png", this.seletPannel.pos.x, this.seletPannel.pos.y));
    this.WarriorButton.pos.x += this.WarriorButton.image.width;
    this.WarriorButton.pos.y += this.WarriorButton.image.height;
    this.WarriorButton.clickEventSet(function()
    {
        for(let i = 0; i < nowScene.jobList.length; i++)
        {
            if(nowScene.jobList[i] != this)
            {
                nowScene.jobList[i].strokeWidth = 0;
            }
        }
        nowScene.yourJob = "Warrior";
        console.log(nowScene.yourJob);
        this.strokeWidth = 10;
    });
    this.WarriorButton.setZ(3);
    this.jobList.push(this.WarriorButton);

    this.LancerButton = nowScene.addImage(new Button("image/player/sample/Lancer.png", this.seletPannel.pos.x, this.seletPannel.pos.y));
    this.LancerButton.pos.x += this.WarriorButton.image.width * 2.5;
    this.LancerButton.pos.y += this.WarriorButton.image.height;
    this.LancerButton.clickEventSet(function()
    {
        for(let i = 0; i < nowScene.jobList.length; i++)
        {
            if(nowScene.jobList[i] != this)
            {
                nowScene.jobList[i].strokeWidth = 0;
            }
        }
        nowScene.yourJob = "Lancer";
        console.log(nowScene.yourJob);
        this.strokeWidth = 10;
    });
    this.LancerButton.setZ(3);
    this.jobList.push(this.LancerButton);

    this.startButton = nowScene.addImage(new Button("image/player/playerHand.png", canvas.width / 4 * 3, canvas.height / 4 * 3));
    this.startButton.clickEventSet(function()
    {
        if(nowScene.yourJob != "") // 캐릭터가 선택됬는지
        {
            gameScene.settedJob = nowScene.yourJob;
            gameScene.start();
        }
        else
        {
            console.log("직업을 선택하세요!");
        }
    });

    this.cursor = nowScene.addImage(new MousePoint("image/cursor.png", mouseX, mouseY));
    this.cam = new Camera();
}

readyScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    for(let i = 0; i < this.jobList.length; i++)
    {
        this.jobList[i].update();
    }
    this.startButton.update();
}