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
    static getCenter(obj)
    {
        if(arguments[1] == "x")
        {
            return (obj.pos.x + obj.image.width / 2);
        }
        else if(arguments[1] == "y")
        {
            return (obj.pos.y + obj.image.height / 2);
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
    static dotToRect(dot, obj)
    {
        return (dot.getCenter("x") >= obj.pos.x && dot.getCenter("x") <= (obj.pos.x + obj.image.width) && dot.getCenter("y") >= obj.pos.y && dot.getCenter("y") <= obj.pos.y + obj.image.height);
    }
    static circleToRotatedRect(_circle, _rect)
    {
        let rectTempRot = Util.getAngleBasic(_rect.rot * 180 / Math.PI) / 180 * Math.PI;

        let unrotatedCircleX = Math.cos(rectTempRot) * (_circle.pos.x - Util.getCenter(_rect, "x")) - Math.sin(rectTempRot) * (_circle.pos.y + _circle.image.height - Util.getCenter(_rect, "y")) + Util.getCenter(_rect, "x");
        let unrotatedCircleY = Math.sin(rectTempRot) * (_circle.pos.x - Util.getCenter(_rect, "x")) + Math.cos(rectTempRot) * (_circle.pos.y + _circle.image.height - Util.getCenter(_rect, "y")) +Util.getCenter(_rect, "y");

        let deltaX = unrotatedCircleX - Math.max(_rect.pos.x, Math.min(unrotatedCircleX, _rect.pos.x + _rect.image.width));
        let deltaY = unrotatedCircleY - Math.max(_rect.pos.y, Math.min(unrotatedCircleY, _rect.pos.y + _rect.image.height));

        return (deltaX * deltaX + deltaY * deltaY) < (_circle.image.width * _circle.image.width);
    }
}