import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Loading } from 'react-simple-chatbot'; // Import Loading component if needed
import chatbot from 'api/chatbot'; // Import your chatbot API module
import { USERID } from 'localVariables/userInfo'; // Import your user ID constant

class Response extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: true,
      apiResult: '',
      trigger: false,
    };

    this.triggetNext = this.triggetNext.bind(this);
  }

  componentDidMount() {
    const self = this;
    const { steps } = this.props;
    const { userInput } = steps;
    console.log(userInput.value)

    // Make API call using user input
    chatbot.uploadMessage(USERID, userInput.value)
      .then(response => {
        // Set API result to state
        console.log(response.data)
        this.setState({ apiResult: response, loading: false });
        this.triggetNext();
      })
      .catch(error => {
        console.error('Error fetching API:', error);
        // Optionally handle error state
        this.setState({ loading: false });
      });
  }

  triggetNext() {
    this.setState({ trigger: true }, () => {
      this.props.triggerNextStep();
    });
  }

  render() {
    const { loading, apiResult, trigger } = this.state;

    return (
      <div style={{ width: '100%' }}>
        {loading ? (
          <Loading /> // Render loading indicator if API call is in progress
        ) : (
          <div>
            <p>{apiResult}</p>
            {/* Optionally, render a button to trigger the next step */}

          </div>
        )}
      </div>
    );
  }
}

Response.propTypes = {
  steps: PropTypes.object.isRequired, // PropTypes validation for steps object
  triggerNextStep: PropTypes.func.isRequired, // PropTypes validation for triggerNextStep function
};

Response.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
};

export default Response;
