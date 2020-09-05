<?php
 include "db.php";
 
 if(isset($_POST['update']))
 {
	$rid=$_POST['rid'];
	$title=$_POST['title'];
	$entry=$_POST['entry'];
	$frequency=$_POST['frequency'];
	$time=date('Y-m-d G:i:s');
	$pid="test2";
	$q=mysqli_query($con,"UPDATE `PrayerRequests` SET `Timestamp`='$time',`PrayerText`='$entry', `Title`='$title', `Frequency`='$frequency' where `RequestID`='$rid' and `ParticipantID` = '$pid'");
	if($q)
		echo "success";
	else
		echo "error";
 }
?>
