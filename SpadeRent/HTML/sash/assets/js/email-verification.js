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
            $("#user-img").attr("src", image)
            $("#user-img-dark").attr("src", image)


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
            }, 2000);
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
    $("#change-email").on("click", () => {
        $("#user-email").prop("readonly", false)
        $("#change-email").addClass("d-none")
        $("#send-email").addClass("d-none")
        $("#save-email").removeClass("d-none")
    })
    $("#remind-later").click(() => {
        $("#modaldemo00").modal("hide")
    })
    $("#user-email").on("input", () => {
        var emailRegex = /^[\w\.-]+@[a-zA-Z\d\.-]+\.[a-zA-Z]{2,}$/;
        if($("#user-email").val() == userEmail){
            $("#save-email").addClass("disabled")
            $("#verify-email-span").addClass("d-none")
        }else if(!emailRegex.test($("#user-email").val())){
            $("#save-email").addClass("disabled")
            $("#verify-email-span").addClass("d-none")
        }
        else{

            $.ajax({
                url: "https://backend.app.spaderent.com/api/spade/checkemail",
                type: "GET",
                contentType: "application/json; charset=utf-8",
                data: {
                    email: $("#user-email").val()
                },
                success: function(response) {
                    
                    if(response.message == "New user")
                    {
                        $("#save-email").removeClass("disabled")
                        $("#verify-email-span").addClass("d-none")
                    }
                },
                error: function(xhr, status, error) {
                    console.error($("#save-email"));
                    $("#save-email").addClass("disabled")
                    $("#verify-email-span").removeClass("d-none")
                    
                },
            });
        }
        // if ($("#user-email").val() !== userEmail) {
        //     $("#save-email").removeClass("disabled")
        // } else {
        //     $("#save-email").addClass("disabled")
        // }
    })
    $(document).on("click", "#save-email", () => {
        emailChange = true
        // console.log(id)
        $.ajax({
            url: 'https://backend.app.spaderent.com/api/spade/emailUpdate',
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                id: id1,
                email: $("#user-email").val()
            }),
            success: function (response) {
                $("#user-email").prop("readonly", true)
                $("#change-email").removeClass("d-none")
                $("#send-email").removeClass("d-none")
    
                $("#save-email").addClass("d-none")
            },
            error: function (xhr, status, error) {
                // window.alert(xhr.statusText)
                console.error(xhr.responseText);
            }
        });
    })
    $("#send-email").on("click", () => {
        
        $.ajax({
            url: 'https://backend.app.spaderent.com/api/spade/resendCode',
            type: 'POST',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                id: id1
            }),
            success: function (response) {
                $("#modaldemo00").modal("hide")
                $("#modaldemo8").modal("show")
            },
            error: function (xhr, status, error) {
                // window.alert(xhr.statusText)
                console.error(xhr.responseText);
            }
        });
    })
    $("#verify-btn").on("click", () => {
        $.ajax({
            url: 'https://backend.app.spaderent.com/api/spade/verifyEmailUpdate',
            type: 'PUT',
            contentType: "application/json; charset=utf-8",
            data: JSON.stringify({
                id: id1,
                token: $("#token").val(),
                email: emailChange ? $("#user-email").val() : userEmail,
                password: $("#email-verify-password").val(),
            }),
            success: function (response) {
                console.log(response)
                if (response.message == " Email verified successful ") {
                    localStorage.setItem("authtoken", response.token);
    
                    $("#modaldemo8").modal("hide")
                    $("#succesModal_verify").modal("show")
                    $("#account-text").empty()
                    $("#email_verification").remove()
                    //   window.location="./index.html"
                } else if (response.message == " token code is not match ") {
                    // $("#modaldemo8").modal("hide")
                    //   $("#info-text").text(response.message || response)
                    $("#infoModal_verify").modal("show")
                }
            },
            error: function (xhr, status, error) {
                // window.alert(xhr.statusText)
                document.getElementById("verification-spans").style.display = "block";
                $("#verification").addClass("is-invalid")
                console.error(xhr.responseText);
            }
        });
    })
})