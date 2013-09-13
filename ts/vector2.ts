class Vector2
{
    X: number = 0;
    Y: number = 0;

    constructor(x?: number, y?: number)
    {
        if (x) this.X = x;
        if (y) this.Y = y;
    }

    set(x: number, y: number)
    {
        this.X = x;
        this.Y = y;
        return this;
    }

    length()
    {
        return Math.sqrt(this.X * this.X + this.Y * this.Y);
    }

    add(v: Vector2)
    {
        this.X += v.X;
        this.Y += v.Y;
        return this;
    }

    subScalars(x: number, y: number)
    {
        this.X -= x;
        this.Y -= y;
        return this;
    }

    sub(v: Vector2)
    {
        this.X -= v.X;
        this.Y -= v.Y;
        return this;
    }

    mulScalar(a: number)
    {
        this.X *= a;
        this.Y *= a;
        return this;
    }

    normalize()
    {
        var l = 1 / this.length();
        this.X *= l;
        this.Y *= l;
        return this;
    }

    dot(v: Vector2)
    {
        return this.X * v.X + this.Y * v.Y;
    }

    copy(v: Vector2)
    {
        this.X = v.X;
        this.Y = v.Y;
        return this;
    }

    collides(rad: number, pos2: Vector2, rad2: number)
    {
        var x = this.X - pos2.X,
            y = this.Y - pos2.Y;
        return Math.sqrt(x * x + y * y) < rad + rad2;
    }
}