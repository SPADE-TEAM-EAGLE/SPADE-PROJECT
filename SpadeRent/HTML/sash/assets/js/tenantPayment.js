$.ajax({
    url: "http://localhost:3000/api/spade/GetBankAccountTenant",
    type: "GET",
    contentType: "application/json",
    headers: {
        Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
      // console.log(response)
        if (response.data.length > 0) {
            $("#account").empty();
            $("#account").append(`<option value="">Select Account</option>`);
            response.data.forEach((element) => {
                $("#account").append(
                    `<option value="${element.UPOID}">${element.accountName}</option>`
                );
            });
        }
    },
    error: function (xhr, status, error) {
      // console.log(error);
    }
});



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
            url: 'http://localhost:3000/api/spade/openOrder',
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
                            if($("#amount-payable").text().split("$")[1]== $("#amount-card").val()){
                                $.ajax({
                                    url: 'http://localhost:3000/api/spade/tenantUpdateAllInvoices',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        status: "paid",
                                    }),
                                    contentType: "application/json",
                                    
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                                    },
                                    success: function (response) {
                                        $("#upgradetopro-card-modal").modal("hide")
                                        
                                        $("#preloader").css("display", "none")
                                        $("#succesModal_invoice").modal("show")
                                        setTimeout(function () {
                                            $("#succesModal_invoice").modal("hide");
                                        }, 2000);
                                    },
                                    error: function (xhr, status, error) {
                                      // console.log(xhr)
                                      // console.log(status)
                                        $("#upgradetopro-card-modal").modal("hide")
                                        $("#preloader").css("display", "none")
                                      // console.log(error)
                                        // console.error('Error sending data:', error);
                                    }
                                });      
                            }else{
                                $.ajax({
                                    url: 'http://localhost:3000/api/spade/tenantUpdateIndividualInvoices',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        status: "paid",
                                        id:invoiceId
                                    }),
                                    contentType: "application/json",
                                    
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                                    },
                                    success: function (response) {
                                        $("#upgradetopro-card-modal").modal("hide")
                                        
                                        $("#preloader").css("display", "none")
                                        $("#succesModal_invoice").modal("show")
                                        setTimeout(function () {
                                            $("#succesModal_invoice").modal("hide");
                                        }, 2000);
                                    },
                                    error: function (xhr, status, error) {
                                      // console.log(xhr)
                                      // console.log(status)
                                        $("#upgradetopro-card-modal").modal("hide")
                                        $("#preloader").css("display", "none")
                                      // console.log(error)
                                        // console.error('Error sending data:', error);
                                    }
                                });   
                            }
                            
                                                    
                        
                        } else {
                            $("#upgradetopro-card-modal").modal("hide")
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
                            if($("#amount-payable").text().split("$")[1]== $("#amount-card").val()){
                                $.ajax({
                                    url: 'http://localhost:3000/api/spade/tenantUpdateAllInvoices',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        status: "paid",
                                    }),
                                    contentType: "application/json",
                                    
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                                    },
                                    success: function (response) {
                                        $("#upgradetopro-card-modal").modal("hide")
                                        
                                        $("#preloader").css("display", "none")
                                        $("#succesModal_invoice").modal("show")
                                        setTimeout(function () {
                                            $("#succesModal_invoice").modal("hide");
                                        }, 2000);
                                    },
                                    error: function (xhr, status, error) {
                                      // console.log(xhr)
                                      // console.log(status)
                                        $("#upgradetopro-card-modal").modal("hide")
                                        $("#preloader").css("display", "none")
                                      // console.log(error)
                                        // console.error('Error sending data:', error);
                                    }
                                });   
                            }else{
                                $.ajax({
                                    url: 'http://localhost:3000/api/spade/tenantUpdateIndividualInvoices',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        status: "paid",
                                        id:invoiceId
                                    }),
                                    contentType: "application/json",
                                    
                                    headers: {
                                        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                                    },
                                    success: function (response) {
                                        $("#upgradetopro-card-modal").modal("hide")
                                        
                                        $("#preloader").css("display", "none")
                                        $("#succesModal_invoice").modal("show")
                                        setTimeout(function () {
                                            $("#succesModal_invoice").modal("hide");
                                        }, 2000);
                                    },
                                    error: function (xhr, status, error) {
                                      // console.log(xhr)
                                      // console.log(status)
                                        $("#upgradetopro-card-modal").modal("hide")
                                        $("#preloader").css("display", "none")
                                      // console.log(error)
                                        // console.error('Error sending data:', error);
                                    }
                                });   
                            }
                            
                             
                        
                        } else {
                            $("#upgradetopro-card-modal").modal("hide")
                            $("#preloader").css("display", "none")
                            $("#myModal_declined").modal("show")
                            setTimeout(function () {
                                $("#myModal_declined").modal("hide");
                            }, 2000);
                        }
                    });
                }
              // console.log(response)
            },
            error: function (xhr, status, error) {
              // console.log(xhr)
                $("#upgradetopro-card-modal").modal("hide")
                            $("#preloader").css("display", "none")
              // console.log(status)
              // console.log(error)
                // console.error('Error sending data:', error);
            }
        });
    }
            
            
