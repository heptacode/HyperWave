var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

var LTime = Date.now();
var RTime = 0;

var deltaTime = 0.016;
var frame = 60;
var imageList = {};


// Vector
function Vector(_x, _y) 
{
	this.x = _x || 0;
	this.y = _y || 0;
}
Vector.prototype = 
{
    multiply : function(v) 
    {
        if (v instanceof Vector) 
        {
			this.x *= v.x;
			this.y *= v.y;
        } 
        else 
        {
			this.x *= v;
			this.y *= v;
		}
		return this;
	},
    divide : function(v) 
    {
        if (v instanceof Vector) 
        {
			if(v.x != 0) this.x /= v.x;
			if(v.y != 0) this.y /= v.y;
        } 
        else 
        {
            if(v != 0) 
            {
				this.x /= v;
				this.y /= v;
			}
		}
		return this;
	},
    dot : function(v) 
    {
		return this.x * v.x + this.y * v.y;
	},
    length : function() 
    {
		return Math.sqrt(this.dot(this));
	},
    normalize : function() 
    {
		return this.divide(this.length());
	},
    set : function(x, y) 
    {
		this.x = x; this.y = y;
		return this;
    },
    fixSpeed : function(s) 
    {
        this.normalize();
        this.multiply(s);
        return;
    }
};


// list

var setList = function(cls)
{
    if(cls.type == "enemy" || cls.type == "object" || cls.type == "player")
    {
        nowScene.collisionList.push(cls);
    }
    if(cls.type == "enemy" || cls.type == "object" || cls.type == "effect" || cls.type == "maker")
    {
        nowScene.moveList.push(cls);
    }
    if(cls.type == "enemy" || cls.type == "player")
    {
        nowScene.playerAndEnemyList.push(cls);
    }
    if(cls.type == "enemy")
    {
        nowScene.enemyList.push(cls);
    }
    if(cls.type == "enemy" || cls.type == "player" || cls.type == "cursor" || cls.type == "maker")
    {
        nowScene.updateList.push(cls);
    }
    if(cls.type == "effect")
    {
        nowScene.effectList.push(cls);
    }
    if(cls.type == "maker")
    {
        nowScene.makerList.push(cls);
    }
}


// key

var Lkeys = {};
var keys = {};


// mouse

var mouseX = 0;
var mouseY = 0;
var mouseLValue = {};
var mouseValue = {};

