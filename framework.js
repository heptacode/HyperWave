var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");


// canvas 크기설정
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
}


// list
var setList = function(cls)
{
    if(cls.type == "enemy" || cls.type == "object" || cls.type == "player" || cls.type == "boss")
    {
        nowScene.collisionList.push(cls);
    }
    if(cls.type == "enemy" || cls.type == "boss")
    {
        nowScene.enemyList.push(cls);
    }
    if(cls.type == "enemy" || cls.type == "player" || cls.type == "cursor" || cls.type == "maker" || cls.type == "parts" || cls.type == "boss")
    {
        nowScene.updateList.push(cls);
    }
    if(cls.type == "effect")
    {
        nowScene.effectList.push(cls);
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
}// imageList에서 image를 불러옴(이미 추가하려는 image가 있으면 x)

var isLoadedTrue = (_path) =>
{
    imageList[_path].isLoaded = true;
}


// class

class Camera
{
    constructor(_target)
    {
        this.target = _target || {pos : {x : canvas.width / 2, y : canvas.height / 2}, image : {width : 0, height : 0}};
        this.pos = {x : 0, y : 0};
        this.tempPos = {x : this.pos.x, y : this.pos.y};
        this.power = {x : 0, y : 0};
        this.nowPower = {x : 0, y : 0};
        this.powerArray = [];

        this.isShaking = false;

        this.fadeList = [];
    }
    setBasic(_powerX, _powerY, _index)
    {
        this.power.x -= _powerX;
        this.power.y -= _powerY;
        this.powerArray.splice(_index, 1);
    }
    // _x(int), _y(int), _time(int)  말 그대로 화면을 shaking
    shaking(_x, _y, _time)
    {
        let info = {powerX : _x, powerY : _y, RTime : (Date.now() + _time * 1000)};
        this.powerArray.push(info);
        this.power.x += _x;
        this.power.y += _y;
        this.isShaking = true;
    }
    setObj()
    {
        for(let i = 0; i < nowScene.sceneThingList.length; i++)
        {
            if(nowScene.sceneThingList[i].camset == false)
            {
                nowScene.sceneThingList[i].pos.x += this.pos.x;
                nowScene.sceneThingList[i].pos.y += this.pos.y;

                nowScene.sceneThingList[i].camset = true;
            }
        }
    }   
    showFade()
    {
        for(let i = 0; i < this.fadeList.length; i++)
        {
            if(Date.now() > this.fadeList[i].RTime)
            {
                if(this.fadeList[i].opacity >= this.fadeList[i].maxOpacity && this.fadeList[i].canBack == false)
                {
                    this.fadeList[i].canBack = true;
                    this.fadeList[i].showRTime = Date.now() + this.fadeList[i].backTime * 1000;
                    this.fadeList[i].RTime += this.fadeList[i].backTime * 1000;
                }
                if(this.fadeList[i].canBack == true)
                {
                    if(Date.now() > this.fadeList[i].showRTime)
                    {
                        this.fadeList.slice(i, 1);
                        this.fadeList[i].isDelete = true;
                    }
                }
            }
            if(this.fadeList[i].opacity < this.fadeList[i].maxOpacity && this.fadeList[i].canBack == false)
            {
                this.fadeList[i].opacity += this.fadeList[i].maxOpacity / (this.fadeList[i].time * frame);
            }
            else if(this.fadeList[i].canBack == true)
            {
                this.fadeList[i].opacity -= this.fadeList[i].maxOpacity / (this.fadeList[i].backTime * frame);
            }
        }
    }
    setFade(_color, _opacity, _time, _showTime, _backTime, _z)
    {
        let fade = nowScene.addThing(new GameImage("image/fade/black.png", 0, 0, "fade"));
        fade.opacity = 0;
        fade.maxOpacity = _opacity;
        fade.time = _time;
        fade.showTime = _showTime * 1000;
        fade.showRTime = Date.now();
        fade.RTime = Date.now() + _showTime * 1000;
        fade.backTime = _backTime;
        fade.canBack = false;
        switch(_color)
        {
            case "white" : fade.path = "image/fade/white.png"; fade.setImage(); break;
        }
        fade.setZ(_z);
        this.fadeList.push(fade);
    }
    posUpdating()
    {
        if(this.target.pos.x < nowScene.background.pos.x - this.target.image.width / 2 + canvas.width / 2)
        {
            this.pos.x = nowScene.background.pos.x;

            if(this.target.pos.y < nowScene.background.pos.y - this.target.image.height / 2 + canvas.height / 2)
            {
                this.pos.y = nowScene.background.pos.y;
            }
            else if(this.target.pos.y > nowScene.background.pos.y + nowScene.background.image.height - this.target.image.height / 2 - canvas.height / 2)
            {
                this.pos.y = nowScene.background.pos.y + nowScene.background.image.height - canvas.height;
            }
            else
            {
                this.pos.y = this.target.pos.y + this.target.image.height / 2 - canvas.height / 2
            }
        }
        else if(this.target.pos.x > nowScene.background.pos.x + nowScene.background.image.width - this.target.image.width / 2 - canvas.width / 2)
        {
            this.pos.x = nowScene.background.pos.x + nowScene.background.image.width - canvas.width;

            if(this.target.pos.y < nowScene.background.pos.y - this.target.image.height / 2 + canvas.height / 2)
            {
                this.pos.y = nowScene.background.pos.y;
            }
            else if(this.target.pos.y > nowScene.background.pos.y + nowScene.background.image.height - this.target.image.height / 2 - canvas.height / 2)
            {
                this.pos.y = nowScene.background.pos.y + nowScene.background.image.height - canvas.height;
            }
            else
            {
                this.pos.y = this.target.pos.y + this.target.image.height / 2 - canvas.height / 2
            }
        }
        else
        {
            this.pos.x = this.target.pos.x + this.target.image.width / 2 - canvas.width / 2;
        }

        if(this.target.pos.y < nowScene.background.pos.y - this.target.image.height / 2 + canvas.height / 2)
        {
            this.pos.y = nowScene.background.pos.y;
        }
        else if(this.target.pos.y > nowScene.background.pos.y + nowScene.background.image.height - this.target.image.height / 2 - canvas.height / 2)
        {
            this.pos.y = nowScene.background.pos.y + nowScene.background.image.height - canvas.height;
        }
        else
        {
            this.pos.y = this.target.pos.y + this.target.image.height / 2 - canvas.height / 2;
        }
    }
    update()
    {
        if(nowScene.player != undefined)
        {
            this.posUpdating();
        }
        else
        {
            this.pos = {x : this.target.pos.x + this.target.image.width / 2 - canvas.width / 2, y : this.target.pos.y + this.target.image.height / 2 - canvas.height / 2}; // target의 중심
        }
        this.nowPower = {x : this.power.x * (Math.random() * 2 - 1), y : this.power.y * (Math.random() * 2 - 1)}; // random으로 nowPower 설정

        if(this.power.x == 0 && this.power.y == 0)
        {
            this.isShaking = false;
        }
        if(this.isShaking == true)
        {
            for(let i = 0; i < this.powerArray.length; i++)
            {
                if(Date.now() >= this.powerArray[i].RTime) // this.powerArray[i]의 시간이 다 되면 powerArray에서 제거
                {
                    this.setBasic(this.powerArray[i].powerX, this.powerArray[i].powerY, i);
                }
            }
        }
        this.showFade();
    }
}
class GameText
{
    constructor(_x, _y, _size, _style, _text)
    {
        // x, y, style, text
        if (arguments.length === 4)
        {
            this.pos = {x : arguments[0], y : arguments[1]};
            this.size = arguments[2];
            this.style = arguments[3];
            this.text = arguments[4];
            this.gradient = null;
        }

        // x, y, style, text, gradient
        else if (arguments.length === 5)
        {
            this.pos = {x : arguments[0], y : arguments[1]};
            this.size = arguments[2];
            this.style = arguments[3];
            this.text = arguments[4];
            this.gradient = arguments[5];

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
        this.color = {r : 0, g : 0, b : 0};
        this.opacity = 1;

        this.isDelete = false;
        this.isFixed = false;
        this.isCenter = false;
        this.camset = false;

        this.type = "text";
    }
    setCenter()
    {
        this.isCenter = true;
        this.pos.y += this.size * 2 / 7
    }
    render()
    {   
        ctx.resetTransform();
        ctx.font = this.size.toString() + "px " + this.style;

        if (this.gradient != null)
        {
            let grad = ctx.createLinearGradient(0, 0, canvas.width, 0);
            this.gradient.forEach(element => {
                grad.addColorStop(element.pos, element.color);
            })
            ctx.fillStyle = grad;
        }
        else
        {
            ctx.fillStyle = ("rgba(" + this.color.r + ", " + this.color.g + ", " + this.color.b + ", " + this.opacity + ")");
        }
        ctx.transform(this.scale.x, 0, 0, this.scale.y, this.scale.x, this.scale.y);
        ctx.globalAlpha = this.opacity;
        ctx.textAlign = "center";
        if (this.isFixed == true)
        {
            ctx.fillText(this.text, this.pos.x, this.pos.y);
        }
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
        nowScene.sceneThingList.sort(function(a, b)
        {
            return a.z - b.z;
        });
    }
}
class GameImage
{
    constructor(_path, _x, _y, _type)
    {
        this.path = _path;
        this.pos = {x : _x, y : _y};
        this.scale = {x : 1, y : 1};
        this.rot = 0;
        this.z = 0;
        this.opacity = 1;
        this.type = _type;

        // stroke
        this.strokeStyle = arguments[5] || 0;
        this.strokeWidth = arguments[4] || 0;

        // 상황
        this.isDelete = false; // isDelete가 true면 모든 array에서 삭제 -> 아예 삭제
        this.isFixed = false; 

        this.camset = false;

        setList(this);

        this.setImage();
    }
    setImage()
    {
        if(imageList[this.path] == undefined) // imageList에서 path가 없을 때 imageList에 path를 저장
        {
            this.image = new Image();
            this.image.src = this.path;
            imageList[this.path] = {image : this.image, isLoaded : false};
            this.image.addEventListener("load", isLoadedTrue(this.path), false);
        }
        else // imageList에서 path가 있을 때 imageList에서 불러옴
        {
            this.image = imageList[this.path].image;
        }
        this.anchor = {x : -this.image.width / 2, y : -this.image.height / 2}; // anchor는 image의 rot에 따라 움직이는 축(?)
    }
    render()
    {
        if(!imageList[this.path].isLoaded) // 이미지 로드 안됐으면 render를 안함
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
        ctx.globalAlpha = this.opacity;
        ctx.drawImage(this.image, 0, 0);
        if(this.strokeWidth != 0)
        {
            ctx.strokeStyle = this.strokeStyle;
            ctx.lineWidth = this.strokeWidth;
            ctx.strokeRect(0, 0, this.image.width, this.image.height);
        }
    }
    setAnchor(_x, _y)
    {
        this.anchor = {x : this.anchor.x + _x, y : this.anchor.y + _y};
    }
    setZ(newZ)
    {
        this.z = newZ;
        nowScene.sceneThingList.sort(function(a, b)
        {
            return a.z - b.z;
        });
    }
    // canvas의 중심으로 이동
    setCanvasCenter()
    {
        this.pos.x = canvas.width / 2 - this.image.width / 2;
        this.pos.y = canvas.height / 2 - this.image.height / 2;
    }
    setBasic(rot, ancX, ancY)
    {
        this.rot = rot;
        this.anchor = {x : ancX, y : ancY};
    }
    setCenter()
    {
        this.pos.x -= this.image.width / 2;
        this.pos.y -= this.image.height / 2;
    }
    getCenter(pos)
    {
        if(pos == "x")
        {   
            return this.pos.x + this.image.width / 2;
        }
        else if(pos == "y")
        {
            return this.pos.y + this.image.height / 2;
        }
    }
    getImageLength(widthHeight)
    {
        if(widthHeight == "width")
        {
            return this.image.width * this.scale.x;
        }
        else if(widthHeight == "height")
        {
            return this.image.height * this.scale.y
        }
    }
}
class Button extends GameImage
{
    constructor(path, _x, _y, _z)
    {
        super(path, _x, _y, "button");

        this.pos.x -= this.image.width / 2;
        this.pos.y -= this.image.height / 2;
        this.setZ(_z);

        setList(this);
        this.clickFunc = function(){};

        if(arguments[5] != undefined)
        {
            this.text = nowScene.addThing(new GameText(this.getCenter("x"), this.getCenter("y"), arguments[6] || 30, "Arial", arguments[5]));
            this.text.setCenter();
            this.text.setZ(this.z + 1);
        }
        this.name = arguments[4] || "none";
        
        this.isChanged = false;
        this.isClicked = false;
    }
    setClickEvent(_func)
    {
        this.clickFunc = _func;
    }
    setTextCenter()
    {
        this.text.pos.x = this.getCenter("x");
        this.text.pos.y = this.getCenter("y");
        this.text.setCenter();
    }
    changeText(_text)
    {
        this.text.text = _text;
        this.isChanged = true;
        this.setTextCenter();
    }
    updating()
    {

    }
    update()
    {
        if(this.isDelete == true && this.text != undefined)
        {
            this.text.isDelete = true;
        }
        if(mouseValue["Left"] == 1 && Collision.dotToRect(nowScene.cursor, this) && nowScene.cursor.isOnTop(this) == true)
        {
            this.clickFunc();
            this.isClicked = true;
        }
        this.updating();
        this.isClicked = false;
    }
}
class MousePoint extends GameImage
{
    constructor(path, _x, _y)
    {
        super(path, _x, _y, "cursor");
        this.isFixed = true;
    }
    isOnTop(obj)
    {
        let topObj = obj;
        for(let i = 0; i < nowScene.sceneThingList.length; i++)
        {
            if(nowScene.sceneThingList[i] != this && nowScene.sceneThingList[i].type != "text")
            {
                if(Collision.dotToRect(this, nowScene.sceneThingList[i]) && nowScene.sceneThingList[i].z > topObj.z)
                {
                    topObj = nowScene.sceneThingList[i];
                }
            }
        }
        return (topObj == obj ? true : false);
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
        this.sceneThingList = [];
        this.cam;
    }
    init()
    {
        
    }
    start()
    {
        this.updateList = [];
        this.sceneThingList.length = 0;
        nowScene = this;
        this.init();
    }
    update()
    {
    }
    addThing(_obj)
    {
        this.sceneThingList.push(_obj);
        return _obj;
    }
    delete(arr)
    {
        for(let i = 0; i < arr.length; i++)
        {
            if(arr[i].isDelete == true)
            {
                arr.splice(i, 1);
            }
        }
    }
    render()
    {
        this.sceneThingList.forEach(element => element.render());
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
    nowScene.delete(nowScene.sceneThingList);
    ctx.resetTransform();
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    render();
}

setInterval(gameLoop, 0);