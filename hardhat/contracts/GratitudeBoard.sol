//SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "hardhat/console.sol";

contract GratitudeBoard {

    struct Gratitude {
        uint amount;
        address sender;
        address receiver;
        string message;
    }

    mapping(address => Gratitude) public gratitudeEntries;
    event NewGratitudeEntry(address sender, address receiver, string message, uint amount);

    constructor() {

    }

    function createEntry(string memory message, address receiver)
    public payable
    {
        gratitudeEntries[msg.sender] = Gratitude(msg.value, msg.sender, receiver, message);
        (bool sent, bytes memory data) = payable(receiver).call{value: msg.value}("");
			  require(sent, "Failed to send Matic to Receiver");
        emit NewGratitudeEntry(msg.sender, receiver, message, msg.value);
    }

    function getYourEntries() public view returns(Gratitude memory)
    {
    return gratitudeEntries[msg.sender];
    }
}
