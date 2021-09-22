import React, { Component } from 'react';
import { Container, Row, Col, Input, Table, Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class Clients extends Component {
    static displayName = Clients.name;

    constructor(props) {
        super(props);

        this.state = {
            search: null,
            clients: []
        };

    }

    async componentDidMount() {
        const isAdmin = AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }
        this.getClients();
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col>
                            <h3>Clients</h3>
                        </Col>
                    </Row>
                    <Row style={{ marginTop: '20px' }}>
                        <Col xl='10'>
                            <Input
                                type='text'
                                onChange={(e) => this.setState({ search: e.target.value })}
                                name='search'
                                id='search'
                                placeholder='Search'
                            />
                        </Col>
                        <Col xl='1'>
                            <Button
                                color='primary'
                                onClick={() => this.searchClients()}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col xl='1'>
                            <Button
                                color='primary'
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
                                        <th>Id</th>
                                        <th>Name</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.state.clients.map((client,  i) => {
                                        return (
                                            <tr key={client.id}>
                                                <td>{client.id}</td>
                                                <td>{client.name}</td>
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

    async getClients() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Clients/GetClients`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({ clients: data });
    }

    async searchClients() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Clients/SearchClients?query=${this.state.search}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}`}
        });
        const data = await response.json();
        this.setState({ clients: data });
    }
}