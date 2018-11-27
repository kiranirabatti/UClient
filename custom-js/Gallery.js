$(window).load(function () {
    $.ajax({
        url: nodeURL +'/eventwithphotos/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            $.each(result, function (index, value) {
                if (result[index].EventWithPhoto.length > 0) {
                    var mainDiv = $('<div class="gallery-item design pr-20 pb-15">');
                    var thumb = $('<div class="thumb">');
                    var wrapper = $('<div class="flexslider-wrapper" data-direction="vertical">');
                    var flexslider = $('<div class="flexslider">');
                    var unorderedList = $('<ul class="slides">');
                    mainDiv.width(360);
                    mainDiv.height(270);
                    mainDiv.append(thumb);
                    thumb.append(wrapper);
                    wrapper.append(flexslider);
                    flexslider.append(unorderedList);
                    $.each(result[index].EventWithPhoto, function (key, value) {
                        var eventImage = nodeURL + "/getEventPhotos/" + result[index].EventId + '/' + result[index].EventWithPhoto[key].FileNameInFolder;
                        var images = ' <li><a href=' + eventImage + '><img src=' + eventImage + ' style="height:200px;width:400px;"></a></li>'
                        unorderedList.append(images);
                    });
                    var closingFlex = $('</div></div><div class="overlay-shade"></div>');
                    var holder = $('<div class="icons-holder"><div class="icons-holder-inner"><div class="styled-icons icon-sm icon-dark icon-circled icon-theme-colored"><a href="#"><i class="fa fa-picture-o"></i></a></div></div></div></div></div>');
                    thumb.append(closingFlex);
                    thumb.append(holder)
                    var headElement1 = $('<h5>').text('Event: ' + result[index].EventName + ' (' + result[index].EventWithPhoto.length + ' Photos)');
                    mainDiv.append(headElement1)
                    mainDiv.appendTo('#grid')
                }
            });
        },
        error: function (err) {
            alert(err.statusText);
        }
    });
});