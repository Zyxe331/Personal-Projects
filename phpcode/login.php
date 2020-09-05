<?php
 include "db.php";
 if(isset($_POST['login']))
 {
	session_start();  // Starts the session
	if(isset($_POST['login']))
	{
		$pid=$_POST['ParticipantID'];
		$pw=$_POST['Password'];
		$q=mysqli_query($con,"SELECT PasswordHash FROM Participants WHERE ParticipantID = '$pid'");
		$result=mysqli_fetch_assoc($q);
		if($q && password_verify($pw, $result['PasswordHash']))
		{
		      	$_SESSION['pid'] = $pid;
			echo session_id();
		}
		else
			echo "invalid";
	}
 }
?>
