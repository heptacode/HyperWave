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
    static getCenter(_obj)
    {
        if(arguments[1] == "x")
        {
            return (_obj.pos.x + _obj.image.width / 2);
        }
        else if(arguments[1] == "y")
        {
            return (_obj.pos.y + _obj.image.height / 2);
        }
    }
    static getAngle(obj1, obj2)
    {
        return (Math.atan2(Util.getCenter(obj2, "y") - Util.getCenter(obj1, "y"), Util.getCenter(obj2, "x") - Util.getCenter(obj1, "x")) * 180 / Math.PI);
    }
    static getAngleBasic(_angle)
    {
        return (_angle < 0 ? (360 + _angle) : _angle);
    }
    static getDistance(x1, y1, x2, y2)
    {
        return (Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2)));
    }
}

class Collision
{
    static rect(obj1, obj2)
    {
        if(arguments.length == 2)
        {
            return !(obj1.pos.x > obj2.pos.x + obj2.image.width || obj1.pos.x + obj1.image.width < obj2.pos.x || obj1.pos.y > obj2.pos.y + obj2.image.height || obj1.pos.y + obj1.image.height < obj2.pos.y);
        }
        else if(arguments.length == 4)
        {
            return !(arguments[0].x > arguments[1].x + arguments[3].width || arguments[0].x + arguments[2].width < arguments[1].x || arguments[0].y > arguments[1].y + arguments[3].height || arguments[0].y + arguments[2].height < arguments[1].y);
        }
    }
    static circle(obj1, obj2)
    {
        if(arguments.length == 2)
        {
            return (Math.sqrt(Math.pow(Util.getCenter(obj1, "x") - Util.getCenter(obj2, "x"), 2) + Math.pow(Util.getCenter(obj1, "y") - Util.getCenter(obj2, "y"), 2)) <= (obj1.image.height / 2 + obj2.image.height / 2));
        }
        else if(arguments.length == 4)
        {
            return (Math.sqrt(Math.pow(Util.getCenter(obj1, "x") - Util.getCenter(obj2, "x"), 2) + Math.pow(Util.getCenter(obj1, "y") - Util.getCenter(obj2, "y"), 2)) <= (arguments[2] + arguments[3]));
        }
    }
    static dotToRect(dot, obj)
    {
        if(arguments.length == 2)
        {
            return (Util.getCenter(dot, "x") >= obj.pos.x && Util.getCenter(dot, "x") <= (obj.pos.x + obj.image.width) && Util.getCenter(dot, "y") >= obj.pos.y && Util.getCenter(dot, "y") <= obj.pos.y + obj.image.height);
        }
        else if(arguments.length == 4)
        {
            return (dot.pos.x + arguments[2].width / 2 >= obj.pos.x && dot.pos.x + arguments[2].width / 2 <= (obj.pos.x + arguments[3].width) && dot.pos.y + arguments[2].height / 2 >= obj.pos.y && dot.pos.y + arguments[2].height / 2 <= obj.pos.y + arguments[3].height);
        }
    }
    static circleToRotatedRect(_circle, _rect)
    {
        let rectTempRot = _rect.rot;

        let unrotatedCircleX = (Math.cos(-rectTempRot) * (Util.getCenter(_circle, "x") - Util.getCenter(_rect, "x"))) 
                             - (Math.sin(-rectTempRot) * (Util.getCenter(_circle, "y") - Util.getCenter(_rect, "y"))) + Util.getCenter(_rect, "x");

        let unrotatedCircleY = (Math.sin(-rectTempRot) * (Util.getCenter(_circle, "x") - Util.getCenter(_rect, "x"))) 
                             + (Math.cos(-rectTempRot) * (Util.getCenter(_circle, "y") - Util.getCenter(_rect, "y"))) + Util.getCenter(_rect, "y");

        let distX = Math.abs(unrotatedCircleX - _rect.pos.x - _rect.image.width / 2);
        let distY = Math.abs(unrotatedCircleY - _rect.pos.y - _rect.image.height / 2);

        if(distX > _circle.image.width / 2 + _rect.image.width / 2 || distY > _circle.image.width / 2 + _rect.image.height / 2)
        {
            return false;
        }
        if(distX <= _rect.image.width / 2 || distY <= _rect.image.height / 2)
        {
            return true;
        }

        return (Math.pow(distX - _rect.image.width / 2, 2) + Math.pow(distY - _rect.image.height / 2, 2) <= Math.pow(_circle.image.width / 2, 2));
    }
}