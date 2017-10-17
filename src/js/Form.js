/*
npm start - test build
npm run build - build production

TO DO

URL paramter look into React-Router

*/

import React from 'react';
import FormCheckBox from './FormCheckBox.js';
import FormLabel from './FormLabel.js';
import FormField from './FormField.js';
import 'bootstrap/dist/css/bootstrap.css';
import Fetch from 'whatwg-fetch';
import { Button, Col, Label, Panel, Row } from 'react-bootstrap';

// Form component 
class Form extends React.Component {
    constructor(props) {
	    super(props);
	    this.state = {  
	         currentStatus : 1,
	         fieldArray : {'URL' : ['url',true,""],'Artist' : ['artist',false,""],'Album': ['album',false,""],'Name' : ['trackname',false,""],'Track #' : ['tracknum',false,""], 'Genre' : ['genre',false,""], 'Year' : ['year',false,""] },
              isSubmitted : false, 
	         mp3File : "",
	         processStatus : "URL, Artist and Genre are required",
              plexScanNewFiles : true,
	         submitButtonDisabled: false,
	         statusTasks : { 'Downloading the song' : ['New',false], 'Writing ID3 Tags' : ['New',false],'Renaming the file' : ['New',false],'Moving the file to new location' : ['New',false], 'Done' : ['New',false] },
              statusTasksVisible : false
	 };

          // statusTasks : { 'Downloading the song' : [false,'New',false], 'Writing ID3 Tags' : [false,'New',false],'Renaming the file' : [false,'New',false],'Moving the file to new location' : [false,'New',false],'Forcing Plex Rescan' : [false,'New',false], 'Done' : [false,'New',false] }

         // Bind custom methods to this
	 this.finished = this.finished.bind(this);
	 this.formFieldChange = this.formFieldChange.bind(this);
         this.plexScanFilesChange = this.plexScanFilesChange.bind(this);
	 this.submitClick = this.submitClick.bind(this);
	 this.updateStatus = this.updateStatus.bind(this);
	 this.updateTask = this.updateTask.bind(this);
    }
   
    // When the text field value changes, store the value in the array
    formFieldChange(name,value) {
         var fld=this.state.fieldArray;
         fld[name][2]=value;
	    this.setState({fieldArray : fld });
    }

    render() {
	 var buttonStyle = {
	      marginLeft: '40%',
	      marginRight: '50%',
	 };

	 const fields = Object.keys(this.state.fieldArray).map(key => this.renderLabelFieldRow(key));
	 const statusTasks = Object.keys(this.state.statusTasks).map(key => this.renderStatusTasks(key));
	 
	 var submitButtonDisabled=false;

	 if (this.state.submitButtonDisabled && this.state.isSubmittesd===false) {
              submitButtonDisabled=true; 
	 }

         // set the state of the Plex checkbox (checked/unchecked)  
         // let checked = (this.state.plexScanNewFiles===true ? "checked" : "");

	 var labelStyle = {
              display: 'inline-block',
	      width: '100%',
	 };
         
         var buttonText=(!this.state.isSubmitted ? "Start" : "Restart");
         // console.log("it is " + window.location.href);
         // var defaultURL="";

	 return (
              <Panel header="You to Me" bsStyle={"primary"}>
                   {fields} 
	              <Row>
	                   <Col xs={3}></Col>
			   <Col xs={6}><Button onClick={this.submitClick} style={buttonStyle} bsStyle="primary" disabled={submitButtonDisabled}>{buttonText}</Button></Col>
		      </Row>
                      {/* <h3><input type="checkbox" name='plexScanNewFiles' id='plexScanNewFiles' autocomplete="off" checked={checked} onChange={this.plexScanFilesChange} />Force Plex Rescan</h3>*/}
		      <h2><Label bsStyle={"warning"} style={labelStyle}>{this.state.processStatus}</Label></h2><br />
	              {this.state.statusTasksVisible ? statusTasks : ""}
              </Panel>
	 );
    }
   
    // force Plex Rescan checkbox change event
    plexScanFilesChange() {
         this.setState({plexScanNewFiles : !this.state.plexScanNewFiles});
    }

