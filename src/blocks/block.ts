import { Mine } from './mine.ts';

export class Block {
    public timestamp : Date;
    public previousHash : string;
    public hash : string;
    public data : string;

    constructor(timestamp : Date, previousHash : string, hash : string, data : string){
        this.timestamp = timestamp;
        this.previousHash = previousHash;
        this.hash = hash;
        this.data = data;
    }

    //#region Builds genesis block
    static get genesis(){

        return new this(new Date(2020, 2, 5), "", "h4sh", "genesisData");
    }
    //#endregion
    
    //#region Converts blocks to string
    blockString(){
        const {
            timestamp, previousHash, hash, data
        } = this;
        
        return `Block specification:
        timestamp.......: ${this.timestamp}
        previousHash....: ${this.previousHash}
        hash............: ${this.hash}
        data............: ${this.data}`
    }
    //#endregion

}