#idk bash ok, if one of these two works, im happy
killall node
pkill -HUP node

mkdir /home/runner/tmp

node update.js

rm -rf /home/runner/tmp

node index.js