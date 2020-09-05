$(document).ready(function () {
    //Check if this page was reached because the user accessed another page while logged out or pressed the logout button
    if (sessionStorage.getItem("sessionFail") == "true" || sessionStorage.getItem("sessionID") != null) {
        alert("You were logged out");
        sessionStorage.setItem("sessionFail", "false");
        sessionStorage.setItem("sessionID", null);
    }
    if (sessionStorage.getItem("newAccount") == "true") {
        alert("This is a Beta version released only for testing purposes. Information entered may not be secure. Do not enter any sensitive info.");
        sessionStorage.setItem("newAccount", "false");
    }

    //When the user presses "login" process the login credentials provided
    $("#login").click(function () {
        var ParticipantID = $("#ParticipantID").val();
        var Password = $("#Password").val();
        var dataString = "ParticipantID=" + ParticipantID + "&Password=" + Password + "&login=";
        console.log('test');
        if ($.trim(ParticipantID).length > 0 & $.trim(Password).length > 0) {
            $.ajax({
                type: "POST",
                url: "../phpcode/login.php",
                data: dataString,
                crossDomain: true,
                cache: false,
                beforeSend: function () { $("#login").val('Connecting...'); },
                success: function (data) {
                    if (data == "invalid") {
                        alert("invalid");
                    }
                    else if (data == "") {
                        alert("Session error");
                    }
                    else {
                        $("#login").val('submit');
                        //Store the PHP session ID
                        sessionStorage.setItem("sessionFail", "false");
                        sessionStorage.setItem("sessionID", data);
                        window.location.href = "home.html"
                    }
                }
            });
        } return false;
    });
});