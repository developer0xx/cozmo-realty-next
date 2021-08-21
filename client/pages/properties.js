import React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import List from '../components/properties/List'
import Map from '../components/properties/Map'
import Head from 'next/head';
import { Container, Row, Col, Button } from 'react-bootstrap';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../actions/auth';

const Properties = (props) => {
    return (
        <Layout userInfo={props.userInfo} style={'black'}>
            <Head>
                <meta charSet="utf-8" />
                <meta name="viewport" content="initial-scale=1.0, width=device-width" />
                <title>Properties - Cozmo Realty</title>
                <meta
                    name="description"
                    content=""
                />
                <link rel="canonical" href="https://cozmorealty.com/properties" />
                <meta property="og:locale" content="en_US" />
                <meta property="og:type" content="website" />
                <meta property="og:title" content="Properties - Cozmo Realty" />
                <meta
                    property="og:description"
                    content=""
                />
                <meta property="og:url" content="https://cozmorealty.com/properties" />
                <meta property="og:site_name" content="Cozmo Realty" />
                <meta property="og:image" content="" />
            </Head>
            <main>
                <section>
                    <Container fluid className=''>
                        <Row className=''>
                            <Col sm={12} md={6}>
                                <List/>
                            </Col>
                            <Col sm={12} md={6}>
                                <Map></Map>
                            </Col>
                        </Row>
                    </Container>
                </section>
            </main>
        </Layout>
    )
}

export const getServerSideProps = async (ctx) => {
    const cookie = parseCookies(ctx);
    const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`
    const userInfo = await getUserInfoSSR(cookieHeader);
    return { props: { userInfo } }
}

export default Properties
