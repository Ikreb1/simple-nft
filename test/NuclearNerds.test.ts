import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

const keccak256 = require('keccak256')
const { MerkleTree } = require('merkletreejs')


describe("NuclearNerds", function() {
  it("NuclearNerds unit test", async function() {
    function hexifyNumberAsString(number: number) {
      const stringNumber = number.toString()
      let finalString = ""
      for(const i of stringNumber)
      {
          finalString += "3" + i
      }
      return finalString
  }
    const accounts = await ethers.getSigners()
    const deployer = accounts[0].address

    const allowance = 4
    const whitelistMembers = Array.from({length: 8}, (x, i) => accounts[i].address)

    const leaves = whitelistMembers.map(address => keccak256(address + hexifyNumberAsString(allowance)))
    const tree = new MerkleTree(leaves, keccak256, { sort: true })
    const root = tree.getHexRoot()
    const leaf = keccak256(whitelistMembers[0] + hexifyNumberAsString(allowance))
    const proof = tree.getHexProof(leaf)
    
    const team = Array.from({length: 2}, (x, i) => accounts[i + 3].address)
    const shares = [40, 60]
    const proxy = accounts[1]
    const wasteland = accounts[2]

    const jeffFromAccounting = await deploymentScript("JeffFromAccounting")
    const nuclearNerds = await deploymentScript("NuclearNerds", "baseURI", proxy.address, jeffFromAccounting.address)

    const newProjectTx = await jeffFromAccounting.newProject(nuclearNerds.address, team, shares)

    //View functions cost no gas as it only runs on your local node and the gas cost is simulated
    await jeffFromAccounting.getProjectTeam(nuclearNerds.address)
    await jeffFromAccounting.getProjectSplits(nuclearNerds.address)
    
    await nuclearNerds.setBaseURI("baseURI")
    await nuclearNerds.setProxyRegistryAddress(proxy.address)
    await nuclearNerds.setWastelandAddress(wasteland.address)

    await nuclearNerds.flipProxyState(proxy.address)
    await nuclearNerds.flipProxyState(proxy.address)

    await nuclearNerds.collectReserves()

    await nuclearNerds.setWhitelistMerkleRoot(root)

    await nuclearNerds.whitelistMint(1, allowance, proof, {
      value: ethers.utils.parseEther("0.069")
    })
    await nuclearNerds.whitelistMint(2, allowance, proof, {
      value: ethers.utils.parseEther("0.138")
    })

    await nuclearNerds.tokenURI(1)

    await nuclearNerds.togglePublicSale(8888)

    await nuclearNerds.whitelistMint(1, allowance, proof, {
      value: ethers.utils.parseEther("0.069")
    })
    
  });
});