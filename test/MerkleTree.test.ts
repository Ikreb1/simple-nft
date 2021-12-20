import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')

const encode = ethers.utils.solidityPack

//it.only() to only run this test
describe("MerkleTest", function() {
  it.only("See if account can be verified", async function() {

    // needs to add because the address is converted to string with 0x infront making it 42 hex values not 40
    // and I guess encodPacked one intializes 
    function makeStupidSignedString(number: number) {
        const stringNumber = number.toString()
        let finalString = ""
        for(const i of stringNumber)
        {
            finalString += "3" + i
        }
        return finalString
    }

    const accounts = await ethers.getSigners()
    const allowance = 50
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
    console.log("SL " + await simpleMerkleTree.packValues(makeStupidSignedString(allowance), deployer)) //same
    console.log("JS " + encode(["string", "string"], [deployer, makeStupidSignedString(allowance)])) //same
    console.log()

    console.log("A more realistic version that converts the int to strings etc.")
    console.log("SL " + await simpleMerkleTree.replica(allowance))
    console.log("JS " + deployer + makeStupidSignedString(allowance))
    console.log("JS " + deployer + makeStupidSignedString(allowance) + " add hardcoded 3 infront of each number in ")
    console.log("JS " + encode(["string", "string"], [deployer, makeStupidSignedString(allowance)]) + " what I though would work")
    console.log(`adding binary 11 infront of each number in numbers makes it work the same as encodePacked() -_-`)
    console.log()

    console.log("Lets try and hash it with keccak256")
    console.log("SL " + await simpleMerkleTree.dump(allowance))
    console.log("JS " + "0x" + keccak256(deployer + makeStupidSignedString(allowance)).toString('hex'))
    console.log("hashing looks good")
    console.log()
    
    // failed attempts
    // const packedAddress = encode(["string"], [deployer]) 
    // console.log("0x" + keccak256(encode(["string", "string"], [packedAddress, "3"])).toString('hex'))
    // console.log("0x" + keccak256(encode(["string", "string"], [deployer, "3"])).toString('hex'))
    console.log("all right every test has worked now for the real deal")


    // what you would actually need to replicated NuclearNerds merkletree with address and allowance
    const nnLeaves = whitelistMembers.map(address => keccak256(address + makeStupidSignedString(allowance)))
    const nnTree = new MerkleTree(nnLeaves, keccak256, { sort: true })
    const nnRoot = nnTree.getHexRoot()
    const nnLeaf = keccak256(deployer + makeStupidSignedString(allowance))
    const nnProof = nnTree.getHexProof(nnLeaf)

    await simpleMerkleTree.setMerkleRoot(nnRoot)

    expect(await simpleMerkleTree.nnVerify(10, allowance, nnProof)).to.equal(true)

    console.log(await simpleMerkleTree.toStringTest(3))
  });
});