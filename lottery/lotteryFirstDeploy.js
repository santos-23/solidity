const { time } = require("@openzeppelin/test-helpers");
const { ethers } = require("hardhat");

async function main(){

    const [deployer,participant1,participant2] = await ethers.getSigners()

    const Lottery = await ethers.getContractFactory("Lottery1");
    const lottery = await Lottery.deploy();
    console.log('Contract address of lottery : ',lottery.target);

    console.log("deployer: ",deployer.address); //0x74630c903687dCbB670774E41D7a8FB221eA1b37
    console.log("participant 1: ",participant1.address); //0x5a398371D5334A64e752509b5C99b8822036F63A
    console.log("participant 2: ",participant2.address); //0xc9b158C9F8C504CB3eFfC9740bfa454F00fcAF27
    console.log(await lottery.deployer())
    
    await lottery.createLottery(0,1000,2);

    const initialBalance = await ethers.provider.getBalance(deployer.address);
        console.log(initialBalance);

        const lottery1 = await lottery.lotteries(0);
        const secretCode1 = lottery1.secretCode;
        console.log(secretCode1);

    await lottery.connect(deployer).joinLottery(0,56,{value : ethers.parseEther("2")});
    await lottery.connect(participant1).joinLottery(0,45,{value : ethers.parseEther("2")});
    await lottery.connect(participant2).joinLottery(0,secretCode1,{value : ethers.parseEther("2")});

    const updatedBalance = await ethers.provider.getBalance(deployer.address);
    console.log(updatedBalance);
    
    await lottery.connect(deployer).claim(0);
    await lottery.connect(participant1).claim(0);
    await lottery.connect(participant2).claim(0);

    const finalBalance = await ethers.provider.getBalance(deployer.address);
    console.log(finalBalance);

}

main()
.then(()=>process.exit(0))
.catch((error)=>{
    console.error(error);
    process.exit(1)
})