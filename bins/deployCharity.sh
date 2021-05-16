./submit-channel-create.sh charitychannel
./join-channel.sh charitychannel
./cc-test.sh install application application charitychannel
./cc-test.sh instantiate application application charitychannel
./cc-test.sh install beneficiary beneficiary charitychannel
./cc-test.sh instantiate beneficiary beneficiary charitychannel
./cc-test.sh install foundation foundation charitychannel
./cc-test.sh instantiate foundation foundation charitychannel
./cc-test.sh install transaction transaction charitychannel
./cc-test.sh instantiate transaction transaction charitychannel