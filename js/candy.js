///<reference path='vector2.ts'/>
///<reference path='sprite.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='path.ts'/>
///<reference path='wrapper.ts'/>
var Candy = (function () {
    function Candy(size) {
        this.CSprite = null;
        this.Wrapped = true;
        this.Type = WrapperType.Apple;
        this.Position = new Vector2();
        this.Size = new Vector2();
        this.Radius = 0.0;
        this.Speed = 0.0;
        this.CPath = null;
        this.PathPartIdx = 0;
        this.PartInterpolation = 0.0;
        this.PartSpeed = 0.0;
        this.FinishedPath = true;
        this.Size.copy(size);
        this.Radius = size.X;
    }
    Candy.prototype.revive = function (type, spriteManager, path, speed) {
        this.Type = type;
        this.CPath = path;
        this.Speed = speed;
        this.Wrapped = false;
        this.FinishedPath = false;
        this.PathPartIdx = 0;
        this.PartInterpolation = 0.0;
        this.Position.set(-100, -100);
        this.CSprite = spriteManager.Sprites[type === WrapperType.Apple ? 'apple' : type === WrapperType.Strawberry ? 'strawberry' : type === WrapperType.Blueberries ? 'blueberry' : 'lemon'];

        path.addEnemy(this);
        this.PartSpeed = this.Speed / this.CPath.Parts[0].Length;
    };

    Candy.prototype.update = function (timeDelta) {
        if (!this.FinishedPath) {
            var parts = this.CPath.Parts, part = parts[this.PathPartIdx];
            if (part.Type === PathType.Line) {
                this.Position.copy(part.End).sub(part.Start).mulScalar(this.PartInterpolation).add(part.Start);
            } else {
                var angle = (part.StartAngle + (part.EndAngle - part.StartAngle) * this.PartInterpolation);
                this.Position.set(part.Radius * Math.cos(angle), part.Radius * Math.sin(angle)).add(part.Start);
            }

            this.PartInterpolation += this.PartSpeed * timeDelta;
            if (this.PartInterpolation >= 1.0) {
                this.PartInterpolation -= 1.0;
                ++this.PathPartIdx;
                if (this.PathPartIdx < parts.length) {
                    part = parts[this.PathPartIdx];
                    this.PartInterpolation *= (parts[this.PathPartIdx - 1].Length / part.Length);
                    this.PartSpeed = this.Speed / part.Length;
                } else {
                    this.FinishedPath = true;
                    return true;
                }
            }
        }

        return false;
    };

    Candy.prototype.render = function (context, timeDelta) {
        if (this.FinishedPath || this.Wrapped)
            return;

        this.CSprite.draw(context, this.Position, this.Size);
    };
    return Candy;
})();
//# sourceMappingURL=candy.js.map
