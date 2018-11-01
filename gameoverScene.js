var gameoverScene = new Scene();

gameoverScene.init = function()
{
    preloadImage("image/cursor.png");

    this.updateList = [];
    
    this.cam = new Camera();
    this.cursor = nowScene.addImage(new MousePoint("image/cursor.png", mouseX, mouseY));

    this.reStartButton = nowScene.addImage(new Button("image/player/playerHand.png", canvas.width / 2, canvas.height / 2));
    this.reStartButton.clickEventSet(function()
    {
        gameScene.start();
    })
}
gameoverScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }
    this.reStartButton.update();
}