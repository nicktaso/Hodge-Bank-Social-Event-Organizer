package com.team3.socialeventorganiser.Controllers;


import com.team3.socialeventorganiser.Models.Event;

import com.team3.socialeventorganiser.Models.User;
import com.team3.socialeventorganiser.Repositories.EventRepository;
import com.team3.socialeventorganiser.Repositories.TeamRepository;
import com.team3.socialeventorganiser.Repositories.UserRepository;
import com.team3.socialeventorganiser.Services.Email;
import com.team3.socialeventorganiser.Services.Reminder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.text.ParseException;
import java.time.ZoneId;
import java.util.List;

@RestController
public class EventController {
    private EventRepository eventRepository;
    private UserRepository userRepository;

    @Autowired
    EventController(EventRepository er, TeamRepository tr, UserRepository ur){
        eventRepository = er;
        userRepository = ur;
    }

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Reminder reminder;

    @GetMapping("/owning-events-by-user")
    public String owningEventsByUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.owningEventsByUser(userID);
        return HomeController.toJson(events);
    }

    @GetMapping("/upcoming-events-by-user")
    public String upcomingEventsByUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.upcomingEventsByUser(userID);
        return HomeController.toJson(events);
    }

    @GetMapping("/previous-events-by-user")
    public String previousEventsByUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.previousEventsByUser(userID);
        return HomeController.toJson(events);
    }

    @GetMapping("/upcoming-events")
    public String upcomingEvents(){
        List<Event> events = eventRepository.upcomingEvents();
        return HomeController.toJson(events);
    }


    @GetMapping("/events-by-user")
    public String eventsByUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.eventsByUser(userID);
        return HomeController.toJson(events);
    }

    // example of request
    // http://localhost:8080/events-by-user-status?userID=5&status=3
    // status meaning: 1 - invited, 2 - going, 3 - not going, null - not defined (not likely to happen)
    @GetMapping("/events-by-attending-user")
    public String eventsByAttendingUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.eventsByUserStatus(userID, 2);
        return HomeController.toJson(events);
    }

    @GetMapping("/events-by-invited-user")
    public String eventsByInvitedUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.eventsByUserStatus(userID, 1);
        return HomeController.toJson(events);
    }

    @GetMapping("/events-by-not-going-user")
    public String eventsByNotGoingUser( @RequestParam (name="userID", required=true) int userID){
        List<Event> events = eventRepository.eventsByUserStatus(userID, 3);
        return HomeController.toJson(events);
    }

    @GetMapping("/all-events")
    public String allEvents(){
        List<Event> events = eventRepository.allEvents();
        return HomeController.toJson(events);
    }

    @GetMapping("/event-by-id")
    public String eventByID(@RequestParam (name="eventID", required=true) int eventID){
        Event event = eventRepository.eventByID(eventID);
        return HomeController.toJson(event);
    }

    @GetMapping("/events-by-keyword")
    //@ResponseBody
    public String eventsByKeyword( @RequestParam (name="keyword", required=true) String keyword) throws ParseException {
        List<Event> events = eventRepository.eventsByKeyword(keyword);
        return HomeController.toJson(events);
    }


    @PostMapping("/add-event")
    public String addEvent(@RequestBody Event event) {

        // Add event to DB and grab it's ID
        String event_id = String.valueOf(eventRepository.addEvent(event));
        // Set a date for reminder - 24h before event
        long reminderDateTime = event.getDateAndTime().minusHours(24).atZone(ZoneId.of("Europe/London")).toInstant().toEpochMilli();
        // Schedule a reminder
        reminder.scheduleReminder(Integer.parseInt(event_id), reminderDateTime);

        // Return ID of added event
        return event_id;
    }

    @PostMapping("/update-event")
    public int updateEvent(@RequestBody Event event){
        eventRepository.updateEvent(event);
        // Get going users
        List<User> userList = userRepository.usersByEventStatus(event.getId(),2);
        //userList.addAll(userRepository.usersByEventStatus(event.getId(),1));
        Email email = new Email(event.getId(),userList);
        // Set update email to going users
        email.onUpdate(javaMailSender);
        // Set a date for reminder - 24 hours before
        long reminderDateTime = event.getDateAndTime().minusHours(24).atZone(ZoneId.of("Europe/London")).toInstant().toEpochMilli();
        // Schedule a reminder
        reminder.scheduleReminder(event.getId(), reminderDateTime);
        return event.getId();
    }

    @PostMapping("/delete-event")
    public int deleteEvent(@RequestParam int eventId){

        List<User> userList = userRepository.usersByEventStatus(eventId,2);
        Email email = new Email(eventId,userList);
        // Send email to going users, that event is deleted
        email.onEventRemoval(javaMailSender);
        // Delete reminder for that event
        reminder.deleteReminder(eventId);
        return eventRepository.deleteEvent(eventId);
    }
}


