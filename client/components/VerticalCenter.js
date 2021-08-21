import React from 'react'
import { Container, Row, Col, Button } from 'react-bootstrap';

const VerticalCenter = ({ children }) => {
    return (
        <section className="d-flex is-content-justification-center m-auto">
            <div className="m-auto">
                <div className="is-content-justification-center m-auto">
                    <div>
                        {children}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default VerticalCenter
