package com.team3.socialeventorganiser.Models;

import java.util.List;

public class Team {
    private int id;
    private String name;
    private int eventId;
    private List<User> users;

    public Team(String name, int id){
        this.name = name;
        this.id = id;
    }

    public Team(String name, int eventId, List<User> users){
        this.name = name;
        this.eventId = eventId;
        this.users = users;
    }

    public Team(){

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getEventId() {
        return eventId;
    }

    public void setEventId(int eventId) {
        this.eventId = eventId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<User> getUsers() {
        return users;
    }

    public void setUsers(List<User> users) {
        this.users = users;
    }
}
