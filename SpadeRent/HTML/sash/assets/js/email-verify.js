//js code
$("#save-email").addClass("disabled")
let id1; let userEmail; let emailChange = false
var password_varify_match = /^(?=.*[A-Z])(?=.*\W)[a-zA-Z0-9\W]{8,}$/;
        var email_verify_password = document.getElementById("email-verify-password");
        email_verify_password.addEventListener('keyup', confirmPasswordValidation1_verify);
        // var spantag11 = document.getElementById("passnotmatch1");

        function confirmPasswordValidation1_verify() {

            if ($("#token").val() !== " " && email_verify_password.value.match(password_varify_match)) {
                email_verify_password.classList.add("border-green");
                $("#verify-btn").removeClass("disabled")
            } else {
                $("#verify-btn").addClass("disabled")
                email_verify_password.classList.remove("border-green");
            }
        }
$(document).ready(function () {
    $.ajax({
        url: 'https://backend.app.spaderent.com/api/spade/protected',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
        },
        success: function ({ userName, email, userId, image }) {
            function toTitleCase(str) {
                return str.replace(/\w\S*/g, function (txt) {
                    return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
                });
            }
            if(image!==" " && image!==null && image!== ""){
                
                $("#user-img").attr("src", image)
                $("#user-img-dark").attr("src", image)
            }


            $("#user-name").text(toTitleCase(userName))
            $("#header-user").text(toTitleCase(userName))
            userEmail = email
            id1 = userId
            console.log($("#user-email"))
            $("#user-email").val(email)
        },
        error: function (xhr, status, error) {
            $("#myModal_warning").modal("show");
            setTimeout(function () {
                $('#myModal_warning').modal('hide');
                window.location = '../Landlord/login_module.html';
            }, 20000);
            console.log('Error occurred while fetching state and city data.');
            console.log(xhr);
            console.log(error);
            // console.log('Error occurred while fetching state and city data.');
        }
    });
    $.ajax({
        url: 'https://backend.app.spaderent.com/api/spade/verifyMailCheck',
        method: 'GET',
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
        },
        success: function (response) {
            
            if (response.message.split(":")[0] == "Your remaining days to verify your email") {
                if ($('body').hasClass('dark-mode')) {
                    $('.Rent-logo').attr('src', '../assets/images/logo_white.png');
                } else {
                    $('.Rent-logo').attr('src', '../assets/images/Artboard GÇô 1.svg');
                }
                $("#days-left").text(response.data > 1 ? " " + response.data + " days" : " " + response.data + " day")
                $("#account-text").text("Your account will be locked after "+(response.data > 1 ? " " + response.data + " days" : " " + response.data + " day"))
                $("#user-email").val(userEmail)
                $("#modaldemo00").modal("show")
            } else if (response.message == "Email is verified") {
               
                $("#account-text").addClass("d-none")
                $("#email_verification").remove()
            }
        },
        error: function (xhr, status, error) {
            console.log('Error occurred while fetching state and city data.');
            console.log(xhr);
            console.log(error);
            // console.log('Error occurred while fetching state and city data.');
        }
    });

   
    
    
    $('#email_verification').on('click', function() {
        if ($('body').hasClass('dark-mode')) {
            $('.Rent-logo').attr('src', '../assets/images/logo_white.png');
        } else {
            $('.Rent-logo').attr('src', '../assets/images/Artboard GÇô 1.svg');
        }
    });
})