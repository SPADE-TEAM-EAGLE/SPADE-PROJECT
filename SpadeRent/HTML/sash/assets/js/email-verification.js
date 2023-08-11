//js code
let id; let userEmail; let emailChange = false
$.ajax({
    url: 'https://backend.app.spaderent.com/api/spade/verifyMailCheck',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
    success: function (response) {
        console.log("here")
        if (response.message.split(":")[0] == "Your remaining days to verify your email") {
            $("#days-left").text(response.data > 1 ? " " + response.data + " days" : " " + response.data + " day")
            console.log("here")
            $("#user-email").val(userEmail)
            $("#modaldemo00").modal("show")
        } else if (response.message == "Email is verified") {
            $("#account-text").empty()
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
$(document).on("click", "#save-email", () => {
    emailChange = true
    // console.log(id)
    $.ajax({
        url: 'https://backend.app.spaderent.com/api/spade/emailUpdate',
        type: 'PUT',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: id,
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
    console.log(id)
    $.ajax({
        url: 'https://backend.app.spaderent.com/api/spade/resendCode',
        type: 'POST',
        contentType: "application/json; charset=utf-8",
        data: JSON.stringify({
            id: id
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
            id: id,
            token: $("#token").val(),
            email: emailChange ? $("#user-email").val() : userEmail,
            password: $("#id_password1").val(),
        }),
        success: function (response) {
            console.log(response)
            if (response.message == " Email verified successful ") {
                localStorage.setItem("authtoken", response.token);

                $("#modaldemo8").modal("hide")
                $("#succesModal").modal("show")
                $("#account-text").empty()
                $("#email_verification").remove()
                //   window.location="./index.html"
            } else if (response.message == " token code is not match ") {
                // $("#modaldemo8").modal("hide")
                //   $("#info-text").text(response.message || response)
                $("#infoModal").modal("show")
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