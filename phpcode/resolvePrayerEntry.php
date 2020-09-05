<?php
 include "db.php";
 
 if(isset($_POST['resolve']))
 {
	$rid=$_POST['rid'];
	$resolve=True;
	$pid="test2";
	$q=mysqli_query($con,"UPDATE `PrayerRequests` SET `Resolved`='$resolve' where `RequestID`='$rid' and `ParticipantID` = '$pid'");
	if($q)
		echo "success";
	else
		echo "error";
 }
?>
