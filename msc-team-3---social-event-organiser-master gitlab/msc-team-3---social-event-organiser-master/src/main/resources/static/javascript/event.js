let eventObject;
let goingUsers;
let invitedUsers;
let notGoingUsers;
let allUsers;
let teams;

function checkEmails(emails, forInvite){
    let ids = [];
    let validEmails = [];
    let unrecognisedEmails = [];
    let alreadyGoingEmails = [];
    let alreadyNotGoingEmails = [];
    let alreadyInvitedEmails = [];

    let validUsers =[];

    //where important the duplicates were already checked
    //with this the errors won't be duplicated for the same email
    emails = new Set(emails);

    //this is a double check, maybe the email was not added through autocomplete but manually
    //it is not possible this way to invite people how are not registered among the users in the database
    emails.forEach(email => {
        //for the following check we should loop through arrays
        //if we find a match we would like to move on
        //without going through the rest of the current array and the other arrays
        //therefore the forEach loop cannot be used, because there's no way to break from that

        let skip = false;
        for(let i = 0; i<goingUsers.length; i++){
            if (goingUsers[i].email == email)
            {
                alreadyGoingEmails.push(email);
                skip = true;
                break;
            }
        }
        if(skip == false){
            for(let i = 0; i<notGoingUsers.length; i++){
                if (notGoingUsers[i].email == email)
                {
                    alreadyNotGoingEmails.push(email);
                    skip = true;
                    break;
                }
            }
        }
        if(forInvite === true){
            if(skip == false){
                for(let i = 0; i<invitedUsers.length; i++){
                    if (invitedUsers[i].email == email)
                    {
                        alreadyInvitedEmails.push(email);
                        skip = true;
                        break;
                    }
                }
            }
        }
        if(skip == false){
            for(let i = 0; i<allUsers.length; i++){
                if (allUsers[i].email == email)
                {
                    ids.push(allUsers[i].id);
                    validEmails.push(email);
                    validUsers.push(allUsers[i]);
                    skip = true;
                    break;
                }
            }
        }
        //we we get there without setting skip to false that means the emails was not recognised
        if(skip == false){
            unrecognisedEmails.push(email);
        }
    });

    let message = "";
    if(alreadyInvitedEmails.length > 0){
        message += "Invitation already has been sent to:<br/>";
        alreadyInvitedEmails.forEach(email => {
            //since tabulator does not work in the modal I use 5 spaces instead
            message += "<span style='padding-left: 2em'></span>" + email + "<br/>";
        });
        message += "<br/>";
    }
    if(alreadyGoingEmails.length > 0){
        message += "Already responded that going:<br/>";
        alreadyGoingEmails.forEach(email => {
            message += "<span style='padding-left: 2em'></span>" + email + "<br/>";
        });
        message += "<br/>";
    }
    if(alreadyNotGoingEmails.length > 0){
        message += "Already responded that not going:<br/>";
        alreadyNotGoingEmails.forEach(email => {
            message += "<span style='padding-left: 2em'></span>" + email + "<br/>";
        });
        message += "<br/>";
    }
    if(unrecognisedEmails.length > 0){
        message += "These emails are not registered in the system:<br/>";
        unrecognisedEmails.forEach(email => {
            message += "<span style='padding-left: 2em'></span>" + email + "<br/>";
        });
        message += "<br/>";
    }

    //Removing the last new line just to make the code look better
    //This statement does not cause an error if the field is empty or the asked indexes do not exist
    if(message.substr(message.length - 5) == "<br/>"){
        message = message.substr(0, message.length - 5);
    }

    return [ids, validEmails, message, validUsers];
}

