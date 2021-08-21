import React from 'react'
import Image from 'next/image';
import { Container, Row, Col, Button } from 'react-bootstrap';


const Platform = () => {
    return (
        <section id="platform" className="dark-background light d-flex is-content-justification-center m-auto"
        >
            <Container className="m-auto ">
                <Row className="is-content-justification-center m-auto">
                    <Col>
                        <div className="d-md-none d-lg-none my-4"><h2>Platforms We Provide</h2></div>

                        {/* <center>

                            <img src={lines2} alt=""></img>
                        </center> */}
                    </Col>
                </Row>
                <Row>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform1.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'
                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col><Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform2.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform3.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" className="p-2" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform4.png'}
                            alt="User profile picture" quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform5.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform6.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform7.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>
                    <Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform8.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col><Col className="p-2" sm={6} md={4} lg={3}><div className="p-4" style={{ width: '100%', height: 'auto', backgroundColor: 'white' }}>
                        <Image
                            src={'/home/platforms/platform9.png'}
                            alt="User profile picture"
                            quality={100}
                            width={700}
                            height={600}
                            layout='responsive'

                        // onError={e => (e.target.src = '/profile.png')}
                        /></div>
                    </Col>

                </Row>
            </Container>



        </section >
    )
}

export default Platform
