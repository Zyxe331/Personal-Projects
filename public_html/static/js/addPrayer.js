//Initialize tags array
var tags = [];

$(document).ready(function () {
    var pid;

    //Get PID from sessionHandler.js
    handleSessions(function (pid) {

        //Get the list of tags and populate the tag selector
        $.ajax({
            type: "POST",
            url: "http://vet.cscapstone.us/virtual/phpcode/getTags.php",
            data: "",
            crossDomain: true,
            cache: false,
            success: function (data) {
                if (data == "error") {
                    alert("Error generating tags");
                }
                else {      //data will be a JSON array containing the list of tags (attributes: TagID, Title)
                    var returnArray = JSON.parse(data);

                    //Add elements to list
                    var cyclelist = document.getElementById("tags");
                    for (var i = 0; i < returnArray.length; ++i) {
                        var option = document.createElement("option");
                        option.text = returnArray[i].Title;
                        option.value = returnArray[i].TagID;
                        cyclelist.add(option);
                    }
                }

            }
        });

        document.querySelector("#startDate").valueAsDate = new Date();


        $("#insert").click(function () {


            var title = $("#title").val();
            var prayer = $("#prayer").val();
            var frequency = $("#frequency").val();
            var startDate = $("#startDate").val();
            var dataString = "title=" + title + "&prayer=" + prayer + "&frequency=" + frequency + "&startDate=" + startDate + "&pid=" + pid + "&insert=";

            if ($.trim(title).length > 0 & $.trim(prayer).length > 0) {
                $.ajax({
                    type: "POST",
                    url: "http://vet.cscapstone.us/virtual/phpcode/addPrayer.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () { $("#insert").val('Connecting...'); },
                    success: function (data) {
                        if (data == "error") {
                            alert("error");
                        }
                        else {      //data will be the ID of the added prayer request
                            alert("Prayer added");
                            $("#insert").val('submit');
                            setTags(data);  //Set the tags that were added to the request
                        }

                    }
                });
            } return false;
        });


    });
});

function onTagChange() {
    //Get elements
    var tagSelect = document.getElementById("tags");
    var tagText = tagSelect.options[tagSelect.selectedIndex].text
    var tagList = document.getElementById("tagList");

    //Check if the tag is already in the tags array
    if (tags.indexOf(tagText) == -1) {
        //Add the tag
        //Something needs to be done to prevent this from just running off the screen
        $(".tagList").append("<a class='tag' id='" + tagText + "-a' >" + tagText + '<span class="cross" id="' + tagText + '-s" onclick="deleteTags(\'' + tagText + '\')">X</span>' + "</a>");
        tags.push(tagText);
        tagSelect.value = "";
    } else {
        alert("This tag is already selected");
        tagSelect.value = "";
    }
}

function deleteTags(tagText) {
    //Get the index of the tag and then delete it
    var index = tags.indexOf(tagText);
    if (index != -1) {
        tags.splice(index, 1);
    }

    //Remove the tag visually
    var tagSpan = document.getElementById(tagText + "-s");
    var tagA = document.getElementById(tagText + "-a");
    tagSpan.parentNode.removeChild(tagSpan);
    tagA.parentNode.removeChild(tagA);

}

//Set the tags for the created prayer request
function setTags(RID) {
    var dataString = "RID=" + RID;
    for (var i = 0; i < tags.length; i++) {
        dataString = dataString + "&" + tags[i] + "=true";
    }
    dataString = dataString + "&tagging=";

    $.ajax({
        type: "POST",
        url: "http://vet.cscapstone.us/virtual/phpcode/setTagsPrayer.php",
        data: dataString,
        crossDomain: true,
        cache: false,
        success: function (data) {

        }
    });
}