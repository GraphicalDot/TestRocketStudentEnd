function Line(x1,y1,x2,y2,is_vertical){
    this.x1=x1;
    this.y1=y1;
    this.x2=x2;
    this.y2=y2;
    this.is_vertical = is_vertical ? is_vertical : false;
}

Line.prototype.drawWithArrowheads=function(ctx){

    // arbitrary styling
    ctx.strokeStyle="rgba(0,0,0,.6)";
    ctx.lineWidth = .5;
    ctx.fillStyle="rgba(0,0,0,.8)";
    

    // draw the line
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    ctx.stroke();
    // draw the starting arrowhead
    var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
    //this.drawArrowhead(ctx,this.x1,this.y1,startRadians);

    // draw the ending arrowhead
    var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
    if (this.is_vertical)
        this.drawArrowhead(ctx,this.x2,this.y2,startRadians);
    else
        this.drawArrowhead(ctx,this.x2,this.y2,endRadians);
    ctx.strokeStyle="rgba(0,0,0,1)";
};

Line.prototype.drawArrowhead=function(ctx,x,y,radians){
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    ctx.lineTo(3,6);
    ctx.stroke();
    ctx.moveTo(0,0);
    ctx.lineTo(-3,6);
    ctx.stroke();
    ctx.restore();
};

CanvasRenderingContext2D.prototype.dashedLine = function (x1, y1, x2, y2, dashLen) {
    if (dashLen == undefined) dashLen = 2;
    this.moveTo(x1, y1);

    var dX = x2 - x1;
    var dY = y2 - y1;
    var dashes = Math.floor(Math.sqrt(dX * dX + dY * dY) / dashLen);
    var dashX = dX / dashes;
    var dashY = dY / dashes;

    var q = 0;
    while (q++ < dashes) {
        x1 += dashX;
        y1 += dashY;
        this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x1, y1);
    }
    this[q % 2 == 0 ? 'moveTo' : 'lineTo'](x2, y2);
};

function drawCartessianPlane(ctx, x, y, size) {
    ctx.strokeStyle="rgba(0,0,0,.3)";
    ctx.lineWidth = .5;
    ctx.fillStyle="rgba(0,0,0,.8)";
    
    // vertical line
    var vLine=new Line(x, y+size, x, y, true);
    vLine.drawWithArrowheads(ctx);

    // horizontal line
    var hLine=new Line(x, y+size, x+size, y+size);
    hLine.drawWithArrowheads(ctx);
    ctx.strokeStyle="rgba(0,0,0,1)";
}

// horizontal dashed line, line of optimum speed
function drawLineOfOptimumSpeed(ctx, x, y, size) {
    ctx.beginPath();
    ctx.dashedLine(x, y+size/2, x+size-(.05*size), y+size/2, 4);
    ctx.stroke();
    ctx.font = "normal 10pt 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
    ctx.fillText("Line of optimum speed", x+40, y+size/2-5);
}

// vertical dashed line, line of optimum accuracy
function drawLineOfOptimumAccuracy(ctx, x, y, size, optimum_accuracy_percentage) {
    ctx.beginPath();
    var optimumAccuracyLineStartX = x + size * (optimum_accuracy_percentage / 100);
    var optimumAccuracyLineStartY = y+(.05*size);
    ctx.dashedLine(optimumAccuracyLineStartX, optimumAccuracyLineStartY, optimumAccuracyLineStartX, y+size, 4);
    ctx.stroke();
    ctx.font = "normal 10pt 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
    ctx.fillText("Line of optimum accuracy", optimumAccuracyLineStartX-70, optimumAccuracyLineStartY+50);
}

// label all 4 quadrants
function labelQuadrants(ctx, x, y, size) {
    ctx.font = "normal 10pt 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
    ctx.fillStyle = "blue";
    ctx.fillText("High Speed Low Accuracy", x+20, y+40);

    ctx.fillStyle = "green";
    ctx.fillText("High Speed High Accuracy", x+size-150, y+40);

    ctx.fillStyle = "red";
    ctx.fillText("Low Speed Low Accuracy", x+20, y+size-40);

    ctx.fillStyle = "blue";
    ctx.fillText("Low Speed High Accuracy", x+size-150, y+size-40);
}

function drawPosition(ctx, x, y, size, pointRadius, speed, accuracy) {
    if (speed >= 0 && accuracy >= 50) {
        ctx.fillStyle = '#90ed7d';		// green
	ctx.strokeStyle = '#90ed7d';
    }
    else if (speed < 0 && accuracy < 50) {
        ctx.fillStyle = '#f7a35c';		// red
	ctx.strokeStyle = '#f7a35c';
    }
    else {
        ctx.fillStyle = '#7cb5ec';		// blue
	ctx.strokeStyle = '#7cb5ec';
    }
    ctx.beginPath();
    var pointX = x + (accuracy/100)*size;
    var speed = speed;
    if (speed >= 0) {
        var pointY = speed > size/2 ? y : y+speed;
    } else {
        var pointY = Math.abs(speed) > size/2 ? y+size : size/2+y-speed;
    }
    ctx.arc(pointX, pointY, pointRadius, 0, 2 * Math.PI, false);
    ctx.fill();
    ctx.stroke();
    ctx.font = "normal 10pt 'Helvetica Neue', 'Helvetica', 'Arial', sans-serif";
    ctx.fillText("You lie here", pointX+pointRadius, pointY+pointRadius);
    ctx.strokeStyle = 'black';
}