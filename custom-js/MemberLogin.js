$(document).ready(function () {
    $('.preloader-orbit-loading').hide();
	var memberId = '';
	var fileName = '';
	var emailflag = 0;
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
		member_Id = $(e.relatedTarget).attr('data-id');
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

	function clearinput() {
		emailflag = 0;
        $('#mobileNumber').val('');
        $('#mobile-error').text("")
		$('#btnLogin').prop('disabled', false);
		$('#btnReset').prop('disabled', false);
	}

    $('#btnLogin').click(function () {
        var mobileNumber = $('#mobileNumber').val();
        if (mobileNumber != '' && $('#mobile-error').text()=='') {
            $.ajax({
                url: nodeURL + '/authenticateMemberMobile/' + mobileNumber,
                type: 'GET',
                data: {},
                success: function (result) {
                    console.log(result)
                    if (result != '' && result.MemberId && !result.FamilyMemberId) {
                        $('#mobileNumber').val('');
                        localStorage.setItem('fullName', result.FullName);
                        localStorage.setItem('memberId', result.MemberId);
                        localStorage.setItem('isLoggedIn', true);
                        localStorage.setItem('memberEmailAddress', result.EmailAddress);
                        if (member_Id == null) {
                            window.location = "index.html";
                        }
                        else if (fileName == 'Matrimonial') {
                            window.location = "ViewMatrimonialDetails.html?id=" + member_Id + "&fileName=Matrimonial";
                        }
                        else if (fileName == 'MatrimonialMember') {
                            window.location = "ViewMatrimonialDetails.html?id=" + member_Id;
                        }
                        else {
                            window.location = "MemberDetails.html?id=" + member_Id;
                        }
                    }
                    else if (result != '' && result.FamilyMemberId) { 
                        $('#mobileNumber').val('');
                        localStorage.setItem('fullName', result.Name);
                        localStorage.setItem('memberId', result.MemberId);
                        localStorage.setItem('familyMemberId', result.FamilyMemberId);
                        localStorage.setItem('isLoggedIn', true);
                        if (member_Id == null) {
                            window.location = "index.html";
                        }
                        else if (fileName == 'Matrimonial') {
                            window.location = "ViewMatrimonialDetails.html?id=" + member_Id + "&fileName=Matrimonial";
                        }
                        else if (fileName == 'MatrimonialMember') {
                            window.location = "ViewMatrimonialDetails.html?id=" + member_Id;
                        }
                        else {
                            window.location = "MemberDetails.html?id=" + member_Id;
                        }
                    }
					else {
                        $('#mobile-error').text('Invalid Member');
					}
                }
            });
        }

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
        localStorage.removeItem('familyMemberId')
	});
});

