package com.team3.socialeventorganiser.Controllers;

import com.team3.socialeventorganiser.Models.Team;
import com.team3.socialeventorganiser.Models.User;
import com.team3.socialeventorganiser.Repositories.TeamRepository;
import com.team3.socialeventorganiser.Repositories.UserRepository;
import com.team3.socialeventorganiser.Services.Email;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.*;

@RestController
public class UserController {
    private UserRepository userRepository;
    private TeamRepository teamRepository;

    @Autowired
    UserController(UserRepository ur, TeamRepository tr){
        userRepository = ur;
        teamRepository = tr;
    }

    @Autowired
    private JavaMailSender javaMailSender;

    @GetMapping("/users-by-event")
    public String usersByEvent(@RequestParam (name="eventID", required=true) int eventID) {
        List<User> users = userRepository.usersByEvent(eventID);
        return HomeController.toJson(users);
        }

    // example of request
    // http://localhost:8080/users-by-event-status?eventID=5&status=3
    // status meaning: 1 - invited, 2 - going, 3 - not going, null - not defined (not likely to happen)
    @GetMapping("/going-users-by-event")
   public String usersByEventAttending(@RequestParam int eventID) {
        List<User> users = userRepository.usersByEventStatus(eventID, 2);
        return HomeController.toJson(users);
    }

    @GetMapping("/invited-users-by-event")
    public String usersByEventInvited(@RequestParam int eventID) {
        List<User> users = userRepository.usersByEventStatus(eventID, 1);
        return HomeController.toJson(users);
    }

    @GetMapping("/not-going-users-by-event")
    public String usersByEventNotGoing(@RequestParam int eventID) {
        List<User> users = userRepository.usersByEventStatus(eventID, 3);
        return HomeController.toJson(users);
    }

    @GetMapping("/all-users")
    public String allUsers(){
        List<User> users = userRepository.allUsers();
        return HomeController.toJson(users);
    }

    // example of request
    //http://localhost:8080/going?eventID=34&userID=23
    @PostMapping("/going")
    public String going(@RequestParam int eventID, @RequestParam int userID) {
        return String.valueOf(userRepository.going(eventID, userID));
    }

    @PostMapping("/not-going")
    public String notGoing(@RequestParam int eventID, @RequestParam int userID) {
        List<Team> teamsOnTheEvent = teamRepository.teamsByEvent(eventID);

        if(!teamsOnTheEvent.isEmpty()){
            for(Team team : teamsOnTheEvent){
                List<User> usersInTeam = userRepository.usersByTeam(team.getId());
                for(User user : usersInTeam){
                    if(user.getId() == userID){
                        userRepository.removeUserFromTeam(userID, team.getId());
                    }
                }
            }
        }

        return String.valueOf(userRepository.notGoing(eventID, userID));
    }

    @PostMapping("/invite")
    public String attending(@RequestParam int eventID, @RequestParam int userID) {
        return String.valueOf(userRepository.invite(eventID, userID));
    }

    @PostMapping("/invite-multiple-users")
    public String attending(@RequestBody int[] userIdsArray, @RequestParam int eventID) {
        Set<Integer> userIds = new HashSet<Integer>();

        //Avoid duplicates, it won't be shown as a problem on the client side
        for(int userIdFromArray : userIdsArray){
            userIds.add(userIdFromArray);
        }

        for(int userId : userIds){
            String.valueOf(userRepository.invite(eventID, userId));
        }

        List<User> users = new ArrayList<>();
        for(int id: userIds){
            users.add(userRepository.findUserById(id));
        }

        Email email = new Email(eventID,users);
        email.onInvite(javaMailSender);

        return HomeController.toJson("success");
    }

    @PostMapping("/user-by-email")
    public String auth(@RequestParam(name="email", required = true) String email) {
        System.out.println("in user-by-email");

        System.out.println(email);
        return HomeController.toJson(userRepository.findUserByEmail(email));
    }
}

