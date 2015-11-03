var wIcon = 'img/purplebox-woman.png';
var mIcon = 'img/bluebox-men.png';
var cIcon = 'img/graybox-champion.png';
var pIcon = 'img/blackbox-professional.png';
var redirectURI = document.URL;
var clientID = "a88e7b45-fa45-4d05-829e-975681adc580";
var model;
var map;
var markers = [];
var rindex = 4;
var hindex = 1;
var pindex = 5;
var accessToken = getUrlVars().access_token;
var swingBySwing = "https://api.swingbyswing.com/v2/oauth/authorize?scope=read&redirect_uri=" + encodeURI(redirectURI) + "&response_type=token&client_id=" + clientID;
if (accessToken == null) {
    location.replace(swingBySwing);
}
else {
    accessToken = accessToken.replace("\n", "");
    getCourse(51763);
}
function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi,
        function (m, key, value) {
            vars[key] = value;
        });
    return vars;
}

function getCourse(courseId) {
    var xhttp = new XMLHttpRequest();
    var swingLink = "https://api.swingbyswing.com/v2/courses/" + courseId + "?includes=practice_area&access_token=" + accessToken;

    xhttp.onreadystatechange = function () {
        if (xhttp.readyState == 4 && xhttp.status == 200) {
            model = JSON.parse(xhttp.responseText);
            var location = model.course.location;
            initMap(location);
        }
    };
    xhttp.open("GET", swingLink, true);
    xhttp.send();
}

function initMap(location) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 20
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Old St. Andrews"
    });
}

function submitSettings(holecount, tee) {
    var tee = document.getElementById("tee").value;
    var holecount = document.getElementById("holecount").value;
    removeTees(tee);
    addHoles(holecount);
    addTeeBox(holecount, tee);
    if (holecount == 18) {
        addClass(holecount);
    }
    if (holecount == 9) {
        removeClass(holecount, tee);
    }
}
function addHoles(holecount) {
    for (var i = 0; i < holecount; i++) {
        var hole = model.course.holes[i].green_location;
        addHMarker(hole);
    }
}
function addTeeBox(holecount, tee) {
    var index;
    var teebox;
    if (tee == "men") {
        index = 0;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, mIcon);
        }
    }
    if (tee == "women") {
        index = 1;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, wIcon);
        }
    }
    if (tee == "champion") {
        index = 2;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, cIcon);
        }
    }
    if (tee == "professional") {
        index = 3;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, pIcon);
        }
    }

}
function addHMarker(location) {
    var marker = new google.maps.Marker({
        position: location,
        map: map
    });
    markers.push(marker);
}
function addMarker(location, icon) {
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: icon
    });
    markers.push(marker);
}
function setMapOnAll(map) {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
    }
}
function clearMarkers() {
    setMapOnAll(null);
}
function deleteMarkers() {
    clearMarkers();
    markers = [];
}
function settings() {
    var id = '#dialog';


    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    $('#mask').css({'width': maskWidth, 'height': maskHeight});

    $('#mask').fadeIn(500);
    $('#mask').fadeTo("slow", 0.9);

    var winH = $(window).height();
    var winW = $(window).width();

    $(id).css('top', winH / 2 - $(id).height() / 2);
    $(id).css('left', winW / 2 - $(id).width() / 2);

    $(id).fadeIn(2000);

    $('.window .close').click(function (e) {
        e.preventDefault();

        $('#mask').hide();
        $('.window').hide();
    });

    $('#mask').click(function () {
        $(this).hide();
        $('.window').hide();
    });

}
$(document).ready(settings());
// need a function to addClass to
function removeTees(tee) {
    if (tee == "women") {
        $('.women').removeClass('hide').addClass('show-cell');
    }
    if (tee == "men") {
        $('.men').removeClass('hide').addClass('show-cell');
    }
    if (tee == "champion") {
        $('.champion').removeClass('hide').addClass('show-cell');
    }
    if (tee == "professional") {
        $('.professional').removeClass('hide').addClass('show-cell');
    }
}
function addClass() {
    $('.totals9').addClass('hide');
    $('.hole10').removeClass('hide').addClass('show-cell');
    $('.hole11').removeClass('hide').addClass('show-cell');
    $('.hole12').removeClass('hide').addClass('show-cell');
    $('.hole13').removeClass('hide').addClass('show-cell');
    $('.hole14').removeClass('hide').addClass('show-cell');
    $('.hole15').removeClass('hide').addClass('show-cell');
    $('.hole16').removeClass('hide').addClass('show-cell');
    $('.hole17').removeClass('hide').addClass('show-cell');
    $('.hole18').removeClass('hide').addClass('show-cell');
    $('.totals18').removeClass('hide').addClass('show-cell');
}
function removeClass(holecount, tee) {
    $('.totals9').removeClass('hide').addClass('show-cell');
    $('.hole10').removeClass('show-cell').addClass('hide');
    $('.hole11').removeClass('show-cell').addClass('hide');
    $('.hole12').removeClass('show-cell').addClass('hide');
    $('.hole13').removeClass('show-cell').addClass('hide');
    $('.hole14').removeClass('show-cell').addClass('hide');
    $('.hole15').removeClass('show-cell').addClass('hide');
    $('.hole16').removeClass('show-cell').addClass('hide');
    $('.hole17').removeClass('show-cell').addClass('hide');
    $('.hole18').removeClass('show-cell').addClass('hide');
    $('.totals18').removeClass('show-cell').addClass('hide');
    deleteMarkers();
    addHoles(holecount);
    addTeeBox(holecount, tee);
}

