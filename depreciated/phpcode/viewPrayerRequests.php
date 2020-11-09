<?php
 include "db.php";
 $pid = $_POST['pid'];
 $output = array();
 $i = 0;
    
 $q=mysqli_query($con,"SELECT RequestID, Title FROM PrayerRequests WHERE ParticipantID = '$pid'");
 if($q)
    {
        //Generate array of EntryIDs associated with the PID
        while ( $row = mysqli_fetch_assoc($q))
        {
            $output[$i] = $row;
            $i++;
        }
    }
    
    echo json_encode($output);

    
    
 //}    
 ?>
