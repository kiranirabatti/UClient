$(document).ready(function () {
    var imageCount = 0;
    var imagesForSlider = '';
    var bannerPhoto = '';
    $.ajax({
        async: false,
        url: nodeURL + '/bannerWithPhotos/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            if (result.length == 0) {
                $('#home').hide()
            }
            $.each(result, function (index, value) {
                if (result[index].IsActive == true) {
                    if (result[index].BannerWithPhoto.length > 0) {
                        $.each(result[index].BannerWithPhoto, function (key, value) {
                            bannerPhoto = nodeURL + "/bannerphoto/" + result[index].BannerId + '/' + result[index].BannerWithPhoto[key].FileNameInFolder;
                            imagesForSlider = `<li data-index="rs-` + imageCount + `" data-transition="slidingoverlayhorizontal" data-slotamount="default" data-easein="default" data-easeout="default" data-masterspeed="default" data-thumb="http://placehold.it/1920x1280" data-rotate="0" data-fstransition="fade" data-fsmasterspeed="1500" data-fsslotamount="7" data-saveperformance="off" data-title="Slide One">
                                <img src="`+ bannerPhoto + `" data-bgposition="center 30%" data-bgfit="cover" data-bgrepeat="no-repeat" data-bgparallax="10" class="rev-slidebg bannerPhotos" data-no-retina>
                               
                            </li>`;
                            //<div class="tp-caption tp-resizeme text-white text-uppercase font-montserrat rs-parallaxlevel-0"
                            //    id="slide-`+ imageCount + `-layer-2"
                            //    data-x="['left','left','left','left']" data-hoffset="['50','50','50','30']"
                            //    data-y="['top','top','top','top']" data-voffset="['250','160','140','150']"
                            //    data-fontsize="['22','36','30','18']"
                            //    data-lineheight="['58','50','44','32']"
                            //    data-fontweight="['700','700','700','700']"
                            //    data-width="['600','550','500','320']"
                            //    data-height="none"
                            //    data-whitespace="normal"
                            //    data-transform_idle="o:1;"
                            //    data-transform_in="y:[-100%];z:0;rX:0deg;rY:0;rZ:0;sX:1;sY:1;skX:0;skY:0;s:1500;e:Power3.easeInOut;"
                            //    data-transform_out="auto:auto;s:1000;e:Power3.easeInOut;"
                            //    data-mask_in="x:0px;y:0px;s:inherit;e:inherit;"
                            //    data-mask_out="x:0;y:0;s:inherit;e:inherit;"
                            //    data-start="1000"
                            //    data-splitin="none"
                            //    data-splitout="none"
                            //    data-responsive_offset="on"
                            //    style="z-index: 6; min-width: 600px; max-width: 600px; white-space: normal;">
                            //    <span class="text-theme-colored2" id="name">`+ result[index].Name + `</span>
                            //</div>
                            imageCount++;
                            $('#banner1234').append(imagesForSlider);
                        });
                    }
                }
            });
            if (imageCount == 0) {
                $('#home').hide()
            }
        }
    });
});