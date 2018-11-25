var gameoverScene = new Scene();

gameoverScene.init = function()
{
    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint(serverAddr + "/image/cursor.png", mouseX, mouseY));

    this.resultPannel = nowScene.addThing(new GameImage(serverAddr + "/image/result.png", 0, 0, "none"));
    this.resultPannel.setCanvasCenter();

    this.text = nowScene.addThing(new GameText(nowScene.resultPannel.pos.x + nowScene.resultPannel.image.width * 5 / 6, nowScene.resultPannel.pos.y + 25, 100, "Nanum Square", nowScene.clearFail));
    this.text.color = {r : 6, g : 226, b : 224};
    this.text.pos.y += this.text.size;
    this.text.setZ(nowScene.resultPannel.z + 1);

    for(let i = 0; i < nowScene.killCnt.length; i++)
    {
        let cnt = nowScene.addThing(new GameText(nowScene.resultPannel.getCenter("x"), nowScene.resultPannel.pos.y + nowScene.resultPannel.image.height * (i + 2) / 6, 70, "Nanum Square", nowScene.killCnt[i][0] + "의 처치 수 : " + nowScene.killCnt[i][1] + "개"));
        cnt.color = {r : 6, g : 226, b : 224};
    }

    this.restartButton = nowScene.addThing(new Button(serverAddr + "/image/button/restart.png", nowScene.resultPannel.pos.x + nowScene.resultPannel.image.width, nowScene.resultPannel.pos.y + nowScene.resultPannel.image.height, 3));
    this.restartButton.strokeWidth = 5;
    this.restartButton.strokeStyle = "#06e2e0";
    this.restartButton.pos.x -= this.restartButton.image.width / 2 + 20;
    this.restartButton.pos.y -= this.restartButton.image.height / 2 + 20;
    this.restartButton.setClickEvent(function()
    {
        nowScene.updateList.length = 0;
        readyScene.start();
    });
    nowScene.updateList.push(this.restartButton);
}
gameoverScene.update = function()
{
    this.updateList.forEach(obj => obj.update());
}