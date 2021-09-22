import React, { Component } from 'react';
import { Container, Row, Col, Input, Table, Button, Collapse, Alert } from 'reactstrap';
import { Typeahead } from 'react-bootstrap-typeahead';
import { RowItem } from '../layout/RowItem';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class RoleDetails extends Component {
    static displayName = RoleDetails.name;

    constructor(props) {
        super(props);

        this.state = {
            roleId: '',
            roleName:'',
            addPool: [],
            removePool: [],
            addUser: null,
            removeUser: null,
            showAddSection: false,
            showRemoveSection: false,
            success: undefined
        };

    }

    async componentDidMount() {
        const isAdmin = await AdminFunctions.isAdminAsync();
        if(!isAdmin) {
            this.props.history.push('/accessdenied');
        }
        else {
            if(this.props.location.state !== undefined) {
                if(this.props.location.state.existingRole) {
                    const roleId = this.props.location.state.roleId;
                    this.setState({ roleId: roleId })
                    this.getRoleDetails(roleId);
                }                
            }
            else {
                this.props.history.push('/admin/roles/create');
            }
        }        
    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <RowItem>     
                        <Col xl='12'>
                            <h3>Role Details</h3>
                        </Col>          
                        <Col xl='8'>
                            <h6>Role Id: {this.state.roleId}</h6>
                        </Col>         
                        <Col xl='4'>
                            <Button
                                color='primary'
                                onClick={() => this.setState({ showAddSection: !this.state.showAddSection })}
                                disabled={!this.state.addPool.length > 0 ? true : false}
                                style={{ marginRight: '20px' }}
                            >
                                {!this.state.showAddSection ? 'Add Users' : 'Hide'}
                            </Button>
                            
                            <Button
                                color='danger'                                
                                onClick={() => this.setState({ showRemoveSection: !this.state.showRemoveSection })}
                                disabled={!this.state.removePool.length > 0 ? true : false}
                            >
                                {!this.state.showRemoveSection ? 'Remove Users' : 'Hide'}
                            </Button>
                        </Col>                        
                    </RowItem>
                    <RowItem>
                        <Col xl='12'>
                            <h6>Edit Role Name</h6>
                        </Col>
                        <Col xl='10'>
                            <Input
                                type='text'
                                name='roleName'
                                id='roleName'
                                value={this.state.roleName}
                                onChange={(e) => this.setState({ roleName: e.target.value })}
                                disabled={this.state.roleId === AdminFunctions.AdminRoleId ? true : false}
                            />
                        </Col>
                        <Col xl='2'>
                            <Button
                                color='primary'
                                onClick={() => this.renameRole()}
                                disabled={this.state.roleId === AdminFunctions.AdminRoleId ? true : false}
                            >
                                Save
                            </Button>
                        </Col>
                    </RowItem>                    
                    <Collapse isOpen={this.state.showAddSection}>
                        <RowItem>
                            <Col xl='12'>
                                <Button
                                    close
                                    onClick={() => this.setState({ showAddSection: !this.state.showAddSection })}
                                    style={{ float: 'right' }}
                                />
                            </Col>
                            <Col xl='12'>
                                <h6>Add Users to Role</h6>
                            </Col>
                            <Col xl='10'>                                
                                <Typeahead
                                    id='addUser'
                                    onChange={(selected) => this.setState({ addUser: selected })}
                                    selected={this.state.addUser}
                                    labelKey='name'
                                    options={this.state.addPool}
                                    placeholder='Search'
                                />
                            </Col>
                            <Col xl='2'>
                                <Button
                                    color='primary'
                                    onClick={() => this.addUserToRole()}
                                    disabled={!this.state.addUser ? true : false }
                                >
                                    Add
                                </Button>
                            </Col>                            
                        </RowItem>
                    </Collapse>
                    <Collapse isOpen={this.state.showRemoveSection}>
                        <RowItem>
                            <Col xl='12'>
                                <Button
                                    close
                                    onClick={() => this.setState({ showRemoveSection: !this.state.showRemoveSection })}
                                    style={{ float: 'right' }}
                                />
                            </Col>
                            <Col xl='12'>
                                <h6>Remove Users from Role</h6>
                            </Col>                            
                            <Col xl='10'>
                                <Typeahead
                                    id='removeUser'
                                    onChange={(selected) => this.setState({ removeUser: selected })}
                                    selected={this.state.removeUser}
                                    labelKey='name'
                                    options={this.state.removePool}
                                    placeholder='Search'
                                />
                            </Col>
                            <Col xl='2'>
                                <Button
                                    color='danger'
                                    onClick={() => this.removeUserFromRole()}
                                    disabled={!this.state.removeUser ? true : false }
                                >
                                    Remove
                                </Button>
                            </Col>
                        </RowItem>
                    </Collapse>
                    {this.state.removePool.length > 0 && (
                        <RowItem>
                            <Col xl='12' style={{ marginTop: '20px' }}>
                                <h6>Users in Role</h6>
                            </Col>
                            <Col xl='12'>
                                <Table bordered>
                                    <thead>
                                        <tr>
                                            <th>Id</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.removePool.map((ra, i) => {
                                            return (
                                                <tr key={ra.id}>
                                                    <td>{ra.id}</td>
                                                    <td>{ra.name}</td>
                                                </tr>
                                            )
                                        })}
                                    </tbody>
                                </Table>
                            </Col>
                        </RowItem>
                    )}
                    <Row style={{ marginTop: '20px' }}>
                        <Col xl='12'>
                            {this.state.success === true && (
                                <Alert color='success' fade>
                                    Success!
                                </Alert>
                            )}
                            {this.state.success === false && (
                                <Alert color='danger' fade>
                                    Error!
                                </Alert>
                            )}
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }

    async getRoleDetails(roleId) {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/GetRoleDetailsAsync?roleId=${roleId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({
            roleName: data.name,
            addPool: data.addPool,
            removePool: data.removePool
        });
    }

    async renameRole() {
        const token = await authService.getAccessToken();
        const response = await fetch(`api/Admin/RenameRoleAsync?roleId=${this.state.roleId}&roleName=${this.state.roleName}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ success: data });
        await this.getRoleDetails(this.state.roleId);
    }

    async addUserToRole() {
        const token = await authService.getAccessToken();
        const userId = this.state.addUser[0].id;
        const response = await fetch(`api/Admin/AddUserToRoleAsync?userId=${userId}&roleId=${this.state.roleId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ addUser: null, success: data });
        await this.getRoleDetails(this.state.roleId);
    }

    async removeUserFromRole() {
        const token = await authService.getAccessToken();
        const userId = this.state.removeUser[0].id;
        const response = await fetch(`api/Admin/RemoveUserFromRoleAsync?userId=${userId}&roleId=${this.state.roleId}`, {
            headers: !token ? {} : { 'Authorization': `Bearer ${token}` }
        });
        const data = await response.json();
        this.setState({ removeUser: null, success: data });
        await this.getRoleDetails(this.state.roleId);
    }
}