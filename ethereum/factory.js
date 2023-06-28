import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0xB72d54df168AE10FCA79E1DE220c3911d6548673'
); 
export default factoryInstance;