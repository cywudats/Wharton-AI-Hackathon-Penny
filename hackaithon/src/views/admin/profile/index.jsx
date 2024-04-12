import Banner from "./components/Banner";
import General from "./components/General";
import Notification from "./components/Notification";
import Project from "./components/Project";
import Storage from "./components/Storage";
import Upload from "./components/Upload";

import chatbot from "api/chatbot"
import Response from 'components/chatbot/response'
import SimpleForm from 'components/chatbot/chatboxComp'


//Chatbot 1 Try
// import React from "react";
// import Chatbot from "react-chatbot-kit";

// import config from "components/chatbot/chatbotConfig";
// import MessageParser from "components/chatbot/MessageParser";
// import ActionProvider from "components/chatbot/ActionProvider";

//Chatbot2 
import ChatBot from 'react-simple-chatbot';
import {USERID} from 'localVariables/userInfo'

const ProfileOverview = () => {
  async function chatBotResponse() {
    try {
      const res = await chatbot.uploadMessage(USERID, "Hello chatGPT!");
      console.log(res);
    } catch (error) {
      console.error('Error sending message to chatbot:', error);
    }
  }

  
  // const steps = [
  //   {
  //     id: '0',
  //     message: 'Welcome to react chatbot!',
  //     trigger: '1',
  //   },
  //   {
  //     id: '1',
  //     user: true,
  //     trigger: '2',
  //   },
  //   {
  //     id: '2',
  //     component: <Response />, // Render the Review component
  //     asMessage: true,
  //     trigger: 1,
  //     // end: true,
  //   },
  // ];


  return (

    <div className="flex w-full flex-col gap-5">
      <div className="w-full mt-3 lg:grid-cols-12">
        <div className="col-span-4 lg:!mb-0">
          <Banner />
        </div>



        
      </div>

      
      {/* all project & ... */}

      <div className="grid h-full grid-cols-1 gap-5 lg:!grid-cols-12">
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-4">
          <Project />
        </div>
        <div className="col-span-5 lg:col-span-6 lg:mb-0 3xl:col-span-5">
          <General />
        </div>

  
      </div>
    </div>
  );
};

export default ProfileOverview;
