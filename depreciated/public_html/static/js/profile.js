$(document).ready(function () {
    var pid;
    //Get PID from sessionHandler.js
    handleSessions(function (pid) {

        var dataString = "pid=" + pid;
        if ($.trim(pid).length > 0) {
            $.ajax({
                url: "http://vet.cscapstone.us/virtual/phpcode/viewProfile.php",
                type: "POST",
                context: document.body,
                data: dataString,
                success: function (data) {
                    var returnArray = JSON.parse(data);

                    document.getElementById("first").value = returnArray[0].FirstName;
                    document.getElementById("last").value = returnArray[0].LastName;

                    document.getElementById("hobbies").value = returnArray[0].Hobbies;
                    document.getElementById("occupation").value = returnArray[0].Occupation;

                    document.getElementById("birth").value = returnArray[0].DateOfBirth;

                    var relationship = returnArray[0].Relationship;

                    if (relationship == "married") {
                        document.getElementById("relationship_m").checked = true;
                    }
                    if (relationship == "single") {
                        document.getElementById("relationship_s").checked = true;
                    }
                }
            });
        }
    });


    $("#update").click(function () {
        var pid;
        //Get PID from sessionHandler.js
        handleSessions(function (pid) {
            var LastName = $("#last").val();
            var FirstName = $("#first").val();
            var birth = $("#birth").val();
            var relationship = $("input[name='relationship']:checked").val();
            var occupation = $("#occupation").val();
            var hobbies = $("#hobbies").val();

            var dataString = "LastName=" + LastName + "&FirstName=" + FirstName + "&occupation=" + occupation + "&birth=" + birth + "&relationship=" + relationship + "&hobbies=" + hobbies + "&update=" + "&pid=" + pid;
            if ($.trim(pid).length > 0) {
                $.ajax({
                    type: "POST",
                    url: "http://vet.cscapstone.us/virtual/phpcode/updateProfile.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () { $("#update").val('Connecting...'); },
                    success: function (data) {
                        if (data == "success") {
                            alert("Information added");
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