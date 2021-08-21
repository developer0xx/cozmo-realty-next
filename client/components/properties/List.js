import React from 'react'
import Pagination from 'react-bootstrap/Pagination'
import { Container, Row, Col, Button } from 'react-bootstrap';

const List = () => {
    return (
        <section>
            <Container>
                <Row className="property-card">
                    <Col md={5}>
                        <img
                            src="/property/image-from-rawpixel-id-558306-jpeg.jpg"
                            alt="Cozmo white logo"
                            width="100%"
                            height="auto"
                        />
                    </Col>
                    <Col md={7}>
                        <div><span className="price">$124,900</span></div>
                        <div><span className="address">6450 Lincoln Ave, Buena Park, CA 90620</span></div>
                    </Col>
                </Row>
            </Container>
            <Pagination>
                <Pagination.First />
                <Pagination.Prev />
                <Pagination.Item>{1}</Pagination.Item>
                <Pagination.Ellipsis />

                <Pagination.Item>{10}</Pagination.Item>
                <Pagination.Item>{11}</Pagination.Item>
                <Pagination.Item active>{12}</Pagination.Item>
                <Pagination.Item>{13}</Pagination.Item>
                <Pagination.Item disabled>{14}</Pagination.Item>

                <Pagination.Ellipsis />
                <Pagination.Item>{20}</Pagination.Item>
                <Pagination.Next />
                <Pagination.Last />
            </Pagination>
        </section>
    )
}

export default List
