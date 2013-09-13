///<reference path='spinner.ts'/>
///<reference path='level.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='input_manager.ts'/>

class CandyWrapper
{
    private CurrentTime: number = 0.0;
    private GameLevel: Level = null;
    private InputMan: InputManager = null;
    private SpriteMan: SpriteManager = null;
    private Canvas: HTMLCanvasElement = null;
    private Context: CanvasRenderingContext2D = null;
    private MenuElement: HTMLDivElement = null;

    constructor() 
    {
        this.MenuElement = <HTMLDivElement>document.getElementById('menu');
        this.MenuElement.style.width = <any>(window.innerWidth * 0.4) + 'px';
        this.MenuElement.style.height = <any>(window.innerHeight * 0.4) + 'px';
        this.MenuElement.style.left = <any>(window.innerWidth * 0.3) + 'px';
        this.MenuElement.style.top = <any>(window.innerHeight * 0.1) + 'px';

        var startBtn = document.getElementById('startBtn');
        startBtn.style.fontSize = <any>(window.innerHeight * 0.035) + 'px';
        startBtn.style.left = <any>(window.innerWidth * 0.12) + 'px';
        startBtn.style.bottom = <any>(window.innerHeight * 0.03) + 'px';

        document.getElementById('about').style.fontSize = <any>(window.innerHeight * 0.02) + 'px';

        //create level
        var canvas = document.createElement('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        //
        //canvas.width = 1280;
        //canvas.height = 720;
        //
        canvas.style.position = 'absolute';
        canvas.style.zIndex = '0';
        canvas.style.left = canvas.style.top = '0px';
        document.body.appendChild(canvas);
        this.Canvas = canvas;
        this.Context = canvas.getContext('2d');

        var scale = Math.min(canvas.width, canvas.height) / 720.0;
        this.SpriteMan = new SpriteManager(scale, new Vector2(canvas.width, canvas.height));
        this.InputMan = new InputManager(this.Canvas, this.SpriteMan);
    }

    showMenu()
    {
        this.GameLevel = null;
        document.body.appendChild(this.MenuElement);
    }

    startNewWave(wave: number)
    {
        this.GameLevel = new Level(this, wave, this.Canvas, this.Context, this.SpriteMan, this.InputMan,
             new Vector2(1280, 720));
    }

    update(timeDelta: number)
    {
        this.Context.fillStyle = '#000000';
        this.Context.setTransform(1, 0, 0, 1, 0, 0);
        this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        if (this.GameLevel !== null)
        {
            this.Context.drawImage(this.SpriteMan.BackgroundCanvas, 0, 0);
            this.GameLevel.update(timeDelta);
            this.InputMan.update();
        }
    }

    render(timeDelta: number)
    {
        if (this.GameLevel !== null)
        {
            this.GameLevel.render(timeDelta);
        }
    }

    start()
    {
        var that = this;

        document.getElementById('startBtn').addEventListener('click', function (ev: MouseEvent)
        {
            document.body.removeChild(that.MenuElement);
            that.startNewWave(1);
        });

        (function gameloop()
        {
            window['requestAnimFrame'](gameloop);
            var now = (self.performance !== undefined && self.performance.now !== undefined
                ? self.performance.now()
                : Date.now()) * 0.001;
            var timeDelta = now - that.CurrentTime;
            if (timeDelta > 0.3) timeDelta = 0.0;
            that.CurrentTime = now;
            that.update(timeDelta);
            that.render(timeDelta);
        })();
    }
}

window['requestAnimFrame'] = (function ()
{
    return window['requestAnimationFrame'] ||
        window['webkitRequestAnimationFrame'] ||
        window['mozRequestAnimationFrame'] ||
        function (callback)
        {
            window.setTimeout(callback, 1000 / 60);
        };
})();

window.onload = () => {
    var game = new CandyWrapper();
    game.start();
};