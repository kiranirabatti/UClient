$(document).ready(function () {
    var eventImage, eventName, eventDescription, eventVenue, eventDate, eventMonth, eventYear, eventday, description = '';
    $.ajax({
        url: nodeURL + '/eventwithphotos/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            totalRows = 0
            $.each(result, function (index, value) {
                if (result[index].IsActive == true) {
                    totalRows++;
                    var eventId = result[index].EventId;
                    eventImage = (result[index].EventWithPhoto.length > 0) ?
                        nodeURL + "/getEventPhotos/" + result[index].EventId + '/' + result[index].EventWithPhoto[0].FileNameInFolder : nodeURL + "/defaultEventImage";
                    eventName = result[index].EventName;
                    eventDescription = result[index].EventDescription;
                    eventVenue = result[index].EventVenue;
                    var eventDate = moment(result[index].EventDate, "DD-MM-YYYY").format("YYYY-MM-DD");
                    eventMonth = moment(eventDate).format('MMM');
                    eventYear = moment(eventDate).format('YYYY');
                    eventday = moment(eventDate).format('DD');
                    description = (eventDescription.length) > 100 ? ($(eventDescription).text()).substr(0, 80).trim(this) + "...\n" : $(eventDescription).text();
                    event = '<div class="upcoming-events bg-white-f3 mb-20 eventList"><div class="row"><div class="col-sm-4 pr-0 pr-sm-15"><div class="thumb p-15"><img class="img-fullwidth" src=' + eventImage + ' height="180" width="140"></div></div><div class="col-sm-4 pl-0 pl-sm-15"><div class="event-details p-15 mt-20">'
                        + '<h4 class="media-heading text-uppercase font-weight-500">' + eventName + '</h4>'
                        + ' <p class="eventDiscription">' + description + '</p>'
                        + '<button class="btn btn-flat btn-dark btn-theme-colored btn-sm eventDetails" value=' + eventId + '>Details <i class="fa fa-angle-double-right"></i></button>'
                        + ' </div></div>'
                        + '<div class="col-sm-4"><div class="event-count p-15 mt-15"><ul class="event-date list-inline font-16 text-uppercase mt-10 mb-20"><li class="p-15 mr-5 bg-lightest">' + eventMonth + '</li>'
                        + ' <li class="p-15 pl-20 pr-20 mr-5 bg-lightest">' + eventday + '</li>'
                        + '<li class="p-15 bg-lightest">' + eventYear + '</li></ul>'
                        + '<ul><li class="text-theme-colored"><i class="fa fa-map-marker mr-5"></i> ' + eventVenue + '</li></ul>'
                        + '</div> </div></div></div>';
                    $('#EventList').append(event)
                }
            });
            pagination(4)
            $('#eventCount').html(totalRows)
            $(".eventDetails").on('click', function () {
                eventId = $(this).attr("value");
                window.location = 'EventDetails.html?id=' + eventId;
            })
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });

    function pagination(maxRows) {
        $(".pagination").html('');
        totalEventNumber = 0;
        totalRows = 0;
        totalRows = $('.eventList').length;
        $('.eventList').each(function () {
            totalEventNumber++;
            (totalEventNumber > maxRows) ? $(this).hide() : $(this).show();
        });
        if (totalRows > maxRows) {
            pagenum = Math.ceil(totalRows / maxRows);
            $('.pagination').append('<li id="previous">\<span aria-hidden="true">&laquo;</span>\</li>').show();
            for (i = 1; i <= pagenum; i++) {
                $('.pagination').append('<li class="current-page" data-page="' + i + '" >\<span>' + i + '<span class="sr-only">(current)</span></span>\</li>').show();
            }
            $('.pagination').append('<li id="next">\<span aria-hidden="true">&raquo;</span>\</li>').show();
        }
        $('.pagination li:first-child').next().addClass('active');
        $('.pagination li.current-page').on('click', function () {
            pageNum = $(this).attr('data-page');
            trIndex = 0;
            $('.pagination li').removeClass('active');
            $(this).addClass('active');
            $('.eventList').each(function () {
                trIndex++;
                (trIndex > (maxRows * pageNum) || trIndex <= ((maxRows * pageNum) - maxRows)) ? $(this).hide()
                    : $(this).show()
            });
        });

        $('#previous').on('click', function () {
            currentPage = $('.pagination li.active').index();
            if (currentPage == 1) {
                return false;
            }
            else {
                currentPage--;
                trIndex = 0;
                $('.pagination li').removeClass('active');
                $('.eventList').each(function () {
                    trIndex++;
                    (trIndex > (maxRows * currentPage) || trIndex <= ((maxRows * currentPage) - maxRows)) ?
                        $(this).hide() : $(this).show();
                })
                $(".pagination li:eq(" + (currentPage) + ")").addClass('active');
            }
        });

        $('#next').on('click', function () {
            currentPage = $('.pagination li.active').index();
            if (currentPage == pagenum) {
                return false;
            }
            else {
                currentPage++;
                trIndex = 0;
                $('.pagination li').removeClass('active');
                $('.eventList').each(function () {
                    trIndex++;
                    (trIndex > (maxRows * currentPage) || trIndex <= ((maxRows * currentPage) - maxRows)) ?
                        $(this).hide() : $(this).show();
                })
                $(".pagination li:eq(" + (currentPage) + ")").addClass('active');
            }
        });
    }
});