"use strict"
const React = require('react')
const usersService = require("../../services/users.service")
const clientService = require("../../services/client.profiles.service")
const authenticateService = require("../../services/authentication.service")

class Profile extends React.PureComponent {
    constructor(props, context) {
        super(props, context)

        this.state = {
            user: {},
            client: {}

        }
        this.currentUser = authenticateService.getCurrentUser()
    }

    componentWillReceiveProps(props) {
        clientService.readByUserId(props.urlParams.id)
        .then(response => {
            this.setState({
                client: response.item,
            })
            this.checkBioViewerIds()
        })
        .catch(err => {
            this.setState({
                noBio: "This User has not set up their Bio"
            })
            console.warn(err)
        })
        
        this.checkAdmin()

        usersService.readById(props.urlParams.id)
            .then(response => {
                this.setState({
                    user: response.item
                })
                this.checkSupporterIds()
            })
            .catch(err => console.warn(err))
    }

    componentDidMount() {
        
        clientService.readByUserId(this.props.urlParams.id)
        .then(response => {
            this.setState({
                client: response.item,
            })
            this.checkBioViewerIds()
        })
        .catch(err => {
            this.setState({
                noBio: "This User has not set up their Bio"
            })
            console.warn(err)
        })
        
        this.checkAdmin()

        usersService.readById(this.props.urlParams.id)
            .then(response => {
                this.setState({
                    user: response.item
                })
                this.checkSupporterIds()
            })
            .catch(err => console.warn(err))
    }

    checkBioViewerIds() {
        for (let i = 0; i < this.state.client.bioViewerIds.length; i++) {
            let bioViewerId = this.state.client.bioViewerIds[i]
            if (bioViewerId == this.currentUser.userId) {
                this.setState({
                    userMatched: true
                })
            }
            else {
                this.setState({
                    userMatched: false
                })
            }
        }
    }

    checkSupporterIds() {
        for (let i = 0; i < this.state.user.supporterIds.length; i++) {
            let supporterId = this.state.user.supporterIds[i]
            if (supporterId == this.currentUser.userId) {
                this.setState({
                    supporterMatched: true
                })
            }
            else {
                this.setState({
                    supporterMatched: false
                })
            }
        }
    }

    checkAdmin() {
        if (this.currentUser.userType == "Admin") {
            this.setState({
                admin: true
            })
        }
        else {
            this.setState({
                admin: false
            })
            
        }
    }


    render() {
        return (
            <div>
            <div className="profile-container">
                <div className="profile-section">
                    <div className="profile-left">
                        <div className="profile-image">
                            <img src={this.state.user.imageUrl} />
                            <i className="fa fa-user hide"></i>
                        </div>
                        <div className="profile-highlight">
                            <div className="text-center">
                                <h4>{this.state.user.username}'s Links</h4>
                                <div className="m-b-5 m-t-0">
                                    <i className="fa fa-book"><a href={"/journal/" + this.props.urlParams.id}> Journal</a></i>
                                </div>
                                <div className="m-b-5 m-t-o">
                                    <i className="fa fa-clock-o"><a href={"/timeline/" + this.props.urlParams.id}> Timeline</a></i>
                                </div>
                                {(this.currentUser.userType == "Therapist" || this.currentUser.userType == "Admin") && <div className="m-b-5 m-t-o">
                                    <i className="fa fa-info"><a href={"/profile/" + this.props.urlParams.id + "/intake-form"}> Intake Form</a></i>
                                </div>}
                            </div>
                        </div>
                    </div>
                    <div className="profile-right">
                        <div className="profile-info">
                            <div className="table-responsive">
                                <table className="table table-profile">
                                    <thead>
                                        <tr>
                                            <th></th>
                                            <th>
                                                <h4>
                                                    {this.state.user.username}
                                                    {(this.state.supporterMatched || this.state.admin) && <small>{this.state.user.firstName} {this.state.user.lastName}</small>}
                                                </h4>
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="highlight">
                                            <td className="field">User Type</td>
                                            <td>{this.state.user.userType}</td>
                                        </tr>
                                        <tr className="divider">
                                            <td colSpan="2"></td>
                                        </tr>
                                        {!this.state.client.isBioPublic && !this.state.userMatched && !this.state.admin && <tr>
                                            <td className="field">Bio</td>
                                            <td><i className="fa fa-lock"></i> This User's profile is set to private.</td>
                                        </tr>}
                                        {(this.state.client.isBioPublic || this.state.userMatched || this.state.admin) && <tr>
                                            <td className="field">Bio</td>
                                            <td>{this.state.client.bio}{this.state.noBio}</td>
                                        </tr>}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            </div>
        )
    }
}

module.exports = Profile