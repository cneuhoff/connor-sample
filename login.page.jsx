"use strict"
const React = require('react')
const loginService = require('../../services/users.service')
const ClientProfileService = require('../../services/client.profiles.service')
const authenticationService = require('../../services/authentication.service')


class Login extends React.Component {
    constructor(props, context) {
        super(props, context)

        this.changeUsername = this.changeUsername.bind(this)
        this.changePassword = this.changePassword.bind(this)
        this.onSubmit = this.onSubmit.bind(this)

        this.state = {
            username: '',
            password: '',
            submitted: false
        }
    }

    changeUsername(e) {
        const target = e.target.value
        this.setState({ username: target })
    }

    changePassword(e) {
        const target = e.target.value
        this.setState({ password: target })
    }

    componentDidMount() {

    }

    onSubmit(e) {
        e.preventDefault()
        if (!this.formElement.checkValidity()) {
            this.setState({ submitted: true })
        }
        else {
            this.setState({ submitted: true })
            const { username, password } = this.state

            loginService.login({ username, password })
                .then(user => {
                    return authenticationService.getCurrentUser()
                })
                .then(currentUser => {
                    switch (currentUser.userType) {
                        case "Admin":
                            this.props.angularUrl("/admin/users/list")
                            break;
                        case "Client":
                            ClientProfileService.readByUserId(currentUser.userId)
                                .then(match => {
                                    this.props.angularUrl("/my-journal")

                                })
                                .catch(error => {
                                    this.props.angularUrl(`${currentUser.userId}/profile/create`)
                                })
                            break;
                        case "Therapist":
                            this.props.angularUrl("/my-clients")
                            break;
                        case "Supporter":
                            this.props.angularUrl("/supporter")
                    }
                })
                .catch(error => {
                    alert("Invalid Username or Password")
                    console.log(error)
                })

        }
    }

    render() {
        return (
            <div>
                <div className="dzsparallaxer auto-init height-is-based-on-content mode-scroll dzsprx-readyall" data-options="{direction: &quot;reverse&quot;}">
                    <div className="divimage dzsparallaxer--target " style={{ width: '101%', height: '130%', backgroundImage: "url('/theme-versa/images/')", transform: 'translate3d(0px, -2.69882px, 0px)' }}>
                    </div>
                    <div className="container pt100">
                        <div className="row">
                            <div className="col-md-8 ml-auto mr-auto wow bounceIn" data-wow-delay=".2s" style={{ visibility: 'visible', animationDelay: '0.2s', animationName: 'bounceIn' }}>
                                <h3 className="h3 mb30 text-center pt100 pb100 font300 text-white">Login</h3>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container pb50 pt50-md">
                    <div className="row">
                        <div className="col-md-6 col-lg-5 mr-auto ml-auto">
                            <div className="card card-account">
                                <div className="card-body">
                                    <form className={"needs-validation " + (this.state.submitted ? "was-validated" : "")} noValidate ref={ref => this.formElement = ref} onSubmit={this.onSubmit} >
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="username">Username</label>
                                            <input ref={ref => this.usernameElement = ref} id="username" name="username" onChange={this.changeUsername} type="text" className="form-control" placeholder="Johnsmith007" minLength="5" maxLength="18" required />
                                            {this.state.submitted && this.usernameElement && !this.usernameElement.validity.valid && <div className="invalid-feedback">Username is required</div>}
                                        </div>
                                        <div className="form-group">
                                            <label className="control-label" htmlFor="password">Password</label>
                                            <input ref={ref => this.passwordElement = ref} id="password" name="password" onChange={this.changePassword} type="password" className="form-control" placeholder="......" minLength="6" maxLength="24" required />
                                            {this.state.submitted && this.passwordElement && !this.passwordElement.validity.valid && <div className="invalid-feedback">Password is required</div>}
                                        </div>
                                        <div className="form-group">
                                            <button type="submit" className="btn btn-block btn-secondary btn-rounded btn-xl">Login</button>
                                        </div>
                                    </form>
                                    <hr />
                                    <p className="mb0 text-small">Dont' have an account? <a href="/anon/registration" className="btn btn-underline">Sign Up</a></p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}


module.exports = Login