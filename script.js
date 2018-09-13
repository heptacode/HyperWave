var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Vector

function Vector(x, y) {
	this.x = x || 0;
	this.y = y || 0;
}

/* INSTANCE METHODS */

Vector.prototype = {
	negative: function() {
		this.x = -this.x;
		this.y = -this.y;
		return this;
	},
	add: function(v) {
		if (v instanceof Vector) {
			this.x += v.x;
			this.y += v.y;
		} else {
			this.x += v;
			this.y += v;
		}
		return this;
	},
	subtract: function(v) {
		if (v instanceof Vector) {
			this.x -= v.x;
			this.y -= v.y;
		} else {
			this.x -= v;
			this.y -= v;
		}
		return this;
	},
	multiply: function(v) {
		if (v instanceof Vector) {
			this.x *= v.x;
			this.y *= v.y;
		} else {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
	divide: function(v) {
		if (v instanceof Vector) {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
		} else {
			if(v != 0) {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
	equals: function(v) {
		return this.x == v.x && this.y == v.y;
	},
	dot: function(v) {
		return this.x * v.x + this.y * v.y;
	},
	cross: function(v) {
		return this.x * v.y - this.y * v.x
	},
	length: function() {
		return Math.sqrt(this.dot(this));
	},
	normalize: function() {
		return this.divide(this.length());
	},
	min: function() {
		return Math.min(this.x, this.y);
	},
	max: function() {
		return Math.max(this.x, this.y);
	},
	toAngles: function() {
		return -Math.atan2(-this.y, this.x);
	},
	angleTo: function(a) {
		return Math.acos(this.dot(a) / (this.length() * a.length()));
	},
	toArray: function(n) {
		return [this.x, this.y].slice(0, n || 2);
	},
	clone: function() {
		return new Vector(this.x, this.y);
	},
	set: function(x, y) {
		this.x = x; this.y = y;
		return this;
    },
    fixSpeed: function(s) {
        this.normalize();
        this.multiply(s);
        return;
    }
};

/* STATIC METHODS */
Vector.negative = function(v) {
	return new Vector(-v.x, -v.y);
};
Vector.add = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x + b.x, a.y + b.y);
	else return new Vector(a.x + v, a.y + v);
};
Vector.subtract = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x - b.x, a.y - b.y);
	else return new Vector(a.x - v, a.y - v);
};
Vector.multiply = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x * b.x, a.y * b.y);
	else return new Vector(a.x * v, a.y * v);
};
Vector.divide = function(a, b) {
	if (b instanceof Vector) return new Vector(a.x / b.x, a.y / b.y);
	else return new Vector(a.x / v, a.y / v);
};
Vector.equals = function(a, b) {
	return a.x == b.x && a.y == b.y;
};
Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y;
};
Vector.cross = function(a, b) {
	return a.x * b.y - a.y * b.x;
};


// player
var player = [];
player.push({x : canvas.width / 2, y : canvas.height / 2, radius : 50, speed : 5, velocity : new Vector(0,0)});

var upKeyDown = false;
var leftKeyDown = false;
var downKeyDown = false;
var rightKeyDown = false;

// monster
var monsters = [];
var spawnMonsters = true;
var monsterCount = 3;

var frame = 0;

var playerMoving = function() // 작업중
{
    if(upKeyDown)
    {
        player[0].velocity.y -= player[0].speed / 5;
    }  
    if(!(upKeyDown))
    {
        if(player[0].velocity.y <= 0)
        {
            player[0].velocity.y += player[0].speed / 5;
        }
        else
        {
            player[0].velocity.y = 0;
        }
    }
    if(leftKeyDown)
    {
        
    }
    if(!(leftKeyDown))
    {

    }
    if(downKeyDown)
    {
        player[0].velocity.y += player[0].speed / 5;
    }
    if(!(downKeyDown))
    {
        if(player[0].velocity.y >= 0)
        {
            player[0].velocity.y -= player[0].speed / 5;
        }
    }
    if(rightKeyDown)
    {
        
    }
    if(!(rightKeyDown))
    {

    }
    player[0].x += player[0].velocity.x;
    player[0].y += player[0].velocity.y;

    if(player[0].y <= player[0].radius){player[0].y = player[0].radius; player[0].velocity.y = 0;}
    if(player[0].x <= player[0].radius){player[0].x = player[0].radius; player[0].velocity.x = 0;}
    if(player[0].y >= canvas.height - player[0].radius){player[0].y = canvas.height - player[0].radius; player[0].velocity.y = 0;}
    if(player[0].x >= canvas.width - player[0].radius){player[0].x = canvas.width - player[0].radius; player[0].velocity.x = 0;}
}

