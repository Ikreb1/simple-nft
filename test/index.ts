import { expect } from "chai";
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
dotenv.config();

describe("Greeter", function () {
  it("Should return the new greeting once it's changed", async function () {
    const Greeter = await ethers.getContractFactory("Greeter");
    const greeter = await Greeter.deploy("Hello, world!");
    await greeter.deployed();

    expect(await greeter.greet()).to.equal("Hello, world!");

    const setGreetingTx = await greeter.setGreeting("Hola, mundo!");

    // wait until the transaction is mined
    await setGreetingTx.wait();

    expect(await greeter.greet()).to.equal("Hola, mundo!");
  });
});

describe("CryptoCakes", function () {
  it("Should return the right name and symbol", async function () {
    const accounts = await ethers.getSigners();
    const CryptoCakes = await ethers.getContractFactory("CryptoCakes");
    const cryptoCakes = await CryptoCakes.deploy(process.env.NFT_URL, "CryptoCakes", "CC");
    await cryptoCakes.deployed();

    //const deployedCC = await CryptoCakes.attach(cryptoCakes.address);

    expect(await cryptoCakes.name()).to.equal("CryptoCakes");
    expect(await cryptoCakes.symbol()).to.equal("CC");

    const minted_nft_tx = await cryptoCakes.mintNFT(`${process.env.CONTRACT_ADDRESS}`, `${process.env.NFT_URL}`)

    await minted_nft_tx.wait();
    //console.log(minted_nft_tx);
  });
});

describe("DAW", function () {
  it("Should be able to verify whitelist with merkletree", async function () {
    const accounts = await ethers.getSigners();
    const DAW = await ethers.getContractFactory("DesperateApeWives");
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
    const daw = await DAW.deploy(accountAddresses, shares, admins);
    await daw.deployed();

    //const deployedDAW = await DAW.attach(cryptoCakes.address);

    expect(await daw.name()).to.equal("Desperate ApeWives");
    expect(await daw.symbol()).to.equal("DAW");
  });
});