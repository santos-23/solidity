const { expect } = require('chai');
const { time } = require('@openzeppelin/test-helpers');
const { ethers } = require('hardhat');

describe("Lucky Lottery",function(){
    let deployer,participant1,participant2;
    let lottery;
    
    beforeEach(async function(){
        [deployer,participant1,participant2] = await ethers.getSigners()
        const Lottery = await ethers.getContractFactory("Lottery1");
        lottery = await Lottery.deploy();
    })

    it("should create multiple lottery and allow anyone can create the lottery",async function(){
        console.log("Lottery deployed on :",lottery.target)
        console.log("Deployer address : ",deployer.address)
        console.log("participant1 address : ",participant1.address)
        await lottery.connect(deployer).createLottery(10,1000,2);
        await lottery.connect(participant1).createLottery(100,1500,3);
        const lottery12 = await lottery.lotteries(1);
        console.log(lottery12.secretCode);

        expect(await deployer.address).to.be.not.equal(participant1.address)
    })

    it("should allow participants to join the lotteries",async function(){
        await lottery.connect(deployer).createLottery(100,1500,3);
        await lottery.connect(participant1).joinLottery(0,23,{value : ethers.parseEther("3")});
        const participant = await lottery.participants(participant1.address);
        expect(participant.user).to.equal(participant1.address);
        expect(participant.enteredCode).to.equal(23);
    })

    it('should create the secretcode while create the lottery and secretcode not same as other lottery',async function(){
        await lottery.connect(deployer).createLottery(10,1000,2);
        const lottery1 = await lottery.lotteries(0);
        const secretCode1 = lottery1.secretCode;
        console.log(secretCode1);
        await lottery.connect(participant1).createLottery(100,1500,3);
        const lottery2 = await lottery.lotteries(1);
        const secretCode2 = lottery2.secretCode;
        console.log(secretCode2);
        expect(secretCode1).to.be.not.equal(secretCode2);
    })

    it("should allow participants to claim the reward",async function(){
        await lottery.connect(participant1).createLottery(0,1500,3);
        const lottery1 = await lottery.lotteries(0);
        const secretCode1 = lottery1.secretCode;
        console.log(secretCode1);
        await lottery.connect(participant1).joinLottery(0,secretCode1,{value : ethers.parseEther("3")});
        await lottery.connect(deployer).joinLottery(0,12,{value : ethers.parseEther("3")});
        await lottery.connect(participant2).joinLottery(0,54,{value : ethers.parseEther("3")});
        await lottery.connect(participant1).claim(0);
        const lottery2 = await lottery.lotteries(0);
        expect( await lottery2.isClaimed).to.be.true;
    })

    it("should allow deployer to withdraw the remaining balance after lottery is finish",async function(){
        const initialBalance = await ethers.provider.getBalance(deployer.address);
        console.log(initialBalance);
        await lottery.connect(deployer).createLottery(0,100,3);
        await lottery.connect(participant1).joinLottery(0,23,{value : ethers.parseEther("3")});
        await lottery.connect(deployer).joinLottery(0,12,{value : ethers.parseEther("3")});
        await lottery.connect(participant2).joinLottery(0,54,{value : ethers.parseEther("3")});
        await lottery.connect(participant1).claim(0);
        await time.increase(time.duration.minutes(3));
        await lottery.connect(deployer).withdraw();
        const updatedBalance = await ethers.provider.getBalance(deployer.address);
        console.log(updatedBalance);
        expect(updatedBalance).to.be.greaterThan(initialBalance);
    })
})