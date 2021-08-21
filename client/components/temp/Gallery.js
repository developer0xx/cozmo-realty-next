import React from 'react';
import { Container, Row, Col, Carousel } from 'react-bootstrap';
const Gallery = () => {
	return (
		<section className="gallery" ref={componentRef}>
			<Carousel
				indicators={propertyInfo.images.length > 1 ? true : false}
				interval={null}
				className="carousel-images-wrapper"
				nextIcon={
					propertyInfo.images.length > 1 ? (
						<div className="nextIcon">
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="0.5" y="0.5" width="39" height="39" rx="19.5" fill="white" fillOpacity="0.8" stroke="white" />
								<path d="M18 13.9999L24 19.9999L18 25.9999" stroke="#303030" />
							</svg>
						</div>
					) : (
						false
					)
				}
				prevIcon={
					propertyInfo.images.length > 1 ? (
						<div className="prevIcon">
							<svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
								<rect x="-0.5" y="0.5" width="39" height="39" rx="19.5" transform="matrix(-1 0 0 1 39 0)" fill="white" fillOpacity="0.8" stroke="white" />
								<path d="M24 13.9999L18 19.9999L24 25.9999" stroke="#303030" />
							</svg>
						</div>
					) : (
						false
					)
				}
			>
				{propertyInfo.images.length > 0 ? (
					propertyInfo.images.map((image, index) => (
						<Carousel.Item key={index}>
							<img
								alt={'property'}
								src={image ? image : '/property/image-from-rawpixel-id-558306-jpeg.jpg'}
								className="invest-property-img"
								onError={e => {
									e.target.onerror = null;
									e.target.src = '/property/image-from-rawpixel-id-558306-jpeg.jpg';
								}}
							/>
						</Carousel.Item>
					))
				) : (
					<Carousel.Item key="no-image">
						<img
							alt="placeholder property"
							src="/property/image-from-rawpixel-id-558306-jpeg.jpg"
							className="invest-property-img"
							onError={e => {
								e.target.onerror = null;
								e.target.src = '/property/image-from-rawpixel-id-558306-jpeg.jpg';
							}}
						/>
					</Carousel.Item>
				)}
			</Carousel>
		</section>
	);
};

export default Gallery;
