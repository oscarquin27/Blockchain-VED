import { Blockchain } from "../src/blocks/blockchain.ts";
import { Block } from '../src/blocks/block.ts';
import { Mine } from '../src/blocks/mine.ts';

export  default (blockchain : [Block]) => {

    const[genesisBlock, ...blocks] = blockchain;

    if(JSON.stringify(genesisBlock) !== JSON.stringify(Block.genesis)) throw Error("Invalid Genesis block");

    for(let i = 0; i < blocks.length; i++){
        const {
            previousHash, timestamp, hash, data
        } = blocks[i];
        const previousBlock = blockchain[i];
        console.log(`Previous: ${previousHash} comp Previous : ${previousBlock.hash}`);
        if(previousHash !== previousBlock.hash) throw Error("Invalid previous hash");
        if(hash !== Mine.hash(timestamp, previousHash, data)) throw Error("Invalid hash");
    }

    return true;
};