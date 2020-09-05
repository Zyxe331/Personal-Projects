<?php
include 'db.php';
include 'sessionHeader.php';

$pid = "test2";
$data=array();
$q=mysqli_query($con,"SELECT * FROM  PrayerRequests WHERE ParticipantID = '$pid' AND MOD(DATEDIFF(CURDATE(), StartDate), Frequency) = 0;");
if (mysqli_num_rows($q) > 0)
{
while ($row=mysqli_fetch_object($q)){
	$data[]=$row;}
echo json_encode($data);
}
else
{
echo "error";
}
?>
