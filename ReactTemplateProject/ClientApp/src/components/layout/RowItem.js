import React, { Component } from 'react';
import { Container, Row, Card, CardBody } from 'reactstrap';

export class RowItem extends Component {
    static displayName = RowItem.name;

    constructor(props) {
        super(props);

        this.state = {            

        };

    }

    render() {
        return (
            <Container style={{ width: '100%', padding: '5px' }}>
                <Card style={{ width: '100%' }}>
                    <CardBody>
                        <Row>
                            {this.props.children}
                        </Row>
                    </CardBody>
                </Card>
            </Container>            
        )
    }
}