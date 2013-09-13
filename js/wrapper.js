///<reference path='sprite.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='spinner.ts'/>
///<reference path='vector2.ts'/>
var WrapperType;
(function (WrapperType) {
    WrapperType[WrapperType["Apple"] = 0] = "Apple";
    WrapperType[WrapperType["Strawberry"] = 1] = "Strawberry";
    WrapperType[WrapperType["Blueberries"] = 2] = "Blueberries";
    WrapperType[WrapperType["Lemon"] = 3] = "Lemon";
})(WrapperType || (WrapperType = {}));

var Wrapper = (function () {
    function Wrapper(type, size, spriteManager) {
        this.WSprite = null;
        this.Parent = null;
        this.Type = WrapperType.Apple;
        this.Position = new Vector2();
        this.Size = new Vector2();
        this.Radius = 0.0;
        this.Type = type;
        this.Size.copy(size);
        this.Radius = size.X;
        this.WSprite = spriteManager.Sprites[type === WrapperType.Apple ? 'apple' : type === WrapperType.Strawberry ? 'strawberry' : type === WrapperType.Blueberries ? 'blueberry' : 'lemon'];
    }
    Wrapper.prototype.update = function (rotation, timeDelta) {
    };

    Wrapper.prototype.checkSpin = function (tapPos) {
        if (this.Position.collides(this.Radius, tapPos, 0.0)) {
            //TODO? : Tapped on guard actions
            return true;
        }
        return false;
    };

    Wrapper.prototype.render = function (context, rotation, timeDelta) {
        this.WSprite.draw(context, this.Position, this.Size, rotation);
    };
    return Wrapper;
})();
//# sourceMappingURL=wrapper.js.map
