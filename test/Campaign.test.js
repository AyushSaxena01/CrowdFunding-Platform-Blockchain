const assert = require('assert');
const ganache = require('ganache-cli');// ganache commandline interface is used to run local ethereum network on which testing is done on local env.
const {Web3} = require('web3');
const web3 = new Web3(ganache.provider());

const compiledFactory = require('../ethereum/build/CampaignFactory.json');
const compiledCampaign = require('../ethereum/build/Campaign.json');


let accounts;
let factory;
let campaignAddress;
let campaign;
 

beforeEach(async ()=>{
    accounts = await web3.eth.getAccounts();

    factory = await new web3.eth.Contract(compiledFactory.abi)
    .deploy({ data:compiledFactory.evm.bytecode.object })
    .send({ from:accounts[0], gas:'1400000' });

    await factory.methods.createCampaign('100').send({
        from:accounts[0],
        gas:'1000000'
    });

    
    let deployedCampaign = await factory.methods.getDeployedCampaigns().call();
    campaignAddress=deployedCampaign[0];

    campaign = await new web3.eth.Contract(compiledCampaign.abi,campaignAddress);
});  


describe("campains",()=>{
    it("deploys a factory and a campaign",()=>{
        // console.log(campaign);
        // console.log(campaignAddress);
        assert.ok(factory.options.address);
        assert.ok(campaign.options.address);
    });

    it("marks caller as the campaign manager",async()=>{
        console.log(factory.options.address);

        const manager = await campaign.methods.manager().call();
        assert.equal(accounts[0],manager);
    });

    it("allows people to contribute money and mark them as approver",async()=>{
         await campaign.methods.contribute().send({
            value:'200',
            from:accounts[1]

        });

        const isContributor = await campaign.methods.approvers(accounts[1]).call();
        assert(isContributor);

    });

    it("requires minimum contribution",async ()=>{
        try {
            await campaign.methods.contribute().send({
                value:10,
                from:accounts[1]
            });
            assert(false);
        } catch (error) {
            assert(error);
            
        }
    });

    it("allows a manager to make a payment request",async()=>{
        await campaign.methods.createRequest("Buy battery",'200',accounts[1]).send({
            from:accounts[0],
            gas:'1000000'
        });

        const request = await campaign.methods.requests(0).call();

        assert.equal("Buy battery",request.description);
    });

    it("does not allows any one other than manager to make a payment request",async()=>{

        try{
        await campaign.methods.createRequest("Buy battery",'200',accounts[1]).send({
            from:accounts[1],
            gas:'1000000'
        });
        
        assert(false);
        
        }catch(error){
             assert(error);
        }

        
    });

    it('finalise request',async()=>{
        await campaign.methods.contribute().send({
            value:web3.utils.toWei('10','ether'),
            from:accounts[0]
        });

        await campaign.methods.createRequest('Buy batteries',web3.utils.toWei('5','ether'),accounts[1]).send({
            from:accounts[0],
            gas:'1000000'
        });

        await campaign.methods.approveRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });

         await campaign.methods.finalizeRequest(0).send({
            from:accounts[0],
            gas:'1000000'
        });
        

        let balance = await web3.eth.getBalance(accounts[1]);
        balance = web3.utils.fromWei(balance,'ether');
        balance = parseFloat(balance);

        assert(balance>104);
    });
});