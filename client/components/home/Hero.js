import React, { useState } from 'react'
import Router from 'next/router'
import { Container, Row, Col, Button } from "react-bootstrap";
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faHome, faUser, faLock } from '@fortawesome/free-solid-svg-icons';
import { Typeahead } from 'react-bootstrap-typeahead';

const Hero = ({ cityList }) => {
    const [key, setKey] = useState('pocket');
    const [search, setSearch] = useState(
		{
			requested: false,
			city: '',
			purpose: '',
			propertyType: ''
		}
	);
    const [cityText, setCityText] = useState('');

    const handleSearch = e => {
        e.preventDefault();
        let searchQuery = {}
        if (search.city) {
            searchQuery.city = search.city
        } else if (cityText) {
            searchQuery.city = cityText
        }
        if (search.purpose) {
            searchQuery.purpose = search.purpose
        }
        if (search.propertyType) {
            searchQuery.propertyType = search.propertyType
        }
        Router.push({
            pathname: '/pocket-listings',
            query: searchQuery,
        })
    }

    return (
        <section
            id="home"
            className="d-flex is-content-justification-center m-auto"
        >
            <Container className="m-auto">

                <Row className="is-content-justification-center m-auto">
                    <Col>
                        <Row>
                            <Col>
                                <h1 className="text-center">We provide verified leads</h1>
                            </Col>
                        </Row>
                    </Col>

                    <Col md={12} className="m-auto">
                        <Tabs
                            id="controlled-tab-example"
                            activeKey={key}
                            onSelect={(k) => setKey(k)}
                        >
                            <Tab eventKey="pocket" title="Pocket Listing">

                            </Tab>
                            <Tab eventKey="active" title="Active Listing" disabled>

                            </Tab>
                            <Tab eventKey="house" title="In House Leads" disabled>

                            </Tab>

                            <Tab eventKey="ai" title="AI Verified Leads" disabled>

                            </Tab>
                            <Tab eventKey="buyer" title="Buyers" disabled>

                            </Tab>
                        </Tabs>
                        <SearchBar cityList={cityList} search={search} setSearch={setSearch} setCityText={setCityText} handleSearch={handleSearch}/>

                    </Col>
                </Row>

            </Container>
        </section>
    )
}

const SearchBar = ({cityList, search, setSearch, setCityText, handleSearch}) => {
    return (
        <section id="searchBar" className="my-6">
            <Container style={{ padding: '0' }}>
                <Row className="justify-content-center">
                    <Col className="">
                        <form onSubmit={handleSearch}>
                            <div className="input-group input-group-lg">
                                <Typeahead
                                    id="city-search"
                                    labelKey="name"
                                    className="form-control en"
                                    onChange={cityVal => setSearch({ ...search, city: cityVal[0] })}
                                    onInputChange={cityInput => setCityText(cityInput.replace(/[^\w\s]/gi, ''))}
                                    options={cityList}
                                    placeholder="City"
                                    selected={search.city ? [search.city] : []}
                                />
                                <div className="input-group-append">
                                    <button type="submit" className="btn" >
                                        <FontAwesomeIcon className="fa-lg" icon={faSearch}></FontAwesomeIcon>
                                    </button>
                                </div>
                            </div>
                        </form>
                    </Col>
                </Row>
            </Container>
        </section>
    )
}
export default Hero
