import { useState } from 'react';
import DashboardLayout from '../../../../components/dashboard/DashboardLayout';
import { parseCookies } from 'nookies';
import { getUserInfoSSR } from '../../../../actions/auth';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';
import CurrencyInput from 'react-currency-input-field';
import { Container, Row, Col, Button, Dropdown, DropdownButton } from 'react-bootstrap';
import { API } from '../../../../config';
import axios from 'axios';
import PhoneInput from 'react-phone-input-2';

const Create = ({ userInfo }) => {
    const [data, setData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        propertyType: '',
        propertySubType: '',
        purpose: '',
        askingPrice: '',
        lotSize: '',
        buildingSize: '',
        phoneNumber: '',
        status: 'pending'
    })
    const [property, setProperty] = useState({
        line1: '',
        line2: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        submarket: '',
    })

    const dataHandler = e => {
        const { name, value } = e.target;
        if (name === 'propertyType') {
            setData({ ...data, [name]: value, ['propertySubType']: '' });
        } else {
            setData({ ...data, [name]: value })
        }
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
        let body = { ...data, property: property }
        console.log(body);
        return await axios({
            method: 'POST',
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
                        <Button className="w-100" onClick={submitHandler}>Submit</Button>
                    </Col>
                </Row>
            </Container>
        </section>
    </DashboardLayout >;
};
export const getServerSideProps = async ctx => {
    const cookie = parseCookies(ctx);
    const cookieHeader = `express:sess=${cookie['express:sess']}; express:sess.sig=${cookie['express:sess.sig']}`;
    const userInfo = await getUserInfoSSR(cookieHeader);
    return { props: { userInfo } };
};
export default Create;




