var wIcon = 'img/purplebox-woman.png';
var mIcon = 'img/bluebox-men.png';
var cIcon = 'img/graybox-champion.png';
var pIcon = 'img/blackbox-professional.png';
var redirectURI = document.URL;
var clientID = "a88e7b45-fa45-4d05-829e-975681adc580";
var model;
var map;
var markers = [];
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
        zoom: 18,
        scrollwheel: false,
        disableDefaultUI: true
    });

    var marker = new google.maps.Marker({
        position: location,
        map: map,
        title: "Old St. Andrews"
    });
    var id = $("#tee").value;
    $('#courseName').append(" for " + model.course.name);
    findPar();
}
function submitSettings() {
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
    for (var i = 0; i <= 17; i++) {
        loadYards('professional', i);
        loadYards('champion', i);
        loadYards('women', i);
        loadYards('men', i);
        ui++;
    }
}
function findHoleCenter(id) {
    var eindex = /(\d+)(?!.*\d)/.exec(id);
    var ei = Number(eindex[1]) - 1;
    var maplat = model.course.holes[ei].green_location.lat;
    var maplong = model.course.holes[ei].green_location.lng;
    var teelat = model.course.holes[ei].tee_boxes[0].location.lat;
    var teelong = model.course.holes[ei].tee_boxes[0].location.lng;
    var holelat = Number(maplat + teelat)/2;
    var holelong = Number(maplong + teelong)/2;
    holesCenter(holelat, holelong);
}
function holesCenter(lat, lng) {
    map.setCenter(new google.maps.LatLng(lat, lng));
    map.setZoom(17);
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
        index = 3;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, mIcon);
        }
    }
    if (tee == "women") {
        index = 2;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, wIcon);
        }
    }
    if (tee == "champion") {
        index = 1;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, cIcon);
        }
    }
    if (tee == "professional") {
        index = 0;
        for (var i = 0; i < holecount; i++) {
            teebox = model.course.holes[i].tee_boxes[index].location;
            addMarker(teebox, pIcon);
        }
    }

}
function findPar () {
    var courselength = 18;
    var par;
    var index = 1;
    for (var i = 0; i < courselength; i++) {
        par = Number(model.course.holes[i].tee_boxes[0].par);
        $('#par' + index).text(par);
        index++;
    }
}
var ui = 1;
function loadYards(id, n) {
    var yards, a, yards9, yards18, total18yards, total9yards;
    total18yards = model.course.tee_types[0].par;
    total9yards = model.course.tee_types[0].front_nine_par;
    $('#ptotal18').text(total18yards);
    $('#ptotal9').text(total9yards);
    if (id == 'men') {
        a = 2;
        yards = model.course.holes[n].tee_boxes[a].yards;
        yards18 = model.course.tee_types[a].yards
        yards9 = model.course.tee_types[a].front_nine_yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);

    }
    if (id == 'women') {
        a = 3;
        yards9 = model.course.tee_types[a].front_nine_yards;
        yards18 = model.course.tee_types[a].yards;
        yards = model.course.holes[n].tee_boxes[a].yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);
    }
    if (id == 'champion') {
        a = 1;
        yards9 = model.course.tee_types[a].front_nine_yards;
        yards18 = model.course.tee_types[a].yards;
        yards = model.course.holes[n].tee_boxes[a].yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);
    }
    if (id == 'professional') {
        a = 0;
        yards9 = model.course.tee_types[a].front_nine_yards;
        yards18 = model.course.tee_types[a].yards;
        yards = model.course.holes[n].tee_boxes[a].yards;
        $('#' + id + 'hole' + ui).text(yards);
        $('#' + id + 'totals9').text(yards9);
        $('#' + id + 'totals18').text(yards18);
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
    //var eindex = /(\d+)(?!.*\d)/.exec(id);
    //var ei = eindex[1];
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
    $('#p' + ri + 'totals9').text(sum);
    $('#p' + ri + 'totals18').text(sum);
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
            var ppp = "'" + '#p' + pindex + 'h' + i + "'";
            var newp = "<td id=p" + pindex + "h" + i + " class='show-cell hole" + i + "' contenteditable='true' onblur='totalIt(this.id)' onfocus='stopEnterKey(this.id," + ppp + ")'></td>";
            console.log(newp);
            $('#player' + pindex).append(newp);
        }
        $(playerindex).append("<td id=p" + pindex + "totals9 class='show-cell totals9' contenteditable='false'></td>");
        for (var i = 10; i < 19; i++) {
            ppp = "'" + '#p' + pindex + 'h' + i + "'";
            var new9td = "<td id=p" + pindex + "h" + i + " class='hide hole" + i + "' contenteditable='true' onblur='totalIt(this.id)' onfocus='stopEnterKey(this.id," + ppp + ")'></td>";
            $('#player' + pindex).append(new9td);
        }
        $(playerindex).append("<td id=p" + pindex + "totals18 class='totals18 hide' contenteditable='false'></td>");
    }
    if (holed == 18) {
        for (var i = 1; i < 10; i++) {
            ppp = "'" + '#p' + pindex + 'h' + i + "'";
            newp = "<td id=p" + pindex + "h" + i + " class='show-cell hole" + i + "' contenteditable='true' onblur='totalIt(this.id)' onfocus='stopEnterKey(this.id," + ppp + ")'></td>";
            $('#player' + pindex).append(newp);
        }
        $(playerindex).append("<td id=p" + pindex + "totals9 class='hide totals9' contenteditable='false'></td>");
        for (var i = 10; i < 19; i++) {
            ppp = "'" + '#p' + pindex + 'h' + i + "'";
            newp = "<td id=p" + pindex + "h" + i + " class='show-cell hole" + i + "' contenteditable='true' onblur='totalIt(this.id)' onfocus='stopEnterKey(this.id," + ppp + ")'></td>";
            $('#player' + pindex).append(newp);
        }
        $(playerindex).append("<td id=p" + pindex + "totals18 class='totals18 show-cell' contenteditable='false'></td>");
    }
    activatecb('p' + pindex + 'cb', true);
    $('#p' + pindex + 'Name').focus();
    pindex++;
}
function activatecb(id, torf) {
    var ids = $('#' + id);
    var crow = ids.closest("tr");
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
(function($){
    $.fn.focusTextToEnd = function(){
        this.focus();
        var $thisVal = this.val();
        this.val('').val($thisVal);
        return this;
    }
}(jQuery));
var count = 1;
function stopEnterKey(id, next) {
    $('#' + id).on('keydown', function(e) {
        var idR = $("#playersTable").find("tr").last();
        if(e.keyCode == 13)
        {
            var answer = $(next).closest('tr');
            if (answer == idR) {
                count++;
                $('#p1hole' + count).focus();
                e.preventDefault();
            }
            //if (next.parent() == idR) {
            //
            //}
            $(next).focus();
            e.preventDefault();
        }
    });
}
function emButtonclicked() {

    // parse playersTable for td values
    // use localStorage to store values for innerText
    // email scores and winners to email addresses that are set up on the email page
    var table = $('#playersTable').tableToJSON();// Convert the table into a javascript object
    localStorage.setItem('scores', JSON.stringify(table));
    window.open('email.html');
}
// sorting has screwed everything else up. Need to figure out a better way
//$('thead th').each(function(column) {
//    $(this).addClass('sortable').click(function(){
//        var findSortKey = function($cell) {
//            return $cell.find('.sort-key').text().toUpperCase() + ' ' + $cell.text().toUpperCase();
//        };
//        var sortDirection = $(this).is('.sorted-asc') ? -1 : 1;
//
//        //step back up the tree and get the rows with data
//        //for sorting
//        var $rows = $(this).parent().parent().parent().find('tbody tr').get();
//
//        //loop through all the rows and find
//        $.each($rows, function(index, row) {
//            row.sortKey = findSortKey($(row).children('td').eq(column));
//        });
//
//        //compare and sort the rows alphabetically
//        $rows.sort(function(a, b) {
//            if (a.sortKey < b.sortKey) return -sortDirection;
//            if (a.sortKey > b.sortKey) return sortDirection;
//            return 0;
//        });
//
//        //add the rows in the correct order to the bottom of the table
//        $.each($rows, function(index, row) {
//            $('tbody').append(row);
//            row.sortKey = null;
//        });
//
//        //identify the column sort order
//        $('th').removeClass('sorted-asc sorted-desc');
//        var $sortHead = $('th').filter(':nth-child(' + (column + 1) + ')');
//        sortDirection == 1 ? $sortHead.addClass('sorted-asc') : $sortHead.addClass('sorted-desc');
//
//        //identify the column to be sorted by
//        $('td').removeClass('sorted')
//            .filter(':nth-child(' + (column + 1) + ')')
//            .addClass('sorted');
//
//        $('.visible td').removeClass('odd');
//    });
//});



