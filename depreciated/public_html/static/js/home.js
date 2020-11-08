var pid = "";
$(document).ready(function () {
    
    //Get the PID from sessionHandler.js
    handleSessions(function (pid) {
        var dataString = "pid=" + pid;

        //Get daily prayer requests
        $.ajax({
            type: "POST",
            url: "http://vet.cscapstone.us/virtual/phpcode/checkDaily.php",
            data: dataString,
            crossDomain: true,
            cache: false,
            success: function (data) {
                if (data != "error") {
                    var titleArray = JSON.parse(data);
                    var arrayLength = titleArray.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var textnode = document.createTextNode(titleArray[i].Title);
                        document.getElementById("prayerScrollBox").appendChild(textnode);
                        document.getElementById("prayerScrollBox").appendChild(document.createElement("br"));
                        document.getElementById("prayerScrollBox").setAttribute("onclick", "window.location.href = \"prayerReader.html\";");
                    }
                }
                else {
                    var textnode = document.createTextNode("No prayer requests scheduled for today! ");
                    document.getElementById("prayerScrollBox").appendChild(textnode);
                    var newLink = document.createElement("a");
                    newLink.innerHTML = "Schedule a request here!";
                    newLink.setAttribute("href", "prayer.html");
                    document.getElementById("prayerScrollBox").appendChild(newLink);
                }
            }
        });


        //Get user's content cycles
        $.ajax({
            type: "POST",
            url: "http://vet.cscapstone.us/virtual/phpcode/displaycycles.php",
            data: dataString,
            crossDomain: true,
            cache: false,
            success: function (data) {
                if (data != "error") {
                    var titleArray = JSON.parse(data);
                    var arrayLength = titleArray.length;
                    for (var i = 0; i < arrayLength; i++) {
                        var textnode = document.createTextNode(titleArray[i].Title);
                        document.getElementById("devoScrollBox").appendChild(textnode);
                        document.getElementById("devoScrollBox").appendChild(document.createElement("br"));
                        document.getElementById("devoScrollBox").setAttribute("onclick", "window.location.href = \"devos.html\";");
                    }
                }
                else {
                    var textnode = document.createTextNode("You aren't in any cycles! ");
                    document.getElementById("devoScrollBox").appendChild(textnode);
                    document.getElementById("devoScrollBox").appendChild(document.createElement("br"));
                    var textnode = document.createTextNode("Ask your instructor about being added to a cycle. ");
                    document.getElementById("devoScrollBox").appendChild(textnode);
                }
            }
        });
    });
});