    // Render the status task checkbox and labels 
    renderStatusTasks(i) {
	    var chkField = <FormCheckBox key={i} value={i} currentStatus={this.state.statusTasks[i][0]} checked={this.state.statusTasks[i][1]}></FormCheckBox> 
	 
	    return (
	         <div className='classdiv' key={i}>{chkField}</div>
	    );
    }

    // Render the row with the Label and Field
    renderLabelFieldRow(i) {
         var fieldRow = <FormField key={i} required={this.state.fieldArray[i][1]} onChange={e => this.formFieldChange(i,e.target.value)} ></FormField>
	 
         return (
	         <Row key={i}>
		    <FormLabel key={"Label-" + i} value={i}></FormLabel> 
		    {fieldRow}
	         </Row>
	 );
    }

    // submit button click event 
    submitClick() {
         let params= "";

	 // Validate the required fields since I no longer use a form so required isn't enforced
	 if (this.state.fieldArray["URL"][2]==="") {
	      this.updateStatus("Please enter the URL");
	      return;
	 }

	 if (this.state.fieldArray["Artist"][2]==="") {
	      this.updateStatus("Please enter the Artist");
	      return;
	 }

	 if (this.state.fieldArray["Name"][2]==="") {
	      this.updateStatus("Please enter the Name");
	      return;
	 }

	 if (this.state.fieldArray["Genre"][2]==="") {
	      this.updateStatus("Please enter the Genre");
	      return;
	 }
       
         // Plex Rescan is disabled for now 
         // if the user has unchecked Force Plex Rescan, remove the corresponding status task from the hash array
         /*if (this.state.plexScanNewFiles===false) {
              var currentStatus={ ...this.state.statusTasks};
              
             try {
                  delete currentStatus["Forcing Plex Rescan"];

                  this.setState({statusTasks : currentStatus });
              } catch (e) {}
         }*/
        
         // Once the user clicks on submit, disable the button to prevent further clicks
         if (this.state.submitButtonDisabled===false) {
	      this.setState({submitButtonDisabled : true}, () => this.submitClick());
         }
     
         // Show status tasks
         //this.setState({showStatusTasks : true});
         if (this.state.statusTasksVisible===false) {
	      this.setState({statusTasksVisible : true}, () => this.submitClick());
         }
         
         // Build AJAX parameters
         switch (this.state.currentStatus) {
              case 1: 
	           this.updateStatus("Starting the download");

                   // step 1 params
     	           params = '?step=1&URL=' + this.state.fieldArray["URL"][2];
         
                   // Update status task
                   this.updateTask('Downloading the song','Info');

                   break;
              case 2:
                   params = "?step=2&Filename=" + this.state.mp3File + "&Artist=" + this.state.fieldArray["Artist"][2] + "&Album=" + this.state.fieldArray["Album"][2] + "&TrackName=" + this.state.fieldArray["Name"][2] + "&TrackNum=" + this.state.fieldArray["Track #"][2] + "&Genre=" + this.state.fieldArray["Genre"][2]  + "&Year=" + this.state.fieldArray["Year"][2];
                  
                   // Update these status tasks
                   this.updateTask('Downloading the song','Success');
                   this.updateTask('Writing ID3 Tags','Info');

                   break;
              case 3:
	           params = "?step=3&Filename=" + this.state.mp3File + "&Artist=" + this.state.fieldArray["Artist"][2] + "&Album=" + this.state.fieldArray["Album"][2] + "&TrackName=" + this.state.fieldArray["Name"][2] + "&TrackNum=" + this.state.fieldArray["Track #"][2] + "&Genre=" + this.state.fieldArray["Genre"][2]  + "&Year=" + this.state.fieldArray["Year"][2];
              
                   // Update these status tasks
                   this.updateTask('Writing ID3 Tags','Success');
                   this.updateTask('Renaming the file','Info');
                   
                   break;
              case 4:
	           params = "?step=4&Filename=" + encodeURI(this.state.mp3File);
              
                   // Update these status tasks
                   this.updateTask('Renaming the file','Success');
                   this.updateTask('Moving the file to new location','Info');

                   break; 
              case 5:
	           params = "?step=5";
              
                   // Update these status tasks
                   this.updateTask('Moving the file to new location','Success');
                   // this.updateTask('Forcing Plex Rescan','Info');
 
                   break;
              default:
                   alert("Unknown step in submitClick()");
         } 

         // Run the AJAX request
	 fetch('./php/serverTasks.php' + params, {method: 'GET',}).then(response => response.json()).then((response) => {
	      if (response[0].indexOf("ERROR") !== -1) {
	           // write error status
		   this.updateStatus("A fatal error occurred: " + response[0]);
              }

              switch (this.state.currentStatus) {
                   case 1: 
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateTask('Downloading the song','Danger');
                        
                              // An error occurred so we're done here
                              return;
                        }

		        var mp3File = response[0];
		        this.setState({mp3File : mp3File});

		        this.updateStatus("The file has been downloaded. Writing the ID3 tags");
		       
                        // Update the status and continue on to the next step 
	   	        this.setState({ currentStatus : 2}, () => this.submitClick());

                         break;
                   case 2:
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateTask('Writing ID3 Tags','Danger');
                        
                             // An error occurred so we're done here
                             return;
                        }

		        this.updateStatus("The ID3 tags have been written. Renaming the file");
			
                        // Update the status and continue on to the next step 
                        this.setState({ currentStatus : 3}, () => this.submitClick());

                        break;
                   case 3:
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateTask('Renaming the file','Danger');
                        
                             // An error occurred so we're done here
                             return;
                        }
                     
                        // save the new file name
		        mp3File = response;

		        this.setState({mp3File : mp3File});

		        this.updateStatus("The file has been renamed");
			
                        // Update the status and continue on to the next step 
                        this.setState({ currentStatus : 4}, () => this.submitClick());

                        break;
                   case 4:
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateTask('Moving the file to new location','Danger');
                        
                             // An error occurred so we're done here
                             return;
                        }

