#!/bin/sh
#After running this script confirm that peer has joined
#by running peer channel list
if [[ $# -eq 1 ]];
then 
    path_to_block_file="../config/$1.block"
else 
    echo "1 param should be passed - channel name."
    exit
fi
peer channel join   -b $path_to_block_file -o $ORDERER_ADDRESS --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt 

