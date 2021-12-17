import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

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