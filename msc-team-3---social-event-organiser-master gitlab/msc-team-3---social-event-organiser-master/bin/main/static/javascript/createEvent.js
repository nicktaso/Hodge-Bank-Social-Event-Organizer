const modalSection = $("#modal-section");

$(document).ready(function () {

    const submitEventButton = $("#post-event");
    const formTitle = $("h3");
    const titleInput = $("#title");
    const descriptionInput = $("#description");
    const locationInput = $("#location");
    const dateInput = $("#date");
    const timeInput = $("#time");
    const categoryInput = $("#event-category");
    const typeInput = $("#event-type");
    const maxCapacityInput = $("#capacity");
    const teamSizeInput = $("#team-size");

  
    $("ul #add-event").addClass("active");
       
    $("#team-size-group").hide();

    let formSections = [titleInput, descriptionInput, locationInput, dateInput, timeInput, categoryInput, typeInput,maxCapacityInput];

    if (localStorage.getItem("modifyEvent") == "true") {
        autoFillEventData();
        localStorage.setItem("modifyEvent", "false");
    }

    validateInputOnInput();

    //on form submit check validation then call post function if input is valid
    submitEventButton.on("click", (e) => {
        e.preventDefault();

        let event = {
            ownerId: sessionStorage.getItem("userId"),
            title: titleInput.val(),
            description: descriptionInput.val(),
            location: locationInput.val(),
            dateAndTime: dateInput.val() + "T" + timeInput.val(),
            category: categoryInput.val(),
            type: typeInput.val(),
            maxCapacity: maxCapacityInput.val(),
            teamSize: teamSizeInput.val()
        };
        validateInputOnSubmit(event);

    });

    function validateInputOnInput() {

        formSections.forEach(section => {
            //can't be blank on input 
            section.on("input", () => {
                if (section.val()) {
                    section.css("background-color", "#ccffeb");
                    section.css("border-color", "#ccffeb");
                    section.removeClass("invalid").addClass("valid");
                } else {
                    section.css("background-color", "#ffcccc");
                    section.css("border-color", "#ffcccc");
                    section.removeClass("valid").addClass("invalid");
                }

                if(section == typeInput){
                    if(section.val() == "Team"){
                        $("#team-size-group").show();
                        teamSizeInput.on("input",()=>{
                            if(teamSizeInput.val()){
                                teamSizeInput.css("background-color", "#ccffeb");
                                teamSizeInput.css("border-color", "#ccffeb");
                                teamSizeInput.removeClass("invalid").addClass("valid");   
                            } else {
                                teamSizeInput.css("background-color", "#ffcccc");
                                teamSizeInput.css("border-color", "#ffcccc");
                                teamSizeInput.removeClass("valid").addClass("invalid");
                            }
                        })
                    } else if(section.val() == "Individual") {
                        $("#team-size-group").hide();
                    }
                }
            })
        })
    }

    function autoFillEventData() {

        submitEventButton.text("Update");
        formTitle.text("Update Event");

        let eventId = sessionStorage.getItem("eventId");

        $.ajax({
            type: "GET",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: "/event-by-id?eventID=" + eventId,
        }).then(event => {

            if (event.type == "Team"){
                $("#team-size-group").show();
                } else if (event.type == "Individual"){
                $("#team-size-group").hide();
            }

            let date = `${event.dateAndTime.year.toString().padStart(4, '0')}-${event.dateAndTime.monthValue.toString().padStart(2, '0')}-${event.dateAndTime.dayOfMonth.toString().padStart(2, '0')}`;

            titleInput.val(event.title);
            descriptionInput.val(event.description);
            locationInput.val(event.location);
            dateInput.val(date);
            timeInput.val(`${event.dateAndTime.hour.toString().padStart(2, '0')}:${event.dateAndTime.minute.toString().padStart(2, '0')}`);
            categoryInput.val(event.category);
            typeInput.val(event.type);
            typeInput.addClass("input-disable")
            maxCapacityInput.val(event.maxCapacity);
            teamSizeInput.val(event.teamSize);
            teamSizeInput.addClass("input-disable")

        });

        //since a to be updated event is already valid, adding validation marks
        formSections.forEach(section => {
            section.css("background-color", "#ccffeb");
            section.css("border-color", "#ccffeb");
            section.removeClass("invalid").addClass("valid");
        });
        
    }


    function validateInputOnSubmit(event) {

        let message;
        let validCounter = 0;

        formSections.forEach(section => {

            if (section.hasClass("valid")) {
                section.css("background-color", "#ccffeb");
                section.css("border-color", "#ccffeb");
                validCounter++;
            } else {
                let messageSection = $("span", section.parent());
                section.css("background-color", "#ffcccc");
                section.css("border-color", "#ffcccc");
                section.attr("placeholder", "required");
                messageSection.removeClass("error").addClass("error_show");
                message = "This field is required";
                messageSection.text(message);
            }
            if (validCounter == formSections.length) {
                modalSection.empty();
                renderConfirmationModal(event);
            }
        })
    }


    function postEvent(event) {
        $.ajax({
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: "/add-event",
            data: JSON.stringify(event)
        }).then(eventId => {
            openNewEventPage(eventId);
        })
    }

    function updateEvent(event) {
        $.ajax({
            type: "POST",
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            url: "/update-event",
            data: JSON.stringify(event)
        }).then(eventId => {
            openNewEventPage(eventId);
        })
    }

    function openNewEventPage(eventId) {
        window.location.href = "/event?eventID=" + eventId;
    }

    function renderConfirmationModal(event) {

        modalSection.append(`<div class="modal fade" id="confirmModal" tabindex="-1" role="dialog" aria-labelledby="confirmModal" aria-hidden="true">
            <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                <h5 class="modal-title" id="confirmModal">Event Title: ${event.title}</h5>
                </div>
                <div class="modal-body container" style="background-color: #fafad2">
                <div class="row">
                <div class="contenx col info-field"><span style="font-weight: bold">Description:     </span>${event.description}</div>
                </div>
                <div class="row">
                <div class="contenx col info-field"><span style="font-weight: bold">Location:  </span>${event.location}</div>
                </div>
                <div class="row">
                <div class="contenx col info-field"><span style="font-weight: bold">Time:  </span>${event.dateAndTime.slice(0,10)}</div>
                <div class="contenx col info-field"><span style="font-weight: bold">Date:  </span>${event.dateAndTime.slice(11,16)}</div>
                </div>
                <div class="row">
                <div class="contenx col info-field"><span style="font-weight: bold">Category:  </span>${event.category}</div>
                <div class="contenx col info-field"><span style="font-weight: bold">Type:  </span>${event.type}</div>
                </div>
                <div class="row">
                <div class="contenx col info-field"><span style="font-weight: bold">Capacity:  </span>${event.maxCapacity}</div>
                <div class="contenx col info-field"><span style="font-weight: bold">Team Size:  </span>${event.teamSize ? event.teamSize : ""}</div>
                </div>
                </div>
                <div class="modal-footer">
                <button type="button" class="btn btn-outline-secondary"  id="edit-button" style="background-color:#6c757d; color: #ffffff;">Edit</button>
                <button type="button" class="btn btn-outline-primary" id="confirm-button" style="border-color: #d2a600;color: #ffffff; background-color: #dfb30a;">Confirm</button>
                </div>
            </div>
            </div>
            </div>`);

        $('#modal-section #confirmModal').modal('show');

        $("#edit-button").on("click", () => {
            $('#modal-section #confirmModal').modal('hide');
        });

        $("#confirm-button").on("click", () => {
            if (submitEventButton.text() == "Update") {
                event.id = sessionStorage.getItem("eventId");
                updateEvent(event);
            } else if (submitEventButton.text() == "Create") {
                postEvent(event);
            }
        });

    }
});