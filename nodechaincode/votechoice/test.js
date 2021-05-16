'use strict';
const winston = require('winston');
const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');

chai.should();
chai.use(chaiAsPromised);
chai.use(sinonChai);
const { ChaincodeStub, ClientIdentity } = require('fabric-shim');
const VoteChoiceContract = require('./votechoice');

class TestContext {

    constructor() {
        this.stub = sinon.createStubInstance(ChaincodeStub);
        this.clientIdentity = sinon.createStubInstance(ClientIdentity);
        this.logger = {
            getLogger: sinon.stub().returns(sinon.createStubInstance(winston.createLogger().constructor)),
            setLevel: sinon.stub(),
        };
    }

}

describe('VoteChoiceContract', () => {

    let contract;
    let ctx;

    beforeEach(() => {
        contract = new VoteChoiceContract();
        ctx = new TestContext();
        ctx.stub.getState.withArgs('1').resolves(Buffer.from('{"voteEntityId":"1","userId":"1","choice":"1","comment":"1"}'));
        ctx.stub.getState.withArgs('2').resolves(Buffer.from('{"voteEntityId":"1","userId":"1","choice":"1","comment":"1"}'));
    });
    describe('#voteChoiceExists', () => {

        it('should return true for a vote choice', async () => {
            await contract.voteChoiceExists(ctx, '1').should.eventually.be.true;
        });

        it('should return false for a vote choice that does not exist', async () => {
            await contract.voteChoiceExists(ctx, '3').should.eventually.be.false;
        });

    });

    describe('#voteChoiceChaincodeExists', () => {

        it('should create a vote choice chaincode', async () => {
            await contract.createVoteChoice(ctx, '3', '1', '1', '1', '1');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('3', Buffer.from('{"voteEntityId":"1","userId":"1","choice":"1","comment":"1"}'));
        });

        it('should throw an error for a vote choice chaincode that already exists', async () => {
            await contract.createVoteChoice(ctx, '1', '1', '1', '1', '1').should.be.rejectedWith("Vote id 1 already exist");
        });

        it('should throw an error for a vote choice chaincode that does not exist', async () => {
            await contract.queryVoteChoice(ctx, '4').should.be.rejectedWith("Vote id 4 does not exist");
        });

        it('should return vote entity under id 1', async () => {
            await contract.queryVoteChoice(ctx, '1').should.eventually.deep.equal({voteEntityId:"1",userId:"1",choice:"1",comment:"1"});
        });
    });

    describe('#getVoteByUserId', () => {

        it('should return votes with userID 1', async () => {
            await contract.queryVoteByUserId(ctx, '1').should.eventually.deep.equal({voteEntityId:"1",userId:"1",choice:"1",comment:"1"});
        });
    });
});

