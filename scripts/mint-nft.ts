import * as dotenv from "dotenv";

import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { ethers } from "hardhat";

dotenv.config();

async function attachAndMint(tokenURI: string) {
    const accounts = await ethers.getSigners();
    //await PrintAccounts(accounts)
    
    const nonce = await accounts[0].getTransactionCount();
    console.log(`nonce: ${nonce}`)

    const CryptoCakes = await ethers.getContractFactory("CryptoCakes");
    const cryptoCakes = await CryptoCakes.attach(`${process.env.CONTRACT_ADDRESS}`);
    cryptoCakes.mintNFT(accounts[0].address, tokenURI);
}

async function main() {
    await attachAndMint(`${process.env.NFT_URL}`)
}

async function PrintAccounts(accounts: SignerWithAddress[]) {
    for (const account of accounts) {
        console.log("Deploying contracts with the account:", account.address);

        console.log("Account balance:", (await account.getBalance()).toString());
    }
}


main().catch((err) =>  {
    console.error(err);
    process.exitCode = 1;
})