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

    log("cbEdgingLeft: " + cbEdgingLeft);
    log("cbEdgingTop: " + cbEdgingTop);
    log("cbEdgingRight: " + cbEdgingRight);
    log("cbEdgingBottom: " + cbEdgingBottom);
    log("RLineweight.Weight070" + RLineweight.Weight070);
    log("RLineweight.WeightByLayer" + RLineweight.WeightByLayer);

    var op = new RAddObjectsOperation();

    var lineLeft = new RLineEntity(document, new RLineData(new RVector(0, 0), new RVector(0, sbHeight)));
    lineLeft.setLineweight(cbEdgingLeft ? RLineweight.Weight070 : RLineweight.WeightByLayer);
    var lineTop = new RLineEntity(document, new RLineData(new RVector(0, sbHeight), new RVector(sbWidth, sbHeight)));
    lineTop.setLineweight(cbEdgingTop ? RLineweight.Weight070 : RLineweight.WeightByLayer);
    var lineRight = new RLineEntity(document, new RLineData(new RVector(sbWidth, sbHeight), new RVector(sbWidth, 0)));
    lineRight.setLineweight(cbEdgingRight ? RLineweight.Weight070 : RLineweight.WeightByLayer);
    var lineBottom = new RLineEntity(document, new RLineData(new RVector(sbWidth, 0), new RVector(0, 0)));
    lineBottom.setLineweight(cbEdgingBottom ? RLineweight.Weight070 : RLineweight.WeightByLayer);

    op.addObject(lineLeft, false);
    op.addObject(lineTop, false);
    op.addObject(lineRight, false);
    op.addObject(lineBottom, false);
    var cbGenerateProjectionVer = widgets["cbGenerateProjectionVer"].checked;
    var cbGenerateProjectionHor = widgets["cbGenerateProjectionHor"].checked;


    if (cbGenerateProjectionVer) {
        var padding = 50 + sbWidth;
        var lineLeft = new RLineEntity(document, new RLineData(new RVector(0 + padding, 0), new RVector(0 + padding, sbHeight)));
        var lineTop = new RLineEntity(document, new RLineData(new RVector(0 + padding, sbHeight), new RVector(sbThickness + padding, sbHeight)));
        var lineRight = new RLineEntity(document, new RLineData(new RVector(sbThickness + padding, sbHeight), new RVector(sbThickness + padding, 0)));
        var lineBottom = new RLineEntity(document, new RLineData(new RVector(sbThickness + padding, 0), new RVector(0 + padding, 0)));
        op.addObject(lineLeft, false);
    op.addObject(lineTop, false);
    op.addObject(lineRight, false);
    op.addObject(lineBottom, false);
    }

    if (cbGenerateProjectionHor) {
        var padding = 50;
        var lineLeft = new RLineEntity(document, new RLineData(new RVector(0, 0 - padding - sbThickness), new RVector(0, 0 - padding)));
        var lineTop = new RLineEntity(document, new RLineData(new RVector(0, 0 - padding), new RVector(sbWidth, 0 - padding)));
        var lineRight = new RLineEntity(document, new RLineData(new RVector(sbWidth, 0 - padding), new RVector(sbWidth, 0 - padding - sbThickness)));
        var lineBottom = new RLineEntity(document, new RLineData(new RVector(0, 0 - padding - sbThickness), new RVector(sbWidth, 0 - padding - sbThickness)));
        op.addObject(lineLeft, false);
    op.addObject(lineTop, false);
    op.addObject(lineRight, false);
    op.addObject(lineBottom, false);
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
