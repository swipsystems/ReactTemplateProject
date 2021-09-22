import React, { Component } from 'react';
import { Container, Row, Col, Input, Button, Alert } from 'reactstrap';
import authService from '../api-authorization/AuthorizeService';

export class CreateRole extends Component {
    static displayName = CreateRole.name;

    constructor(props) {
        super(props);

        this.state = {
            roleName: '',
            success: undefined
        };

    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col>
                            <h3>Create Role</h3>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col xl='10'>
                            <Input
                                type='text'
                                onChange={(e) => this.setState({ roleName: e.target.value })}
                                name='roleName'
                                id='roleName'
                                placeholder='Role Name'
                            />
                        </Col>
                        <Col xl='2'>
                            <Button
                                color='primary'
                                onClick={() => this.createRole()}
                            >
                                Create
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            {this.state.success === true && (
                                <Alert color='success'>
                                    Role added successfully!
                                </Alert>
                            )}                            
                            {this.state.success === false && (
                                <Alert color='danger'>
                                    Error adding role!
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    async createRole() {        
        debugger
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/CreateRoleAsync?roleName=${this.state.roleName}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ success: data });
    }

}