$(document).ready(function () {
	var memberData, memberValue, memberValue1, memberValue2, member, searchValue, dropDownValue = "";
	var totalRows, pagenum, maxRows, trIndex, trNumber, currentPage, rows, i, memberId, sortOrder = 0;
	var loggedIn = localStorage.getItem('isLoggedIn');
	getAllMember();
	$('#cancelSearch').prop("disabled", true);
	$("#searchName").val('FullName');
	$("#searchValue").val('');

	function getAllMember() {
		memberData = '';
		$.ajax({
			url: nodeURL + '/allmembers/',
			type: "GET",
			data: {},
			dataType: "json",
			success: function (result) {
				if (result.length == 0) {
					totalRows = 0;
					memberData = " <tr><td colspan='8' class='text-black font-weight-600 text-center'> No records found</td></tr>"
				}
				else {
					totalRows = 0;
					$.each(result, function (key, member) {
						var buttonURL = (loggedIn != 'true') ?
							'<a class="btn btn-dark btn-circled btn-sm viewDetails" data-toggle="modal" href="LoginModal.html" data-id="' + member.MemberId + '" data-fileName="MemberListing" data-target="#myModal">View </a>' :
							'<a class="btn btn-dark btn-circled btn-sm viewDetails" href="MemberDetails.html?id=' + member.MemberId + '">View </a>';
                        if (member.IsActive == true) {
                            memberImage = member.FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + member.MemberId + '/' + member.FileNameInFolder: nodeURL + "/defaultImage";
							totalRows++;
                            memberData += "<tr><td class='pr-5 pt-5'><div class='row'><img alt='' src='" + memberImage +"' class='img-circle familyMemberImage mr-10 mt-0' width='50' height='50'></td><td>" + member.FullName + "</div></td><td>" + member.FatherName +"</td><td>" + member.GrandFatherName + "</td><td>" + member.Gol + "</td><td>" + member.MulVatan + "</td><td>" + buttonURL + "</td></tr>";
						}
                    });
                    totalRows != 0 ? memberData : memberData = " <tr><td colspan='8' class='text-black font-weight-600 text-center'> No records found</td></tr>";
				}
				$('#MemberTableBody').html(memberData);
				$('#memberCount').html(totalRows);
				pagination(10);
			},
			error: function (err) {
				console.log(err.statusText);
			}
		});
	}

	$("#searchValue").bind('input', function () {
		var searchValue = $(this).val();
		if (searchValue != '') {
			$('#cancelSearch').prop("disabled", false);
		}
		else {
			$('#cancelSearch').prop("disabled", true);
		}

	});

	$('#search').on('click', function () {
		dropDownValue = $("#searchName").val()
		searchValue = $("#searchValue").val()
		memberData = '';
		if ($("#searchValue").val().replace(/^\s+|\s+$/g, "").length != 0) {
			$.ajax({
				url: nodeURL + "/searchMember/" + dropDownValue + "/" + searchValue,
				type: "GET",
				data: {},
				dataType: "json",
				success: function (result) {
					totalRows = 0
					if (result.length == 0) {
						totalRows = 0
						memberData = " <tr><td colspan='8' class='text-black font-weight-600 text-center'> No records found</td></tr>"
					}
					else {
						$.each(result, function (key, member) {
                            var buttonURL = (loggedIn != 'true') ?
                                '<a class="btn btn-dark btn-circled btn-sm viewDetails" data-toggle="modal" href="LoginModal.html" data-id="' + member.MemberId + '" data-fileName="MemberListing" data-target="#myModal">View </a>' :
                                '<a class="btn btn-dark btn-circled btn-sm viewDetails" href="MemberDetails.html?id=' + member.MemberId + '">View </a>';
                            if (member.IsActive == true) {
                                memberImage = member.FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + member.MemberId + '/' + member.FileNameInFolder : nodeURL + "/defaultImage";
                                totalRows++;
                                memberData += "<tr><td class='pr-5 pt-5'><div class='row'><img alt='' src='" + memberImage + "' class='img-circle familyMemberImage mr-10 mt-0' width='50' height='50'></td><td>" + member.FullName + "</div></td><td>" + member.FatherName + "</td><td>" + member.GrandFatherName + "</td><td>" + member.Gol + "</td><td>" + member.MulVatan + "</td><td>" + buttonURL + "</td></tr>";
                            }
						});
					}
					totalRows != 0 ? $('#MemberTableBody').html(memberData) : $('#MemberTableBody').html(" <tr><td colspan='8' class='text-black font-weight-600 text-center'> No records found</td></tr>");
					totalRows != 0 ? $('#memberCount').html(totalRows) : $('#memberCount').html('0');
					pagination(10);


					$(".viewDetails").on('click', function () {
						memberId = $(this).attr("value");
						(loggedIn != 'true') ? window.location = "MemberLogin.html?id=" + memberId + "&fileName=MemberListing" : window.location = "MemberDetails.html?id=" + memberId;
					});
				},
				error: function (err) {
					console.log(err.statusText);
				}
			});
		}
	});

	$("#cancelSearch").on('click', function () {
		totalRows = 0;
		$("#searchName").val('FullName');
		$("#searchValue").val('');
		$('#cancelSearch').prop("disabled", true);
		getAllMember();
	})

	$("#maxRows").on('change', function () {
		maxRows = parseInt($(this).val());
		pagination(maxRows);
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

	function sortTable(sortOrder, members) {
		rows = $('#memberTable tbody  tr').get();
		rows.sort(function (a, b) {
			memberValue1 = getVal(a);
			membervalue2 = getVal(b);
			if (memberValue1 < membervalue2) {
				return -1 * sortOrder;
			}
			else {
				return 1 * sortOrder;
			}
			return 0;
		});
		function getVal(element) {
			memberValue = $(element).children('td').eq(members).text().toUpperCase();
			if ($.isNumeric(memberValue)) {
				memberValue = parseInt(memberValue, 10);
			}
			return memberValue;
		}
		$.each(rows, function (index, row) {
			$('#memberTable').children('tbody').append(row);
		});
	}

	sortOrder = 1;
	function memberSort() {
		$(this).find('.arrow_up').toggleClass('arrow_down');
		sortOrder *= -1;
		member = $(this).prevAll().length;
		sortTable(sortOrder, member);
	}
	$("#firstName").click(memberSort);
    $("#fatherName").click(memberSort);
	$("#grandfatherName").click(memberSort);
	$("#gol").click(memberSort);
	$("#mulVtan").click(memberSort);
});