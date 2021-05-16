'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class TransactionContract extends Contract{

    constructor(){
        super('Transaction')
    }

    async init(ctx){

    }

    async TransactionExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async createTransaction(ctx, id, application_id, donor_id, value, time){
        const exists = await this.TransactionExists(ctx, id);
        if (exists){
            throw new Error(`Transaction id ${id} already exist`)
        }
        const transaction = {
            application_id: application_id, 
            donor_id: donor_id,
            value: value,
            time: time
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(transaction)));
    }

    async queryTransaction(ctx, id){
        const exists = await this.TransactionExists(ctx, id);
        if (!exists){
            throw new Error(`Transaction id ${id} does not exist`);
        }
        const buffer = await ctx.stub.getState(id);
        return JSON.parse(buffer.toString());
    }

    async getHistory(ctx, id){
        const exists = await this.TransactionExists(ctx, id);
        if (!exists) {
            throw new Error(`Transaction id ${id} doesnt exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(id);
        let results = [];
        for await (const keyMod of promiseOfIterator) {
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

    async queryTransactionsByDonorId(ctx, id) {    
        let queryString = {};
        queryString.selector = {};
        queryString.selector.donor_id = {};
        queryString.selector.donor_id.$eq = id.toString();
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.stringify(queryResults);
    }

    async queryTransactionsByApplicationId(ctx, id) {    
        let queryString = {};
        queryString.selector = {};
        queryString.selector.application_id = {};
        queryString.selector.application_id.$eq = id.toString();
        let queryResults = await this.getQueryResultForQueryString(ctx, JSON.stringify(queryString));
        return JSON.stringify(queryResults);
    }
}

module.exports = TransactionContract