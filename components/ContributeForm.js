import React, { Component } from "react";
import { Form, Input, Message, Button } from "semantic-ui-react";
import Campaign from "../ethereum/campaign";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

class ContributeForm extends Component {
  state = {
    value: "",
    errorMessage: "",
    errorMessage2: "",
    loading: false,
    visible: false,
    hidden: true,
  };

  onSubmit = async (event) => {
    event.preventDefault();
    const campaign = Campaign(this.props.address);

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
    } else if (this.state.value.trim() == "") {
      this.setState({
        errorMessage2: "Empty input",
        visibile: true,
        hidden: false,
      });
    } else {
      this.setState({
        loading: true,
        errorMessage: "",
        errorMessage2: "",
        visible: false,
        hidden: true,
      });

      try {
        const accounts = await web3.eth.getAccounts();
        await campaign.methods.contribute().send({
          from: accounts[0],
          value: web3.utils.toWei(this.state.value, "ether"),
        });

        Router.replaceRoute(`/Campaigns/${this.props.address}`);
      } catch (error) {
        this.setState({ errorMessage: error.message });
      }

      this.setState({
        loading: false,
        value: "",
      });
    }
  };

  render() {
    return (
      <Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
        <Form.Field>
          <label>Amount to contribute</label>
          <Input
            label="ether"
            labelPosition="right"
            value={this.state.value}
            onChange={(event) => {
              this.setState({ value: event.target.value });
            }}
          />
        </Form.Field>
        <Message error header="Oops" content={this.state.errorMessage} />
        <Message
          negative
          visible={this.state.visible}
          hidden={this.state.hidden}
          header="Oops!"
          content={this.state.errorMessage2}
        />
        <Button primary loading={this.state.loading}>
          Contribute
        </Button>
      </Form>
    );
  }
}

export default ContributeForm;
