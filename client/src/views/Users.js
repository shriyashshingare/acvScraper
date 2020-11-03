import React from "react";

//Material UI
import {
    TextField
} from '@material-ui/core/';

// reactstrap components
import {
    Container,
    Alert
} from "reactstrap";

// core components

import Header from "../components/Headers/Header.js";
import DialogBox from '../components/DialogBox/DialogBox';
import UsersTable from "../components/Tables/UsersTable.js";


//API's
//import { organizationAPI, VerifyUserInvite } from './CRM_Apis';

//Temp Data

let userData = []

const headerData = [
    { "Header": "Profile" },
    { "Header": "Name" },
    { "Header": "E-mail" },
    { "Header": "Permissions" },
];

class Users extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            Dialog_open_close: false,
            Alert_open_close: false,
            title: '',
            message: '',
            AlertColor: '',
            UserEmail: '',
            invalidEmail: false
        };
    }

    handleClickOpen = () => {
        this.setState({ Dialog_open_close: true });
    };

    handleClose = () => {
        this.setState({ Dialog_open_close: false });
    };

    onChangeText = (text) => {
        const Regex = new RegExp(/^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i)
        const result = Regex.test(text);
        this.setState({ UserEmail: text });
        if (text.length > 0) {
            if (result) {
                this.setState({ invalidEmail: false })
            } else {
                console.log("Error invalid data");
                this.setState({ invalidEmail: true })
            }
        }

    }

    onInviteSend = (type) => {
        const title = type === "success" ? "Success" : "Error"
        const message = type === "success" ? "Invitition has been sent to the user" : "User's Email is invalid";
        this.setState({ title, message, Alert_open_close: true, AlertColor: type });
        if (this.state.invalidEmail === false && type === "success") {
            this.SendInviteHandle()
            this.handleClose();
        }
    }


    // SendInviteHandle = async () => {
    //     let title = "Error";
    //     let message = '';
    //     let CRM_Token = await localStorage.getItem('CRM_Token_Value');
    //     try {
    //         const UserInviteFetch = await fetch(VerifyUserInvite, {
    //             method: "POST",
    //             headers: {
    //                 'Accept': 'application/json',
    //                 'Content-Type': 'application/json',
    //                 'Authorization': `${CRM_Token}`
    //             },
    //             body: JSON.stringify({
    //                 method: 'invite',
    //                 useremail: this.state.UserEmail
    //             })
    //         });
    //         let responseData = await UserInviteFetch.json();

    //         if (responseData.success) {
    //             message = responseData.message;
    //             title = 'Success'
    //             this.setState({ title, message, Alert_open_close: true });
    //         }
    //         else {
    //             message = responseData.message;
    //             title = 'Error'
    //             this.setState({ title, message, Alert_open_close: true });
    //         }
    //     }
    //     catch (err) {
    //         console.log("Error fetching data-----------", err.toString());
    //         this.setState({ title, message: err.toString(), Alert_open_close: true });
    //     }
    // }

    onDismissAlert = () => {
        this.setState({ Alert_open_close: false });
    }

    // getUserData = async () => {
    //     userData = []
    //     this.jwtToken = await localStorage.getItem('CRM_Token_Value');

    //     const getAllMembers = await fetch(organizationAPI, {
    //         method: "POST",
    //         headers: {
    //             'Accept': 'application/json',
    //             'Content-Type': 'application/json',
    //             'Authorization': `${this.jwtToken}`
    //         },
    //         body: JSON.stringify({
    //             method: 'members'
    //         })
    //     });
    //     const response = await getAllMembers.json();

    //     let responseData = response.data

    //     for (let i = 0; i < responseData.length; i++) {
    //         let data = responseData[i]

    //         userData.push({
    //             userName: data.name,
    //             Role: data.isAdmin,
    //             mail : data.email,
    //             imageUrl: data.userProfileImage,
    //         })
    //     }

    //     this.setState(userData)
    // }

    componentDidMount = async () => {
        // await this.getUserData()
    }

    render() {
        const { Dialog_open_close, title, message, Alert_open_close, AlertColor, UserEmail, invalidEmail } = this.state;
        const AlertError =
            (
                <div>
                    <Alert isOpen={Alert_open_close} toggle={() => this.onDismissAlert()} color={AlertColor} >
                        <h4 className="alert-heading">
                            {title}
                        </h4>
                        {message}
                    </Alert>
                </div>
            );
        return (
            <>
                <Header />
                {/* Page content */}
                <Container className="mt--7" fluid>
                    <div class="input-daterange datepicker row align-items-center">
                        <div class="col">
                            <div class="form-group">
                                <div class="input-group input-group-alternative">
                                    <div class="input-group-prepend">
                                        <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                                    </div>
                                    <input class="form-control" placeholder="Start date" type="text" value="06/18/2020"></input>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="col">
                        <div class="form-group">
                            <div class="input-group">
                                <div class="input-group-prepend">
                                    <span class="input-group-text"><i class="ni ni-calendar-grid-58"></i></span>
                                </div>
                                <input class="form-control" placeholder="End date" type="text" value="06/22/2020"></input>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-12 justify-content-center">
                        {AlertError}
                        <UsersTable
                            Header={'Users'}
                            onClickHeaderButton={() => this.handleClickOpen()}
                            HeaderButtonName={'Invite User'}
                            userData={userData}
                            tHeader={headerData}
                        />
                    </div>
                </Container>
                <DialogBox
                    disableBackdropClick={true}
                    DialogHeader={"Invite User"}
                    DialogContentTextData={" To Add Users to this Organization, please enter users email address here. We will send updates occasionally."}
                    DialogButtonText1={"Cancel"}
                    DialogButtonText2={"Invite"}
                    onClose={this.handleClose}
                    onOpen={Dialog_open_close}
                    OnClick_Bt1={this.handleClose}
                    Variant={"text"}
                    OnClick_Bt2={UserEmail.length < 1 ? () => this.onInviteSend("danger") : () => this.onInviteSend("success", "close")}
                >
                    <TextField
                        error={invalidEmail ? true : false}
                        autoFocus
                        margin="dense"
                        id="name"
                        label="Email Address"
                        type="email"
                        required={true}
                        helperText={invalidEmail ? "Incorrect entry." : null}
                        value={UserEmail}
                        autoComplete="section-blue shipping address-level2"
                        onChange={(e) => this.onChangeText(e.target.value)}
                        fullWidth
                    />
                </DialogBox>
            </>
        );
    }
}

export default Users;
