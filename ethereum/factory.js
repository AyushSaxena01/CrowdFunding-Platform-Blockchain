import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const factoryInstance = new web3.eth.Contract(
    CampaignFactory.abi,
    '0x8AA9e98eB9407267DD00FfcDAAf03ccfda876168'
); 
export default factoryInstance;