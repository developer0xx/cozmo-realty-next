const UploadedImages = props => {
	const { FormUploadData, setFormUploadData, Images, setImages, DeletedImgs, setDeletedImgs } = props;

	const thumbsContainer = {
		display: 'flex',
		flexDirection: 'row',
		flexWrap: 'wrap',
		marginTop: 16,
	};

	const thumb = {
		display: 'inline-flex',
		borderRadius: 2,
		border: '1px solid #eaeaea',
		marginBottom: 8,
		marginRight: 8,
		width: 100,
		height: 100,
		padding: 4,
		boxSizing: 'border-box',
	};

	const thumbInner = {
		display: 'flex',
		minWidth: 0,
		overflow: 'hidden',
	};

	const img = {
		display: 'block',
		width: 'auto',
		height: '100%',
	};

	const onDelete = image => {
		const currentIndex = Images.indexOf(image);
		if (typeof image === 'string') {
			let deletedImages = [...DeletedImgs];
			deletedImages.push(image);
			setDeletedImgs(deletedImages);
		}
		let newImages = [...Images];
		newImages.splice(currentIndex, 1);
		setImages(newImages);
		FormUploadData.delete(image);
		const newUploadData = new FormData();

		for (var value of FormUploadData.values()) {
			if (value !== image) {
				newUploadData.append('files', value);
			}
		}
		setFormUploadData(newUploadData);
	};

	const thumbs = Images.map(image => {
		return (
			<div style={thumb} key={Images.indexOf(image)} onClick={() => onDelete(image)}>
				<div style={thumbInner}>
					<img src={image.preview ? image.preview : image ? image : '/property/image-from-rawpixel-id-558306-jpeg.jpg'} style={img} />
				</div>
			</div>
		);
	});

	return (
		<div style={{ display: 'flex', width: '350px', height: '240px', overflowX: 'scroll' }}>
			{Images.length ? <aside style={thumbsContainer}>{thumbs}</aside> : 'Please upload images (Max: 10)'}
		</div>
	);
};

export default UploadedImages;
