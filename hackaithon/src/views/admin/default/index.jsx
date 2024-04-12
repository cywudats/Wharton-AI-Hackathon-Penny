import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import React, {useEffect, useState} from "react";

import receipt from 'api/receipt';
import user from 'api/user';
import { USERID } from 'localVariables/userInfo'

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";

const Dashboard = () => {
  const userId = USERID
  const userEmail = 'norris@gmail.com'
  const userPassword = '123'
  //Call API Function here to get information from database!!!!

   //Pie Data
   const [pieGeneralData, setPieGeneralData] = useState([])
   const [pieGeneralLabel, setPieGeneralLabel] = useState([]);
 
   const [piePersonalizedData, setPiePersonalizedData] = useState([])
   const [piePersonalizedLabel, setPiePersonalizedLabel] = useState([])



   //Balance information
   const [budget, setBudget] = useState(2000)
   const [remainingBudget, setRemainingBudget] = useState(budget)
   const [totalBalance , setTotalBalance] = useState(30000)
   const [revenue, setRevenue] = useState(2000)


   //Weekly Information
   const [totalSpent, setTotalSpent] = useState(0)
   const monthlysBudget = [1500, 1600, 1500, 2100, 2000, 1700]
   const [months, setMonths] = useState([])
   const [monthlysSpent, setMonthlysSpent] = useState([])



  useEffect(()=> {
    getUserData();
    calculateBalance();
    getMonthlysInfo();
  }, [])


  async function getUserData() {
    const res = await user.loginUser(userEmail,userPassword)
    let generalCategories = []
    let generalValues = []
    let personalizedCategories = []
    let personalizedValues = []
    const generalExpenses = res.main_categories_exp
    const personalizedExpenses = res.sub_categories_exp
    for (let key in generalExpenses){
      generalCategories.push(key)
      generalValues.push(generalExpenses[key])
    }
    for (let key in personalizedExpenses){
      personalizedCategories.push(key)
      personalizedValues.push(personalizedExpenses[key])
    }
    setPieGeneralData(generalValues)
    setPieGeneralLabel(generalCategories)
    setPiePersonalizedData(personalizedValues)
    setPiePersonalizedLabel(personalizedCategories)



  }

  async function calculateBalance() {
    const res = await receipt.getUserReceipts(userId)
    console.log(res)
    let val = 0
    for (let i = 0; i < res.length; i++) {
      val += parseFloat(res[i].amount)
    }
    setTotalSpent(val.toFixed(2))
    setRemainingBudget((budget - val).toFixed(2))

  }


  //Call API Function here to get line chart information!!!
  async function getMonthlysInfo() {
    const res = await user.loginUser(userEmail,userPassword)
    let past_exp = res.past_exp
    let mon = []
    let spent = []
    for (let keys in past_exp) {
      mon.push(keys)
      spent.push(past_exp[keys].toFixed(0))
    }
    setMonthlysSpent(spent)
    setMonths(mon)
    
  }

  //Function to determine color of the balance
  function getColor() {
    const ratio = remainingBudget/budget
    if (ratio > 0.1) {
      return 'text-green-500'
    } else if (ratio > 0) {
      return 'text-yellow-500'
    } else {
      return 'text-red-500'
    }
  }


  //Variables for bar graph
  const dailySpendature = [20,50,10,57,130,20,40]



  return (
    <div>
      {/* Card widget */}
      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Budget This Month"}
          subtitle={budget}
          color = {'text-black'}
          
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Remaining Budget this Month"}
          subtitle={remainingBudget}
          color = {getColor()}
        />
      </div>

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
      <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Your Total Balance"}
          subtitle={totalBalance}
          color={'text-black'}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Revenue This Month"}
          subtitle={revenue}
          color = {'text-green-500'}
        />
      </div>

      {/* Seperating the widgest into 3 columns!!!
      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Earnings"}
          subtitle={"$340.5"}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Spend this month"}
          subtitle={"$642.39"}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Sales"}
          subtitle={"$574.34"}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Your Balance"}
          subtitle={"$1,700"}
        />
        
        
      </div>
      */}
      

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent value = {totalSpent} months = {months} monthlysBudget = {monthlysBudget} monthlysSpent = {monthlysSpent}/>
        <WeeklyRevenue dailySpendature = {dailySpendature}/>
      </div>


      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <PieChartCard name="Your Classic Spendatures" pieData = {pieGeneralData} pieLabels = {pieGeneralLabel}/>
        <PieChartCard name="Your Personalized Spendatures"  pieData = {piePersonalizedData} pieLabels = {piePersonalizedLabel}/>
      </div>

      
    </div>
  );
};

export default Dashboard;
