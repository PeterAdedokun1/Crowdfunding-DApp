// SPDX-License-Identifier: MIT
pragma solidity ^0.8.22;

import "./RewardToken.sol";

contract Crowdfunding {
    address public owner;
    RewardToken public rewardToken;

    uint256 public totalRaised;
    mapping(address => uint256) public contributions;

    event Funded(address indexed contributor, uint256 amount, uint256 reward);
    event Withdrawn(address indexed owner, uint256 amount);

    modifier onlyOwner() {
        require(msg.sender == owner, "Not project owner");
        _;
    }

    constructor(address _rewardToken) {
        owner = msg.sender;
        rewardToken = RewardToken(_rewardToken);
    }

    function fund() external payable {
        require(msg.value > 0, "Contribution must be > 0");

        contributions[msg.sender] += msg.value;
        totalRaised += msg.value;

        // 1 ETH = 100 RWD (with proper decimals)
        uint256 rewardAmount = (msg.value * 100) * (10 ** rewardToken.decimals());
        rewardToken.mint(msg.sender, rewardAmount);

        emit Funded(msg.sender, msg.value, rewardAmount);
    }

    function withdraw() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No funds to withdraw");

        (bool success, ) = owner.call{value: balance}("");
        require(success, "Withdraw failed");

        emit Withdrawn(owner, balance);
    }
}
