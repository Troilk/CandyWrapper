var Vector2 = (function () {
    function Vector2(x, y) {
        this.X = 0;
        this.Y = 0;
        if (x)
            this.X = x;
        if (y)
            this.Y = y;
    }
    Vector2.prototype.set = function (x, y) {
        this.X = x;
        this.Y = y;
        return this;
    };

    Vector2.prototype.length = function () {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    };

    Vector2.prototype.add = function (v) {
        this.X += v.X;
        this.Y += v.Y;
        return this;
    };

    Vector2.prototype.subScalars = function (x, y) {
        this.X -= x;
        this.Y -= y;
        return this;
    };

    Vector2.prototype.sub = function (v) {
        this.X -= v.X;
        this.Y -= v.Y;
        return this;
    };

    Vector2.prototype.mulScalar = function (a) {
        this.X *= a;
        this.Y *= a;
        return this;
    };

    Vector2.prototype.normalize = function () {
        var l = 1 / this.length();
        this.X *= l;
        this.Y *= l;
        return this;
    };

    Vector2.prototype.dot = function (v) {
        return this.X * v.X + this.Y * v.Y;
    };

    Vector2.prototype.copy = function (v) {
        this.X = v.X;
        this.Y = v.Y;
        return this;
    };

    Vector2.prototype.collides = function (rad, pos2, rad2) {
        var x = this.X - pos2.X, y = this.Y - pos2.Y;
        return Math.sqrt(x * x + y * y) < rad + rad2;
    };
    return Vector2;
})();
//# sourceMappingURL=vector2.js.map