function autocomplete(inp) {
    // $("#team-alert-success-p").html("");
    // $("#team-alert-success").hide();
    // $("#invite-alert-success-p").html("");
    // $("#invite-alert-success").hide();

    let tag = inp.tagName;
    let currentFocus;

    inp.addEventListener("input", function(e) {

        let autocompleteListItemContainer;
        let autocompleteListItem;

        let val = this.value;

        //if there are just new lines and spaces in the input fields
        let isPracticallyEmpty = val.replace(/\n|\r/g, '').replace(/\s/g, '');
        if(isPracticallyEmpty == ""){
            //it's important to have it really empty, not just see it as empty
            //because an extra new line or space can make the autosearch not work
            inp.value = "";
        }

        if(tag === "TEXTAREA"){
            indexOfLastSeparater = val.lastIndexOf(";");

            //if we can find it in the string then we observe just the last textfield
            if(indexOfLastSeparater != -1){
                val = val.substr(indexOfLastSeparater + 1);
                //it makes sure that the extra added spaces do not cause a problem
                val = val.replace(/\s/g, '');
                //same with new line characters
                val = val.replace(/\n|\r/g, '');
            }
        }

        //Close any already open lists of autocompleted values
        closeAllLists();
        if (!val) { return false;}
        currentFocus = -1;

        autocompleteListItemContainer = document.createElement("DIV");
        autocompleteListItemContainer.setAttribute("id", this.id + "autocomplete-list");
        autocompleteListItemContainer.setAttribute("class", "autocomplete-items");

        this.parentNode.appendChild(autocompleteListItemContainer);

        for (let i = 0; i < allUsers.length; i++) {

            //check if the item starts with the same letters as the text field value
            if (allUsers[i].email.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                //Creating a DIV element for each matching element:
                autocompleteListItem = document.createElement("DIV");

                //Making the matching letters bold
                autocompleteListItem.innerHTML = "<strong>" + allUsers[i].email.substr(0, val.length) + "</strong>";
                autocompleteListItem.innerHTML += allUsers[i].email.substr(val.length);
                //Using a hidden a input field that will hold the current array item's value
                autocompleteListItem.innerHTML += "<input type='hidden' value='" + allUsers[i].email + "'>";

                autocompleteListItem.addEventListener("click", function(e) {
                    //Insert the value for the autocomplete text field

                    inp.value = inp.value.substr(0, inp.value.length - val.length - 1);
                    //Checking if it's the first line, if yes then don't add a linebreak
                    if (inp.value.length !== 0) {
                        inp.value += "\n";
                    }
                    inp.value += this.getElementsByTagName("input")[0].value;
                    if(tag === "TEXTAREA"){
                        inp.value += ";\n";
                    }

                    closeAllLists();
                });
                autocompleteListItemContainer.appendChild(autocompleteListItem);
            }

            if (allUsers[i].firstName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                autocompleteListItem = document.createElement("DIV");

                autocompleteListItem.innerHTML = "<strong>" + allUsers[i].firstName.substr(0, val.length) + "</strong>";
                autocompleteListItem.innerHTML += allUsers[i].firstName.substr(val.length) + " "  + allUsers[i].lastName;

                autocompleteListItem.innerHTML += "<input type='hidden' value='" + allUsers[i].email + "'>";

                autocompleteListItem.addEventListener("click", function(e) {

                    inp.value = inp.value.substr(0, inp.value.length - val.length - 1);
                    //Checking if it's the first line, if yes then don't add a linebreak
                    if(inp.value.length !== 0){
                        inp.value += "\n";
                    }
                    inp.value += this.getElementsByTagName("input")[0].value;
                    if(tag === "TEXTAREA"){
                        inp.value += ";\n";
                    }

                    closeAllLists();
                });
                autocompleteListItemContainer.appendChild(autocompleteListItem);
            }

            if (allUsers[i].lastName.substr(0, val.length).toUpperCase() == val.toUpperCase()) {

                autocompleteListItem = document.createElement("DIV");

                autocompleteListItem.innerHTML = allUsers[i].firstName + " ";
                autocompleteListItem.innerHTML += "<strong>" + allUsers[i].lastName.substr(0, val.length) + "</strong>";
                autocompleteListItem.innerHTML += allUsers[i].lastName.substr(val.length);


                autocompleteListItem.innerHTML += "<input type='hidden' value='" + allUsers[i].email + "'>";

                autocompleteListItem.addEventListener("click", function(e) {

                    inp.value = inp.value.substr(0, inp.value.length - val.length - 1);
                    //Checking if it's the first line, if yes then don't add a linebreak
                    if(inp.value.length !== 0){
                        inp.value += "\n";
                    }
                    inp.value += this.getElementsByTagName("input")[0].value;
                    if(tag === "TEXTAREA"){
                        inp.value += ";\n";
                    }

                    closeAllLists();
                });
                autocompleteListItemContainer.appendChild(autocompleteListItem);
            }
        }
    });

    //Handling keyboard inputs
    inp.addEventListener("keydown", function(e) {
        let x = document.getElementById(this.id + "autocomplete-list");
        if (x) x = x.getElementsByTagName("div");
        if (e.keyCode == 40) {
            //If the arrow DOWN key is pressed increase the currentFocus variable
            currentFocus++;
            //and and make the current item more visible:
            addActive(x);
        } else if (e.keyCode == 38) {
            //If the arrow UP key is pressed decrease the currentFocus variable:
            currentFocus--;
            //Make the current item more visible
            addActive(x);
        } else if (e.keyCode == 13) {
            //If the ENTER key is pressed, prevent the form from being submitted
            e.preventDefault();
            if (currentFocus > -1) {
                //Simulate a click on the "active" item
                if (x) x[currentFocus].click();
            }
        }
    });

    //A function to classify an item as "active"
    function addActive(x) {

        if (!x) return false;
        //start by removing the "active" class on all items:
        removeActive(x);
        if (currentFocus >= x.length) currentFocus = 0;
        if (currentFocus < 0) currentFocus = (x.length - 1);
        x[currentFocus].classList.add("autocomplete-active");
    }

    function removeActive(x) {
        for (let i = 0; i < x.length; i++) {
            x[i].classList.remove("autocomplete-active");
        }
    }

    function closeAllLists(elmnt) {
        //close all autocomplete lists in the document, except the one passed as an argument
        let x = document.getElementsByClassName("autocomplete-items");
        for (let i = 0; i < x.length; i++) {
            if (elmnt != x[i] && elmnt != inp) {
                x[i].parentNode.removeChild(x[i]);
            }
        }
    }
    //execute a function when someone clicks in the document
    document.addEventListener("click", function (e) {
        closeAllLists(e.target);
    });
}

