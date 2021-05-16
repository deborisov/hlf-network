'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class ReportContract extends Contract{

    constructor(){
        super('Report')
    }

    async init(ctx){

    }

    async ReportExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async createReport(ctx, id, application_id, donor_id, value, time){
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
}

module.exports = TransactionContract