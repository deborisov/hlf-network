#!/bin/bash
export PATH=${PWD}/../fabric-samples/bin:$PATH
#1. Clean up earlier setup
echo    "====>Cleanup the earlier runs"
./clean-all.sh

#2. Generate the crypto
echo    "====>Generating the crypto"
cd config
cryptogen generate --config=crypto-config.yaml

#3. Generate the genesis
echo    "====>Generating the genesis block"
export FABRIC_CFG_PATH=$PWD
configtxgen -outputBlock  ./orderer/maingenesis.block -channelID ordererchannel  -profile MainOrdererGenesis

#4. Generate the channel create tx
echo    "====>Generating the channel create tx"
configtxgen -outputCreateChannelTx  mainchannel.tx -channelID mainchannel  -profile MainChannel
configtxgen -outputCreateChannelTx  charitychannel.tx -channelID charitychannel  -profile CharityChannel


PEER_FABRIC_CFG_PATH=$FABRIC_CFG_PATH

#5. Generate the anchor update org1
ORG_NAME=Org1
configtxgen -outputAnchorPeersUpdate ./main-peer-update.tx   -asOrg $ORG_NAME -channelID mainchannel  -profile MainChannel

#6. Generate the anchor peer update org2
ORG_NAME=Org2
configtxgen -outputAnchorPeersUpdate ./org2-peer-update.tx   -asOrg $ORG_NAME -channelID charitychannel  -profile CharityChannel

#7. Generate the anchor peer update org3
ORG_NAME=Org3
configtxgen -outputAnchorPeersUpdate ./org3-peer-update.tx   -asOrg $ORG_NAME -channelID charitychannel  -profile CharityChannel

echo "Done."
