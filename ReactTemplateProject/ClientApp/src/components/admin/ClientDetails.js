import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Alert } from 'reactstrap';
import { RowItem } from '../layout/RowItem';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class ClientDetails extends Component {
    static displayName = ClientDetails.name;

    constructor(props) {
        super(props);

        this.state = {
            clientId: 0,
            clientName: '',
            success: undefined
        };

    }

    async componentDidMount() {
        const isAdmin = AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }        
        else {
            if(this.props.location.state !== undefined) {
                if(this.props.location.state.existingClient) {
                    const clientId = this.props.location.state.clientId;
                    this.setState({ clientId: clientId });
                    this.getClientDetails(clientId);
                }
            }
            else {
                this.props.history.push('/admin/clients/create');
            }
        }
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <RowItem>
                        <Col xl='12'>
                            <h3>Client Details</h3>
                        </Col>
                        <Col xl='12'>
                            <h6>Client Id: {this.state.clientId}</h6>
                        </Col>
                    </RowItem>
                    <RowItem>
                        <Col xl='12'>
                            <h6>Edit Client Name</h6>
                        </Col>    
                        <Col xl='10' lg='10' md='10' sm='10' xs='10'>
                            <Input
                                type='text'
                                value={this.state.clientName}
                                onChange={(e) => this.setState({ clientName: e.target.value })}
                                name='clientName'
                                id='clientName'
                                placeholder='Name'
                            />
                        </Col>
                        <Col xl='2' lg='2' md='2' sm='2' xs='2'>
                            <Button
                                color='primary'                          
                                onClick={() => this.editClient()}      
                            >
                                Save
                            </Button>
                        </Col>
                    </RowItem>                  
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            {this.state.success === true && (
                                <Alert color='success'>
                                    Client saved successfully!
                                </Alert>
                            )}                            
                            {this.state.success === false && (
                                <Alert color='danger'>
                                    Error saving Client!
                                </Alert>
                            )}
                        </Col>
                    </Row>                                       
                </Container>
            </div>
        )
    }

    async getClientDetails(clientId) {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/GetClientDetailsAsync?id=${clientId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({
            clientName: data.name
        });
    }

    async editClient() {
        const token = await authService.getAccessToken();
        const name = this.state.clientName;
        if(name) {
            const dto = {
                id: this.state.clientId,
                name: name
            };
            const response = await fetch('api/Admin/EditClientAsync', {
                method: 'POST',
                body: JSON.stringify(dto),
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            this.setState({ success: data });
        }
    }

}