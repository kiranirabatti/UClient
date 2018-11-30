$(document).ready(function () {
    var totalRows = 0;
    var dropDownValue, searchValue, CommitteeMemberData, committeeMemberSearchData, committeeMemberImage;

    loadCommitteeMemberData();
    $('#cancelSearch').prop("disabled", true);
    $("#searchName").val('DesignationData.Designation');
    $("#searchValue").val('');
    function loadCommitteeMemberData() {
        committeeMemberData = '';
        $.ajax({
            url: nodeURL + '/committeeMember/',
            type: "GET",
            data: {},
            dataType: "json",
            success: function (committeeData) {
                if (committeeData.length == 0) {
                    totalRows = 0;
                    committeeMemberData = " <tr><td colspan='3' class='text-black font-weight-600 text-center'> No records found</td></tr>"
                }
                else {
                    totalRows = 0;
                    $.each(committeeData, function (key, committeeMember) {
                        if (committeeMember.CommitteeMemberData.IsActive == true) {
                            totalRows++;
                            committeeMemberImage = committeeMember.CommitteeMemberData.FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + committeeMember.CommitteeMemberData.MemberId + '/' + committeeMember.CommitteeMemberData.FileNameInFolder : nodeURL + "/defaultImage";
                            committeeMemberFullName = committeeMember.CommitteeMemberData.FullName;
                            committeeMemberAddress = committeeMember.CommitteeMemberData.Address + ' ' + committeeMember.CommitteeMemberData.Taluka + ' ' + committeeMember.CommitteeMemberData.Jeello + ' ' + committeeMember.CommitteeMemberData.PinCode
                            committeeMemberEmail = committeeMember.CommitteeMemberData.Email;
                            committeeMemberData += "<tr><td class='ml-100'><div><img src=" + committeeMemberImage + " class='memberImage border-2px' height='120' width='150'></div></td><td>" + committeeMember.DesignationData.Designation + "</td> <td> <h4 class='text-info font-weight-500 mt-0 mb-5'>" + committeeMemberFullName + '</h4>' + committeeMemberAddress + '<br/>' + committeeMemberEmail + "</td></tr > ";
                        }
                    });
                    totalRows != 0 ? committeeMemberData : committeeMemberData= " <tr><td colspan='3' class='text-black font-weight-600 text-center'> No records found</td></tr>";
                }
                $('#committeeMemberTableBody').html(committeeMemberData)
                $('#memberCount').html(totalRows);
                pagination(5);
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
        committeeMemberSearchData = "";
        if ($("#searchValue").val().replace(/^\s+|\s+$/g, "").length != 0) {
            $.ajax({
                url: nodeURL + "/searchCommitteeMember/" + dropDownValue + "/" + searchValue,
                type: "GET",
                data: {},
                dataType: "json",
                success: function (committeeData) {
                    $('#committeeMemberTableBody').html("")
                    if (committeeData.length == 0) {
                        totalRows = 0;
                        committeeMemberSearchData = " <tr><td colspan='3' class='text-black font-weight-600 text-center'> No records found</td></tr>"
                    }
                    else {
                        totalRows = 0
                        $.each(committeeData, function (key, committeeMember) {
                            if (committeeMember.CommitteeMemberData.IsActive == true) {
                                totalRows++;
                                committeeMemberImage = committeeMember.CommitteeMemberData.FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + committeeMember.CommitteeMemberData.MemberId + '/' + committeeMember.CommitteeMemberData.FileNameInFolder : nodeURL + "/defaultImage";
                                committeeMemberFullName = committeeMember.CommitteeMemberData.FullName;
                                committeeMemberAddress = committeeMember.CommitteeMemberData.Address + ' ' + committeeMember.CommitteeMemberData.Taluka + ' ' + committeeMember.CommitteeMemberData.Jeello + ' ' + committeeMember.CommitteeMemberData.PinCode
                                committeeMemberEmail = committeeMember.CommitteeMemberData.Email;
                                committeeMemberSearchData += "<tr><td class='ml-100'><div><img src=" + committeeMemberImage + " class='memberImage border-2px' height='120' width='150'></div></td><td>" + committeeMember.DesignationData.Designation + "</td> <td> <h4 class='text-info font-weight-500 mt-0 mb-5'>" + committeeMemberFullName + '</h4>' + committeeMemberAddress + '<br/>' + committeeMemberEmail + "</td></tr > ";
                            }
                            else {
                                totalRows = 0
                                committeeMemberSearchData = " <tr><td colspan='3' class='text-black font-weight-600 text-center'> No records found</td></tr>"
                            }
                        });
                    }
                    $('#committeeMemberTableBody').html(committeeMemberSearchData)
                    $('#memberCount').html(totalRows);
                    pagination(5);
                },
                error: function (err) {
                    console.log(err.statusText);
                }
            });
        }
    });

    $("#cancelSearch").on('click', function () {
        totalRows = 0;
        $("#searchName").val('DesignationData.Designation');
        $("#searchValue").val('');
        $('#cancelSearch').prop("disabled", true);
        loadCommitteeMemberData();
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
        rows = $('#committeeMemberTableBody  tr').get();
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
    $("#committeeMemberDesignation").click(memberSort);
})