<?php
 include "db.php";
 if(isset($_POST['insert']))
 {
	$pid=$_POST['pid'];
	$title=$_POST['title'];
	$entry=$_POST['entry'];
	$q=mysqli_query($con,"INSERT INTO `JournalEntries` (ParticipantID, Title,  EntryText) VALUES ('$pid','$title', '$entry')");
 	if($q)
		echo "success";
	else
		echo "error";
 }
?>
