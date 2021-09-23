import React, { Component } from 'react';
import { Container, Row, Col, Input, Table, Button } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';
import utilities from '../util/utilities';

export class Clients extends Component {
    static displayName = Clients.name;

    constructor(props) {
        super(props);

        this.state = {
            search: null,
            clients: [],
            height: 0,
            width: 0
        };

        window.addEventListener('resize', this.setWindowDimensions);        
    }

    async componentDidMount() {
        const isAdmin = AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }
        this.setWindowDimensions();
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
                        <Col xl='10' lg='10' md='12' sm='12' xs='12'>
                            <Input
                                type='text'
                                onChange={(e) => this.setState({ search: e.target.value })}
                                name='search'
                                id='search'
                                placeholder='Search'
                                style={ this.state.width < utilities.dimensions.LG ? { marginBottom: '20px' } : {}}
                            />
                        </Col>
                        <Col xl='1' lg='1' md='2' sm='2' xs='2'>
                            <Button
                                color='primary'
                                onClick={() => this.searchClients()}
                            >
                                Search
                            </Button>
                        </Col>
                        <Col xl='1' lg='1' md='2' sm='2' xs='2'>
                            <Button
                                color='primary'
                                style={{ whiteSpace: 'nowrap' }}
                                onClick={() => this.props.history.push('/admin/clients/create')}
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
                                            <tr
                                                key={client.id}
                                                onClick={() => this.handleRowClick(client.id)}
                                            >
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

    handleRowClick(clientId) {
        this.props.history.push({
            pathname: '/admin/clients/details',
            state: { clientId: clientId, existingClient: true }
        });
    }

    setWindowDimensions = () => {
        this.setState({
            height: window.innerHeight,
            width: window.innerWidth
        });
    };
}