import { ethers } from "hardhat";

async function sendStuff() {
    const accounts = await ethers.getSigners()

    for (const account of accounts) {
        console.log(account.getBalance())
    }
  
    const hash = await accounts[0].sendTransaction({
      to: "0xbe247Ccc4f6e55378E9042ccb7037Bf3E6F16be8",
      value: ethers.utils.parseEther("10.0")
    })
    console.log(hash)
}

async function main() {
    sendStuff()
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  