import { Block } from './block.ts';
import { Mine } from './mine.ts';
import validate from '../../utils/validate.ts';

export class Blockchain{
    blocks : [Block];

    constructor(){
        this.blocks = [Block.genesis];
    }

    addBlock(data : any){
        const previousBlock = this.blocks[this.blocks.length -1];
        const block = Mine.mine(previousBlock, data);
        this.blocks.push(block);

        return block;
    }
    /*Valida que la blockchain mas grande sea la valida*/ 
    replace(newBlocks : [Block]){
        if(newBlocks.length < this.blocks.length) throw Error("Invalid chain length");
        try{
            validate(newBlocks)
        } catch(e){
            throw Error("Invalid chain received");
        }
        this.blocks = newBlocks;

        return this.blocks;
    }
}