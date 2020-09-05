var pid = "";
var currentPrayerIndex = 0;
var lastPrayerIndex = -1;
var prayerArray;
$(document).ready(function () {
    //Get the PID from sessionHandler.js
    handleSessions(function (pid) {
        var dataString = "pid=" + pid;
        $.ajax({
            type: "POST",
            url: "http://vet.cscapstone.us/virtual/phpcode/checkDaily.php",
            data: dataString,
            crossDomain: true,
            cache: false,
            success: function (data) {
                if (data != "error") { // in the case there are not zero rows returned

                    // setting up necessary variables
                    prayerArray = JSON.parse(data);
                    var arrayLength = prayerArray.length;
                    lastPrayerIndex = arrayLength - 1;

                    // actually put the text into the reader
                    document.getElementById("readerText").innerHTML = prayerArray[currentPrayerIndex].Title + "<br><br>" + prayerArray[currentPrayerIndex].PrayerText;
                }
                else { // if no rows were returned
                    document.getElementById("readerText").innerHTML = "No prayer requests scheduled for today! Want to make some? <br> <a href = prayer.html>Click here!</a>";
                }
            }
        });
    });
});

function goForward() {
    if (lastPrayerIndex == -1) {
        window.location.href = "devos.html";
    }
    else {
        if (currentPrayerIndex >= lastPrayerIndex) {
            return;
        }
        else { // go to next "page"
            currentPrayerIndex++;
            document.getElementById("readerText").innerHTML = prayerArray[currentPrayerIndex].Title + "<br><br>" + prayerArray[currentPrayerIndex].PrayerText;
        }
    }
}

function goBack() {
    if (lastPrayerIndex == -1) {
        window.location.href = "devos.html";
    }
    else {
        if (currentPrayerIndex <= 0) {
            return;
        }
        else { // go to previous "page"
            currentPrayerIndex--;
            document.getElementById("readerText").innerHTML = prayerArray[currentPrayerIndex].Title + "<br><br>" + prayerArray[currentPrayerIndex].PrayerText;
        }
    }
}