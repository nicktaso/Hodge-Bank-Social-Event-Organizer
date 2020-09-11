
const myUpcomingEventsCarousel = $("#upcoming-events-carousel");
const myPendingEventsCarousel = $("#pending-events-carousel");
const myOwningEventsCarousel = $("#owning-events-carousel");
const myPreviousEventsCarousel = $("#previous-events-carousel");
const userDetailsSection = $("#user-details");

$("ul #my-events").addClass("active");

 renderUserDetails();
 renderMyEvents();

function renderUserDetails(){
    let userEmail = sessionStorage.getItem("email");
    $.ajax({
        type: "POST",
        url: "/user-by-email?email="+userEmail,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(user=>{

        //dynamically change the content of the user details section with the current user details
        populateDetailsSection(user);
    });
}

function renderMyEvents() {
    const userId = sessionStorage.getItem("userId");

    $.ajax({
        type: "GET",
        url: "/upcoming-events-by-user?userID="+userId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(events=>{
        populateEventCarousel(myUpcomingEventsCarousel,"My Upcoming Events",events, "my-upcoming");
    });

    $.ajax({
        type: "GET",
        url: "/events-by-invited-user?userID="+userId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(events=>{
        populateEventCarousel(myPendingEventsCarousel,"My Pending Events",events, "my-pending");
    })

    $.ajax({
        type: "GET",
        url: "/owning-events-by-user?userID="+userId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(events=>{
        populateEventCarousel(myOwningEventsCarousel,"Events created by me",events, "my-owning");
    })

    $.ajax({
        type:"GET",
        url: "/previous-events-by-user?userID="+userId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
    }).then(events=>{
        populateEventCarousel(myPreviousEventsCarousel,"My Previous Events",events, "my-previous");
    })
}

function populateDetailsSection(user){
   $(".user-details p").append(`Hi, ${user.firstName}`);
}