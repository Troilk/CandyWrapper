///<reference path='spinner.ts'/>
///<reference path='sprite_manager.ts'/>
///<reference path='input_manager.ts'/>
///<reference path='wrapper.ts'/>
///<reference path='candy.ts'/>
///<reference path='path.ts'/>

enum LuckLevel { Bad = 0, Ok = 1, Good = 2, Awesome = 3, Mega = 4 };

class Level
{
    private Canvas: HTMLCanvasElement = null;
    private Context: CanvasRenderingContext2D = null;
    private Game: CandyWrapper = null;
    private SpriteMan: SpriteManager = null;
    private InputMan: InputManager = null;

    private GSpinner: Spinner = null;
    private Spinners: Spinner[] = null;

    private ScreenSize: Vector2 = new Vector2();
    private ScreenCenter: Vector2 = new Vector2();
    private SpinnerSpeed: number = 7.0;

    private Wave: number = 1;
    private Paths: Path[] = null;
    private PathSmoothness: number = 40.0;
    private PathsCanvas: HTMLCanvasElement = null;

    private Candies: Candy[] = null;
    private CandyRadius: number = 17.0;
    private MaxCandies: number = 60;
    private BaseCandySpeed: number = 100.0;
    private CurrentCandySpeed: number = this.BaseCandySpeed;

    private WrapperRadius: number = 35.0;
    private Wrappers: Wrapper[] = null;

    private Score: number = 0;
    private BaseScorePerCandy: number = 10;
    private TotalWrappedAmount: number = 0;
    private TotalSpinsDone: number = 0;
    private CurrentLuck: LuckLevel = LuckLevel.Good;
    private LuckMeter: number = 0;
    private TotalTimeElapsed: number = 0.0;
    private TimeToIncreaseSpeed: number = 30.0;
    private WaitingForNewWave: boolean = false;

    private CandiesCollected: number = 0;
    private CandiesToUp: number[] = [5, 12, 18, 26, 30];
    private CandiesToLose: number[] = [5, 6, 5, 3, 1];
    private CandiesLost: number = 0;

    private MaxLuckMeter: number = this.LuckMeter;
    private MeterSampler: Sprite;
    private MeterPos: Vector2 = new Vector2(120, 575);
    private MeterBarPos: Vector2 = new Vector2(120, 670);
    private MeterSize: Vector2 = new Vector2(0, 24);

