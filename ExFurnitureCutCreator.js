include("scripts/EAction.js");
include("scripts/WidgetFactory.js");
include("MyFurnitureCutCreator.js");

// https://www.qcad.org/en/tutorial-interactive-script-actions

function ExFurnitureCutCreator(guiAction) {
    EAction.call(this, guiAction);


    // this.setUiOptions("MyFurnitureCutCreator.ui");
}


ExFurnitureCutCreator.prototype = new EAction();


ExFurnitureCutCreator.prototype.beginEvent = function() {
    EAction.prototype.beginEvent.call(this);

    var document = EAction.getDocument();
    var di = EAction.getDocumentInterface();

    var LINE_CONTINUOUS = document.getLinetypeId("CONTINUOUS");
    var LINE_DOT = document.getLinetypeId("DOT");
    log("LINE_CONTINUOUS: " + LINE_CONTINUOUS);
    log("DOT: " + LINE_DOT);


    //let the user enter the desired parameters
    var dialog = WidgetFactory.createWidget("scripts/Misc/Examples/ExFurnitureCutCreator", "MyFurnitureCutCreator.ui");

    var widgets = getWidgets(dialog);
    // if (document.queryCurrentBlock().getName() != RBlock.modelSpaceName) {
    //   widgets["createInsideBlock"].checked = false;
    //   widgets["displayName"].setFocus();
    // }
    // else {
    //   widgets["blockName"].setFocus();
    // }
    if (!dialog.exec()) { //the user aborted
        dialog.destroy();
        this.terminate();
        return;
    }

    var sbWidth = widgets["sbWidth"].value;
    var sbHeight = widgets["sbHeight"].value;
    var sbThickness = widgets["sbThickness"].value;

    var cbEdgingLeft = widgets["cbEdgingLeft"].checked;
    var cbEdgingTop = widgets["cbEdgingTop"].checked;
    var cbEdgingRight = widgets["cbEdgingRight"].checked;
    var cbEdgingBottom = widgets["cbEdgingBottom"].checked;

    var op = new RAddObjectsOperation();


    var mainBoard = {left: 0, bottom: 0, width: sbWidth, height: sbHeight, thickness: sbThickness};

    // Основная проекция заготовки
    addRectangle(document, op, mainBoard, createEdgeWeights(cbEdgingLeft, cbEdgingTop, cbEdgingRight, cbEdgingBottom), LINE_CONTINUOUS);

    var cbGenerateProjectionVer = widgets["cbGenerateProjectionVer"].checked;
    var cbGenerateProjectionHor = widgets["cbGenerateProjectionHor"].checked;

    var BOARDS_MARGIN = 50;

    // Вертикальная боковая проекция
    if (cbGenerateProjectionVer) {
        var verticalBoard = {left: BOARDS_MARGIN + mainBoard.width, bottom: 0, width: mainBoard.thickness, height: mainBoard.height};
        addRectangle(document, op, verticalBoard, {}, LINE_CONTINUOUS);
    }

    // Горизонтальная боковая проекция
    if (cbGenerateProjectionHor) {
        var horisontalBoard = {left: 0, bottom: 0 - BOARDS_MARGIN - mainBoard.thickness, width: mainBoard.width, height: mainBoard.thickness};
        addRectangle(document, op, horisontalBoard, {}, LINE_CONTINUOUS);
    }

    var rbHolePerpendicular = widgets["rbHolePerpendicular"].checked;
    var rbHoleParallel = widgets["rbHoleParallel"].checked;
    var isBoardVertical = sbHeight >= sbWidth;

    // Присадки основной проекции
    var holes = [];

    var sbOffset = widgets["sbOffset"].value;
    if (rbHolePerpendicular) {
        if (widgets["rbHole1K"].checked) {
            holes.push({d: widgets["spHole1Kd1"].value, l: sbThickness, t: LINE_CONTINUOUS, offset: sbOffset, type: "circle"});
        } else if (widgets["rbHole1E"].checked) {
            holes.push({d: widgets["spHole1Ed1"].value, l: widgets["spHole1El1"].value, t: LINE_CONTINUOUS, offset: sbOffset, type: "circle"});
        } else if (widgets["rbHole1S"].checked) {
            holes.push({d: widgets["spHole1Sd1"].value, l: widgets["spHole1Sl1"].value, t: LINE_CONTINUOUS, offset: sbOffset, type: "circle"});
        }

        if (widgets["cbHole2S"].checked) {
            holes.push({d: widgets["spHole2Sd1"].value, l: widgets["spHole2Sl1"].value, t: LINE_CONTINUOUS, offset: sbOffset + 32, type: "circle"});
        }

        if (widgets["cbHole3K"].checked) {
            holes.push({d: widgets["spHole3Kd1"].value, l: sbThickness, t: LINE_CONTINUOUS, offset: sbOffset + 64, type: "circle"});
        }

    } else if (rbHoleParallel) {
        if (widgets["rbHole1K"].checked) {
            holes.push({d: widgets["spHole1Kd2"].value, l: widgets["spHole1Kl2"].value, t: LINE_DOT, offset: sbOffset, type: "rect"});
        }

        if (widgets["rbHole1E"].checked) {
            holes.push({d: widgets["spHole1Ed2"].value, l: widgets["spHole1El2"].value, t: LINE_DOT, offset: sbOffset, type: "rect"});
            holes.push({d: widgets["spHole1Ed"].value, l: widgets["spHole1El2"].value, t: LINE_DOT, offset: sbOffset, type: "minifix"});
        }

        if (widgets["rbHole1S"].checked) {
            holes.push({d: widgets["spHole1Sd2"].value, l: widgets["spHole1Sl2"].value, t: LINE_DOT, offset: sbOffset, type: "rect"});
        }

        if (widgets["cbHole2S"].checked) {
            holes.push({d: widgets["spHole2Sd2"].value, l: widgets["spHole2Sl2"].value, t: LINE_DOT, offset: sbOffset + 32, type: "rect"});
        }

        if (widgets["cbHole3K"].checked) {
            holes.push({d: widgets["spHole3Kd2"].value, l: widgets["spHole3Kl2"].value, t: LINE_DOT, offset: sbOffset + 64, type: "rect"});
        }
    }

    if (isBoardVertical) {
        addPerpendicularHolesToVerticalCut(document, op, 0, 0, sbWidth, sbHeight, sbThickness, holes);
    } else {
        addPerpendicularHolesToHorisontalCut(document, op, 0, 0, sbWidth, sbHeight, sbThickness, holes);
    }

    // Присадки проекций
    if (rbHolePerpendicular) {
        var perpendicularHoles = [];
    }


    di.applyOperation(op);

    // var insideBlock = widgets["createInsideBlock"].checked;
    // var blockName = widgets["blockName"].text;
    // var displayName = widgets["displayName"].text;
    // var displayNameSize = widgets["displayNameSize"].value;
};

ExFurnitureCutCreator.init = function(basePath) {
    var action = new RGuiAction(qsTr("Furniture Cut Helper"), RMainWindowQt.getMainWindow());
    action.setRequiresDocument(true);
    action.setScriptFile(basePath + "/ExFurnitureCutCreator.js");
    action.setGroupSortOrder(100000);
    action.setSortOrder(0);
    action.setWidgetNames(["ExamplesMenu"]);
};
