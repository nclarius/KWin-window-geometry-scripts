# Step Move

Extension for KDE’s window manager adding keyboard shortcuts to stepwise move (left/right/top/bottom/center) windows.

The step sizes and the keyboard shortcuts are configurable.

![screenshot](.img/screenshot.gif)

<img src=".img/config.png" alt="config" height="175"/>

<img src=".img/shortcuts.png" alt="shortcuts" height="475"/>


## Installation

### Dependencies

`kwin` (tested with v5.24 on X11).

### Installation via graphical interface

1. Install the script via Discover or *System Settings* > *Window Management* > *KWin Scripts* > *Get New Scripts …* > search for *Step Move* > *Install*.
2. Enable the script by activating its checkbox, and apply the settings.

### Installation via command line

```bash
git clone https://github.com/nclarius/KWin-window-geometry-scripts.git
cd KWin-window-geometry-scripts/step-move
./install.sh
```



## Configuration

To set the shortcuts to trigger the actions, go to *Settings* > *Shortcuts* > search for *Step Move* … > set your preferred shortcuts.

To configure the step sizes, go to *System Settings* > *Window Management* > *KWin Scripts* > configuration button in the *Step Move* entry.

You may need to uncheck the checkbox for the script, apply the settings, recheck, and reapply in order for the changes to take effect.

In Plasma versions < 5.24, a bug in the KWin scripting system [[1]](https://bugs.kde.org/show_bug.cgi?id=411430) [[2]](https://bugs.kde.org/show_bug.cgi?id=444378) may cause the configuration file not to be found. To fix this, please execute the following commands in a terminal:

```bash
sed -i 's/ConfigModule/Library/g' ~/.local/share/kwin/scripts/stepmove/metadata.desktop
mkdir -p ~/.local/share/kservices5/
ln -sf ~/.local/share/kwin/scripts/stepmove/metadata.desktop ~/.local/share/kservices5/stepmove.desktop
qdbus org.kde.KWin /KWin reconfigure
```



## Usage

The default shortcuts are:

```
           top
          Alt+E
                
 left     center     right
Alt+S     Alt+D      Alt+F
    
          bottom
          Alt+C
```



## Small Print

© 2021 Natalie Clarius \<natalie_clarius@yahoo.de\>

This work is licensed under the GNU General Public License v3.0.  
This program comes with absolutely no warranty.  
This is free software, and you are welcome to redistribute and/or modify it under certain conditions. 

If you would like to thank me, you can always make me happy with a review or a cup of coffee:  
<a href="https://store.kde.org/p/1632259"><img src="https://raw.githubusercontent.com/nclarius/Plasma-window-decorations/main/.img/kdestore.png" height="25"/></a>
<a href="https://www.paypal.com/donate/?hosted_button_id=7LUUJD83BWRM4"><img src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif" height="25"/></a>&nbsp;&nbsp;<a href="https://www.buymeacoffee.com/nclarius"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="25"/></a>

