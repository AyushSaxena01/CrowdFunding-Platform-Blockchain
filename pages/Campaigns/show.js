import React, { Component } from "react";
import Layout from "../../components/Layout";
import Campaign from "../../ethereum/campaign";
import { Card, Grid, Button } from "semantic-ui-react";
import web3 from "../../ethereum/web3";
import ContributeForm from "../../components/ContributeForm";
import { Link } from "../../routes";

class CampaignShow extends Component {
  static async getInitialProps(props) {
    const campaign = Campaign(props.query.address); //props.query.address gives the address variable in the url.

    const summary = await campaign.methods.getSummary().call();
    

    return {
      address: props.query.address,
      minimumContribution: Number(summary[0]),
      balance: Number(summary[1]),
      requestsCount: Number(summary[2]),
      approversCount: Number(summary[3]),
      manager: summary[4],
    };
  }

  renderCards() {
    const {
      minimumContribution,
      balance,
      requestsCount,
      approversCount,
      manager
    } = this.props;
   

    const items = [
      {
        header: manager,
        meta: "Address of Manager",
        description:
          "This manager created this campaign and can create requests to withdraw moneyto support the campaign.",
        style: { overflowWrap: "break-word" },
      },
      {
        header: minimumContribution,
        meta: "Minimum Contribution (Wei)",
        description:
          "You must contribute at least this much wei to become a contributor.",
      },
      {
        header: requestsCount,
        meta: "Total number of requests.",
        description:
          "A request tries to withdraw money from the contract. Request must be approved by the approvers",
      },
      {
        header: approversCount,
        meta: "Number of approvers",
        description: "Number of people who have already donated.",
      },
      {
        header:web3.utils.fromWei(balance, "ether"),
        meta: "Campaign balance (ether)",
        description:
          "The balance is how much money is left in campaign to spend.",
      },
    ];
    return <Card.Group items={items} />;
  }

  render() {
    return (
      <Layout>
        <h3>Campaign show!</h3>
        <Grid>
          <Grid.Row>
            <Grid.Column width={10}>
              {this.renderCards()}
        
              </Grid.Column>

            <Grid.Column width={6}>
              <ContributeForm address={this.props.address} />
            </Grid.Column>
          </Grid.Row>
          <Grid.Row>
            <Grid.Column>
            <Link legacyBehavior route={`/Campaigns/${this.props.address}/requests`}>
          <a>
            <Button primary>View Requests</Button>
          </a>
        </Link>
            </Grid.Column>
          </Grid.Row>
         
        </Grid>
      
      </Layout>
    );
  }
}

export default CampaignShow;
