import Response from 'components/chatbot/response'
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import ChatBot from 'react-simple-chatbot';
import accountAvatar from 'assets/img/avatars/NorrisAvatar.JPG'
import cssSheet from 'components/chatbot/chatbot.css'

class SimpleForm extends Component {
    render() {
      return (
        <ChatBot
        userAvatar = {accountAvatar}
        headerTitle = "Penn-Y"
        width= "100%"
        customStyle={cssSheet}
         // Set the maximum heigh}
        const steps = {[
            {
              id: '0',
              message: 'Hi! My name is Penny, your Generative-AI Persoanl Budget Bot',
              trigger: '1',
            },
            {
                id: '1',
                message: 'I can answer questions about your current purchases and budget! Please ask me things about your receipts like how much you spent or how many receipts you have',
                trigger: 'userInput',
            },
            {
              id: 'userInput',
              user: true,
              trigger: 'response',
            },
            {
              id: 'response',
              component: <Response />, // Render the Review component
              asMessage: true,
              waitAction: true,
              trigger: 2,
              // end: true,
            },
            {
              id: '2',
              message: "I hope that answered your question! Do you have any other questions for me?",
              trigger: 'userInput',
            }
        ]}
        />
      );
    }
  }


  export default SimpleForm;