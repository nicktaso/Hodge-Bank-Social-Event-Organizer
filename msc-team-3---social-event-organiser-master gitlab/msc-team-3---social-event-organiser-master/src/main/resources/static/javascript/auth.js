
const loginSection = $("#login-section");
const loggedInSection = $("#logged-in");

var auth;
var email;

//this function runs every time so it makes sure that the email and auth values are stored in the local storage
function hideAll(){
    //console.log(typeof sessionStorage.getItem("auth"));
    //console.log(sessionStorage.getItem("auth"));
    if (sessionStorage.getItem("auth") == null || sessionStorage.getItem("auth") == "false") {
        //just string can be stored in sessionStorage
        sessionStorage.setItem("auth", "false");
        sessionStorage.setItem("email", "");
        loggedInSection.hide();
        loginSection.show();
    } else {
        loginSection.hide();
        loggedInSection.show();
    }
    auth = sessionStorage.getItem("auth");
}

 hideAll();

$("#login-form").submit(function( event ) {
    //console.log("In the submit method");
    email = $('#login-email').val();
    $('#login-error-field').text("");
    $.ajax({
        type: "POST",
        url: "/auth?email=" + email,
        contentType: 'application/json; charset=utf-8',        //; charset=utf-8
        dataType: 'json',
        success: function(data){
            console.log(data);
            if(data == null){
                console.log(email);
                $('#login-error-field').text("The submitted email is not registered");
            }
            else if(data.email == email){
                auth = "true";
                sessionStorage.setItem("auth", "true");
                sessionStorage.setItem("email", email);
                sessionStorage.setItem("userId", data.id)

                loginSection.hide();
                loggedInSection.show();
            }
            else{
                console.log(email);
                $('#login-error-field').text("The submitted email is not registered");
            }
        }
    });

    event.preventDefault();
});


