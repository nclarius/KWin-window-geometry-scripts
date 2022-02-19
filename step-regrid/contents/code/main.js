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
    stepVer: readConfig("stepVertical",   50),
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

registerShortcut("Step regrid: shift center",
                 "Step Regrid: Shift Center",
                 "Alt+K",
                 () => {shift(Direction.Center);});
registerShortcut("Step regrid: shift rightwards",
                 "Step Regrid: Shift Rightwards",
                 "Alt+L",
                 () => {shift(Direction.Right);});
registerShortcut("Step regrid: shift leftwards",
                 "Step Regrid: Shift Leftwards",
                 "Alt+J",
                 () => {shift(Direction.Left);});
registerShortcut("Step regrid: shift downwards",
                 "Step Regrid: Shift Downwards",
                 "Alt+,",
                  () => {shift(Direction.Down);});
registerShortcut("Step regrid: shift upwards",
                 "Step Regrid: Shift Upwards",
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

            // shift horizontally
            halfWidth = Math.round(area.width/2);

            // tiled left and larger than half width
            wins.filter(win => (tiledLeft(win, area) && win.width + config.tolerance > halfWidth)).forEach(win => {
                win.geometry.width = halfWidth;
            });

            // tiled right and larger than half width
            wins.filter(win => (tiledRight(win, area) && win.width + config.tolerance > halfWidth)).forEach(win => {
                win.geometry.width = halfWidth;
                win.geometry.x = area.x + halfWidth;
            });

            // tiled left and smaller than half width
            wins.filter(win => (tiledLeft(win, area) && win.width + config.tolerance < halfWidth)).forEach(win => {
                win.geometry.width = halfWidth;
            });

            // tiled right and smaller than half width
            wins.filter(win => (tiledRight(win, area) && win.width + config.tolerance < halfWidth)).forEach(win => {
                win.geometry.width = halfWidth;
                win.geometry.x = area.x + halfWidth;
            });

            // tiled horizontal mid
            wins.filter(win => (tiledMidHor(win, area))).forEach(win => {
                win.geometry.x = area.x + halfWidth - Math.round(win.width/2);
            });

            // shift vertically
            halfHeight = Math.round(area.height/2);

            // tiled top and larger than half height
            wins.filter(win => (tiledTop(win, area) && win.height + config.tolerance > halfHeight)).forEach(win => {
                win.geometry.height = halfHeight;
            });

            // tiled bottom and larger than half height
            wins.filter(win => (tiledBottom(win, area) && win.height + config.tolerance > halfHeight)).forEach(win => {
                win.geometry.height = halfHeight;
                win.geometry.y = area.y + halfHeight;
            });

            // tiled top and smaller than half height
            wins.filter(win => (tiledTop(win, area) && win.height + config.tolerance < halfHeight)).forEach(win => {
                win.geometry.height = halfHeight;
            });

            // tiled bottom and smaller than half height
            wins.filter(win => (tiledBottom(win, area) && win.height + config.tolerance < halfHeight)).forEach(win => {
                win.geometry.height = halfHeight;
                win.geometry.y = area.y + halfHeight;
            });

            // tiled vertical mid
            wins.filter(win => tiledMidHor(win, area)).forEach(win => {
                win.geometry.y = area.y + halfHeight - Math.round(win.height/2);
            });

            break;

        case Direction.Right:

            // tiled right: decrease from left
            wins.filter(win => tiledRight(win, area)).forEach(win => {
                win.geometry.width -= config.stepHor;
                win.geometry.x += config.stepHor;
            });

            // tiled mid: move towards right
            wins.filter(win => tiledMidHor(win, area)).forEach(win => {
                win.geometry.x += config.stepHor;
            });

            // tiled left: increase to right
            wins.filter(win => tiledLeft(win, area)).forEach(win => {
                win.geometry.width += config.stepHor;
            });

            break;

        case Direction.Left:

            // tiled left: decrease from right
            wins.filter(win => tiledLeft(win, area)).forEach(win => {
                win.geometry.width -= config.stepHor;
            });

            // tiled mid: move towards left
            wins.filter(win => tiledMidHor(win, area)).forEach(win => {
                win.geometry.x -= config.stepHor;
            });

            // tiled right: increase to left
            wins.filter(win => tiledRight(win, area)).forEach(win => {
                win.geometry.width += config.stepHor;
                win.geometry.x -= config.stepHor;
            });

            break;


        case Direction.Down:

            // tiled bottom: decrease from top
            wins.filter(win => tiledBottom(win, area)).forEach(win => {
                win.geometry.height -= config.stepVer;
                win.geometry.y += config.stepVer;
            });

            // tiled mid: move towards bottom
            wins.filter(win => tiledMidVer(win, area)).forEach(win => {
                win.geometry.y += config.stepVer;
            });

            // tiled top: increase to bottom
            wins.filter(win => tiledTop(win, area)).forEach(win => {
                win.geometry.height += config.stepVer;
            });

            break;

        case Direction.Up:

            // tiled top: decrease from bottom
            wins.filter(win => tiledTop(win, area)).forEach(win => {
                win.geometry.height -= config.stepVer;
            });

            // tiled mid: move towards top
            wins.filter(win => tiledMidVer(win, area)).forEach(win => {
                win.geometry.y -= config.stepVer;
            });

            // tiled bottom: increase to top
            wins.filter(win => tiledBottom(win, area)).forEach(win => {
                win.geometry.height += config.stepVer;
                win.geometry.y -= config.stepVer;
            });

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


function tiledWidth(win, area) {
    return near(win.width, area.width);
}

function tiledLeft(win, area) {
    return near(win.x, area.x)
        && !tiledWidth(win, area);
}

function tiledRight(win, area) {
    return near(win.x + win.width, area.x + area.width)
        && !tiledWidth(win, area);
}

function tiledMidHor(win, area) {
    return (!tiledLeft(win, area) && !tiledRight(win, area)
        && !tiledWidth(win, area));
}

function tiledHeight(win, area) {
    return near(win.height, area.height);
}

function tiledTop(win, area) {
    return near(win.y, area.y)
        && !tiledHeight(win, area);
}

function tiledBottom(win, area) {
    return near(win.y + win.height, area.y + area.height)
        && !tiledHeight(win, area);
}

function tiledMidVer(win, area) {
    return (!tiledTop(win, area) && !tiledBottom(win, area)
        && !tiledHeight(win, area));
}

function near(a, b) {
    return Math.abs(a - b) <= config.tolerance;
}
