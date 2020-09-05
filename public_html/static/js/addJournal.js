$(document).ready(function () {
    var pid;
    //Get PID from sessionHandler.js
    handleSessions(function (pid) {
        $("#insert").click(function () {
            var title = $("#title").val();
            var entry = $("#entry").val();
            var dataString = "title=" + title + "&entry=" + entry + "&pid=" + pid + "&insert=";
            if ($.trim(title).length > 0 & $.trim(entry).length > 0) {
                $.ajax({
                    type: "POST",
                    url: "http://vet.cscapstone.us/virtual/phpcode/createEntry.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () { $("#insert").val('Connecting...'); },
                    success: function (data) {
                        if (data == "success") {
                            alert("Journal entry added");
                            $("#insert").val('submit');
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