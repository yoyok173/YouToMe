// Label component
import React from 'react';
import { Col, Label } from 'react-bootstrap';

const FormLabel = props => 
     <Col xs={3}><h2><Label bsStyle={"default"} style={{'marginLeft':'25%','MarginRight':'25%','display':'inline-block','width':'100%'}}>{props.value}</Label></h2></Col>

/*
class FormLabel extends React.Component {
    render() {
	    const labelStyle = {
	         marginLeft: '25%',
	         marginRight: '25%',
              display: 'inline-block',
	         width: '100%',
	    };

	    return (
	         <Col xs={3}><h2><Label bsStyle={"default"} style={labelStyle}>{this.props.value}</Label></h2></Col>
	    );
    }
}
*/

export default FormLabel;
