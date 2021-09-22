import React, { Component } from 'react';
import { Container, Row, Col, Button } from 'reactstrap';

export class AccessDenied extends Component {
    static displayName = AccessDenied.name;

    constructor(props) {
        super(props);

        this.state = {

        };

    }

    render() {
        return (
            <div>
                <Container style={{ marginTop: '50px' }}>
                    <Row>
                        <Col>
                            <h3>Access Denied</h3>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}