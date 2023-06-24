import React, { Component } from "react";
import Layout from "../../../components/Layout";
import {Button,Table} from "semantic-ui-react";
import { Link } from "../../../routes";
import Campaign from '../../../ethereum/campaign';
import RequestRow from '../../../components/RequestRow';

class RequestIndex extends Component {
  static async getInitialProps(props) {
    const address  = props.query.address;
    const campaign = Campaign(address);
     const RequestCount = await campaign.methods.getRequestsCount().call();
     const requestCount=Number(RequestCount);
     const ApproversCount = await campaign.methods.approversCount().call();
     const approversCount=Number(ApproversCount);

     const requests=await Promise.all(
      Array(parseInt(requestCount)).fill().map((element,index)=>{
        return campaign.methods.requests(index).call();
      })
     );

    return { address, requests, requestCount, approversCount };
  }

  renderRow(){
    return this.props.requests.map((request,index)=>{
      return <RequestRow 
      request={request}
      key={index}
      id={index}
      address={this.props.address}
      approversCount={this.props.approversCount}      
      />;

    });
  } 

  render() {
    const{Header,Row,HeaderCell,Body}=Table;


    return (
      <Layout>
        <h3>Requests</h3>
        <Link legacyBehavior route={`/Campaigns/${this.props.address}/requests/new`}>
          <a>
            <Button primary floated='right' style={{margin:10}}>Add Request</Button>
          </a>
        </Link>
        <Table>
          <Header>
            <Row>
              <HeaderCell>ID</HeaderCell>
              <HeaderCell>Descreption</HeaderCell>
              <HeaderCell>Amount</HeaderCell>
              <HeaderCell>Recipient</HeaderCell>
              <HeaderCell>Approval Count</HeaderCell>
              <HeaderCell>Approve</HeaderCell>
              <HeaderCell>Finalize</HeaderCell>

            </Row>
          </Header>
          <Body>
            {this.renderRow()}
          </Body>
        </Table>
        <div>Found {this.props.requestCount} requests.</div>
      </Layout>
    );
  }
}

export default RequestIndex;
