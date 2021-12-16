import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import TokenArtifact from '../abi/CryptoCakes.json';
import contractAddress from '../abi/contract-address.json';
export const Dapp = () => {
  const [contractName, setContractName] = useState('Not found')
 
 async function _initialize() {
   await _intializeEthers();
 }
 
 const _intializeEthers = async () => {
   // ethers connection for the smartcontract
   const _provider = new ethers.providers.Web3Provider(window.ethereum)
 
   const _token = new ethers.Contract(
    contractAddress.Token,
    TokenArtifact.abi,
    _provider.getSigner(0)
   );

   const newContractName = await _token.name()

   setContractName(newContractName)
 
   console.log(_token)
 };
 
 // Connects to the smart contract token id (check /contracts/contract-address.json)
 async function init() {
  const [selectedAddress] = await window.ethereum.enable()
  _initialize(selectedAddress);
 }
 
 useEffect(() => {
   // When the page loads it will initialize the init function
   // that we need to connect the frontend with the smartcontract
   init();
  }, []);
 
 return (
   <div style={{ padding: '3rem 5rem' }}>
    <h1>{contractName}</h1>
   </div>
  );
}