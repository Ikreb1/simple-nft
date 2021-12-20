// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/MerkleProof.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

import "hardhat/console.sol";

contract SimpleMerkleTree {

    bytes32 public merkleRoot;

    function setMerkleRoot(bytes32 _merkleRoot) external {
        merkleRoot = _merkleRoot;
    }

    function _leaf(string memory payload) internal pure returns (bytes32) {
        //return keccak256(abi.encodePacked(payload, allowance));
        return keccak256(abi.encodePacked(payload));
    }

    function _verify(bytes32 leaf, bytes32[] memory proof) internal view returns (bool) {
        return MerkleProof.verify(proof, merkleRoot, leaf);
    }

    function isVerified(bytes32[] calldata proof) public view returns (bool) {
        string memory payload = string(abi.encodePacked(msg.sender));
        require(_verify(_leaf(payload), proof), "Invalid Proof");
        return true;
    }

    /*
     * https://docs.soliditylang.org/en/develop/abi-spec.html#non-standard-packed-mode
     * WARNING: If you use keccak256(abi.encodePacked(a, b)) and both a and b are dynamic types, 
     * it is easy to craft collisions in the hash value by moving parts of a into b and vice-versa. 
     * More specifically, abi.encodePacked("a", "bc") == abi.encodePacked("ab", "c"). If you use abi.encodePacked
     * for signatures, authentication or data integrity, make sure to always use the same types and check that at 
     * most one of them is dynamic. Unless there is a compelling reason, abi.encode should be preferred.
     * Should be safe since its getting one variable from msg.sender
     */
    // NuclearNerds leaf function
    function _nnLeaf(string memory allowance, string memory payload) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked(payload, allowance));
    }

    // NuclearNerds verify function snippet
    function nnVerify(uint256 count, uint256 allowance, bytes32[] calldata proof) public view returns (bool) {
        string memory payload = string(abi.encodePacked(msg.sender));
        require(_verify(_nnLeaf(Strings.toString(allowance), payload), proof), "Invalid proof supplied.");
        require(count > 0, "not enough");
        return true;
    }

    function packValues(string memory allowance, string memory payload) public pure returns (bytes memory) {
        return abi.encodePacked(payload, allowance);
    }

    function dump(uint256 allowance) external view returns (bytes32) {
        string memory payload = string(abi.encodePacked(msg.sender));
        return _nnLeaf(Strings.toString(allowance), payload);
    }

    function replica(uint256 allowance) external view returns (bytes memory) {
        string memory payload = string(abi.encodePacked(msg.sender));
        return packValues(Strings.toString(allowance), payload);
    }

    function _msgSender() external view returns (address) {
        return msg.sender;
    }
}