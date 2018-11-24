var gameoverScene = new Scene();

gameoverScene.init = function()
{
    this.cam = new Camera();
    this.cursor = nowScene.addThing(new MousePoint("image/cursor.png", mouseX, mouseY));

    this.restartButton = nowScene.addThing(new Button( "image/player/playerHand.png", canvas.width / 2, canvas.height / 2 + 200, 3));
    this.restartButton.setClickEvent(function()
    {
        startScene.start();
    });
    nowScene.updateList.push(this.restartButton);
}
gameoverScene.update = function()
{
    this.updateList.forEach(obj => obj.update());
}