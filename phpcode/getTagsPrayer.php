<?php
 include "db.php";
 if(isset($_POST['tagging']))
 {
	$i = 0;
	$output = array();
	$RID = $_POST["rid"];
	//Get the list of possible tags
	$result = mysqli_query($con, "SELECT Tags.Title FROM Tags INNER JOIN PrayerRequestsTags ON Tags.TagID = PrayerRequestsTags.TagID WHERE PrayerRequestsTags.RequestID = '$RID'");
//	echo "SELECT Tags.Title FROM Tags INNER JOIN PrayerRequestsTags ON Tags.TagID = PrayerRequestsTags.TagID WHERE PrayerRequestsTags.RequestID = '$RID'";
	//Return the list of tags
	if($result)
	{
		while( $row = $result->fetch_array(MYSQLI_ASSOC) )
		{
			$output[$i] = $row["Title"];
			$i++;
		}
		echo json_encode($output);
	}
	else
	{
		echo "error";
	}

 }
?>
