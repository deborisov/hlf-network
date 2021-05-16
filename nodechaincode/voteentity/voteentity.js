'use strict';

const { Contract } = require('fabric-contract-api');

class VoteEntityContract extends Contract{

    constructor(){
        super('VoteEntity')
    }

    async init(ctx){

    }

    
    async voteExists(ctx, id) {
        const buffer = await ctx.stub.getState(id);
        return (!!buffer && buffer.length > 0);
    }

    async getHistory(ctx, id){
        const exists = await this.voteExists(ctx, id);
        if (!exists) {
            throw new Error(`Voting id ${id} doesnt exist`);
        }
        const promiseOfIterator = ctx.stub.getHistoryForKey(id);
        let results = [];
        for await (const keyMod of promiseOfIterator) {
            let resp = {
                timestamp: keyMod.timestamp,
                txid: keyMod.txId
            }
            if (keyMod.is_delete) {
                resp.data = 'KEY DELETED';
            } else {
                resp.data = keyMod.value.toString('utf8');
            }
            results.push(resp);
        }
        return results;
    }
    
    async createVoteEntity(ctx, id, voting_name, description, initiator_id, creation_time,
        start_time, expiry_date, comments_enabled){
        const exists = await this.voteExists(ctx, id);
        if (exists) {
            throw new Error(`Voting id ${id} already exist`);
        }
        const voteEntity = {
            VotingName: voting_name,
            Description: description, 
            InitiatorId: initiator_id,
            VotingStatus: "created",
            CreationTime: creation_time,
            StartTime: start_time,
            ExpiryTime: expiry_date,
            CommentsEnabled: comments_enabled,
            ApprovalTime: "null"
        }
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(voteEntity)))
    }

    async queryVoteEntity(ctx, id){
        const exists = await this.voteExists(ctx, id);
        if (!exists) {
            throw new Error(`Voting id ${id} doesnt exist`);
        }
        const buffer = await ctx.stub.getState(id);
        return JSON.parse(buffer.toString());
    }

    async changeStatus(ctx, id, newStatus, approval_time){
        const exists = await this.voteExists(ctx, id);
        if (!exists) {
            throw new Error(`Voting id ${id} doesnt exist`);
        }
        const buffer = await ctx.stub.getState(id);
        const voteEntity = JSON.parse(buffer.toString())
        newStatus = newStatus.toLowerCase()
        if (voteEntity.VotingStatus == "created" && (newStatus == "approved" || newStatus == "declined")){
            voteEntity.VotingStatus = newStatus;
            voteEntity.ApprovalTime = approval_time;
        }
        else if (newStatus == "cancelled" && (voteEntity.VotingStatus == "created" || voteEntity.VotingStatus == "approved")){
              const dateNow = new Date();
              const expiryDate = voteEntity.ExpiryTime;
              if (dateNow > new Date(expiryDate)){
                throw new Error(`Such status can't be set`);
              }
              voteEntity.VotingStatus = newStatus;
        }
        else{
            throw new Error(`Such status can't be set`);
        }
        console.log(JSON.stringify(voteEntity))
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(voteEntity)))
    }

    async updateVoteEntity(ctx, id, voting_name, description,
        start_time, expiry_date, comments_enabled){
        const exists = await this.voteExists(ctx, id);
        if (!exists) {
            throw new Error(`Voting id ${id} doesnt exist`);
        }
        const buffer = await ctx.stub.getState(id);
        const voteEntity = JSON.parse(buffer.toString());
        voteEntity.VotingName = voting_name;
        voteEntity.Description = description;
        voteEntity.StartTime = start_time;
        voteEntity.ExpiryTime = expiry_date;
        voteEntity.CommentsEnabled = comments_enabled;
        await ctx.stub.putState(id, Buffer.from(JSON.stringify(voteEntity)));
    }

}

module.exports = VoteEntityContract