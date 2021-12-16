// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
import { ethers } from "hardhat";
import * as dotenv from "dotenv";

dotenv.config();

async function deploymentScript(contractName: string, ...payload: any[]) {
  const Contract = await ethers.getContractFactory(contractName)
  const contract = await Contract.deploy(...payload)
  
  await contract.deployed()
  console.log(`${contractName} deployed to: ${contract.address}`);

  return contract.address;
}

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const greeterAddress = await deploymentScript("Greeter", "Hello, Hardhat!")

  const cryptoCakesAddress = await deploymentScript("CryptoCakes", process.env.NFT_URL , "CryptoCakes", "CC")

  const nuclearNerdsAddress = await deploymentScript("NuclearNerds", process.env.NFT_URL, deployer.address, deployer.address)
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
