/*

TO DO

Add support for both platforms in servertasks.php
make servertasks.php save mp3 to tmp on both platforms
Feature: look into audio fingerprinting using Acoustid https://acoustid.org/fingerprinter 
Feature: fetch data as JSON (maybe);
Feature: Create path artist\album\tracknum - title.mp3 if these fields are provided (maybe feature)

*/

import React from 'react';
import FormCheckBox from './FormCheckBox.js';
import FormLabel from './FormLabel.js';
import FormField from './FormField.js';
import 'bootstrap/dist/css/bootstrap.css';
import { Button, Col, Label, Panel, Row } from 'react-bootstrap';

const initialStatusTaskState = 'New';
            
let MobileDetect = require('mobile-detect');
let md = new MobileDetect(window.navigator.userAgent);

// Form component 
class Form extends React.Component {
    constructor(props) {
         super(props);
             
	 this.state = {  
	      currentStatus : 1,
	      // fieldArray format: KEY : { 'field name',required (true or false),'value or default value if initialized in state'  }
              fieldArray : {'URL' : ['url',true,(this.getParam("URL") !== "null" ? this.getParam("URL") : "")],'Artist' : ['artist',(md.mobile() === null ? true : false),this.parseTitle('artist')],'Album': ['album',(md.mobile() === null ? true : false),""],'Name' : ['trackname',true,this.parseTitle('title')],'Track #' : ['tracknum',(md.mobile() === null ? true : false),""], 'Genre' : ['genre',true,""], 'Year' : ['year',(md.mobile() === null ? true : false),""] },
              isSubmitted : false, 
	      mp3File : "",
	      processStatus : (md.mobile()==null ? "All fields are required" : "URL, Artist and Genre are required"),
              plexScanNewFiles : true,
	      submitButtonDisabled: false,
	      statusTasks : { 'Downloading the song' : [ initialStatusTaskState,false], 'Writing ID3 Tags' : [initialStatusTaskState,false],'Renaming the file' : [initialStatusTaskState,false],'Moving the file to new location' : [initialStatusTaskState,false], 'Done' : [initialStatusTaskState,false] },
              statusTasksVisible : false 
	 };

         // Bind custom methods to this
	 this.finished = this.finished.bind(this);
	 this.formFieldChange = this.formFieldChange.bind(this);
	 this.getParam = this.getParam.bind(this);
	 this.parseTitle = this.parseTitle.bind(this);
         this.plexScanFilesChange = this.plexScanFilesChange.bind(this);
	 this.submitClick = this.submitClick.bind(this);
	 this.updateStatus = this.updateStatus.bind(this);
	 this.updateStatusTask = this.updateStatusTask.bind(this);
    }

    // Method called when all status have finished   
    finished() {
         this.updateStatusTask('Done','Success');
      
	 this.setState({isSubmitted : true});
    }

    // When the text field value changes, store the value in the array
    formFieldChange(name,value) {
         let fld=this.state.fieldArray;
         fld[name][2]=value;
	    this.setState({fieldArray : fld });
    }

    // Get URL parameter if provided
    getParam(name) {
         let query = window.location.search.substr(1);
         
         if (query==="") {
              return;
         }

         var res=query.split("&");

         if (name==='URL' && res[0]) {
              return decodeURI(res[0].replace('URL=','')); 
         } else if (name==='Title' && res[1]) {
              return decodeURI(res[1].replace('Title=','')); 
         }
    }

    /*getValues(valName) {
         // Run the AJAX request
	 fetch('./php/getDBValues.php', {method: 'GET',}).then(response => response.json()).then((response) => {
	      if (response[0].indexOf("ERROR") !== -1) {
	           // write error status
		   this.updateStatus("A fatal error occurred: " + response[0]);
              }

	 }).catch(error => { 
              console.log('request failed', error); 
         });
    }*/
 
    // force Plex Rescan checkbox change event
    plexScanFilesChange() {
         this.setState({plexScanNewFiles : !this.state.plexScanNewFiles});
    }

    // Parses URL parameter 
    parseTitle(section) {
         // section can be artist name or song name
         let titleParam=this.getParam("Title");
         
         if (!titleParam) {
              return null;
         }

         // Remove these strings from the URL 
         titleParam=titleParam.toString().replace(' - [HQ] - YouTube','');
         titleParam=titleParam.replace(' - YouTube','');

         // If no dash is in the title, I'm going to assume that the title is the song name 
         if (titleParam.indexOf('-')===null && section==='title') {
               return titleParam;
         }

         let res=titleParam.split('-');

         if (section==='artist' && res[0]) {
              return res[0].trim();
         } else if (section==='title' && res[1]) {
              return res[1].trim();
         }
    }

