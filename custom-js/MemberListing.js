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
                            memberData += "<tr><td class='pr-5 pt-5'><div class='row pl-10'><img alt='' src='" + memberImage +"' class='img-circle familyMemberImage mr-10 mt-0' width='50' height='50'></td><td>" + member.FullName + "</div></td><td>" + member.FatherName +"</td><td>" + member.GrandFatherName + "</td><td>" + member.Gol + "</td><td>" + member.MulVatan + "</td><td>" + buttonURL + "</td></tr>";
						}
                    });
                    totalRows != 0 ? memberData : memberData = " <tr><td colspan='8' class='text-black font-weight-600 text-center'> No records found</td></tr>";
				}
				$('#MemberTableBody').html(memberData);
				$('#memberCount').html(totalRows);
				totalRows!=0? pagination(20) :null;
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
                    $('#MemberTableBody').html("");
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
                                memberData += "<tr><td class='pr-5 pt-5'><div class='row pl-10'><img alt='' src='" + memberImage + "' class='img-circle familyMemberImage mr-10 mt-0' width='50' height='50'></td><td>" + member.FullName + "</div></td><td>" + member.FatherName + "</td><td>" + member.GrandFatherName + "</td><td>" + member.Gol + "</td><td>" + member.MulVatan + "</td><td>" + buttonURL + "</td></tr>";
                            }
						});
					}
					totalRows != 0 ? $('#MemberTableBody').html(memberData) : $('#MemberTableBody').html(" <tr><td colspan='8' class='text-black font-weight-600 text-center'> No records found</td></tr>");
					totalRows != 0 ? $('#memberCount').html(totalRows) : $('#memberCount').html('0');
                    totalRows != 0 ? pagination(20) : null;
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
        var totalRows = $('tbody tr').length;
        var limitPerPage = maxRows;
        var totalPages = Math.ceil(totalRows / limitPerPage);
        var paginationSize = 7;
        var currentPage;

        function showPage(whichPage) {
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $('tbody tr').hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
            // Replace the navigation items (not prev/next):
            $(".pagination li").slice(1, -1).remove();
            getPageList(totalPages, currentPage, paginationSize).forEach(item => {
                $("<li>")
                    .addClass(
                    "page-item " +
                    (item ? "current-page " : "") +
                    (item === currentPage ? "active " : "")
                    )
                    .append(
                    $("<a>")
                        .addClass("page-link")
                        .attr({
                            href: "javascript:void(0)"
                        })
                        .text(item || "...")
                    )
                    .insertBefore("#next-page");
            });
            return true;
        }

        // Include the prev/next buttons:
        $(".pagination").append(
            $("<li>").addClass("page-item").attr({ id: "previous-page" }).append(
                $("<a>")
                    .addClass("page-link")
                    .attr({href: "javascript:void(0)"})
                    .text("Prev")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>")
                    .addClass("page-link")
                    .attr({href: "javascript:void(0)"})
                    .text("Next")
            )
        );

        // Show the page links
        $('tbody').show();
        showPage(1);

        $(document).on("click", ".pagination li.current-page:not(.active)", function () {
            return showPage(+$(this).text());
        });
        $("#next-page").on("click", function () {
            return showPage(currentPage + 1);
        });

        $("#previous-page").on("click", function () {
            return showPage(currentPage - 1);
        });
	}


    function getPageList(totalPages, page, maxLength) {
        if (maxLength < 5) throw "maxLength must be at least 5";

        function range(start, end) {
            return Array.from(Array(end - start + 1), (_, i) => i + start);
        }

        var sideWidth = maxLength < 9 ? 1 : 2;
        var leftWidth = (maxLength - sideWidth * 2 - 3) >> 1;
        var rightWidth = (maxLength - sideWidth * 2 - 2) >> 1;
        if (totalPages <= maxLength) {
            // no breaks in list
            return range(1, totalPages);
        }
        if (page <= maxLength - sideWidth - 1 - rightWidth) {
            // no break on left of page
            return range(1, maxLength - sideWidth - 1)
                .concat([0])
                .concat(range(totalPages - sideWidth + 1, totalPages));
        }
        if (page >= totalPages - sideWidth - 1 - rightWidth) {
            // no break on right of page
            return range(1, sideWidth)
                .concat([0])
                .concat(range(totalPages - sideWidth - 1 - rightWidth - leftWidth, totalPages));
        }
        // Breaks on both sides
        return range(1, sideWidth)
            .concat([0])
            .concat(range(page - leftWidth, page + rightWidth))
            .concat([0])
            .concat(range(totalPages - sideWidth + 1, totalPages));
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