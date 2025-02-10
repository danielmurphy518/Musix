#!/bin/zsh
#EVENTUALLY I WILL NEED 2 MODIFY THIS SO IT WORKS ON MY LINUX MACHINE WITH FSH TERMINAL AND THIS SHIT IDK
# Define the directories and scripts you want to use
DIR1="/Users/MurphyD1/Documents/MUSIX/Musix/"
DIR2="/Users/MurphyD1/Documents/MUSIX/Musix/client"
DIR3="/Users/MurphyD1/Documents/MUSIX/Musix/server"
SCRIPT1="npm start"
SCRIPT2="node server.js"

# Open the first terminal tab, change directory, and run a script
osascript -e 'tell application "Terminal"
    activate
    do script "cd '$DIR1'; echo \"Running in Tab 1\"; zsh"
end tell'

# Open the second terminal tab, change directory, and run a script
osascript -e 'tell application "Terminal"
    activate
    tell application "System Events" to keystroke "t" using command down
    do script "cd '$DIR2'; echo \"Running in Tab 2\"; '$SCRIPT1'; zsh" in front window
end tell'

# Open the third terminal tab, change directory, and run a script
osascript -e 'tell application "Terminal"
    activate
    tell application "System Events" to keystroke "t" using command down
    do script "cd '$DIR3'; echo \"Running in Tab 3\"; '$SCRIPT2'; zsh" in front window
end tell'
