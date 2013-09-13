///<reference path='vector2.ts'/>
///<reference path='candy.ts'/>
var PathType;
(function (PathType) {
    PathType[PathType["Line"] = 0] = "Line";
    PathType[PathType["Radial"] = 1] = "Radial";
})(PathType || (PathType = {}));
;

var PathPart = (function () {
    function PathPart(type, start, end, radius, startAngle, endAngle) {
        this.Type = PathType.Line;
        this.Start = null;
        this.End = null;
        this.Radius = 0.0;
        this.StartAngle = 0.0;
        this.EndAngle = 0.0;
        this.Type = type;
        this.Start = start;
        this.End = end;
        this.Radius = radius;
        this.StartAngle = startAngle;
        this.EndAngle = endAngle;

        if (this.Type === PathType.Line) {
            var x = this.End.X - this.Start.X;
            var y = this.End.Y - this.Start.Y;
            this.Length = Math.sqrt(x * x + y * y);
        } else {
            this.Length = Math.abs(this.EndAngle - this.StartAngle) * this.Radius;
        }
    }
    return PathPart;
})();

var Path = (function () {
    function Path(parts, idx) {
        this.Idx = 0;
        this.Parts = null;
        this.NextCandyTime = 0.0;
        this.LastCandy = null;
        this.Parts = parts;
        this.Idx = idx;
    }
    Path.prototype.addEnemy = function (candy) {
        this.LastCandy = candy;
    };

    Path.prototype.render = function (context) {
        var part = this.Parts[0];

        context.beginPath();
        context.moveTo(part.Start.X, part.Start.Y);

        for (var i = 0; i < this.Parts.length; ++i) {
            part = this.Parts[i];
            if (part.Type === PathType.Line) {
                context.lineTo(part.End.X, part.End.Y);
            } else {
                context.arc(part.Start.X, part.Start.Y, part.Radius, part.StartAngle, part.EndAngle, part.StartAngle > part.EndAngle);
            }
        }

        context.stroke();
    };
    return Path;
})();
//# sourceMappingURL=path.js.map
