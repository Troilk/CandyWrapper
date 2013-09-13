///<reference path='vector2.ts'/>
///<reference path='sprite.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='path.ts'/>
///<reference path='wrapper.ts'/>

class Candy
{
    private CSprite: Sprite = null;
    Wrapped: boolean = true;
    Type: WrapperType = WrapperType.Apple;
    Position: Vector2 = new Vector2();
    Size: Vector2 = new Vector2();
    Radius: number = 0.0;
    Speed: number = 0.0;

    private CPath: Path = null;
    private PathPartIdx: number = 0;
    private PartInterpolation: number = 0.0;
    private PartSpeed: number = 0.0;

    FinishedPath: boolean = true;

    constructor(size: Vector2)
    {
        this.Size.copy(size);
        this.Radius = size.X;
    }

    revive(type: WrapperType, spriteManager: SpriteManager, path: Path, speed: number)
    {
        this.Type = type;
        this.CPath = path;
        this.Speed = speed;
        this.Wrapped = false;
        this.FinishedPath = false;
        this.PathPartIdx = 0;
        this.PartInterpolation = 0.0;
        this.Position.set(-100, -100);
        this.CSprite = spriteManager.Sprites[type === WrapperType.Apple ? 'apple' : type === WrapperType.Strawberry ?
            'strawberry' : type === WrapperType.Blueberries ? 'blueberry' : 'lemon'];

        path.addEnemy(this);
        this.PartSpeed = this.Speed / this.CPath.Parts[0].Length;
    }

    update(timeDelta: number): boolean
    {
        //movement
        if (!this.FinishedPath)
        {
            var parts = this.CPath.Parts,
                part = parts[this.PathPartIdx];
            if (part.Type === PathType.Line)
            {
                this.Position.copy(part.End).sub(part.Start).mulScalar(this.PartInterpolation).add(part.Start);
            }
            else
            {
                var angle = (part.StartAngle + (part.EndAngle - part.StartAngle) * this.PartInterpolation);
                this.Position.set(part.Radius * Math.cos(angle), part.Radius * Math.sin(angle)).add(part.Start);
            }

            this.PartInterpolation += this.PartSpeed * timeDelta;
            if (this.PartInterpolation >= 1.0)
            {
                this.PartInterpolation -= 1.0;
                ++this.PathPartIdx;
                if (this.PathPartIdx < parts.length)
{
                    part = parts[this.PathPartIdx];
                    this.PartInterpolation *= (parts[this.PathPartIdx - 1].Length / part.Length);
                    this.PartSpeed = this.Speed / part.Length;
                }
                else
                {
                    this.FinishedPath = true;
                    return true;
                }
            }
        }

        return false;
    }

    render(context: CanvasRenderingContext2D, timeDelta: number)
    {
        if (this.FinishedPath || this.Wrapped)
            return;

        this.CSprite.draw(context, this.Position, this.Size);
    }
}