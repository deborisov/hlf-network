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
const VoteEntityContract = require('./voteentity');

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

describe('VoteContract', () => {

    let contract;
    let ctx;
    let data;
    let changeData;

    beforeEach(() => {
        contract = new VoteEntityContract();
        ctx = new TestContext();
        data = '{"description":"1","initiatorId":"1","votingStatus":"1","startDate":"1","expiryDate":"1","commentsEnabled":"1"}';
        ctx.stub.getState.withArgs('1').resolves(Buffer.from(data));
        ctx.stub.getState.withArgs('2').resolves(Buffer.from(data));
        changeData = '{"description":"1","initiatorId":"1","votingStatus":"created","startDate":"1","expiryDate":"1","commentsEnabled":"1"}';
        ctx.stub.getState.withArgs('5').resolves(Buffer.from(changeData));
    });
    describe('#voteChoiceExists', () => {

        it('should return true for a vote choice', async () => {
            await contract.voteExists(ctx, '1').should.eventually.be.true;
        });

        it('should return false for a vote choice that does not exist', async () => {
            await contract.voteExists(ctx, '3').should.eventually.be.false;
        });

    });

    describe('#voteCreateAndQuery', () => {

        it('should create a vote choice chaincode', async () => {
            await contract.createVoteEntity(ctx, '3', '1', '1', '1', '1', '1', '1');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('3', Buffer.from(data));
        });

        it('should throw an error for a vote choice chaincode that already exists', async () => {
            await contract.createVoteEntity(ctx, '1', '1', '1', '1', '1', '1', '1').should.be.rejectedWith("Vote id 1 already exist");
        });

        it('should throw an error for a vote choice chaincode that does not exist', async () => {
            await contract.queryVoteEntity(ctx, '4').should.be.rejectedWith("Vote id 4 doesnt exist");
        });

        it('should return vote entity under id 1', async () => {
            await contract.queryVoteEntity(ctx, '1').should.eventually.deep.equal({description:"1",initiatorId:"1",votingStatus:"1",startDate:"1",expiryDate:"1",commentsEnabled:"1"});
        });
    });

    describe('#voteChoiceChangeState', () => {
        it('should change status', async () => {
            await contract.changeVoteEntityStatus(ctx, '5', 'open');
            ctx.stub.putState.should.have.been.calledOnceWithExactly('5', Buffer.from('{"description":"1","initiatorId":"1","votingStatus":"open","startDate":"1","expiryDate":"1","commentsEnabled":"1"}'));
            await contract.changeVoteEntityStatus(ctx, '5', 'created').should.be.rejectedWith("Such status can't be set");;
        });
    });
});
