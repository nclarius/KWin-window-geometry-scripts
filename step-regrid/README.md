# Step Re-Grid

Extension for KDE’s window manager adding keyboard shortcuts to stepwise reshape the window grid, that is, resize the active or all windows from the center axes depending of their position:

- shift rightwards:
  - windows at the left screen edge: grow to right
  - windows at the right screen edge: shrink from left
  - windows in the middle: move right
  - windows full width: do nothing
- analogous for leftwards/upwards/downwards.

Whether to resize only the active window or all present windows, as well as the step sizes and the keyboard shortcuts are configurable.

![screenshot](.img/screenshot.gif)

<img src=".img/config.png" alt="config" height="350"/>

<img src=".img/shortcuts.png" alt="shortcuts" height="475"/>


## Installation

### Dependencies

`kwin` (tested with v5.24 on X11).

### Installation via graphical interface

1. Install the script via Discover or *System Settings* > *Window Management* > *KWin Scripts* > *Get New Scripts …* > search for *Step Re-Grid* > *Install*.
2. Enable the script by activating its checkbox, and apply the settings.

### Installation via command line

```bash
git clone https://github.com/nclarius/KWin-window-geometry-scripts.git
cd KWin-window-geometry-scripts/step-regrid
./install.sh
```



## Configuration

To set the shortcuts to trigger the actions, go to *Settings* > *Shortcuts* > search for *Step Re-Grid* … > set your preferred shortcuts.

To configure the step sizes, go to *System Settings* > *Window Management* > *KWin Scripts* > configuration button in the *Step Re-Grid* entry.

You may need to uncheck the checkbox for the script, apply the settings, recheck, and reapply in order for the changes to take effect.

In Plasma versions < 5.24, a bug in the KWin scripting system [[1]](https://bugs.kde.org/show_bug.cgi?id=411430) [[2]](https://bugs.kde.org/show_bug.cgi?id=444378) may cause the configuration file not to be found. To fix this, please execute the following commands in a terminal:

```bash
sed -i 's/ConfigModule/Library/g' ~/.local/share/kwin/scripts/stepregrid/metadata.desktop
mkdir -p ~/.local/share/kservices5/
ln -sf ~/.local/share/kwin/scripts/stepregrid/metadata.desktop ~/.local/share/kservices5/stepregrid.desktop
qdbus org.kde.KWin /KWin reconfigure
```



## Usage

The default shortcuts are:

```
              upwards
               Alt+I

leftwards     center      rightwards
  Alt+J        Alt+K        Alt+L
  
             downwards
               Alt+,
```



## Issues

If windows are being moved rather than resized, increase the tolerance in order to liberalize tiling detection.



## Small Print

© 2021 Natalie Clarius \<natalie_clarius@yahoo.de\>

This work is licensed under the GNU General Public License v3.0.  
This program comes with absolutely no warranty.  
This is free software, and you are welcome to redistribute and/or modify it under certain conditions.  

If you would like to thank me, you can always make me happy with a review or a cup of coffee:  
<a href="https://www.pling.com/p/1636998"><img src="https://raw.githubusercontent.com/nclarius/Plasma-window-decorations/main/.img/kdestore.png" height="25"/></a>
<a href="https://www.paypal.com/donate/?hosted_button_id=7LUUJD83BWRM4"><img src="https://www.paypalobjects.com/en_US/DK/i/btn/btn_donateCC_LG.gif" height="25"/></a>&nbsp;&nbsp;<a href="https://www.buymeacoffee.com/nclarius"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" height="25"/></a>
