$("ul #calendar").addClass("active");

// getting current date to render default calendar days using loadCalendar function
let today = new Date();
let selectedMonth = today.getMonth();
let selectedYear = today.getFullYear();

//displaying the selected year
$("#year").text(selectedYear);

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let events =[];


//to allow user to change month selection; adding months options with an onclick event listener to change selected month and call loadCalendar
months.forEach((month, i, months) => {
    if (today.getMonth() == i) {
        $(".calendar-month").append(`<li onclick="selectMonth(this)" class="active" data-month="${i}">${month.slice(0,3)}</li>`);
    } else {
        $(".calendar-month").append(`<li onclick="selectMonth(this)" data-month="${i}" >${month.slice(0,3)}</li>`);
    }
});

//displaying days of the week 
week.forEach(day => {
    $(".calendar-week").append(`<li>${day.slice(0,3)}</li>`);
});

//give the clicked on month the class "active" that indicates the selected month, then call loadCalendar with new selection
function selectMonth(month) {
    $(".calendar-month .active").removeClass("active");
    $(month).addClass("active");
    selectedMonth = $(month).attr("data-month");
    loadCalender(selectedMonth, selectedYear,events);
};

// event listeners for changing year selection and calling loadCalendar with new year selection 
$("#year-prev").on("click", () => {
    selectedYear = selectedYear - 1;
    $("#year").text(selectedYear);
    loadCalender(selectedMonth, selectedYear,events);
});

$("#year-next").on("click", () => {
    selectedYear = selectedYear + 1;
    $("#year").text(selectedYear);
    loadCalender(selectedMonth, selectedYear,events);
});

getEvents("all-events")

//loadCalendar uses the selected combination of month and year, finds the first day of the week of the selected month and counts the days of the month 
function loadCalender(month, year,events) {
    $(".calendar-days").empty();

    // Sunday - Saturday : 0 - 6
    let firstDay = (new Date(year, month)).getDay();
    let daysInMonth = new Date(year, month, 0).getDate();

         //populate days of the week before the first day of the selected month
        for (let i = 0; i < firstDay; i++) {
            $(".calendar-days").append(`<li class="another-month" data-day=x data-month=${month - 1} data-year=${year}></li>`);
        }

        // mark the current day as the "active-day"
        //add value of day, month and year for the days of the selected month
        for (let i = 0; i < daysInMonth; i++) {
            if (month == today.getMonth() && i + 1 == today.getDate() && year == today.getFullYear()) {
                $(".calendar-days").append(`<li onclick="loadEvents(this)" class="active-day" data-day=${i + 1}
                 data-month=${month} data-year=${year}></li>`);
                //displaying the default selected day 
               loadEvents($(".active-day"));
            } else {
                $(".calendar-days").append(`<li onclick="loadEvents(this)" class data-day=${i + 1} 
                data-month=${month} data-year=${year}></li>`);
            }
        }

        //populate the remaining days of the week after the selected days of the month are populated 
        for (let i = 0; i < 37 - firstDay - daysInMonth; i++) {
            $(".calendar-days").append(`<li class="another-month" data-day=x data-month=${month + 1} data-year=${year}></li>`);
        }

        // after getting the events and calendar days elements, add the "event-day" to each element that has the same date as an event date
        let calendardays = $(".calendar-days").children();
        events.forEach(event => {
            for (let i = 0; i < calendardays.length; i++) {

                let month = $(calendardays[i]).attr("data-month");
                let day = $(calendardays[i]).attr("data-day");
                let year = $(calendardays[i]).attr("data-year");

                if (event.dateAndTime.monthValue-1 == month && event.dateAndTime.dayOfMonth == day && event.dateAndTime.year == year) {
                    $(calendardays[i]).addClass("event-day");  
                }
            }
        });
}


// displays the selecetd day information; date and events 
function loadEvents(dayItem) {

    let eventsOfDay = [];
    let sortingArray = []; 

    //removing styling from the previously selected day
    $(".calendar-days li").removeClass("selected-day");

    //removing the display of events and day of the week for the previosuly selected day 
    $(".current-day-events-list").empty();
    $("#selected-day-of-week").empty();

    //adding styling to the newly selected day
    $(dayItem).addClass("selected-day");

    //getting the date data for the selected day from the DOM element
    let day = $(dayItem).attr("data-day");
    let month = $(dayItem).attr("data-month");
    let year = $(dayItem).attr("data-year");

    //displaying the date and day of the week for the selected day
    $("#selected-day").text(day);
    $("#selected-day-of-week").append(`<p>${week[(new Date(year,month,day)).getDay()]}</p>${months[month]}<p>`);

    events.forEach(event=>{
        if(event.dateAndTime.dayOfMonth == day && event.dateAndTime.monthValue-1 == month && event.dateAndTime.year == year){
           eventsOfDay.push(event)
           sortingArray.push(event.dateAndTime.hour.toString()+event.dateAndTime.minute.toString())
        }
    });

    sortingArray.sort();
    eventsOfDay.sort((a,b)=>{
        return sortingArray.indexOf(a.dateAndTime.hour.toString()+a.dateAndTime.minute.toString()) - sortingArray.indexOf(b.dateAndTime.hour.toString()+b.dateAndTime.minute.toString());
    })
    //listing the events happening in the selected day in the events area
       eventsOfDay.forEach(event=>{
           if(event.dateAndTime.dayOfMonth == day && event.dateAndTime.monthValue-1 == month && event.dateAndTime.year == year){
            $(".current-day-events-list").append(`<div class="btn-block"><button type="button" class="btn btn-outline-warning">${event.dateAndTime.hour.toString().padStart(2,'0')}:${event.dateAndTime.minute.toString().padStart(2,'0')}</button><a class="btn btn-warning btn-lg"  href="/event?eventID=${event.id}">${event.title}</a></div>`)
           }
       }); 
}

function getEvents(view){
  
    if(view == "all-events"){

        $.ajax({
            type: "GET",
            url: "/all-events",
        }).then(data => {
           let  allEvents = JSON.parse(data);
           events = allEvents;
           loadCalender(selectedMonth, selectedYear,allEvents);
           
        });

    } else if(view == "my-events"){

        let userId= sessionStorage.getItem("userId");

        $.ajax({
            type: "GET",
            url: "/upcoming-events-by-user?userID="+userId,
        }).then(data => {
            let myEvents = JSON.parse(data);
            events = myEvents;
            loadCalender(selectedMonth, selectedYear,myEvents);
        });
    }
}

$(".btn-group-toggle label").on("click",(e)=>{
    getEvents($(e.target).attr("name"));
});



