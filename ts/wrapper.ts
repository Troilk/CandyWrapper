///<reference path='sprite.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='spinner.ts'/>
///<reference path='vector2.ts'/>

enum WrapperType { Apple = 0, Strawberry = 1, Blueberries = 2, Lemon = 3 }

class Wrapper
{
    private WSprite: Sprite = null;
    Parent: Spinner = null;
    Type: WrapperType = WrapperType.Apple;
    Position: Vector2 = new Vector2();
    Size: Vector2 = new Vector2();
    Radius: number = 0.0;

    constructor(type: WrapperType, size: Vector2, spriteManager: SpriteManager)
    {
        this.Type = type;
        this.Size.copy(size);
        this.Radius = size.X;
        this.WSprite = spriteManager.Sprites[type === WrapperType.Apple ? 'apple' : type === WrapperType.Strawberry ?
            'strawberry' : type === WrapperType.Blueberries ? 'blueberry' : 'lemon'];
    }

    update(rotation: number, timeDelta: number)
    { }

    checkSpin(tapPos: Vector2): boolean
    {
        if(this.Position.collides(this.Radius, tapPos, 0.0))
        {
            //TODO? : Tapped on guard actions
            return true;
        }
        return false;
    }

    render(context: CanvasRenderingContext2D, rotation: number, timeDelta: number)
    {
        this.WSprite.draw(context, this.Position, this.Size, rotation);
    }
}