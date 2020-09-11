CREATE TABLE users (
  id int(11) NOT NULL AUTO_INCREMENT,
  email varchar(70) NOT NULL,
  first_name varchar(50) NOT NULL,
  last_name varchar(50) NOT NULL,
  PRIMARY KEY (id)
) ENGINE=InnoDB DEFAULT CHARSET=latin1