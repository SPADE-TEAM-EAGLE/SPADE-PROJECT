var username;
$.ajax({
    url: 'http://localhost:3000/api/spade/protectedTenant',
    method: 'GET',
    headers: {
        'Authorization': 'Bearer ' + localStorage.getItem("authtoken")
    },
    success: function ({ userName, email, userId, image }) {
        username=userName
      // console.log(username)
        window.intercomSettings = {
          api_base: "https://api-iam.intercom.io",
          app_id: "fjpx1kt1",
          name:username, // Full name
        };
        function openIntercomPopup() {
            const articleid=8210506
        window.Intercom('showSpace', 'help');
        }
        document.querySelectorAll('.customIntercomButton').forEach(element => {
    element.addEventListener('click', openIntercomPopup);
});
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
