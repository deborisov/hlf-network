# Updated to Fabric 2.x
#1. Docker file for setting up the Orderer
# FROM hyperledger/fabric-orderer:1.4.2
FROM hyperledger/fabric-orderer:2.3

LABEL  maintainer="Dmitry Borisov <dmitron.borisov@gmail.com>"

#2. Create the folder for configurations
RUN mkdir -p /var/hyperledger/config

#3. Copy the crypto for orderer
COPY ./config/crypto-config/ordererOrganizations/abacaba.com/orderers/abacaba-orderer-clusterip.abacaba.com /var/hyperledger/orderer.abacaba.com

#4. Copy the genesis file
COPY ./config/orderer/maingenesis.block  /var/hyperledger/config/maingenesis.block

#5. Copy the orderer YAML
COPY ./config/orderer/orderer.yaml /var/hyperledger/config/orderer.yaml

#6. Launch the Orderer
CMD orderer

