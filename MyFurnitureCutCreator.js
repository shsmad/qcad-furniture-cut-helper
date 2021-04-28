function log(message) {
    EAction.handleUserMessage("log: " + message);
}


function createRectangle(width, height) {
    var polylineData = new RPolylineData();
    polylineData.appendVertex(new RVector(0, 0));
    polylineData.appendVertex(new RVector(0, height));
    polylineData.appendVertex(new RVector(width, height));
    polylineData.appendVertex(new RVector(width, 0));


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
    // this.sbIndent = 37;

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
