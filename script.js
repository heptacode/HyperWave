var myCanvas = document.getElementById("myCanvas");
var ctx = myCanvas.getContext("2d");


var x = 20;
var y = 200;
var dx = 1;
var dy = 1;
var radius = 10;

var paddleWidth = 125;
var paddleHeight = 10;
var paddleX = myCanvas.width / 2 - paddleWidth / 2;

var leftKeyDown = false;
var rightKeyDown = false;
var spaceKeyDown = false;

var bricks = [];
var brickRowCount = 5;
var brickColCount = 3;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;

var mouseX = paddleX;

var score = 0;

var initBricks = function()
{
    for(let i = 0; i < brickColCount; i++)
    {
        for(let j = 0 ; j < brickRowCount; j++)
        {
            bricks.push({x : j * (brickWidth + brickPadding * 2) + brickPadding, 
                        y : i * (brickHeight + brickPadding) + brickPadding * 3, 
                        isDelete : false});
        }
    }
}
var bricksRender = function()
{
    for(let i = 0; i< brickColCount * brickRowCount; i++)
    {
        if(bricks[i].isDelete == false)
        {
            ctx.beginPath();
                ctx.rect(bricks[i].x, bricks[i].y, brickWidth, brickHeight);
                ctx.fillStyle = "#444444"
                ctx.fill();
            ctx.closePath();
        }
    }
}
var collisionDetect = function()
{
    for (let i = 0; i < brickColCount * brickRowCount; i++)
    {
        if(bricks[i].isDelete == false &&
            x + radius > bricks[i].x && x - radius < bricks[i].x + brickWidth &&
            y + radius > bricks[i].y && y - radius < bricks[i].y + brickHeight)
        {
            dy *= -1;
            bricks[i].isDelete = true;
            score++;
        }
    }
}

var frame = 0;
var acceleration = 0;
var speed = 2;

var ballUpdate = function()
{
    x += dx * speed;
    y += dy * speed;

    if(y >= myCanvas.height - radius)
    {
        clearInterval(gameId);
        alert("GAME OVER");
    }
    if(y - radius < 0)
    {
        dy *= -1;
    }
    if(x >= myCanvas.width - radius || x - radius < 0)
    {
        dx *= -1;
    }
    if(y + radius >= myCanvas.height - paddleHeight && x >= paddleX && x <= paddleX + paddleWidth)
    {
        dy *= -1;
    }
}
var paddleUpdate = function()
{
    if(leftKeyDown)
    {
        if(paddleX <= 0)
        {
            paddleX = 0
        }
        else
        {
            paddleX -= 3;
        }
    }
    if(rightKeyDown)
    {
        if(paddleX >= myCanvas.width - paddleWidth)
        {
            paddleX = myCanvas.width - paddleWidth;
        }
        else
        {
            paddleX += 3;
        }
    }
    paddleX = mouseX - paddleWidth / 2;

    if(spaceKeyDown)
    {
        acceleration++;
        speed += 0.001 * acceleration;
    }
}

var update = function()
{
    frame++;
    ballUpdate();
    paddleUpdate();
    collisionDetect();
    
}

var ballRender = function()
{
    ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI*2, false)
        ctx.fillStyle = "#ff0000";
        ctx.fill();
    ctx.closePath();
}
var paddleRender = function()
{
    ctx.beginPath();
        ctx.rect(paddleX, myCanvas.height - paddleHeight, paddleWidth, paddleHeight);
        ctx.fillStyle = "#ffee00"
        ctx.fill();
    ctx.closePath();
}
var scoreRender = function()
{
    ctx.font = "16px Arial";
    ctx.fillStyle = "rgb(0, 0, 0)";
    ctx.fillText("Score : " + score, 8, 20);
}

var render = function()
{
    ballRender();
    paddleRender();
    bricksRender();
    scoreRender();
}

var gameLoop = function()
{
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    update();
    render();
}

var keyDownFunc = function(e)
{
    if(e.code == "ArrowLeft" || e.code == "KeyA")
    {
        leftKeyDown = true;
    }
    if(e.code == "ArrowRight" || e.code == "KeyD")
    {
        rightKeyDown = true;
    }
}
var keyUpFunc = function(e)
{
    if(e.code == "ArrowLeft" || e.code == "KeyA")
    {
        leftKeyDown = false;
    }
    if(e.code == "ArrowRight" || e.code == "KeyD")
    {
        rightKeyDown = false;
    }
}
var mouseMoveFunc = function(e)
{
    mouseX = e.clientX - myCanvas.offsetLeft;
}

document.addEventListener("keydown", keyDownFunc, false);
document.addEventListener("keyup", keyUpFunc, false);
document.addEventListener("mousemove", mouseMoveFunc, false);

initBricks();
var gameId = setInterval(gameLoop, 10);