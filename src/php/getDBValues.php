<?php
     // Y2M DB itnerface
     class Y2MDB {
          const DBNAME = "Y2M";
         
          private $tableSchema;
         
          private $defaultFields;

          private $dbConnection;

          private static $instance = NULL;

          function __construct() {
               // init the table schema and default values
               $this->tableSchema=array();
               $this->defaultFields=array();
 
               // Fields table
               array_push($this->tableSchema,
                    array("Fields", 
                    "CREATE TABLE Fields (FieldID INT NOT NULL AUTO_INCREMENT,FieldName VARCHAR(80),FieldDisplayText VARCHAR(80),FieldRequired BIT,FieldDefaultValue VARCHAR(200) DEFAULT \"\", PRIMARY KEY(FieldID));"
               ));
           
               // Fields default rows 
               array_push($this->defaultFields,
                    array("Fields",
                    array("FieldName","FieldDisplayText","FieldRequired","FieldDefaultValue"),
                    array(array("URL","url",1,""),array("Artist","artist",0,""),array("Album","album",0,""),array("Name","trackname",1,""),array("Track #","tracknum",0,""),array("Genre","genre",1,""),array("Year","year",0,""))
               ));
               
               // Status Tasks table
               array_push($this->tableSchema,
                    array("StatusTasks", 
                    "CREATE TABLE StatusTasks (StatusTaskID INT NOT NULL AUTO_INCREMENT,StatusTaskName VARCHAR(80),DefaultStatus VARCHAR(80) DEFAULT \"New\",IsChecked BIT DEFAULT 0,StatusTaskDefaultValue VARCHAR(200) DEFAULT \"\", PRIMARY KEY(StatusTaskID));"
               ));

               // Status Tasks default values
               array_push($this->defaultFields,
                    array("Status Tasks",
                    array("StatusTaskName"),
                    array(array("Downloading the song"),array("Writing ID3 Tags"),array("Renaming the file"),array("Moving the file to new location"),array("Done"))
               ));
              
               // Connect to the DB 
               if (!$this->dbConnection) {
                    $this->connectDB();
               }

               // Create the tables if needed
               $this->createTables();
          }

          function __destruct() {
               $this->dbConnection->close();
          }

          // Make this class a singleton
          public static function getInstance(){
               if(is_null(self::$instance)){
                    self::$instance = new self();
               }

               return self::$instance;
          }
         
          // Connect to the database 
          private function connectDB() {
               $this->dbConnection = new mysqli(ini_get("mysqli.default_host"),ini_get("mysqli.default_user"),ini_get("mysqli.default_pw"),self::DBNAME);
          
               if ($this->dbConnection->connect_errno) {
                    die("An error occurred connecting to the database with the error " . $this->dbConnection->connect_error);
               }
          }

          // create tablesi if they don't exist an
          private function createTables() {
               // Loop through each table in thetable schema array
               foreach ($this->tableSchema as $key => $sql) {
                    // Check to see if it exists first
                    $query="SELECT * FROM information_schema.tables where table_schema=\"" . self::DBNAME . "\" and table_name=\"" . $sql[0] . "\"";
                    
                    if(!$result = $this->dbConnection->query($query)){
                         die("There was an error checking if the table " . $sql[0] . " exists with the query " . $query . " with the error " . $this->dbConnection->error);
                    }
                   
                    // no rows means it doesn't exist 
                    if ($result->num_rows == 0) {
                         // Execute the sql in $sql[1] which contains the CREATE TABLE query
                         if (mysqli_query($this->dbConnection, $sql[1]) === FALSE) {
                              die($query . "There was an error creating the table " . $sql[0] . " with the query " . $sql[1] . " with the error " . $this->dbConnection->error);
                         }

                         // Build query to populate the newly created tables with the the default values

                         // Column names 
                         $columns="";
                         
                         // Loop through index 2 which contains the default values in an array
                         for ($i=0;$i<sizeof($this->defaultFields[$key][1]);$i++) {
                              $columns .= $this->defaultFields[$key][1][$i];

                              if ($i+1<sizeof($this->defaultFields[$key][1])) {
                                   $columns .= ",";
                              }
                         }

                         // Column values. We have to loop through each array in index 2 of defaultFields then loop through each sub array 
                         for ($i=0;$i<sizeof($this->defaultFields[$key][2]);$i++) {
                              $values="";
                         
                              // Loop through each sub arra which contains the default values
                              for ($j=0;$j<sizeof($this->defaultFields[$key][2][$i]);$j++) {
                                   $values .= (is_string($this->defaultFields[$key][2][$i][$j]) ?  "\"" : "") . $this->defaultFields[$key][2][$i][$j] . (is_string($this->defaultFields[$key][2][$i][$j]) ?  "\"" : "");

                                   if ($j+1<sizeof($this->defaultFields[$key][2][$i])) {
                                        $values .= ",";
                                   }
                              }
                              
                              // Build the full SQL statement with the specified columns and values 
                              $insertDefaultValues="INSERT INTO " . $sql[0] . "(" . $columns . ") VALUES (" . $values . ");";

                              if(!$result = $this->dbConnection->query($insertDefaultValues)){
                                   die("There was an error inserting the default values into the table " . $sql[0] . " exists with the query " . $insertDefaultValues . " with the error " . $this->dbConnection->error);
                              }
                         } 
                    }
               }
          }

          public function getDBValues($tblName) {
               $query=""; //SELECT * FROM " . tblName;
               $columns="";
               $columnArray;

               if(!$result = $this->dbConnection->query("SELECT GROUP_CONCAT(Column_Name) AS Columns FROM Information_Schema.Columns WHERE TABLE_SCHEMA='" . self::DBNAME . "' AND Table_Name='" . $tblName . "' AND Column_Name NOT LIKE '%ID';")){
                    die("There was an error getting the column names with the error " . $this->dbConnection->error);
               }

               while($row = $result->fetch_assoc()){
                    $columns=$row['Columns'];
               }

               $columnArray=explode(",",$columns);

               // Build the SQL query to get the data
               $query="SELECT " . $columns . " FROM " . $tblName;

               if(!$result = $this->dbConnection->query($query)){
                    die("There was an error getting the dbValues with the query " . $query . " and the error " . $this->dbConnection->error);
               }
               
               $resultArray=array();
 
               while($row = $result->fetch_assoc()){
                    $subArray=array();
                    // Y2M expends the first column (not counting the ID) to be the key in an associative array and the remaining columns are the valuet 
                    for ($i=1;$i<sizeof($columnArray);$i++) {
                         array_push($subArray,$row[$columnArray[$i]]);
                    }
                    
                    array_push($resultArray,$row[$columnArray[0]],$subArray);
                    // $columns=$row['Columns'];
               }

               echo json_encode($resultArray);
          }
     }

     if (isset($_GET["GetValues"])) {
          // Get singleton instance of this object
          $y2mObj=Y2MDB::getInstance();

          switch($_GET["GetValues"]) {
               case "Fields":
               case "StatusTasks":
                    $y2mObj->getDBValues("Fields"); 
                    break;
               default:
                   die("Unknown value provided");
          }
     }
?>