var keyDownFunc = function(e)
{
    Lkeys[e.code] = 1;
    if(!keys.hasOwnProperty(e.code)) // 지금 누른 key code가 없으면
    {
        keys[e.code] = 0;
    }
}
var keyUpFunc = function(e)
{
    Lkeys[e.code] = -1;
}
var updateKeys = function()
{
    for(code in keys)
    {
        if(Lkeys[code] == 1 && keys[code] == 0) // 전엔 안눌렀는데 지금 눌렀다 -> 누른 순간
        {
            keys[code] = 1;
        }
        else if(Lkeys[code] == 1 && keys[code] == 1) // 전에 눌렀고 지금도 누르고 있다 -> 누르는 중
        {
            keys[code] = 2;
        }
        else if(Lkeys[code] == -1 && keys[code] == -1) // 전에 안눌렀고 지금도 안눌렀다 -> 때고 있는 중
        {
            keys[code] = 0;
            Lkeys[code] = 0;
        }
        else if(Lkeys[code] == -1) // 전엔 눌렀는데 지금은 안눌렀다 -> 키를 땐 순간
        {
            keys[code] = -1;
        }
    }
}
var mouseXY = function()
{
    if (window.Event)
    {
	    document.captureEvents(Event.MOUSEMOVE);
	}
	document.onmousemove = getCursorXY;
}
var getCursorXY = function(e)
{
	mouseX = (window.Event) ? e.pageX : event.clientX + (document.documentElement.scrollLeft ? document.documentElement.scrollLeft : document.body.scrollLeft);
	mouseY = (window.Event) ? e.pageY : event.clientY + (document.documentElement.scrollTop ? document.documentElement.scrollTop : document.body.scrollTop);
}
var mouseClickDown = function()
{
    switch(event.button)
    {
        case 0: mouseLValue["Left"] = 1; if(!mouseValue.hasOwnProperty("Left")){mouseValue["Left"] = 0;}; break;
        case 2: mouseLValue["Right"] = 1; if(!mouseValue.hasOwnProperty("Right")){mouseValue["Right"] = 0;}; break;
    }
}
var mouseClickUp = function()
{
    switch(event.button)
    {
        case 0: mouseLValue["Left"] = -1; break;
        case 2: mouseLValue["Right"] = -1; break;
    }
}
var updateMouse = function()
{

    //left
    if(mouseLValue["Left"] == 1 && mouseValue["Left"] == 0) // 전엔 안눌렀는데 지금 눌렀다 -> 누른 순간
    {
        mouseValue["Left"] = 1;
    }
    else if(mouseLValue["Left"] == 1 && mouseValue["Left"] == 1) // 전에 눌렀고 지금도 누르고 있다 -> 누르는 중
    {
        mouseValue["Left"] = 2;
    }
    else if(mouseLValue["Left"] == -1 && mouseValue["Left"] == -1) // 전에 안눌렀고 지금도 안눌렀다 -> 때고 있는 중
    {
        mouseValue["Left"] = 0;
        mouseLValue["Left"] = 0;
    }
    else if(mouseLValue["Left"] == -1) // 전엔 눌렀는데 지금은 안눌렀다 -> 키를 땐 순간
    {
        mouseValue["Left"] = -1;
    }

    //right
    if(mouseLValue["Right"] == 1 && mouseValue["Right"] == 0) // 전엔 안눌렀는데 지금 눌렀다 -> 누른 순간
    {
        mouseValue["Right"] = 1;
    }
    else if(mouseLValue["Right"] == 1 && mouseValue["Right"] == 1) // 전에 눌렀고 지금도 누르고 있다 -> 누르는 중
    {
        mouseValue["Right"] = 2;
    }
    else if(mouseLValue["Right"] == -1 && mouseValue["Right"] == -1) // 전에 안눌렀고 지금도 안눌렀다 -> 때고 있는 중
    {
        mouseValue["Right"] = 0;
        mouseLValue["Right"] = 0;
    }
    else if(mouseLValue["Right"] == -1) // 전엔 눌렀는데 지금은 안눌렀다 -> 키를 땐 순간
    {
        mouseValue["Right"] = -1;
    }
}

document.addEventListener("keydown", keyDownFunc, false);
document.addEventListener("keyup", keyUpFunc, false);
document.addEventListener("mousemove", mouseXY, false);
document.addEventListener("mousedown", mouseClickDown, false);
document.addEventListener("mouseup", mouseClickUp, false);
document.addEventListener("contextmenu", function()
{
    event.preventDefault();
});


// function

var preloadImage = function()
{
    for(let i = 0; i < arguments.length; i++)
    {
        var _image = new Image();
        _image.src = arguments[i];
        imageList[_image.src] = {image : _image, isLoaded : false};
        _image.addEventListener("load", function()
        {
            imageList[_image.src].isLoaded = true;
        }, false);
    }
}


// class

