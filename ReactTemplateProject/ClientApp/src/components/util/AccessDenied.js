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
                <Container style={{ marginTop: '15%' }}>
                    <Row>
                        <Col style={{ textAlign: 'center' }}>
                            <h1>403: Access Denied</h1>
                        </Col>
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <Col style={{ textAlign: 'center' }}>
                            <h6>You do not have permission to access this page. <br/> Please contact your Site Administrator(s) to request access.</h6>
                        </Col>
                    </Row>
                    <Row style={{ padding: '5px' }}>
                        <Col style={{ alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                            <Button
                                color='primary'
                                onClick={() => this.props.history.push('/')}
                            >
                                Go Home
                            </Button>
                        </Col>
                    </Row>
                </Container>
            </div>
        )
    }
}