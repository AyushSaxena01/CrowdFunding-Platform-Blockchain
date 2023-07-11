import React, { Component } from "react";
import Layout from "../../components/Layout";
import { Form, Button, Input, Message } from "semantic-ui-react";
import Factory from "../../ethereum/factory";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class CampaignNew extends Component {
  state = {
    minimumContribution: "",
    errorMessage: "",
    errorMessage2: "",
    loading: false,
    visible: false,
    hidden: true,
  };
  
  onSubmit = async (event) => {
   
    event.preventDefault();
    
    this.setState({
      errorMessage: "",
      errorMessage2:"",
      visible: false,
      hidden: true,
    });


    if (typeof window.ethereum == "undefined") {
      this.setState({
        visibile: true,
        hidden: false,
        errorMessage2: "Please download Metamask Wallet.",
      });
    } else if (window.ethereum.networkVersion !== "11155111") {
      this.setState({
        visibile: true,
        hidden: false,
        errorMessage2: "Please switch to Sepolia Test Network",
      });
    } else {
      this.setState({
        loading: true,
        errorMessage: "",
        errorMessage2:"",
        visible: false,
        hidden: true,
      });

      try {
        const accounts = await web3.eth.getAccounts();
        await Factory.methods
          .createCampaign(this.state.minimumContribution)
          .send({
            from: accounts[0],
          });

        Router.pushRoute("/"); //this will navigate back to homepage.
      } catch (error) {
        this.setState({ errorMessage: error.message });
      }

      this.setState({ loading: false });
    }
  };
  render() {
    return (
      <Layout>
        <h3>Create a Campaign!</h3>

        <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
          <Form.Field>
            <label>Minimum Contribution</label>
            <Input
              label="wei"
              labelPosition="right"
              value={this.state.minimumContribution}
              onChange={(event) => {
                this.setState({ minimumContribution: event.target.value ,errorMessage:'',errorMessage2:'',visible: false,
                hidden: true});
              }}
            />
          </Form.Field>

          <Message error header="Oops!" content={this.state.errorMessage} />

          <Message
            negative
            visible={this.state.visible}
            hidden={this.state.hidden}
            header="Oops!"
            content={this.state.errorMessage2}
          />

          <Button loading={this.state.loading} primary>
            Create!
          </Button>
        </Form>
      </Layout>
    );
  }
}

export default CampaignNew;
