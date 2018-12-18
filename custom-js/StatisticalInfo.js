$(document).ready(function () {
    $.ajax({
        async: false,
        url: nodeURL + '/statisticsInfo/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            $('#members').attr('data-value', result.memberCont);
            $('#familyMembers').attr('data-value',result.familyMemberCount);
            $('#male').attr('data-value', result.maleCount);
            $('#female').attr('data-value', result.femaleCount);
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });

});


