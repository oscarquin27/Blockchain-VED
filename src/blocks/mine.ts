import { Block } from "./block.ts";

import { createHash } from "https://deno.land/std@0.84.0/hash/mod.ts";

export class Mine extends Block {
    
    static mine(previousBlock : Block, data : string){
        const timestamp = new Date();
        const previousHash = previousBlock.hash
        const hash = Mine.hash(timestamp, previousHash, data);
        return new this(timestamp, previousHash, hash, data);
    }

    static hash(timestamp : Date, previousHash : string, data : string){
        let constHash : string = createHash("sha256").update(timestamp + previousHash + data).toString();
        return constHash;
    }

}