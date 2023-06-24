const HDWalletProvider = require("@truffle/hdwallet-provider");
const {Web3} = require("web3");
const compiledFactory = require("./build/CampaignFactory.json");

const provider = new HDWalletProvider(
  "vacuum exit jacket obscure senior chaos devote document sniff isolate differ coil",
  "https://sepolia.infura.io/v3/bc143ae9420a4c79a9af60f75a327590"
); // this generates a new wallet instance which will be used to automatically sign our transaction before sending it to Ethereum network.

const web3 = new Web3(provider);

const deploy = async () => {
  const accounts = await web3.eth.getAccounts();

  console.log("Attempting to deploy from account:", accounts[0]);

  try {
    const result = await new web3.eth.Contract(compiledFactory.abi)
      .deploy({ data: compiledFactory.evm.bytecode.object })
      .send({ from: accounts[0], gas: "1400000" });

    console.log("Contract deployed to:", result.options.address);
    provider.engine.stop(); // this prevents deployment from hanging in terminal.

    //  console.log(compiledFactory.interface);
    // provider.engine.stop();
  } catch (error) {
    console.log(error);
  }
};

try {
  deploy();
} catch (error) {
  console.log(error);
}
