-- Sub-City Letter Tracking System - Database Initialization Script
-- SQL Server Database Creation

-- Create Database
IF NOT EXISTS (SELECT name FROM sys.databases WHERE name = 'SubCityLetterSystem')
BEGIN
    CREATE DATABASE SubCityLetterSystem;
END
GO

USE SubCityLetterSystem;
GO

-- Organizations table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Organizations')
BEGIN
    CREATE TABLE Organizations (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NULL,
        Code NVARCHAR(50) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT UQ_Organizations_Code UNIQUE (Code)
    );
END
GO

-- Departments table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Departments')
BEGIN
    CREATE TABLE Departments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NULL,
        Code NVARCHAR(50) NULL,
        OrganizationId INT NOT NULL,
        ParentDepartmentId INT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Departments_Organization FOREIGN KEY (OrganizationId) REFERENCES Organizations(Id),
        CONSTRAINT FK_Departments_Parent FOREIGN KEY (ParentDepartmentId) REFERENCES Departments(Id),
        CONSTRAINT UQ_Departments_Code UNIQUE (Code)
    );
END
GO

-- Users table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Users')
BEGIN
    CREATE TABLE Users (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(100) NOT NULL,
        Email NVARCHAR(100) NOT NULL,
        Username NVARCHAR(100) NOT NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        PhoneNumber NVARCHAR(20) NULL,
        Role NVARCHAR(50) NOT NULL,
        OrganizationId INT NULL,
        DepartmentId INT NULL,
        Address NVARCHAR(500) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        LastLoginAt DATETIME2 NULL,
        CONSTRAINT UQ_Users_Username UNIQUE (Username),
        CONSTRAINT UQ_Users_Email UNIQUE (Email),
        CONSTRAINT FK_Users_Organization FOREIGN KEY (OrganizationId) REFERENCES Organizations(Id),
        CONSTRAINT FK_Users_Department FOREIGN KEY (DepartmentId) REFERENCES Departments(Id),
        CONSTRAINT CK_Users_Role CHECK (Role IN ('SystemAdministrator', 'SubCityAdministrator', 'PoliceAdministrator', 'DepartmentOfficer', 'Clerk', 'ReadOnlyUser'))
    );
END
GO

-- Letters table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Letters')
BEGIN
    CREATE TABLE Letters (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        LetterNumber NVARCHAR(50) NOT NULL,
        Subject NVARCHAR(500) NOT NULL,
        Body NVARCHAR(MAX) NOT NULL,
        Priority NVARCHAR(20) NOT NULL DEFAULT 'Normal',
        Status NVARCHAR(20) NOT NULL DEFAULT 'Draft',
        SenderId INT NOT NULL,
        SenderDepartmentId INT NULL,
        ReceiverId INT NULL,
        ReceiverDepartmentId INT NULL,
        CitizenName NVARCHAR(200) NULL,
        CaseNumber NVARCHAR(50) NULL,
        DueDate DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        SentAt DATETIME2 NULL,
        ReceivedAt DATETIME2 NULL,
        ClosedAt DATETIME2 NULL,
        CreatedById INT NOT NULL,
        ApprovedById INT NULL,
        RejectionReason NVARCHAR(1000) NULL,
        IsIncoming BIT NOT NULL DEFAULT 0,
        IsDeleted BIT NOT NULL DEFAULT 0,
        CONSTRAINT UQ_Letters_Number UNIQUE (LetterNumber),
        CONSTRAINT FK_Letters_Sender FOREIGN KEY (SenderId) REFERENCES Users(Id),
        CONSTRAINT FK_Letters_Receiver FOREIGN KEY (ReceiverId) REFERENCES Users(Id),
        CONSTRAINT FK_Letters_SenderDept FOREIGN KEY (SenderDepartmentId) REFERENCES Departments(Id),
        CONSTRAINT FK_Letters_ReceiverDept FOREIGN KEY (ReceiverDepartmentId) REFERENCES Departments(Id),
        CONSTRAINT FK_Letters_CreatedBy FOREIGN KEY (CreatedById) REFERENCES Users(Id),
        CONSTRAINT FK_Letters_ApprovedBy FOREIGN KEY (ApprovedById) REFERENCES Users(Id),
        CONSTRAINT CK_Letters_Priority CHECK (Priority IN ('Low', 'Normal', 'High', 'Urgent')),
        CONSTRAINT CK_Letters_Status CHECK (Status IN ('Draft', 'Submitted', 'Approved', 'Sent', 'Received', 'Closed', 'Rejected'))
    );
END
GO

