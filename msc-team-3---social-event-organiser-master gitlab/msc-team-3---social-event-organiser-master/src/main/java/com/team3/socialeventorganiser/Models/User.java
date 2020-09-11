package com.team3.socialeventorganiser.Models;

public class User {
    private int id;
    private String email;
    private String firstName;
    private String lastName;

    public User(int id, String email, String firstName, String lastName) {
        this.id = id;
        this.email = email;
        this.firstName = firstName;
        this.lastName = lastName;
    }

    //This default constructor is used for the ajax request
    public User(){

    }

    public int getId() {
        return id;
    }

    public String getEmail() {
        return email;
    }

    public String getFirstName() {
        return firstName;
    }

    public String getLastName() {
        return lastName;
    }
}
