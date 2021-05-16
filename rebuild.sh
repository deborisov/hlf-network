#!/bin/sh
#minikube start
cd minikube
kubectl delete -f .
cd ..
sleep 15
docker rmi $(docker images 'paramecium/k8s-hlf-abacaba-peer') 
docker rmi $(docker images 'paramecium/k8s-hlf-abacaba-orderer') 
docker rmi $(docker images 'paramecium/k8s-hlf-abacaba-orderer2')
docker rmi $(docker images 'paramecium/k8s-hlf-abacaba-orderer3')  
docker rmi $(docker images 'paramecium/k8s-hlf-org2-peer1') 
# docker rmi $(docker images 'paramecium/k8s-hlf-org2-peer2') 
docker rmi $(docker images 'paramecium/k8s-hlf-org3-peer1') 
# docker rmi $(docker images 'paramecium/k8s-hlf-org3-peer2') 
docker build -t paramecium/k8s-hlf-abacaba-orderer:2.0 . -f images/orderer/Dockerfile
docker build -t paramecium/k8s-hlf-abacaba-orderer2:2.0 . -f images/orderer/Dockerfile2
docker build -t paramecium/k8s-hlf-abacaba-orderer3:2.0 . -f images/orderer/Dockerfile3
docker build -t paramecium/k8s-hlf-abacaba-peer:2.0 . -f images/voting-peer/Dockerfile
docker build -t paramecium/k8s-hlf-org2-peer1:2.0 . -f images/org2-peers/Dockerfile1
# docker build -t paramecium/k8s-hlf-org2-peer2:2.0 . -f images/org2-peers/Dockerfile2
docker build -t paramecium/k8s-hlf-org3-peer1:2.0 . -f images/org3-peers/Dockerfile1
# docker build -t paramecium/k8s-hlf-org3-peer2:2.0 . -f images/org3-peers/Dockerfile2
# docker login -u paramecium
docker push paramecium/k8s-hlf-abacaba-orderer:2.0
docker push paramecium/k8s-hlf-abacaba-orderer2:2.0
docker push paramecium/k8s-hlf-abacaba-orderer3:2.0
docker push paramecium/k8s-hlf-abacaba-peer:2.0
# docker push  paramecium/k8s-hlf-org3-peer2:2.0
docker push  paramecium/k8s-hlf-org3-peer1:2.0
# docker push  paramecium/k8s-hlf-org2-peer2:2.0
docker push  paramecium/k8s-hlf-org2-peer1:2.0
cd minikube
sleep 2
kubectl delete pvc --all
kubectl apply -f .

# kubectl exec -it abacaba-peer-0 sh


# helm install \
#    my-release \
#   --set couchdbConfig.couchdb.uuid=decafbaddecafbaddecafbaddecafbad \
#   couchdb/couchdb