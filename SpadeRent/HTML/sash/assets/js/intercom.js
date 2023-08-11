let username;
$.ajax({
    url: 'https://backend.app.spaderent.com/api/spade/protected',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
    success: function ({ user, email, userId, image }) {
        username=user
        console.log(username)
        window.intercomSettings = {
          api_base: "https://api-iam.intercom.io",
          app_id: "fjpx1kt1",
          name:username, // Full name
    
        };
      
        // Function to open the Intercom side popup
        function openIntercomPopup() {
            const articleid=8210506
        //   window.Intercom('showNewMessage', '#help-center-article-' + articleid);;
        window.Intercom('showSpace', 'help');

          
        }
      
        // Attach a click event listener to your custom button
        document.querySelectorAll('.customIntercomButton').forEach(element => {
    element.addEventListener('click', openIntercomPopup);
});

        
        // Load the Intercom widget
        (function() {
          var w = window;
          var ic = w.Intercom;
          
          if (typeof ic === "function") {
            ic('reattach_activator');
            ic('update', w.intercomSettings);
          } else {
            var d = document;
            var i = function() {
              i.c(arguments);
            };
            i.q = [];
            i.c = function(args) {
              i.q.push(args);
            };
            w.Intercom = i;
            var l = function() {
              var s = d.createElement('script');
              
              s.type = 'text/javascript';
              s.async = true;
              s.src = 'https://widget.intercom.io/widget/fjpx1kt1';
              var x = d.getElementsByTagName('script')[0];
              x.parentNode.insertBefore(s, x);
            };
            if (document.readyState === 'complete') {
              l();
            } else if (w.attachEvent) {
              w.attachEvent('onload', l);
            } else {
              w.addEventListener('load', l, false);
            }
          }
        })();`x`
    },
    error: function (xhr, status, error) {
        $("#myModal_warning").modal("show");
        setTimeout(function () {
            $('#myModal_warning').modal('hide');
            window.location = '../Landlord/login_module.html';
        }, 2000);
        
    }
});
        