var playerUpdate = function()
{
    playerMoving();
    // player[0].x = mouseX - playerWidth / 2;
}

var monsterMoving = function(num)
{
    monsters[num].velocity.fixSpeed(monsters[num].Speed);

    monsters[num].x += monsters[num].velocity.x;
    monsters[num].y += monsters[num].velocity.y;
}

var playerTracking = function(num)
{
    let vX = player[0].x - monsters[num].x;
    let vY = player[0].y - monsters[num].y;
    monsters[num].velocity.set(vX, vY);
}

var isMonsterColide = function(num)
{

    if(Math.sqrt(Math.pow(monsters[num].x - monsters[num+1].x, 2) + Math.pow(monsters[num].y - monsters[num+1].y, 2)) <= (monsters[num].radius + monsters[num+1].radius))
    {
        return true;
    }
}

var monsterUpdate = function()
{
    if(spawnMonsters)
    {
        for(let i = 0; i < monsterCount; i++)
        {
            monsters.push({x : 200 * i + 200, y : 5 * i + 200, isDie : false, velocity : new Vector(0,0), isCrash : false, Crashing : 0, Speed : 2, radius : 50});
        }
        spawnMonsters = false;
    }
    
    for(let i = 0; i < monsterCount - 1; i++)
    {
        if(isMonsterColide(i))
            {
                let tempVelo = monsters[i].velocity;
                monsters[i].velocity = monsters[i+1].velocity;
                monsters[i+1].velocity = tempVelo;

                monsters[i].isCrash = true;
                monsters[i+1].isCrash = true;
            }
    }
    for(let i = 0; i < monsterCount; i++)
    {
        if(monsters[i].isCrash)
        {
            if(monsters[i].Crashing >= 20)
            {
                monsters[i].isCrash = false;
                monsters[i].Crashing = 0;
                monsters[i].Speed = 2;
            }
            else
            {
                monsters[i].Crashing++;
            }
        }
        else
        {
            playerTracking(i);
        }
        monsterMoving(i);
    }
}

var update = function()
{
    frame++;
    playerUpdate();
    monsterUpdate();
}

var playerRender = function()
{
    ctx.beginPath();
        ctx.arc(player[0].x, player[0].y, player[0].radius, 0, Math.PI * 2 ,true);
        ctx.fillStyle = "#ffc6b3"
        ctx.fill();
        ctx.strokeStyle = "white";
        ctx.lineWidth = 6;
        ctx.stroke();
    ctx.closePath();
}
var monsterRender = function()
{
    for(let i = 0; i < monsterCount; i++)
    {
        if(!(monsters[i].isDie))
        {
            ctx.beginPath();
                ctx.arc(monsters[i].x, monsters[i].y, monsters[i].radius, 0, Math.PI * 2 ,true);
                ctx.fillStyle = "#ff0000"
                ctx.strokeStyle = "white";
                ctx.lineWidth = 5;
                ctx.stroke();
                ctx.fill();
            ctx.closePath();
        }
    }
}

var render = function()
{
    playerRender();
    monsterRender();
}

var gameLoop = function()
{
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    update();
    render();
}

var keyDownFunc = function(e)
{
    if(e.code == "KeyW")
    {
        upKeyDown = true;
    }
    if(e.code == "KeyA")
    {
        leftKeyDown = true;
    }
    if(e.code == "KeyS")
    {
        downKeyDown = true;
    }
    if(e.code == "KeyD")
    {
        rightKeyDown = true;
    }
}
var keyUpFunc = function(e)
{
    if(e.code == "KeyW")
    {
        upKeyDown = false;
    }
    if(e.code == "KeyA")
    {
        leftKeyDown = false;
    }
    if(e.code == "KeyS")
    {
        downKeyDown = false;
    }
    if(e.code == "KeyD")
    {
        rightKeyDown = false;
    }
}

// var mouseMoveFunc = function(e)
// {
//     mouseX = e.clientX - canvas.offsetLeft;
// }

document.addEventListener("keydown", keyDownFunc, false);
document.addEventListener("keyup", keyUpFunc, false);
// document.addEventListener("mousemove", mouseMoveFunc, false);

var gameId = setInterval(gameLoop, 10);