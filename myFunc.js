class Util
{
    static moveByAngle(pos, angle, dis)
    {
        // 1. moveByAngle(위치, 각도, 이동거리)
        // 2. moveByAngle(위치, 각도, 이동거리, 이동 후 이동거리)
        // 3. moveByAngle(위치, 각도, 이동거리, {x:이동 후 x 이동거리, y:이동 후 y 이동거리})
        if (arguments.length == 3)
        {
            pos.x += Math.cos(angle) * dis;
            pos.y += Math.sin(angle) * dis;
        }
        else if (arguments.length == 4)
        {
            if (typeof arguments[3] == Number)
            {
                pos.x += Math.cos(angle) * dis + arguments[3];
                pos.y += Math.sin(angle) * dis + arguments[3];
            }
            else
            {
                pos.x += Math.cos(angle) * dis + arguments[3].x;
                pos.y += Math.sin(angle) * dis + arguments[3].y;
            }
        }
    }
    static getCenter(_this)
    {
        if(arguments[1] == "x")
            return _this.pos.x + _this.image.width / 2;
        else if(arguments[1] == "y")
            return _this.pos.y + _this.image.height / 2;
    }
    static getAngle(obj1, obj2)
    {
        return Math.atan2(Util.getCenter(obj2, "y") - Util.getCenter(obj1, "y"), Util.getCenter(obj2, "x") - Util.getCenter(obj1, "x")) * 180 / Math.PI;
    }
    static getAngleBasic(_angle)
    {
        return (_angle < 0 ? (360 + _angle) : _angle);
    }
}

class Collision
{
    static circle(obj1, obj2)
    {
        if(arguments.length == 2)
        {
            return (Math.sqrt(Math.pow(Util.getCenter(obj1, "x") - Util.getCenter(obj2, "x"), 2) + Math.pow(Util.getCenter(obj1, "y") - Util.getCenter(obj2, "y"), 2)) <= (obj1.getImageLength("height") / 2 + obj2.getImageLength("height") / 2));
        }
        else if(arguments.length == 4)
        {
            return (Math.sqrt(Math.pow(Util.getCenter(obj1, "x") - Util.getCenter(obj2, "x"), 2) + Math.pow(Util.getCenter(obj1, "y") - Util.getCenter(obj2, "y"), 2)) <= (arguments[2] + arguments[3]));
        }
    }
    static arc(obj1, obj2)
    {
        //return ()
    }
    static dotToRect(dot, obj)
    {
        return (dot.getCenter("x") >= obj.pos.x && dot.getCenter("x") <= (obj.pos.x + obj.image.width) && dot.getCenter("y") >= obj.pos.y && dot.getCenter("y") <= obj.pos.y + obj.image.height);
    }
}