function convertTimestamp(timestamp) {
  var date = new Date(timestamp);
  var now = new Date();

  var timeDifference = now.getTime() - date.getTime();
  var seconds = Math.floor(timeDifference / 1000);
  var minutes = Math.floor(seconds / 60);
  var hours = Math.floor(minutes / 60);
  var days = Math.floor(hours / 24);
  var months = Math.floor(days / 30);

  if (months > 0) {
    return months + (months === 1 ? " month ago" : " months ago");
  } else if (days > 0) {
    return days + (days === 1 ? " day ago" : " days ago");
  } else if (hours > 0) {
    return hours + (hours === 1 ? " hour ago" : " hours ago");
  } else if (minutes > 0) {
    return minutes + (minutes === 1 ? " minute ago" : " minutes ago");
  } else {
    return seconds + (seconds === 1 ? " second ago" : " seconds ago");
  }
}




function GetNotification(){
  $.ajax({
    url: "http://localhost:3000/api/spade/getAdminNotification",
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
      console.log(response);
      
    },
    error: function (xhr, status, error) {
      console.log("Error occurred while fetching state and city data.");
      console.log(xhr);
      console.log(error);
      // console.log('Error occurred while fetching state and city data.');
    },
  });

}  
GetNotification();


$("#updateAllNotifyRead").on("click", function () {
  updateAllNotifyRead();
  GetNotification();
});
function getNotifyData(){
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/notify",
    method: "GET",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {

    },
    error: function (xhr, status, error) {
      console.log("Error occurred while fetching state and city data.");
      console.log(xhr);
      console.log(error);
      // console.log('Error occurred while fetching state and city data.');
    },
  });
}
function updateAllNotifyRead() {
  getNotifyData()
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/updateAllNotifyRead",
    type: "PUT",
    data: JSON.stringify({
      notify: 1,
    }),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
      console.log(response);
    },
    error: function (xhr, status, error) {
      console.log("Error: " + error);
    },
  });
}

function updateDataNotify(notificationId, type) {
  // $('#preloader').css('display','flex')
  $.ajax({
    url: "https://backend.app.spaderent.com/api/spade/updateReadUnRead",
    type: "PUT",
    data: JSON.stringify({
      notify: 1,
      id: notificationId,
      type: type,
    }),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
      // alert(type)
      if(type == "property"){
        window.location.href="./properties-all.html";
      }else if(type == "task"){
        window.location.href="./create-tasks.html";
      }else if(type == "invoice"){
        window.location.href="./create-invoicing.html";
      }else if(type == "tenant"){
        window.location.href="./add-tenant.html";
        
      }
      // $('#preloader').css('display','none')
      // GetNotification();
      console.log(response);
    },
    error: function (xhr, status, error) {
      // $('#preloader').css('display','none')

      console.log("Error: " + error);
    },
  });
}
