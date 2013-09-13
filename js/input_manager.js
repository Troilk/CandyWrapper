///<reference path='vector2.ts'/>
///<reference path='sprite_manager.ts'/>
var InputManager = (function () {
    function InputManager(canvas, spriteManager) {
        //Tap gesture
        this.Tap = { pos: new Vector2(), justTapped: false };
        this.MaxHoldTime = 250.0;
        this.MaxDeltaDist = 10;
        this.TouchPos = new Vector2();
        this.TouchTime = 0.0;
        var that = this;
        canvas.addEventListener('touchstart', function (e) {
            if (e.touches.length === 1) {
                that.TouchPos.set(e.touches[0].pageX - canvas.clientLeft, e.touches[0].pageY - canvas.clientTop).mulScalar(1 / spriteManager.GlobalScale);
                that.TouchTime = Date.now();
            }
        }, false);

        canvas.addEventListener('touchend', function (e) {
            var posX = e.changedTouches[0].pageX - canvas.clientLeft, posY = e.changedTouches[0].pageY - canvas.clientTop;

            if (e.touches.length === 0 && Date.now() - that.TouchTime < that.MaxHoldTime && that.TouchPos.subScalars(posX, posY).length() < that.MaxDeltaDist) {
                that.Tap.justTapped = true;
                that.Tap.pos.set(posX, posY).mulScalar(1 / spriteManager.GlobalScale);
            }
        }, false);

        canvas.addEventListener('click', function (e) {
            that.Tap.justTapped = true;
            that.Tap.pos.set(e.pageX - canvas.clientLeft, e.pageY - canvas.clientTop).mulScalar(1 / spriteManager.GlobalScale);
        }, false);
    }
    InputManager.prototype.update = function () {
        this.Tap.justTapped = false;
    };
    return InputManager;
})();
//# sourceMappingURL=input_manager.js.map
