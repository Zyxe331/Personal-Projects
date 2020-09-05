<?php
 //This file should be included at the beginning of each page php file
 session_start();

 if ( isset( $_SESSION['pid'] ) )
 {
	$pid = $_SESSION['pid'];
 }
 else
 {
	header('Location: http://vet.cscapstone.us/');
 }
?>
