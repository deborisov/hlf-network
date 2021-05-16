'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class BeneficiaryContract extends Contract{

    constructor(){
        super('Beneficiary')
    }

    async init(ctx){

    }

    async BeneficiaryExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async createBeneficiary(ctx, id, crm_manager_id, additional_info, last_update_time){
        const exists = await this.BeneficiaryExists(ctx, id);
        if (exists){
            throw new Error(`Beneficiary id ${id} already exist`)
        }
        const beneficiary = {
            crm_manager_id: crm_manager_id, 
            additional_info: additional_info,
            last_update_time: last_update_time
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(beneficiary)));
    }

    async queryBeneficiary(ctx, id){
        const exists = await this.BeneficiaryExists(ctx, id);
        if (!exists){
            throw new Error(`Beneficiary id ${id} does not exist`);
        }
        const buffer = await ctx.stub.getState(id);
        return JSON.parse(buffer.toString());
    }

    async getHistory(ctx, id){
        const exists = await this.BeneficiaryExists(ctx, id);
        if (!exists) {
            throw new Error(`Beneficiary id ${id} doesnt exist`);
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

module.exports = BeneficiaryContract