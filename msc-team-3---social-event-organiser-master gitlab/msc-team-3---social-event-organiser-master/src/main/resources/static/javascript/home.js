 const eventsCarousel = $("#events-carousel");
 const allEventsSection = $("#all-events-section");
 const loginModal = $("#login-modal");
 const sortFilters = $(".btn-sorting");
 const categoryFilters = $(".btn-filter");
 const typeFilters = $(".btn-filter-type");


renderEventsCarousel(eventsCarousel,"Upcoming Events");
renderAllEvents(allEventsSection,"All Events");
checkSessionStorage();
addButtonsListeners();


$("ul #home-page").addClass("active");

function renderEventsCarousel(section, sectionTitle) {
    $.ajax({
        type: "GET",
        url: "/upcoming-events",
        async: false,
       }).then(data=>{
       let events = JSON.parse(data);

        //dynamically generating html cards to display each card in a carousel swiper    
        populateEventCarousel(section,sectionTitle,events, "upcoming");
    });
}

function renderAllEvents(section, text) {
    $.ajax({
        type: "GET",
        url: "/all-events",
        async: false,
       }).then(data=>{
       let events = JSON.parse(data);

        //dynamically generating html cards to display each card in a grid  
        populateEventCards(section,text,events.reverse());
    });

}


const searchWordDiv = $(".form-control");
let searchWord;

//event listener for user input triggers a function that grabs the value and sends request to server
$(searchWordDiv).on("input",(e)=>{

    //always getting the typed value on an input event
    searchWord = searchWordDiv.val();

    $.ajax({
        type: "GET",
        url: "/events-by-keyword?keyword="+searchWord,
        contentType: 'application/json; charset=utf-8',
        dataType: 'json'
    }).then(data=>{

       // dynamically generate html cards to display each result event in a grid
        $(".search-blank").remove();
        renderSearchResults(data);
        checkIf2or1();
        //hide search results section when search input is empty or there is no result
        if(data.length < 1 || searchWord.length === 0){
            $("#search-results-header").hide();
        } else {
            $("#search-results-header").show();
        }
    });

});




function checkSessionStorage() {
    // Check local storage - if there is no last filter, assign first button as one.
    // If there is previous filter, assign appropriate button. Repeat for each filter group.

    // CategoryFilter
    if (sessionStorage.getItem("lastCategoryFilter") == null || sessionStorage.getItem("lastCategoryFilter").length === 0) {
        $(categoryFilters).first().addClass(" active-category-filter");
        sessionStorage.setItem("lastCategoryFilter", $(categoryFilters).first().val());
    } else {
        let activeButton = $("button[value='" + sessionStorage.getItem("lastCategoryFilter") + "']");
        activeButton.addClass(" active-category-filter");
    }
    // TypeFilter
    if (sessionStorage.getItem("lastTypeFilter") == null || sessionStorage.getItem("lastTypeFilter").length === 0) {
        $(typeFilters).first().addClass(" active-type-filter");
        sessionStorage.setItem("lastTypeFilter", $(typeFilters).first().val());
    } else {
        let activeButton = $("button[value='" + sessionStorage.getItem("lastTypeFilter") + "']");
        activeButton.addClass(" active-type-filter");
    }
    // SortFilter
    if (sessionStorage.getItem("lastSort") == null || sessionStorage.getItem("lastSort").length === 0) {
        $(sortFilters).first().addClass(" active-sort");
        sessionStorage.setItem("lastSort", $(sortFilters).first().val());
    } else {
        let activeButton = $("button[value='" + sessionStorage.getItem("lastSort") + "']");
        activeButton.addClass(" active-sort");
    }
}

function addButtonsListeners() {
    // Add active class to the current button (highlight it). Repeat for each filter group.

    // Category filter
    $(categoryFilters).each(function(){
        this.addEventListener("click", function () {
            $(".active-category-filter").removeClass("active-category-filter");
            $(this).addClass(" active-category-filter");
        })
    });

    // Type filter
    $(typeFilters).each(function(){
        this.addEventListener("click", function () {
            $(".active-type-filter").removeClass("active-type-filter");
            $(this).addClass(" active-type-filter");
        })
    });

    // Sort filter
    $(sortFilters).each(function(){
        this.addEventListener("click", function () {
            $(".active-sort").removeClass("active-sort");
            $(this).addClass(" active-sort");
        })
    });
}

