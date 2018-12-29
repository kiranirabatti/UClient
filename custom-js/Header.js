$(document).ready(function () {
    var currentPageUrl = window.location.pathname.split("/").pop();
    if (currentPageUrl == '') {
        currentPageUrl = 'index.html';
    }

    var currentDate = new Date()
    var year = currentDate.getFullYear();
    $('#year').html(year);

    $('.menuzord-menu li a').each(function () {
        var href = $(this).attr('href');
        if (currentPageUrl == href) {
            if (currentPageUrl == 'presidentMessage.html' || 'prajapatiHistory.html' || 'mandalHistory.html') {
                $(this).parents('li').addClass('active');
            }
            $(this).closest('li').addClass('active');
        }
    });
    currentPageUrl == 'Event.html' ? $('#pageName').html('Events') : null;
    currentPageUrl == 'mandalHistory.html' ? $('#pageName').html('UGPS History') : null;
    currentPageUrl == 'CommitteeMember.html' ? $('#pageName').html('Committee Members') : null;
    currentPageUrl == 'ContactUs.html' ? $('#pageName').html('Contact Us') : null;
    currentPageUrl == 'EventDetails.html' ? $('#pageName').html('Event Details') : null;
    currentPageUrl == 'Gallery.html' ? $('#pageName').html('Gallery') : null;
    currentPageUrl == 'MatrimonialResult.html' ? $('#pageName').html('Matrimonial Details') : null;
    currentPageUrl == 'MatrimonialSearch.html' ? $('#pageName').html('Matrimonial Search') : null;
    currentPageUrl == 'MemberDetails.html' ? $('#pageName').html('Member Details') : null;
    currentPageUrl == 'Members.html' ? $('#pageName').html('Members') : null;
    currentPageUrl == 'prajapatiHistory.html' ? $('#pageName').html('Prajapati History') : null;
    currentPageUrl == 'presidentMessage.html' ? $('#pageName').html('President Message') : null;
    currentPageUrl == 'MemberProfileEdit.html' ? $('#pageName').html('Edit Member Profile') : null;
    currentPageUrl == 'FamilyMembersList.html' ? $('#pageName').html('Family Member') : null;

    var memberId = localStorage.getItem('memberId');
    var familyMemberId = localStorage.getItem('familyMemberId')
    if (memberId != null && familyMemberId == 'null') {
        $('#showMenuMember').show();
    }
    else {
        console.log("hide")
        $('#showMenuMember').hide();
    }
})