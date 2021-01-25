import { assert, assertEquals, assertNotEquals, assertThrows } from "https://deno.land/std@0.84.0/testing/asserts.ts";
import { Block } from '../src/blocks/block.ts';
import { Mine } from '../src/blocks/mine.ts';
import { Blockchain } from '../src/blocks/blockchain.ts';
import  vaidate from '../utils/validate.ts';
import validate from "../utils/validate.ts";

var timestamp : Date = new Date(2020, 2, 5);
var previousBlock : Block = Block.genesis;
var hash : string = "h4sh";
var data : string = "d4t4";
var blockchain : Blockchain = new Blockchain();
var blockchainB : Blockchain = new Blockchain();

Deno.test("Test block", () => {
    const block = new Block(timestamp , previousBlock.hash, hash, data);
    
    assertEquals(timestamp, block.timestamp);
    assertEquals(previousBlock.hash, block.previousHash);
    assertEquals(hash, block.hash);
    assertEquals(data, block.data);
});

Deno.test("Mine block", () => {
    const block = Mine.mine(previousBlock, data);

    assertEquals(block.hash.length, 64);
    assertEquals(block.previousHash, previousBlock.hash);
    assertEquals(data, data);
});

Deno.test("Hash function", () => {
    hash = Mine.hash(timestamp, previousBlock.hash, data);

    assertEquals(hash, "4db529d8c3652f28ef91ef7c6e94275002721a28c1ff5834d4743d4de7c6288c");
})

Deno.test("Test blockString", () => {
    const block = Mine.mine(previousBlock, data);

    assertEquals('string', typeof(block.blockString()));
})

Deno.test("Test blockchain class", () => {
    const [genesisBlock] = blockchain.blocks;

    assertEquals(genesisBlock, Block.genesis);
    assertEquals(blockchain.blocks.length, 1);

});

Deno.test("Adds blocks", () => {
    const data = "data";
    blockchain.addBlock(data);

    const lastBlock = blockchain.blocks[blockchain.blocks.length -1].data;
    //console.log(blockchain.blocks);
    assertEquals(lastBlock, data);
    assertEquals(blockchain.blocks.length, 2);
});

var blockchain : Blockchain = new Blockchain();

Deno.test("Validate blocks", () => {
    blockchain.addBlock("data1");
    blockchain.addBlock("data2");

    assertEquals(vaidate(blockchain.blocks), true);
});

Deno.test("Invalidate block", () => {
    var originalData = blockchain.blocks[0].data;
    blockchain.blocks[0].data = "XXXXXX";
    
    assertThrows(() => validate(blockchain.blocks), Error, "Invalid Genesis block");
    blockchain.blocks[0].data = originalData;
});

Deno.test("Invalidates block with wrong previous hash", () => {
    blockchain.addBlock("block-corrupt");
    console.log(`Block length : ${blockchain.blocks.length}`);
    var originalData =     blockchain.blocks[blockchain.blocks.length - 1].previousHash;
    blockchain.blocks[blockchain.blocks.length - 1].previousHash = "hack"
    assertThrows(() => {
        validate(blockchain.blocks)
    }, Error, "Invalid previous hash");
    blockchain.blocks[blockchain.blocks.length - 1].previousHash = originalData;
});

Deno.test("Invalidates block with invalid hash", () => {
    blockchain.addBlock("hash-corrupt");
    var originalData =     blockchain.blocks[blockchain.blocks.length -1].hash;
    blockchain.blocks[blockchain.blocks.length -1].hash = "invalidhash";
    assertThrows(() => {
        validate(blockchain.blocks)
    }, Error, "Invalid hash");

    blockchain.blocks[blockchain.blocks.length -1].hash = originalData;
})

var orginialBlockchain = blockchain;
Deno.test("Replace blockchain", () => {
    blockchain = new Blockchain();
    blockchain.addBlock("block-test");
    blockchainB.addBlock("block-replace");
    blockchain.replace(blockchainB.blocks);

    assertEquals(blockchain.blocks, blockchainB.blocks);
});

Deno.test("Replace invalid chain length", () => {
    blockchain = orginialBlockchain;
    assertThrows(() => {
        blockchain.replace(blockchainB.blocks);
    }, Error, "Invalid chain length");
});

Deno.test("Replace invalid chain in general", () => {
    blockchainB = blockchain;
    var invalidBlocks = blockchainB;
    invalidBlocks.blocks[0].hash = "XXXXXX";

    assertThrows(() => {
        blockchain.replace(invalidBlocks.blocks);
    }, Error, "Invalid chain received");

});