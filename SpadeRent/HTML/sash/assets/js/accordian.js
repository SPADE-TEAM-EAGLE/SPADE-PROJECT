$(document).ready(function() {
    $("#next-add-tenant").click(() => {
       //first accordian
       var isEmpty1 = false;
       $('#firstName, #lastName, #email, #state, #city, #zip').each(function() {
           if ($(this).val() === '' || $(this).val() === 'Choose...') {
               isEmpty1 = true;
               return false;
           }
       });
       if (!isEmpty1) {
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
       $('#property, #unit, #rent').each(function() {
           if ($(this).val() === '' || $(this).val() === 'Choose...' || $(this).val() === 'No unit available!!') {
               isEmpty2 = true;
               return false;
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
       if (lease == "Gross Lease" && yesno == "yes") {
           var date1 = false;
           $('.input-amount, .dateofRentchange').each(function() {
               if ($(this).val() === '' || $(this).val() === 'Choose...') {
                   date1 = true;
                   isEmpty3 = true;
                   return false;
               }
           });
           if (!date1) {
               $("#collapseThree-add-tenant").removeClass("show");
               $(".accordion-item .icon").eq(2).removeClass("fi-rs-exclamation");
               $(".accordion-item .icon").eq(2).removeClass("chevron");
               $(".accordion-item .icon").eq(2).addClass("fi-rs-check-circle");
               $(".accordion-item .icon").eq(2).removeClass("cross");
               $(".accordion-item .icon").eq(2).addClass("tick");
               isEmpty3 = false;
           }
       } else if (lease == "Gross Lease" && yesno == "no") {
           $("#collapseThree-add-tenant").removeClass("show");
           $(".accordion-item .icon").eq(2).removeClass("fi-rs-exclamation");
           $(".accordion-item .icon").eq(2).removeClass("chevron");
           $(".accordion-item .icon").eq(2).addClass("fi-rs-check-circle");
           $(".accordion-item .icon").eq(2).removeClass("cross");
           $(".accordion-item .icon").eq(2).addClass("tick");
           isEmpty3 = false;
       } else if (lease == "Triple Net Lease" && yesno == "yes") {
           var date2 = false;
           $('.input-amount, .dateofRentchange, #baseRent , #tripleNet , #leaseStart , #leaseEnd').each(function() {
               if ($(this).val() === '' || $(this).val() === 'Choose...') {
                   date2 = true;
                   isEmpty3 = true;
                   return false;
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
       }else if(lease == "Triple Net Lease" && yesno == "no"){
           var date3 = false;
           $('#baseRent , #tripleNet , #leaseStart , #leaseEnd').each(function() {
               if ($(this).val() === '' || $(this).val() === 'Choose...') {
                   date3 = true;
                   isEmpty3 = true;
                   return false;
               }
           });
           if (!date3) {
               $("#collapseThree-add-tenant").removeClass("show");
               $(".accordion-item .icon").eq(2).removeClass("fi-rs-exclamation");
               $(".accordion-item .icon").eq(2).removeClass("chevron");
               $(".accordion-item .icon").eq(2).addClass("fi-rs-check-circle");
               $(".accordion-item .icon").eq(2).removeClass("cross");
               $(".accordion-item .icon").eq(2).addClass("tick");
               isEmpty3 = false;
           } 
       }else{
           isEmpty3 = true;
       }

if(!isEmpty3 && !isEmpty2 && !isEmpty1){
    // $("#next-add-tenant").addClass('d-none')
    $("#next-add-tenant").attr("id","next")
}

    });
    $("#next-add-property").click(() => {
        //first accordian
        var isEmpty1 = false;
        $('#propertyName, #address, #state, #city, #zip, #propertyType, #propertyTotalSF').each(function() {
            if ($(this).val() === '') {
                isEmpty1 = true;
                return false;
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
    // $('#collapseTwo-add-property').removeClass('show');
    $("#next-add-property").addClass('d-none')
    $("#next").removeClass("d-none")
    // $("#next-add-property").attr('id',"next")
 }
 
     });
     $("#next-add-prospect").click(() => {
        //first accordian
        var isEmpty1 = false;
        $('#firstName, #lastName, #phone,#email ,#propertyInfo, #unitInfo, #propertyDetail,#status').each(function() {
            if ($(this).val() === '' || $(this).val() === 'Choose...') {
                isEmpty1 = true;
                return false;
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
        
            if ($('#moveInDate').val() === '' || $('#potentialRentAmount').val() === '') {
                isEmpty2 = true;
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
    // $('#collapseTwo-add-property').removeClass('show');
    $("#next-add-prospect").addClass('d-none')
    $("#next").removeClass("d-none")
    // $("#next-add-property").attr('id',"next")
 }
 
     });
});