'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class VoteChoiceContract extends Contract{

    constructor(){
        super('VoteChoice')
    }

    async init(ctx){

    }

    async voteChoiceExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async pairVoteUserExists(ctx, userId, VotingId){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.UserId = userId.toString();
        queryString.selector.VotingId = VotingId.toString();
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return queryResults.length > 0;
    }

    async createVoteChoice(ctx, id, voteEntityId, userId, choice, comment){
        const exists = await this.voteChoiceExists(ctx, id);
        if (exists){
            throw new Error(`Vote id ${id} already exist`)
        }
        let response = await ctx.stub.invokeChaincode("voteentity", ["voteExists", voteEntityId], "mainchannel");
        let voteEntityExists = Buffer.from(response.payload).toString();
        if (voteEntityExists != 'true'){
            throw new Error(`Voting id ${voteEntityId} doesn't exist`)
        }
        const pairExists = await this.pairVoteUserExists(ctx, userId, voteEntityId);
        if (pairExists){
            throw new Error(`User already voted`)
        }
        let resp = await ctx.stub.invokeChaincode("voteentity", ["queryVoteEntity", voteEntityId], "mainchannel");
        let voteEntity = JSON.parse(resp.payload);
        if (voteEntity.VotingStatus != "approved"){
            throw new Error(`Vote id ${voteEntityId} isn't approved ` + voteEntity)
        }
        const nowDate = new Date();
        //throw new Error(`Vote id ${voteEntityId} isn't approved ` + voteEntity.StartTime + " " + voteEntity.ExpiryTime + " " + nowDate);
        if (nowDate < new Date(voteEntity.StartTime)){
            throw new Error(`Vote id ${voteEntityId} hasn't started yet`)
        }
        if (nowDate > new Date(voteEntity.ExpiryTime)){
            throw new Error(`Vote id ${voteEntityId} has already finished`)
        }
        const voteChoice = {
            VotingId: voteEntityId, 
            UserId: userId,
            Choice: choice,
            Comment: comment
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(voteChoice)));
    }

    async queryVoteChoice(ctx, id){
        const exists = await this.voteChoiceExists(ctx, id);
        if (!exists){
            throw new Error(`Vote id ${id} does not exist`);
        }
        const buffer = await ctx.stub.getState(id);
        return JSON.parse(buffer.toString());
    }

    // async getBlockByTXID(ctx, txId){
    //     let response = await ctx.stub.invokeChaincode("qscc", ["GetBlockByTxID", "mainchannel", txId], "");
    //     return Buffer.from(response.body).toString();
    // }

    async getHistory(ctx, id){
        const exists = await this.voteChoiceExists(ctx, id);
        if (!exists) {
            throw new Error(`Vote id ${id} doesnt exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(id);
        let results = [];
        for await (const keyMod of promiseOfIterator) {
            //let block = await this.getBlockByTXID(ctx, keyMod.txId);
            let resp = {
                timestamp: keyMod.timestamp,
                txid: keyMod.txId,
            }
            if (keyMod.is_delete) {
                resp.data = 'KEY DELETED';
            } else {
                resp.data = JSON.parse(keyMod.value.toString('utf8'));
            }
            results.push(resp);
        }
        return JSON.stringify(results);
    }

    async getAllResults(promiseOfIterator) {
        let allResults = [];
        for await (const res of promiseOfIterator) {
            let resp = {
                key: res.key,
                value: res.value.toString('utf8')
            }
            allResults.push(resp);
        }
        return allResults;
    }

    async getQueryResultForQueryString(ctx, queryString) {
        let resultsIterator = ctx.stub.getQueryResult(queryString);    
        let results = await this.getAllResults(resultsIterator);
        return results;
    }

    async queryVoteByUserId(ctx, id) {    
        let queryString = {};
        queryString.selector = {};
        queryString.selector.UserId = {};
        queryString.selector.UserId.$eq = id.toString();
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.stringify(queryResults);
    }

    async queryVoteByVotingId(ctx, id){
        let queryString = {};
        queryString.selector = {};
        queryString.selector.VotingId = {};
        queryString.selector.VotingId.$eq = id.toString();
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.stringify(queryResults);
    }

    async queryVoteByVotingUserPair(ctx, UserId, VotingId){
        const pairExists = await this.pairVoteUserExists(ctx, UserId, VotingId  );
        if (!pairExists){
            throw new Error(`Not found`)
        }
        let queryString = {};
        queryString.selector = {};
        queryString.selector.UserId = UserId.toString();
        queryString.selector.VotingId = VotingId.toString();
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.stringify(queryResults); 
    }
}

module.exports = VoteChoiceContract