<?php
 include "db.php";
 //Get PID from POST
 $pid = $_POST['pid'];
 $output = array();
 $i = 0;

 $q=mysqli_query($con,"SELECT ParticipantsCycles.CycleID, ContentCycles.Title FROM ParticipantsCycles INNER JOIN ContentCycles ON ParticipantsCycles.CycleID=ContentCycles.CycleID WHERE ParticipantID = '$pid'");
 if($q)
 {
	//Generate array of cycles associated with the PID

	while( $row = $q->fetch_array(MYSQLI_ASSOC) )
	{
 		 $output[$i] = $row;
		 $i++;
	}
 }
 echo json_encode($output);
?>
