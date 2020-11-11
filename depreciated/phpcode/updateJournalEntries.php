<?php
 include "db.php";
 
 if(isset($_POST['update']))
 {
	$eid=$_POST['eid'];
	$title=$_POST['title'];
	$entry=$_POST['entry'];
	$time=date('Y-m-d G:i:s');
	$pid=$_POST['pid'];
	$q=mysqli_query($con,"UPDATE `JournalEntries` SET `Timestamp`='$time',`EntryText`='$entry', `Title`='$title' where `EntryID`='$eid' and `ParticipantID` = '$pid'");
	if($q)
		echo "success";
	else
		echo "error";
 }
?>
