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
            pagination(5)
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
        var totalRows = $('.eventList').length;
        var limitPerPage = maxRows;
        var totalPages = Math.ceil(totalRows / limitPerPage);
        var paginationSize = 7;
        var currentPage;

        function showPage(whichPage) {
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $('.eventList').hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
            // Replace the navigation items (not prev/next):
            $(".pagination li").slice(1, -1).remove();
            getPageList(totalPages, currentPage, paginationSize).forEach(item => {
                $("<li>")
                    .addClass(
                    "page-item " +
                    (item ? "current-page " : "") +
                    (item === currentPage ? "active " : "")
                    )
                    .append(
                    $("<a>")
                        .addClass("page-link")
                        .attr({
                            href: "javascript:void(0)"
                        })
                        .text(item || "...")
                    )
                    .insertBefore("#next-page");
            });
            return true;
        }

        // Include the prev/next buttons:
        $(".pagination").append(
            $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                $("<a>")
                    .addClass("page-link")
                    .attr({ href: "javascript:void(0)" })
                    .text("Prev")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>")
                    .addClass("page-link")
                    .attr({ href: "javascript:void(0)" })
                    .text("Next")
            )
        );

        // Show the page links
        $('.eventList').show();
        showPage(1);

        $(document).on("click", ".pagination li.current-page:not(.active)", function () {
            return showPage(+$(this).text());
        });
        $("#next-page").on("click", function () {
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            return showPage(currentPage - 1);
        });
    }

    function getPageList(totalPages, page, maxLength) {
        if (maxLength < 5) throw "maxLength must be at least 5";

        function range(start, end) {
            return Array.from(Array(end - start + 1), (_, i) => i + start);
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
            // no breaks in list
            return range(1, totalPages);
        }
        if (page <= maxLength - sideWidth - 1 - rightWidth) {
            // no break on left of page
            return range(1, maxLength - sideWidth - 1)
                .concat([0])
                .concat(range(totalPages - sideWidth + 1, totalPages));
        }
        if (page >= totalPages - sideWidth - 1 - rightWidth) {
            // no break on right of page
            return range(1, sideWidth)
                .concat([0])
                .concat(range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
        }
        // Breaks on both sides
        return range(1, sideWidth)
            .concat([0])
            .concat(range(page - leftWidth, page + rightWidth))
            .concat([0])
            .concat(range(totalPages - sideWidth + 1, totalPages));
    }

});