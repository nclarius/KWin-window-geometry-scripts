/*
KWin Script Step Move
(C) 2021 Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/


///////////////////////
// configuration
///////////////////////

config = {
    stepHor: readConfig("stepHor", 10),
    stepVer: readConfig("stepVer", 10)
};


///////////////////////
// initialization
///////////////////////

debugMode = true;
function debug(...args) {if (debugMode) {console.debug("stepmove:", ...args);}}
debug("initializing");
debug("settings:", "step horizontal:", config.stepHor, "step vertical:", config.stepVer);
Direction = ["center", "left", "right", "up", "down"].reduce((obj, p) => Object.assign(obj, { [p]: p }), {});
console.debug("");


///////////////////////
// register shortcuts
///////////////////////

// dir = Object.fromEntries(["center", "left", "right", "up", "down"].map(p => [p, p]) );
registerShortcut("Step move: center", "Step Move: Center", "Alt+D", function() {move(Direction.center);});
registerShortcut("Step move: left"  , "Step Move: Left"  , "Alt+S", function() {move(Direction.left)  ;});
registerShortcut("Step move: right" , "Step Move: Right" , "Alt+F", function() {move(Direction.right) ;});
registerShortcut("Step move: up"    , "Step Move: Up"    , "Alt+E", function() {move(Direction.up)    ;});
registerShortcut("Step move: down"  , "Step Move: Down"  , "Alt+C", function() {move(Direction.down)  ;});


///////////////////////
// move window
///////////////////////

function move(direction) {
    client = workspace.activeClient;
    win = client.geometry;
    area = workspace.clientArea(KWin.MaximizeArea, client);
    if (!client.moveable || win == area) return;
    debug(direction, client.caption, win);
    client.clientStartUserMovedResized(client);
    switch (direction) {

        case Direction.center:
            win.x = area.x + Math.round(area.width/2) - Math.round(win.width/2);
            win.y = area.y + Math.round(area.height/2) - Math.round(win.height/2);
            break;

        case Direction.left:
            win.x -= config.stepHor;
            break;

        case Direction.right:
            win.x += config.stepHor;
            break;

        case Direction.up:
            win.y -= config.stepVer;
            break;

        case Direction.down:
            win.y += config.stepVer;
            break;

    }
    client.clientFinishUserMovedResized(client);

}
