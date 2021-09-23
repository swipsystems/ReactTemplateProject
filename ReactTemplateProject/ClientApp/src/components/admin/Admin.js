import React, { Component } from 'react';
import { Container, Row, Col, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import { RowItem } from '../layout/RowItem';
import authService from '../api-authorization/AuthorizeService';
import AdminFunctions from './AdminFunctions';

export class Admin extends Component {
    static displayName = Admin.name;

    constructor(props) {
        super(props);

        this.state = {
            
        };

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
                    <RowItem>
                        <Col>
                            <h3>Admin</h3>
                        </Col>
                    </RowItem>
                    <RowItem>
                        <ul style={{ fontSize: '24px' }}>
                            <NavLink tag={Link} to='/admin/clients'>Clients</NavLink>
                            <NavLink tag={Link} to='/admin/roles'>Roles</NavLink>
                            <NavLink tag={Link} to='/admin/users'>Users</NavLink>
                        </ul>
                    </RowItem>
                </Container>
            </div>
        )
    }
    
}