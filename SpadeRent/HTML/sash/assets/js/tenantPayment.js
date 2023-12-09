$.get('https://api.ipify.org?format=json',
                        function (response) {
                            userIp=response.ip;
                        }, "json")
var sfc = SafeCharge({
    env: 'int', // Nuvei API environment - 'int' (integration) or 'prod' (production - default if omitted)
    merchantId: '6400701569295268447', // your Merchant ID provided by Nuvei
    merchantSiteId: '244298' // your Merchant Site ID provided by Nuvei
});
var ScFields = sfc.fields({
    fonts: [
        { cssUrl: 'https://fonts.googleapis.com/css?family=Roboto' }, // include your custom fonts
    ]
})
var ScFieldStyles = {
    base: {
        color: '#32325D',
        fontWeight: 500,
        fontFamily: 'Roboto, Consolas, Menlo, monospace',
        fontSize: '16px',
        fontSmoothing: 'antialiased',
        '::placeholder': {
            color: '#CFD7DF',
        },
        ':-webkit-autofill': {
            color: '#e39f48',
        },
    },
    invalid: {
        color: '#E25950',
        '::placeholder': {
            color: '#FFCCA5',
        },
    },
};
var ScFieldClasses = {
    focus: 'focused',
    empty: 'empty',
    invalid: 'invalid',
    complete: 'complete',
    number: 'card-number'
};
var scard = ScFields.create('ccNumber', {
    style: ScFieldStyles,
    classes: ScFieldClasses,
    id: 'card-number-input'
});
scard.attach('#card-number');
var cardExpiry = ScFields.create('ccExpiration', {
    style: ScFieldStyles,
    classes: ScFieldClasses,
});
cardExpiry.attach('#card-expiry');
var cardCvc = ScFields.create('ccCvc', {
    style: ScFieldStyles,
    classes: ScFieldClasses,
});
cardCvc.attach('#card-cvc');
function main() {
        $("#preloader").css("display", "flex")
        $.ajax({
            url: 'https://backend.app.spaderent.com/api/spade/openOrder',
            type: 'POST',
            data: JSON.stringify({
                amount: $("#amount-card").val(),
                currency: "USD",
                userId: userData.userId,
            }),
            contentType: "application/json; charset=utf-8",
            processData: false,
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
            },
            success: function (response) {
                if ($("#new-account-card").hasClass("active")) {
                    sfc.createPayment({
                        sessionToken: response.sessionToken, //received from openOrder API
                        clientUniqueId: "695701003",
                        merchantId: "6400701569295268447",
                        merchantSiteId: "244298",
                        cardHolderName: (userData.firstName + " " + userData.lastName),
                        paymentOption: scard,
                        billingAddress: {
                            email: userData.email,
                            country: "US"
                        }
                    }, function (res) {
                        if (res?.transactionStatus?.toLowerCase() == "approved" && res?.result?.toLowerCase() == "approved") {
                            
                        } else {
                            $("#upgradetopro").modal("hide")
                            $("#preloader").css("display", "none")
                            $("#myModal_declined").modal("show")
                            setTimeout(function () {
                                $("#myModal_declined").modal("hide");
                            }, 2000);
                        }
                    });
                } else {
                    sfc.createPayment({
                        sessionToken: response.sessionToken, //received from openOrder API
                        clientUniqueId: "695701003",
                        merchantId: "6400701569295268447",
                        merchantSiteId: "244298",
                        cardHolderName: (userData.firstName + " " + userData.lastName),
                        paymentOption: {
                            userPaymentOptionId: $("#account").val(),
                        },
                        billingAddress: {
                            email: userData.email,
                            country: "US"
                        }
                    }, function (res) {
                        if (res?.transactionStatus?.toLowerCase() == "approved" && res?.result?.toLowerCase() == "approved") {
                            
                        
                        } else {
                            $("#upgradetopro").modal("hide")
                            $("#preloader").css("display", "none")
                            $("#myModal_declined").modal("show")
                            setTimeout(function () {
                                $("#myModal_declined").modal("hide");
                            }, 2000);
                        }
                    });
                }
                console.log(response)
            },
            error: function (xhr, status, error) {
                console.log(xhr)
                console.log(status)
                console.log(error)
                console.error('Error sending data:', error);
            }
        });
    }
            
            
$("#submit-ach").on("click",function(){
    $("#preloader").css("display", "flex")
    $.ajax({
        url: 'https://backend.app.spaderent.com/api/spade/openOrder',
        type: 'POST',
        data: JSON.stringify({
            amount: $("#amount-ach").val(),
            currency: "USD",
            "userTokenId": "280",
        }),
        contentType: "application/json; charset=utf-8",
        processData: false,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
        },
        success: function (response) {
            console.log(scard)
            
            sfc.createPayment({
sessionToken: response.sessionToken,
paymentOption: {
alternativePaymentMethod: {
paymentMethod: "apmgw_ACH",
AccountNumber: $("#account-number-ach").val(),
RoutingNumber: $("#routing-number-ach").val()
}
},
deviceDetails: {
ipAddress: userIp
},
billingAddress: {
firstName: userData.firstName,
lastName: userData.lastName,
email: userData.email,
phone: userData.phoneNumber,
address: userData.address,
city: userData.city,
zip: userData.zipCode,
state: "abcd",
country: "US",
},
userDetails: {
firstName: userData.firstName,
lastName: userData.lastName,
email: userData.email,
phone: userData.phoneNumber,
address: userData.address,
city: userData.city,
zip: userData.zipCode,
state: "abcd",
country: "US",
identification: userData.userId
}
}, function(res) {
console.log(res);

})
        
                },
        error: function (xhr, status, error) {
            console.log(xhr)
            console.log(status)
            console.log(error)
            console.error('Error sending data:', error);
        }
    });
    
})




$("#upgradetopro-btn").on("click", function () {
    $("#closeaccount").modal("hide");
    const amount = $("#amount-payable").text().split("$")[1];
    $("#amount-card,#amount-ach").val(amount)
    $("#amount-existing").val(amount)
    $("#payment-total-card,#payment-total-ach").text(amount)
    $("#payment-total-existing-card").text(amount)
    $("#selectMethod").modal("show");
})
$("#card-modal").on("click", function () {
    $("#selectMethod").modal("hide");
    $("#upgradetopro-card-modal").modal("show");
    
})
$("#ach-modal").on("click", function () {
    $("#selectMethod").modal("hide");
    $("#upgradetopro-ach-modal").modal("show");
    
})
