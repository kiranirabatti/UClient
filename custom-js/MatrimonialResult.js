$(document).ready(function () {
	var formData = GetParameterValues();
	function GetParameterValues() {
		var url = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		var urlparam = url[0].split('=');
		return urlparam[1];
	}
	var decrypted = CryptoJS.AES.decrypt(formData, "Secret");
	var parameterValue = JSON.parse(CryptoJS.enc.Utf8.stringify(decrypted));
	var loggedin = localStorage.getItem('isLoggedIn');
	var fromAge = parameterValue.fromAge;
	var toAge = parameterValue.toAge;
	var manglik = parameterValue.manglik;
	var citizenship = parameterValue.citizenship;
	var marital = parameterValue.marital;
	var gender = parameterValue.gender;
	var height = parameterValue.height;
	var education = parameterValue.education;
	var city = parameterValue.city;
	var native = parameterValue.native;
	var handicap = parameterValue.handicap;

	$.ajax({
		url: nodeURL + '/searchMatrimonial/' + fromAge + "/" + toAge + "/" + manglik + "/" + marital + "/" + gender + "/" + education + "/" + city + "/" + citizenship + "/" + native + "/" + height + "/" + handicap,
		type: 'GET',
		dataType: 'json',
        success: function (result) {
			var resultFound = '<h5 class="font-16 mt-5">' + result.length + ' Result(s) Found</h5>';
			$(".resultFound").append(resultFound);
			if (result.length > 0) {
				var divHTML = '';
				$.each(result, function (i, member) {
					var buttonURL = (loggedin != 'true') ?
						'<a class="btn btn-theme-colored2 btn-border btn-circled viewDetail" data-toggle="modal" href="LoginModal.html" data-id="' + member.FamilyMemberId + '" data-fileName="Matrimonial" data-target="#myModal">View Details</a>' :
						'<a class="btn btn-theme-colored2 btn-border btn-circled viewDetail" href="ViewMatrimonialDetails.html?id=' + member.FamilyMemberId + '&fileName=Matrimonial">View Details</a>';

					var imgURL = member.FileNameInFolder == '' ? nodeURL + "/defaultImage" : nodeURL + "/getFamilyMemberImage/" + member.MemberId + '/' + member.FamilyMemberId + '/' + member.FileNameInFolder;

                    var CityName = member.CityData.length == 0 ? '' : member.CityData[0].CityName
					divHTML = '<div class="col-xs-12 col-sm-6 col-md-6 pag">' + '<div class="team-members mb-40">' + '<div class="team-thumb pull-left team-pull-none flip mr-sm-0 t-mr-0">' +
						'<img src =' + imgURL + ' width="270" height="225"/>' +
						'</div>' +
						'<div class="team-bottom-part border-1px p-15">' +
						'<h4 class="text-uppercase font-weight-600 m-0 pb-5">' + member.Name + '</h4>' +
						'<ul>' +
						'<li class="m-0 pr-10"> <i class="fa fa-tint text-theme-colored2 mr-5"></i> <a class="text-gray" href="#">' + member.BloodGroup + '</a> </li>' +
						'<li class="m-0 pr-10"> <i class="fa fa-envelope-o text-theme-colored2 mr-5"></i> <a class="text-gray" href="#">' + member.Email + '</a> </li>' +
                        '<li class="m-0 pr-10"> <i class="fa fa-address-card text-theme-colored2 mr-5"></i> <a class="text-gray" href="#">' + CityName + '</a> </li>' +
						'</ul >' +
						'<div class="icon-theme-colored mt-15">' +
						buttonURL +
						'</div>' +
						'</div>' + '</div>' + '</div>'
					$('#resultData').append(divHTML);
				});
				pagination(6);
			}
		},
		error: function (err) {
			console.log(err);
		}
	});

    function pagination(maxRows) {
        $(".pagination").html('');
        var totalRows = $('.pag').length;
        var limitPerPage = maxRows;
        var totalPages = Math.ceil(totalRows / limitPerPage);
        var paginationSize = 7;
        var currentPage;

        function showPage(whichPage) {
            if (whichPage < 1 || whichPage > totalPages) return false;
            currentPage = whichPage;
            $('.pag').hide().slice((currentPage - 1) * limitPerPage, currentPage * limitPerPage).show();
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
                    .attr({ href: "javascript:void(0)" })
                    .text("Prev")
            ),
            $("<li>").addClass("page-item").attr({ id: "next-page" }).append(
                $("<a>")
                    .addClass("page-link")
                    .attr({ href: "javascript:void(0)" })
                    .text("Next")
            )
        );

        // Show the page links
        $('.pag').show();
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
});