// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

contract Vote {
    mapping(address => bool) public addressHasVoted;
    mapping(address => uint) public canidatesVotes;

    function voteForCandidate(address _candidate) external {
        require(addressHasVoted[msg.sender] == false, "Already voted");
        canidatesVotes[_candidate]++;
    }
}