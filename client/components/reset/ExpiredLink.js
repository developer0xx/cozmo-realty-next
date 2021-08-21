import { Button, Card } from 'react-bootstrap';
import Link from 'next/link';

const ExpiredLinkPage = () => {
	return (
		<section id="expired-page">
			<Card className="card-border-disabled">
				<Card.Body>
					<Link href="/">
						<a>
							<Card.Img variant="top" className="form-logo" src="/logos/cozmo_black.png" />
						</a>
					</Link>
					<Card.Title as="h2" className="expired-title">Invalid / Expired Link</Card.Title>
					<Card.Text className="expired-text">
						This link is either invalid or expired. <br/>
						Please request a new link on : 
					</Card.Text>
					<Link href="/forgot-password">
						<a>
							<Button className="solid solid-small" >Forgot Password</Button>
						</a>
					</Link>
				</Card.Body>
			</Card>
		</section>
	)
}

export default ExpiredLinkPage