-- LetterAttachments table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LetterAttachments')
BEGIN
    CREATE TABLE LetterAttachments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        LetterId INT NOT NULL,
        FileName NVARCHAR(500) NOT NULL,
        FilePath NVARCHAR(500) NOT NULL,
        ContentType NVARCHAR(100) NULL,
        FileSize BIGINT NOT NULL,
        UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UploadedById INT NOT NULL,
        CONSTRAINT FK_Attachments_Letter FOREIGN KEY (LetterId) REFERENCES Letters(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Attachments_UploadedBy FOREIGN KEY (UploadedById) REFERENCES Users(Id)
    );
END
GO

-- LetterMovements table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LetterMovements')
BEGIN
    CREATE TABLE LetterMovements (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        LetterId INT NOT NULL,
        FromUserId INT NOT NULL,
        ToUserId INT NULL,
        FromDepartmentId INT NULL,
        ToDepartmentId INT NULL,
        Action NVARCHAR(50) NOT NULL,
        Notes NVARCHAR(1000) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Movements_Letter FOREIGN KEY (LetterId) REFERENCES Letters(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Movements_FromUser FOREIGN KEY (FromUserId) REFERENCES Users(Id),
        CONSTRAINT FK_Movements_ToUser FOREIGN KEY (ToUserId) REFERENCES Users(Id)
    );
END
GO

-- LetterComments table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'LetterComments')
BEGIN
    CREATE TABLE LetterComments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        LetterId INT NOT NULL,
        UserId INT NOT NULL,
        Comment NVARCHAR(MAX) NOT NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Comments_Letter FOREIGN KEY (LetterId) REFERENCES Letters(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Comments_User FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
END
GO

-- Notifications table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Notifications')
BEGIN
    CREATE TABLE Notifications (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NOT NULL,
        Title NVARCHAR(500) NOT NULL,
        Message NVARCHAR(2000) NULL,
        Type NVARCHAR(20) NOT NULL DEFAULT 'Dashboard',
        ReferenceId INT NULL,
        ReferenceType NVARCHAR(50) NULL,
        IsRead BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        ReadAt DATETIME2 NULL,
        CONSTRAINT FK_Notifications_User FOREIGN KEY (UserId) REFERENCES Users(Id) ON DELETE CASCADE,
        CONSTRAINT CK_Notifications_Type CHECK (Type IN ('Dashboard', 'Email', 'SMS'))
    );
END
GO

-- AuditLogs table
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'AuditLogs')
BEGIN
    CREATE TABLE AuditLogs (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        UserId INT NULL,
        Action NVARCHAR(100) NOT NULL,
        EntityType NVARCHAR(100) NOT NULL,
        EntityId INT NULL,
        OldValues NVARCHAR(MAX) NULL,
        NewValues NVARCHAR(MAX) NULL,
        IpAddress NVARCHAR(500) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_AuditLogs_User FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
END
GO

-- Indexes
CREATE INDEX IX_Letters_LetterNumber ON Letters(LetterNumber);
CREATE INDEX IX_Letters_Status ON Letters(Status);
CREATE INDEX IX_Letters_Priority ON Letters(Priority);
CREATE INDEX IX_Letters_SenderId ON Letters(SenderId);
CREATE INDEX IX_Letters_ReceiverId ON Letters(ReceiverId);
CREATE INDEX IX_Letters_CreatedAt ON Letters(CreatedAt);
CREATE INDEX IX_Letters_DueDate ON Letters(DueDate);
CREATE INDEX IX_Letters_IsIncoming ON Letters(IsIncoming);
CREATE INDEX IX_Letters_IsDeleted ON Letters(IsDeleted);
CREATE INDEX IX_Letters_SenderDepartmentId ON Letters(SenderDepartmentId);
CREATE INDEX IX_Letters_ReceiverDepartmentId ON Letters(ReceiverDepartmentId);
CREATE INDEX IX_Letters_CitizenName ON Letters(CitizenName);
CREATE INDEX IX_Letters_CaseNumber ON Letters(CaseNumber);
CREATE INDEX IX_LetterMovements_LetterId ON LetterMovements(LetterId);
CREATE INDEX IX_Notifications_UserId ON Notifications(UserId);
CREATE INDEX IX_Notifications_IsRead ON Notifications(IsRead);
CREATE INDEX IX_AuditLogs_EntityType ON AuditLogs(EntityType);
CREATE INDEX IX_AuditLogs_CreatedAt ON AuditLogs(CreatedAt);
GO

PRINT 'Sub-City Letter Tracking System database initialized successfully.';
GO
