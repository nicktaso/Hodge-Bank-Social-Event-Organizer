CREATE TABLE event_team ( 
event_id int NOT NULL, 
team_id int NOT NULL, 
foreign key (event_id) references events(id), 
foreign key (team_id) references teams(id), 
primary key (event_id,team_id))
ENGINE=InnoDB DEFAULT CHARSET=latin1
