import React, { Component } from 'react';
import { Container, Row, Col, Input, Table, Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class UserDetails extends Component {
    static displayName = UserDetails.name;

    constructor(props) {
        super(props);

        this.state = {
            user: {},
            client: null,
            active: null,
            firstName: null,
            lastName: null,
            officePhone: null,
            officeExt: null,
            homePhone: null,
            mobilePhone: null,
            email: null,
            clientOptions: []
        };

    }

    async componentDidMount() {
        const isAdmin = AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
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
                            <Typeahead id='client' onChange={(selected) => this.setState({ client: selected })} selected={this.state.client} options={this.state.clientOptions} placeholder='Client'/>
                        </Col>
                        <Col xs='2' style={{ marginLeft: '20px' }}>
                            <Input type='checkbox' onChange={(e) => this.setState({ active: e.target.checked })} checked={!!this.state.active} name='active'/>
                            <label>Active</label>                            
                        </Col>                        
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='6'>
                            <Input type='text' value={this.state.firstName} onChange={(e) => this.setState({ firstName: e.target.value })} name='firstName' id='firstName' placeholder='First Name'/>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='6'>
                            <Input type='text' value={this.state.lastName} onChange={(e) => this.setState({ lastName: e.target.value })} name='lastName' id='lastName' placeholder='Last Name'/>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='4'>
                            <Input type='tel' onChange={(e) => this.setState({ officePhone: e.target.value })} name='officePhone' id='officePhone' placeholder='Office Phone'/>    
                        </Col>    
                        <Col xs='2'>
                            <Input type='text' onChange={(e) => this.setState({ officeExt: e.target.value })} name='officeExt' id='officeExt' placeholder='Ext.'/>
                        </Col>
                    </Row>    
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='4'>
                            <Input type='tel' onChange={(e) => this.setState({ homePhone: e.target.value })} name='homePhone' id='homePhone' placeholder='Home Phone'/>    
                        </Col>                            
                    </Row>                
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='4'>
                            <Input type='tel' onChange={(e) => this.setState({ mobilePhone: e.target.value })} name='mobilePhone' id='mobilePhone' placeholder='Mobile Phone'/>    
                        </Col>                            
                    </Row>        
                    <Row style={{ marginTop: '10px' }}>
                        <Col xs='6'>
                            <Input type='email' onChange={(e) => this.setState({ email: e.target.value })} name='email' id='email' placeholder='Email'/>    
                        </Col>                            
                    </Row>        
                    <Row style={{ marginTop: '20px' }}>
                        <Col xs='6'>
                            <Button color='primary' style={{ marginLeft: '50%', marginRight: '50%' }}>Save</Button>
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
}