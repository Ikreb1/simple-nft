import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

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