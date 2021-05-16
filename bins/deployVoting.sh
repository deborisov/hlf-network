./submit-channel-create.sh mainchannel
./join-channel.sh mainchannel
./cc-test.sh install votechoice votechoice mainchannel
./cc-test.sh instantiate votechoice votechoice mainchannel
./cc-test.sh install voteentity voteentity mainchannel
./cc-test.sh instantiate voteentity voteentity mainchannel