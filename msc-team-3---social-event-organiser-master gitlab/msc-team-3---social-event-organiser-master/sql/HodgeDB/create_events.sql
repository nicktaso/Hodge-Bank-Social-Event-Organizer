CREATE TABLE events (
  id int(11) NOT NULL AUTO_INCREMENT,
  owner_id int(11) NOT NULL,
  title varchar(70) NOT NULL,
  description text DEFAULT NULL,
  location varchar(100) NOT NULL,
  date_and_time DATETIME NOT NULL DEFAULT NOW(),
  category varchar(50) NOT NULL,
  event_type varchar(50) NOT NULL,
  max_capacity int(11) NOT NULL,
  team_size int(11) DEFAULT NULL,
  PRIMARY KEY (id),
  KEY owner_id (owner_id),
  CONSTRAINT event_owner FOREIGN KEY (owner_id) REFERENCES users (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1