#!/bin/bash
name=$(grep -oP '(?<=X-KDE-PluginInfo-Name=).*' ./metadata.desktop)
kpackagetool6 --type=KWin/Script --install . || kpackagetool6 --type=KWin/Script --upgrade .
kwriteconfig6 --file kwinrc --group Plugins --key "$name"Enabled true
qdbus org.kde.KWin /KWin reconfigure
