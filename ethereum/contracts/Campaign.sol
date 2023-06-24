// SPDX-License-Identifier: MIT

pragma solidity^0.8.9;

contract CampaignFactory{

    address payable[] public deployedCampaigns;

    function createCampaign (uint minimum) public{

        address newCampaign = address(new Campaign(minimum, msg.sender)); //typecasting a string into address
        deployedCampaigns.push(payable(newCampaign)); // typecasting an address to address payable

    } 

    function getDeployedCampaigns() public view returns(address payable [] memory){
        return deployedCampaigns;
    }
}

contract Campaign{

    struct Request{
        string description;
        uint value;
        address recipient;
        bool complete;
        uint approvalCount;
        mapping(address => bool) approvals;
        
    }

    Request [] public requests;
    address public manager;
    uint public minimumContribution;
    mapping(address=>bool) public approvers;
    uint public approversCount;

    modifier ristricted(){
        require(msg.sender == manager);
        _;
    }
    


    constructor (uint minimum,address creator){
       manager = creator;
       minimumContribution = minimum;
    }

    function contribute() public payable {
         require(msg.value>minimumContribution);
         if(!approvers[msg.sender]){
          approvers[msg.sender]=true;
          approversCount++;
          }
    }

    function createRequest(string memory description, uint value, address recipient) public ristricted{
          Request storage newrequest = requests.push();

             newrequest.description = description;
             newrequest.value = value;
             newrequest.recipient = recipient;
             newrequest.complete = false;
             newrequest.approvalCount = 0;
    } 

    function approveRequest(uint index)public{

      Request storage request = requests[index];

        require(approvers[msg.sender]);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender]=true;
        request.approvalCount++;
    }
    
    function finalizeRequest(uint index) public ristricted{

        Request storage request = requests[index];

        require(request.approvalCount>(approversCount/2));
        require(!request.complete);

        payable(request.recipient).transfer(request.value);
        request.complete=true;
    }

    function getSummary() public view returns(uint,uint,uint,uint,address){
        return(
          minimumContribution,
          address(this).balance,
          requests.length,
          approversCount,
          manager
        );
    }

    function getRequestsCount() public view returns(uint){

        return requests.length;

    }
       

}