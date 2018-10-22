$(document).ready(function () {
    $.ajax({
        url: nodeURL + '/allmembers/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            result.reverse();
            count = 1;
            $.each(result, function (index, value) {
                if (count < 4) {
                    $('#memberImage' + count + '').attr('src', result[index].FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + result[index].MemberId + '/' + result[index].FileNameInFolder
                        : nodeURL + "/defaultImage");
                    $('#name' + count + '').text(result[index].FullName + ' ' + result[index].FatherName + ' ' + result[index].SurName);
                    $('#address' + count + '').text(result[index].Address);
                }
                count++;
            });
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});