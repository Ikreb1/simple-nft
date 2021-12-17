import { expect } from "chai";
import { ethers } from "hardhat";
import { deploymentScript } from "../scripts/helpers";

describe("Pudgy Penguins", function() {
    it("Pudgy Penguins unit test", async function() {
      const accounts = await ethers.getSigners()
  
      const pudgyPenguins = await deploymentScript("PudgyPenguins", "baseURI")
    });
  });