function setUpTeamForm(){
    //console.log(eventObject.teamSize);
    for(let i = 0; i < eventObject.teamSize; i++){

        let formGroup = document.createElement("div");
        formGroup.setAttribute("class", "form-group autocomplete");

        let label = document.createElement("label");
        label.setAttribute("class", "col-form-label");
        label.innerText = "Team member " + (i + 1);

        let input = document.createElement("input");
        input.setAttribute("type", "email");
        input.setAttribute("class", "form-control team-member-email");
        input.setAttribute("id", "team-member-" + i);
        autocomplete(input);

        formGroup.appendChild(label);
        formGroup.appendChild(input);

        $("#team-form").append(formGroup);
    }
}

function getEvent(){
    return $.ajax({
        type: "GET",
        url: "/event-by-id?eventID=" + eventId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
    .then(data => {
        eventObject = data;
        //console.log(eventObject);

        $("#eventCoverImage").attr("src",assignCoverImage(eventObject.category));
        $("#event-title").text(eventObject.title);
        $("#event-location").text(eventObject.location);
        $("#event-date").text( eventObject.dateAndTime.dayOfMonth.toString().padStart(2,'0')  + " - " + eventObject.dateAndTime.month.toString().padStart(2,'0') + " - " + eventObject.dateAndTime.year.toString().padStart(4,'0'));
        $("#event-time").text(eventObject.dateAndTime.hour.toString().padStart(2,'0') + ":" + eventObject.dateAndTime.minute.toString().padStart(2,'0'));
        $("#event-description").text(eventObject.description);

        if(sessionStorage.getItem("userId") == eventObject.ownerId){
            $("#delete-button").show();
            $("#modify-button").show();
        }

        setUpTeamForm();
    });
}

function getAllUsers(){
    $.ajax({
        type: "GET",
        url: "/all-users",
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
    .then(data => {
        allUsers = data;
    });
}

function getGoingUsers(){
    $.ajax({
        type: "GET",
        url: "/going-users-by-event?eventID=" + eventId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
    .then(data => {
        goingUsers = data;
        $("#number-going-users").text(goingUsers.length);
        $("#mobile-number-going-users").text(goingUsers.length);
        goingUsers.forEach(user =>{
            if(user.id == sessionStorage.getItem("userId")){
                $("#not-going-button").show();
                $("#going-button").hide();
            }
        });
    });
}

function getNotGoingUsers(){
    $.ajax({
        type: "GET",
        url: "/not-going-users-by-event?eventID=" + eventId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
    .then(data => {
        notGoingUsers = data;
        $("#number-not-going-users").text(notGoingUsers.length);
        $("#mobile-number-not-going-users").text(notGoingUsers.length);
        notGoingUsers.forEach(user =>{
            if(user.id == sessionStorage.getItem("userId")){
                $("#not-going-button").hide();
                $("#going-button").show();
            }
        });
    });
}

function getInvitedUsers(){
    $.ajax({
        type: "GET",
        url: "/invited-users-by-event?eventID=" + eventId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
    .then(data => {
        invitedUsers = data;
        $("#number-invited-users").text(invitedUsers.length);
        $("#mobile-number-invited-users").text(invitedUsers.length);
    });
}

function getTeams(){
    $.ajax({
        type: "GET",
        url: "/teams-by-event?eventID=" + eventId,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    })
        .then(data => {
            teams = data;
            //console.log(teams);
        });
}

function userGoing(){
    if(eventObject.type === "Individual"){
        $.ajax({
            type: "POST",
            //using a ternary to handle the question on the spot
            url: "going?eventID=" + eventId + "&userID=" + sessionStorage.getItem("userId"),
            contentType: 'application/json; charset=utf-8',        //; charset=utf-8
            dataType: 'json'
        })
        .then(data => {
            getGoingUsers();
            getNotGoingUsers();
            getInvitedUsers();
            getTeams();
        });
    }

    if(eventObject.type === "Team"){
        $('#team-alert-error').hide();
        $('#team-alert-success').hide();
        $('#team-alert-wait').hide();
        $('#team-alert-error-p').html("");
        $('#team-alert-success-p').html("");
        let teamMemberEmail = $(".team-member-email");
        for(let i = 0; i < teamMemberEmail.length; i++){
            teamMemberEmail[i].value = "";
        }
        $("#team-name").val("");
        $('#team-modal').modal('show');
    }
}

function teamGoing(){
    let position;

    $("#team-alert-success-p").html("");
    $("#team-alert-success").hide();
    //check on the team name, if that is not acceptable the function returns and no further processing is going to be done
    if($("#team-name").val().length > 50){
        $("#team-alert-error-p").html("Team name should not be longer than 50 characters");
        $("#team-alert-error").show();

        //Scroll to the the message
        position = $('#team-modal-body').position();
        $('#team-modal').animate({
            scrollTop: position.top
        }, "slow");

        return;
    }

    if($("#team-name").val().length == 0){
        $("#team-alert-error-p").html("Team name should not be empty");
        $("#team-alert-error").show();

        //Scroll to the the message
        position = $('#team-modal-body').position();
        $('#team-modal').animate({
                scrollTop: position.top
        }, "slow");

        return;
    }

    //Getting data from input fields
    let inputEmails = document.getElementsByClassName("team-member-email");

    let teamEmails = [];
    for(let i = 0; i < inputEmails.length; i++){
        //Removing spaces and break-line characters from input before adding it to the email array
        inputEmails[i] = inputEmails[i].value.replace(/\s/g, '');
        inputEmails[i] = inputEmails[i].value.replace(/\n|\r/g, '');

        teamEmails.push(inputEmails[i].value);
    }

    if(teamEmails.includes("")){
        $("#team-alert-error-p").html("There should be no empty email fields");
        $("#team-alert-error").show();

        //Scroll to the the message
        position = $('#team-modal-body').position();
        $('#team-modal').animate({
            scrollTop: position.top
        }, "slow");

        return;
    }

    let findDuplicates = arr => arr.filter((item, index) => arr.indexOf(item) != index);
    if(findDuplicates(teamEmails).length > 0){
        let duplicateOnes = new Set(findDuplicates(teamEmails));

        let duplicateMessage = "Duplicate of email:";
        duplicateOnes.forEach(email => {
            duplicateMessage += "<br/><span style='padding-left: 2em'></span>" + email;
        });

        $("#team-alert-error-p").html(duplicateMessage);
        $("#team-alert-error").show();

        //Scroll to the the message
        position = $('#team-modal-body').position();
        $('#team-modal').animate({
            scrollTop: position.top
        }, "slow");

        return;
    }

    let result = checkEmails(teamEmails, false);
    let validUsers = result[3];
    let validEmailsForTeam = result[1];
    let errorAlertMessage = result[2];

    //we had emails in categories of that cannot be added to the team.
    if(validUsers.length != eventObject.teamSize){
        $("#team-alert-error-p").html(errorAlertMessage);
        $("#team-alert-error").show();

        //Scroll to the the message
        position = $('#team-modal-body').position();
        $('#team-modal').animate({
            scrollTop: position.top
        }, "slow");
    }
    else{
        $("#team-alert-wait").show();
        $("#team-alert-error-p").html("");
        $("#team-alert-error").hide();

        //Scroll to the the message
        position = $('#team-modal-body').position();
        $('#team-modal').animate({
            scrollTop: position.top
        }, "slow");

        //console.log(ids);
        $.ajax({
            type: "POST",
            url: "/add-team",
            contentType: 'application/json; charset=utf-8',        //; charset=utf-8
            dataType: 'json',
            data: JSON.stringify({
                name: $("#team-name").val(),
                eventId: eventId,
                users: validUsers
            })
        })
        .then(data => {
            //console.log(data);
            //console.log(data == "success");
            if(data == "success"){
                let successMessage = "Added to the team:";
                validEmailsForTeam.forEach(email => {
                    successMessage += "<br/><span style='padding-left: 2em'></span>" + email;
                });
                getGoingUsers();
                getNotGoingUsers();
                getInvitedUsers();
                getTeams();
                $("#team-alert-error-p").html("");
                $("#team-alert-error").hide();
                $("#team-alert-wait").hide();
                $("#team-alert-success-p").html(successMessage);
                $("#team-alert-success").show();

                //Scroll to the the message
                position = $('#team-modal-body').position();
                $('#team-modal').animate({
                    scrollTop: position.top
                }, "slow");
            }
            else if(data == "TeamNameError"){
                $("#team-alert-wait").hide();
                $("#team-alert-error-p").html("Team name already exists for the event");
                $("#team-alert-error").show();

                //Scroll to the the message
                position = $('#team-modal-body').position();
                $('#team-modal').animate({
                    scrollTop: position.top
                }, "slow");
            }
            else{
                data = JSON.parse(data);
                let rejectMessage = "Team members with the following numbers are already added to teams:";
                for(let i = 0; i < data.length; i++){
                    rejectMessage += "<br/><span style='padding-left: 2em'></span>" + data[i];
                }
                $("#team-alert-wait").hide();
                $("#team-alert-error-p").html(rejectMessage);
                $("#team-alert-error").show();

                //Scroll to the the message
                position = $('#team-modal-body').position();
                $('#team-modal').animate({
                    scrollTop: position.top
                }, "slow");
            }
        });
    }
}

function userNotGoing(){
    $.ajax({
        type: "POST",
        //using a ternary to handle the question on the spot
        url: "not-going?eventID=" + eventId + "&userID=" + sessionStorage.getItem("userId"),
        contentType: 'application/json; charset=utf-8',        //; charset=utf-8
        dataType: 'json'
    })
    .then(data => {
        getGoingUsers();
        getNotGoingUsers();
        getInvitedUsers();
        getTeams();
    });
}

function showInvitedUsers(){
    $('#attendance-modal-title').text("Invited users");

    $('#attendance-table-body').empty();

    invitedUsers.forEach(user => {
        $('#attendance-table-body').append(`
        <tr>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
        </tr>
        `)
    });

    $('#attendance-modal').modal('show');
}

function showGoingUsers(){
    $('#attendance-modal-title').text("Going users");

    $('#attendance-table-body').empty();

    //Displaying teams in a bundle;
    if(eventObject.type === "Team"){
        for(let i = 0; i < teams.length; i++){
            $('#attendance-table-body').append(`
                <tr>
                    <td><strong>${teams[i].name}</strong></td>
                    <td></td>
                </tr>
            `);
            for(let j = 0; j < teams[i].users.length; j++){
                $('#attendance-table-body').append(`
                <tr>
                    <td>${teams[i].users[j].firstName} ${teams[i].users[j].lastName}</td>
                    <td>${teams[i].users[j].email}</td>
                </tr>
                `);
            }
            $('#attendance-table-body').append(`<br>`);
        }
    }
    else{
        goingUsers.forEach(user => {
            $('#attendance-table-body').append(`
                <tr>
                    <td>${user.firstName} ${user.lastName}</td>
                    <td>${user.email}</td>
                </tr>
            `);
        });
    }

    $('#attendance-modal').modal('show');
}

function showNotGoingUsers(){
    $('#attendance-modal-title').text("Not going users");

    $('#attendance-table-body').empty();

    notGoingUsers.forEach(user => {
        $('#attendance-table-body').append(`
        <tr>
            <td>${user.firstName} ${user.lastName}</td>
            <td>${user.email}</td>
        </tr>
        `)
    });

    $('#attendance-modal').modal('show');
}

function showInviteModal(){
    $('#invite-alert-error').hide();
    $('#invite-alert-success').hide();
    $('#invite-alert-error-p').html("");
    $('#invite-alert-success-p').html("");
    $('#invite-alert-wait').hide();
    $("#multiple-email").val("");
    $('#invite-modal').modal('show');
}

function invite(){
    let position;

    $("#invite-alert-success-p").html("");
    $("#invite-alert-success").hide();
    //The textarea contains the emails separated with semi-columns
    let textarea = $("#multiple-email").val();

    //removing if there are extra spaces in the input
    textarea = textarea.replace(/\s/g, '');

    //getting the array of emails using the split function
    let emails = textarea.split(";");

    //Removing the empty emails from the end after the last ;
    //It is sufficient this way in this case (of course could be better)
    let index = emails.indexOf("");
    if (index > -1) {
        emails.splice(index, 1);
    }
    //console.log(emails);
    //console.log(emails.length);
    if(emails.length == 0){
        //maybe some separating character at the wrong place, maybe the input is empty
        $("#invite-alert-error-p").html("Input field is empty or invalid");
        $("#invite-alert-error").show();

        position = $('#invitation-modal-body').position();
        $('#invite-modal').animate({
            scrollTop: position.top
        }, "slow");

        return;
    }

    let result = checkEmails(emails, true);
    let ids = result[0];
    let validEmailsForInvite = result[1];
    let errorAlertMessage = result[2];

    if(ids.length > 0){
        $('#invite-alert-wait').show();
        $("#invite-alert-error-p").html("");
        $("#invite-alert-error").hide();

        position = $('#invitation-modal-body').position();
        $('#invite-modal').animate({
            scrollTop: position.top
        }, "slow");

        $.ajax({
            type: "POST",
            url: "/invite-multiple-users?eventID=" + eventId,
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            data: JSON.stringify(ids)
        })
            .then(data => {
                let successMessage = "Sending invitation to:";
                validEmailsForInvite.forEach(email => {
                    successMessage += "<br/><span style='padding-left: 2em'></span>" + email;
                });
                getGoingUsers();
                getNotGoingUsers();
                getInvitedUsers();
                getTeams();
                $('#invite-alert-wait').hide();

                if(errorAlertMessage == ""){
                    $("#invite-alert-error-p").html("");
                    $("#invite-alert-error").hide();
                }
                else{
                    $("#invite-alert-error-p").html(errorAlertMessage);
                    $("#invite-alert-error").show();

                    position = $('#invitation-modal-body').position();
                    $('#invite-modal').animate({
                        scrollTop: position.top
                    }, "slow");
                }
                if (validEmailsForInvite.length > 0){
                    $("#invite-alert-success-p").html(successMessage);
                    $("#invite-alert-success").show();

                    position = $('#invitation-modal-body').position();
                    $('#invite-modal').animate({
                        scrollTop: position.top
                    }, "slow");
                }
            });
    }
    else{
        $("#invite-alert-error-p").html(errorAlertMessage);
        $("#invite-alert-error").show();

        position = $('#invitation-modal-body').position();
        $('#invite-modal').animate({
            scrollTop: position.top
        }, "slow");
    }
}

function eventPageInit(){
    //console.log(sessionStorage.getItem("eventId"));
    sessionStorage.setItem("eventId", eventId);
    getEvent();
    getInvitedUsers();
    getGoingUsers();
    getNotGoingUsers();
    getAllUsers();
    getTeams();
    $('#event-url-copy').text("http://localhost:8080/event?eventID=" + eventId);
    $('#event-url-copy').attr("href", "http://localhost:8080/event?eventID=" + eventId);
}

function setToModify() {
    localStorage.setItem("modifyEvent", "true");
}

eventPageInit();

autocomplete(document.getElementById("multiple-email"));

function assignCoverImage(eventCategory) {
    let img;
    images.forEach(category =>{
        if(category.category==eventCategory){
            img = category.coverImages[Math.floor(Math.random()* category.images.length)];
        }
    });
    return img;
}