// sessionHandler.js - Handles passing the jquery session data into the php sessions

//Function to ensure the user is currently logged in, 
//Uses callback instead of return to guarantee delivery (as opposed to asynchronous returning, which would result in always returning undefined
function handleSessions(callback) {
    var sessionID = sessionStorage.getItem("sessionID");
    var dataString = "sessionID=" + sessionID;
    $.ajax({
        type: "POST",
        url: "http://vet.cscapstone.us/virtual/phpcode/getPID.php",
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function (data) {
            if (data == "invalid") {
                sessionStorage.setItem("sessionFail", "true");
                window.location.href = "login.html"
                callback(1);
            }
            else {
                callback(data);
            }
        }
    });
};



//All code that references PID must be enclosed with the following function call
//var pid;
//handleSessions(function (pid) {
//<code goes here>
//});

//If this is not done, the POST may be made before the PID is returned from the AJAX (since AJAX is asynchronous)