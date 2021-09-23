import React, { Component } from 'react';
import { Container, Row, Col, Input, Table, Button, Alert } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class UserDetails extends Component {
    static displayName = UserDetails.name;

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            userId: null,
            client: null,
            active: null,
            firstName: null,
            lastName: null,
            officePhone: null,
            ext: null,
            homePhone: null,
            mobilePhone: null,
            email: null,
            clientOptions: [],
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
                if(this.props.location.state.existingUser) {
                    const userId = this.props.location.state.userId;
                    this.setState({ userId: userId })
                    this.getUserDetails(userId);
                }                
            }
            else {
                this.props.history.push('/admin/roles/create');
            }
        }
        this.getClientDropdown();
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col>
                            <h3>User Details</h3>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col xs='6'>
                            <Typeahead
                                id='client'
                                onChange={(selected) => this.setState({ client: selected })}
                                selected={this.state.client}
                                options={this.state.clientOptions}
                                placeholder='Client'
                            />
                        </Col>
                        <Col xs='2' style={{ marginLeft: '20px' }}>
                            <Input
                                type='checkbox'
                                onChange={(e) => this.setState({ active: e.target.checked })}
                                checked={!!this.state.active}
                                name='active'
                            />
                            <label>Active</label>                            
                        </Col>                        
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='6'>
                            <Input
                                type='text'
                                value={this.state.firstName}
                                onChange={(e) => this.setState({ firstName: e.target.value })}
                                name='firstName'
                                id='firstName'
                                placeholder='First Name'
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='6'>
                            <Input
                                type='text'
                                value={this.state.lastName}
                                onChange={(e) => this.setState({ lastName: e.target.value })}
                                name='lastName'
                                id='lastName'
                                placeholder='Last Name'
                            />
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='4'>
                            <Input
                                type='tel'
                                value={this.state.officePhone}
                                onChange={(e) => this.setState({ officePhone: e.target.value })}
                                name='officePhone'
                                id='officePhone'
                                placeholder='Office Phone'
                            />    
                        </Col>    
                        <Col xs='2'>
                            <Input
                                type='text'
                                value={this.state.ext}
                                onChange={(e) => this.setState({ ext: e.target.value })}
                                name='ext'
                                id='ext'
                                placeholder='Ext.'
                            />
                        </Col>
                    </Row>    
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='4'>
                            <Input
                                type='tel'
                                value={this.state.homePhone}
                                onChange={(e) => this.setState({ homePhone: e.target.value })}
                                name='homePhone'
                                id='homePhone'
                                placeholder='Home Phone'
                            />    
                        </Col>                            
                    </Row>                
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='4'>
                            <Input
                                type='tel'
                                value={this.state.mobilePhone}
                                onChange={(e) => this.setState({ mobilePhone: e.target.value })}
                                name='mobilePhone'
                                id='mobilePhone'
                                placeholder='Mobile Phone'
                            />    
                        </Col>                            
                    </Row>        
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='6'>
                            <Input
                                type='email'
                                value={this.state.email}
                                onChange={(e) => this.setState({ email: e.target.value })}
                                name='email'
                                id='email'
                                placeholder='Email'
                            />    
                        </Col>                            
                    </Row>        
                    <Row style={{ marginTop: '20px' }}>
                        <Col xs='6'>
                            <Button
                                color='primary'
                                style={{ marginLeft: '50%', marginRight: '50%' }}
                                onClick={() => this.handleSave()}
                            >
                                Save
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            {this.state.success === true && (
                                <Alert color='success'>
                                    {this.state.userId ? 'User updated successfully!' : 'User added successfully!'}
                                </Alert>
                            )}                            
                            {this.state.success === false && (
                                <Alert color='danger'>
                                    {this.state.userId ? 'Error updating User!' : 'Error adding User!'}
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    async getClientDropdown() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Clients/GetDropdown`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ clientOptions: data });
    }
    
    async getUserDetails(userId) {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/GetUserDetailsAsync?id=${userId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            officePhone: data.officePhone,
            ext: data.ext,
            homePhone: data.homePhone,
            mobilePhone: data.mobilePhone,
            active: data.active
        });
    }

    async handleSave() {
        const token = await authService.getAccessToken();
        const dto = {
            id: this.state.userId,
            firstName: this.state.firstName,
            lastName: this.state.lastName,
            email: this.state.email,
            officePhone: this.state.officePhone,
            ext: this.state.ext,
            homePhone: this.state.homePhone,
            mobilePhone: this.state.mobilePhone,
            active: this.state.active
        }
        if(this.state.userId) {            
            await this.editUser(dto, token);
        }
    }

    async editUser(dto, token) {
        const response = await fetch('api/Admin/EditUserAsync', {
            method: 'POST',
            body: JSON.stringify(dto),
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
        });
        const data = await response.json();
        this.setState({ success: data });
    }
}