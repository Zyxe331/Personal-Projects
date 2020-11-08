<?php
 include "db.php";
 //Set the session ID
 session_id($_POST['sessionID']);
 session_start();

 //Get the PID
 if( isset( $_SESSION['pid'] ) )
 {
	echo $_SESSION['pid'];
 }
 else 	//Send the user to the login page
 {
	echo "invalid";
 }
?>
