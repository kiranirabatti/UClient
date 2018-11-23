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
                            committeeMemberImage = !committeeMember.CommitteeMemberData.FileNameInFolder ? nodeURL + "/defaultImage" : committeeMember.CommitteeMemberData.FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + committeeMember.CommitteeMemberData.MemberId + '/' + committeeMember.CommitteeMemberData.FileNameInFolder : nodeURL + "/defaultImage";
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
        committeeMemberSearchData = '';
        if ($("#searchValue").val().replace(/^\s+|\s+$/g, "").length != 0) {
            $.ajax({
                url: nodeURL + "/searchCommitteeMember/" + dropDownValue + "/" + searchValue,
                type: "GET",
                data: {},
                dataType: "json",
                success: function (committeeData) {
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
        trNumber = 0;
        totalRows = 0;
        totalRows = $('#committeeMemberTableBody tr').length;
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