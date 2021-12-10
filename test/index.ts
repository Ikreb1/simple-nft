import { expect } from "chai";
import { ethers } from "hardhat";

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
    const cryptoCakes = await CryptoCakes.deploy("CryptoCakes", "CC");
    await cryptoCakes.deployed();

    //const deployedCC = await CryptoCakes.attach(cryptoCakes.address);

    expect(await cryptoCakes.name()).to.equal("CryptoCakes");
    expect(await cryptoCakes.symbol()).to.equal("CC");

    const minted_nft_tx = await cryptoCakes.mintNFT(`${process.env.CONTRACT_ADDRESS}`, `${process.env.NFT_URL}`)
    console.log(minted_nft_tx);
  });
});