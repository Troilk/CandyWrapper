///<reference path='spinner.ts'/>
///<reference path='level.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='input_manager.ts'/>
var CandyWrapper = (function () {
    function CandyWrapper() {
        this.CurrentTime = 0.0;
        this.GameLevel = null;
        this.InputMan = null;
        this.SpriteMan = null;
        this.Canvas = null;
        this.Context = null;
        this.MenuElement = null;
        this.MenuElement = document.getElementById('menu');
        this.MenuElement.style.width = (window.innerWidth * 0.4) + 'px';
        this.MenuElement.style.height = (window.innerHeight * 0.4) + 'px';
        this.MenuElement.style.left = (window.innerWidth * 0.3) + 'px';
        this.MenuElement.style.top = (window.innerHeight * 0.1) + 'px';

        var startBtn = document.getElementById('startBtn');
        startBtn.style.fontSize = (window.innerHeight * 0.035) + 'px';
        startBtn.style.left = (window.innerWidth * 0.12) + 'px';
        startBtn.style.bottom = (window.innerHeight * 0.03) + 'px';

        document.getElementById('about').style.fontSize = (window.innerHeight * 0.02) + 'px';

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
    CandyWrapper.prototype.showMenu = function () {
        this.GameLevel = null;
        document.body.appendChild(this.MenuElement);
    };

    CandyWrapper.prototype.startNewWave = function (wave) {
        this.GameLevel = new Level(this, wave, this.Canvas, this.Context, this.SpriteMan, this.InputMan, new Vector2(1280, 720));
    };

    CandyWrapper.prototype.update = function (timeDelta) {
        this.Context.fillStyle = '#000000';
        this.Context.setTransform(1, 0, 0, 1, 0, 0);
        this.Context.fillRect(0, 0, this.Canvas.width, this.Canvas.height);
        if (this.GameLevel !== null) {
            this.Context.drawImage(this.SpriteMan.BackgroundCanvas, 0, 0);
            this.GameLevel.update(timeDelta);
            this.InputMan.update();
        }
    };

    CandyWrapper.prototype.render = function (timeDelta) {
        if (this.GameLevel !== null) {
            this.GameLevel.render(timeDelta);
        }
    };

    CandyWrapper.prototype.start = function () {
        var that = this;

        document.getElementById('startBtn').addEventListener('click', function (ev) {
            document.body.removeChild(that.MenuElement);
            that.startNewWave(1);
        });

        (function gameloop() {
            window['requestAnimFrame'](gameloop);
            var now = (self.performance !== undefined && self.performance.now !== undefined ? self.performance.now() : Date.now()) * 0.001;
            var timeDelta = now - that.CurrentTime;
            if (timeDelta > 0.3)
                timeDelta = 0.0;
            that.CurrentTime = now;
            that.update(timeDelta);
            that.render(timeDelta);
        })();
    };
    return CandyWrapper;
})();

window['requestAnimFrame'] = (function () {
    return window['requestAnimationFrame'] || window['webkitRequestAnimationFrame'] || window['mozRequestAnimationFrame'] || function (callback) {
        window.setTimeout(callback, 1000 / 60);
    };
})();

window.onload = function () {
    var game = new CandyWrapper();
    game.start();
};
//# sourceMappingURL=app.js.map
