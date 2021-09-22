import React, { Component } from 'react';
import { Container, Row, Col, Input, Table, Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class Users extends Component {
    static displayName = Users.name;

    constructor(props) {
        super(props);

        this.state = {
            users: [],
            search: null,
            clientOptions: [],
            client: null
        };

    }

    async componentDidMount() {
        const isAdmin = AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }
        this.getClientDropdown();
        this.getUsers();
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col>
                            <h3>Users</h3>
                        </Col>                        
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col xl='6'>
                            <Input
                                type='text'
                                onChange={(e) => this.setState({ search: e.target.value })}
                                name='search'
                                id='search'
                                placeholder='Search'
                            />
                        </Col>
                        <Col xs='4'>
                            <Typeahead
                                id='client'
                                onChange={(selected) => this.setState({ client: selected })}
                                selected={this.state.client}
                                options={this.state.clientOptions}
                                placeholder='Client'
                            />
                        </Col>
                        <Col xl='1'>
                            <Button
                                color='primary'
                                onClick={() => this.searchUsers()}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col xl='1'>
                            <Button
                                color='primary'
                                onClick={() => this.props.history.push({ pathname: '/admin/users/details', state: { hasUser: false }})}
                                style={{ whiteSpace: 'nowrap' }}
                            >
                                + Add
                            </Button>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <th>Last Name</th>
                                        <th>First Name</th>
                                        <th>Client</th>
                                        <th>Office Phone</th>
                                        <th>Email</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.users.map((user, i) => {
                                        return (
                                            <tr key={user.id}>
                                                <td>{user.lastName}</td>
                                                <td>{user.firstName}</td>
                                                <td></td>
                                                <td>{user.officePhone}</td>
                                                <td>{user.email}</td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </Table>
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

    async getUsers() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/GetUsersAsync`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ users: data });
    }

    async searchUsers() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/SearchUsersAsync?query=${this.state.search}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({ users: data });
    }

}