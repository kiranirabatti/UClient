$(document).ready(function () {
    if (localStorage.getItem('encryptedOTP') && localStorage.getItem('memberEmailAddress')) {
        try {
            var decrypted = CryptoJS.AES.decrypt(localStorage.getItem('encryptedOTP'), 'Secret');
            var otp = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
        }
        catch (err) {
            window.location.href = "index.html";
        }
        var email = localStorage.getItem('memberEmailAddress');
        $.ajax({
            url: nodeURL + '/validateMember/' + email + '/' + otp,
            type: "GET",
            data: {},
            dataType: "json",
            success: function (result) {
                if (result[0].OTP) {
                    getData();
                }
                else {
                    window.location.href = "index.html";
                }
            },
            error: function (err) {
                window.location.href = "index.html";
            }
        });
    }
    else {
        window.location.href = "index.html";
    }

    $('#updateMemberProfile').attr('disabled', 'disabled');
    $('#EditImage').hide();
    var isImageChange = false;
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            let max_size = 512000;
            var file = input.files[0];
            if (file.size > max_size) {
                $('#image_error').text("Image size must be less than 500kb");
                $('#updateMemberProfile').attr('disabled', 'disabled');
            } else {
                reader.onload = function (e) {
                    $('#MemberImageEdit').attr('src', e.target.result);
                    isImageChange = true;
                }
                reader.readAsDataURL(input.files[0]);
            }
        }
    }
    var newFileName = '';
    $("#EditImage").change(function (e) {
        var val = $(this).val();
        newFileName = e.target.files[0].name;
        switch (val.substring(val.lastIndexOf('.') + 1).toLowerCase()) {
            case 'jpeg': case 'jpg': case 'png':
                $('#image_error').text("");
                $('#updateMemberProfile').removeAttr('disabled');
                break;
            default:
                $(this).val('');
                $('#image_error').text("Please select only image file");
                $('#updateMemberProfile').attr('disabled', 'disabled');
                break;
        }
        readURL(this);
    });

    $('#emailId').on('input', function () {
        emailvaidate($('#emailId').val());
        $('#updateMemberProfile').removeAttr('disabled');
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
            $('#updateMemberProfile').removeAttr('disabled');
            return true;
        }
    });

    $('#mobileNumber').on('input', function () {
        validatePhone($('#mobileNumber').val());
        $('#updateMemberProfile').removeAttr('disabled');
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

    $('#address').on('input', function () {
        var address = $('#address').val()
        if (address == '') {
            $('#address-error').text("This field is required");
            $('#address').addClass("form-control error");
            return false;
        }
        else {
            $('#address-error').text("");
            $('#address').removeClass("form-control error").addClass("form-control");
            $('#updateMemberProfile').removeAttr('disabled');
            return true;
        }
    });

    var oldFileName = '';
    var FileNameInFolder = '';
    var fileName = ''
    function getData() {
        var memberId = localStorage.getItem('memberId');
        getMemberData();
        function getMemberData() {
            $.ajax({
                url: nodeURL + '/membersbyId/' + memberId,
                type: "GET",
                data: {},
                dataType: "json",
                success: function (member) {
                    $('#firstName').val(member[0].FullName);
                    $('#mobileNumber').val(member[0].MobileNo);
                    $('#emailId').val(member[0].Email);
                    $('#address').val(member[0].Address);
                    member[0].FileNameInFolder != "" ? $('.memberImage').attr('src', nodeURL + '/getMemberPhoto/' + member[0].MemberId + '/' + member[0].FileNameInFolder) :
                        $('.memberImage').attr('src', nodeURL + "/getDefaultMemberImage");
                    oldFileName = member[0].FileNameInFolder;
                    fileName = member[0].FileName;
                },
                error: function (err) {
                    console.log(err.statusText);
                }
            });
        }

        var Image = '';
        $("#updateMemberProfile").click(function () {
            var fname = $('#firstName').val();
            var phone = $('#mobileNumber').val();
            var email = $('#emailId').val();
            var addr = $('#address').val();
            isImageChange == true ? Image = $('#MemberImageEdit').attr('src') : Image=nodeURL + '/getDefaultMemberImage';
            var FileName = newFileName != '' ? newFileName : fileName;
            if ($('#firstName-error').text() != '' || $('#mobile-error').text() != '' || $('#email-error').text() != '' || $('#address-error').text() != '') {
            }
            else
                if (memberId) {
                    var memberData = { "memberId": memberId, "FullName": fname,"MobileNo": phone, "email": email, "Address": addr, "Image": Image, "OldFileName": oldFileName, "FileName": FileName, "FileNameInFolder": FileNameInFolder };
                    $.ajax({
                        url: nodeURL + '/membersbyId/' + memberId,
                        type: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(memberData),
                        dataType: "json",
                        success: function (member) {
                            if (member != '') {
                                localStorage.removeItem('fullName')
                                localStorage.setItem('fullName', member.FullName)
                                $('#memberWelcome').html(localStorage.getItem('fullName'));
                                $('#form-result').html('Member updatead successfully').fadeIn('slow');
                                setTimeout(function () { $('#form-result').fadeOut('slow') }, 5000);
                                isImageChange = false;
                                getMemberData();
                                $('#updateMemberProfile').attr('disabled', 'disabled');
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
        });

        $("#CancelUpdate").click(function () {
            getMemberData();
            $('#firstName').removeClass("form-control error").addClass("form-control");
            $('#mobileNumber').removeClass("form-control error").addClass("form-control");
            $('#emailId').removeClass("form-control error").addClass("form-control");
            $('#address').removeClass("form-control error").addClass("form-control");
            $('#firstName-error').text("");
            $('#mobile-error').text("");
            $('#email-error').text("");
            $('#address-error').text("");
        });
    }
});