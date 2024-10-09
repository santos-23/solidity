// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;
import "hardhat/console.sol";

contract Lottery1 {

    struct Lottery {
        address creater;
        uint256 lotteryStartTime;
        uint256 lotteryEndTime;
        uint256 ticketAmount;
        bool isClaimed;
        address winner;
        uint256 secretCode;
    }
    struct Participant {
        address user;
        uint256 joinTime;
        uint lotteryNo;
        uint256 enteredCode;
    }
    Lottery[] public lotteries;
    mapping(address => Participant) public participants;
    address public deployer;

    constructor(){
        deployer = msg.sender;
    }

    function createLottery(uint256 _lotteryStartTime,uint256 _lotteryEndTime,uint256 _ticketAmount) external {
        require(_lotteryStartTime < _lotteryEndTime, "Invalid start and end times");
        console.log("lottery created");
        lotteries.push(Lottery({
            creater: msg.sender,
            lotteryStartTime: block.timestamp + (_lotteryStartTime * 1 seconds),
            lotteryEndTime: block.timestamp + _lotteryStartTime + (_lotteryEndTime * 1 seconds),
            ticketAmount: _ticketAmount,
            isClaimed: false,
            winner: address(0),
            secretCode: generateSecretCode()
        }));
    }

    function currentTime() public view returns (uint256) {
        return block.timestamp;
    }

    function generateSecretCode() private view returns(uint256){
        return uint(block.timestamp) % 100;
    }
    
    function joinLottery(uint256 _lotteryIndex,uint256 code) external payable {
        require(msg.value == (lotteries[_lotteryIndex].ticketAmount) * 1 ether,"Value must be equal");
        require(_lotteryIndex < lotteries.length, "Invalid lottery index");
        require(participants[msg.sender].user == address(0), "Already joined this lottery");
        
        participants[msg.sender] = Participant({
            user: msg.sender,
            joinTime: block.timestamp,
            lotteryNo: _lotteryIndex,
            enteredCode: code
        });
    }

    function claim(uint256 lotteryIndex) public {
        require(lotteryIndex < lotteries.length, "Invalid lottery index");
        require(lotteries[lotteryIndex].isClaimed == false, "Already claimed");
        require(block.timestamp < lotteries[lotteryIndex].lotteryEndTime,"Lottery is ended, cannot claim");
        // require(block.timestamp > lotteries[lotteryIndex].lotteryStartTime,"Lottery is not started yet, wait untill it begin");
        // require(participants[msg.sender].enteredCode == lotteries[lotteryIndex].secretCode, "Secret code does not match, better luck next time");

        if(participants[msg.sender].enteredCode == lotteries[lotteryIndex].secretCode){
            lotteries[lotteryIndex].winner = msg.sender;
            lotteries[lotteryIndex].isClaimed = true;
            address winner = msg.sender;
            uint256 rewardAmount = (lotteries[lotteryIndex].ticketAmount) * 3 ether;
            payable(winner).transfer(rewardAmount);
        }
        
    }

    function withdraw() public restricted {
        // for(uint256 i = 0; i < lotteries.length; i++){
        //     require(block.timestamp > lotteries[i].lotteryEndTime,"lotteries are not finished yet");
        // }
        payable(deployer).transfer(address(this).balance);
    }

    modifier restricted{
        require(msg.sender == deployer,"Deployer can only withdraw the balance");
        _;
    }
}
