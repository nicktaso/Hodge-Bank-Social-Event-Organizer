package com.team3.socialeventorganiser.Controllers;

import com.team3.socialeventorganiser.Models.Team;
import com.team3.socialeventorganiser.Models.User;
import com.team3.socialeventorganiser.Repositories.EventRepository;
import com.team3.socialeventorganiser.Repositories.TeamRepository;
import com.team3.socialeventorganiser.Repositories.UserRepository;
import com.team3.socialeventorganiser.Services.Reminder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class TeamController {
    private EventRepository eventRepository;
    private TeamRepository teamRepository;
    private UserRepository userRepository;

    @Autowired
    TeamController(EventRepository er, TeamRepository tr, UserRepository ur){
        eventRepository = er;
        teamRepository = tr;
        userRepository = ur;
    }

    @Autowired
    private JavaMailSender javaMailSender;

    @Autowired
    private Reminder reminder;

    @PostMapping("/add-team")
    public String addTeam(@RequestBody Team team){
        //If the team name already exist for the event than the query should be rejected
        List<Team> teamsForTheEvent = teamRepository.teamsByEvent(team.getEventId());

        for(Team teamForEvent : teamsForTheEvent){
            if(team.getName().equalsIgnoreCase(teamForEvent.getName())){
                return HomeController.toJson("TeamNameError");
            }
        }

        //First that should be checked if any of the users is already added to the event or not
        //After that the team and team member connections can be added safely

        //Basically this is a double check
        List<Integer> goingTeamMemberNumber = new ArrayList<Integer>();

        List<User> goingUsers = userRepository.usersByEventStatus(team.getEventId(), 2);
        for (User user : goingUsers) {
            for (int i = 0; i < team.getUsers().size(); i++) {
                if (user.getId() == team.getUsers().get(i).getId()) {
                    //The real id is not interesting because that is not information for the user
                    //That's why just just the team member number is passed (or that -1)
                    goingTeamMemberNumber.add(i);
                }
            }
        }

        if (!goingTeamMemberNumber.isEmpty()) {
            return HomeController.toJson(goingTeamMemberNumber);
        } else {
            for (int i = 0; i < team.getUsers().size(); i++) {
                userRepository.going(team.getEventId(), team.getUsers().get(i).getId());
            }

            team.setId(teamRepository.createTeam(team.getName()));

            for (int i = 0; i < team.getUsers().size(); i++) {
                userRepository.addUserToTeam(team.getUsers().get(i).getId(), team.getId());
            }

            teamRepository.addTeamToEvent(team.getEventId(), team.getId());

            return HomeController.toJson("success");
        }
    }

    @GetMapping("/teams-by-event")
    public String teamsByEvent(@RequestParam (name="eventID", required=true) int eventID){
        List<Team> teams = teamRepository.teamsByEvent(eventID);

        for(Team team : teams){
            team.setUsers(userRepository.usersByTeam(team.getId()));
        }

        return HomeController.toJson(teams);
    }
}
