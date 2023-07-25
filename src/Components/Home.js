import React, { useEffect, useState } from 'react'
import { UserContext } from '../Context/UserContext'
import { useContext } from 'react'
import { createSearchParams, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import '../sb-admin-2.min.css'
import '../fontawesome-free/css/all.min.css'
import DatePicker from "react-datepicker";
import { Chart } from "react-google-charts";
import "../../node_modules/react-datepicker/dist/react-datepicker.css";
import { useFormik } from 'formik';
import Popuptx from './Popuptx'
import _ from 'underscore'
import PopupEditTx from './PopupEditTx'

function Home() {
    const context = useContext(UserContext)
    const params = useParams()
    const [actiontype, setActionsType] = useState("Daily");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [filterValuesBox, setFilterValuesBox] = useState([])
    const [tableFilterOption, setTableFilterOption] = useState("")
    const [tableValues, setTableValues] = useState([{ txAmount: 0, txCategory: "", txDate: "", txDescription: "", txDivision: "", txType: "" }])
    const [chartArray, setChartArray] = useState([
        [
            "Month",
            "Income",
            "Expense"
        ],
        ["2004/05", 1, 9],
        ["2004/05", 1, 9],
        ["2004/05", 1, 9],
        ["2004/05", 1, 9],
        ["2004/05", 1, 9],
        ["2004/05", 1, 9]]);
    const [chartOptions, setchartOptions] = useState({
        title: "Monthly Income & Expense",
        vAxis: { title: "Amount" },
        hAxis: { title: "Month" },
        seriesType: "line"
    })


    const dateDetail = useFormik({
        initialValues: {
            dateType: "Daily",
            startingDate: new Date(),
            endingDate: new Date()
        },
        onSubmit: async (values) => {
            try {
                console.log("values", values)
                const contextValue = {
                    dateType: values.dateType,
                    startingDate: startDate,
                    endingDate: (values.dateType === "Custom" ? endDate : "")
                }
                await context.settransactionDate(contextValue)
                console.log(context.transactionDate)
                navigate({ pathname: `/home/${params.userid}`, search: `?${createSearchParams(contextValue)}` });
                const tempChartArray = [];
                const fetchData = async () => {
                    const transaction = await axios.get(`${process.env.REACT_APP_BACKENDURL}/fetch_transaction_details/${params.userid}?${createSearchParams(contextValue)}`, {

                        headers: {
                            "Authorization": localStorage.getItem("myreact")
                        }

                    }
                    );
                    if (transaction.data.empty === "empty") {
                        setTableValues([{ txAmount: 0, txCategory: "", txDate: "", txDescription: "", txDivision: "", txType: "" }])
                    } else {
                        setTableValues(transaction.data)
                        tempChartArray.push([
                            `${values.dateType}`,
                            "Income",
                            "Expense"
                        ])
                        transaction.data.forEach(element => {
                            tempChartArray.push([new Date(element.txDate).toDateString(), (element.txType === "Expense" ? 0 : element.txAmount), (element.txType === "Expense" ? element.txAmount : 0)])
                        });



                    }
                    console.log("TX Scess", transaction.data)
                    console.log("tempChartArray ", tempChartArray)
                    const chartOptionTemp = {
                        title: `${values.dateType} Income & Expense`,
                        vAxis: { title: "Amount" },
                        hAxis: { title: `${values.dateType}` },
                        seriesType: "line"
                    }
                    const filterValues = transaction.data.map(({ txCategory, txDivision, txType, txDescription }) => ({ txCategory, txDivision, txType, txDescription }))
                    const tempFilter = {

                        category: _.keys(_.countBy(filterValues, function (data) { return data.txCategory })),
                        division: _.keys(_.countBy(filterValues, function (data) { return data.txDivision })),
                        type: _.keys(_.countBy(filterValues, function (data) { return data.txType })),
                        description: _.keys(_.countBy(filterValues, function (data) { return data.txDescription })),
                    }
                    const allFilters = tempFilter.category.concat(tempFilter.division).concat(tempFilter.type).concat(tempFilter.description)

                    setFilterValuesBox(allFilters)
                    setchartOptions(chartOptionTemp)
                    setChartArray(tempChartArray)
                    console.log("filterValuesBox", filterValuesBox)

                }
                fetchData()




            }
            catch (error) {
                console.log("ERROR:", error)
                alert(error.response.data.message)
            }

        }
    })
    //form end

    const navigate = useNavigate();

    const logout = () => {
        localStorage.removeItem("myreact")
        navigate("/")
    }

    useEffect(() => {
        const fetchData = async () => {
            const transaction = await axios.get(`${process.env.REACT_APP_BACKENDURL}/fetch_transaction_details/${params.userid}?${createSearchParams(context.transactionDate)}`, {
                headers: {
                    "Authorization": localStorage.getItem("myreact")
                }
            }
            );
            if (transaction.data.empty === "empty") {
                setTableValues([{ txAmount: 0, txCategory: "", txDate: "", txDescription: "", txDivision: "", txType: "" }])
            } else {

                console.log("transaction.data", transaction.data)
                const filterValues = transaction.data.map(({ txCategory, txDivision, txType, txDescription }) => ({ txCategory, txDivision, txType, txDescription }))
                const tempFilter = {

                    category: _.keys(_.countBy(filterValues, function (data) { return data.txCategory })),
                    division: _.keys(_.countBy(filterValues, function (data) { return data.txDivision })),
                    type: _.keys(_.countBy(filterValues, function (data) { return data.txType })),
                    description: _.keys(_.countBy(filterValues, function (data) { return data.txDescription })),
                }
                const allFilters = tempFilter.category.concat(tempFilter.division).concat(tempFilter.type).concat(tempFilter.description)

                setFilterValuesBox(allFilters)

                setTableValues(transaction.data)
                console.log("filterValuesBox", filterValuesBox)
            }
        }
        fetchData()
    }, [])

    return (

        <div id="wrapper">

            <div id="content-wrapper" class="d-flex flex-column">

                <div id="content">
                    {/* <!-- Topbar --> */}
                    <nav class="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">

                        <h3>Money Manager {params.dateType}</h3>

                        <ul class="navbar-nav ml-auto">

                            <div class="topbar-divider d-none d-sm-block"></div>

                            {/* <!-- Nav Item - User Information --> */}
                            <button type="button" className='btn btn-danger' onClick={logout}>Logout</button>

                        </ul>

                    </nav>
                    {/* <!-- End of Topbar --> */}
                    <div class="container-fluid">
                        <div class="d-sm-flex align-items-center justify-content-between mb-4">
                            <h1 class="h3 mb-0 text-gray-800">Dashboard {actiontype}</h1>
                        </div>

                      
                        <div class="row">
                            <div class="col-xl-8 col-lg-7">
                                <div class="card  border-left-primary shadow mb-4">
                                    {/* <!-- Card Header - Dropdown --> */}
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">Account</h6>
                                    </div>
                                    {/* <!-- Card Body --> */}
                                    <div class="card-body">
                                        <div class="chart-area" style={{ height: "500px" }}>
                                            <Chart
                                                chartType="ComboChart"
                                                width="100%"
                                                height="400px"
                                                data={chartArray}
                                                options={chartOptions}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div class="col-xl-4 col-lg-5">
                                <div class="card shadow mb-4">
                                    {/* <!-- Card Header - Dropdown --> */}
                                    <div
                                        class="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                                        <h6 class="m-0 font-weight-bold text-primary">Actions</h6>

                                    </div>
                                    {/* <!-- Card Body --> */}
                                    <div class="card-body">

                                        <Popuptx />
                                        <form onSubmit={dateDetail.handleSubmit}>

                                            <ul class="nav nav-tabs">
                                                <li class="nav-item">
                                                    <span class={`nav-link  ${actiontype === "Daily" ? "active" : ""}`} onClick={e => { setActionsType("Daily"); dateDetail.values.dateType = "Daily" }} >Daily</span>
                                                </li>
                                                <li class="nav-item">
                                                    <span class={`nav-link  ${actiontype === "Monthly" ? "active" : ""}`} onClick={e => { setActionsType("Monthly"); dateDetail.values.dateType = "Monthly" }} >Monthly</span>
                                                </li>
                                                <li class="nav-item">
                                                    <span class={`nav-link  ${actiontype === "Yearly" ? "active" : ""}`} onClick={e => { setActionsType("Yearly"); dateDetail.values.dateType = "Yearly" }} >Yearly</span>
                                                </li>
                                                <li class="nav-item">
                                                    <span class={`nav-link  ${actiontype === "Custom" ? "active" : ""}`} onClick={e => { setActionsType("Custom"); dateDetail.values.dateType = "Custom"; }} >Custom</span>
                                                </li>
                                            </ul>
                                            <br />
                                            <div style={{ height: '190px' }}>
                                                {actiontype === "Daily" ?
                                                    <>
                                                        <p> Select Date </p>
                                                        <DatePicker
                                                            closeOnScroll={(e) => e.target === document}
                                                            selected={startDate} onChange={(date) => { setStartDate(date); dateDetail.values.startingDate = new Date(date); dateDetail.values.endingDate = new Date(date) }}
                                                            showDateMonthYearPicker
                                                            dateFormat="dd/MM/yyyy"
                                                        />
                                                    </>
                                                    : (
                                                        actiontype === "Monthly" ?
                                                            <>
                                                                <p> Select Month </p>
                                                                <DatePicker
                                                                    closeOnScroll={(e) => e.target === document}
                                                                    selected={startDate} onChange={(date) => { setStartDate(date); dateDetail.values.startingDate = new Date(date); dateDetail.values.endingDate = new Date(date) }}
                                                                    showMonthYearPicker
                                                                    dateFormat="MM/yyyy"
                                                                />
                                                            </>
                                                            : (
                                                                actiontype === "Yearly" ?
                                                                    <>
                                                                        <p> Select Year </p>
                                                                        <DatePicker
                                                                            closeOnScroll={(e) => e.target === document}
                                                                            selected={startDate} onChange={(date) => { setStartDate(date); dateDetail.values.startingDate = new Date(date); dateDetail.values.endingDate = new Date(date) }}
                                                                            showYearPicker
                                                                            dateFormat="yyyy"
                                                                        />
                                                                    </>
                                                                    : (
                                                                        actiontype === "Custom" ?
                                                                            <div>


                                                                                <p> Select Start Date </p>
                                                                                <DatePicker
                                                                                    // closeOnScroll={(e) => e.target === document}
                                                                                    selected={startDate}
                                                                                    onChange={(date) => { setStartDate(date); dateDetail.values.startingDate = new Date(date) }}
                                                                                    selectsStart
                                                                                    startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    dateFormat="dd/MM/yyyy"
                                                                                />

                                                                                <br />


                                                                                <p> Select End Date </p>
                                                                                <DatePicker
                                                                                    // closeOnScroll={(e) => e.target === document}
                                                                                    selected={endDate}
                                                                                    onChange={(date) => { setEndDate(date); dateDetail.values.endingDate = new Date(date) }}
                                                                                    selectsEnd
                                                                                    startDate={startDate}
                                                                                    endDate={endDate}
                                                                                    minDate={startDate}
                                                                                    dateFormat="dd/MM/yyyy"
                                                                                />

                                                                            </div> : <></>
                                                                    )
                                                            )
                                                    )
                                                }
                                            </div>
                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <button className="btn btn-primary btn-block  mb-3" type={"submit"} >Submit</button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* tablee */}
                        <h1 class="h3 mb-2 text-gray-800">Tables</h1>
                        <div class="card shadow mb-4">
                            <div class="card-header py-3 d-flex flex-row">
                                <h6 class="m-0 font-weight-bold text-primary">Expenses & Income</h6>
                                <div style={{ marginLeft: `auto` }}>

                                    <label for="dropdowntableFilter">Select Filter</label>
                                    <select
                                        name='dropdowntableFilter'
                                        id="dropdowntableFilter"
                                        onChange={e => { setTableFilterOption(e.target.value); setTableValues([...tableValues]) }}
                                        value={tableFilterOption}
                                    >
                                        <option disabled> </option>
                                        {filterValuesBox.map((element) => <option>{element}</option>)}

                                    </select>

                                </div>
                            </div>
                            <div class="card-body">
                                <div class="table-responsive">
                                    <table class="table table-bordered" id="dataTable" width="100%" cellspacing="0">
                                        <thead>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Date</th>
                                                <th>Category</th>
                                                <th>Division</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Edit</th>
                                            </tr>
                                        </thead>
                                        <tfoot>
                                            <tr>
                                                <th>S.No</th>
                                                <th>Date</th>
                                                <th>Category</th>
                                                <th>Division</th>
                                                <th>Amount</th>
                                                <th>Type</th>
                                                <th>Description</th>
                                                <th>Edit</th>

                                            </tr>
                                        </tfoot>
                                        <tbody>
                                            {tableValues.map((row, index) => {
                                                if (row.txCategory === tableFilterOption || row.txDivision === tableFilterOption || row.txType === tableFilterOption || row.txDescription === tableFilterOption || tableFilterOption == "") {
                                                    return <tr>
                                                        <td>{index + 1}</td>
                                                        <td>{row.txDate}</td>
                                                        <td>{row.txCategory}</td>
                                                        <td>{row.txDivision}</td>
                                                        <td>{row.txAmount}</td>
                                                        <td>{row.txType}</td>
                                                        <td>{row.txDescription}</td>
                                                        <td>{((new Date() - new Date(row.createdAt)) / 3600000) < 12 ? <PopupEditTx currentRowData={row} /> : <button className="btn bg-secondary text-white shadow disabled" aria-disabled="true" >Edit Disabled</button>}</td>
                                                    </tr>
                                                }
                                            })}


                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}

export default Home