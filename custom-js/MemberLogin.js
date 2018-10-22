$(document).ready(function () {
    $('#otpdiv').hide();
    $('.preloader-orbit-loading').hide();
	var memberId = '';
	var fileName = '';
	var emailflag = 0;
	var viewLogin = localStorage.getItem('isLoggedIn');
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

	$('#emailInput').on('input', function () {
		emailvaidate($('#emailInput').val());
	});

	$('#otpInput').on('input', function () {
		otpvalidate($('#otpInput').val());
	});

	function emailvaidate(email) {
		if (email == '') {
			$('#email-error').text("This field is required");
            $('#emailInput').addClass("form-control error");
			return false;
		}
		else {
			var emailregex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
			if (emailregex.test(email)) {
				$('#email-error').text("");
				$('#emailInput').removeClass("form-control error").addClass("form-control");
				return true;
			}
			else {
				$('#email-error').text("Please enter valid email address");
				$('#emailInput').addClass("form-control error");
				return false;
			}
		}
	}

	function otpvalidate(otp) {
		if (otp == '') {
			$('#otp-error').text("This field is required");
			$('#otpInput').addClass("form-control error");
			return false;
		}
		else {
			var otpregex = /^[0-9]{0,6}$/;
			if (otpregex.test(otp)) {
				$('#otp-error').text("");
				$('#otpInput').removeClass("form-control error").addClass("form-control");
				return true;
			}
			else {
				$('#otp-error').text("Please enter valid OTP");
				$('#otpInput').addClass("form-control error");
				return false;
			}
		}
	}

	function clearinput() {
		emailflag = 0;
		$('#emailInput').val('');
		$('#otpInput').val('');
		$('#email-error').text('');
		$('#otp-error').text('');
		$('#otpdiv').hide();
		$('#emailInput').prop('disabled', false);
		$('#btnLogin').prop('disabled', false);
		$('#btnReset').prop('disabled', false);
		$('#emailInput').removeClass("form-control error").addClass("form-control");
		$('#otpInput').removeClass("form-control error").addClass("form-control");
	}

    $('#btnLogin').click(function () {
		var email = $('#emailInput').val();
		var otp = $('#otpInput').val();
        if (!otp && emailflag == 0) {
			var emailstatus = emailvaidate(email);
			if (emailstatus) {
				$('#btnLogin').prop('disabled', true);
                $('#btnReset').prop('disabled', true);
                $('#loading').html($('.preloader-orbit-loading').show()).css("display", "block");
				$.ajax({
					url: nodeURL + '/authenticateMemberEmail/' + email,
					type: 'GET',
					data: {},
                    success: function (result) {
						if (result.FullName) {
                            emailflag = 1;
                            localStorage.setItem('fullName', result.FullName + ' ' + result.SurName);
                            localStorage.setItem('loginMemberId', result.MemberId);
                            $('#otpdiv').show();
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
							$('#emailInput').prop('disabled', true);
							$('#email-error').text('OTP is sent to your registred email address');
							$('#btnLogin').prop('disabled', false);
                            $('#btnReset').prop('disabled', false);
						}
                        else {
                            $('#loading').hide();
                            $('.preloader-orbit-loading').hide();
							$('#email-error').text('Invalid email address');
							$('#btnLogin').prop('disabled', false);
							$('#btnReset').prop('disabled', false);
						}
					},
                    error: function (err) {
                        $('#loading').hide();
                        $('.preloader-orbit-loading').hide();
						$('#email-error').text('Something went wrong');
						$('#btnLogin').prop('disabled', false);
						$('#btnReset').prop('disabled', false);
					}
				});
			}
		}
		else {
			var otpstatus = otpvalidate(otp);
			if (otpstatus) {
				$.ajax({
					url: nodeURL + '/authenticateOTP/' + email + '/' + otp,
					type: 'GET',
					data: {},
                    success: function (result) {
                        if (result[0].OTP) {
							var encrypted = CryptoJS.AES.encrypt((result[0].OTP).toString(), "Secret");
							$('#emailInput').val('');
							$('#otpInput').val('');
                            localStorage.setItem('memberId', localStorage.getItem('loginMemberId'));
							localStorage.setItem('isLoggedIn', true);
							localStorage.setItem('memberEmailAddress', result[0].EmailAddress);
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
		var email = $('#emailInput').val();
		$('#otp-error').text('');
		$('#otpInput').val('');
		$('#email-error').text('');
		$('#emailInput').removeClass("form-control error").addClass("form-control");
		$('#otpInput').removeClass("form-control error").addClass("form-control");
		$('#btnLogin').prop('disabled', true);
		$('#btnReset').prop('disabled', true);
		$.ajax({
			url: nodeURL + '/authenticateMemberEmail/' + email,
			type: 'GET',
			data: {},
			success: function (result) {
				if (result.FullName) {
					$('#emailInput').prop('disabled', true);
					$('#email-error').text('OTP is resent to your registred email address');
					$('#btnLogin').prop('disabled', false);
					$('#btnReset').prop('disabled', false);
				}
				else {
					$('#email-error').text('Invalid email address');
					$('#btnLogin').prop('disabled', false);
					$('#btnReset').prop('disabled', false);
				}
			},
			error: function (err) {
				$('#email-error').text('Something went wrong');
				$('#btnLogin').prop('disabled', false);
				$('#btnReset').prop('disabled', false);
			}
		});
	});

	$('#btnReset').click(function () {
		clearinput();
	});

	$('#myModal').on('hidden.bs.modal', function (e) {
		clearinput();
	});

	$('#memberLogout').click(function () {
		localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('fullName');
        localStorage.removeItem('memberId');
		localStorage.removeItem('encryptedOTP');
		localStorage.removeItem('memberEmailAddress');
        localStorage.removeItem('loginMemberId');
	});
});

