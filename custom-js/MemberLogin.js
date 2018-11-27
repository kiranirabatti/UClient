$(document).ready(function () {
    $('#otpdiv').hide();
    $('.preloader-orbit-loading').hide();
	var memberId = '';
	var fileName = '';
	var mobileNumberflag = 0;
    var viewLogin = localStorage.getItem('isLoggedIn');
    var familyMemberId=localStorage.getItem('familyMemberId')
    if (viewLogin == 'true') {
		$('#memberWelcome').html(localStorage.getItem('fullName'));
		$('#login').hide();
		$('#logOut').show();
	}
	else {
		$('#memberWelcome').html('Guest');
		$('#login').show();
		$('#logOut').hide();
	}

    $('#myModal').on('shown.bs.modal', function (e) {
        memberId = $(e.relatedTarget).attr('data-id');
        fileName = $(e.relatedTarget).attr('data-fileName');
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

    $('#otpInput').on('input', function () {
        otpvalidate($('#otpInput').val());
    });

    function otpvalidate(otp) {
        if (otp == '') {
            $('#otp-error').text("This field is required");
            return false;
        }
        else {
            var otpregex = /^[0-9]{0,4}$/;
            if (otpregex.test(otp)) {
                $('#otp-error').text("");
                return true;
            }
            else {
                $('#otp-error').text("Please enter valid OTP");
                return false;
            }
        }
    }

	function clearinput() {
        mobileNumberflag = 0;
        $('#mobileNumber').val('');
        $('#otpInput').val('');
        $('#otpdiv').hide();
        $('#mobile-error').text("");
        $('#otp-error').text('');
        $('#mobileNumber').prop('disabled', false);
		$('#btnLogin').prop('disabled', false);
		$('#btnReset').prop('disabled', false);
	}

    var referenceId = '';
    var isMember = false;
    $('#btnLogin').click(function () {
        var mobileNumber = $('#mobileNumber').val();
        var otp = $('#otpInput').val();
        if (!otp && mobileNumberflag == 0) {
            if (mobileNumber != '' && $('#mobile-error').text() == '') {
                $('#btnLogin').prop('disabled', true);
                $('#btnReset').prop('disabled', true);
                $('#loading').html($('.preloader-orbit-loading').show()).css("display", "block");
                $.ajax({
                    url: nodeURL + '/authenticateMemberMobile/' + mobileNumber,
                    type: 'GET',
                    data: {},
                    success: function (result) {
                        if (result != '' && result.MemberId && !result.FamilyMemberId) {
                            referenceId = result.MemberId
                            isMember = true;
                            mobileNumberflag = 1;
                            localStorage.setItem('fullName', result.FullName);
                            localStorage.setItem('loginMemberId', result.MemberId);
                            $('#otpdiv').show();
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
                            $('#mobileNumber').prop('disabled', true);
                            $('#mobile-error').text('OTP is sent to your registered mobile number');
                            $('#btnLogin').prop('disabled', false);
                            $('#btnReset').prop('disabled', false);
                        }
                        else if (result != '' && result.FamilyMemberId) {
                            referenceId = result.FamilyMemberId;
                            isMember: false;
                            localStorage.setItem('fullName', result.Name);
                            localStorage.setItem('loginMemberId', result.MemberId);
                            localStorage.setItem('loginfamilyMemberId', result.FamilyMemberId);
                            $('#otpdiv').show();
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
                            $('#mobileNumber').prop('disabled', true);
                            $('#mobile-error').text('OTP is sent to your registred Mobile Number');
                            $('#btnLogin').prop('disabled', false);
                            $('#btnReset').prop('disabled', false);
                        }
                        else {
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
                            !result ? $('#mobile-error').text('Invalid Mobile Number') : result != '' ? $('#mobile-error').text(result) : $('#mobile-error').text('');
                            $('#btnLogin').prop('disabled', false);
                            $('#btnReset').prop('disabled', false);
                        }
                    }
                });
            }
        }
        else {
            var otpstatus = otpvalidate(otp);
            if (otpstatus) {
                $('#btnLogin').prop('disabled', true);
                $('#btnReset').prop('disabled', true);
                $('#loading').html($('.preloader-orbit-loading').show()).css("display", "block");
                $.ajax({
                    url: nodeURL + '/authenticateOTP/' + mobileNumber + '/' + otp + '/' + referenceId + '/' + isMember,
                    type: 'GET',
                    data: {},
                    success: function (result) {
                        if (result.OTP) {
                            var encrypted = CryptoJS.AES.encrypt((result.OTP).toString(), "Secret");
                            $('#mobileNumber').val('');
                            $('#otpInput').val('');
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
                            localStorage.setItem('memberId', localStorage.getItem('loginMemberId'));
                            localStorage.setItem('familyMemberId', localStorage.getItem('loginfamilyMemberId'));
                            localStorage.setItem('isLoggedIn', true);
                            localStorage.setItem('encryptedOTP', encrypted);
                            if (memberId == null) {
                                window.location = "index.html";
                            }
                            else if (fileName == 'Matrimonial') {
                                window.location = "ViewMatrimonialDetails.html?id=" + memberId + "&fileName=Matrimonial";
                            }
                            else if (fileName == 'MatrimonialMember') {
                                window.location = "ViewMatrimonialDetails.html?id=" + memberId;
                            }
                            else {
                                window.location = "MemberDetails.html?id=" + memberId;
                            }
                        }
                        else {
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
                            $('#btnLogin').prop('disabled', false);
                            $('#btnReset').prop('disabled', false);
                            $('#otp-error').text('Invalid OTP');
                        }
                    },
                    error: function (err) {
                        $('#otp-error').text('Something went wrong');
                    }
                });
            }
        }

	});

    $('#resend').click(function () {
        var mobileNumber = $('#mobileNumber').val();
        $('#otp-error').text('');
        $('#otpInput').val('');
        $('#mobile-error').text('');
        $('#btnLogin').prop('disabled', true);
        $('#loading').html($('.preloader-orbit-loading').show()).css("display", "block");
        $.ajax({
            url: nodeURL + '/authenticateMemberMobile/' + mobileNumber,
            type: 'GET',
            data: {},
            success: function (result) {
                if (result.FullName) {
                    $('#mobileNumber').prop('disabled', true);
                    $('#mobile-error').text('OTP is sent to your registered mobile number');
                    $('#loading').hide();
                    $('.preloader-orbit-loading').hide();
                    $('#btnLogin').prop('disabled', false);
                    $('#btnReset').prop('disabled', false);
                }
                else {
                    !result ? $('#mobile-error').text('Invalid Mobile Number') : result != '' ? $('#mobile-error').text(result) : $('#mobile-error').text('');
                    $('#loading').hide();
                    $('.preloader-orbit-loading').hide();
                    $('#btnLogin').prop('disabled', false);
                    $('#btnReset').prop('disabled', false);
                }
            },
            error: function (err) {
                $('#mobile-error').text('Something went wrong');
                $('#loading').hide();
                $('.preloader-orbit-loading').hide();
                $('#btnLogin').prop('disabled', false);
                $('#btnReset').prop('disabled', false);
            }
        });
    });

	$('#myModal').on('hidden.bs.modal', function (e) {
		clearinput();
	});

	$('#memberLogout').click(function () {
		localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('fullName');
        localStorage.removeItem('memberId');
		localStorage.removeItem('encryptedOTP');
        localStorage.removeItem('loginMemberId');
        localStorage.removeItem('familyMemberId')
        localStorage.removeItem('loginfamilyMemberId')
	});
});

