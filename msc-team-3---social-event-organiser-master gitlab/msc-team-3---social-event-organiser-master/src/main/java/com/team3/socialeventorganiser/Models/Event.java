package com.team3.socialeventorganiser.Models;

import java.time.LocalDateTime;

public class Event {
    private int id;
    private int ownerId;
    private String title;
    private String description;
    private String location;
    private LocalDateTime dateAndTime;
    private String category;
    private String type;
    //Limits the number of all the people on the event
    private int maxCapacity;
    //Team must have a fixed size, less or more people are not accepted
    private int teamSize;

    public Event(){
        
    }
    //Events for individuals
    public Event(int id, int ownerId, String title, String description, String location, LocalDateTime dateAndTime, String category, String type, int maxCapacity) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.dateAndTime = dateAndTime;
        this.category = category;
        this.type = type;
        this.maxCapacity = maxCapacity;
    }

    //Event to be added to database
    public Event(int ownerId, String title, String description, String location, LocalDateTime dateAndTime, String category, String type, int maxCapacity, int teamSize) {
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.dateAndTime = dateAndTime;
        this.category = category;
        this.type = type;
        this.maxCapacity = maxCapacity;
        this.teamSize = teamSize;
    }

    //Events for teams
    public Event(int id, int ownerId, String title, String description, String location, LocalDateTime dateAndTime, String category, String type, int maxCapacity, int teamSize) {
        this.id = id;
        this.ownerId = ownerId;
        this.title = title;
        this.description = description;
        this.location = location;
        this.dateAndTime = dateAndTime;
        this.category = category;
        this.type = type;
        this.maxCapacity = maxCapacity;
        this.teamSize = teamSize;
    }

    public int getId() {
        return id;
    }

    public int getOwnerId() { return ownerId; }

    public String getTitle() {
        return title;
    }

    public String getDescription() { return description; }

    public String getLocation() {
        return location;
    }

    public LocalDateTime getDateAndTime() {
        return dateAndTime;
    }

    public String getCategory() {
        return category;
    }

    public String getType() {
        return type;
    }

    public int getMaxCapacity() {
        return maxCapacity;
    }

    public int getTeamSize() {
        return teamSize;
    }
}
