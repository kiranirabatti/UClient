﻿$(document).ready(function () {

    $.ajax({
        url: nodeURL + '/getAllMatrimonialMembers/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            var maleCount = 0;
            var femaleCount = 0;
            var items = $('<div class="item">');
            var loggedIn = localStorage.getItem('isLoggedIn');

            function createComponent(index) {
                var mainItem = $('  <div class="course-single-item bg-white border-1px clearfix">');
                var imageThumb = $('<div class="course-thumb">');
                var image = $('<img class="img-fullwidth">');
                image.attr('src', (result[index].FileNameInFolder == '' ? nodeURL + "/defaultImage" : nodeURL + "/getFamilyMemberImage/" + result[index].MemberId + '/' + result[index].FamilyMemberId + '/' + result[index].FileNameInFolder));
                image.height(250);
                image.width(250);
                imageThumb.append(image);
                var details = $('<div class="course-details clearfix p-20 pt-15">');
                var innerDiv = $(' <div class="course-top-part">');
                var headElement1 = $('<h4 class="mt-5 mb-5">').text(result[index].Name);
                var height = result[index].HeightData.length==0 ? '' : result[index].HeightData[0].Description
                var headElement2 = $('<h5 class="text-gray font-14 mt-0">').text(result[index].Age + ' Years,   Height: ' + height);
                var cityName = result[index].CityData.length == 0 ? '' : result[index].CityData[0].CityName;
                var citizenship = result[index].CitizenshipData.length == 0 ? '' : result[index].CitizenshipData[0].Description
                cityCitizenship = cityName == '' ?citizenship : cityName + ',  ' + citizenship
                var headElement3 = $('<h5 class="text-gray font-14 mt-0 mb-0">').text('City: '+cityCitizenship);
                innerDiv.append(headElement1, headElement2, headElement3);
                details.append(innerDiv);
                viewDetailsDiv = $('<div class="course-meta mb-20">');
                tag = $(' <div class="course-tag">');
                var button = (loggedIn != 'true') ?
                    '<a class="btn bg-theme-colored2 no-border viewDetail text-white" data-toggle="modal" href="LoginModal.html" data-id="' + result[index].FamilyMemberId + '" data-fileName="MatrimonialMember" data-target="#myModal">View Details</a>' :
                    '<a class="btn bg-theme-colored2 no-border viewDetail text-white" href="ViewMatrimonialDetails.html?id=' + result[index].FamilyMemberId + '&fileName=MatrimonialMember">View Details</a>';
                tag.append(button);
                viewDetailsDiv.append(tag);
                mainItem.append(imageThumb, details, viewDetailsDiv);
                items.append(mainItem);
            }

            $.each(result, function (index, value) {
                if (result[index].LookingForPartner == 'Yes') {
                    result[index].Gender.toLowerCase() == 'male' ? maleCount++ : femaleCount++;
                }
            });
            $.each(result, function (index, value) {
                if (result[index].LookingForPartner == 'Yes') {
                    if (maleCount > 3 && result[index].Gender.toLowerCase() == 'male') {
                       
                        items = $('<div class="item">');
                        createComponent(index);
                        items.appendTo('#maleSlider');
                    }
                    else if (femaleCount > 3 && result[index].Gender.toLowerCase() == 'female') {
                        items = $('<div class="item">');
                        createComponent(index);
                        items.appendTo('#femaleSlider');
                    }
                    else if (maleCount <= 3 && (result[index].Gender.toLowerCase() == 'male')) {
                        items = $('<div class="col-md-4 pl-10 pr-10">');
                        createComponent(index);
                        items.appendTo('#maleIndividual');
                        $('#maleSlider').hide();
                    }
                    else if (femaleCount <= 3 && result[index].Gender.toLowerCase() == 'female') {
                        items = $('<div class="col-md-4 pl-10 pr-10">');
                        createComponent(index);
                        items.appendTo('#femaleIndividual');
                        $('#femaleSlider').hide();
                    }
                }
                 (maleCount == 0 && femaleCount == 0) ? $('#matrimonialContent').hide() : '';
                if (maleCount == 0) {
                    $('#maleHead').hide();
                    $('#maleSlider').hide();
                    $('#maleIndividual').hide();
                }
                if (femaleCount == 0) {
                    $('#femaleHead').hide();
                    $('#femaleSlider').hide();
                    $('#femaleIndividual').hide();
                }
                
            });
            if (maleCount == 0 && femaleCount == 0) {
                $('#maleHead').hide();
                $('#femaleHead').hide();
                $('#nameMatrimonial').hide();
            }
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});