		        this.updateStatus("The file has been moved to the new location");
		
                        /*if (Object.keys(this.state.statusTasks).length>=5) {	
                        // Update the status and continue on to the next step 
                        // this.setState({ currentStatus : 5}, () => this.submitClick());
                        this.setState({ currentStatus : 5});
                        }*/

                        this.updateTask('Moving the file to new location','Success');
                      
                        this.finished();

                        break;
                   case 5:
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateTask('Moving the file to new location','Danger');
                        
                              // An error occurred so we're done here
                             return;
                        }

	      	        this.updateStatus("Done"); 
 
                        this.updateTask('Forcing Plex Rescan','Success');
                        this.updateTask('Done','Success');

                        break;
                   default:
                        alert("Unknown AJAX status");
              }
	 }).catch(error => { 
              console.log('request failed', error); 
         });
    }

    getValues(valName) {
         // Run the AJAX request
	 fetch('./php/getDBValuess.php' + params, {method: 'GET',}).then(response => response.json()).then((response) => {
	      if (response[0].indexOf("ERROR") !== -1) {
	           // write error status
		   this.updateStatus("A fatal error occurred: " + response[0]);
              }

	 }).catch(error => { 
              console.log('request failed', error); 
         });
    }
 
    finished() {
         console.log("In finished()");
        
         this.updateTask('Done','Success');
      
	 this.setState({isSubmitted : true});

         var fieldArray={ ...this.state.fieldArray};

	 Object.keys(fieldArray).map(key => function(key) {
              console.log("setting " + key + " to null");
	       // fieldArray[key]=value;
         });

	 this.setState({fieldArray : fieldArray});
    }

    // Update the gray status message label
    updateStatus(newStatus) {
         var currStatus=this.state.processStatus;
	 currStatus=newStatus;

	 this.setState({processStatus : currStatus});
    }
    
    // Update the status task 
    updateTask(taskName,value) {
         var currentStatus={ ...this.state.statusTasks};
         currentStatus[taskName][1]=value;
 
         // Check the checkbox if the status is not New or Info
         currentStatus[taskName][2]=(value !== 'New' && value !== 'Info' ? true : false);

         this.setState({statusTasks : currentStatus });
    }
}

export default Form;
