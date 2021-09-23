import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Alert } from 'reactstrap';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class CreateClient extends Component {
    static displayName = CreateClient.name;

    constructor(props) {
        super(props);

        this.state = {
            clientName: '',
            success: undefined
        }

    }

    async componentDidMount() {
        const isAdmin = AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col>
                            <h3>Create Client</h3>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col xl='10' lg='10' md='10' sm='10' xs='10'>
                            <Input
                                type='text'
                                onChange={(e) => this.setState({ clientName: e.target.value })}
                                name='clientName'
                                id='clientName'
                                placeholder='Name'
                            />
                        </Col>
                        <Col xl='2' lg='2' md='2' sm='2' xs='2'>
                            <Button
                                color='primary'
                                onClick={() => this.createClient()}
                            >
                                Create
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            {this.state.success === true && (
                                <Alert color='success'>
                                    Client added successfully!
                                </Alert>
                            )}                            
                            {this.state.success === false && (
                                <Alert color='danger'>
                                    Error adding Client!
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    async createClient() {
        debugger
        const token = await authService.getAccessToken();
        const name = this.state.clientName;
        if(name) {
            const dto = {
                id: 0,
                name: name
            };
            const response = await fetch('api/Admin/AddClientAsync', {
                method: 'POST',
                body: JSON.stringify(dto),
                headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            this.setState({ success: data });
        }
    }
}