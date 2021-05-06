function log(message) {
    EAction.handleUserMessage("log: " + message);
}

function createEdgeWeights(left, top, right, bottom){
    return {
        left: left ? RLineweight.Weight070 : RLineweight.WeightByLayer,
        top: top ? RLineweight.Weight070 : RLineweight.WeightByLayer,
        right: right ? RLineweight.Weight070 : RLineweight.WeightByLayer,
        bottom: bottom ? RLineweight.Weight070 : RLineweight.WeightByLayer,
    }
}


function addRectangle(document, objectsOperation, board, weights, linetype) {
    log("addRectangle: " + board.left + board.bottom + board.width + board.height + weights + linetype);
    var lineLeft = new RLineEntity(document, new RLineData(new RVector(board.left, board.bottom), new RVector(board.left, board.bottom + board.height)));
    lineLeft.setLineweight(weights.left || RLineweight.WeightByLayer);
    lineLeft.setLinetypeId(linetype);

    var lineTop = new RLineEntity(document, new RLineData(new RVector(board.left, board.bottom + board.height), new RVector(board.left + board.width, board.bottom + board.height)));
    lineTop.setLineweight(weights.top || RLineweight.WeightByLayer);
    lineTop.setLinetypeId(linetype);

    var lineRight = new RLineEntity(document, new RLineData(new RVector(board.left + board.width, board.bottom + board.height), new RVector(board.left + board.width, board.bottom)));
    lineRight.setLineweight(weights.right || RLineweight.WeightByLayer);
    lineRight.setLinetypeId(linetype);

    var lineBottom = new RLineEntity(document, new RLineData(new RVector(board.left, board.bottom), new RVector(board.left + board.width, board.bottom)));
    lineBottom.setLineweight(weights.bottom || RLineweight.WeightByLayer);
    lineBottom.setLinetypeId(linetype);

    objectsOperation.addObject(lineLeft, false);
    objectsOperation.addObject(lineTop, false);
    objectsOperation.addObject(lineRight, false);
    objectsOperation.addObject(lineBottom, false);
}

function addPerpendicularHolesToVerticalCut(document, objectsOperation, left, bottom, width, height, thickness, holes) {
    // {d: widgets["spHole1Ed1"].value, l: widgets["spHole1El1"].value, t: LINE_DOT, offset: sbOffset, type: 'circle'}
    for (var i = 0, l = holes.length; i < l; i++) {
        var hole = holes[i];
        log(JSON.stringify(hole))

        if (hole.type == "circle") {
            var hole_lb = new RCircleEntity(document, new RCircleData(new RVector(left + hole.offset, bottom + thickness / 2), hole.d / 2));
            var hole_rb = new RCircleEntity(document, new RCircleData(new RVector(left + width - hole.offset, bottom + thickness / 2), hole.d / 2));
            var hole_lt = new RCircleEntity(document, new RCircleData(new RVector(left + hole.offset, bottom + height - thickness / 2), hole.d / 2));
            var hole_rt = new RCircleEntity(document, new RCircleData(new RVector(left + width - hole.offset, bottom + height - thickness / 2), hole.d / 2));
            objectsOperation.addObject(hole_lb, false);
            objectsOperation.addObject(hole_rb, false);
            objectsOperation.addObject(hole_lt, false);
            objectsOperation.addObject(hole_rt, false);
        } else if (hole.type == "rect") {
            addRectangle(document, objectsOperation, left + hole.offset - hole.d / 2, bottom, hole.d, hole.l, {}, hole.t);
            addRectangle(document, objectsOperation, left + width - hole.offset - hole.d / 2, bottom, hole.d, hole.l, {}, hole.t);
            addRectangle(document, objectsOperation, left + hole.offset - hole.d / 2, bottom + height - hole.l, hole.d, hole.l, {}, hole.t);
            addRectangle(document, objectsOperation, left + width - hole.offset - hole.d / 2, bottom + height - hole.l, hole.d, hole.l, {}, hole.t);
        } else if (hole.type == "minifix") {
            var minifix_lb = new RCircleEntity(document, new RCircleData(new RVector(left + hole.offset, bottom + hole.l), hole.d / 2));
            var minifix_rb = new RCircleEntity(document, new RCircleData(new RVector(left + width - hole.offset, bottom + hole.l), hole.d / 2));
            var minifix_lt = new RCircleEntity(document, new RCircleData(new RVector(left + hole.offset, bottom + height - hole.l), hole.d / 2));
            var minifix_rt = new RCircleEntity(document, new RCircleData(new RVector(left + width - hole.offset, bottom  + height - hole.l), hole.d / 2));
            minifix_lb.setLinetypeId(hole.t);
            minifix_rb.setLinetypeId(hole.t);
            minifix_lt.setLinetypeId(hole.t);
            minifix_rt.setLinetypeId(hole.t);
            objectsOperation.addObject(minifix_lb, false);
            objectsOperation.addObject(minifix_rb, false);
            objectsOperation.addObject(minifix_lt, false);
            objectsOperation.addObject(minifix_rt, false);
        }


    }
}

