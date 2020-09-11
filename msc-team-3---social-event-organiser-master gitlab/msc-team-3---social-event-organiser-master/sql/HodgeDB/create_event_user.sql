CREATE TABLE event_user (
  event_id int(11) NOT NULL,
  user_id int(11) NOT NULL,
  status int(11) NOT NULL,
  PRIMARY KEY (event_id,user_id),  
  CONSTRAINT event_user_event_id FOREIGN KEY (event_id) REFERENCES events (id) ON DELETE CASCADE,
  CONSTRAINT event_user_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=latin1