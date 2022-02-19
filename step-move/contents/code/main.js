/*
KWin Script Step Move
(C) 2021 Natalie Clarius <natalie_clarius@yahoo.de>
GNU General Public License v3.0
*/


///////////////////////
// configuration
///////////////////////

config = {
    stepHor: readConfig("stepHorizontal", 10),
    stepVer: readConfig("stepVertical",   10)
};


///////////////////////
// initialization
///////////////////////

debugMode = true;
function debug(...args) {if (debugMode) {console.debug("stepmove:", ...args);}}
debug("initializing");
debug("settings:",
      "step horizontal:", config.stepHor,
      "step vertical:",   config.stepVer);
console.debug("");


///////////////////////
// parameters
///////////////////////

Direction = ["Center", "Left", "Right", "Up", "Down"].
    reduce((obj, p) => Object.assign(obj, { [p]: p }), {});


///////////////////////
// register shortcuts
///////////////////////

registerShortcut("Step move: center",
                 "Step Move: Center",
                 "Alt+D",
                 () => {move(Direction.Center);});
registerShortcut("Step move: left",
                 "Step Move: Left",
                 "Alt+S",
                 () => {move(Direction.Left);});
registerShortcut("Step move: right",
                 "Step Move: Right",
                 "Alt+F",
                 () => {move(Direction.Right);});
registerShortcut("Step move: up",
                 "Step Move: Up",
                 "Alt+E",
                 () => {move(Direction.Up);});
registerShortcut("Step move: down",
                 "Step Move: Down",
                 "Alt+C",
                 () => {move(Direction.Down);});


///////////////////////
// move window
///////////////////////

function move(direction) {
    client = workspace.activeClient;
    win = client.geometry;
    area = workspace.clientArea(KWin.MaximizeArea, client);
    if (!client.moveable || win == area) return;
    debug(direction, client.caption, client.geometry);
    client.clientStartUserMovedResized(client);
    switch (direction) {

        case Direction.Center:
            win.x =
                area.x + Math.round(area.width/2) - Math.round(win.width/2);
            win.y =
                area.y + Math.round(area.height/2) - Math.round(win.height/2);
            break;

        case Direction.Left:
            win.x -= config.stepHor;
            break;

        case Direction.Right:
            win.x += config.stepHor;
            break;

        case Direction.Up:
            win.y -= config.stepVer;
            break;

        case Direction.Down:
            win.y += config.stepVer;
            break;

    }
    client.clientFinishUserMovedResized(client);

}
