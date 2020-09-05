CREATE DATABASE VitaPrayer;

USE VitaPrayer

CREATE TABLE Participants (
    ParticipantID VARCHAR(30) NOT NULL,
    FirstName VARCHAR(30),
    LastName VARCHAR(30),
    Parent1 VARCHAR(30),
    Parent2 VARCHAR(30),
    Spouse VARCHAR(30),
    DateOfBirth DATE,
    Relationship VARCHAR(30),
    Hobbies VARCHAR(50),
    Occupation VARCHAR(30),
    PasswordHash VARCHAR(255) NOT NULL,
    PRIMARY KEY (ParticipantID),
    FOREIGN KEY (Parent1) REFERENCES Participants(ParticipantID),
    FOREIGN KEY (Parent2) REFERENCES Participants(ParticipantID),
    FOREIGN KEY (Spouse) REFERENCES Participants(ParticipantID)
);

CREATE TABLE Administrators (
    AdminID VARCHAR(30) NOT NULL,
    FirstName VARCHAR(30),
    LastName VARCHAR(30),
    PasswordHash VARCHAR(255),
    PRIMARY KEY (AdminID,PasswordHash)
);

CREATE TABLE PrayerRequests (
    RequestID INT(15) NOT NULL AUTO_INCREMENT,
    ParticipantID VARCHAR(30) NOT NULL,
    Timestamp TIMESTAMP NOT NULL,
    Title VARCHAR(30) NOT NULL,
    PrayerText VARCHAR(5000) NOT NULL,
    StartDate DATE,
    Frequency INT,
    Resolved BOOLEAN,
    PRIMARY KEY (RequestID)
);

CREATE TABLE Tags (
    TagID INT(5) NOT NULL AUTO_INCREMENT,
    Title VARCHAR(30) NOT NULL,
    Description VARCHAR(100) NOT NULL,
    PRIMARY KEY (TagID)
);

CREATE TABLE PrayerRequestsTags (
    RequestID INT(15) NOT NULL,
    TagID INT(5) NOT NULL,
    PRIMARY KEY (RequestID,TagID),
    FOREIGN KEY (RequestID) REFERENCES PrayerRequests(RequestID),
    FOREIGN KEY (TagID) REFERENCES Tags(TagID)
);

CREATE TABLE JournalEntries (
    EntryID INT(15) NOT NULL AUTO_INCREMENT,
    ParticipantID VARCHAR(30) NOT NULL,
    Timestamp TIMESTAMP NOT NULL,
    Title VARCHAR(30) NOT NULL,
    EntryText VARCHAR(10000) NOT NULL,
    PRIMARY KEY (EntryID),
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ParticipantID)
);

CREATE TABLE JournalEntriesTags (
    EntryID INT(15) NOT NULL,
    TagID INT(5) NOT NULL,
    PRIMARY KEY (EntryID,TagID),
    FOREIGN KEY (EntryID) REFERENCES JournalEntries(EntryID),
    FOREIGN KEY (TagID) REFERENCES Tags(TagID)
);

CREATE TABLE Groups (
    GroupID INT(15) NOT NULL,
    OwnerID VARCHAR(30),
    GroupName VARCHAR(30) NOT NULL,
    Description VARCHAR(500),
    PRIMARY KEY (GroupID),
    FOREIGN KEY (OwnerID) REFERENCES Participants(ParticipantID)
);

CREATE TABLE ParticipantsGroups (
      ParticipantID VARCHAR(30) NOT NULL,
      GroupID INT(15) NOT NULL,
      PRIMARY KEY (ParticipantID, GroupID),
      FOREIGN KEY (ParticipantID) REFERENCES Participants(ParticipantID),
      FOREIGN KEY (GroupID) REFERENCES Groups(GroupID)
);

CREATE TABLE ContentCycles (
    CycleID INT(15) NOT NULL AUTO_INCREMENT,
    Title VARCHAR(30) NOT NULL,
    PRIMARY KEY (CycleID)
);

CREATE TABLE ParticipantsCycles (
    CycleID INT(15) NOT NULL,
    ParticipantID VARCHAR(30) NOT NULL,
    Completed BOOLEAN NOT NULL,
    PRIMARY KEY (CycleID,ParticipantID),
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ParticipantID),
    FOREIGN KEY (CycleID) REFERENCES ContentCycles(CycleID)
);

CREATE TABLE Chats (
    ChatID INT(15) NOT NULL AUTO_INCREMENT,
    ParticipantID1 VARCHAR(30),
    ParticipantID2 VARCHAR(30),
    GroupID INT(15),
    PRIMARY KEY (ChatID),
    FOREIGN KEY (ParticipantID1) REFERENCES Participants(ParticipantID),
    FOREIGN KEY (ParticipantID2) REFERENCES Participants(ParticipantID),
    FOREIGN KEY (GroupID) REFERENCES Groups(GroupID)
);

CREATE TABLE Messages (
    ChatID INT(15) NOT NULL AUTO_INCREMENT,
    ParticipantID VARCHAR(30) NOT NULL,
    Timestamp TIMESTAMP NOT NULL,
    MessageText VARCHAR(2000),
    PRIMARY KEY (ChatID,ParticipantID,Timestamp),
    FOREIGN KEY (ChatID) REFERENCES Chats(ChatID),
    FOREIGN KEY (ParticipantID) REFERENCES Participants(ParticipantID)
);

CREATE TABLE ContentInCycles (
    CycleID INT(15) NOT NULL,
    Position INT(15) NOT NULL,
    Text VARCHAR(500) NOT NULL,
    PRIMARY KEY (CycleID, Position),
    FOREIGN KEY (CycleID) REFERENCES ContentCycles(CycleID)
);
