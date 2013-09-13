///<reference path='vector2.ts'/>
///<reference path='sprite_manager.ts'/>

interface TapGesture
{
    pos: Vector2;
    justTapped: boolean;
}

class InputManager
{
    //Tap gesture
    Tap: TapGesture = { pos: new Vector2(), justTapped: false };
    private MaxHoldTime: number = 250.0;
    private MaxDeltaDist: number = 10;
    private TouchPos: Vector2 = new Vector2();
    private TouchTime: number = 0.0;

    constructor(canvas: HTMLCanvasElement, spriteManager: SpriteManager)
    {
        var that = this;
        canvas.addEventListener('touchstart', function (e: any) {

            if (e.touches.length === 1)
            {
                that.TouchPos.set(e.touches[0].pageX - canvas.clientLeft,
                    e.touches[0].pageY - canvas.clientTop).mulScalar(1 / spriteManager.GlobalScale);
                that.TouchTime = Date.now();
            }

        }, false);

        canvas.addEventListener('touchend', function (e: any) {
            var posX = e.changedTouches[0].pageX - canvas.clientLeft,
                posY = e.changedTouches[0].pageY - canvas.clientTop;

            if (e.touches.length === 0 &&
                Date.now() - that.TouchTime < that.MaxHoldTime &&
                that.TouchPos.subScalars(posX, posY).length() < that.MaxDeltaDist)
            {
                that.Tap.justTapped = true;
                that.Tap.pos.set(posX, posY).mulScalar(1 / spriteManager.GlobalScale);
            }

        }, false);

        canvas.addEventListener('click', function (e) {

            that.Tap.justTapped = true;
            that.Tap.pos.set(e.pageX - canvas.clientLeft,
                e.pageY - canvas.clientTop).mulScalar(1 / spriteManager.GlobalScale);

        }, false);
    }

    update()
    {
        this.Tap.justTapped = false;
    }
}