    render() {
	 const buttonStyle = {
	      marginLeft: '40%',
	      marginRight: '50%',
	 };

	 const fields = Object.keys(this.state.fieldArray).map(key => this.renderLabelFieldRow(key));
	 const statusTasks = Object.keys(this.state.statusTasks).map(key => this.renderStatusTasks(key));
	 
	 let submitButtonDisabled=false;

	 // if (this.state.submitButtonDisabled && this.state.isSubmitted===false) {
	 if (this.state.submitButtonDisabled && !this.state.isSubmitted) {
              submitButtonDisabled=true; 
	 }

         // set the state of the Plex checkbox (checked/unchecked)  
         // let checked = (this.state.plexScanNewFiles===true ? "checked" : "");

	 const labelStyle = {
              display: 'inline-block',
	      width: '100%',
	 };
         
         const buttonText=(!this.state.isSubmitted ? "Start" : "Restart");

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
   
    // Render the row with the Label and Field
    renderLabelFieldRow(i) {
         const fieldRow = <FormField key={i} required={this.state.fieldArray[i][1]} onChange={e => this.formFieldChange(i,e.target.value)} value={this.state.fieldArray[i][2]} ></FormField>
	 
         return (
	         <Row key={i}>
		    <FormLabel key={"Label-" + i} value={i}></FormLabel> 
		    {fieldRow}
	         </Row>
	 );
    }

    // Render the status task checkbox and labels 
    renderStatusTasks(i) {
	    const chkField = <FormCheckBox key={i} value={i} currentStatus={this.state.statusTasks[i][0]} checked={this.state.statusTasks[i][1]}></FormCheckBox> 
	 
	    return (
	         <div className='classdiv' key={i}>{chkField}</div>
	    );
    }

    // submit button click event 
    submitClick() {
         // When the last task has been completed, the submit button changes to restart. This will reset everything when restart is clicked
         if (this.state.isSubmitted===true) {
              // Clear all of the field values
              let fieldArray=this.state.fieldArray;

              for (let key in fieldArray) {
                   fieldArray[key][2]="";
              }

              this.setState({fieldArray : fieldArray});

              // reset all status tasks 
              let statusTasks=this.status.statusTasks;
 
              for (let key in statusTasks) {
                   statusTasks[key][0]='New';
                   statusTasks[key][1]=false;
              }
         
              this.setState({statusTasks : statusTasks});

              // Hide status tasks
              this.setState({statusTasksVisible : false});

              // Set initial status accordingly if we are on desktop or mobile
              if (md.mobile()==null) {
                   this.setState({processStatusTasksVisible : "All fields are required" });
              } else {
                   this.setState({processStatusTasksVisible : "URL, Artist and Genre are required" });
              }
               
              // Reset submitted status            
              this.setState({isSubmitted : false});
 
              // enable submit button 
              this.setState({submitButtonDisabled : false});

              return;
         }

         let params= "";

	 // Validate the required fields since I no longer use a form so required isn't enforced
	 if (this.state.fieldArray["URL"][2]==="") {
	      this.updateStatus("Please enter the URL");
	      return;
	 }

	 if (this.state.fieldArray["URL"][2].indexOf("https://www.youtube.com")===-1) {
	      this.updateStatus("Only YouTube URLs are supposed");

	      return;
	 }

	 if (this.state.fieldArray["Artist"][2]==="") {
	      this.updateStatus("Please enter the Artist");
	      return;
	 }

         if (this.state.fieldArray["Album"][1]===true && this.state.fieldArray["Album"][2]==="") {
	      this.updateStatus("Please enter the Album");
              return;
         }

	 if (this.state.fieldArray["Name"][2]==="") {
	      this.updateStatus("Please enter the Name");
	      return;
	 }

         if (this.state.fieldArray["Track #"][1]===true && this.state.fieldArray["Track #"][2]==="") {
	      this.updateStatus("Please enter the track #");
              return;
         }

	 if (this.state.fieldArray["Genre"][2]==="") {
	      this.updateStatus("Please enter the Genre");
	      return;
	 }
         
         if (this.state.fieldArray["Year"][1]===true && this.state.fieldArray["Year"][2]==="") {
	      this.updateStatus("Please enter the year");
              return;
         }

       
         // Plex Rescan is disabled for now 
         // if the user has unchecked Force Plex Rescan, remove the corresponding status task from the hash array
         /*if (this.state.plexScanNewFiles===false) {
              const currentStatus={ ...this.state.statusTasks};
              
             try {
                  delete currentStatus["Forcing Plex Rescan"];

                  this.setState({statusTasks : currentStatus });
              } catch (e) {}
         }*/
        
         // Once the user clicks on submit, disable the button to prevent further clicks
         if (this.state.submitButtonDisabled===false) {
	      // this.setState({submitButtonDisabled : true}, () => this.submitClick());
	      this.setState({submitButtonDisabled : true});
         }
     
         // Show status tasks
         //this.setState({showStatusTasks : true});
         if (this.state.statusTasksVisible===false) {
	      // this.setState({statusTasksVisible : true}, () => this.submitClick());
	      this.setState({statusTasksVisible : true});
         }
         
         // Build AJAX parameters
         switch (this.state.currentStatus) {
              case 1: 
	           this.updateStatus("Starting the download");

                   // step 1 params
     	           params = '?step=1&URL=' + this.state.fieldArray["URL"][2];
         
                   // Update status task
                   this.updateStatusTask('Downloading the song','Info');

                   break;
              case 2:
                   params = "?step=2&Filename=" + this.state.mp3File + "&Artist=" + this.state.fieldArray["Artist"][2] + "&Album=" + this.state.fieldArray["Album"][2] + "&TrackName=" + this.state.fieldArray["Name"][2] + "&TrackNum=" + this.state.fieldArray["Track #"][2] + "&Genre=" + this.state.fieldArray["Genre"][2]  + "&Year=" + this.state.fieldArray["Year"][2];
                   // Update status task
                   this.updateStatusTask('Downloading the song','Success');
                   this.updateStatusTask('Writing ID3 Tags','Info');

                   break;
              case 3:
	           params = "?step=3&Filename=" + this.state.mp3File + "&Artist=" + this.state.fieldArray["Artist"][2] + "&Album=" + this.state.fieldArray["Album"][2] + "&TrackName=" + this.state.fieldArray["Name"][2] + "&TrackNum=" + this.state.fieldArray["Track #"][2] + "&Genre=" + this.state.fieldArray["Genre"][2]  + "&Year=" + this.state.fieldArray["Year"][2];
              
                   // Update these status tasks
                   this.updateStatusTask('Writing ID3 Tags','Success');
                   this.updateStatusTask('Renaming the file','Info');
                   
                   break;
              case 4:
	           params = "?step=4&Filename=" + encodeURI(this.state.mp3File);
              
                   // Update these status tasks
                   this.updateStatusTask('Renaming the file','Success');
                   this.updateStatusTask('Moving the file to new location','Info');

                   break; 
              case 5:
	           params = "?step=5";
              
                   // Update these status tasks
                   this.updateStatusTask('Moving the file to new location','Success');
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
                             this.updateStatusTask('Downloading the song','Danger');
                              // An error occurred so we're done here
                              return;
                        }

		        let mp3File = response[0];
		        this.setState({mp3File : mp3File});

		        this.updateStatus("The file has been downloaded. Writing the ID3 tags");
		       
                        // Update the status and continue on to the next step 
	   	        this.setState({ currentStatus : 2}, () => this.submitClick());

                         break;
                   case 2:
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateStatusTask('Writing ID3 Tags','Danger');
                        
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
                             this.updateStatusTask('Renaming the file','Danger');
                        
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
                             this.updateStatusTask('Moving the file to new location','Danger');
                        
                             // An error occurred so we're done here
                             return;
                        }

		        this.updateStatus("The file has been moved to the new location");
		
                        /*if (Object.keys(this.state.statusTasks).length>=5) {	
                        // Update the status and continue on to the next step 
                        // this.setState({ currentStatus : 5}, () => this.submitClick());
                        this.setState({ currentStatus : 5});
                        }*/

                        this.updateStatusTask('Moving the file to new location','Success');
                      
                        this.finished();

                        break;
                   /*case 5:
		        if (response[0].indexOf("ERROR") !== -1) {
                             // Update the status
                             this.updateStatusTask('Moving the file to new location','Danger');
                        
                              // An error occurred so we're done here
                             return;
                        }

	      	        this.updateStatus("Done"); 
 
                        this.updateStatusTask('Forcing Plex Rescan','Success');
                        this.updateStatusTask('Done','Success');

                        break;*/
                   default:
                        alert("Unknown AJAX status");
              }
	 }).catch(error => { 
              console.log('request failed', error); 
         });
    }

    // Update the gray status message label
    updateStatus(newStatus) {
	 this.setState({processStatus : newStatus});
    }
    
    // Update the status task 
    updateStatusTask(taskName,value) {
         let currentStatus={ ...this.state.statusTasks};
         currentStatus[taskName][0]=value;
 
         // Check the checkbox if the status is not New or Info
         currentStatus[taskName][1]=(value !== 'New' && value !== 'Info' ? true : false);

         this.setState({statusTasks : currentStatus });
    }
}

export default Form;
