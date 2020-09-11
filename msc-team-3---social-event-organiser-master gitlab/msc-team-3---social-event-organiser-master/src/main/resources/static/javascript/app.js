function seeMoreClick(eventId){
    sessionStorage.setItem("eventId", eventId);
}

function renderSearchResults(results){
    $("#search-results").empty();
    $(".search-header").remove();
    if (results.length > 0){
        populateEventCards($("#search-results"),"Search Results",results);
    }
}

function renderHeader(section){
    $(section).append(`
    <nav>
      <ul>
        <li><a class="logo" href="/home"><img src="../images/hodge_bank_logo.png" alt="Hodge Logo" width="200" height="80"/></a></li>
        <li style="float:right"><a class="active" href="/my-events">My Events</a></li>
        <li style="float:right"><a class="crEvent" href="/create-event">+ Create an event</a></li>
      </ul>
    </nav>
  `)
}


function populateEventCards(section,text,events){

        renderSectionTitle(text)
    
    events.forEach(event => {
        var image = assignImageToEvent(event.category);

       section.append(` <div class="swiper-slide grid-item">
       <div class="card h-100">
           <img class="card-img-top" src="${image}" alt=${event.title + " picture"}>
           <div class="card-body">
               <h3 class="h5 card-title mb-0">${event.title}</h3>
               <div class="skills-container mb-2"><span class="badge badge-secondary temporary_dynamic">${event.type}</span><span class="mx-1 badge  badge-light temporary_dynamic">${event.category}</span></div>
               <p class="card-text syp-common-events"><small ><b>Date: </b><span class = date>${event.dateAndTime.year} - ${event.dateAndTime.monthValue.toString().padStart(2,'0')} - ${event.dateAndTime.dayOfMonth.toString().padStart(2,'0')}</span><span class = time>&nbsp;&nbsp;&nbsp; ${event.dateAndTime.hour.toString().padStart(2,'0')} : ${event.dateAndTime.minute.toString().padStart(2,'0')}</span></small></p>
               <p class="card-text syp-common-events"><small ><b>Location: </b>${event.location}</small></p>
           </div>
           <div class="card-footer text-center">
               <a class="btn btn-outline-light btn-sm " href=${"/event?eventID=" + event.id} name=${event}>See more</a>
           </div>
       </div>
       </div>`)
   })
}

function renderSectionTitle( sectionTitle) {
    if(sectionTitle == "Search Results"){
        $(".search-header").remove();
        $("#search-results-header").prepend(`<header class="sectionHeader mb-3 container search-header">
            <h2 class="h3 ">${sectionTitle}</h2>
            </header>`)


        //will add html for search results title and button to clear section 
    } else {

    $("#section-header").prepend(`<header class="sectionHeader mb-3 container">
    <div class="row row-header">
        <div class="col-md-4 head"></div>
        <div class="col-md-4 head">
            <h2 class="h3">${sectionTitle}</h2>
        </div>
        <div class="col-md-4 head-filters">
        <div>
            <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#filters-box">Filter</button>
            <button type="button" class="btn btn-info" data-toggle="collapse" data-target="#advanced-box">Advanced</button>	
            </div>
        </div>
        </div>
</header>`)
    }
}

function deleteEvent(){
    $.ajax({
        url: "/delete-event?eventId="+eventId,
        type: 'POST',
        success: function(result) {
            window.location.href = "/home";
        }
    });

}

function populateEventCarousel(section,sectionTitle,events, id){
    section.append(`<section id= "${id}-events'">
    <div class="container my-4">
    <header   class="sectionHeader mb-3">
        <h2 class="h3">${sectionTitle}</h2>	
    </header>
    <!-- Additional wrapper to bring navigation buttons and pagination outside slides -->
    <div class="swiper-full-container">
        <div id="${id}-events-swiper" class="swiper-container">
            <!-- Additional required wrapper -->
            <div id="${id}-events-swiper-wrapper" class="swiper-wrapper">
                <!-- Slides -->
            </div>
        </div>
        <!-- Pagination -->
        <div id="${id}-events-swiper-pag" class="swiper-pagination"></div>
    
        <!-- Navigation buttons -->
        <div id="${id}-events-swiper-prev" class="swiper-button-prev"></div>
        <div id="${id}-events-swiper-next" class="swiper-button-next"></div>
    </div>
    </div>
    </section>`);
        events.forEach(event => {
            var image = assignImageToEvent(event.category);
            var swiperWrapper = document.getElementById(id + "-events-swiper-wrapper");
            $(swiperWrapper).append(` <div class="swiper-slide">
    <div class="card h-100">
        <img class="card-img-top" src=${image} alt=${event.title + " picture"}>
        <div class="card-body">
            <h3 class="h5 card-title mb-0">${event.title}</h3>
            <div class="skills-container mb-2"><span class="badge  badge-secondary temporary_dynamic">${event.type}</span><span class="mx-1 badge badge-light temporary_dynamic">${event.category}</span></div>
            <p class="card-text syp-common-events"><small ><b>Date: </b>${event.dateAndTime.year} - ${event.dateAndTime.monthValue.toString().padStart(2,'0')} - ${event.dateAndTime.dayOfMonth.toString().padStart(2,'0')}<span class="time">&nbsp;&nbsp;&nbsp; ${event.dateAndTime.hour.toString().padStart(2,'0')} : ${event.dateAndTime.minute.toString().padStart(2,'0')}</span></small></p>
            <p class="card-text syp-common-events"><small "><b>Location: </b>${event.location}</small></p>
        </div>
    
        <div class="card-footer text-center">
            <a class="btn btn-outline-light btn-sm" href=${"/event?eventID=" + event.id}>See more</a>
        </div>
    </div>
    </div>`)
        })

    // Initialize Swiper
    var swiperId = id + "-events-swiper";
    var swiperBody = document.getElementById(swiperId);
    var swiper = $( swiperBody );
    var myEventsSwiper = new Swiper (swiper, {

        // Multiple Slides Per View parameters (with responsive breakpoints)
        slidesPerView: 1,
        spaceBetween: 30,
        observer: true,
        observeParents: true,

        breakpoints: {
            // when window width is >= 320px
            320: {
                slidesPerView: 1,
                spaceBetween: 20
            },
            // when window width is >= 480px
            480: {
                slidesPerView: 1,
                spaceBetween: 30
            },
            576: {
                slidesPerView: 1,
                spaceBetween: 20,
            },
            640: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            770: {
                slidesPerView: 2,
                spaceBetween: 40,
            },
            994: {
                slidesPerView: 3,
                spaceBetween: 50,
            },
        },
        // Optional parameters
        direction: 'horizontal',
        loop: true,

        // Pagination parameters
        pagination: {
            el: '#'+swiperId+'-pag',
            clickable: true,
        },

        // Navigation arrows parameters
        navigation: {
            nextEl: '#'+swiperId+'-next',
            prevEl: '#'+swiperId+'-prev',
        },

    })
}

function assignImageToEvent(eventCategory) {
    var img;
    images.forEach(category => {
        if (category.category == eventCategory) {
            img = category.images[Math.floor(Math.random() * category.images.length)];
        }
    })
    return img;
}

