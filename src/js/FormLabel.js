// Label component
import React from 'react';
import { Col, Label } from 'react-bootstrap';

class FormLabel extends React.Component {
    render() {
	    const labelStyle = {
	         marginLeft: '0%',
	         marginRight: '5%',
             display: 'inline-block',
	         width: '110px',
	    };

	    return (
	         <Col xs={3} sm={2} md={4} lg={3}><h2><Label bsStyle={"default"} style={labelStyle}>{this.props.value}</Label></h2></Col>
	    );
    }
}

export default FormLabel;