class Camera
{
    constructor(_target)
    {
        this.target = _target;
        this.pos = {x : 0, y : 0};
        this.power = {x : 0, y : 0};
        this.nowPower = {x : 0, y : 0};
        this.powerArray = [];

        this.LTime = Date.now();
        this.RTime = 0;

        this.isShaking = false;
    }
    setBasic(_powerX, _powerY, _index)
    {
        this.power.x -= _powerX;
        this.power.y -= _powerY;
        this.powerArray.splice(_index, 1);
    }
    shaking(_x, _y, _time)
    {
        let info = {powerX : _x, powerY : _y, RTime : (Date.now() + _time * 1000)};
        this.powerArray.push(info);
        this.power.x += _x;
        this.power.y += _y;
        this.isShaking = true;
    }
    update()
    {
        this.LTime = Date.now();
        this.pos = {x : this.target.pos.x + this.target.image.width / 2 - canvas.width / 2, y : this.target.pos.y + this.target.image.height / 2 - canvas.height / 2};
        this.nowPower = {x : this.power.x * (Math.random() * 2 - 1), y : this.power.y * (Math.random() * 2 - 1)};

        if(this.power.x == 0 && this.power.y == 0)
        {
            this.isShaking = false;
        }
        if(this.isShaking == true)
        {
            for(let i = 0; i < this.powerArray.length; i++)
            {
                if(this.LTime >= this.powerArray[i].RTime)
                {
                    this.setBasic(this.powerArray[i].powerX, this.powerArray[i].powerY, i);
                }
            }
        }
    }
}
class GameText
{
    constructor(_x, _y, _style, _text)
    {
        // x, y, style, text
        if (arguments.length === 4)
        {
            this.pos = {x : arguments[0], y : arguments[1]};
            this.style = arguments[2];
            this.text = arguments[3];
            this.gradient = null;
        }

        // x, y, style, text, gradient
        else if (arguments.length === 5)
        {
            this.pos = {x : arguments[0], y : arguments[1]};
            this.style = arguments[2];
            this.text = arguments[3];
            this.gradient = arguments[4];

            /*
            gradient = [
                {   pos : 0,
                    color : "red"
                },
                {   pos : 0.5,
                    color : "blue"
                },
                {   pos : 1,
                    color : "yellow"
                }
            ]
            
            */
        }

        this.scale = {x : 1, y : 1};
        this.rot = 0;
        this.z = 0;

        this.isDelete = false;
        this.isFixed = false;
    }
    render()
    {
        ctx.resetTransform();
        ctx.font = this.style;

        if (this.gradient != null)
        {
            let grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            this.gradient.forEach(element => {
                grad.addColorStop(element.pos, element.color);
            })
            ctx.fillStyle = grad;
        }
        //ctx.transform(this.scale.x, 0, 0, this.scale.y, -dx * this.scale.x, -dy * this.scale.y);
        ctx.transform(this.scale.x, 0, 0, this.scale.y, this.scale.x, this.scale.y);
        if (this.isFixed)
            ctx.fillText(this.text, this.pos.x, this.pos.y);
        else
        {
            let cameraPosX = - nowScene.cam.pos.x + nowScene.cam.nowPower.x;
            let cameraPosY = - nowScene.cam.pos.y + nowScene.cam.nowPower.y;
            ctx.fillText(this.text, this.pos.x + cameraPosX, this.pos.y + cameraPosY);
        }
    }
    setZ(newZ)
    {
        this.z = newZ;
        nowScene.sceneTextList.sort(function(a, b)
        {
            return a.z - b.z;
        });
    }
}
class GameImage
{
    constructor(path, _x, _y, _type)
    {
        this.path = path;
        this.pos = {x : _x, y : _y};
        this.scale = {x : 1, y : 1};
        this.rot = 0;
        this.z = 0;
        this.opacity = 1;
        this.type = _type;
        this.isDelete = false;
        this.isFixed = false;

        setList(this);

        if(imageList[path] == undefined)
        {
            this.image = new Image();
            this.image.src = path;
            imageList[path] = {image : this.image, isLoaded : false};
            this.image.addEventListener("load",         // 이미지 로딩됌
            function()
            {
                imageList[path].isLoaded = true;
            }, false);
        }
        else
        {
            this.image = imageList[path].image;
        }
        this.anchor = {x : -this.image.width / 2, y : -this.image.height / 2};
    }
    render()
    {
        if(!imageList[this.path].isLoaded) // 이미지 로드 안됐으면
        {
            return;
        }
        let dx = this.image.width + this.anchor.x;
        let dy = this.image.height + this.anchor.y;
        ctx.resetTransform();
        if (this.isFixed == true)
        {
            ctx.translate(this.pos.x + dx, this.pos.y + dy);
        }
        else
        {
            let cameraPosX = - nowScene.cam.pos.x + nowScene.cam.nowPower.x;
            let cameraPosY = - nowScene.cam.pos.y + nowScene.cam.nowPower.y;
            ctx.translate(this.pos.x + dx + cameraPosX, this.pos.y + dy + cameraPosY);
        }
        ctx.rotate(this.rot);
        ctx.transform(this.scale.x, 0, 0, this.scale.y, -dx * this.scale.x, -dy * this.scale.y);
        //ctx.transform(1, 0, 0, 1, -dx, -dy);
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.image, 0, 0);
    }
    setAnchor(_x, _y)
    {
        this.anchor = {x : this.anchor.x + _x, y : this.anchor.y + _y};
    }
    setZ(newZ)
    {
        this.z = newZ;
        nowScene.sceneImageList.sort(function(a, b)
        {
            return a.z - b.z;
        });
    }
    setBasic(rot, ancX, ancY)
    {
        this.rot = rot;
        this.anchor = {x : ancX, y : ancY};
    }
    getCenter(pos)
    {
        if(pos == "x")
            return this.pos.x + this.image.width / 2;
        else if(pos == "y")
            return this.pos.y + this.image.height / 2;
    }
    getImageLength(widthHeight)
    {
        if(widthHeight == "width")
            return this.image.width * this.scale.x;
        else if(widthHeight == "height")
            return this.image.height * this.scale.y
    }
}
class Button extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "button");
        this.pos.x -= this.image.width / 2;
        this.pos.y -= this.image.height / 2;

        setList(this);
        this.clickFunc = function(){};
    }
    clickEventSet(_func)
    {
        this.clickFunc = _func;
    }
    update()
    {
        if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, this))
        {
            this.clickFunc();
        }
    }
}

