import { MdFileUpload } from "react-icons/md";
import Card from "components/card";
import React, {useState, useEffect} from "react";
import ReactLoading from 'react-loading';
import { motion } from 'framer-motion';
import user from "api/user";
import receipt from "api/receipt";
import {USERID} from "localVariables/userInfo"



const Upload = () => {
  const userId = USERID
  const[state, setState] = useState("upload") //three forms: "loading", "upload", "form"
  const [file, setFile] = useState()
  const [formData, setFormData] = useState({
    date: "",
    generalCategory: "",
    personalizedCategory: "",
    totalAmount: "",
  });

  function handleFormChange(event) {
    const {name, value} = event.target
    setFormData({
      ...formData,
      [name]: value
    })
  }


  
  async function uploadImage(event) {
    setState("loading")
    const file = event.target.files[0];
    console.log("Selected file:", file.name);
    setFile(file)


    const res = receipt.uploadReceipts(userId, file);
    res.then((data) => {
      setFormData({
        date: data.time,
        generalCategory: data.main_category,
        personalizedCategory: data.sub_category,
        totalAmount: data.amount
      })
      setState("form")
    })


    // // Create a FormData object
    // const formData = new FormData();
    // formData.append('image', file); // Append the file to the form data



    // // Send a POST request to the server
    //   fetch(`http://127.0.0.1:8000/receipt/upload/?user_id=${userId}`, {
    //       method: 'POST',
    //       body: formData // Send the form data as the request body
    //       // No need to set the Content-Type header, as fetch will set it automatically for FormData
    //   })
    //   .then(response => {
    //       if (!response.ok) {
    //           throw new Error('Failed to upload image');
    //       }
    //       return response.json(); // Assuming the server returns JSON data
    //   })
    //   .then(data => {
    //       // Handle successful response from the server
    //       console.log('Upload successful:', data);
    //       setState("form");
    //   })
    //   .catch(error => {
    //       // Handle errors
    //       console.error('Error uploading image:', error);
    //       setState("form");
    //   });
    // You can perform additional operations with the file, such as uploading it to the server
    // setTimeout(() => {
    //   setState("form")
    //   document.getElementById("fileInput").value = "";
    // },2000)
  }
  function confirmReceipt() {
    setState("loading")
    console.log(userId, formData.totalAmount, formData.personalizedCategory, formData.generalCategory, formData.date)
    const res = receipt.createReceipts(userId, parseFloat(formData.totalAmount), formData.personalizedCategory, formData.generalCategory, formData.date, "123");
    res.then(() => {
      setState("upload")
      }
    )

  }

  function postTest() {
    const res = receipt.createReceipts(userId, 100.25, "food", "Transportation", "03/05/1998", "image.png");
    console.log(res)
  }



  return (
    
    <motion.div
    className="h-[500px]"
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}>
    
    <Card className="grid h-full w-full grid-cols-1 gap-3 rounded-[20px] bg-white bg-clip-border p-3 font-dm shadow-3xl shadow-shadow-500 dark:!bg-navy-800 dark:shadow-none 2xl:grid-cols-11">
      <div className="col-span-5 h-full w-full rounded-xl bg-lightPrimary dark:!bg-navy-700 2xl:col-span-6">
        <input id="fileInput" type="file" style={{ display: 'none' }} onChange={uploadImage} />
        {state === 'form' &&
        <Card extra={"w-full h-full p-3"}>
        {/* Header */}
        <div className="mt-2 mb-8 w-full">
          <h4 className="px-2 text-xl font-bold text-navy-700 dark:text-white">
            Your Receipt
          </h4>
          <p className="mt-2 px-2 text-base text-gray-600">
            Please update the information that you feel like is wrong!
          </p>
        </div>
        {/* Cards */}
        <div className="grid grid-cols-2 gap-4 px-2">
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Date</p>
            <input
              name = "date"
              type="text"
              value= {formData.date}
              onChange={handleFormChange}
              className="text-base font-medium text-navy-700 dark:text-white outline-none border-none bg-transparent"
          />
          </div>
  
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">General Category</p>
            <input
              name = "generalCategory"
              type="text"
              value= {formData.generalCategory}
              onChange={handleFormChange}
              className="text-base font-medium text-navy-700 dark:text-white outline-none border-none bg-transparent"
          />
          </div>
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Personalized Category</p>
            <input
              name = "personalizedCategory"
              type="text"
              value= {formData.personalizedCategory}
              onChange={handleFormChange}
              className="text-base font-medium text-navy-700 dark:text-white outline-none border-none bg-transparent"
          />
          </div>
  
          <div className="flex flex-col items-start justify-center rounded-2xl bg-white bg-clip-border px-3 py-4 shadow-3xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
            <p className="text-sm text-gray-600">Total Amount</p>
            <input
              name ="totalAmount"
              type="text"
              value= {formData.totalAmount}
              onChange={handleFormChange}
              className="text-base font-medium text-navy-700 dark:text-white outline-none border-none bg-transparent"
          />
          </div>
          
        </div>
      </Card>}
      {state === 'upload' &&
        
        <label htmlFor="fileInput" className="flex h-full w-full flex-col items-center justify-center rounded-xl border-[2px] border-dashed border-gray-200 py-3 dark:!border-navy-700 lg:pb-0 cursor-pointer" style={{ transition: 'cursor 0.3s' }}>
          <MdFileUpload className="text-[80px] text-brand-500 dark:text-white" />
          <h4 className="text-xl font-bold text-brand-500 dark:text-white" >
            Upload Files
          </h4>
          <p className="mt-2 text-sm font-medium text-gray-600">
            PNG and JPG Files are allowed
          </p>
          
        </label>}
        
        {state === 'loading' && 
        <motion.div 
        className="linear mt-4 flex items-center justify-center rounded-xl px-2 py-2 text-base font-medium text-white transition duration-200"
        // Set height to fill the viewport vertically
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center"> {/* Flex container for 'Loading' and ReactLoading */}
        
          <span className="ml-2 text-lg text-blue-500 font-semibold">Loading</span> {/* Added styles for size and color */}
          <ReactLoading type={"bubbles"} color={"blue"} height={50} width={25} style={{ marginTop: "2px" }}/>
          
        </div>
      </motion.div>
          
        }
      </div>

      <div className="col-span-5 flex h-full w-full flex-col justify-center overflow-hidden rounded-xl bg-white pl-3 pb-4 dark:!bg-navy-800">
        <h5 className="text-left text-xl font-bold leading-9 text-navy-700 dark:text-white">
          Automatic Receipts Reader
        </h5>
        <p className="leading-1 mt-2 text-base font-normal text-gray-600">
          <ol className="leading-1 mt-2 text-base font-normal text-gray-600">
            <li>1. Please click the Upload Files button and submit a PNG or JPG of your receipt!</li>
            <li>2. After Submitting, you will be prompted with a form to double check that the information you have submitted is correct</li>
            <li>3. Once everything seems correct, press the Confirm Receipt button to confirm the information</li>
          </ol>
        </p>
        

        {state === 'form' ?
        
        <motion.button  
        initial={{ opacity: 0, scale: 0.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.2 }}
        className="linear mt-4 flex items-center justify-center rounded-xl bg-brand-500 px-2 py-2 text-base font-medium text-white transition duration-200 hover:bg-brand-600 active:bg-brand-700 dark:bg-brand-400 dark:text-white dark:hover:bg-brand-300 dark:active:bg-brand-200"
          
          onClick = {confirmReceipt}
        >
          Confirm Receipt
        </motion.button> 
        :  <div/>}
        
      </div>
    </Card>
    </motion.div>
  );
};

export default Upload;
