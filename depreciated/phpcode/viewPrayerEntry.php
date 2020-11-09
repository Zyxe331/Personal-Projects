<?php
 include "db.php";

 $output = array();
 $pid="test2";
 $rid=$_POST['rid'];
 $i=0;
 $q=mysqli_query($con,"select `PrayerText`, `Title`, `Frequency` from `PrayerRequests` where `RequestID` = '$rid' and `ParticipantID` = '$pid'");

 while( $row = $q->fetch_array(MYSQLI_ASSOC) )
	{
 		 $output[$i] = $row;
		 $i++;
	}
 echo json_encode($output); 
?>
