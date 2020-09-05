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

        var rid = getUrlVars()["prayer"];
        var dataString = "rid=" + rid + "&pid=" + pid;
        if ($.trim(rid).length > 0) {
            //Get request body
            $.ajax({
                url: "http://vet.cscapstone.us/virtual/phpcode/viewPrayerEntry.php",
                type: "POST",
                context: document.body,
                data: dataString,
                success: function (data) {
                    var returnArray = JSON.parse(data);
                    //Add elements to list
                    //    var prayerList = document.getElementById("prayerList");

                    var prayerEntry = document.getElementById("entry");
                    prayerEntry.textContent = returnArray[0].PrayerText;


                    var prayerTitle = document.getElementById("title");
                    prayerTitle.textContent = returnArray[0].Title;



                    var prayerFrequency = document.getElementById("frequency");
                    prayerFrequency.textContent = returnArray[0].Frequency;

                }
            });
            //Get request tags
            dataString = dataString + "&tagging=";
            $.ajax({
                url: "http://vet.cscapstone.us/virtual/phpcode/getTagsPrayer.php",
                type: "POST",
                context: document.body,
                data: dataString,
                success: function (data) {
                    var returnArray = JSON.parse(data);
                    //Add elements to list
                    for (var i = 0; i < returnArray.length; i++) {
                        var tagText = returnArray[i];
                        var tagList = document.getElementById("tagList");
                        $(".tagList").append("<a class='tag' id='" + tagText + "-a' >" + tagText + '<span class="cross" id="' + tagText + '-s" onclick="deleteTags(\'' + tagText + '\')">X</span>' + "</a>");
                        tags.push(tagText);
                    }



                }
            });
        }

        $("#update").click(function () {

            var title = $("#title").val();
            var entry = $("#entry").val();
            var frequency = $("#frequency").val();
            var rid = getUrlVars()["prayer"];
            var dataString = "title=" + title + "&entry=" + entry + "&frequency=" + frequency + "&rid=" + rid + "&pid=" + pid + "&update=";

            if ($.trim(entry).length > 0 && $.trim(title).length > 0 && $.trim(rid).length > 0 && $.trim(frequency).length > 0) {
                $.ajax({
                    type: "POST",
                    url: "http://vet.cscapstone.us/virtual/phpcode/updatePrayerEntries.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () { $("#update").val('Connecting...'); },
                    success: function (data) {
                        if (data == "success") {
                            alert("Prayers updated");
                            $("#update").val('Update Prayer Request');
                            setTags(rid);
                        }
                        else if (data == "error") {
                            alert("error");
                        }
                        else {
                            alert(data);
                        }
                    }
                });
            } return false;
        });

        $("#resolve").click(function () {

            var rid = getUrlVars()["prayer"];
            var dataString = "rid=" + rid + "&pid=" + pid + "&resolve=";

            if ($.trim(rid).length > 0) {
                $.ajax({
                    type: "POST",
                    url: "http://vet.cscapstone.us/virtual/phpcode/resolvePrayerEntry.php",
                    data: dataString,
                    crossDomain: true,
                    cache: false,
                    beforeSend: function () { $("#resolve").val('Connecting...'); },
                    success: function (data) {
                        if (data == "success") {
                            alert("Prayers updated");
                            $("#resolve").val('resolved');
                        }
                        else if (data == "error") {
                            alert("error");
                        }
                    }
                });
            } return false;
        });
    });


    function getUrlVars() {
        var vars = {};
        var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
            vars[key] = value;
        });
        return vars;
    }


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