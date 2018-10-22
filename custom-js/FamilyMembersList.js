$(document).ready(function () {
    var memberData, memberValue, memberValue1, memberValue2, member, searchValue, dropDownValue = "";
    var totalRows, pagenum, maxRows, trIndex, trNumber, currentPage, rows, i, memberId, sortOrder = 0;
    var loggedIn = localStorage.getItem('isLoggedIn');

    getAllMember();
    function getAllMember() {
        var memberId = localStorage.getItem('memberId');
        memberData = '';
        $.ajax({
            url: nodeURL + '/getfamilymembers/' + memberId,
            type: "GET",
            data: {},
            dataType: "json",
            success: function (result) {
                if (result.length == 0) {
                    totalRows = 0;
                    memberData = " <tr><td colspan='6' class='text-black font-weight-600 text-center'> No records found</td></tr>"
                }
                else {
                    totalRows = 0;
                    $.each(result, function (key, member) {
                        FamilyMemberImage = member.FileNameInFolder != "" ? nodeURL + "/getFamilyMemberImage/" + member.MemberId + '/' + member.FamilyMemberId + '/' + member.FileNameInFolder : nodeURL + "/defaultImage";
                        var buttonURL = '<button class="btn btn-dark btn-circled btn-sm viewDetails" data-toggle="modal" data-id="' + member.FamilyMemberId + '" data-target="#myModal">View </button>'
                        totalRows++;
                        memberData += "<tr><td class='pr-0 pt-5'><div class='row'><img src=" + FamilyMemberImage + " class='img-circle mt-0' width='50' height='45'></div></td><td>" + member.Name + "</td><td>" + member.Email + "</td><td>" + member.Dob + "</td><td>" + member.Mobile + "</td><td>" + member.MaritalStatus + "</td><td>" + buttonURL + "</td></tr>";
                    });
                }
                $('#MemberTableBody').html(memberData);
                $('#memberCount').html(totalRows);
                pagination(10);
            },
            error: function (err) {
                console.log(err.statusText);
            }
        });

        function pagination(maxRows) {
            $(".pagination").html('');
            trNumber = 0;
            totalRows = $('tbody tr').length;
            $('table tr:gt(0)').each(function () {
                trNumber++;
                (trNumber > maxRows) ? $(this).hide() : $(this).show();
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
                $('table tr:gt(0)').each(function () {
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
                    $('table tr:gt(0)').each(function () {
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
                    $('table tr:gt(0)').each(function () {
                        trIndex++;
                        (trIndex > (maxRows * currentPage) || trIndex <= ((maxRows * currentPage) - maxRows)) ?
                            $(this).hide() : $(this).show();
                    })
                    $(".pagination li:eq(" + (currentPage) + ")").addClass('active');
                }

            });
        }
    }

    $('#emailId').on('input', function () {
        emailvaidate($('#emailId').val());
    });

    function emailvaidate(email) {
        if (email == '') {
            $('#email-error').text("This field is required");
            $('#emailId').addClass("form-control error");
            return false;
        }
        else {
            var emailregex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (emailregex.test(email)) {
                $('#email-error').text("");
                $('#emailId').removeClass("form-control error").addClass("form-control");
                return true;
            }
            else {
                $('#email-error').text("Please enter valid email address");
                $('#emailId').addClass("form-control error");
                return false;
            }
        }
    }

    $('#firstName').on('input', function () {
        var firstName = $('#firstName').val()
        if (firstName == '') {
            $('#firstName-error').text("This field is required");
            $('#firstName').addClass("form-control error");
            return false;
        }
        else {
            $('#firstName-error').text("");
            $('#firstName').removeClass("form-control error").addClass("form-control");
            return true;
        }
    });

    $('#memberSurname').on('input', function () {
        var firstName = $('#memberSurname').val()
        if (firstName == '') {
            $('#surname-error').text("This field is required");
            $('#memberSurname').addClass("form-control error");
            return false;
        }
        else {
            $('#surname-error').text("");
            $('#memberSurname').removeClass("form-control error").addClass("form-control");
            return true;
        }
    });

    $('#mobileNumber').on('input', function () {
        validatePhone($('#mobileNumber').val());
    });

    function validatePhone(txtPhone) {
        if (txtPhone == '') {
            $('#mobile-error').text("This field is required");
            $('#mobileNumber').addClass("form-control error");
            return false;
        }
        else {
            var mobileNumberRegex = /^\d{10}$/;
            if (mobileNumberRegex.test(txtPhone)) {
                $('#mobile-error').text("");
                $('#mobileNumber').removeClass("form-control error").addClass("form-control");
                return true;
            }
            else {
                $('#mobile-error').text("Please enter valid mobile number");
                $('#mobileNumber').addClass("form-control error");
                return false;
            }
        }
    }

    $('#myModal').on('shown.bs.modal', function (e) {
        familymemberId = $(e.relatedTarget).attr('data-id');
        fileName = $(e.relatedTarget).attr('data-fileName');
        getFamilyMemberData(familymemberId)
        $("#updateFamilyMemberProfile").click(function () {
            var fname = $('#firstName').val();
            var maritalStatus = $('#MaritalStatus').val();
            var phone = $('#mobileNumber').val();
            var email = $('#emailId').val();
            var addr = $('#address').val();
            if (familymemberId) {
                var familyeMberData = { "FamilyMemberId": familymemberId, "Name": fname, "MaritalStatus": maritalStatus, "Mobile": phone, "Email": email };
                if ($('#firstName-error').text() != '' || $('#mobile-error').text() != '' || $('#email-error').text() != '') {
                }
                else
                    $.ajax({
                        url: nodeURL + '/familyMemberById/' + familymemberId,
                        type: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(familyeMberData),
                        dataType: "json",
                        success: function (familyMember) {
                            if (familyMember != '') {
                                $('#form-result').html('Family member updatead successfully').fadeIn('slow');
                                setTimeout(function () { $('#form-result').fadeOut('slow') }, 5000);
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
            }
        });
    });

    function getFamilyMemberData(familymemberId) {
        $.ajax({
            url: nodeURL + '/familyMemberById/' + familymemberId,
            type: "GET",
            data: {},
            dataType: "json",
            success: function (result) {
                $('#firstName').val(result[0].Name);
                $('#MaritalStatus').val(result[0].MaritalStatus);
                $('#emailId').val(result[0].Email);
                $('#mobileNumber').val(result[0].Mobile);
            },
            error: function (err) {
                console.log(err.statusText);
            }
        });
    }

    $('#myModal').on('hidden.bs.modal', function (e) {
        $('#firstName').val('');
        $('#MaritalStatus').val('');
        $('#emailId').val('');
        $('#mobileNumber').val('');
        getAllMember();
    })

    $("#CancelUpdate").click(function () {
        getFamilyMemberData(familymemberId)
        $('#firstName').removeClass("form-control error").addClass("form-control");
        $('#mobileNumber').removeClass("form-control error").addClass("form-control");
        $('#emailId').removeClass("form-control error").addClass("form-control");
        $('#firstName-error').text("");
        $('#mobile-error').text("");
        $('#email-error').text("");

    });
});