class MousePoint extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "cursor");
        this.isFixed = true;
    }
    update()
    {
        this.pos = { x : mouseX - this.image.width / 2, y : mouseY - this.image.height / 2}
        this.setZ(10);
    }
}


// scene

var nowScene = undefined;
class Scene
{
    constructor()
    {
        this.sceneImageList = [];
        this.sceneTextList = [];
        this.cam;
    }
    init()
    {
        
    }
    start()
    {
        this.sceneImageList.length = 0;
        this.sceneTextList.length = 0;
        nowScene = this;
        this.init();
    }
    update()
    {
    }
    addImage(image)
    {
        this.sceneImageList.push(image);
        return image;
    }
    addText(text)
    {
        this.sceneTextList.push(text);
        return text;
    }
    delete(index, arr)
    {
        arr.splice(index, 1);
        return;
    }
    checkDelete()
    {
        for(let i = 0; i < this.sceneImageList.length; i++)
        {
            if(this.sceneImageList[i].isDelete == true)
            {
                this.delete(i, this.sceneImageList);
            }
        }
        for(let i = 0; i < this.collisionList.length; i++)
        {
            if(this.collisionList[i].isDelete == true)
            {
                this.delete(i, this.collisionList);
            }
        }
        for(let i = 0; i < this.moveList.length; i++)
        {
            if(this.moveList[i].isDelete == true)
            {
                this.delete(i, this.moveList);
            }
        }
        for(let i = 0; i < this.playerAndEnemyList.length; i++)
        {
            if(this.playerAndEnemyList[i].isDelete == true)
            {
                this.delete(i, this.playerAndEnemyList);
            }
        }
        for(let i = 0; i < this.enemyList.length; i++)
        {
            if(this.enemyList[i].isDelete == true)
            {
                this.delete(i, this.enemyList);
            }
        }
        for(let i = 0; i < this.updateList.length; i++)
        {
            if(this.updateList[i].isDelete == true)
            {
                this.delete(i, this.updateList);
            }
        }
        for(let i = 0; i < this.effectList.length; i++)
        {
            if(this.effectList[i].isDelete == true)
            {
                this.delete(i, this.effectList);
            }
        }
        for(let i = 0; i < this.makerList.length; i++)
        {
            if(this.makerList[i].isDelete == true)
            {
                this.delete(i, this.makerList);
            }
        }
        for(let i = 0; i < this.sceneTextList.length; i++)
        {
            if(this.sceneTextList[i].isDelete == true)
            {
                this.delete(i, this.sceneTextList);
            }
        }
    }
    render()
    {
        this.sceneImageList.forEach(element => element.render());
        this.sceneTextList.forEach(element => element.render());
    }
}
var nullScene = new Scene();
nowScene = nullScene;


// gameLoop

var update = function()
{
    nowScene.update();
}
var render = function()
{
    nowScene.render();
}
var gameLoop = function()
{
    RTime = Date.now();
    deltaTime = (RTime - LTime) / 1000;
    frame = 1 / deltaTime;
    LTime = RTime;
    updateKeys();
    updateMouse();
    update();
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    render();

}

setInterval(gameLoop, 0);