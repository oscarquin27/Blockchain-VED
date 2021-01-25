import { Response, Request } from 'https://deno.land/x/oak/mod.ts';
import { Blockchain } from '../src/blocks/blockchain.ts';
//import { BlockModel } from '../models/block.model.ts';

const blockchain = new Blockchain();

export const getBlocks = ({response} : {response : Response}) => {
    response.body = blockchain.blocks;
};

export const mineBlock = ({request, response} : {request: Request, response : Response}) => {
    //const blockRequest : BlockModel = request.body;
    const block = blockchain.addBlock(request.body);

    response.body = {
        "Block #" : blockchain.blocks.length,
        "Data" : block
    }
}