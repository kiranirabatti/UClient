$(document).ready(function () {
    var leftCount = 0;
    var rightCount = 0;
    var visitingCardCount = 0;
    $.ajax({
        url: nodeURL + '/allAdvertisements/',
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
            $.each(result, function (index, value) {
                var currentDate = formatDate(new Date);
                if (result[index].photos.length > 0 && result[index].EndDate >= currentDate && result[index].IsActive == true && result[index].StartDate <= currentDate) {
                    var leftCarousel = $('<div class="owl-carousel-1col mb-15" data-dots="true" data-nav="true">');
                    var rightCarousel = $('<div class="owl-carousel-1col mb-15" data-dots="true" data-nav="true">');
                    $.each(result[index].photos, function (key, value) {
                        var item = $('<div class="item">');
                        var image = $('<img>');
                        image.attr('src', (nodeURL + "/getAdvPhotos/" + result[index].AdvertisementId + '/' + result[index].photos[key].FileNameInFolder));
                        if (result[index].photos[key].AdvertisementLocation == '1') {
                            image.height(600);
                            image.width(320);
                            image.appendTo(item);
                            if (result[index].locationData.AdvertisementLocation == 'Left side') {
                                item.appendTo(leftCarousel);
                                leftCount++;
                            }
                        }
                        else if (result[index].photos[key].AdvertisementLocation == '2') {
                            image.height(300);
                            image.width(320);
                            image.appendTo(item);
                            if (result[index].locationData.AdvertisementLocation == 'Right side') {
                                item.appendTo(rightCarousel);
                                rightCount++;
                            }
                        }
                        else if (result[index].photos[key].AdvertisementLocation == '3') {
                            var anchor = $('<a data-lightbox="gallery-item" style="height:300px;width:400px;">');
                            anchor.attr('href', nodeURL + "/getAdvPhotos/" + result[index].AdvertisementId + '/' + result[index].photos[key].FileNameInFolder);
                            image.height(182);
                            image.width(320);
                            image.addClass('ml-20 mb-30 mr-20');
                            anchor.append(image);
                            if (result[index].locationData.AdvertisementLocation == 'Visiting card') {
                                anchor.appendTo('#visitingCard');
                                visitingCardCount++;
                            }
                        }
                    });
                    leftCarousel.appendTo('#leftSide');
                    rightCarousel.appendTo('#rightSide');
                }
            });
            var item = $('<div class="item">');
           
            if (leftCount == 0) {
                var image = $('<img class="mt-10">');
                image.attr('src', 'http://placehold.it/320x600');
                image.appendTo(item);
                item.appendTo('#leftSide');
            }
            if (rightCount == 0) {
                for (let i = 0; i < 2; i++) {
                    item = $('<div class="item">');
                    image = $('<img class="pb-30">');
                    image.attr('src', 'http://placehold.it/320x300');
                    image.appendTo(item);
                    item.appendTo('#rightSide');
                }
            }
            if (visitingCardCount == 0) {
                var image = $('<img class="pl-20">');
                image.attr('src', 'http://placehold.it/320x182');
                image.appendTo('#visitingCard');
            }
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});