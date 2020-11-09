<?php
 include "db.php";
 $output = array();
 $i = 0;

 //Get the list of tags from the database
 $q=mysqli_query($con,"SELECT TagID, Title FROM Tags");
 //Place the tags in an associative array
 if($q)
 {
	//Generate array of cycles associated with the PID

	while( $row = $q->fetch_array(MYSQLI_ASSOC) )
	{
 		 $output[$i] = $row;
		 $i++;
	}
	 //Encode the array into JSON and return it
	 echo json_encode($output);
 }
 else
 {
	echo "error";
 }
?>
