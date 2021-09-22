import React, { Component } from 'react';
import { Container, Row, Col, Table, Button } from 'reactstrap';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class Roles extends Component {
    static displayName = Roles.name;

    constructor(props) {
        super(props);

        this.state = {
            roles: []
        };

    }

    async componentDidMount() {        
        const isAdmin = await AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }
        this.getRoles();
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col xl='10'>
                            <h3>Roles</h3>
                        </Col>
                        <Col xl='2'>
                            <Button
                                color='primary'
                                onClick={() => this.props.history.push('/admin/roles/create')}
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
                                    {this.state.roles.map((role, i) => {
                                        return (
                                            <tr
                                                key={role.id}
                                                onClick={() => this.handleRowClick(role.id)}
                                            >
                                                <td>{role.id}</td>
                                                <td>{role.name}</td>                                                
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

    async getRoles() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/GetRolesAsync`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ roles: data });
    }    

    handleRowClick(roleId) {
        this.props.history.push({
            pathname: '/admin/roles/details',
            state: { roleId: roleId, existingRole: true }
        });
    }

}