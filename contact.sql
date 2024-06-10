CREATE DATABASE contact;

USE contact;

CREATE TABLE contact_info (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255),
    email VARCHAR(255),
    subject VARCHAR(255),
    message TEXT
);
