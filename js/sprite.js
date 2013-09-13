///<reference path='vector2.ts'/>
///<reference path='sprite_manager.ts'/>
var Sprite = (function () {
    function Sprite(img, x, y, width, height, spriteManager) {
        this.Img = null;
        this.X = 0;
        this.Y = 0;
        this.Width = 0;
        this.Height = 0;
        this.SpriteMan = null;
        this.Img = img;
        this.X = x;
        this.Y = y;
        this.Width = width;
        this.Height = height;
        this.SpriteMan = spriteManager;
    }
    Sprite.prototype.draw = function (context, pos, size, angle, offset) {
        var gscale = this.SpriteMan.GlobalScale;
        if (angle) {
            var sin = Math.sin(angle) * gscale, cos = Math.cos(angle) * gscale;
            context.setTransform(cos, sin, -sin, cos, pos.X * gscale, pos.Y * gscale);
        } else
            context.setTransform(gscale, 0, 0, gscale, pos.X * gscale, pos.Y * gscale);
        if (offset)
            context.drawImage(this.Img, this.X, this.Y, this.Width, this.Height, -size.X * 0.5 - offset.X, -size.Y * 0.5 - offset.Y, size.X, size.Y);
else
            context.drawImage(this.Img, this.X, this.Y, this.Width, this.Height, -size.X * 0.5, -size.Y * 0.5, size.X, size.Y);
    };

    Sprite.prototype.drawLabel = function (context, pos, scale) {
        var gscale = this.SpriteMan.GlobalScale * scale;
        context.setTransform(gscale, 0, 0, gscale, pos.X * gscale, pos.Y * gscale);
        context.drawImage(this.Img, this.X, this.Y, this.Width, this.Height, 0, 0, this.Width, this.Height);
    };
    return Sprite;
})();
//# sourceMappingURL=sprite.js.map
