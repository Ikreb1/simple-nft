import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";
const SHA256 = require('crypto-js/sha256')
import { MerkleTree } from 'merkletreejs';
import * as dotenv from "dotenv";
dotenv.config();



describe("CryptoCakes", function() {
  it("CryptoCakes unit test", async function() {
    const accounts = await ethers.getSigners()

    const cryptoCakes = await deploymentScript("CryptoCakes", process.env.NFT_URL, "CryptoCakes", "CC")

    //const deployedCC = await CryptoCakes.attach(cryptoCakes.address);

    expect(await cryptoCakes.name()).to.equal("CryptoCakes")
    expect(await cryptoCakes.symbol()).to.equal("CC")

    const minted_nft_tx = await cryptoCakes.mintNFT(`${process.env.CONTRACT_ADDRESS}`, `${process.env.NFT_URL}`)

    await minted_nft_tx.wait()
  });
});

describe("Pudgy Penguins", function() {
  it("Pudgy Penguins unit test", async function() {
    const accounts = await ethers.getSigners()

    const pudgyPenguins = await deploymentScript("PudgyPenguins", "baseURI")
  });
});

describe("DAW", function() {
  it("Desperate ape wifes unit test", async function() {
    const accounts = await ethers.getSigners()
    let shares = []
    let accountAddresses = []
    for (const account of accounts) {
      shares.push(100 / accounts.length)
      accountAddresses.push(account.address)
    }
    let admins = []
    for (let i = 0; i < 8; i++) {
      admins.push(accounts[i].address)
    }
    
    const donations = "0xbe247Ccc4f6e55378E9042ccb7037Bf3E6F16be8"
    admins.push(donations)

    const daw = await deploymentScript("DesperateApeWives", accountAddresses, shares, admins)

    expect(await daw.name()).to.equal("Desperate ApeWives")
    expect(await daw.symbol()).to.equal("DAW")
  });
});

describe("NuclearNerds", function() {
  it("NuclearNerds unit test", async function() {
    const accounts = await ethers.getSigners()

    const whitelistMembers = Array.from({length: 8}, (x, i) => accounts[i].address)
    const leaves = whitelistMembers.map(x => SHA256(x));
    const tree = new MerkleTree(leaves, SHA256)
    
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

    await nuclearNerds.setWhitelistMerkleRoot(tree.getRoot())

  });
});