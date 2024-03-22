/*
KWin Script Swap Sides
(C) 2021 Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/

// swap windows on left and right sides
registerShortcut("Swap Window Sides: Left and Right",
    "Swap Window Sides: Left and Right",
    "Meta+Shift+PgDown",
    () => {
        console.debug("swapsides:", "left and right");

        // get area geometry
        var active = workspace.activeWindow;
        if (!active) return;
        var area = workspace.clientArea(KWin.MaximizeArea, active);

        // get left windows
        var left = workspace.clients().filter(win =>
            relevant(win, active) &&
            near(win.frameGeometry.left, area.left, area.width));

        // get right windows
        var right = workspace.clients().filter(win =>
            relevant(win, active) &&
            near(win.frameGeometry.right, area.right, area.width));

        // move left windows to right
        for (var i = 0; i < left.length; i++) {
            win = left[i];
            win.frameGeometry.x = (area.x + area.width) - win.width;
            win.minimized = false;
        }

        // move right windows to left
        for (var i = 0; i < right.length; i++) {
            win = right[i];
            win.frameGeometry.x = area.x;
            win.minimized = false;
        }
    });

// swap windows on top and bottom sides
registerShortcut("Swap Window Sides: Top and Bottom",
    "Swap Window Sides: Top and Bottom",
    "Meta+Shift+PgUp",
    () => {
        console.debug("swapsides:", "top and bottom");

        // get area geometry
        var active = workspace.activeWindow;
        if (!active) return;
        var area = workspace.clientArea(KWin.MaximizeArea, active);

        // get top windows
        var top = workspace.clients().filter(win =>
            relevant(win, active) &&
            near(win.frameGeometry.top, area.top, area.height));

        // get bottom windows
        var bottom = workspace.clients().filter(win =>
            relevant(win, active) &&
            near(win.frameGeometry.bottom, area.bottom, area.height));

        // move top windows to bottom
        for (var i = 0; i < top.length; i++) {
            win = top[i];
            win.frameGeometry.y = (area.y + area.height) - win.height;
            win.minimized = false;
        }

        // move bottom windows to top
        for (var i = 0; i < bottom.length; i++) {
            win = bottom[i];
            win.frameGeometry.y = area.y;
            win.minimized = false;
        }
    });


// helper functions

// window is considered near an area iff the difference of the coordinates is within tolerance
function near(actual, expected, tolerance) {
    return Math.abs(actual - expected) <= 0.02 * tolerance;
}

// window is relevant iff it is not identical, unminimized, on the same desktop and screen, and moveable and resizeable
function relevant(win, active) {
    return !win.minimized
        && (win.desktop == active.desktop
            || win.onAllDesktops || active.onAllDesktops)
        && win.screen == active.screen
        && win.moveable && win.resizeable;
}
