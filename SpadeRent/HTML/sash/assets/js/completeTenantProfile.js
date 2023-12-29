function profileComplete(){
$(document).ready(function (){
        $.ajax({
    url: 'https://backend.app.spaderent.com/api/spade/ProfileCompleteTenant',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
    success: function (response) {
      // console.log(response);
        var myprogress = `<div class="progress-bar bg-info" style="width: `+response.count+`%;">`+response.count+`%</div>`;
        $(".progress").html(myprogress)
    },
    error: function (xhr, status, error) {
      // console.log('Error occurred while fetching state and city data.');
      // console.log(xhr);
      // console.log(error);
    }
});
});
}
profileComplete();