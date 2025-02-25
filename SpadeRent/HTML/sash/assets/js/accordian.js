$(document).ready(function() {
    $("#next-add-tenant").click(() => {
       //first accordian
       var isEmpty1 = false;
       $('#firstName, #lastName, #email').each(function() {
           var span = $(this).siblings('.text-danger');
            if ($(this).val() === '' || $(this).val() == 'Choose...') {
                isEmpty1 = true;
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                return false;
            }else{
                $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
            }   
       });
       if (!isEmpty1 && $('#email-exist').hasClass('d-none')) {
           $('#collapseOne-add-tenant').removeClass('show');
           $('#collapseTwo-add-tenant').addClass('show');
           $(".accordion-item .icon").eq(0).removeClass("fi-rs-exclamation");
           $(".accordion-item .icon").eq(0).removeClass("chevron");
           $(".accordion-item .icon").eq(0).addClass("fi-rs-check-circle");
           $(".accordion-item .icon").eq(0).removeClass("cross");
           $(".accordion-item .icon").eq(0).addClass("tick");
       }
       //second accordian
       var isEmpty2 = false;
       $('#property, #unit, #rent, #leaseStart , #leaseEnd').each(function() {
        var span = $(this).siblings('.text-danger');
           if ($(this).val() == '' || $(this).val() == 'Choose...' || $(this).val() == 'No unit available!!') {
               isEmpty2 = true;
               $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
               return false;
           }
           else{
            $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
           }
       });
       if (!isEmpty2) {
           $('#collapseTwo-add-tenant').removeClass('show');
           $('#collapseThree-add-tenant').addClass('show');
           $(".accordion-item .icon").eq(1).removeClass("fi-rs-exclamation");
           $(".accordion-item .icon").eq(1).removeClass("chevron");
           $(".accordion-item .icon").eq(1).addClass("fi-rs-check-circle");
           $(".accordion-item .icon").eq(1).removeClass("cross");
           $(".accordion-item .icon").eq(1).addClass("tick");
       }
       //third accordian
       var lease = $("input[name='lease']:checked").val();
       var yesno = $("input[name='yesno']:checked").val();
       var isEmpty3 = false;
        if (yesno == "yes") {
           var date2 = false;
           $('.input-amount').each(function() {
            var span = $(this).siblings('.text-danger');
            if ($(this).val() === '' || $(this).val() === 'Choose...') {
                var span = $(this).siblings('.text-danger');
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                   date2 = true;
                   isEmpty3 = true;
                   return false;
               }else{
                $(this).addClass('border-green');
                    $(this).removeClass('border-danger');
                    span.addClass('d-none');
               }
           });
           if (!date2) {
               $("#collapseThree-add-tenant").removeClass("show");
               $(".accordion-item .icon").eq(2).removeClass("fi-rs-exclamation");
               $(".accordion-item .icon").eq(2).removeClass("chevron");
               $(".accordion-item .icon").eq(2).addClass("fi-rs-check-circle");
               $(".accordion-item .icon").eq(2).removeClass("cross");
               $(".accordion-item .icon").eq(2).addClass("tick");
               isEmpty3 = false;
           }
       }
       else{
           isEmpty3 = false;
       }
if(!isEmpty3 && !isEmpty2 && !isEmpty1){
    $("#next-add-tenant").attr("id","next")
}
    });
    $("#next-add-property").click(() => {
        //first accordian
        var isEmpty1 = false;
        $('#propertyName, #address, #state, #city, #zip, #propertyType, #propertyTotalSF').each(function() {
            var span = $(this).siblings('.text-danger');
            if ($(this).val() === '' || $(this).val() == 'Choose...') {
                isEmpty1 = true;
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                return false;
            }else{
                $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
            }
        });
        if (!isEmpty1) {
            $('#collapseOne-add-property').removeClass('show');
            $('#collapseTwo-add-property').addClass('show');
            $(".accordion-item .icon").eq(0).removeClass("fi-rs-exclamation");
            $(".accordion-item .icon").eq(0).removeClass("chevron");
            $(".accordion-item .icon").eq(0).addClass("fi-rs-check-circle");
            $(".accordion-item .icon").eq(0).removeClass("cross");
            $(".accordion-item .icon").eq(0).addClass("tick");
        }
        //second accordian
        var isEmpty2 = false;
        if ($('#units').val() === '') {
            isEmpty2 = true;
            $('#units').addClass('border-danger').removeClass('border-green');
            $('#units').siblings('.text-danger').removeClass('d-none');
        } else {
            isEmpty2 = false;
            $('#units').removeClass('border-danger').addClass('border-green');
            $('#units').siblings('.text-danger').addClass('d-none');
        }
        if (!isEmpty2) {
            $('#collapseOne-add-property').removeClass('show');
            $('#collapseTwo-add-property').removeClass('show');
            $(".accordion-item .icon").eq(1).removeClass("fi-rs-exclamation");
            $(".accordion-item .icon").eq(1).removeClass("chevron");
            $(".accordion-item .icon").eq(1).addClass("fi-rs-check-circle");
            $(".accordion-item .icon").eq(1).removeClass("cross");
            $(".accordion-item .icon").eq(1).addClass("tick");
        }
if(!isEmpty2 && !isEmpty1){
    $("#next-add-property").addClass('d-none')
    $("#next").removeClass("d-none")
 }
     });
     $("#next-add-prospect").click(() => {
        //first accordian
        var isEmpty1 = false;
        $('#firstName, #lastName, #phone,#email ,#propertyInfo, #unitInfo, #propertyDetail,#sourceCampaign').each(function() {
            var span = $(this).siblings('.text-danger');
            if ($(this).val() === '' || $(this).val() == 'Choose...') {
                isEmpty1 = true;
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                return false;
            }else{
                $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
            }
        });
        if (!isEmpty1) {
            $('#collapseOne-add-property').removeClass('show');
            $('#collapseTwo-add-property').addClass('show');
            $(".accordion-item .icon").eq(0).removeClass("fi-rs-exclamation");
            $(".accordion-item .icon").eq(0).removeClass("chevron");
            $(".accordion-item .icon").eq(0).addClass("fi-rs-check-circle");
            $(".accordion-item .icon").eq(0).removeClass("cross");
            $(".accordion-item .icon").eq(0).addClass("tick");
        }
        //second accordian
        var isEmpty2 = false;
        $('#potentialRentAmount, #moveInDate').each(function() {
            var span = $(this).siblings('.text-danger');
            if ($(this).val() === '' || $(this).val() == 'Choose...') {
                isEmpty2 = true;
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                return false;
            }else{
                $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
            }
        });
        if (!isEmpty2) {
            $('#collapseOne-add-property').removeClass('show');
            $('#collapseTwo-add-property').removeClass('show');
            $(".accordion-item .icon").eq(1).removeClass("fi-rs-exclamation");
            $(".accordion-item .icon").eq(1).removeClass("chevron");
            $(".accordion-item .icon").eq(1).addClass("fi-rs-check-circle");
            $(".accordion-item .icon").eq(1).removeClass("cross");
            $(".accordion-item .icon").eq(1).addClass("tick");
        }
if(!isEmpty2 && !isEmpty1){
    $("#next-add-prospect").addClass('d-none')
    $("#next").removeClass("d-none")
 }
     });
     $(document).on('click', '#next-add-bank', function() {
                //first accordian
                var isEmpty1 = true;
                $(".inputField").each(function() {
                  // console.log("this",$(this))
                    if($(this).hasClass("valid")){
                        isEmpty1 = false;
                        $(this).addClass('border-green');
                        $(this).removeClass('border-danger');
                        span.addClass('d-none');
                    }else{
                        isEmpty1 = true;
                        $(this).addClass('border-danger');
                        $(this).removeClass('border-green');
                        span.removeClass('d-none');
                        return true;
                    }
                });
                    var span = $("#accountName").siblings('.text-danger');
                    if ($("#accountName").val() === '' || $("#accountName").val() == 'Choose...') {
                        isEmpty1 = true;
                        $("#accountName").addClass('border-danger');
                        $("#accountName").removeClass('border-green');
                        span.removeClass('d-none');
                    }else{
                        isEmpty1 = false;
                        $("#accountName").addClass('border-green');
                        $("#accountName").removeClass('border-danger');
                        span.addClass('d-none');
                    }
                if (!isEmpty1) {
                    $('#collapseOne-add-property').removeClass('show');
                    $('#collapseTwo-add-property').addClass('show');
                    $(".accordion-item .icon").eq(0).removeClass("fi-rs-exclamation");
                    $(".accordion-item .icon").eq(0).removeClass("chevron");
                    $(".accordion-item .icon").eq(0).addClass("fi-rs-check-circle");
                    $(".accordion-item .icon").eq(0).removeClass("cross");
                    $(".accordion-item .icon").eq(0).addClass("tick");
                }
              // console.log("isEmpty1",isEmpty1)
        if(!isEmpty1){
            $("#next-add-bank").addClass('d-none')
            $("#next-bank").removeClass("d-none")
         }
     });
     $(document).on('click', '#next-add-bank-property', function() {
        //first accordian
        var isEmpty1 = true;
        $("#next-add-bank-property .inputField").each(function() {
          // console.log("this",$(this))
            if($(this).hasClass("valid")){
                isEmpty1 = false;
                $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
            }else{
                isEmpty1 = true;
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                return true;
            }
        });
            var span = $("#accountName-property").siblings('.text-danger');
            if ($("#accountName-property").val() === '' || $("#accountName-property").val() == 'Choose...') {
                isEmpty1 = true;
                $("#accountName-property").addClass('border-danger');
                $("#accountName-property").removeClass('border-green');
                span.removeClass('d-none');
            }else{
                isEmpty1 = false;
                $("#accountName-property").addClass('border-green');
                $("#accountName-property").removeClass('border-danger');
                span.addClass('d-none');
            }
        if (!isEmpty1) {
            $('#collapseOne-add-bank-property').removeClass('show');
            $('#collapseTwo-add-bank-property').addClass('show');
        }
        var isEmpty2 = false;
        $('#propertySelect').each(function() {
            var span = $(this).siblings('.text-danger');
            if ($(this).val() === '' || $(this).val() == 'Choose...') {
                isEmpty2 = true;
                $(this).addClass('border-danger');
                $(this).removeClass('border-green');
                span.removeClass('d-none');
                return false;
            }else{
                $(this).addClass('border-green');
                $(this).removeClass('border-danger');
                span.addClass('d-none');
            }
        });
        if (!isEmpty2) {
            $('#collapseOne-add-bank-property').removeClass('show');
            $('#collapseTwo-add-bank-property').removeClass('show');
        }
if(!isEmpty1 && !isEmpty2){
    $("#next-add-bank-property").addClass('d-none')
    $("#next-bank-property").removeClass("d-none")
 }
});
});