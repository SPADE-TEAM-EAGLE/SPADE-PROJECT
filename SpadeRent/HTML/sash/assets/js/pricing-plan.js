function adjustPlan(data){
    console.log(data)
    if(data.planNNN=="Not Available"){
        $("#collapse1").hide();
        
        $("input[value='Triple Net Lease']").parent().hide();
    }
    $(".side-menu__label").each(function() {
        
        switch($(this).text()){
            case "Invoicing":
                if(data.planInvoice=="Not Available"){
                    $(this).parent().parent().remove();
                    if (window.location.href.includes("create-invoicing.html") || window.location.href.includes("new-invoice.html")) {
                        window.history.back();
                    }
                }
                break;
            case "Tasks":
                if(data.planTask=="Not Available"){
                    $(this).parent().parent().remove();
                    if (window.location.href.includes("create-tasks.html") || window.location.href.includes("new-tasks.html")) {
                        window.history.back();
                    }
                }
                break;
            case "Prospects":
                if(data.planProspects=="Not Available"){
                    $(this).parent().parent().remove();
                    if (window.location.href.includes("prospects.html")) {
                        window.history.back();
                    }
                }
                break;
            case "Chat":
                if(data.planChat=="Not Available"){
                    $(this).parent().parent().remove();
                    if (window.location.href.includes("chats.html")) {
                        window.history.back();
                    }
                }
                break;
            case "Reports":
                if(data.planReporting=="Basic Reporting"){
                    $(".reporting-tab-parent").children().slice(2).remove();
                }else if(data.planReporting=="Advanced Reporting"){
                }
                break;
            default:
                break;
        }
        console.log($(this).text());
    })
}