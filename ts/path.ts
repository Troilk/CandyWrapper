///<reference path='vector2.ts'/>
///<reference path='candy.ts'/>

enum PathType { Line, Radial };

class PathPart
{
    Type: PathType = PathType.Line;
    Start: Vector2 = null;
    End: Vector2 = null;
    Radius: number = 0.0;
    StartAngle: number = 0.0;
    EndAngle: number = 0.0;

    Length: number;

    constructor(type: PathType, start: Vector2, end?: Vector2,
        radius?: number, startAngle?: number, endAngle?: number)
    {
        this.Type = type;
        this.Start = start;
        this.End = end;
        this.Radius = radius;
        this.StartAngle = startAngle;
        this.EndAngle = endAngle;
        //calculate part length
        if (this.Type === PathType.Line)
        {
            var x = this.End.X - this.Start.X;
            var y = this.End.Y - this.Start.Y;
            this.Length = Math.sqrt(x * x + y * y);
        }
        else
        {
            this.Length = Math.abs(this.EndAngle - this.StartAngle) * this.Radius;
        }
    }
}

class Path
{
    Idx: number = 0;
    Parts: PathPart[] = null;
    NextCandyTime: number = 0.0;
    LastCandy: Candy = null;

    constructor(parts: PathPart[], idx: number)
    {
        this.Parts = parts;
        this.Idx = idx;
    }

    addEnemy(candy: Candy)
    {
        this.LastCandy = candy;
    }

    render(context: CanvasRenderingContext2D)
    {
        var part: PathPart = this.Parts[0];

        context.beginPath();
        context.moveTo(part.Start.X, part.Start.Y);
         
        for (var i = 0; i < this.Parts.length; ++i)
        {
            part = this.Parts[i];
            if (part.Type === PathType.Line)
            {
                context.lineTo(part.End.X, part.End.Y);
            }
            else
            {
                context.arc(part.Start.X, part.Start.Y, part.Radius,
                    part.StartAngle, part.EndAngle, part.StartAngle > part.EndAngle);
            }
        }

        context.stroke();
    }
}