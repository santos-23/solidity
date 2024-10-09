const { ethers } = require("hardhat");

async function main(){
    const [owner,assist,recipient] = await ethers.getSigners();
    // owner address : 0x74630c903687dCbB670774E41D7a8FB221eA1b37
    // assist address : 0x5a398371D5334A64e752509b5C99b8822036F63A
    // recipient address : 0xc9b158C9F8C504CB3eFfC9740bfa454F00fcAF27

    const Token = await ethers.getContractFactory("NFT_Transfer");
    const token = await Token.deploy("https://ipfs.io/ipfs/QmcRtp8XFhxykCRyesP9hw4A1F2avuY7oXuBP1P3zh5Evs/");
    console.log("deployed on: ",token.target);

    await token.mint(owner,1);
    await token.mint(owner,2);
    await token.mint(owner,3);

    console.log("NFT#1 is owned by :",await token.ownerOf(1));
    console.log("NFT#2 is owned by :",await token.ownerOf(2));
    console.log("NFT#3 is owned by :",await token.ownerOf(3));

    await token.setApprovalForAll(assist,true);
    const isApproved = await token.isApprovedForAll(owner,assist);
    console.log(assist.address,` is approved by owner : ${isApproved}`);

    await token.connect(assist).transferNFT(recipient,1);
    await token.connect(assist).transferNFT(recipient,2);
    await token.connect(assist).transferNFT(recipient,3);

    console.log("NFT#1 is owned by :",await token.ownerOf(1));
    console.log("NFT#2 is owned by :",await token.ownerOf(2));
    console.log("NFT#3 is owned by :",await token.ownerOf(3));

}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1)
})

//https://ipfs.io/ipfs/QmQMdbdTtKPdxBM8DG8ggnuzrDzP51F8i4xQbYoX9PrLj3/