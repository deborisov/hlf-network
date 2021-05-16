
Intro to Kubernetes
===================
https://dzone.com/articles/10-basic-facts-about-kubernetes-that-you-didnt-kno

+---------------------------------------------+
PS: +  These are notest/observations
    +  Follow the videos for minikube install
+---------------------------------------------+


Locally launch minikub (Not Suggested)
======================================
install it 
https://medium.com/@nieldw/running-minikube-with-vm-driver-none-47de91eab84c

Changed the memory to 4GB & CPU=2
minikube start   <<< Gave error - required changing the permission >>>
sudo chown -R $USER $HOME/.kube $HOME/.minikube
minikube start  <<< Failed to update cluster: downloading binaries: copying kubelet: copy: error removing file /usr/
bin/kubelet: remove /usr/bin/kubelet: permission denied>>>

sudo minikube start

sudo /usr/bin/kubeadm init --config /var/lib/kubeadm.yaml  --ignore-preflight-errors=...,--data-minikube,FileAvailable--etc-kubernetes-manifests-kube-scheduler.yaml,FileAvailable--etc-kubernetes-manifests-kube-apiserver.yaml,FileAvailable--etc-kubernetes-manifests-kube-controller-manager.yaml,FileAvailable--etc-kubernetes-manifests-etcd.yaml,Port-10250,Swap


Build the Docker Images
=======================
docker build -t acloudfan/hyperledger-orderer:1.0 .


Install Kubectl
===============
sudo snap install kubectl --classic

Install minikube
================
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube

sudo install minikube /usr/local/bin

================================================================================================

Dashboard
=========
> minikube dashboard

Start | Stop | Status
=====================
minkube start
minikube stop
minikube status

Launching
=========
> kubectl apply -f .

Pod Status
===========
> kubectl get all

Log into a container
====================
* Make sure the container/pod is running using the "kubectl get all"
kubectl exec -it acme-orderer-0 sh
kubectl exec -it acme-peer-0 sh
kubectl exec -it budget-peer-0 sh

==================
1. Launch the Pods
==================
* Video shows the launch of pods one by one, here we are launching all at the same time
> cd minikube
> kubectl apply -f .

==================
2. Acme Peer Setup
==================
Log into the acme peer:
> kubectl exec -it acme-peer-0 sh

Setup the peer:
> ./submit-channel-create.sh
> ./join-channel.sh


Validate the peer:
> ./cc-test.sh install
> ./cc-test.sh instantiate
> ./cc-test.sh invoke  
> ./cc-test.sh query
> exit

====================
3. Budget Peer Setup
====================
Log into the budget peer:
kubectl exec -it budget-peer-0 sh

Setup the peer:
./submit-channel-create.sh
> ./fetch-channel-block.sh
> //./join-channel.sh
./anchor-update.sh

Validate the peer:
./cc-test.sh install
./cc-test.sh query      # This should show the same value for a on both peers