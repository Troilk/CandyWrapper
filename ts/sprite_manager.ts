///<reference path='sprite.ts'/>

class SpriteManager
{
    private RawSprites: string[] = [];
    private Atlas: HTMLCanvasElement = null;
    BackgroundCanvas: HTMLCanvasElement = null;
    GlobalScale: number = 1.0;
    private LucksCanvas: HTMLCanvasElement = null;

    Sprites: { [index: string]: Sprite } = {};
    LucksSprites: { [index: number]: Sprite } = { };

    constructor(globalScale: number, screenSize: Vector2)
    {
        this.GlobalScale = globalScale;

        //create canvas and get context
        var canvas = document.createElement('canvas');
        canvas.width = canvas.height = 512;
        this.Atlas = canvas;
        var context = canvas.getContext('2d');
        //    sprites = new Array(this.RawSprites.length);

        //this.Sprites = sprites;

        //for (var i = 0; i < sprites.length; ++i)
        //{
        //    context.translate((i * 64) % canvas.width, (i * 64) / canvas.width);
        //    Function('function(ctx){ctx.' + this.RawSprites[i].replace(/';'/g, ';ctx.').
        //        substring(0, this.RawSprites[i].length - 4) + '}')(context);
        //}

        //rendering spinner parts
        context.shadowBlur = 5 * globalScale;
        context.shadowColor = '#007FFF';
        context.strokeStyle = '#007FFF';
        context.lineWidth = 5;
        context.lineCap = 'round';
        context.beginPath();
        context.arc(274, 228, 220, 1.66 * Math.PI, 1.85 * Math.PI);
        context.stroke();
        //this.Sprites['arc'] = new Sprite(canvas, 260, 0, 246, 246, this);
        this.Sprites['arc'] = new Sprite(canvas, 264, 0, 246, 246, this);

        //wrappers sprites
        context.shadowBlur = 5 * globalScale;
        context.lineWidth = 1;

        context.fillStyle = context.shadowColor = '#0066CC';
        context.beginPath();
        context.arc(64, 64, 64, 0, Math.PI * 2);
        context.fill();
        this.Sprites['blueberry'] = new Sprite(canvas, 0, 0, 128, 128, this);

        context.fillStyle = context.shadowColor = '#FFCC00';
        context.beginPath();
        context.arc(128 + 64, 64, 64, 0, Math.PI * 2);
        context.fill();
        this.Sprites['lemon'] = new Sprite(canvas, 128, 0, 128, 128, this);

        context.fillStyle = context.shadowColor =  '#CC0000';
        context.beginPath();
        context.arc(64, 64 + 128, 64, 0, Math.PI * 2);
        context.fill();
        this.Sprites['strawberry'] = new Sprite(canvas, 0, 128, 128, 128, this);

        context.fillStyle = context.shadowColor =  '#00CC00';
        context.beginPath();
        context.arc(64 + 128, 64 + 128, 64, 0, Math.PI * 2);
        context.fill();
        this.Sprites['apple'] = new Sprite(canvas, 128, 128, 128, 128, this);
        //
        //candy sprites
        //
        //bonus sprites
        this.Sprites['SlowTime'] = new Sprite(canvas, 0, 0, 128, 128, this);
        this.Sprites['FiftyByFifty'] = new Sprite(canvas, 128, 0, 128, 128, this);
        this.Sprites['NoPenalty'] = new Sprite(canvas, 0, 128, 128, 128, this);
        this.Sprites['MinusPath'] = new Sprite(canvas, 128, 128, 128, 128, this);

        this.Sprites['readyRotor'] = new Sprite(canvas, 0, 0, 128, 128, this);
        //

        context.strokeStyle = context.shadowColor = '';
        context.lineWidth = 14;
        context.beginPath();
        context.moveTo(266, 266 + context.lineWidth);
        context.lineTo(267, 266 + context.lineWidth);
        context.stroke();
        this.Sprites['barSample'] = new Sprite(canvas, 266, 266, 1, context.lineWidth * 2, this);

        //prerender game background

        var bcanvas = document.createElement('canvas');
        bcanvas.width = screenSize.X;
        bcanvas.height = screenSize.Y;
        this.BackgroundCanvas = bcanvas;
        var bcontext = bcanvas.getContext('2d');
        var coreColor = 'rgba(0,0,0,0)';

        bcontext.fillStyle = coreColor;//'#66CCFF';
        bcontext.fillRect(0, 0, bcanvas.width, bcanvas.height);

        var grd = bcontext.createRadialGradient(920 * globalScale, 360 * globalScale,
            50 * globalScale, 920 * globalScale, 360 * globalScale, 500 * globalScale);
        grd.addColorStop(0, '#003399');
        grd.addColorStop(1, coreColor);

        bcontext.beginPath();
        bcontext.fillStyle = grd;
        bcontext.rect(0, 0, bcanvas.width, bcanvas.height);
        bcontext.fill();

        //prerendered GUI
        bcontext.setTransform(globalScale, 0, 0, globalScale, 0, 0);
        bcontext.fillStyle = '#007FFF';
        bcontext.font = '22px bold marker felt, comic sans ms, arial';
        bcontext.textBaseline = 'top';
        bcontext.fillText('Score:', 10, 50);
        bcontext.fillText('Speed:', 10, 80);

        bcontext.globalAlpha = 0.2;
        this.Sprites['barSample'].draw(bcontext, new Vector2(180, 670), new Vector2(120, 24));
        bcontext.globalAlpha = 1.0;

        bcontext.setTransform(1, 0, 0, 1, 0, 0);

        //draw luck sprites
        var lcanvas = document.createElement('canvas');
        lcanvas.width = lcanvas.height = 512;
        var lcontext = lcanvas.getContext('2d');

        lcontext.shadowBlur = 16;
        lcontext.lineWidth = 5;
        lcontext.font = '42px bold marker felt, comic sans ms, arial';
        lcontext.textBaseline = 'top';

        lcontext.fillStyle = lcontext.shadowColor = '#FF3333';
        lcontext.fillText('Bad Luck', 16, 16);

        lcontext.fillStyle = lcontext.shadowColor = '#6599FF';
        lcontext.fillText('Ok', 16, 90);

        lcontext.fillStyle = lcontext.shadowColor = '#9CFF00';
        lcontext.fillText('Good', 16, 164);

        lcontext.fillStyle = lcontext.shadowColor = '#990099';
        lcontext.fillText('Awesome', 16, 238);

        lcontext.fillStyle = lcontext.shadowColor = '#FF9900';
        lcontext.fillText('Mega', 16, 312);

        this.LucksSprites[LuckLevel.Bad] = new Sprite(lcanvas, 0, 0, 512, 74, this);
        this.LucksSprites[LuckLevel.Ok] = new Sprite(lcanvas, 0, 74, 512, 74, this);
        this.LucksSprites[LuckLevel.Good] = new Sprite(lcanvas, 0, 148, 512, 74, this);
        this.LucksSprites[LuckLevel.Awesome] = new Sprite(lcanvas, 0, 222, 512, 74, this);
        this.LucksSprites[LuckLevel.Mega] = new Sprite(lcanvas, 0, 296, 512, 74, this);

        document.body.appendChild(lcanvas);
    }
}