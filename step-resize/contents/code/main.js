/*
KWin Script Step Resize
(C) 2021 Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/


///////////////////////
// configuration
///////////////////////

config = {
    stepHor: readConfig("stepHorizontal", 50),
    stepVer: readConfig("stepVertical",   50),
    tolerance: readConfig("tolerance", 0)
};


///////////////////////
// initialization
///////////////////////

debugMode = true;
function debug(...args) {if (debugMode) {console.debug("stepresize:", ...args);}}
debug("initializing");
debug("settings:",
      "step horizontal:", config.stepHor,
      "step vertical:",   config.stepVer,
      "tolerance:",       config.tolerance);
console.debug("");


///////////////////////
// parameters
///////////////////////
Direction = ["Increase", "Decrease"].
    reduce((obj, p) => Object.assign(obj, { [p]: p }), {});
Dimension = ["Areal", "Horizontal", "Vertical"].
    reduce((obj, p) => Object.assign(obj, { [p]: p }), {});


///////////////////////
// register shortcuts
///////////////////////

registerShortcut("Step resize: grow size",
                 "Step Resize: Grow Size",
                 "Alt+O",
                 () => {resize(Direction.Increase, Dimension.Areal);});
registerShortcut("Step resize: shrink size",
                 "Step Resize: Shrink Size",
                 "Alt+M",
                 () => {resize(Direction.Decrease, Dimension.Areal);});
registerShortcut("Step resize: grow width",
                 "Step Resize: Grow Width",
                 "Alt+L",
                 () => {resize(Direction.Increase, Dimension.Horizontal);});
registerShortcut("Step resize: shrink width",
                 "Step Resize: Shrink Width",
                 "Alt+J",
                 () => {resize(Direction.Decrease, Dimension.Horizontal);});
registerShortcut("Step resize: grow height",
                 "Step Resize: Grow Height",
                 "Alt+I",
                 () => {resize(Direction.Increase, Dimension.Vertical);});
registerShortcut("Step resize: shrink height",
                 "Step Resize: Shrink Height",
                 "Alt+,",
                 () => {resize(Direction.Decrease, Dimension.Vertical);});


///////////////////////
// resize window
///////////////////////

function resize(direction, dimension) {
    client = workspace.activeClient;
    win = client.geometry;
    area = workspace.clientArea(KWin.MaximizeArea, client);
    if (!client.resizeable) return;
    debug(direction, dimension, client.caption, client.geometry);

    switch (dimension) {

        case Dimension.Areal:
            // grow or shrink horizontally and vertically
            resize(direction, Dimension.Horizontal);
            resize(direction, Dimension.Vertical);
            break;

        case Dimension.Horizontal: case Dimension.Vertical:

            // left/top/right/bottom positions of client/area
            xy = wh = step = null;
            switch (dimension) {
                case Dimension.Horizontal:
                    xy = "x";
                    wh = "width";
                    step = config.stepHor;
                    break;
                case Dimension.Vertical:
                    xy = "y";
                    wh = "height";
                    step = config.stepVer;
                    break;
            }

            // increase/decrease direction
            sign = null;
            switch (direction) {
                case Direction.Increase:
                    sign = 1;
                    break;
                case Direction.Decrease:
                    sign = -1;
                    break;
            }

            // resize the client (from the bottom right edge) and readjust the position (from the top left edge)
            client.clientStartUserMovedResized(client);
            if (tiledStart(win, area, xy, wh)) {
                // tiled left/top: resize on bottom/right edge, keep position
                debug("tiled start", dimension);
                win[wh] += sign * step;
            }
            else if (tiledMid(win, area, xy, wh)) {
                // full width/height or not tiled horizontally/vertically: increase/decrease one step on bottom/right edge, then move half the size of the step in the other direction to keep horizontal/vertical alignment
                debug("tiled mid", dimension);
                win[wh] += sign * step;
                win[xy] -= sign * Math.round(step/2);
            }
            else if (tiledEnd(win, area, xy, wh)) {
                // tiled right/bottom: resize on bottom right/edge, then move the same amount away towards left/top to keep within screen bounds
                debug("tiled end", dimension);
                win[wh] += sign * step;
                win[xy] -= sign * step;
            }
            client.clientFinishUserMovedResized(client);
    }
}

///////////////////////
// determine tiledness
///////////////////////

// tiled left/top
function tiledStart(win, area, xy, wh) {
    return near(win[xy], area[xy]);
}

// tiled right/bottom
function tiledEnd(win, area, xy, wh) {
    return near(win[xy] + win[wh], area[xy] + area[wh]);
}

// tiled either both or neither left/top and right/bottom
function tiledMid(win, area, xy, wh) {
    return ((tiledStart(win, area, xy, wh)
          && tiledEnd(win, area, xy, wh))
         || (!tiledStart(win, area, xy, wh)
          && !tiledEnd(win, area, xy, wh)));
}

function near(a, b) {
    return Math.abs(a - b) <= config.tolerance;
}
