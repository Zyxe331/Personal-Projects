//Propagate cycle list
$(document).ready(function () {
    var pid;
    //Get PID from sessionHandler.js
    handleSessions(function (pid) {
        var dataString = "pid=" + pid;
        $.ajax({
            url: "http://vet.cscapstone.us/virtual/phpcode/displaycycles.php",
            type: "POST",
            context: document.body,
            data: dataString,
            success: function (data) {
                var returnArray = JSON.parse(data);


                //Add elements to list

                var cycleBox = document.getElementById("cycleBox");

                for (var i = 0; i < returnArray.length; ++i) {


                    // develop button text
                    var cycleBtnTxt = document.createElement("div");
                    cycleBtnTxt.innerHTML = returnArray[i].Title;
                    cycleBtnTxt.setAttribute("class", "submitBtnTxt");

                    // develop button text box
                    var cycleBtnTxtBox = document.createElement("div");
                    cycleBtnTxtBox.setAttribute("class", "devobtntxt");

                    // develop button box
                    var cycleBtn = document.createElement("div");
                    cycleBtn.setAttribute("class", "devoNav");


                    // develop button link
                    var cycleLink = document.createElement("a");
                    cycleLink.setAttribute("href", "contentReader.html" + "?cycle=" + returnArray[i].CycleID);

                    // build button from the inside out
                    cycleBtnTxtBox.appendChild(cycleBtnTxt);
                    cycleBtn.appendChild(cycleBtnTxtBox);
                    cycleLink.appendChild(cycleBtn);
                    cycleBox.appendChild(cycleLink);
                }
            }
        });
    });
});

//Select cycle
function selectCycle() {
    var selection = document.getElementById("cyclelist").value;
    if (selection == "") {
        alert("Choose a content cycle.");
    }
    else {
        window.location.href = "contentReader.html" + "?cycle=" + selection;
    }

}