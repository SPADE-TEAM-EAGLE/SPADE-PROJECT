function notificationIconDisplay(){
    $(document).ready(function (){
        $.ajax({
            url: 'http://localhost:3000/api/spade/checkNotify',
            method: 'GET',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
            },
            success: function (response) {
                console.log("checkNotify");
                console.log(response);
                if(response.push == "yes"){
                    $(".notifications").removeClass("d-none")
                    $(".notifications").addClass("d-flex")
                }else{
                    $(".notifications").removeClass("d-flex")
                    $(".notifications").addClass("d-none")
                }
            },
            error: function (xhr, status, error) {
                console.log('Error occurred while fetching state and city data.');
                console.log(xhr);
                console.log(error);
            }
        });
    });
}
notificationIconDisplay()