$(document).ready(function () {
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = "index.html";
    }
    else 
    var isFormChanged = false;
    $('form :input').on('change', function () {
        isFormChanged = true
    });

    $('#EditImage').hide();
    var isImageChange = false;
    function readURL(input) {
        if (input.files && input.files[0]) {
            var reader = new FileReader();
            var file = input.files[0];
                reader.onload = function (e) {
                    $('#MemberImageEdit').attr('src', e.target.result);
                    isImageChange = true;
                }
                reader.readAsDataURL(input.files[0]);
        }
    }
    var newFileName = '';
    $("#EditImage").change(function (e) {
        var val = $(this).val();
        newFileName = e.target.files[0].name;
        switch (val.substring(val.lastIndexOf('.') + 1).toLowerCase()) {
            case 'jpeg': case 'jpg': case 'png':
                $('#image_error').text("");
                break;
            default:
                $(this).val('');
                $('#image_error').text("Please select only image file");
                break;
        }
        readURL(this);
    });

    $('#emailId').on('input', function () {
        emailvaidate($('#emailId').val());
    });

    function emailvaidate(email) {
        if (email != ''){
            var emailregex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
            if (emailregex.test(email)) {
                $('#email-error').text("");
                return true;
            }
            else {
                $('#email-error').text("Please enter valid email address");
                return false;
            }
        }else{
            $('#email-error').text("");
                return true;
        }
    }

    $('#firstName').on('input', function () {
        var firstName = $('#firstName').val()
        var name = firstName.replace(/\s+/g, '');
        if (name.length==0) {
            $('#firstName-error').text("This field is required");
            return false;
        }
        else {
            $('#firstName-error').text("");
            return true;
        }
    });

    $('#mobileNumber').on('input', function () {
        validatePhone($('#mobileNumber').val());
    });

    function validatePhone(txtPhone) {
        if (txtPhone == '') {
            $('#mobile-error').text("This field is required");
            return false;
        }
        else {
            var mobileNumberRegex = /^\d{10}$/;
            if (mobileNumberRegex.test(txtPhone)) {
                $('#mobile-error').text("");
                return true;
            }
            else {
                $('#mobile-error').text("Please enter valid mobile number");
                return false;
            }
        }
    }

    $('#address').on('input', function () {
        var address = $('#address').val()
        if (address == '') {
            $('#address-error').text("This field is required");
            return false;
        }
        else {
            $('#address-error').text("");
            return true;
        }
    });

    var member_data = "";
    var oldFileName = '';
    var FileNameInFolder = '';
    var fileName = ''
        var memberId = localStorage.getItem('memberId');
        getMemberData();
        function getMemberData() {
            $.ajax({
                url: nodeURL + '/membersbyId/' + memberId,
                type: "GET",
                data: {},
                dataType: "json",
                success: function (member) {
                    member_data = member[0];
                    setMemberData(member_data);
                },
                error: function (err) {
                    console.log(err.statusText);
                }
            });
        } 

        function setMemberData(member){
            $('#firstName').val(member.FullName);
            $('#mobileNumber').val(member.MobileNo);
            $('#emailId').val($.trim(member.Email));
            $('#address').val(member.Address);
            member.FileNameInFolder != "" ? $('.memberImage').attr('src', nodeURL + '/getMemberPhoto/' + member.MemberId + '/' + member.FileNameInFolder) :
                $('.memberImage').attr('src', nodeURL + "/getDefaultMemberImage");
            oldFileName = member.FileNameInFolder;
            fileName = member.FileName;
        }

        var Image = '';
        $("#updateMemberProfile").click(function () {
            var fname = $('#firstName').val();
            var phone = $('#mobileNumber').val();
            var email = $('#emailId').val();
            var addr = $('#address').val();
            isImageChange == true ? Image = $('#MemberImageEdit').attr('src') : Image=nodeURL + '/getDefaultMemberImage';
            var FileName = newFileName != '' ? newFileName : fileName;
            if (isFormChanged == true && $('#firstName-error').text() == '' && $('#mobile-error').text() == '' && $('#email-error').text() == '' && $('#address-error').text() == '' && $('#image_error').text() == '') {
                if (memberId) {
                    var memberData = { "memberId": memberId, "FullName": $.trim(fname), "MobileNo": phone, "email": $.trim(email), "Address": $.trim(addr), "Image": Image, "OldFileName": oldFileName, "FileName": FileName, "FileNameInFolder": FileNameInFolder };
                    $.ajax({
                        url: nodeURL + '/membersbyId/' + memberId,
                        type: "PUT",
                        contentType: "application/json",
                        data: JSON.stringify(memberData),
                        dataType: "json",
                        success: function (member) {
                            if (member != '') {
                                member_data = "";
                                member_data = member;
                                localStorage.removeItem('fullName')
                                localStorage.setItem('fullName', member.FullName)
                                $('#memberWelcome').html(localStorage.getItem('fullName'));
                                $('#form-result').html('Member updated successfully').fadeIn('slow');
                                setTimeout(function () { $('#form-result').fadeOut('slow') }, 5000);
                                isImageChange = false;
                                setMemberData(member_data)
                            }
                        },
                        error: function (err) {
                            console.log(err);
                        }
                    });
                }
            }
        });

        $("#CancelUpdate").click(function () {
            if (isFormChanged == true) {
                $('#MemberImageEdit').attr('src', "");
                $('#firstName-error').text("");
                $('#mobile-error').text("");
                $('#email-error').text("");
                $('#address-error').text("");
                $('#image_error').text("");
                $('#firstName').val("");
                $('#emailId').val("");
                $('#mobileNumber').val("");
                $('#address').val("");
                isFormChanged = false;
                setMemberData(member_data);
            }
        });
});