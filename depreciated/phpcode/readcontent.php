<?php
 include "db.php";
 //Get PID from POST
 $pid = $_POST['pid'];
 $output = array();
 $i = 0;
 $cycle = $_POST['CycleID'];

 $q=mysqli_query($con,"SELECT Text, Position FROM ContentInCycles WHERE CycleID = '$cycle'");
 
 if($q)
 {
	 //If the cycle does not exist, return the information from the error cycle (with ID 0)
	if(mysqli_num_rows($q) == 0)
	{
		$q=mysqli_query($con,"SELECT Text, Position FROM ContentInCycles WHERE CycleID = 1");
	}
	//Generate array of content in the cycle, along with its position in the cycle
	while( $row = $q->fetch_array(MYSQLI_ASSOC) )
	{
 		 $output[$i] = $row;
		 $i++;
	}
 }
 echo json_encode($output);
?>
