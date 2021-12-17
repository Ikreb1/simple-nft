import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

const { keccak256, bufferToHex } = require('ethereumjs-util');
const { MerkleTree } = require('./helpers/merkleTree');

describe("NuclearNerds", function() {
  it("NuclearNerds unit test", async function() {
    const accounts = await ethers.getSigners()
    const whitelistMembers = Array.from({length: 8}, (x, i) => accounts[i].address)
    const allowance = 3
    const leaves = whitelistMembers.map(x => keccak256(x, `${allowance}`))
    const tree = new MerkleTree(leaves)
    const team = Array.from({length: 2}, (x, i) => accounts[i + 3].address)
    const shares = [40, 60]
    const proxy = accounts[1]
    const wasteland = accounts[2]

    const jeffFromAccounting = await deploymentScript("JeffFromAccounting")
    const nuclearNerds = await deploymentScript("NuclearNerds", "baseURI", proxy.address, jeffFromAccounting.address)

    const newProjectTx = await jeffFromAccounting.newProject(nuclearNerds.address, team, shares)
    /*
     * View functions cost no gas as it only runs on your local node and the gas cost is simulated
     */
    await jeffFromAccounting.getProjectTeam(nuclearNerds.address)
    await jeffFromAccounting.getProjectSplits(nuclearNerds.address)
    
    await nuclearNerds.setBaseURI("baseURI")
    await nuclearNerds.setProxyRegistryAddress(proxy.address)
    await nuclearNerds.setWastelandAddress(wasteland.address)

    await nuclearNerds.flipProxyState(proxy.address)
    await nuclearNerds.flipProxyState(proxy.address)

    await nuclearNerds.collectReserves()
    await nuclearNerds.setWhitelistMerkleRoot(tree.getHexRoot())
    const leaf = keccak256(accounts[0].address, `${allowance}`)
    const proof = tree.getHexProof(leaf)
    console.log(proof)
    await nuclearNerds.whitelistMint(1, 3, proof)

    await nuclearNerds.togglePublicSale(8888)

  });
});