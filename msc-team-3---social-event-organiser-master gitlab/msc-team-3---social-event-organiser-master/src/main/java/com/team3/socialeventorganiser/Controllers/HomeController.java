package com.team3.socialeventorganiser.Controllers;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

import java.util.List;

@Controller
public class HomeController {

    @GetMapping("/")
    public String getEmpty(){
        return "homeTemplate.html";
    }
    @GetMapping("/home")
    public String getHome(){
        return "homeTemplate.html";
    }

    @GetMapping("/my-events")
    public String getMyEvents(){
        return "myEventsTemplate.html";
    }

    @GetMapping("/event")
    public ModelAndView getEvent(@RequestParam(name="eventID", required=true) int eventID){
        ModelAndView mv = new ModelAndView();
        mv.setViewName("eventTemplate");
        mv.addObject("eventId", eventID);
        return mv;
    }

    @GetMapping("/create-event")
    public String getCreateEvent(){
        return "createEventTemplate.html";
    }

    @GetMapping("/calendar")
    public String getCalendar(){
        return "calendarTemplate.html";
    }

    public static String toJson (Object object){
        ObjectMapper mapper = new ObjectMapper();

        String jsonObject;

        try {
            jsonObject = mapper.writeValueAsString(object);
        } catch (JsonProcessingException e) {
            jsonObject = "{}";
            e.printStackTrace();
        }

        //System.out.println(jsonObject);
        return  jsonObject;
    }
}
