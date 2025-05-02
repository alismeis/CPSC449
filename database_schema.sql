CREATE TABLE User (
    user_id INT PRIMARY KEY,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),
    subscription_plan ENUM('Basic', 'Premium'),
    join_date DATETIME
);

CREATE TABLE Profile (
  profile_id INT PRIMARY KEY,
  user_id INT,
  name VARCHAR(255),
  preferences JSON,
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Content (
  content_id INT PRIMARY KEY,
  title VARCHAR(255),
  genre VARCHAR(100),
  releasedate DATE,
  duration INT,
  description TEXT
);

CREATE TABLE WatchHistory (
  history_id INT PRIMARY KEY,
  profile_id INT,
  content_id INT,
  user_id INT,
  timestamp TIMESTAMP,
  progress FLOAT,
  FOREIGN KEY (profile_id) REFERENCES Profile(profile_id),
  FOREIGN KEY (content_id) REFERENCES Content(content_id),
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Ratings (
  rating_id INT PRIMARY KEY,
  content_id INT,
  profile_id INT,
  rating FLOAT,
  review TEXT,
  date DATETIME,
  FOREIGN KEY (content_id) REFERENCES Content(content_id),
  FOREIGN KEY (profile_id) REFERENCES Profile(profile_id)
);

CREATE TABLE Billing (
  billing_id INT PRIMARY KEY,
  user_id INT,
  payment ENUM('Credit', 'Debit', 'Crypto', 'PayPal'),
  subscription ENUM('Weekly', 'Monthly', 'Yearly'),
  expiry_date DATE,
  FOREIGN KEY (user_id) REFERENCES User(user_id)
);

CREATE TABLE Recommendations (
  recommend_id INT PRIMARY KEY,
  profile_id INT,
  list JSON,
  FOREIGN KEY (profile_id) REFERENCES Profile(profile_id)
);

CREATE TABLE Storage (
  storage_id INT PRIMARY KEY,
  content_id INT,
  video_url VARCHAR(255),
  thumbnail_url VARCHAR(255),
  FOREIGN KEY (content_id) REFERENCES Content(content_id)
);