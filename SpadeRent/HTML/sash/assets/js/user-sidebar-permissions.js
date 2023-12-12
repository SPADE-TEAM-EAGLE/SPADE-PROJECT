$.ajax({
    url: 'http://localhost:3000/api/spade/protected',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                },
    success: function (response) {
        console.log($("#offcanvasExample .offcanvas-body .row").children().eq(0))
        console.log($("#offcanvasExample .offcanvas-body .row").children().eq(1))
        console.log($("#offcanvasExample .offcanvas-body .row").children().eq(2))
        console.log($("#offcanvasExample .offcanvas-body .row").children().eq(3))
        console.log($("#offcanvasExample .offcanvas-body .row").children().eq(4))
        console.log($("#offcanvasExample .offcanvas-body .row").children().eq(5))
        if(response?.llDashboard?.Restrict){
            if (window.location.href.indexOf('index.html') !== -1) {
                $("#sidebar-placeholder .side-menu li a[href='index.html']").parent().hide();
                history.back();
            }   
            else{
                $("#sidebar-placeholder .side-menu li a[href='index.html']").parent().hide();
            }
        }
        if(response?.properties?.Restrict){
            console.log("here",window.location.href.indexOf('properties-all.html'))
            if (window.location.href.indexOf('properties-all.html') !== -1) {
                $("#sidebar-placeholder .side-menu li a[href='properties-all.html']").parent().hide();
                console.log($("#offcanvasExample .offcanvas-body .row .card-title"))
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    console.log($(this).text().trim(""))
                    if($(this).text().trim("") == "Property"){
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }   
            if (window.location.href.indexOf('new-property.html') !== -1) {
                $("#sidebar-placeholder .side-menu li a[href='properties-all.html']").parent().hide();
                console.log($("#offcanvasExample .offcanvas-body .row .card-title"))
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    console.log($(this).text().trim(""))
                    if($(this).text().trim("") == "Property"){
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='properties-all.html']").parent().hide();
                console.log($("#offcanvasExample .offcanvas-body .row .card-title"))
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    console.log($(this).text().trim(""))
                    if($(this).text().trim("") == "Property"){
                        $(this).parent().parent().parent().remove()
                    }
                })
            }
        }
        if(response?.units?.Restrict){
            if (window.location.href.indexOf('property-unit.html') !== -1) {
                history.back();}   
        }
        if(response?.tenants?.Restrict){
            if (window.location.href.indexOf('add-tenant.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='add-tenant.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Tenant"){
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }   
            if (window.location.href.indexOf('new-tenant.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='add-tenant.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Tenant"){
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='add-tenant.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Tenant"){
                        $(this).parent().parent().parent().remove()
                    }
                })
            }
        }
        if(response?.tasks?.Restrict){
            if (window.location.href.indexOf('create-tasks.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-tasks.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Tasks"){
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }   
            if (window.location.href.indexOf('new-tasks.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-tasks.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Tasks"){
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='create-tasks.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Tasks"){
                        $(this).parent().parent().parent().remove()
                    }
                })
            }
        }
        if(response?.invoices?.Restrict){
            if (window.location.href.indexOf('create-invoicing.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-invoicing.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Invoice"){
                        console
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }   
            if (window.location.href.indexOf('new-invoice.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-invoicing.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Invoice"){
                        console
                        $(this).parent().parent().parent().remove()
                    }
                })
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='create-invoicing.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Invoice"){
                        console
                        $(this).parent().parent().parent().remove()
                    }
                })
            }
        }
        if(response?.leads?.Restrict){
            if (window.location.href.indexOf('prospects.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='prospects.html']").parent().hide();
                history.back();
                console.log($("#offcanvasExample .offcanvas-body .row .card-title"))
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    console.log($(this))
                    if($(this).text().trim("") == "Prospect"){
                        console
                        $(this).parent().parent().parent().remove()
                    }
                })
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='prospects.html']").parent().hide();
                $("#offcanvasExample .offcanvas-body .row .card-title").each(function(){
                    if($(this).text().trim("") == "Prospect"){
                        console
                        $(this).parent().parent().parent().remove()
                    }
                })
            }
        }
        if(response?.settingProfiles?.Restrict && response?.settingCPasswords?.Restrict && response?.settingNotifications?.Restrict && response?.settingCTheme?.Restrict && response?.settingSubscription?.Restrict && response?.settingMUsers?.Restrict && response?.settingEmailT?.Restrict && response?.SettingInvoiceSetting?.Restrict){
            if (window.location.href.indexOf('settings.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='settings.html']").parent().hide();
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='settings.html']").parent().hide();
            }
        }
    },
    error: function (error) {
        console.log(error);
    }
})