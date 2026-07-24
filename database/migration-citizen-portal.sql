USE SubCityLetterSystem;
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Complaints')
BEGIN
    CREATE TABLE Complaints (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CitizenId INT NOT NULL,
        Subject NVARCHAR(200) NOT NULL,
        Description NVARCHAR(MAX) NOT NULL,
        Category NVARCHAR(50) NOT NULL DEFAULT 'General',
        Priority NVARCHAR(50) NOT NULL DEFAULT 'Normal',
        Status NVARCHAR(50) NOT NULL DEFAULT 'Open',
        AssignedToUserId INT NULL,
        Resolution NVARCHAR(1000) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        ResolvedAt DATETIME2 NULL,
        IsDeleted BIT NOT NULL DEFAULT 0,
        CONSTRAINT FK_Complaints_Citizen FOREIGN KEY (CitizenId) REFERENCES Citizens(Id),
        CONSTRAINT FK_Complaints_AssignedUser FOREIGN KEY (AssignedToUserId) REFERENCES Users(Id)
    );
    CREATE INDEX IX_Complaints_CitizenId ON Complaints(CitizenId);
    CREATE INDEX IX_Complaints_Status ON Complaints(Status);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ComplaintComments')
BEGIN
    CREATE TABLE ComplaintComments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ComplaintId INT NOT NULL,
        UserId INT NULL,
        CitizenId INT NULL,
        Comment NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_ComplaintComments_Complaint FOREIGN KEY (ComplaintId) REFERENCES Complaints(Id) ON DELETE CASCADE,
        CONSTRAINT FK_ComplaintComments_User FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
    CREATE INDEX IX_ComplaintComments_ComplaintId ON ComplaintComments(ComplaintId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Feedbacks')
BEGIN
    CREATE TABLE Feedbacks (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CitizenId INT NOT NULL,
        ApplicationId INT NULL,
        Type NVARCHAR(50) NOT NULL DEFAULT 'ServiceRating',
        Rating INT NOT NULL DEFAULT 5,
        Subject NVARCHAR(500) NULL,
        Message NVARCHAR(2000) NULL,
        IsPublic BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Feedbacks_Citizen FOREIGN KEY (CitizenId) REFERENCES Citizens(Id),
        CONSTRAINT FK_Feedbacks_Application FOREIGN KEY (ApplicationId) REFERENCES Applications(Id)
    );
    CREATE INDEX IX_Feedbacks_CitizenId ON Feedbacks(CitizenId);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Appointments')
BEGIN
    CREATE TABLE Appointments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CitizenId INT NOT NULL,
        ApplicationId INT NULL,
        ServiceName NVARCHAR(200) NOT NULL,
        DepartmentId INT NULL,
        AppointmentDate DATETIME2 NOT NULL,
        TimeSlot NVARCHAR(20) NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Scheduled',
        Notes NVARCHAR(500) NULL,
        CancellationReason NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CompletedAt DATETIME2 NULL,
        CONSTRAINT FK_Appointments_Citizen FOREIGN KEY (CitizenId) REFERENCES Citizens(Id),
        CONSTRAINT FK_Appointments_Application FOREIGN KEY (ApplicationId) REFERENCES Applications(Id),
        CONSTRAINT FK_Appointments_Department FOREIGN KEY (DepartmentId) REFERENCES Departments(Id)
    );
    CREATE INDEX IX_Appointments_CitizenId ON Appointments(CitizenId);
    CREATE INDEX IX_Appointments_Date ON Appointments(AppointmentDate);
END
GO

IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'SystemNotifications')
BEGIN
    CREATE TABLE SystemNotifications (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        CitizenId INT NOT NULL,
        Title NVARCHAR(200) NOT NULL,
        Message NVARCHAR(1000) NULL,
        Type NVARCHAR(50) NOT NULL DEFAULT 'Info',
        ApplicationId INT NULL,
        ReferenceType NVARCHAR(50) NULL,
        ReferenceId INT NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        ReadAt DATETIME2 NULL,
        CONSTRAINT FK_SystemNotifications_Citizen FOREIGN KEY (CitizenId) REFERENCES Citizens(Id) ON DELETE CASCADE
    );
    CREATE INDEX IX_SystemNotifications_CitizenId ON SystemNotifications(CitizenId);
    CREATE INDEX IX_SystemNotifications_IsRead ON SystemNotifications(IsRead);
END
GO

PRINT 'Citizen portal tables created successfully.';
GO
