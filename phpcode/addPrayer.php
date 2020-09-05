<?php
 include "db.php";
 if(isset($_POST['insert']))
 {
	$title=$_POST['title'];
	$prayer=$_POST['prayer'];
	$frequency=$_POST['frequency'];
	$startDate=$_POST['startDate'];
	$time=date('Y-m-d G:i:s');
	$pid=$_POST['pid'];
	$q=mysqli_query($con,"INSERT INTO `PrayerRequests` (`Title`, `ParticipantID`, `Timestamp`, `PrayerText`, `Frequency`, `StartDate`) VALUES ('$title', '$pid', '$time', '$prayer', '$frequency', '$startDate')");
	$last_id = mysqli_insert_id($con);
 	if($q)
		echo $last_id;
	else
		echo "error";
 }
?>
