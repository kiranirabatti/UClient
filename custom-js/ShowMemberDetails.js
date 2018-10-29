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
				else
					window.location.href = "index.html";
			},
			error: function (err) {
				window.location.href = "index.html";
			}
		});
	}
	else
		window.location.href = "index.html";

	function getData() {
		var memberId = GetParameterValues();
		function GetParameterValues() {
			var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
			var urlparam = url[0].split('=');
			return urlparam[1];
		}
        $.ajax({
			url: nodeURL + '/membersbyId/' + memberId,
			type: "GET",
			data: {},
			dataType: "json",
            success: function (member) {
				$('#fullName').html(member[0].FullName);
				$('#mobileNumber').html(member[0].MobileNo);
				$('#homePhone').html(member[0].HomePhone);
				$('#emailId').html(member[0].Email);
				$('#address').html(member[0].Address);
				$('#taluka').html(member[0].Taluka);
				$('#jeello').html(member[0].Jeello);
				$('#pinCode').html(member[0].PinCode);
				$('#fatherName').html(member[0].FatherName);
				$('#grandFatherName').html(member[0].GrandFatherName);
				$('#memberGol').html(member[0].Gol);
				$('#petaAttak').html(member[0].PetaAttak);
				$('#mulVatan').html(member[0].MulVatan);
				member[0].FileNameInFolder != "" ? $('.memberImage').attr('src', nodeURL + '/getMemberPhoto/' + member[0].MemberId + '/' + member[0].FileNameInFolder) :
					$('.memberImage').attr('src', nodeURL + "/defaultImage");
			},
			error: function (err) {
				console.log(err.statusText);
			}
        });

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
                        Familymember = "";
                        totalRows++;
                        memberData += "<tr><td class='pr-5 pt-5'><div class='row'><img src="+ FamilyMemberImage +" class='img-circle mt-0' width='45' height='45'></div></td><td>" + member.Name + "</td><td>" + member.Email + "</td><td>" + member.Dob + "</td><td>" + member.Mobile + "</td><td>" + member.MaritalStatus + "</td></tr>";
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
    
});