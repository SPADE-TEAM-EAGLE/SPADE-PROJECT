$.ajax({
    url: 'http://localhost:3000/api/spade/protected',
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
                },
                
    success: function (response) {
        // if(response.llDashboard.Restrict){
        //     if (window.location.href.indexOf('index.html') > -1) {
        //         $("#sidebar-placeholder .side-menu li a[href='index.html']").parent().hide();
        //         window.location.href = "properties-all.html";
        //     }else{
        //         $("#sidebar-placeholder .side-menu li a[href='index.html']").parent().hide();

        //     }
            
        // }
        if(response?.properties?.Restrict){
            console.log("here",window.location.href.indexOf('properties-all.html'))
            if (window.location.href.indexOf('properties-all.html') !== -1) {
                $("#sidebar-placeholder .side-menu li a[href='properties-all.html']").parent().hide();
                history.back();}   
            if (window.location.href.indexOf('new-property.html') !== -1) {
                $("#sidebar-placeholder .side-menu li a[href='properties-all.html']").parent().hide();
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='properties-all.html']").parent().hide();
            }
        }
        if(response?.units?.Restrict){
            
            if (window.location.href.indexOf('property-unit.html') !== -1) {
                
                history.back();}   
        }
        if(response?.tenants?.Restrict){
            if (window.location.href.indexOf('add-tenant.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='add-tenant.html']").parent().hide();
                history.back();
            }   
            if (window.location.href.indexOf('new-tenant.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='add-tenant.html']").parent().hide();
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='add-tenant.html']").parent().hide();
            }
        }
        if(response?.tasks?.Restrict){
            if (window.location.href.indexOf('create-tasks.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-tasks.html']").parent().hide();
                history.back();}   
            if (window.location.href.indexOf('new-tasks.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-tasks.html']").parent().hide();
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='create-tasks.html']").parent().hide();
            }
        }
        if(response?.invoices?.Restrict){
            if (window.location.href.indexOf('create-invoicing.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-invoicing.html']").parent().hide();
                history.back();}   
            if (window.location.href.indexOf('new-invoice.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='create-invoicing.html']").parent().hide();
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='create-invoicing.html']").parent().hide();
            }
        }
        if(response?.leads?.Restrict){
            if (window.location.href.indexOf('prospects.html') > -1) {
                $("#sidebar-placeholder .side-menu li a[href='prospects.html']").parent().hide();
                history.back();
            }
            else{
                $("#sidebar-placeholder .side-menu li a[href='prospects.html']").parent().hide();

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