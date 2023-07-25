import axios from 'axios';
import { useFormik, useFormikContext } from 'formik';
import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useParams } from 'react-router-dom';
import Popup from 'reactjs-popup';
import { values } from 'underscore';
// import './popup.css'
// import '../../node_modules/reactjs-popup/dist/index.css';

function PopupEditTx(props) {
    const params = useParams()
    const [closePopup, setclosePopup] = useState();
    const [transDate, settransDate] = useState();
    const [transactionType, settransactionType] = useState(props.currentRowData.txType);
    const addTransaction = useFormik({
        initialValues: {
            txType: props.currentRowData.txType,
            txDescription: props.currentRowData.txDescription,
            txDate: Date.parse(props.currentRowData.txDate),
            txCategory: props.currentRowData.txCategory,
            txDivision: props.currentRowData.txDivision,
            txAmount: props.currentRowData.txAmount,
            txId: props.currentRowData._id
        },
        validate: (values) => {
            let error = {};
            if (values.txAmount.toString() === "") {
                error.txAmount = "Please enter valid Transaction Amount"
            }
            if (values.txAmount === 0) {
                error.txAmount = "Please enter valid Transaction Amount"
            }
            if (values.txDescription === "") {
                error.txDescription = "Please enter valid Description"
            }
            if (values.txCategory === "") {
                error.txCategory = "Please enter valid Category"
            }
            if (values.txDivision === "") {
                error.txDivision = "Please enter valid Division"
            }
            return error;
        },
        onSubmit: async (values) => {
            try {
                console.log("values", values)
                console.log("props.currentRowData", props.currentRowData)
                const transaction = await axios.put(`${process.env.REACT_APP_BACKENDURL}/edit_transaction_detail/${params.userid}`,
                    { values },
                    {
                        headers: {
                            "Authorization": localStorage.getItem("myreact")
                        }
                    }
                );
                console.log(transaction.data)
                setclosePopup(false);
            }
            catch (error) {
                console.log("ERROR:", error)
                alert(error.response.data.message)
            }

        }
    })








    return (
        <Popup
            trigger={

                
                    <button className="btn bg-success text-white shadow " > Edit Transaction</button>

          
            }
            onOpen={() => { addTransaction.resetForm(); setclosePopup(true); }}
            open={closePopup}
        >
            {close => (
                <div className="modal modal-dialog-centered">

                    <div className={`card shadow mb-4 popupcard ${transactionType === "Income" ? 'border-left-success' : 'border-left-primary'}`}>
                        <div className="card-header py-3 d-flex flex-row align-items-center justify-content-between">
                            <h6 className={`m-0 font-weight-bold ${transactionType === "Income" ? 'text-success' : 'text-primary'} `}>
                                Add {transactionType} Transaction</h6> </div>
                        <button className="close popupClose" onClick={close}>
                            &times;
                        </button>
                        <div className="content">
                            <form onSubmit={addTransaction.handleSubmit}>

                                <div className="card-header py-3 d-flex flex-row align-items-center">
                                    <div className='col-xl-6'>
                                        <button className='col-xl-12 btn btn-success' id="income" type='button' name="txType" onClick={e => { settransactionType(e.target.value); addTransaction.values.txType = (e.target.value) }} value="Income" >Income</button>
                                        {/* <label for="income">Income</label> */}
                                    </div>
                                    <div className='col-xl-6'>
                                        <button className='col-xl-12 btn btn-primary' id="expense" type='button' name="txType" onClick={e => { settransactionType(e.target.value); addTransaction.values.txType = (e.target.value) }} value="Expense" >Expense</button>
                                        {/* <label for="expense">Expense</label> */}

                                    </div>
                                </div>
                                <br />
                                <div className='d-flex flex-row mb-3'>
                                    <label className={`${transactionType === "Income" ? 'text-success' : 'text-primary'} col-xl-1`} for="txDate">Date</label>
                                    <span className='col-xl-6' style={{width:'100%'}}>
                                        <DatePicker
                                            closeOnScroll={(e) => e.target === document}
                                            selected={ addTransaction.values.txDate } onChange={(date) => { addTransaction.values.txDate = new Date(date) }}
                                            showDateMonthYearPicker
                                            dateFormat="dd/MM/yyyy"
                                            className="form-control max-width"
                                            id='txDate'
                                            name='txDate'
                                        /></span>
                                </div>

                                <div className='d-flex flex-row mb-3'>

                                    <label className={`${transactionType === "Income" ? 'text-success' : 'text-primary'} col-xl-1`} for="dropdownMenuButton">Category</label>
                                    <select
                                        name='txCategory'
                                        id="dropdownMenuButtontxCategory"
                                        onChange={addTransaction.handleChange}
                                        onBlur={addTransaction.handleBlur}
                                        value={addTransaction.values.txCategory}
                                        className={`col-xl-6 show form-control ${addTransaction.touched.txCategory && addTransaction.errors.txCategory ? "border-danger" : ""} ${addTransaction.touched.txCategory && !addTransaction.errors.txCategory ? "border-secondary" : ""}`}
                                    >
                                        <option disabled> </option>
                                        <option>Fuel</option>
                                        <option>Movie</option>
                                    </select>
                                    {
                                        addTransaction.touched.txCategory && addTransaction.errors.txCategory ? <><br /> <span style={{ color: 'red' }}>{addTransaction.errors.txCategory}</span> </> : null
                                    }
                                </div>

                                <div className='d-flex flex-row mb-3'>

                                    <label className={`${transactionType === "Income" ? 'text-success' : 'text-primary'} col-xl-1`} for="dropdownMenuButton">Division</label>
                                    <select
                                        name='txDivision'
                                        id="dropdownMenuButtontxDivision"
                                        onChange={addTransaction.handleChange}
                                        onBlur={addTransaction.handleBlur}
                                        value={addTransaction.values.txDivision}
                                        className={`col-xl-6 show form-control ${addTransaction.touched.txDivision && addTransaction.errors.txDivision ? "border-danger" : ""} ${addTransaction.touched.txDivision && !addTransaction.errors.txDivision ? "border-secondary" : ""}`}
                                    >
                                        <option disabled> </option>
                                        <option>Office</option>
                                        <option>Personal</option>
                                    </select>
                                    {
                                        addTransaction.touched.txDivision && addTransaction.errors.txDivision ? <><br /> <span style={{ color: 'red' }}>{addTransaction.errors.txDivision}</span> </> : null
                                    }
                                </div>

                                <div className='d-flex flex-row mb-3'>
                                    <p className={`${transactionType === "Income" ? 'text-success' : 'text-primary'} col-xl-1`} for="txAmount">Amount</p>
                                    <br />
                                    <input type={'number'}
                                        name="txAmount"
                                        id='txAmount'
                                        onChange={addTransaction.handleChange}
                                        onBlur={addTransaction.handleBlur}
                                        value={addTransaction.values.txAmount}
                                        className={`col-xl-6 show form-control ${addTransaction.touched.txAmount && addTransaction.errors.txAmount ? "border-danger" : ""} ${addTransaction.touched.txAmount && !addTransaction.errors.txAmount ? "border-secondary" : ""}`}
                                    />

                                    {
                                        addTransaction.touched.txAmount && addTransaction.errors.txAmount ? <><br /> <span style={{ color: 'red' }}>{addTransaction.errors.txAmount}</span> </> : null
                                    }
                                </div>

                                <div className='d-flex flex-row mb-3'>
                                    <p className={`${transactionType === "Income" ? 'text-success' : 'text-primary'} col-xl-1`} for="txAmount">Description</p>
                                    <br />
                                    <input type={'text'}
                                        name="txDescription"
                                        id='txDescription'
                                        onChange={addTransaction.handleChange}
                                        onBlur={addTransaction.handleBlur}
                                        value={addTransaction.values.txDescription}
                                        className={`col-xl-6 show form-control ${addTransaction.touched.txDescription && addTransaction.errors.txDescription ? "border-danger" : ""} ${addTransaction.touched.txDescription && !addTransaction.errors.txDescription ? "border-secondary" : ""}`}
                                    />

                                    {
                                        addTransaction.touched.txDescription && addTransaction.errors.txDescription ? <><br /> <span style={{ color: 'red' }}>{addTransaction.errors.txDescription}</span> </> : null
                                    }
                                </div>



                                <br />

                                <div style={{ display: 'flex' }} >
                                    <button className={`btn ${transactionType === "Income" ? 'btn-success' : ' btn-primary '}`} style={{ marginLeft: 'auto', marginRight: '10px', marginBottom: '10px' }} type={"submit"}>Add {transactionType}</button>
                                </div>

                            </form>
                        </div>
                    </div>


                </div>
            )}
        </Popup>

    )
}

export default PopupEditTx