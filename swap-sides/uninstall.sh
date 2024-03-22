#!/bin/bash
kpackagetool6 --type=KWin/Script --remove .
qdbus org.kde.KWin /KWin reconfigure
