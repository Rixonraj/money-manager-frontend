import React from 'react'
import './LoginStyle.css'
import '../../node_modules/bootstrap/dist/css/bootstrap.css'
import appLogo from '../assets/appLogo.jpeg'
import {useFormik} from "formik"
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
function Register() {
    const navigate = useNavigate()
    const registerForm = useFormik({
        initialValues : {
            username : "",
            password : ""
        },
        onSubmit : async (values) => {
            console.log(values)
            try {
               const user = await axios.post(`${process.env.REACT_APP_BACKENDURL}/user/register`,values)
               if(user.data.message === "Success ceated"){
                navigate("/")
               }else{
                alert(user.data.message)
               }
            } catch (error) {
                alert(error.data.message)  
            }
        }
    })
    return (

        <section className="h-100 gradient-form" style= {{backgroundColor : "#eee"}}>
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-xl-10">
                        <div className="card rounded-3 text-black">
                            <div className="row g-0">
                                <div className="col-lg-12">
                                    <div className="card-body p-md-5 mx-md-4">

                                        <div className="text-center">
                                            <img src={appLogo}
                                                style={{width: "185px" }}alt="logo" />
                                            <h4 className="mt-1 mb-5 pb-1">Money Manager</h4>
                                        </div>

                                        <form onSubmit={registerForm.handleSubmit}>
                                            <p>Create a New Account !</p>

                                            <div className="form-outline mb-4">
                                                <input type="email"
                                                name = "username"
                                                onChange={registerForm.handleChange}
                                                value={registerForm.values.username}
                                                id="form2Example11" className="form-control"
                                                    placeholder="Phone number or email address" />
                                                <label className="form-label" htmlFor="form2Example11">Username</label>
                                            </div>

                                            <div className="form-outline mb-4">
                                                <input type="password"
                                                name = "password"
                                                onChange={registerForm.handleChange}
                                                value={registerForm.values.password}
                                                id="form2Example22" className="form-control" />
                                                <label className="form-label" htmlFor="form2Example22">Password</label>
                                            </div>

                                            <div className="text-center pt-1 mb-5 pb-1">
                                                <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-2" type={"submit"}>Register</button>
                                                    <br/>
                                                    <p className='mb-2'>OR</p>
                                                    <br/>
                                                    <Link to={`/`}className="btn  btn-outline-danger">Sign in</Link>

                                            </div>

                                          

                                        </form>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>

    )
}

export default Register