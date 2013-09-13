///<reference path='sprite.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='vector2.ts'/>

class Spinner
{
    private SSprite: Sprite = null;
    Children: any[];
    Parent: Spinner = null;

    private Rotation: number = 0.0;
    TargetRotation: number = -1.0;

    Radius: number = 0.0;
    private Size: Vector2 = new Vector2();
    private Offset: Vector2 = new Vector2();
    private RotationSpeed: number = 0.0;
    Position: Vector2 = new Vector2();

    constructor(radius: number, position: Vector2, rotationSpeed: number, children: any[], spriteManager: SpriteManager)
    {
        this.Radius = radius;
        this.Offset.set(-radius, radius).mulScalar(0.5);
        this.RotationSpeed = rotationSpeed;
        this.Position.copy(position);
        this.Size.set(radius, radius);
        this.Children = children;
        this.SSprite = spriteManager.Sprites['arc'];

        for (var i = 0; i < children.length; ++i)
            children[i].Parent = this;
    }

    update(rotation: number, timeDelta: number)
    {
        if (this.TargetRotation !== -1.0)
        {
            this.Rotation += this.RotationSpeed * timeDelta;
            if (this.Rotation >= this.TargetRotation)
            {
                this.Rotation = this.TargetRotation;
                this.TargetRotation = -1.0;
            }
        }
        
        var totalRotation = rotation + this.Rotation,
            childRotation = 0.0,
            rad = this.Radius,
            child;

        for (var i = this.Children.length - 1; i >= 0; --i)
        {
            childRotation = totalRotation + Math.PI * 0.5 * i;
            child = this.Children[i];
            child.Position.set(Math.cos(childRotation) * rad, Math.sin(childRotation) * rad).add(this.Position);
            child.update(rotation, timeDelta);
        }
    }

    checkSpin(tapPos: Vector2): boolean
    {
        if (this.TargetRotation !== -1.0)
            return true;

        for (var i = this.Children.length - 1; i >= 0; --i)
        {
            if (this.Children[i].checkSpin(tapPos))
                return true;
        }

        var dx = tapPos.X - this.Position.X,
            dy = tapPos.Y - this.Position.Y;

        if (Math.sqrt(dx * dx + dy * dy) <= this.Radius)
        {
            this.TargetRotation = this.Rotation + Math.PI * 0.5;
            //for (var i = this.Children.length - 1; i >= 0; --i)
            //    this.Children[i].TargetRotation = this.Children[i].Rotation + Math.PI * 0.5;
            return true;
        }

        return false;
    }

    render(context: CanvasRenderingContext2D, rotation: number, timeDelta: number)
    {
        var totalRotation = rotation + this.Rotation,
            i = 0;

        //draw spinner itself
        for (i = 0; i < 4; ++i)
        {
            this.SSprite.draw(context, this.Position, this.Size,
                this.Rotation + i * 0.5 * Math.PI, this.Offset);
        }

        for (i = this.Children.length - 1; i >= 0; --i)
        {
            this.Children[i].render(context, totalRotation + Math.PI * 0.5 * i, timeDelta);
        }
    }
}