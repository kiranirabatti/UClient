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
                    newaddress = addr.length>20?addr.substring(0, 20) + "...":addr
                    member= `<div class="col-xs-12">
                         <div class="mb-20 border-1px">
                              <div class="team-thumb pull-left pt-0 pl-0">
                                    <img src="`+memberImage+`" width="100" height="90">
                                         </div>
                                                <div class="team-bottom-part pt-15 pb-15 pl-0">
                                                    <h4 class="m-0 pb-0 text-center font-weight-500 font-18">`+name+`</h4>
                                                    <ul class="list-inline mt-0 text-center">
                                                        <li class="mt-10 pr-10 text-center"><i class="fa fa-map-marker text-theme-colored2 mr-5"></i><span id="">`+newaddress+`</span> </li>
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