$(document).ready(function () {
    $("#insert").click(function () {
        var ParticipantID = $("#ParticipantID").val();
        var Password = $("#Password").val();
        var dataString = "ParticipantID=" + ParticipantID + "&Password=" + Password + "&insert=";
        if ($.trim(ParticipantID).length > 0 & $.trim(Password).length > 0) {
            $.ajax({
                type: "POST",
                url: "../phpcode/insert.php",
                data: dataString,
                crossDomain: true,
                cache: false,
                beforeSend: function () { $("#insert").val('Connecting...'); },
                success: function (data) {
                    if (data == "success") {
                        $("#insert").val('submit');
                        sessionStorage.setItem("newAccount", "true");
                        window.location.href = "login.html"
                    }
                    else if (data == "error") {
                        alert("error");
                        $("#insert").val('Register');
                    }
                }
            });
        } return false;
    });
});