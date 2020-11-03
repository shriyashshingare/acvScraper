import React, { Component } from 'react';

//Material UI
import {
    Button,
    Avatar
} from '@material-ui/core';

// reactstrap components
import {
    Row,
    Col,
    Card,
    CardHeader,
    Table,
} from "reactstrap";

export class UsersTable extends Component {
    render() {
        const { Header, onClickHeaderButton, HeaderButtonName, tHeader, userData } = this.props;
        return (
            <div>
                <Col className="mb-12 mb-xl-0" md='12' xl="12">
                    <Card className="shadow max-dn-ht-500 hide-scroll-ind">
                        <CardHeader className="border-0">
                            <Row className="align-items-center">
                                <div className="col">
                                    <h3 className="mb-0">{Header}</h3>
                                </div>
                                {HeaderButtonName ?
                                    <div className="col text-right">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={onClickHeaderButton}
                                        >
                                            {HeaderButtonName}
                                        </Button>
                                    </div> :
                                    null
                                }
                            </Row>
                        </CardHeader>
                        <Table className="align-items-center table-flush" responsive>
                            <thead className="thead-light">
                                <tr>
                                    {tHeader.map((hdata, index) => (
                                        <th key={index} scope="col">{hdata.Header}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {userData.map((Tdata, index) => (
                                    <tr key={index}>
                                        <th scope="row">
                                            <div className="d-flex justify-content-around align-items-center">
                                                <Avatar src={Tdata.imageUrl ? Tdata.imageUrl : Tdata.userProfileImage} alt={Tdata.userName} />
                                            </div>
                                        </th>
                                        <td>{Tdata.userName}</td>
                                        <td>{Tdata.mail}</td>
                                        <td>{Tdata.Role}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card>
                </Col>
            </div>
        )
    }
}

export default UsersTable;