    constructor(game: CandyWrapper, wave: number, canvas: HTMLCanvasElement, context: CanvasRenderingContext2D,
        spriteManager: SpriteManager, inputManager: InputManager,
        screenSize: Vector2)
    {
        this.Game = game;
        this.Wave = wave;
        this.Canvas = canvas;
        this.Context = context;
        this.SpriteMan = spriteManager;
        this.MeterSampler = spriteManager.Sprites['barSample'];
        this.InputMan = inputManager;
        this.ScreenSize.copy(screenSize);
        this.ScreenCenter.copy(screenSize).mulScalar(0.5);
        //generate level
        var wrappers: Wrapper[] = new Array(16),
            swrappers: Wrapper[] = null,
            spinners: Spinner[] = new Array(4),
            wrapperSize = new Vector2(this.WrapperRadius, this.WrapperRadius),
            i = 0, j = 0,
            types = [[0, 1, 2, 3], [0, 2, 1, 3], [0, 1, 3, 2], [0, 3, 2, 1]];

        for (i = 0; i < 4; ++i)
        {
            swrappers = new Array(4);
            for (j = 0; j < 4; ++j)
            {
                swrappers[j] = new Wrapper(types[i][j], wrapperSize, spriteManager);
                wrappers[i * 4 + j] = swrappers[j];
            }
            spinners[i] = new Spinner(80, new Vector2(), this.SpinnerSpeed, swrappers, spriteManager);
        }

        this.Spinners = spinners;
        this.GSpinner = new Spinner(220, new Vector2(920, 360), this.SpinnerSpeed,
            spinners, spriteManager);
        this.Wrappers = wrappers;

        //generate paths

        var pathsCoords: number[][] = [
            [-50, 360, 1480, 360],
            [-70, 280, 760, 280, 840, 140, 940, 40, 1040, 60, 1160, 160, 1480, 160],
            [-88, 440, 760, 440, 840, 580, 940, 680, 1040, 660, 1160, 560, 1480, 560]
        ];
        var pathSmooth = this.PathSmoothness,
            paths: Path[] = [],
            angSin = 0.0, angCos = 0.0,
            offset = 0.0,
            dir1: Vector2 = new Vector2(), dir2: Vector2 = new Vector2(),
            bis: Vector2 = new Vector2(),
            sa = 0.0, ea = 0.0;

        for (var k = 0; k < pathsCoords.length; ++k)
        {
            var controlPoints = pathsCoords[k],
                pathParts = new Array(controlPoints.length - 3),
                p1: Vector2, p2: Vector2, p3: Vector2 = null, p4: Vector2, center: Vector2;

            for (i = 0; i < pathParts.length; i += 2)
            {
                if (i + 1 < pathParts.length)
                {
                    p1 = new Vector2(controlPoints[i], controlPoints[i + 1]);
                    center = new Vector2(controlPoints[i + 2], controlPoints[i + 3]);
                    p4 = new Vector2(controlPoints[i + 4], controlPoints[i + 5]);

                    dir1.copy(p1).sub(center).normalize();
                    dir2.copy(p4).sub(center).normalize();

                    angCos = Math.sqrt((1 + dir1.dot(dir2)) * 0.5);
                    angSin = Math.sqrt(1 - angCos * angCos);

                    bis = new Vector2(dir1.X, dir1.Y).add(dir2).normalize().mulScalar(pathSmooth / angSin).add(center);

                    offset = pathSmooth * (angCos / angSin);

                    if (p3 !== null)
                        p1 = p3;
                    p2 = new Vector2(center.X, center.Y).add(dir1.mulScalar(offset));
                    p3 = new Vector2(center.X, center.Y).add(dir2.mulScalar(offset));

                    pathParts[i] = new PathPart(PathType.Line, p1, p2);

                    sa = (bis.Y > p2.Y ? -1 : 1) * Math.acos(dir1.copy(p2).sub(bis).mulScalar(1 / pathSmooth).X);
                    ea = (bis.Y > p3.Y ? -1 : 1) * Math.acos(dir2.copy(p3).sub(bis).mulScalar(1 / pathSmooth).X);

                    pathParts[i + 1] = new PathPart(PathType.Radial, bis,
                        null, pathSmooth, sa, ea);
                }
                else
                {
                    pathParts[i] = new PathPart(PathType.Line,
                        p3 ? p3 : new Vector2(controlPoints[i], controlPoints[i + 1]),
                        new Vector2(controlPoints[i + 2], controlPoints[i + 3]));
                }
            }

            paths.push(new Path(pathParts, k));
        }

        var pc = document.createElement('canvas');
        pc.width = canvas.width;
        pc.height = canvas.height;
        this.PathsCanvas = pc;

        var pcontext = pc.getContext('2d');
            //pcolors = ['#8F04A8', '#00B25C', '#FFD300', '#FF6F00', '#01939A', '#C7007D', '#ABF000', '#009999'];
        pcontext.lineCap = 'round';
        pcontext.lineWidth = 5 / spriteManager.GlobalScale;

        pcontext.scale(spriteManager.GlobalScale, spriteManager.GlobalScale);
        pcontext.shadowBlur = 5 * spriteManager.GlobalScale;
        try
        {
            pcontext.setLineDash([10 / spriteManager.GlobalScale]);
        } catch (e) { };
        pcontext.shadowColor = pcontext.strokeStyle = '#CCCCCC';
        pcontext.globalAlpha = 0.15;
        for (i = 0; i < paths.length; ++i)
        {
            //pcontext.shadowColor = pcontext.strokeStyle = pcolors[i];
            paths[i].render(pcontext);
        }

        this.Paths = paths;

        //create enemies
        this.Candies = new Array(this.MaxCandies);
        var candySize = new Vector2(this.CandyRadius, this.CandyRadius);
        for (i = 0; i < this.MaxCandies; ++i)
            this.Candies[i] = new Candy(candySize);
        this.Candies[0].revive(WrapperType.Lemon, spriteManager, paths[0], this.BaseCandySpeed);
        this.Candies[1].revive(WrapperType.Apple, spriteManager, paths[1], this.BaseCandySpeed);
        this.Candies[2].revive(WrapperType.Blueberries, spriteManager, paths[2], this.BaseCandySpeed);
    }

