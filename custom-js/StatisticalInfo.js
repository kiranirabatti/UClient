var Male = 0;
var Female = 0;
$(document).ready(function () {
    $.ajax({
        url: nodeURL + '/allmembers/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            var total = result.length;
            $('#members').attr('data-value', total);
            $.each(result, function (key, value) {
                result[key].Gender.toLowerCase() == 'male' ? Male++ : Female++;
            });
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
    $.ajax({
        url: nodeURL + '/allFamilyMembers/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            var fmembers = result.length;
            $('#familyMembers').attr('data-value', fmembers);
            $.each(result, function (key, value) {
                result[key].Gender.toLowerCase() == 'male' ? Male++ : Female++;
            });
            $('#male').attr('data-value', Male);
            $('#female').attr('data-value', Female);
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});


