///<reference path='vector2.ts'/>
///<reference path='sprite_manager.ts'/>

class Sprite
{
    private Img: HTMLCanvasElement = null;
    private X = 0;
    private Y = 0;
    private Width = 0;
    private Height = 0;
    private SpriteMan: SpriteManager = null;

    constructor(img, x: number, y: number, width: number, height: number, spriteManager: SpriteManager)
    {
        this.Img = img;
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.SpriteMan = spriteManager;
    }

    draw(context: CanvasRenderingContext2D,
        pos: Vector2, size: Vector2, angle?: number, offset?: Vector2)
    {
        var gscale = this.SpriteMan.GlobalScale;
        if (angle)
        {
            var sin = Math.sin(angle) * gscale,
                cos = Math.cos(angle) * gscale;
            context.setTransform(cos, sin, -sin, cos, pos.X * gscale, pos.Y * gscale);
        }
        else
            context.setTransform(gscale, 0, 0, gscale, pos.X * gscale, pos.Y * gscale);
        if (offset)
            context.drawImage(this.Img, this.X, this.Y, this.Width,
                this.Height, -size.X * 0.5 - offset.X, -size.Y * 0.5 - offset.Y, size.X, size.Y);
        else
            context.drawImage(this.Img, this.X, this.Y, this.Width,
                this.Height, -size.X * 0.5, -size.Y * 0.5, size.X, size.Y);
    }

    drawLabel(context: CanvasRenderingContext2D, pos: Vector2, scale?: number)
    {
        var gscale = this.SpriteMan.GlobalScale * scale;
        context.setTransform(gscale, 0, 0, gscale, pos.X * gscale, pos.Y * gscale);
        context.drawImage(this.Img, this.X, this.Y, this.Width,
            this.Height, 0, 0, this.Width, this.Height);
    }
}