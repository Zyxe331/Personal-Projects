<?php
 include "db.php";
 if(isset($_POST['tagging']))
 {
	$RID = $_POST["RID"];
	//Remove any existing tags
	$remove = mysqli_query($con, "DELETE FROM PrayerRequestsTags WHERE RequestID = '$RID'");
	//Get the list of possible tags
	$result = mysqli_query($con, "SELECT TagID, Title FROM Tags");

	//Check if each tag is set in the post request, adding the tag to the request if it is
	if($result)
	{
		while( $row = $result->fetch_array(MYSQLI_ASSOC) )
		{
			if(isset($_POST[$row["Title"]]))
			{
				$tagID = $row["TagID"];
				$q = mysqli_query($con, "INSERT INTO PrayerRequestsTags (RequestID, TagID) VALUES ('$RID', '$tagID')");
			}
		}
	}

 }
?>
