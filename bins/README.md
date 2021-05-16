
# Delete all generated po | services | statefulset
kubectl delete -f .

# Delete the PVC explicitly as they do not get deleted by default
kubectl delete pvc --all

> ./submit-channel-create.sh
> ./join-channel.sh

export CC_NAME="nodecc"
export CC_PATH="/var/hyperledger/nodechaincode/java/agreements"
export CC_VERSION="1.0"
export CC_CHANNEL_ID="mainchannel"
export CC_LANGUAGE="java"
export INTERNAL_DEV_VERSION="1.0"
export CC2_PACKAGE_FOLDER="/var/hyperledger/packages"
export CC2_SEQUENCE=1
export CC2_INIT_REQUIRED="--init-required"
export PACKAGE_NAME="$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION.tar.gz"
export LABEL="$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION"
    mkdir -p /var/hyperledger/packages
    peer lifecycle chaincode package $CC2_PACKAGE_FOLDER/$PACKAGE_NAME -p $CC_PATH --label="$CC_NAME.$CC_VERSION-$INTERNAL_DEV_VERSION" -l $CC_LANGUAGE
    peer lifecycle chaincode install  $CC2_PACKAGE_FOLDER/$PACKAGE_NAME  
    abacaba-orderer-clusterip
    abacaba-orderer-clusterip:30750


     peer chaincode invoke  -C mainchannel -n nodecc -c '{"Args":["init","a","100","b","200"]}' --waitForEvent --isInit -o $ORDERER_ADDRESS 
     peer chaincode query -C mainchannel -n votechoice -c '{"Args":["createAsset","1","male","20"]}'
     peer chaincode query -C mainchannel -n votechoice -c '{"Args":["getAllAssets"]}'

       
     peer chaincode query -C mainchannel -n votechoice -c '{"Args":["queryVoteChoice","1"]}'
     peer chaincode invoke -C mainchannel -n voteentity -c '{"Args":["createVoteEntity","1","1","1", "1", "1", "1"]}'

    docker pull paramecium/fabric-app:latest
     docker run --rm -d --network host paramecium/fabric-app
     docker run -d --network host paramecium/fabric-app


     ./cc-test.sh install votechoice votechoice
     ./cc-test.sh instantiate votechoice votechoice
     ./cc-test.sh install voteentity voteentity
     ./cc-test.sh instantiate voteentity voteentity
     peer chaincode invoke -C charitychannel -n votechoice -c '{"Args":["createVoteChoice","1","1","1", "1", "comment"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode invoke -C mainchannel -n votechoice -c '{"Args":["createVoteChoice","2","1","1", "1", "comment"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C mainchannel -n votechoice -c '{"Args":["getHistory","1"]}'
       

     peer chaincode invoke -C mainchannel -n voteentity -c '{"Args":["createVoteEntity","1","1","1", "1", "1", "1", "1", "1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C mainchannel -n voteentity -c '{"Args":["queryVoteEntity","1"]}'
     peer chaincode query -C mainchannel -n voteentity -c '{"Args":["changeVoteEntityStatus","1", "open"]}'

     minikube service --url abacaba-peer-clusterip
     _utils


     peer chaincode invoke -C mainchannel -n voteentity -c '{"Args":["createVoteEntity","1","1","1", "1", "created", "1", "1", "1", "1"]}'
     peer chaincode invoke -C mainchannel -n votechoice -c '{"Args":["createVoteChoice","1","1","1", "1", "comment"]}'
     peer chaincode query -C charitychannel -n votechoice -c '{"Args":["getHistory","1"]}'


     docker build -t paramecium/fabric-app .
     docker push paramecium/fabric-app
     kubectl proxy --address='0.0.0.0' --disable-filter=true

     peer chaincode query -C charitychannel -n voteentity -c '{"Args":["queryVoteEntity","1"]}'

     peer chaincode invoke -C charitychannel -n beneficiary -c '{"Args":["createBeneficiary","1", "1", "1", "1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n beneficiary -c '{"Args":["queryBeneficiary","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n beneficiary -c '{"Args":["getHistory","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt

     peer chaincode invoke -C charitychannel -n foundation -c '{"Args":["createFoundation","1", "1", "1", "1", "1", "1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n foundation -c '{"Args":["queryFoundation","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n foundation -c '{"Args":["getHistory","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt

    peer chaincode invoke -C charitychannel -n transaction -c '{"Args":["createTransaction","1", "1", "1", "1", "1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n transaction -c '{"Args":["queryTransaction","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n transaction -c '{"Args":["queryTransactionsByApplicationId","12"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt


     peer chaincode invoke -C charitychannel -n application -c '{"Args":["createApplication","1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1", "1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n application -c '{"Args":["queryApplication","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt
     peer chaincode query -C charitychannel -n application -c '{"Args":["getHistory","1"]}' --tls --cafile /var/hyperledger/orderer.abacaba.com/tls/ca.crt