echo "Waiting for node processes to die..."
sleep 1

mkdir /home/runner/tmp

node update.js

rm -rf /home/runner/tmp

node index.js