$("#submit-ach").on("click",function(){
    $("#preloader").css("display", "flex")
    $.ajax({
        url: 'http://localhost:3000/api/spade/openOrder',
        type: 'POST',
        data: JSON.stringify({
            amount: $("#amount-ach").val(),
            currency: "USD",
            "userTokenId": userData.userId,
        }),
        contentType: "application/json; charset=utf-8",
        processData: false,
        headers: {
            'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
        },
        success: function (response) {
          // console.log(scard)
            
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
if(res?.transactionStatus?.toLowerCase()=="pending"){
    if($("#amount-payable").text().split("$")[1]==$("#amount-ach").val()){
        $.ajax({
            url: 'http://localhost:3000/api/spade/tenantUpdateAllInvoices',
            type: 'POST',
            data: JSON.stringify({
                status: "pending",
            }),
            contentType: "application/json",
            
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
            },
            success: function (response) {
                $("#upgradetopro-ach-modal").modal("hide")
                
                $("#preloader").css("display", "none")
                $("#succesModal_invoice").modal("show")
                setTimeout(function () {
                    $("#succesModal_invoice").modal("hide");
                }, 2000);
            },
            error: function (xhr, status, error) {
              // console.log(xhr)
              // console.log(status)
                $("#upgradetopro-ach-modal").modal("hide")
                $("#preloader").css("display", "none")
              // console.log(error)
                // console.error('Error sending data:', error);
            }
        });      
    }else{
        $.ajax({
            url: 'http://localhost:3000/api/spade/tenantUpdateIndividualInvoices',
                                    type: 'POST',
                                    data: JSON.stringify({
                                        status: "pending",
                                        id:invoiceId
                                    }),
            contentType: "application/json",
            
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
            },
            success: function (response) {
                $("#upgradetopro-ach-modal").modal("hide")
                
                $("#preloader").css("display", "none")
                $("#succesModal_invoice").modal("show")
                setTimeout(function () {
                    $("#succesModal_invoice").modal("hide");
                }, 2000);
            },
            error: function (xhr, status, error) {
              // console.log(xhr)
              // console.log(status)
                $("#upgradetopro-ach-modal").modal("hide")
                $("#preloader").css("display", "none")
              // console.log(error)
                // console.error('Error sending data:', error);
            }
        });     
    }
     
}
else {
    $("#upgradetopro-ach-modal").modal("hide")
    $("#preloader").css("display", "none")
    $("#myModal_declined").modal("show")
    setTimeout(function () {
        $("#myModal_declined").modal("hide");
    }, 2000);
}
})
        
                },
        error: function (xhr, status, error) {
          // console.log(xhr)
          // console.log(status)
          // console.log(error)
            // console.error('Error sending data:', error);
        }
    });
    
})



var individual = false;
var invoiceId;
$("#upgradetopro-btn").on("click", function () {
    $("#closeaccount,#surePaynow").modal("hide");
  // console.log(individual)
    if(individual){
        
        individual=false;
    }else{
      // console.log("clicked")
        
        const amount = $("#amount-payable").text().split("$")[1];
        
        $("#amount-card,#amount-ach").val(amount)
        $("#amount-existing").val(amount)
        $("#payment-total-card,#payment-total-ach").text(amount)
        $("#payment-total-existing-card").text(amount)
    }
    $("#selectMethod").modal("show");
})
$(document).on("click","#individual-payment",function(){
    individual=true;
    invoiceId=$(this).closest('tr').find('.invoice-id').text();
    const amount=$(this).closest('tr').find('.rentAmount').find('.amount-to-extract').text();
    $("#amount-card,#amount-ach").val(amount)
    $("#amount-existing").val(amount)
    $("#payment-total-card,#payment-total-ach").text(amount)
    $("#payment-total-existing-card").text(amount)
    $("#closeaccount").modal("show");
})
// $("#card-modal").on("click", function () {
//     $("#selectMethod").modal("hide");
//     $("#upgradetopro-card-modal").modal("show");
    
// })
// $("#ach-modal").on("click", function () {
//     $("#selectMethod").modal("hide");
//     $("#upgradetopro-ach-modal").modal("show");
    
// })
$(".payment-method-tab").on("click", function () {
    $(".payment-method-tab").removeClass("active-payment-method");
    $(this).addClass("active-payment-method");
    $("#payment-method-continue-btn").attr("data-bs-target", "#upgradetopro-" + $(this).attr("id"));
    $("#payment-method-continue-btn").attr("disabled", false);
});