    update(timeDelta: number)
    {
        var i = 0, j = 0, k = 0, rnd = 0.0,
            candies = this.Candies,
            candy: Candy = null,
            candies = this.Candies,
            paths = this.Paths,
            candiesCount = candies.length,
            tap = this.InputMan.Tap,
            gSp = this.GSpinner,
            spinners = this.Spinners,
            sl = spinners.length,
            gr = this.WrapperRadius * 0.5,
            spRad = spinners[0].Radius + gr,
            gSpRad = gSp.Radius + spRad,
            wrappers: Wrapper[] = null;

        this.TotalTimeElapsed += timeDelta;
        if (!this.WaitingForNewWave && this.TotalTimeElapsed > this.TimeToIncreaseSpeed)
        {
            this.WaitingForNewWave = true;
        }

        if (tap.justTapped)
        {
            this.GSpinner.checkSpin(tap.pos);
        }

        this.GSpinner.update(0.0, timeDelta);

        var wrappedAmounts = [0, 0, 0, 0],
            candiesLost = 0,
            candiesFinishedPath = 0,
            wrappedCandies = 0;

        for (i = 0; i < candiesCount; ++i)
        {
            candy = candies[i];
            if (candy.FinishedPath)
            {
                ++candiesFinishedPath;
                continue;
            }

            if (!candy.Wrapped)
            {
                //update candy-wrapper collisions
                if (candy.Position.collides(candy.Radius, gSp.Position, gSpRad))
                {
                    for (j = 0; j < sl; ++j)
                        if (candy.Position.collides(candy.Radius * 0.5, spinners[j].Position, spRad))
                        {
                            wrappers = spinners[j].Children;
                            for (k = 0; k < wrappers.length; ++k)
                                if (candy.Type === wrappers[k].Type &&
                                    candy.Position.collides(candy.Radius * 0.5, wrappers[k].Position, gr))
                                {
                                    candy.Wrapped = true;
                                    candy.FinishedPath = true;
                                    ++wrappedAmounts[j];
                                    ++wrappedCandies;
                                    this.Score += this.BaseScorePerCandy * this.Wave;
                                    break;
                                }
                            break;
                        }
                }
            }

            if (candy.update(timeDelta) && !candy.Wrapped)
                ++candiesLost;
        }

        this.TotalWrappedAmount += wrappedCandies;
        this.CandiesCollected += wrappedCandies;

        //wave finished
        if (this.WaitingForNewWave && candiesFinishedPath === this.MaxCandies)
        {
            this.WaitingForNewWave = false;
            ++this.Wave;
            this.CurrentCandySpeed = this.BaseCandySpeed * (1 + 0.25 * (this.Wave - 1));
            this.TotalTimeElapsed = 0.0;
        }

        if (candiesLost > 0)
        {
            this.CandiesCollected = 0;
            this.CandiesLost += candiesLost;
            if (this.CandiesLost > this.CandiesToLose[this.CurrentLuck])
                if (this.CurrentLuck === LuckLevel.Bad)
                {
                    //end of game
                    this.Game.showMenu();
                }
                else
                {
                    --this.CurrentLuck;
                    this.CandiesLost = 0;
                }
        }
        else
        {
            if (this.CandiesCollected > this.CandiesToUp[this.CurrentLuck])
            {
                this.CandiesCollected = 0;
                this.CurrentLuck = Math.min(this.CurrentLuck + 1, LuckLevel.Mega);
            }
        }

        //generate candies
        if (!this.WaitingForNewWave && candiesFinishedPath > 3)
        {
            j = 0;
            for (i = 0; i < 3; ++i)
            {
                if (paths[i].LastCandy.Position.X > 150.0)
                {
                    if (Math.random() < 0.01)
                        for (; j < this.MaxCandies; ++j)
                            if (candies[j].FinishedPath)
                            {
                                rnd = Math.random();
                                candies[j].revive(rnd < 0.25 ? WrapperType.Apple : rnd < 0.5 ? WrapperType.Blueberries :
                                    rnd < 0.75 ? WrapperType.Lemon : WrapperType.Strawberry,
                                    this.SpriteMan, paths[i], this.CurrentCandySpeed);
                                break;
                            }
                }
            }
        }
    }

    render(timeDelta: number)
    {
        var i = 0,
            candies = this.Candies,
            candiesCount = candies.length,
            context = this.Context;

        context.setTransform(1, 0, 0, 1, 0, 0);
        context.drawImage(this.PathsCanvas, 0, 0);
        for (i = 0; i < candiesCount; ++i)
        {
            candies[i].render(context, timeDelta);
        }

        this.GSpinner.render(context, 0.0, timeDelta);

        //render gui elements
        context.setTransform(this.SpriteMan.GlobalScale, 0, 0, this.SpriteMan.GlobalScale, 0, 0);

        context.fillStyle = '#007FFF';
        context.font = '22px bold marker felt, comic sans ms, arial';
        context.textBaseline = 'top';
        context.shadowBlur = 0;
        context.fillText(<any>Math.floor(this.Score), 90, 50);
        context.fillText(<any>this.Wave, 90, 80);

        this.SpriteMan.LucksSprites[this.CurrentLuck].drawLabel(context, this.MeterPos, 1.0);
        this.MeterSize.X = (this.CandiesCollected / this.CandiesToUp[this.CurrentLuck]) * 120.0;
        this.MeterBarPos.X = 120 + this.MeterSize.X * 0.5;
        this.MeterSampler.draw(context, this.MeterBarPos, this.MeterSize); 

        context.setTransform(1, 0, 0, 1, 0, 0);
    }
}