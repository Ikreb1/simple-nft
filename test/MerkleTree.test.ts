import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

const encode = ethers.utils.solidityPack

//it.only() to only run this test
describe("MerkleTest", function() {
  it("See if account can be verified", async function() {
    const accounts = await ethers.getSigners()
    const deployer = accounts[0].address
    const whitelistMembers = Array.from({length: 8}, (x, i) => accounts[i].address)

    const leaves = whitelistMembers.map(x => keccak256(x))
    const tree = new MerkleTree(leaves, keccak256, { sort: true })
    const root = tree.getHexRoot()
    const leaf = keccak256(deployer)
    const proof = tree.getHexProof(leaf)

    const simpleMerkleTree = await deploymentScript("SimpleMerkleTree")

    await simpleMerkleTree.setMerkleRoot(root)

    const isVerified = await simpleMerkleTree.isVerified(proof)
    expect(isVerified).to.equal(true)

    console.log("Are addresses the same?")
    console.log("SL " + await simpleMerkleTree._msgSender())
    console.log("JS " + deployer)
    console.log()

    console.log("can we replicate abi.encodePacked(string memory payload, string memory allowance)?")
    console.log("SL " + await simpleMerkleTree.packValues("3", deployer)) //same
    console.log("JS " + encode(["string", "string"], [deployer, "3"])) //same
    console.log()

    console.log("A more realistic version that converts the int to strings etc.")
    console.log("SL " + await simpleMerkleTree.replica(3))
    console.log("JS " + encode(["string", "string"], [deployer, "3"]))
    console.log("JS " + deployer + "3")
    console.log("JS " + deployer + "33")
    console.log("extra 3 fixes the issue when converting the 3 to a string -_-")
    console.log()

    console.log("Lets try and hash it with keccak256")
    console.log("SL " + await simpleMerkleTree.dump(3))
    console.log("JS " + "0x" + keccak256(deployer + "33").toString('hex'))
    console.log("hashing looks good")
    console.log()
    
    // failed attempts
    // const packedAddress = encode(["string"], [deployer]) 
    // console.log("0x" + keccak256(encode(["string", "string"], [packedAddress, "3"])).toString('hex'))
    // console.log("0x" + keccak256(encode(["string", "string"], [deployer, "3"])).toString('hex'))
    console.log("all right every test has worked now for the real deal")


    // what you would actually need to replicated NuclearNerds merkletree with address and allowance
    const nnLeaves = whitelistMembers.map(address => keccak256(address + "33"))
    const nnTree = new MerkleTree(nnLeaves, keccak256, { sort: true })
    const nnRoot = nnTree.getHexRoot()
    const nnLeaf = keccak256(deployer + "33")
    const nnProof = nnTree.getHexProof(nnLeaf)

    await simpleMerkleTree.setMerkleRoot(nnRoot)

    expect(await simpleMerkleTree.nnVerify(10, 3, nnProof)).to.equal(true)
  });
});