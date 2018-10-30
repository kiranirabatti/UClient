$(document).ready(function () {
    var member='';
    $.ajax({
        url: nodeURL + '/allmembers/',
        type: "GET",
        data: {},
        dataType: "json",
        success: function (result) {
            result.reverse();
            count = 1;
            $.each(result, function (index, value) {
                if (count < 4) {
                    var memberImage=result[index].FileNameInFolder != "" ? nodeURL + '/getMemberPhoto/' + result[index].MemberId + '/' + result[index].FileNameInFolder
                        : nodeURL + "/defaultImage";
                    var name=result[index].FullName;
                    var addr = result[index].Address
                    newaddress = addr.length>40?addr.substring(0, 20) + "...":addr
                    member= `<div class="col-xs-12">
                         <div class="mb-20 border-1px">
                              <div class="team-thumb pull-left pt-0 pl-0">
                                    <img src="`+memberImage+`" width="140" height="133">
                                         </div>
                                                <div class="team-bottom-part p-15">
                                                    <h4 class="m-0 pb-0 text-center">`+name+`</h4>
                                                    <ul class="list-inline mt-0 text-center">
                                                        <li class="m-0 pr-10 text-center"><i class="fa fa-map-marker text-theme-colored2 mr-5"></i><span id="">`+newaddress+`</span> </li>
                                                    </ul>
                                                    <ul class="styled-icons icon-sm icon-dark icon-theme-colored2 mt-15 text-center">
                                                        <li><a><i class="fa fa-facebook"></i></a></li>
                                                        <li><a><i class="fa fa-twitter"></i></a></li>
                                                        <li><a><i class="fa fa-vk"></i></a></li>
                                                        <li><a><i class="fa fa-instagram"></i></a></li>
                                                        <li><a><i class="fa fa-google-plus"></i></a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>`
                    $('#newMembers').append(member)
                }
                count++;
            });
        },
        error: function (err) {
            console.log(err.statusText);
        }
    });
});