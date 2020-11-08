$(document).ready(function () {
    var pid;
    //Get PID from sessionHandler.js
    handleSessions(function (pid) {
        var eid = getUrlVars()["journal"];
        var dataString = "eid=" + eid + "&pid=" + pid;
        if ($.trim(eid).length > 0) {
            $.ajax({
                url: "http://vet.cscapstone.us/virtual/phpcode/viewJournalEntry.php",
                type: "POST",
                context: document.body,
                data: dataString,
                success: function (data) {
                    var returnArray = JSON.parse(data);
                    //Add elements to list
                    var journalList = document.getElementById("journalList");

                    var journalEntry = document.getElementById("entry");
                    journalEntry.textContent = returnArray[0].EntryText;

                    var journalTitle = document.getElementById("title");
                    journalTitle.textContent = returnArray[0].Title;

                }
            });
        }
    });


    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }

    $("#update").click(function () {
        var pid;
        //Get PID from sessionHandler.js
        handleSessions(function (pid) {
            var title = $("#title").val();
            var entry = $("#entry").val();
            var eid = getUrlVars()["journal"];
            var dataString = "title=" + title + "&entry=" + entry + "&eid=" + eid + "&update=" + "&pid=" + pid;

            if ($.trim(entry).length > 0 && $.trim(title).length > 0 && $.trim(eid).length > 0) {
                $.ajax({
                    type: "POST",
                    url: "http://vet.cscapstone.us/virtual/phpcode/updateJournalEntries.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () { $("#update").val('Connecting...'); },
                    success: function (data) {
                        if (data == "success") {
                            alert("Journal entry updated");
                            $("#update").val('update');
                        }
                        else if (data == "error") {
                            alert("error");
                        }
                    }
                });
            } return false;
        });
    });
});