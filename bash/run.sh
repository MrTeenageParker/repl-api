#!/bin/bash
# Made by DaddyNerdy/Jacob Parker
# If output breaks, refresh the window after pressing the stop button
# v0.0.5

trap_react () {
    echo "Shutting down..."
    echo 'Check folder debug/ for debug information relating to node (node folder)'
    
    sudo killall nodejs
    
    exit
}

start_servers () {
    cd ..
    nodejs server.js > debug/node/stdout_node.txt 2> debug/node/stderr_node.txt &
    mongod 
}

trap trap_react SIGINT SIGTERM

start_servers

echo 'Please press enter/stop button to stop servers'

read input

trap_react

exit;