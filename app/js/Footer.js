import React from 'react';
import { Row, Col } from 'react-bootstrap';
import SocialButtons from './SocialButtons';

module.exports = React.createClass({
	render: function () {
		const fullYear = (new Date()).getFullYear();
		return (
			<div>
				<Row>
					<Col md={12}><div className="color-stripe"></div></Col>
				</Row>
				<Row className="footer">
					<Col md={6} className="copyright">
						&copy; Copyright {fullYear} &nbsp;
						<a href="http://skratchdot.com">skratchdot.com</a>
					</Col>
					<Col md={6} className="social">
						<SocialButtons />
					</Col>
				</Row>
				<br />
			</div>
		);
	}
});
