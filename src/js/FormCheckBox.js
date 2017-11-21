//Checkbox component 
import React from 'react';
import { Label } from 'react-bootstrap';


class FormCheckBox extends React.Component {
    constructor(props) {
	    super(props);
	 
	    this.state = {
	         statusTaskTypes : { 'New' : 'info','Info' : 'info', 'Success' : 'success', 'Warning' : 'warning', 'Danger' : 'danger' },
	    }
    }
   
    render() {
         // Set the button iand checkbox style based on the status
         let chkCurrClass=this.state.statusTaskTypes[this.props.currentStatus];
         
         // let btnCurrClass='btn btn-default active';
         let btnCurrClass=chkCurrClass.toString(); //.replace('fancy-checkbox','btn btn');

         // set the state of the checkbox (checked/unchecked)  
         let checked = "";
         
         if (this.props.checked===true) {
              checked="checked";
         }

         // CSS to make button height match the label
	    const btnStyle = {
	         height: '34px',
	    };

      /*
      	      <FormGroup>
		   <ButtonGroup>
			<Label style={btnStyle}>
		             <input type="checkbox" name={chkCurrClass} id={chkCurrClass} autoComplete="off" disabled="disabled" checked={checked} />
			     <Glyphicon glyph="ok"></Glyphicon>
			     <span> </span>
			</Label>
		    <Label htmlFor={chkCurrClass} bsStyle={btnCurrClass} style={labelStyle}>
			 {this.props.value}
		    </Label>
		   </ButtonGroup>
	      </FormGroup> 
      */
	    return (	   
	         <h2>
                   <Label style={btnStyle} bsStyle={btnCurrClass}>
		              <input type="checkbox" name={chkCurrClass} id={chkCurrClass} autoComplete="off" disabled="disabled" checked={checked} />
                        <span>  </span>
                        {this.props.value}
                   </Label>
              </h2>
	    ); 
	 /*          
	 switch (this.props.currentStatus) {
	      case 'New':
		   break;
	      case 'Success':
		   break;
	      case 'Warning':
		   break;
	      case 'Danger':
		   break;
	 }*/
     }    
}

export default FormCheckBox;
