var gameoverScene = new Scene();

gameoverScene.init = function()
{
    preloadImage("cursor.png");

    this.updateList = [];

    this.cursor = nowScene.addImage(new MousePoint("cursor.png", mouseX, mouseY));

    this.LTIme = Date.now();
    this.Time = 10;
    this.RTime = this.LTIme + this.Time * 1000;
}
gameoverScene.update = function()
{
    for(let i = 0; i < this.updateList.length; i++)
    {
        this.updateList[i].update();
    }

    this.LTIme = Date.now();
    if(this.LTIme >= this.RTime)
    {
        this.sceneImageList.length = 0;
        this.updateList.length = 0;
        gameScene.start();
    }
}