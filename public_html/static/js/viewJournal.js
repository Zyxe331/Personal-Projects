//Propagate cycle list
$(document).ready(function () {
    var pid;
      //Get PID from sessionHandler.js
    handleSessions(function (pid) {
        var dataString = "pid=" + pid;
        $.ajax({
            url: "http://vet.cscapstone.us/virtual/phpcode/viewJournal.php",
            type: "POST",
            context: document.body,
            data: dataString,
            success: function (data) {
                var returnArray = JSON.parse(data);
                //Add elements to list
                var journalList = document.getElementById("journalList");
                
                if (returnArray.length == 0)
                    {
                    journalList.setAttribute("style", "display: none;");
                    document.getElementById("selectJournal").setAttribute("style", "display: none;");
                    var emptymsgNode = document.createTextNode("No journals yet.");
                    var linkNode = document.createElement("a");
                    linkNode.innerHTML = "Make one now!";
                    linkNode.setAttribute("href", "addJournal.html");
                    
                    var listBox = document.getElementById("journalListBox");
                    listBox.appendChild(emptymsgNode)
                    listBox.appendChild(document.createElement("br"));
                    listBox.appendChild(linkNode);						
                    }
                    else
                        {
                        for (var i = 0; i < returnArray.length; ++i) {
                        var journalEntry = document.createElement("option");
                        journalEntry.text = returnArray[i].Title;
                        journalEntry.value = returnArray[i].EntryID;
                        journalList.add(journalEntry);
                        }
                    }
            }
        });
    });
    
});

function selectJournal() {
    var selection = document.getElementById("journalList").value;
    console.log(selection);
    if (selection == "") {
        alert("Choose a Journal entry.");
    }
    else {
        window.location.href = "editJournal.html" + "?journal=" + selection;
    }

}