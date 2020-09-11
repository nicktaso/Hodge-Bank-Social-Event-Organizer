CREATE TABLE team_user ( 
team_id int NOT NULL, 
user_id int NOT NULL, 
foreign key (team_id) references teams(id), 
foreign key (user_id) references users(id), 
primary key (team_id,user_id));
