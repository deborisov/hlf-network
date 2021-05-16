'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class FoundationContract extends Contract{

    constructor(){
        super('Foundation')
    }

    async init(ctx){

    }

    async FoundationExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async createFoundation(ctx, id, foundation_name, description, is_active, registration_time, last_update_time){
        const exists = await this.FoundationExists(ctx, id);
        if (exists){
            throw new Error(`Foundation id ${id} already exist`)
        }
        const foundation = {
            foundation_name: foundation_name, 
            description: description,
            is_active: is_active,
            registration_time: registration_time,
            last_update_time: last_update_time
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(foundation)));
    }

    async queryFoundation(ctx, id){
        const exists = await this.FoundationExists(ctx, id);
        if (!exists){
            throw new Error(`Foundation id ${id} does not exist`);
        }
        const buffer = await ctx.stub.getState(id);
        return JSON.parse(buffer.toString());
    }

    async getHistory(ctx, id){
        const exists = await this.FoundationExists(ctx, id);
        if (!exists) {
            throw new Error(`Foundation id ${id} doesnt exist`);
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

module.exports = FoundationContract