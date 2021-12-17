// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as dotenv from "dotenv";
import { deploymentScript } from "./helpers";

dotenv.config();

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const greeter = await deploymentScript("Greeter", "Hello, Hardhat!")

  const cryptoCakes = await deploymentScript("CryptoCakes", process.env.NFT_URL , "CryptoCakes", "CC")

  const nuclearNerds = await deploymentScript("NuclearNerds", process.env.NFT_URL, deployer.address, deployer.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
