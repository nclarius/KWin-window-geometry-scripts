/*
KWin Script Step Re-Grid
(C) 2021 Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/


///////////////////////
// configuration
///////////////////////

config = {
    stepHor: readConfig("stepHorizontal", 50),
    stepVer: readConfig("stepVertical", 50),
    resizeOthers:    readConfig("resizeOthers",    true),
    resizeMinimized: readConfig("resizeMinimized", false),
    tolerance: readConfig("tolerance", 0)
};


///////////////////////
// initialization
///////////////////////

debugMode = true;
function debug(...args) {if (debugMode) {console.debug("stepregrid:", ...args);}}
debug("initializing");
debug("step sizes:",
      "horizontal:", config.stepHor,
      "vertical:",   config.stepVer);
debug("filters:",
      "resize others:",    config.resizeOthers,
      "resize minimized:", config.resizeMinimized,
      "tolerance:",        config.tolerance);
console.debug("");


///////////////////////
// parameters
///////////////////////
Direction = ["Center", "Right", "Left", "Down", "Up"].
    reduce((obj, p) => Object.assign(obj, { [p]: p }), {});
Dimension = ["Horizontal", "Vertical"].
    reduce((obj, p) => Object.assign(obj, { [p]: p }), {});


///////////////////////
// register shortcuts
///////////////////////

registerShortcut("Step regrid: shift center"    ,
                 "Step Regrid: Shift Center"    ,
                 "Alt+K",
                 () => {shift(Direction.Center);});
registerShortcut("Step regrid: shift rightwards",
                 "Step Regrid: Shift Rightwards",
                 "Alt+L",
                 () => {shift(Direction.Right);});
registerShortcut("Step regrid: shift leftwards" ,
                 "Step Regrid: Shift Leftwards" ,
                 "Alt+J",
                 () => {shift(Direction.Left);});
registerShortcut("Step regrid: shift downwards" ,
                 "Step Regrid: Shift Downwards" ,
                 "Alt+,",
                  () => {shift(Direction.Down);});
registerShortcut("Step regrid: shift upwards"   ,
                 "Step Regrid: Shift Upwards"   ,
                 "Alt+I",
                 () => {shift(Direction.Up);});


///////////////////////
// regrid windows
///////////////////////

function shift(direction) {
    active = workspace.activeClient;
    area = workspace.clientArea(KWin.MaximizeArea, active);
    wins = getClients(area);
    debug(direction);

    switch (direction) {
        // in all functions, decrease large windows before increasing small windows to ensure compatibility with overlap prevention script

        case Direction.Center:
            half = ["width", "height"].reduce((obj, wh) =>
                Object.assign(obj, { [wh]: Math.round(area[wh]/2) }), {});
            shiftCenter(Dimension.Horizontal);
            shiftCenter(Dimension.Vertical);

            function shiftCenter(dimension) {
                xy = wh = null;
                switch (dimension) {
                    case Dimension.Horizontal:
                        xy = "x";
                        wh = "width";
                        break;
                    case Dimension.Vertical:
                        xy = "y";
                        wh = "height";
                        break;
                }

                // tiled left/top and larger than half width/height
                wins.filter(win => (
                    tiledStart(win, area, xy, wh)
                 && tiledLarge(win, area, xy, wh))).
                forEach(win => {
                    win.geometry[wh] = half[wh];
                });

                // tiled right/bottom and larger than half width/height
                wins.filter(win => (
                    tiledEnd(win, area, xy, wh)
                 && tiledLarge(win, area, xy, wh))).
                forEach(win => {
                    win.geometry[wh] = half[wh];
                    win.geometry[xy] = area[xy] + half[wh];
                });

                // tiled Left/top and smaller than half width/height
                wins.filter(win => (
                    tiledStart(win, area, xy, wh)
                 && tiledSmall(win, area, xy, wh))).
                forEach(win => {
                    win.geometry[wh] = half[wh];
                });

                // tiled right/bottom and smaller than half width/height
                wins.filter(win => (
                    tiledEnd(win, area, xy, wh)
                 && tiledSmall(win, area, xy, wh))).
                forEach(win => {
                    win.geometry[wh] = half[wh];
                    win.geometry[xy] = area[xy] + half[wh];
                });

                // tiled horizontal/vertical mid or exactly half width/height
                wins.filter(win => (
                    tiledMid(win, area, xy, wh))).
                forEach(win => {
                    win.geometry[xy] =
                        area[xy] + half[wh] - Math.round(win[wh]/2);
                });

                // tiled full width/height or exactly half width/height: do nothing
            }

        default: //righ/left/down/up
            // geometry parameter to adjust for (horizontal/vertical)
            xy = wh = step = null;
            switch (direction) {
                case Direction.Right: case Direction.Left:
                    xy = "x";
                    wh = "width";
                    step = config.stepHor;
                    break;
                case Direction.Down: case Direction.Up:
                    xy = "y";
                    wh = "height";
                    step = config.stepVer;
                    break;
            }
            sign = null;
            switch (direction) {
                case Direction.Right: case Direction.Down:
                    sign = 1;
                    shiftEnd();
                    shiftMid();
                    shiftStart();
                    break;
                case Direction.Left: case Direction.Up:
                    sign = -1;
                    shiftStart();
                    shiftMid();
                    shiftEnd();
                    break;
            }

            // tiled left/top: increase/decrease from right/bottom
            function shiftStart() {
                wins.filter(win =>
                    tiledStart(win, area, xy, wh)).
                forEach(win => {
                    win.geometry[wh] += sign * step;
                });
            }

            // tiled mid: move towards/from right/bottom
            function shiftMid() {
                wins.filter(win =>
                    tiledMid(win, area, xy, wh)).
                forEach(win => {
                    win.geometry[xy] += sign * step;
                });
            }

            // tiled right/bottom: decrease/increase from left/top
            function shiftEnd() {
                wins.filter(win =>
                    tiledEnd(win, area, xy, wh)).
                forEach(win => {
                    debug(win.caption);
                    win.geometry[xy] += sign * step;
                    win.geometry[wh] -= sign * step;
                });
            }

            break;
    }
}


///////////////////////
// filter relevant windows
///////////////////////

function getClients(area) {
    return workspace.clientList().filter(client =>
           (client == workspace.activeClient || config.resizeOthers)
        && client.normalWindow && client.moveable && client.resizeable
        && (client.desktop == workspace.currentDesktop || client.allDesktops)
        && client.screen == workspace.activeClient.screen
        && (!client.minimized || config.includeMinimized)
        && !client.fullScreen);
}


///////////////////////
// determine tiledness
///////////////////////

// tiled full width/height
function tiledFull(win, area, xy, wh) {
    return near(win[wh], area[wh]);
}

// tiled left/top
function tiledStart(win, area, xy, wh) {
    return near(win[xy], area[xy])
        && !tiledFull(win, area, xy, wh);
}

// tiled right/bottom
function tiledEnd(win, area, xy, wh) {
    return near(win[xy] + win[wh], area[xy] + area[wh])
        && !tiledFull(win, area, xy, wh);
}

// tiled mid horizontal/vertical
function tiledMid(win, area, xy, wh) {
    return !tiledStart(win, area, xy, wh)
        && !tiledEnd(win, area, xy, wh)
        && !tiledFull(win, area, xy, wh);
}

// width/height relative to half width/height
function tiledHalf(win, area, xy, wh) {
    return Math.abs(win[wh] - Math.round(area[wh]/2)) <= config.tolerance;
}

function tiledSmall(win, area, xy, wh) {
    return win[wh] + config.tolerance < Math.round(area[wh]/2)
        && !tiledFull(win, area, xy, wh);
}

function tiledLarge(win, area, xy, wh) {
    return win[wh] - config.tolerance > Math.round(area[wh]/2)
        && !tiledFull(win, area, xy, wh);
}

function near(a, b) {
    return Math.abs(a - b) <= config.tolerance;
}
