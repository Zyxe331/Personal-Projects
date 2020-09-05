<?php
 include "db.php";
 if(isset($_POST['insert']))
 {
	$pid=$_POST['ParticipantID'];
	$pwhash=password_hash($_POST['Password'], PASSWORD_DEFAULT);
	$q=mysqli_query($con,"INSERT INTO `Participants` (`ParticipantID`,`PasswordHash`) VALUES ('$pid','$pwhash')");
	if($q)
		echo "success";
	else
		echo "error";
 }
?>
