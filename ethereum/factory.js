import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x03316686Ba9AC6931A63476d5608300BCE2626d0'
); 
export default factoryInstance;