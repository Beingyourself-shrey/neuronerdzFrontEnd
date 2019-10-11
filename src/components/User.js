import React from 'react'
import { Redirect, Link } from 'react-router-dom'

import SideNav from './sideNav';
import Axios from 'axios';
import url from './url';
export default class User extends React.Component {
    state = {
        users: "",
        err: "",
        formValid: {
            name: true,
            emailId: true
        },
        formErr: {
            name: "",
            emailId: ""
        }
    }
    componentDidMount() {
        Axios.get(url + 'getUserByUserName/' + this.props.match.params.username).then(success => {
            this.setState({ users: success.data.data, err: "" })
        }).catch(error => {
            if (error.response)
                this.setState({ users: "", err: error.response.data.message })
            else
                this.setState({ users: "", err: error.message })

        })
    }
    changeHander = (e) => {
        let user = this.state.users;
        user[e.target.name] = e.target.value
        this.setState({ users: user })
        this.validate(e.target.name, e.target.value)

    }
    validate(name, value) {
        let formErr = this.state.formErr;
        let formValid = this.state.formValid;
        switch (name) {
            case "emailId":
                if (!value) {
                    formValid.emailId = false;
                    formErr.emailId = "Please Enter Mail id"
                }
                else if (!value.match(/[a-zA-Z._0-9]+\@[a-zA-Z]+\.[a-zA-Z]{2,4}/)) {
                    formValid.emailId = false;
                    formErr.emailId = "Please Enter Correct Mail id"
                }
                else {
                    formValid.emailId = true;
                    formErr.emailId = ""
                }
                break;
            case "name":
                if (!value) {
                    formValid.name = false;
                    formErr.name = "Please Enter Name"
                }
                else if (value.match(/[@!#$%^&*()]/)) {
                    formValid.name = false;
                    formErr.name = "Please Name without Special character"
                }
                else{
                    formValid.name = true;
                    formErr.name = ""
                }
                    break;
            default:
                break;

        }
    }
    submitHandler=(e)=>{
        e.preventDefault();
        Axios.put('/')

    }
    
    render() {
        let userData = JSON.parse(sessionStorage.getItem("userData"))
        if (userData)
            return (
                <React.Fragment>
                    <SideNav />

                    <div className="container mt-10">
                        {JSON.stringify(this.state)}
                        <article className="row justify-content-center">
                            <section className="col-md-6 col-lg-4">
                                <form className="form-login" onSubmit={this.submitHandler}>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Username"
                                            className="form-control"
                                            name="userName"
                                            value={this.state.users.userName}
                                            onChange={this.changeHander}
                                            disabled="true"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Name"
                                            className="form-control"
                                            name="name"
                                            value={this.state.users.name}
                                            onChange={this.changeHander}

                                        />
                                    </div>
                                    <div className="form-group">
                                        <input
                                            type="text"
                                            placeholder="Email Id"
                                            className="form-control"
                                            name="emailId"
                                            value={this.state.users.emailId}
                                            onChange={this.changeHander}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <select name="userPermission" className="form-control" onChange={this.changeHander}>
                                            <option value="admin" selected={"admin" === this.state.users.userPermission}>Admin</option>
                                            <option value="editor" selected={"editor" === this.state.users.userPermission}>Editor</option>
                                            <option value="author" selected={"author" === this.state.users.userPermission}>Author</option>
                                            <option value="spectator" selected={"spectator" === this.state.users.userPermission}>Spectator</option>

                                        </select>
                                    </div>
                                    <button type="submit"
                                        disabled={!(this.state.formValid.name && this.state.formValid.emailId)}
                                        className="btn btn-warning form-control">
                                        Update
                                    </button>
                                    <br/><br/>
                                    <button 
                                        className="btn btn-danger form-control">
                                        Delete
                                    </button>

                                </form>
                            </section>
                        </article>
                    </div>

                </React.Fragment>
            )
        return (
            <Redirect to={'/admin/login'} />
        )
    }
}