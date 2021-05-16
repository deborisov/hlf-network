#!/bin/sh
#peer channel create -c airlinechannel -f ../config/airlinechannel.tx --outputBlock ../config/airlinechannel.block -o $ORDERER_ADDRESS
if [[ $# -eq 1 ]];
then 
    path_to_block_file="../config/$1.block"
    path_to_tx_file="../config/$1.tx"
else 
    echo "1 param should be passed - channel name."
    exit
fi
peer channel create -c $1 -f $path_to_tx_file --outputBlock $path_to_block_file -o $ORDERER_ADDRESS --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
