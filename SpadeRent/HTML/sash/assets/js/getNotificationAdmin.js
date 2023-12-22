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
      const plans={
        "5":"Monthly-Basic",
        "6":"Monthly-Pro",
        "7":"Monthly-Premium",
        "2":"Yearly-Basic",
        "3":"Yearly-Pro",
        "4":"Yearly-Premium",
      }
    // console.log(response);
      const notification = response.Notification
      const unread = notification.filter((item) => item.readNotification == 0);
      const read = notification.filter((item) => item.readNotification == 1);
    // console.log(unread, "unread");
    // console.log(read, "read");
    // console.log(notification, "all");
      $(".all_span").text(`(${notification.length})`);
      $(".inbox_span").text(`(${read.length})`);
      $(".Unread_span").text(`(${unread.length})`);
      $("#count_unread").text(unread.length > 0 ? unread.length : '0');
      $(".archive_span").text(`(${notification.length})`);
      $("#notification-container").empty();
      notification?.forEach((item) => {
          const colorClass = item.readNotification == 0 ? "my_blue" : "bg-transparent";
          $("#notification-container").append(
            `<div class="list-group-item d-flex align-items-center ${colorClass}  justify-content-between notification-item" data-id="${
              item.notificationId
            }">
              <div class="d-flex align-items-center">
              <div class="me-2">
              <span class="avatar avatar-md brround cover-image" style="background-image:url('${
                ( item?.Image? item?.Image?.split(",")[0] : '../assets/images/bell-ring.png' )
               }')!important; ">
              </div>
              <div class="">
                  <a href="javascript:void(0);">
                      <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                        item.fName
                      }</div> <span class="text-dark"> Plan > ${
                        plans[item.planId]
            }</span><br/>  <span class="text-dark"> Price > ${
              '$ ' + (item.planId >= 2 && item.planId <= 4 ? (parseFloat(item.plantotalAmount) * 12).toFixed(2)+"/ year" : parseFloat(item.plantotalAmount).toFixed(2)+"/ month")
  }</span>
                      <p class="mb-0 fw-bold text-dark fs-15 created-deleted"> ${item.created_deleted} </p>
                  </a>
              </div>
          </div><div class="">
          <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
            item.c_dTime
          )}</span>
            </div></div>`
          );
      });
      $("#inbox-notification-container").empty();
      read?.forEach((item) => {
        const colorClass = item.readNotification == 0 ? "my_blue" : "bg-transparent";
        $("#inbox-notification-container").append(
          `<div class="list-group-item d-flex align-items-center ${colorClass}  justify-content-between notification-item" data-id="${
            item.notificationId
          }">
            <div class="d-flex align-items-center">
            <div class="me-2">
            <span class="avatar avatar-md brround cover-image" style="background-image:url('${
              ( item?.Image? item?.Image?.split(",")[0] : '../assets/images/bell-ring.png' )
             }')!important; ">
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.fName
                    }</div> <span class="text-dark"> Plan > ${
                      plans[item.planId]
          }</span><br/>  <span class="text-dark"> Price > ${
            '$ ' + (item.planId >= 2 && item.planId <= 4 ? (parseFloat(item.plantotalAmount) * 12).toFixed(2)+"/ year" : parseFloat(item.plantotalAmount).toFixed(2)+"/ month")
}</span>
                    <p class="mb-0 fw-bold text-dark fs-15 created-deleted"> ${item.created_deleted} </p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
          item.c_dTime
        )}</span>
          </div></div>`
        );
      });
      $("#unread-notification-container").empty();
      unread?.forEach((item) => {
        const colorClass = item.readNotification == 0 ? "my_blue" : "bg-transparent";
        $("#unread-notification-container").append(
          `<div class="list-group-item d-flex align-items-center ${colorClass}  justify-content-between notification-item" data-id="${
            item.notificationId
          }">
            <div class="d-flex align-items-center">
            <div class="me-2">
            <span class="avatar avatar-md brround cover-image" style="background-image:url('${
              ( item?.Image? item?.Image?.split(",")[0] : '../assets/images/bell-ring.png' )
             }')!important; ">
            </div>
            <div class="">
                <a href="javascript:void(0);">
                    <div class="fw-semibold text-dark fw-bold fs-15" data-bs-toggle="modal" data-target="#chatmodel">${
                      item.fName
                    }</div> <span class="text-dark"> Plan > ${
                      plans[item.planId]
          }</span><br/>  <span class="text-dark"> Price > ${
            '$ ' + (item.planId >= 2 && item.planId <= 4 ? (parseFloat(item.plantotalAmount) * 12).toFixed(2)+"/ year" : parseFloat(item.plantotalAmount).toFixed(2)+"/ month")
}</span>
                    <p class="mb-0 fw-bold text-dark fs-15 created-deleted"> ${item.created_deleted} </p>
                </a>
            </div>
        </div><div class="">
        <span class="fs-12 text-dark" style="text-wrap: nowrap;">${convertTimestamp(
          item.c_dTime
        )}</span>
          </div></div>`
        );
      });
      $(".notification-item").on("click", function () {
        const itemId = $(this).data("id");
        const type=$(this).find(".created-deleted").text().trim().toLowerCase()=="created"?"Customers":"closed-customers";
      // console.log(type)
        updateDataNotify(itemId, type);
      });
    },
    error: function (xhr, status, error) {
    // console.log("Error occurred while fetching state and city data.");
    // console.log(xhr);
    // console.log(error);
    },
  });
}  
GetNotification();
$("#updateAllNotifyRead").on("click", function () {
  updateAllNotifyRead();
  GetNotification();
});
function updateAllNotifyRead() {
  GetNotification()
  $.ajax({
    url: "http://localhost:3000/api/spade/updateAllAdminNotification",
    type: "PUT",
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
    // console.log(response);
    },
    error: function (xhr, status, error) {
    // console.log("Error: " + error);
    },
  });
}
function updateDataNotify(notificationId, type) {
// console.log(notificationId, type);
  $.ajax({
    url: "http://localhost:3000/api/spade/updateAdminNotification",
    type: "PUT",
    data: JSON.stringify({
      id: notificationId,
    }),
    contentType: "application/json",
    headers: {
      Authorization: "Bearer " + localStorage.getItem("authtoken"),
    },
    success: function (response) {
      if(type == "Customers"){
        window.location.href="./Customers.html";
      }else{
        window.location.href="./closed-customers.html";
      }
      $('#preloader').css('display','none')
      GetNotification();
    // console.log(response);
    },
    error: function (xhr, status, error) {
    // console.log("Error: " + error);
    },
  });
}
