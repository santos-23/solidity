const { expect } = require("chai");
const { ethers } = require("hardhat");


describe("NFT Transfer:",function(){
    let token,owner,assist,recipient;

    beforeEach(async function(){
        [owner,assist,recipient] = await ethers.getSigners();
        const Token = await ethers.getContractFactory("NFT_Transfer");
        token = await Token.deploy("https://ipfs.io/ipfs/QmcRtp8XFhxykCRyesP9hw4A1F2avuY7oXuBP1P3zh5Evs/");
    })

    it("should mint the NFT with tokenID",async function(){
        await token.mint(owner,1);
        expect(await token.ownerOf(1)).equal(owner.address);
    })

    it("should set the base url while deploy the contract",async function(){
        await token.mint(owner,1);
        expect(await token.tokenURI(1)).equal("https://ipfs.io/ipfs/QmcRtp8XFhxykCRyesP9hw4A1F2avuY7oXuBP1P3zh5Evs/1.json");
    })

    it("should set the url after the deploy the contract",async function(){
        await token.mint(owner,1);
        await token.setBaseURI("https://ipfs.io/ipfs/QmcRtp8XFhxykCRyesP9hw4A1F2avuY7oXuBP1P3zh5Evs/");
        expect(await token.tokenURI(1)).equal("https://ipfs.io/ipfs/QmcRtp8XFhxykCRyesP9hw4A1F2avuY7oXuBP1P3zh5Evs/1.json");
    })

    it("should approve the assistant to transfer the NFT from owner address",async function(){
        await token.mint(owner,1);
        await token.mint(owner,2);
        await token.mint(owner,3);
        await token.setApprovalForAll(assist,true);
        const isApproved = await token.isApprovedForAll(owner,assist);
        expect(isApproved).to.be.true;
    })

    it("should transfer the NFT to recipient address by assistant",async function(){
        await token.mint(owner,1);
        await token.mint(owner,2);

        await token.setApprovalForAll(assist,true);
        await token.connect(assist).transferNFT(recipient,1);
        await token.connect(assist).transferNFT(recipient,2);

        expect(await token.ownerOf(1)).equal(recipient.address);
        expect(await token.ownerOf(2)).equal(recipient.address);
    })
})