function getPlayer(ri, pNum, hole) {

}
var pArray = [];
var holeindex = 1;
function totalIt(id) {

    var reindex = /^[^\d]*(\d+)/.exec(id);
    var ri = reindex[1];
    var eindex = /(\d+)(?!.*\d)/.exec(id);
    var ei = eindex[1];
    var pNum = Number($('#'+id).text());
    var TableData = new Array();

    $('#playersTable tr').each(function(row, tr){
        TableData[row]={
            "name" : $(tr).find('td:eq(0)').text()
            , "hole1" :$(tr).find('td:eq(1)').text()
            , "hole2" : $(tr).find('td:eq(2)').text()
            , "hole3" : $(tr).find('td:eq(3)').text()
            , "hole4" : $(tr).find('td:eq(4)').text()
            , "hole5" : $(tr).find('td:eq(5)').text()
            , "hole6" : $(tr).find('td:eq(6)').text()
            , "hole7" : $(tr).find('td:eq(7)').text()
            , "hole8" : $(tr).find('td:eq(8)').text()
            , "hole9" : $(tr).find('td:eq(9)').text()
            , "hole10" : $(tr).find('td:eq(11)').text()
            , "hole11" : $(tr).find('td:eq(12)').text()
            , "hole12" : $(tr).find('td:eq(13)').text()
            , "hole13" : $(tr).find('td:eq(14)').text()
            , "hole14" : $(tr).find('td:eq(15)').text()
            , "hole15" : $(tr).find('td:eq(16)').text()
            , "hole16" : $(tr).find('td:eq(17)').text()
            , "hole17" : $(tr).find('td:eq(18)').text()
            , "hole18" : $(tr).find('td:eq(19)').text()
        }
    });
    TableData.shift();  // first row is the table header - so remove
    console.log(TableData);
    //var player = function() {
    //    this.name = "p"+ri+"Name";
    //    this.hole1 = pNum;
    //}
    //getPlayer(ri, pNum, ei);
}

function updateTotals() {
    var rowLength = $("#R1" ).children().length;
    console.log(rowLength);
}

        function addRow () {
            var holed = document.getElementById('holecount').value;
            var newplayer = "<tr id=player" + pindex + "></tr>";
            $('#playersTable').append(newplayer);
            var newname = "<td id=p" + pindex +"Name class='nameheading' contenteditable='true'>New Player</td>";
            $('#player'+ pindex).append(newname);
            if (holed == 9 || holed == undefined || holed == '') {
        for (var i = 1; i < 10; i++) {
            var new9td = "<td id=p" + pindex + "h" + i +" class=hole" + i + " contenteditable='true' onblur='totalIt(this.id)'></td>";
            $('#player'+ pindex).append(new9td);
        }
        $('#player'+ pindex).append("<td id=p" + pindex + "totals9 class='show-cell totals9' contenteditable='false'></td>");
        for (var i = 10; i < 19; i++) {
            var new9td = "<td id=p" + pindex + "h" + i +" class=hide hole" + i + " contenteditable='true' onblur='totalIt(this.id)'></td>";
            $('#player'+ pindex).append(new9td);
        }
        $('#player'+ pindex).append("<td id=p" + pindex + "totals18 class='totals18 hide' contenteditable='false'></td>");
    }
    if (holed == 18) {
        for (var i = 1; i < 10; i++) {
            var new9td = "<td id=p" + pindex + "h" + i +" class=hole" + i + " contenteditable='true' onblur='totalIt(this.id)'></td>";
            $('#player'+ pindex).append(new9td);
        }
        $('#player'+ pindex).append("<td id=p" + pindex + "totals9 class='hide totals9' contenteditable='false'></td>");
        for (var i = 10; i < 19; i++) {
            var new9td = "<td id=p" + pindex + "h" + i +" class='hole" + i + " show-cell' contenteditable='true' onblur='totalIt(this.id)'></td>";
            $('#player'+ pindex).append(new9td);
        }
        $('#player'+ pindex).append("<td id=p" + pindex + "totals18 class='totals18 show-cell' contenteditable='false'></td>");
    }
    pindex++;
}
