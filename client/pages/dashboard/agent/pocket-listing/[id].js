import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../../actions/auth';
import axios from 'axios';
import useSWR from 'swr';
import { API } from '../../../../config';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import PhoneInput from 'react-phone-input-2';

const preFetchPocket = async (id, cookieHeader) => {
    return await axios({
        method: 'GET',
        url: `${API}/pockets/${id}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Cookie: cookieHeader,
        },
        withCredentials: true,
    }).then(res => {
        if (res.data && res.data.success) {
            return res.data.pocket;
        } else {
            return null;
        }
    });
};


const Pocket = ({ userInfo, id, preFetchedPocket }) => {
    console.log(preFetchedPocket)
    const [data, setData] = useState({
        firstName: preFetchedPocket.firstName ? preFetchedPocket.firstName : '',
        lastName: preFetchedPocket.lastName ? preFetchedPocket.lastName : '',
        email: preFetchedPocket.email ? preFetchedPocket.email : '',
        propertyType: preFetchedPocket.propertyType ? preFetchedPocket.propertyType : '',
        propertySubType: preFetchedPocket.propertySubType ? preFetchedPocket.propertySubType : '',
        purpose: preFetchedPocket.purpose ? preFetchedPocket.purpose : '',
        askingPrice: preFetchedPocket.askingPrice ? preFetchedPocket.askingPrice : '',
        lotSize: preFetchedPocket.lotSize ? preFetchedPocket.lotSize : '',
        buildingSize: preFetchedPocket.buildingSize ? preFetchedPocket.buildingSize : '',
        phoneNumber: preFetchedPocket.phoneNumber ? preFetchedPocket.phoneNumber : '',
        status: preFetchedPocket.status ? preFetchedPocket.status : ''
    })
    const p = preFetchedPocket.property
    const [property, setProperty] = useState({
        line1: p.line1 ? p.line1 : '',
        line2: p.line2 ? p.line2 : '',
        city: p.city ? p.city : '',
        state: p.state ? p.state : '',
        zip: p.zip ? p.zip : '',
        country: p.country ? p.country : '',
        submarket: p.submarket ? p.submarket : '',
    })
    const { name, value } = e.target;
    if (name === 'propertyType') {
        setData({ ...data, [name]: value, ['propertySubType']: '' });
    } else {
        setData({ ...data, [name]: value })
    }

    const propertyHandler = e => {
        const { name, value } = e.target;
        setProperty({ ...property, [name]: value });

    }
    const phoneNumberHandler = e => {
        setData({ ...data, phoneNumber: e });
    };
    const submitHandler = async e => {
        e.preventDefault();
        let body = {
            ...data,
            id: id,
            property: property
        }
        console.log(body);
        return await axios({
            method: 'PUT',
            url: `${API}/pockets`,
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            data: JSON.stringify(body),
            withCredentials: true,
        }).then(res => {
            return res;
        }).catch(err => console.log(err))
    }

    const residentialSubTypeList = [
        {
            name: 'SFR',
            value: 'sfr',
        },
        {
            name: 'Condo/Townhouse',
            value: 'condoTownhouse',
        },
        {
            name: 'Multi Family',
            value: 'multiFamily',
        },
    ]

    const commercialSubTypeList = [
        {
            name: 'Multi Family',
            value: 'multiFamily',
        },
        {
            name: 'Industrial',
            value: 'industrial'
        },
        {
            name: 'Shopping Center',
            value: 'shoppingCenter',
        },
        {
            name: 'Office Building',
            value: 'officeBuilding'
        },
        {
            name: 'Mixed Use',
            value: 'mixedUse'
        },
        {
            name: 'Free Standing Building',
            value: 'freeStandingBuilding'
        },
        {
            name: 'Hotel',
            value: 'hotel'
        },
        {
            name: 'Retail',
            value: 'retail'
        },
        {
            name: 'Restaurant',
            value: 'restaurant',
        },
        {
            name: 'Specialty',
            value: 'speicalty',
        },
        {
            name: 'Medical Building',
            value: 'medicalBuilding',
        },
    ]

    const getName = (value, type) => {
        let list = [];
        if (data.propertyType === 'residential') {
            list = residentialSubTypeList
        } else {
            list = commercialSubTypeList
        }
        for (let i = 0; i < list.length; i++) {
            console.log(list[i])
            if (list[i].value === value) {
                return list[i].name;
            }
        }
        return ''
    }
    return <DashboardLayout userInfo={userInfo}>
        <section id="create" style={{ height: '100vh' }}>
            <Container>
                <Row>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Address Line 1</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'line1'}
                                    className="form-control"
                                    value={property.line1}
                                    onChange={propertyHandler}
                                ></Form.Control>

                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group>
                            <Form.Label>Address Line 2</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'line2'}
                                    className="form-control"
                                    value={property.line2}
                                    onChange={propertyHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>City</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'city'}
                                    className="form-control"
                                    value={property.city}
                                    onChange={propertyHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>State</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'state'}
                                    className="form-control"
                                    value={property.state}
                                    onChange={propertyHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={4}>
                        <Form.Group>
                            <Form.Label>zip</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'zip'}
                                    type="number"

                                    className="form-control"
                                    value={property.zip}
                                    onChange={propertyHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Lot Size</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'lotSize'}
                                    type="number"

                                    className="form-control"
                                    value={data.lotSize}
                                    onChange={dataHandler}
                                ></Form.Control>
                                <InputGroup.Append>
                                    <InputGroup.Text id="basic-addon2">ft<sup>2</sup></InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Building Size</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'buildingSize'}
                                    type="number"
                                    className="form-control"
                                    value={data.buildingSize}
                                    onChange={dataHandler}
                                ></Form.Control>
                                <InputGroup.Append>
                                    <InputGroup.Text id="basic-addon2">ft<sup>2</sup></InputGroup.Text>
                                </InputGroup.Append>
                            </InputGroup>
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Asking Price</Form.Label>
                            <InputGroup>
                                <InputGroup.Prepend>
                                    <InputGroup.Text id="basic-addon2">$</InputGroup.Text>
                                </InputGroup.Prepend>
                                <Form.Control
                                    name={'askingPrice'}
                                    type="number"
                                    className="form-control"
                                    value={data.askingPrice}
                                    onChange={dataHandler}
                                ></Form.Control>

                            </InputGroup>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Property Type</Form.Label>
                            <DropdownButton
                                id="dropdown-item-button"
                                title={<span className="text-capitalize">{data.propertyType ? data.propertyType : 'Select Property Type'}</span>}
                            >
                                {['residential', 'commercial'].map(type => {
                                    return (
                                        <Dropdown.Item
                                            key={type}
                                            as="button"
                                            className="text-capitalize"
                                            name={'propertyType'}
                                            value={type}
                                            onClick={dataHandler}
                                        >
                                            {type}
                                        </Dropdown.Item>
                                    );
                                })}
                            </DropdownButton>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Property Sub Type</Form.Label>
                            <DropdownButton
                                id="dropdown-item-button"
                                title={<span className="text-capitalize">{
                                    data.propertySubType ? getName(data.propertySubType, data.propertyType) : 'Select Property Sub Type'}</span>}
                            >
                                {(data.propertyType === 'residential' ? residentialSubTypeList : commercialSubTypeList).map(item => {
                                    return (
                                        <Dropdown.Item
                                            key={item.value}
                                            as="button"
                                            className="text-capitalize"
                                            name={'propertySubType'}
                                            value={item.value}
                                            onClick={dataHandler}
                                        >
                                            {item.name}
                                        </Dropdown.Item>
                                    );
                                })}
                            </DropdownButton>
                        </Form.Group>
                    </Col>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>Purpose</Form.Label>
                            <DropdownButton
                                id="dropdown-item-button"
                                title={<span className="text-capitalize">{data.purpose ? data.purpose : 'Select Purpose'}</span>}
                            >
                                {['for sale', 'for lease', 'business for sale'].map(type => {
                                    return (
                                        <Dropdown.Item
                                            key={type}
                                            as="button"
                                            className="text-capitalize"
                                            name={'purpose'}
                                            value={type}
                                            onClick={dataHandler}
                                        >
                                            {type}
                                        </Dropdown.Item>
                                    );
                                })}
                            </DropdownButton>
                        </Form.Group>
                    </Col>

                </Row>
                <Row>
                    <Col md={3}>
                        <Form.Group>
                            <Form.Label>First Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'firstName'}
                                    className="form-control"
                                    value={data.firstName}
                                    onChange={dataHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col><Col md={3}>
                        <Form.Group>
                            <Form.Label>Last Name</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    name={'lastName'}
                                    className="form-control"
                                    value={data.lastName}
                                    onChange={dataHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col><Col md={3}>
                        <Form.Group>
                            <Form.Label>Email</Form.Label>
                            <InputGroup>
                                <Form.Control
                                    type='email'
                                    name={'email'}
                                    className="form-control"
                                    value={data.email}
                                    onChange={dataHandler}
                                ></Form.Control>
                            </InputGroup>
                        </Form.Group>
                    </Col><Col md={3}>
                        <Form.Group>
                            <Form.Label>Phone</Form.Label>
                            <PhoneInput
                                specialLabel={
                                    <span className="text-capitalize">


                                    </span>
                                }
                                country="us"
                                onlyCountries={['us']}
                                disableDropdown
                                disableCountryCode
                                value={data.phoneNumber ? data.phoneNumber.toString() : ''}
                                placeholder={''}
                                name={'phoneNumber'}
                                onChange={phoneNumberHandler}
                            />
                        </Form.Group>
                    </Col>
                </Row>
                <Row>
                    <Col sm={12} md={4}>
                        <Button className="w-100" onClick={submitHandler}>Update</Button>
                    </Col>
                </Row>
            </Container>
        </section>
    </DashboardLayout >;
};


export const getServerSideProps = async ctx => {
    const id = ctx.params.id;
    console.log(id)
    const cookie = parseCookies(ctx);
    const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
    const userInfo = await getUserInfoSSR(cookieHeader);
    const preFetchedPocket = await preFetchPocket(id, cookieHeader);

    return { props: { userInfo, id, preFetchedPocket } };
};

export default Pocket;