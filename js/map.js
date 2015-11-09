var wIcon = 'img/purple-tee.png';
var mIcon = 'img/blue-tee.png';
var cIcon = 'img/white-tee.png';
var pIcon = 'img/black-tee.png';
var redirectURI = document.URL;
var clientID = "a88e7b45-fa45-4d05-829e-975681adc580";
var model;
var map;
var markers = [];
var pindex = 5;
var tees = [];
var teeboxes = [];
var course;
var ui = 1;
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
            course = model.course;
            initMap(location);
        }
    };
    xhttp.open("GET", swingLink, true);
    xhttp.send();
}
function submitSettings() {
    var tee = $("#tee").val();
    var holecount = $("#holecount").val();
    removeTees(tee);
    addHoles(holecount);
    addTeeBox(holecount, tee);

    if (holecount == 18) {
        addClass(holecount);
    }
    if (holecount == 9) {
        removeClass(holecount, tee);
        setMapOnTees(map);
    }
    for (var i = 0; i <= 17; i++) {
        loadYards('professional', i);
        loadYards('champion', i);
        loadYards('women', i);
        loadYards('men', i);
        ui++;
    }
}
function initMap(location) {
    map = new google.maps.Map(document.getElementById('map'), {
        center: location,
        zoom: 18,
        scrollwheel: false,
        mapTypeId: google.maps.MapTypeId.SATELLITE,
        panControl: true,
        mapTypeControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        zoomControl: true,
        zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.RIGHT_CENTER
        },
        scaleControl: false,
        streetViewControl: false,
        streetViewControlOptions: {
            position: google.maps.ControlPosition.RIGHT_CENTER
        }
    });
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Old St. Andrews"
    });
    $('#courseName').append(" for " + course.name);
    findPar();

}
function findHoleCenter(id) {
    var eindex = /(\d+)(?!.*\d)/.exec(id);
    var ei = Number(eindex[1]) - 1;
    var maplat = course.holes[ei].green_location.lat;
    var maplong = course.holes[ei].green_location.lng;
    var teelat = course.holes[ei].tee_boxes[0].location.lat;
    var teelong = course.holes[ei].tee_boxes[0].location.lng;
    var holelat = Number(maplat + teelat)/2;
    var holelong = Number(maplong + teelong)/2;
    var loc = {'lat': maplat, "lng": maplong};
    holesCenter(holelat, holelong);
    deleteMarkers();
    addHMarker(loc);
    deleteTees();
    for (var i = 0; i < teeboxes.length; i++) {
        addSingleTee(ei, teeboxes[i]);
    }
}
function holesCenter(lat, lng) {
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(16);
}
function addHoles(holecount) {
    for (var i = 0; i < holecount; i++) {
        var hole = course.holes[i].green_location;
        addHMarker(hole);
    }
}
function addSingleTee(hole, tee) {
    var teebox, icon;
    if (tee == 'men') {
        teebox = course.holes[hole].tee_boxes[3].location;
        icon = mIcon;
        addMarker(teebox, icon);
    }
    if (tee == 'women') {
        teebox = course.holes[hole].tee_boxes[2].location;
        icon = wIcon;
        addMarker(teebox, icon);
    }
    if (tee == 'professional') {
        teebox = course.holes[hole].tee_boxes[0].location;
        icon = pIcon;
        addMarker(teebox, icon);
    }
    if (tee == 'champion') {
        teebox = course.holes[hole].tee_boxes[1].location;
        icon = cIcon;
        addMarker(teebox, icon);
    }
}
function addTeeBox(holecount, tee) {
    var index;
    var teebox;
    if (tee == "men") {
        teeboxes.push('men');
        index = 3;
        for (var i = 0; i < holecount; i++) {
            teebox = course.holes[i].tee_boxes[index].location;
            addMarker(teebox, mIcon);
        }
    }
    if (tee == "women") {
        teeboxes.push('women');
        index = 2;
        for (var i = 0; i < holecount; i++) {
            teebox = course.holes[i].tee_boxes[index].location;
            addMarker(teebox, wIcon);
        }
    }
    if (tee == "champion") {
        teeboxes.push('champion');
        index = 1;
        for (var i = 0; i < holecount; i++) {
            teebox = course.holes[i].tee_boxes[index].location;
            addMarker(teebox, cIcon);
        }
    }
    if (tee == "professional") {
        teeboxes.push('champion');
        index = 0;
        for (var i = 0; i < holecount; i++) {
            teebox = course.holes[i].tee_boxes[index].location;
            addMarker(teebox, pIcon);
        }
    }

}
function findPar () {
    var courselength = 18;
    var par, hc;
    var index = 1;
    for (var i = 0; i < courselength; i++) {
        par = Number(course.holes[i].tee_boxes[0].par);
        hc = Number(course.holes[i].tee_boxes[0].hcp);
        $('#par' + index).text(par);
        $('#hc' + index).text(hc);
        index++;
    }
}
function loadYards(id, n) {
    var yards, a, yards9, yards18, total18yards, total9yards;
    total18yards = course.tee_types[0].par;
    total9yards = course.tee_types[0].front_nine_par;
    $('#ptotal18').text(total18yards);
    $('#ptotal9').text(total9yards);
    if (id == 'men') {
        a = 2;
        yards = course.holes[n].tee_boxes[a].yards;
        yards18 = course.tee_types[a].yards
        yards9 = course.tee_types[a].front_nine_yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);

    }
    if (id == 'women') {
        a = 3;
        yards9 = course.tee_types[a].front_nine_yards;
        yards18 = course.tee_types[a].yards;
        yards = course.holes[n].tee_boxes[a].yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);
    }
    if (id == 'champion') {
        a = 1;
        yards9 = course.tee_types[a].front_nine_yards;
        yards18 = course.tee_types[a].yards;
        yards = course.holes[n].tee_boxes[a].yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);
    }
    if (id == 'professional') {
        a = 0;
        yards9 = course.tee_types[a].front_nine_yards;
        yards18 = course.tee_types[a].yards;
        yards = course.holes[n].tee_boxes[a].yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);
    }
}
function addHMarker(location) {
    var pinIcon = new google.maps.MarkerImage(
        'img/golfflag.png',
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(60, 62)
    );
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinIcon
    });
    markers.push(marker);
}
function addMarker(location, icon) {
    var pinIcon = new google.maps.MarkerImage(
        icon,
        null, /* size is determined at runtime */
        null, /* origin is 0,0 */
        null, /* anchor is bottom center of the scaled image */
        new google.maps.Size(20, 42)
    );
    var marker = new google.maps.Marker({
        position: location,
        map: map,
        icon: pinIcon
    });
    tees.push(marker);
    markers.push(marker);
}
function setMapOnTees(map) {
    for (var i = 0; i <tees.length; i++) {
        tees[i].setMap(map);
    }
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
function deleteTees() {
    setMapOnTees(null);
    tees = [];
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
function finalTotals() {
    var count = $('#ptbody').children('tr').length;
    var last, current, min, winner, pnamewin, pnamelose;
    var totalsarr = [];
    var holenum = Number($("#holecount").val());
    if (holenum == 9) {
        for (var i = 1; i <= count; i++) {

            pnamewin = '<div id="pnamewin">' + $('#p' + i + 'Name').text() + ' You should be on the PGA Tour!! </div>';
            pnamelose = '<div id="pnamelose">' + $('#p' + i + 'Name').text() + ' You need more practice!! </div>';
            current = Number($('#p' + i + 'totals9').text());
            totalsarr.push(current);
            if (current < 0) {
                $('#playersContainer').append(pnamewin);
            }
            else {
                $('#playersContainer').append(pnamelose);

            }
            min = Math.min.apply(Math, totalsarr);
        }
        for (var j = 1; j <= count; j++) {
            current = Number($('#p' + j + 'totals9').text());
            if (current == min) {
                winner = $('#p' + j + 'Name').text();
            }
        }
        $('#winner').text(winner + ' Wins!');
        setInterval(blinker, 1000);
    }
    if (holenum == 18) {
        for (var k = 1; k <= count; k++) {

            pnamewin = '<div id="pnamewin">' + $('#p' + k + 'Name').text() + ' You should be on the PGA Tour!! </div>';
            pnamelose = '<div id="pnamelose">' + $('#p' + k + 'Name').text() + ' You need more practice!! </div>';
            current = Number($('#p' + k + 'totals18').text());
            totalsarr.push(current);
            if (current < 0) {
                $('#playersContainer').append(pnamewin);
            }
            else {
                $('#playersContainer').append(pnamelose);

            }
            min = Math.min.apply(Math, totalsarr);
        }
        for (var l = 1; l <= count; l++) {
            current = Number($('#p' + l + 'totals18').text());
            if (current == min) {
                winner = $('#p' + l + 'Name').text();
            }
        }
        $('#winner').text(winner + ' Wins');
        setInterval(blinker, 1000);
    }
}
function blinker() {
    $('#winner').fadeOut(500);
    $('#winner').fadeIn(500);
}
function clearTable() {
    $('#ptbody').empty();
    var count = 4;
    pindex = 1;
    for (var i = 0; i != count; i++) {
        addRow();
    }
}
function endGame() {
    $('#egdialog').removeClass('hide');
    var id = '#egdialog';
    var maskHeight = $(document).height();
    var maskWidth = $(window).width();

    $('#maskeg').css({'width': maskWidth, 'height': maskHeight});

    $('#maskeg').fadeIn(500);
    $('#maskeg').fadeTo("slow", 0.9);

    var winH = $(window).height();
    var winW = $(window).width();

    $(id).css('top', winH / 2 - $(id).height() / 2);
    $(id).css('left', winW / 2 - $(id).width() / 2);

    $(id).fadeIn(2000);

    $('.window .close').click(function (e) {
        e.preventDefault();

        $('#maskeg').hide();
        $('.window').hide();
    });

    $('#maskeg').click(function () {
        $(this).hide();
        $('.window').hide();
        $('#playersContainer').empty();
        $('#winner').text('');
    });
}
function removeTees(tee) {
    if (tee == "women") {
        $('.women').removeClass('hide').addClass('show-row');
    }
    if (tee == "men") {
        $('.men').removeClass('hide').addClass('show-row');
    }
    if (tee == "champion") {
        $('.champion').removeClass('hide').addClass('show-row');
    }
    if (tee == "professional") {
        $('.professional').removeClass('hide').addClass('show-row');
    }
}
function addClass() {
    $('.totals9').addClass('hide');
    for (var i = 10; i != 19; i++) {
        $('.hole' + i).removeClass('hide').addClass('show-cell');
    }
    $('.totals18').removeClass('hide').addClass('show-cell');
}
function removeClass(holecount, tee) {
    $('.totals9').removeClass('hide').addClass('show-cell');
    for (var i = 10; i != 19; i++) {
        $('.hole' + i).removeClass('show-cell').addClass('hide');
    }
    $('.totals18').removeClass('show-cell').addClass('hide');
    deleteMarkers();
    addHoles(holecount);
    addTeeBox(holecount, tee);
}
function totalIt(id) {

    var reindex = /^[^\d]*(\d+)/.exec(id);
    var ri = reindex[1];
    var eindex = /(\d+)(?!.*\d)/.exec(id);
    var ei = Number(eindex[1]);
    var sum = 0;
    for (var i = 1; i != 19; i++) {
        var hsum = Number($('#p' + ri + 'h' + i).text());
        var par = $('#par' + i).text();
        if (hsum == 0) {
            sum += hsum;
        }
        else {
            hsum = hsum - par;
            sum += hsum;
        }
    }
    if (ei < 9) {
        $('#p' + ri + 'totals9').text(sum);
        $('#p' + ri + 'totals18').text(sum);
    }
    else {
        $('#p' + ri + 'totals18').text(sum);
    }


}
function addRow() {
    var holed = document.getElementById('holecount').value;
    var newplayer = "<tr id=player" + pindex + "></tr>";
    $('#playersTable').append(newplayer);
    var playerindex = '#player' + pindex;
    var newcb = "<td id=p" + pindex + "cb cbhover onclick='activatecb(this.id, true)'><i class='fa fa-pencil'></i></td>";
    $(playerindex).append(newcb);
    var newname = "<td id=p" + pindex + "Name class='nameheading' contenteditable='false' placeholder='New Player'></td>";
    $(playerindex).append(newname);
    //activatecb('#p' + pindex + 'cb', true);
    if (holed == 9 || holed == undefined || holed == '') {
        for (var i = 1; i < 10; i++) {
            ppp = "\'" + '#p' + pindex + 'h' + i + "\'";
            var newp = "<td id=p" + pindex + "h" + i + " class='show-cell hole" + i + "' contenteditable='true' onblur='totalIt(this.id)')></td>";
            $('#player' + pindex).append(newp);
            $('#p' + pindex + 'h' + i +'').attr('onfocus', 'stopEnterKey(this.id, ' + ppp + ')');
        }
        $(playerindex).append("<td id=p" + pindex + "totals9 class='show-cell totals9' contenteditable='false'></td>");
        for (var i = 10; i < 19; i++) {
            ppp = "\'" + '#p' + pindex + 'h' + i + "\'";
            var new9td = "<td id=p" + pindex + "h" + i + " class='hide hole" + i + " contenteditable='true' onblur='totalIt(this.id)')></td>";
            $('#player' + pindex).append(new9td);
            $('#p' + pindex + 'h' + i +'').attr('onfocus', 'stopEnterKey(this.id, ' + ppp + ')');
        }
        $(playerindex).append("<td id=p" + pindex + "totals18 class='totals18 hide' contenteditable='false'></td>");
    }
    if (holed == 18) {
        for (var i = 1; i < 10; i++) {
            ppp = "\'" + '#p' + pindex + 'h' + i + "\'";
            newp = "<td id=p" + pindex + "h" + i + " class='hole" + i + "' contenteditable='true' onblur='totalIt(this.id)')></td>";
            $('#player' + pindex).append(newp);
            $('#p' + pindex + 'h' + i +'').attr('onfocus', 'stopEnterKey(this.id, ' + ppp + ')');
        }
        $(playerindex).append("<td id=p" + pindex + "totals9 class='hide totals9' contenteditable='false'></td>");
        for (var i = 10; i < 19; i++) {
            ppp = "\'" + '#p' + pindex + 'h' + i + "\'";
            newp = "<td id=p" + pindex + "h" + i + " class='hole" + i + "' contenteditable='true' onblur='totalIt(this.id)')></td>";
            $('#player' + pindex).append(newp);
            $('#p' + pindex + 'h' + i +'').attr('onfocus', 'stopEnterKey(this.id, ' + ppp + ')');
        }
        $(playerindex).append("<td id=p" + pindex + "totals18 class='totals18 show-cell' contenteditable='false'></td>");
    }
    activatecb('p' + pindex + 'cb', true);
    $('#p' + pindex + 'Name').focus();
    pindex++;
}
function activatecb(id, torf) {
    var ids = $('#' + id);
    var acbf = 'activatecb(id, false)';
    var acbt = 'activatecb(id, true)';
    if (torf) {
        ids.removeClass('cb').addClass('checkactive cbhover');
        $('.cb').removeAttr("onclick");
        ids.attr("onclick", acbf);
        ids.next().attr("contenteditable", true);
        ids.next().focus();
        var tmpStr = ids.next().text();
        ids.next().text('');
        ids.next().text(tmpStr);
        $('#removeP').removeClass('hide');
        $('#addP').addClass('hide');
    }
    if (!torf) {
        ids.removeClass('checkactive').addClass('cb cbhover');
        ids.next().attr("contenteditable", false);
        $('.cb').attr("onclick", acbt);
        $('#removeP').addClass('hide');
        $('#addP').removeClass('hide');
    }
}
function deleteRow() {
    var deleteit = $('.checkactive').closest('tr');
    $(deleteit).remove();
    $('.cb').removeClass('checkactive').addClass('cb cbhover').attr("onclick", "activatecb(this.id, true)");
    $('#addP').removeClass('hide');
    $('#removeP').addClass('hide');

}
function stopEnterKey(id, next) {
    $('#' + id).on('keydown', function(e) {
        var count = $('#ptbody').children('tr').length;
        var reindex = /^[^\d]*(\d+)/.exec(id);
        var ri = Number(reindex[1]);
        var eindex = /(\d+)(?!.*\d)/.exec(id);
        var ei = Number(eindex[1]);
        if(e.keyCode == 13)
        {
            if (ri == (count)) {
                $('#p1' + 'h' + (ei+1) + '').focus();
                e.preventDefault();
            }
            else {
                $(next).focus();
                e.preventDefault();
            }
        }
    });
}
$(document).ready(settings());