// Filter cards on click, triggered by category filter button
 $(document).on('click','.active-category-filter', function(){
     $('.card').parent().removeClass('d-none');
     // removing the blank placeholder, which helps to keep a two grid-items in a proper distance
     $("#blank").remove();
     let categoryFilter = $(this).val();
     let typeFilter = sessionStorage.getItem("lastTypeFilter");
     sessionStorage.setItem("lastCategoryFilter",categoryFilter);
     let items = $('#all-events-section').find('.swiper-slide .card .skills-container:not(:contains("'+typeFilter+'"):contains("'+categoryFilter+'"))');
     items.parent().parent().parent().addClass('d-none');
     checkIf2(); // Function add a blank placeholder when there are two grid-items. Otherwise, two items are within wrong distance
 });

 // Filter cards on click, triggered by type filter button
 $(document).on('click','.active-type-filter', function(){
     $('.card').parent().removeClass('d-none');
     // removing the blank placeholder, which helps to keep a two grid-items in a proper distance
     $("#blank").remove();
     let typeFilter = $(this).val();
     let categoryFilter = sessionStorage.getItem("lastCategoryFilter");
     sessionStorage.setItem("lastTypeFilter",typeFilter);
     let items = $('#all-events-section').find('.swiper-slide .card .skills-container:not(:contains("'+typeFilter+'"):contains("'+categoryFilter+'"))');
     items.parent().parent().parent().addClass('d-none');
     checkIf2(); // Function add a blank placeholder when there are two grid-items. Otherwise, two items are within wrong distance
 });

 // Filter cards when document ready
 $(function() {
     $('.card').parent().removeClass('d-none');
     // removing the blank placeholder, which helps to keep a two grid-items in a proper distance
     $("#blank").remove();
     let categoryFilter = sessionStorage.getItem("lastCategoryFilter");
     let typeFilter = sessionStorage.getItem("lastTypeFilter");
     let items = $('#all-events-section').find('.swiper-slide .card .skills-container:not(:contains("'+typeFilter+'"):contains("'+categoryFilter+'"))');
     items.parent().parent().parent().addClass('d-none');
     checkIf2(); // Function add a blank placeholder when there are two grid-items. Otherwise, two items are within wrong distance
 });

 function sort(criteria){
     let myList = $('#all-events-section');
     $("#blank").remove(); // explained in previous function
     let listItems = myList.children('div').get();

     if (criteria.includes("Name")){
         listItems.sort(function (a, b) {
             return $(a).text().toUpperCase().localeCompare($(b).text().toUpperCase());
         });
     } else if (criteria.includes("Date")){
         listItems.sort(function(a, b) {
             // fixed with https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
             // and https://stackoverflow.com/questions/39909653/change-javascript-date-in-chrome
             let first = ($(a).children().first().children().eq(1).children().eq(2).children().first().children().eq(1).text()).split("-");
             let second = ($(b).children().first().children().eq(1).children().eq(2).children().first().children().eq(1).text()).split("-");
             let date1 = new Date(first[0],first[1],first[2]);
             let date2 = new Date(second[0],second[1],second[2]);
             if (date1 > date2){
                 return 1; // there is a need for change
             }
             if (date1 < date2){
                 return -1;
             }
             return 0;
         });
     } else {
     }

     if (criteria.includes("Descending")){
             listItems.reverse()
     }

     $.each(listItems, function (index, item) {
         myList.append(item);
     });
     sessionStorage.setItem("lastSort",criteria);
     checkIf2(); // explained in previous function
 }

 // Sort cards on ready
 $(function() {
     let sortCriteria = sessionStorage.getItem("lastSort");
     sort(sortCriteria)

     });

 // When there are two items in a grid container row,
 // add blank div as third element in order to ensure good display
 function checkIf2(){
     let myList = $('#all-events-section');
     let listItems = myList.children('.grid-item:not(.d-none)').get();
     // If there are only two elements, add a blank one in order to align a grid container
     // Fixes problem with alignment when there are two elements in grid only.
     if (listItems.length === 2){
         myList.append(`<div id="blank" class="swiper-slide grid-item"></div>`);
     }
 }

 function checkIf2or1(){
     let myList = $('#search-results');
     let listItems = myList.children('.grid-item').get();
     // If there are only one or two elements, add a blank ones in order to align a grid container
     // Fixes problem with alignment when there are one or two elements in grid only.
     if (listItems.length === 2){
         myList.append(`<div class="search-blank swiper-slide grid-item"></div>`);
     }
     if (listItems.length === 1){
         myList.append(`<div class="search-blank swiper-slide grid-item"></div>
            <div class="search-blank swiper-slide grid-item"></div>`);
     }
 }
