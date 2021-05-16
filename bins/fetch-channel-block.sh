#!/bin/sh
if [[ $# -eq 1 ]];
then 
    path_to_block_file="../config/$1.block"
else 
    echo "1 param should be passed - channel name."
    exit
fi
peer channel fetch 0 $path_to_block_file -o $ORDERER_ADDRESS -c $1 --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt