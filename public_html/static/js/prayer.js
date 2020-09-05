//Propagate cycle list
$(document).ready(function () {
    var pid;
    //Get PID from sessionHandler.js
    handleSessions(function (pid) {
        var dataString = "pid=" + pid;
        $.ajax({
            url: "http://vet.cscapstone.us/virtual/phpcode/viewPrayerRequests.php",
            type: "POST",
            context: document.body,
            data: dataString,
            success: function (data) {

                var returnArray = JSON.parse(data);
                //Add elements to list
                var prayerList = document.getElementById("prayerList");
                
                if (returnArray.length == 0)
                {
                prayerList.setAttribute("style", "display: none;");
                document.getElementById("selectPrayer").setAttribute("style", "display: none;");
                }
                else
                    {
                    for (var i = 0; i < returnArray.length; ++i) {
                        var prayerEntry = document.createElement("option");
                        prayerEntry.text = returnArray[i].Title;
                        prayerEntry.value = returnArray[i].RequestID;
                        prayerList.add(prayerEntry);
                    }
                }
            }
        });
    });
});

function selectPrayer() {
    var selection = document.getElementById("prayerList").value;
    console.log(selection);
    if (selection == "") {
        alert("Choose a prayer request.");
    }
    else {
        window.location.href = "editPrayer.html" + "?prayer=" + selection;
    }

}