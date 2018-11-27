$(document).ready(function () {
    var EventId = GetParameterValues();
    function GetParameterValues() {
        var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
        var urlparam = url[0].split('=');
        return urlparam[1];
    }
    $.ajax({
        url: nodeURL + '/eventwithphotos/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            $.each(result, function (index, value) {
                if (result[index].EventId == EventId) {
                    $('#name').html(result[index].EventName);
                    $('#venue').html(result[index].EventVenue);
                    $('#date').html(moment(result[index].EventDate, "DD-MM-YYYY").format("DD-MM-YYYY"));
                    eventDescription = result[index].EventDescription;
                    $('#description').html($(eventDescription).text());
                    $.each(result[index].EventWithPhoto, function (key, value) {
                        var mainDiv = $(' <div class="col-xs-12 col-sm-4 col-md-4 mb-20" >');
                        var imageDiv = $(' <div class="image-box-thum">');
                        var imageTag = $('<img>');
                        imageDiv.height(230);
                        imageDiv.width(350)
                        imageTag.attr('src', (nodeURL + "/getEventPhotos/" + result[index].EventId + '/' + result[index].EventWithPhoto[key].FileNameInFolder));
                        imageTag.height(230);
                        imageTag.width(350);
                        imageTag.appendTo(imageDiv);
                        imageDiv.appendTo(mainDiv);
                        mainDiv.appendTo('#images');
                    });
                }
            });
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});