<?php
 include "db.php";
 $pid = $_POST["pid"];
 $tag = $_POST["tag"];

 //Check for tags
 $query = mysqli_query($con, "SELECT PrayerRequests.RequestID FROM PrayerRequests INNER JOIN PrayerRequestsTags ON PrayerRequests.RequestID = PrayerRequestsTags.RequestID INNER JOIN Tags ON PrayerRequestsTags.TagID = Tags.TagID WHERE Tags.Title = '$tag' AND PrayerRequests.ParticipantID = '$pid' AND PrayerRequests.Resolved = 1 ORDER BY RAND()");

 if($query)
 {
	if(mysqli_num_rows($query)==0)
	{
		echo "false";
	}
	else
	{
		$row = mysqli_fetch_assoc($query);
		echo $row["RequestID"];
	}
 }
 else
 {
	echo "false";
 }
?>
