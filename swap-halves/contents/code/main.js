/*
KWin Script Swap Halves
(C) 2021 Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/

// swap left and right halves for the active window
registerShortcut("Swap halves: left and right", 
                 "Swap halves: left and right", 
                 "Meta+Ctrl+Right", 
                 () => {
    console.debug("swaphalves:", "left and right");

    // get area geometry
    var active = workspace.activeClient;
    if (!active) return;
    var grid = getGrid(active);

    // get left windows
    var left = workspace.clientList().filter(win =>
        relevant(win, active) &&
        near(win.x, grid.left, grid.halfWidth) && 
        near(win.width, grid.halfWidth, grid.halfWidth));

    // get right windows
    var right = workspace.clientList().filter(win =>
        relevant(win, active) &&
        near(win.x, grid.midHor, grid.halfWidth) && 
        near(win.width, grid.halfWidth, grid.halfWidth));

    // move left windows to right
    for (var i = 0; i < left.length; i++) {
        win = left[i];
        win.geometry.x = grid.midHor;
        win.minimized = false;
    }

    // move right windows to left
    for (var i = 0; i < right.length; i++) {
        win = right[i];
        win.geometry.x = grid.left;
        win.minimized = false;
    }
});

// swap top and bottom halves for the active window
registerShortcut("Swap halves: top and bottom", 
                 "Swap halves: top and bottom", 
                 "Meta+Ctrl+Down", 
                 () => {
    console.debug("swaphalves:", "top and bottom");

    // get area geometry
    var active = workspace.activeClient;
    if (!active) return;
    var grid = getGrid(active);

    // get top windows
    var top = workspace.clientList().filter(win =>
        relevant(win, active) &&
        near(win.y, grid.top, grid.halfHeight) && 
        near(win.height, grid.halfHeight, grid.halfHeight));
    
    // get bottom windows
    var bottom = workspace.clientList().filter(win =>
        relevant(win, active) &&
        near(win.y, grid.midVer, grid.halfHeight) && 
        near(win.height, grid.halfHeight, grid.halfHeight));

    // move top windows to bottom
    for (var i = 0; i < top.length; i++) {
        win = top[i];
        win.geometry.y = grid.midVer;
        win.minimized = false;
    }

    // move bottom windows to top
    for (var i = 0; i < bottom.length; i++) {
        win = bottom[i];
        win.geometry.y = grid.top;
        win.minimized = false;
    }
});


// helper functions

// get the anchor points in the client area
function getGrid(win) {
    var area = workspace.clientArea(KWin.MaximizeArea, win);
    return {
        left: area.x,
        midHor: Math.round(area.x + area.width/2),
        halfWidth: Math.round(area.width/2),
        top: area.y,
        midVer: Math.round(area.y + area.height/2),
        halfHeight: Math.round(area.height/2)
    };
}

// window is considered near an area iff the difference of the coordinates is within tolerance
function near(actual, expected, tolerance) {
    return Math.abs(actual - expected) <= 0.05 * tolerance;
}

// window is relevant iff it is not identical, unminimized, on the same desktop and screen, and moveable and resizeable
function relevant(win, active) {
    return !win.minimized
        && (win.desktop == active.desktop || win.onAllDesktops)
        && win.screen == active.screen
        && win.moveable && win.resizeable;
}
