#!/bin/sh
if [[ $# -eq 2 ]];
then 
    channel_name=$1
    update_file="../config/$2-peer-update.tx"
else 
    echo "2 params should be passed. 1st - channel name. 2nd - peer update file name (main, org2, org3)."
    exit
fi
peer channel update -f $update_file -c $1 -o $ORDERER_ADDRESS --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt

