import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";

const SHA256 = require('crypto-js/sha256')
import { MerkleTree } from 'merkletreejs';

dotenv.config();

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html
task("accounts", "Prints the list of accounts", async (taskArgs, hre) => {
  const accounts = await hre.ethers.getSigners();

  for (const account of accounts) {
    console.log(account.address);
  }
});

task("merkle", "makes a merkel tree", async (taskArgs, hre) =>{
  /**
   * https://github.com/miguelmota/merkletreejs-solidity
   * As is, this implemenation is vulnerable to a second pre-image attack. 
   * Use a difference hashing function for leaves and nodes, so that H(x) != H'(x). 
   * Also, as is, this implementation is vulnerable to a forgery attack 
   * for an unbalanced tree, where the last leaf node can be duplicated to 
   * create an artificial balanced tree, resulting in the same Merkle root hash. 
   * Do not accept unbalanced tree to prevent this.
   * More info here.
   */
  const accounts = await hre.ethers.getSigners()

  console.log("unhashed addresses")
  let count = 0;
  for (const account of accounts) {
    console.log(`${count}# ${account.address}`)
    count++
  }
  
  const leaves = accounts.map(x => SHA256(x.address));
  const tree = new MerkleTree(leaves, SHA256)
  const root = tree.getRoot().toString('hex')
  const leaf = SHA256(accounts[0].address)
  const proof = tree.getProof(leaf)
  console.log(MerkleTree.verify(proof, leaf, root))

  console.log(tree.toString())  
})

// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more

const config: HardhatUserConfig = {
  solidity: "0.8.4",
  networks: {
    ropsten: {
      url: process.env.ROPSTEN_URL || "",
      accounts:
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY] : [],
    },
    rinkeby: {
      url: process.env.RINKEBY_URL || "",
      accounts: 
        process.env.PRIVATE_KEY !== undefined ? [process.env.PRIVATE_KEY]: [],
    },
  },
  gasReporter: {
    enabled: process.env.REPORT_GAS !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env.ETHERSCAN_API_KEY,
  },
};

export default config;
