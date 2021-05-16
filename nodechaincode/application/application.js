'use strict';

const { Contract } = require('fabric-contract-api');
const util = require('util');

class ApplicationContract extends Contract{

    constructor(){
        super('Application')
    }

    async init(ctx){

    }

    async ApplicationExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async createApplication(ctx, id, description, initiator_id, application_status, additional_info, creation_time, 
        approval_time, crm_manager_id, foundation_id, fund_manager_id, voting_result, voting_end_time, 
        gathering_end_expected, gathering_start_real, gathering_end_real, expect_to_gather, last_update_time){
        const exists = await this.ApplicationExists(ctx, id);
        if (exists){
            throw new Error(`Application id ${id} already exist`)
        }
        const application = {
            description: description, 
            initiator_id: initiator_id,
            application_status: application_status,
            additional_info: additional_info, 
            creation_time: creation_time,
            approval_time: approval_time, 
            crm_manager_id: crm_manager_id,
            foundation_id: foundation_id,
            fund_manager_id: fund_manager_id,
            voting_result: voting_result,
            voting_end_time: voting_end_time,
            gathering_end_expected: gathering_end_expected,
            gathering_start_real: gathering_start_real,
            gathering_end_real: gathering_end_real, 
            expect_to_gather: expect_to_gather,
            last_update_time: last_update_time
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(application)));
    }

    async queryApplication(ctx, id){
        const exists = await this.ApplicationExists(ctx, id);
        if (!exists){
            throw new Error(`Application id ${id} does not exist`);
        }
        const buffer = await ctx.stub.getState(id);
        return JSON.parse(buffer.toString());
    }

    async getHistory(ctx, id){
        const exists = await this.ApplicationExists(ctx, id);
        if (!exists) {
            throw new Error(`Application id ${id} doesnt exist`);
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

    async updateApplication(ctx, id, description, initiator_id, application_status, additional_info, 
        approval_time, foundation_id, fund_manager_id, voting_result, voting_end_time, 
        gathering_end_expected, gathering_start_real, gathering_end_real, expect_to_gather, last_update_time){
        const exists = await this.ApplicationExists(ctx, id);
        if (!exists) {
            throw new Error(`Application id ${id} doesnt exist`);
        }
        const buffer = await ctx.stub.getState(id);
        const application = JSON.parse(buffer.toString());
        application.description = description;
        application.initiator_id = initiator_id;
        application.application_status = application_status;
        application.additional_info = additional_info;
        application.approval_time = approval_time;
        application.foundation_id = foundation_id;
        application.fund_manager_id = fund_manager_id;
        application.voting_result = voting_result;
        application.voting_end_time = voting_end_time;
        application.gathering_end_expected = gathering_end_expected;
        application.gathering_start_real = gathering_start_real;
        application.gathering_end_real = gathering_end_real;
        application.expect_to_gather = expect_to_gather;
        application.last_update_time = last_update_time;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(application)));
    }
}

module.exports = ApplicationContract