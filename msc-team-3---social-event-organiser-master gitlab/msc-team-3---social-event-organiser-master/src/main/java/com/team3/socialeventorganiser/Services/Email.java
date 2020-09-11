package com.team3.socialeventorganiser.Services;

import com.team3.socialeventorganiser.Models.User;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;

import java.util.List;


public class Email {

    private SimpleMailMessage mailMessage = new SimpleMailMessage();
    private List<User> users;
    private int eventId;

    public Email(int eventId,List<User> users) {
        this.users = users;
        this.eventId = eventId;
    }


    public void onUpdate(JavaMailSender javaMailSender) {

        for (User user : users) {
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Event Updated");
            mailMessage.setText("View changes here http://localhost:8080/event?eventID=" + eventId);
            javaMailSender.send(mailMessage);
        }
    }

    public void onInvite(JavaMailSender javaMailSender) {

        for (User user : users) {
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("You are invited!");
            mailMessage.setText("View event page here http://localhost:8080/event?eventID=" + eventId);
            javaMailSender.send(mailMessage);

        }
    }

    public void onTeamCreation(JavaMailSender javaMailSender){

        for(User user: users){
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("You have been added to a team!");
            mailMessage.setText("See who is going with you to the event  http://localhost:8080/event?eventID="+eventId);
            javaMailSender.send(mailMessage);
        }
    }

    public void onEventRemoval(JavaMailSender javaMailSender){

        for(User user: users) {
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Event is Cancelled");
            mailMessage.setText("An event you are going to is cancelled http://localhost:8080/event?eventID="+eventId);
            javaMailSender.send(mailMessage);
        }
    }

    public void onReminder(JavaMailSender javaMailSender){

        for(User user: users) {
            mailMessage.setTo(user.getEmail());
            mailMessage.setSubject("Ready for an event? It's tomorrow!");
            mailMessage.setText("An event you are going to is tomorrow! http://localhost:8080/event?eventID="+eventId);
            javaMailSender.send(mailMessage);
        }
    }

}

