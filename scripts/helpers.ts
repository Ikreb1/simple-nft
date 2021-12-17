import { ethers } from "hardhat";

export async function deploymentScript(contractName: string, ...payload: any[]) {
    const Contract = await ethers.getContractFactory(contractName)
    const contract = await Contract.deploy(...payload)
    
    await contract.deployed()
    console.log(`${contractName} deployed to: ${contract.address}`);
  
    return contract;
  }