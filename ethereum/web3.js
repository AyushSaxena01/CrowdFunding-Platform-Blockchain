import {Web3} from 'web3';

let web3;

if(typeof window !== "undefined" && typeof window.ethereum !== "undefined"){
    //we are in the browser and metamask is running. 
    window.ethereum.request({method: "eth_requestAccounts"});
    web3 = new Web3(window.ethereum); // we extract the metamask provider and create a new intance of web3 because we do not know what version of web3 is injected by metamask, we want to keep our version of web3 for code consistency. 
}
else{
    //we are on the server OR user is not running meta mask
    const provider = new Web3.providers.HttpProvider("https://sepolia.infura.io/v3/bc143ae9420a4c79a9af60f75a327590");
    web3 = new Web3(provider);
}



export default web3;