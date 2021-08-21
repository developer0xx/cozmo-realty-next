import { Typeahead } from 'react-bootstrap-typeahead';
import CurrencyInput from 'react-currency-input-field';
import { Container, Row, Col, DropdownButton, Dropdown, Button } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ search, setSearch, cityList, getProperties, setPage, cityText, setCityText }) => {
	const handleSubmit = (e, custom) => {
		e.preventDefault();
		getProperties('search', custom);
	};

	return (
		<div className="mt-3">
			<Container fluid className="mb-8px ">
				<Row>
					<Col xs={12} sm={3} className="pr-0 w-100">
						<div className="d-inline-flex w-100">
							<Typeahead
								id="city-search"
								labelKey="name"
								className="w-100 border-radius-right-0"
								onChange={cityVal => setSearch({ ...search, city: cityVal[0], requested: true })}
								onInputChange={cityInput => {
									setCityText(cityInput.replace(/[^\w\s]/gi, ''));
									setSearch({...search, requested: true});
								}}
								options={cityList}
								placeholder="City"
								selected={search.city ? [search.city] : []}
							/>
							<Button className="border-radius-left-0" onClick={handleSubmit}>
								<FontAwesomeIcon className="fa-lg" icon={faSearch}></FontAwesomeIcon>
							</Button>
						</div>
						
					</Col>
					<Col xs={4} sm={1} className="w-100 pr-0">
						<DropdownButton
							className="w-100"
							id="dropdown-item-button"
							title={<span className="text-capitalize w-100">{search.purpose ? search.purpose : 'All Purpose'}</span>}
						>
							{['for sale', 'for lease', 'business for sale', 'all'].map((type, i) => {
								return (
									<Dropdown.Item
										key={i}
										as="button"
										className="text-capitalize w-100"
										onClick={e => {
											if (type === 'all') {
												setSearch({ ...search, purpose: '' });
												handleSubmit(e, { purpose: '' })
											} else {
												setSearch({ ...search, purpose: type });
												handleSubmit(e, { purpose: type })
											}
										}}
									>
										{type}
									</Dropdown.Item>
								);
							})}
						</DropdownButton>
					</Col>
					<Col xs={8} sm={1} className="w-100 pr-0">
						<DropdownButton
							className="w-100"
							id="dropdown-item-button"
							title={<span className="text-capitalize">{search.propertyType ? search.propertyType : 'Property Types'}</span>}
						>
							{['all', 'residential', 'commercial'].map(type => {
								return (
									<Dropdown.Item
										as="button"
										className="text-capitalize w-100"
										onClick={e => {
											if (type === 'all') {
												setSearch({ ...search, propertyType: '' });
												handleSubmit(e, { propertyType: '' })
											} else {
												setSearch({ ...search, propertyType: type });
												handleSubmit(e, { propertyType: type })
											}
										}}
									>
										{type}
									</Dropdown.Item>
								);
							})}
						</DropdownButton>
					</Col>
				</Row>
				{/* <Row className="mb-8px w-100 p-0">
					<Col xs={12} sm={6} className="search-left">
						<Row>
							<Col xs={6} className="search-left search-subsection">
								<CurrencyInput
									name="minPrice"
									placeholder="Min Price"
									decimalsLimit={2}
									allowNegativeValue={false}
									maxLength={10}
									prefix="$"
									className="form-control"
									onValueChange={(value, name) => setSearch({ ...search, minPrice: value })}
								/>
							</Col>
							<Col xs={6} className="search-right search-subsection">
								<CurrencyInput
									name="maxPrice"
									placeholder="Max Price"
									decimalsLimit={2}
									allowNegativeValue={false}
									maxLength={10}
									prefix="$"
									className="form-control"
									onValueChange={(value, name) => setSearch({ ...search, maxPrice: value })}
								/>
							</Col>
						</Row>
					</Col>
					<Col xs={12} sm={6} className="search-right">
						<Row>
							<Col xs={8} className="search-left search-subsection">
								<DropdownButton
									className="w-100"
									id="dropdown-item-button"
									title={<span className="text-capitalize">{search.typeOfProperty ? search.typeOfProperty : 'Property Types'}</span>}
								>
									{['all', 'commercial', 'multi-family', 'industrial', 'res. (1-4)', 'land', 'other'].map(type => {
										return (
											<Dropdown.Item
												as="button"
												className="text-capitalize w-100"
												onClick={e => {
													if (type === 'all') {
														setSearch({ ...search, typeOfProperty: '' });
													} else {
														setSearch({ ...search, typeOfProperty: type });
													}
												}}
											>
												{type}
											</Dropdown.Item>
										);
									})}
								</DropdownButton>
							</Col>
							<Col xs={4} className="search-right search-subsection">
								<Button className="w-100 h-100 primary-button button-square py-1" style={{ borderRadius: '5px' }} onClick={handleSubmit}>
									<span>Search</span>
								</Button>
							</Col>
						</Row>
					</Col>
				</Row> */}
			</Container>
		</div>
	);
};

export default SearchBar;