function addPerpendicularHolesToHorisontalCut(document, objectsOperation, left, bottom, width, height, thickness, holes) {
    // {d: widgets["spHole1Ed1"].value, l: widgets["spHole1El1"].value, t: LINE_DOT, offset: sbOffset}
    for (var i = 0, l = holes.length; i < l; i++) {
        var hole = holes[i];

        if (hole.type == "circle") {
        var circle_lb = new RCircleEntity(document, new RCircleData(new RVector(left + thickness / 2, bottom + hole.offset), hole.d / 2));
        var circle_rb = new RCircleEntity(document, new RCircleData(new RVector(left + width - thickness / 2, bottom + hole.offset), hole.d / 2));
        var circle_lt = new RCircleEntity(document, new RCircleData(new RVector(left + thickness / 2, bottom + height - hole.offset), hole.d / 2));
        var circle_rt = new RCircleEntity(document, new RCircleData(new RVector(left + width - thickness / 2, bottom + height - hole.offset), hole.d / 2));

        objectsOperation.addObject(circle_lb, false);
        objectsOperation.addObject(circle_rb, false);
        objectsOperation.addObject(circle_lt, false);
        objectsOperation.addObject(circle_rt, false);
        } else if (hole.type == "rect") {
            addRectangle(document, objectsOperation, left, bottom + hole.offset - hole.d / 2, hole.l, hole.d, {}, hole.t);
            addRectangle(document, objectsOperation, left, bottom + height - hole.offset - hole.d / 2, hole.l, hole.d, {}, hole.t);
            addRectangle(document, objectsOperation, left + width - hole.l, bottom + hole.offset - hole.d / 2, hole.l, hole.d, {}, hole.t);
            addRectangle(document, objectsOperation, left + width - hole.l, bottom + height - hole.offset - hole.d / 2, hole.l, hole.d, {}, hole.t);
        } else if (hole.type == "minifix") {
            var minifix_lb = new RCircleEntity(document, new RCircleData(new RVector(left + hole.l, bottom + hole.offset), hole.d / 2));
            var minifix_rb = new RCircleEntity(document, new RCircleData(new RVector(left + width - hole.l, bottom + hole.offset), hole.d / 2));
            var minifix_lt = new RCircleEntity(document, new RCircleData(new RVector(left + hole.l, bottom + height - hole.offset), hole.d / 2));
            var minifix_rt = new RCircleEntity(document, new RCircleData(new RVector(left + width - hole.l, bottom + height - hole.offset), hole.d / 2));
            minifix_lb.setLinetypeId(hole.t);
            minifix_rb.setLinetypeId(hole.t);
            minifix_lt.setLinetypeId(hole.t);
            minifix_rt.setLinetypeId(hole.t);
            objectsOperation.addObject(minifix_lb, false);
            objectsOperation.addObject(minifix_rb, false);
            objectsOperation.addObject(minifix_lt, false);
            objectsOperation.addObject(minifix_rt, false);
        }
    }
}

// // размеры
// this.sbWidth = 0;
// this.sbHeight = 0;
// this.sbThickness = 16;

// // кромление
// this.cbEdgingBottom = false;
// this.cbEdgingLeft = false;
// this.cbEdgingRight = false;
// this.cbEdgingTop = false;

// // присадка

// // кромление
// this.sbOffset = 37;

// // первое отверстие - конфирмат
// this.rbHole1K = false;
// this.spHole1Kd1 = 0;
// this.spHole1Kd2 = 0;
// this.spHole1Kl2 = 0;

// // первое отверстие - эксцентрик
// this.rbHole1E = true;
// this.spHole1Ed1 = 5;
// this.spHole1El1 = 11;
// this.spHole1Ed2 = 8;
// this.spHole1El2 = 30;
// this.spHole1Ed = 15;

// // первое отверстие - шкант
// this.rbHole1S = false;
// this.spHole1Sd1 = 8;
// this.spHole1Sl1 = 10;
// this.spHole1Sd2 = 8;
// this.spHole1Sl2 = 30;

// // второе отверстие - шкант
// this.cbHole2S = true;
// this.spHole2Sd1 = 8
// this.spHole2Sl1 = 10;
// this.spHole2Sd2 = 8;
// this.spHole2Sl2 = 30;

// // третье отверстие - конфирмат для ответной полки
// this.cbHole3K = false;
// this.spHole3Kd1 = 8;
// this.spHole3Kd2 = 8;
// this.spHole3Kl2 = 40;

// // генерировать ли проекцию детали с торца
// this.cbGenerateProjection = false;
