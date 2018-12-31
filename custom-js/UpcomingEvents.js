$(document).ready(function () {
    $.ajax({
        url: nodeURL + '/upcomingEvent/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            function formatDate(date) {
                var d = new Date(date),
                    month = '' + (d.getMonth() + 1),
                    day = '' + d.getDate(),
                    year = d.getFullYear();
                if (month.length < 2) month = '0' + month;
                if (day.length < 2) day = '0' + day;
                return [day, month, year].join('-');
            }
            var currentDate = formatDate(new Date);
            var sortedArray = [];
            var count = 0;
            $.each(result, function (index, value) {
                    if (count < 3) {
                        sortedArray[count] = result[index];
                        var eventDate = moment(result[index].EventDate, "DD-MM-YYYY").format("YYYY-MM-DD");
                        $('#date' + count + '').text(moment(eventDate).format('DD'));
                        $('#month' + count + '').text(moment(eventDate).format('MMM'));
                        $('#eventname' + count + '').text(result[index].EventName);
                        $('#eventname' + count + '').attr('href', 'EventDetails.html?id=' + result[index].EventId);
                        $('#location' + count + '').text(result[index].EventVenue);
                    }
                    count++;
            });
            if (count == 3) {
                $('#noEvents').hide();
            }
            if (count == 0) {
                $('#noEvents').show();
                $('#more').hide();
                $('#article1').hide();
                $('#article2').hide();
                $('#article3').hide();
            }
            if (count == 1) {
                $('#noEvents').hide();
                $('#article2').hide();
                $('#article3').hide();
            }
            if (count == 2) {
                $('#noEvents').hide();
                $('#article3').hide();
            }
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});