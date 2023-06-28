import React, { Component } from "react";
import { Table, Button, Message } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import Campaign from "../ethereum/campaign";

class RequestRow extends Component {
  state = {
    loadingApprove: false,
    loadingFinalize: false,
  };
  onApprove = async () => {
    this.props.errorCheck({
      errorMessage: "",
      error: false,
      errVisible: false,
      errHidden: true,
    });
    const campaign = Campaign(this.props.address);

    const accounts = await web3.eth.getAccounts();

    if (window.ethereum.networkVersion !== "11155111") {

      this.props.sepoliaCheck({ visible: true, hidden: false });

    } 
    else {

      this.props.sepoliaCheck({ visible: false, hidden: true });

      this.setState({ loadingApprove: true });

      try {

        await campaign.methods.approveRequest(this.props.id).send({
          from: accounts[0],
        });
      } 
      catch (error) {

        this.props.errorCheck({
          errorMessage: error.message,
          error: true,
          errVisible: true,
          errHidden: false,

        });
      }

      this.setState({ loadingApprove: false });
    }
  };

  onFinalize = async () => {
    this.props.errorCheck({
      errorMessage: "",
      error: false,
      errVisible: false,
      errHidden: true,
    });

    const campaign = Campaign(this.props.address);
    const accounts = await web3.eth.getAccounts();

    if (window.ethereum.networkVersion !== "11155111") {

      this.props.sepoliaCheck({ visible: true, hidden: false });

    } 
    else {

      this.props.sepoliaCheck({ visible: false, hidden: true });
      this.setState({ loadingFinalize: true });

      try {

        await campaign.methods.finalizeRequest(this.props.id).send({
          from: accounts[0],
        });
        
      } 
      catch (error) {

        this.props.errorCheck({
          errorMessage: error.message,
          error: true,
          errVisible: true,
          errHidden: false,

        });
      }
    }
    this.setState({ loadingFinalize: false });
  };

  render() {
    const { Row, Cell } = Table;
    const { id, request, approversCount } = this.props;
    const readyToFinalize = Number(request.approvalCount) > approversCount / 2;

    return (
      <Row
        disabled={request.complete}
        positive={readyToFinalize && !request.complete}
      >
        <Cell>{id + 1}</Cell>
        <Cell>{request.description}</Cell>
        <Cell>{web3.utils.fromWei(request.value, "ether")}</Cell>
        <Cell>{request.recipient}</Cell>
        <Cell>
          {Number(request.approvalCount)}/{approversCount}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingApprove}
              color="green"
              basic
              onClick={this.onApprove}
            >
              Approve
            </Button>
          )}
        </Cell>
        <Cell>
          {request.complete ? null : (
            <Button
              loading={this.state.loadingFinalize}
              color="teal"
              basic
              onClick={this.onFinalize}
            >
              Finalize
            </Button>
          )}
        </Cell>
      </Row>
    );
  }
}

export default RequestRow;
