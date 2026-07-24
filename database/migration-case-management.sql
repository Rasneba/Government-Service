-- Case Management System - Database Migration
-- Adds 9 new tables for citizen services, applications, workflows

USE SubCityLetterSystem;
GO

-- Citizens table (separate from staff Users)
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Citizens')
BEGIN
    CREATE TABLE Citizens (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        FullName NVARCHAR(200) NOT NULL,
        PhoneNumber NVARCHAR(20) NOT NULL,
        Email NVARCHAR(100) NULL,
        NationalId NVARCHAR(50) NULL,
        PasswordHash NVARCHAR(MAX) NOT NULL,
        DateOfBirth DATETIME2 NULL,
        Gender NVARCHAR(20) NULL,
        Address NVARCHAR(500) NULL,
        IsVerified BIT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        LastLoginAt DATETIME2 NULL,
        CONSTRAINT UQ_Citizens_PhoneNumber UNIQUE (PhoneNumber),
        CONSTRAINT UQ_Citizens_Email UNIQUE (Email),
        CONSTRAINT UQ_Citizens_NationalId UNIQUE (NationalId)
    );
    CREATE INDEX IX_Citizens_PhoneNumber ON Citizens(PhoneNumber);
END
GO

-- Service Categories
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ServiceCategories')
BEGIN
    CREATE TABLE ServiceCategories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NULL,
        Icon NVARCHAR(50) NULL,
        DisplayOrder INT NOT NULL DEFAULT 0,
        IsActive BIT NOT NULL DEFAULT 1,
        CONSTRAINT UQ_ServiceCategories_Name UNIQUE (Name)
    );
END
GO

-- Service Types
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ServiceTypes')
BEGIN
    CREATE TABLE ServiceTypes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(1000) NULL,
        CategoryId INT NULL,
        Code NVARCHAR(50) NOT NULL,
        EstimatedDays INT NULL,
        Fee DECIMAL(18,2) NOT NULL DEFAULT 0,
        RequiresPoliceVerification BIT NOT NULL DEFAULT 0,
        RequiredDocuments NVARCHAR(2000) NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        UpdatedAt DATETIME2 NULL,
        CONSTRAINT UQ_ServiceTypes_Code UNIQUE (Code),
        CONSTRAINT FK_ServiceTypes_Category FOREIGN KEY (CategoryId) REFERENCES ServiceCategories(Id) ON DELETE SET NULL
    );
    CREATE INDEX IX_ServiceTypes_CategoryId ON ServiceTypes(CategoryId);
END
GO

-- Workflow Definitions
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WorkflowDefinitions')
BEGIN
    CREATE TABLE WorkflowDefinitions (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NULL,
        ServiceTypeId INT NOT NULL,
        IsActive BIT NOT NULL DEFAULT 1,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_WorkflowDefinitions_ServiceType FOREIGN KEY (ServiceTypeId) REFERENCES ServiceTypes(Id) ON DELETE CASCADE
    );
    CREATE INDEX IX_WorkflowDefinitions_ServiceTypeId ON WorkflowDefinitions(ServiceTypeId);
END
GO

-- Workflow Steps
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'WorkflowSteps')
BEGIN
    CREATE TABLE WorkflowSteps (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        Name NVARCHAR(200) NOT NULL,
        Description NVARCHAR(500) NULL,
        StepOrder INT NOT NULL,
        StepType NVARCHAR(50) NOT NULL,
        AssignedRole NVARCHAR(50) NULL,
        AssignedDepartmentId INT NULL,
        IsAutoStep BIT NOT NULL DEFAULT 0,
        SLAHours INT NULL,
        WorkflowDefinitionId INT NOT NULL,
        CONSTRAINT FK_WorkflowSteps_Definition FOREIGN KEY (WorkflowDefinitionId) REFERENCES WorkflowDefinitions(Id) ON DELETE CASCADE
    );
    CREATE INDEX IX_WorkflowSteps_WorkflowDefinitionId ON WorkflowSteps(WorkflowDefinitionId);
END
GO

-- Applications
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'Applications')
BEGIN
    CREATE TABLE Applications (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ApplicationNumber NVARCHAR(50) NOT NULL,
        ServiceTypeId INT NOT NULL,
        CitizenId INT NOT NULL,
        Subject NVARCHAR(500) NOT NULL,
        Description NVARCHAR(2000) NULL,
        Priority NVARCHAR(20) NOT NULL DEFAULT 'Normal',
        FeeAmount DECIMAL(18,2) NOT NULL DEFAULT 0,
        FeePaid BIT NOT NULL DEFAULT 0,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Draft',
        CurrentStepId INT NULL,
        AssignedOfficerId INT NULL,
        RejectionReason NVARCHAR(1000) NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        SubmittedAt DATETIME2 NULL,
        DueDate DATETIME2 NULL,
        CompletedAt DATETIME2 NULL,
        IsDeleted BIT NOT NULL DEFAULT 0,
        CONSTRAINT UQ_Applications_Number UNIQUE (ApplicationNumber),
        CONSTRAINT FK_Applications_ServiceType FOREIGN KEY (ServiceTypeId) REFERENCES ServiceTypes(Id),
        CONSTRAINT FK_Applications_Citizen FOREIGN KEY (CitizenId) REFERENCES Citizens(Id),
        CONSTRAINT FK_Applications_CurrentStep FOREIGN KEY (CurrentStepId) REFERENCES WorkflowSteps(Id),
        CONSTRAINT FK_Applications_AssignedOfficer FOREIGN KEY (AssignedOfficerId) REFERENCES Users(Id)
    );
    CREATE INDEX IX_Applications_CitizenId ON Applications(CitizenId);
    CREATE INDEX IX_Applications_ServiceTypeId ON Applications(ServiceTypeId);
    CREATE INDEX IX_Applications_Status ON Applications(Status);
    CREATE INDEX IX_Applications_AssignedOfficerId ON Applications(AssignedOfficerId);
    CREATE INDEX IX_Applications_CreatedAt ON Applications(CreatedAt);
END
GO

-- Application Step History
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ApplicationStepHistories')
BEGIN
    CREATE TABLE ApplicationStepHistories (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ApplicationId INT NOT NULL,
        WorkflowStepId INT NOT NULL,
        Status NVARCHAR(50) NOT NULL DEFAULT 'Pending',
        AssignedToUserId INT NULL,
        Notes NVARCHAR(1000) NULL,
        StartedAt DATETIME2 NULL,
        CompletedAt DATETIME2 NULL,
        DueAt DATETIME2 NULL,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_StepHistory_Application FOREIGN KEY (ApplicationId) REFERENCES Applications(Id) ON DELETE CASCADE,
        CONSTRAINT FK_StepHistory_WorkflowStep FOREIGN KEY (WorkflowStepId) REFERENCES WorkflowSteps(Id),
        CONSTRAINT FK_StepHistory_AssignedUser FOREIGN KEY (AssignedToUserId) REFERENCES Users(Id)
    );
    CREATE INDEX IX_StepHistory_ApplicationId ON ApplicationStepHistories(ApplicationId);
    CREATE INDEX IX_StepHistory_WorkflowStepId ON ApplicationStepHistories(WorkflowStepId);
END
GO

-- Application Documents
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ApplicationDocuments')
BEGIN
    CREATE TABLE ApplicationDocuments (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ApplicationId INT NOT NULL,
        DocumentType NVARCHAR(100) NOT NULL,
        FileName NVARCHAR(500) NOT NULL,
        FilePath NVARCHAR(500) NULL,
        FileSize BIGINT NOT NULL DEFAULT 0,
        IsVerified BIT NOT NULL DEFAULT 0,
        Version INT NOT NULL DEFAULT 1,
        IsDeleted BIT NOT NULL DEFAULT 0,
        UploadedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Documents_Application FOREIGN KEY (ApplicationId) REFERENCES Applications(Id) ON DELETE CASCADE
    );
    CREATE INDEX IX_Documents_ApplicationId ON ApplicationDocuments(ApplicationId);
END
GO

-- Application Notes
IF NOT EXISTS (SELECT * FROM sys.tables WHERE name = 'ApplicationNotes')
BEGIN
    CREATE TABLE ApplicationNotes (
        Id INT IDENTITY(1,1) PRIMARY KEY,
        ApplicationId INT NOT NULL,
        UserId INT NULL,
        CitizenId INT NULL,
        Note NVARCHAR(MAX) NOT NULL,
        IsInternal BIT NOT NULL DEFAULT 0,
        CreatedAt DATETIME2 NOT NULL DEFAULT GETUTCDATE(),
        CONSTRAINT FK_Notes_Application FOREIGN KEY (ApplicationId) REFERENCES Applications(Id) ON DELETE CASCADE,
        CONSTRAINT FK_Notes_User FOREIGN KEY (UserId) REFERENCES Users(Id)
    );
    CREATE INDEX IX_Notes_ApplicationId ON ApplicationNotes(ApplicationId);
END
GO

-- Seed Service Categories
IF NOT EXISTS (SELECT * FROM ServiceCategories WHERE Name = 'Civil Documents')
BEGIN
    SET IDENTITY_INSERT ServiceCategories ON;
    INSERT INTO ServiceCategories (Id, Name, Description, Icon, DisplayOrder, IsActive) VALUES
    (1, N'Civil Documents', N'Birth certificates, marriage certificates, family records', 'file-text', 1, 1),
    (2, N'Business Services', N'Business licenses, trade permits, commercial registrations', 'briefcase', 2, 1),
    (3, N'Land & Property', N'Land ownership, property registration, building permits', 'map-pin', 3, 1),
    (4, N'Police Services', N'Background checks, police clearance, lost property reports', 'shield', 4, 1),
    (5, N'Social Services', N'Social assistance, pension, disability support', 'heart', 5, 1);
    SET IDENTITY_INSERT ServiceCategories OFF;
END
GO

-- Seed Service Types
IF NOT EXISTS (SELECT * FROM ServiceTypes WHERE Code = 'BC')
BEGIN
    SET IDENTITY_INSERT ServiceTypes ON;
    INSERT INTO ServiceTypes (Id, Name, Description, CategoryId, Code, EstimatedDays, Fee, RequiresPoliceVerification, RequiredDocuments, IsActive) VALUES
    (1, N'Birth Certificate', N'Official birth certificate issuance', 1, 'BC', 3, 50.00, 0, N'["National ID of parent","Hospital birth record"]', 1),
    (2, N'Marriage Certificate', N'Official marriage certificate issuance', 1, 'MC', 3, 75.00, 0, N'["National IDs of both spouses","Marriage invitation letter"]', 1),
    (3, N'Business License', N'New business license application', 2, 'BL', 7, 500.00, 1, N'["National ID","Business plan","Tax registration"]', 1),
    (4, N'Trade Permit', N'Trade and commerce permit', 2, 'TP', 5, 200.00, 0, N'["National ID","Business registration"]', 1),
    (5, N'Land Ownership Certificate', N'Certificate of land ownership', 3, 'LOC', 14, 1000.00, 1, N'["National ID","Land survey document","Tax clearance"]', 1),
    (6, N'Building Permit', N'Construction building permit', 3, 'BP', 10, 750.00, 0, N'["National ID","Architectural plans","Land ownership proof"]', 1),
    (7, N'Police Clearance Certificate', N'Certificate of good conduct', 4, 'PCC', 5, 100.00, 0, N'["National ID","Passport photos","Criminal record check"]', 1),
    (8, N'Background Check', N'Employment background verification', 4, 'BG', 7, 150.00, 0, N'["National ID","Employment letter"]', 1),
    (9, N'Social Assistance Application', N'Application for social welfare support', 5, 'SA', 14, 0.00, 0, N'["National ID","Income certificate","Family records"]', 1),
    (10, N'Disability Support Registration', N'Registration for disability benefits', 5, 'DS', 10, 0.00, 0, N'["National ID","Medical certificate","Disability assessment"]', 1),
    (11, N'Family Record Certificate', N'Official family record document', 1, 'FR', 3, 40.00, 0, N'["National ID","Family member IDs"]', 1),
    (12, N'Lost Property Report', N'File a lost property report', 4, 'LP', 1, 25.00, 0, N'["National ID","Property description"]', 1);
    SET IDENTITY_INSERT ServiceTypes OFF;
END
GO

-- Seed Workflow Definitions
IF NOT EXISTS (SELECT * FROM WorkflowDefinitions WHERE ServiceTypeId = 1)
BEGIN
    SET IDENTITY_INSERT WorkflowDefinitions ON;
    INSERT INTO WorkflowDefinitions (Id, Name, Description, ServiceTypeId, IsActive) VALUES
    (1, N'Standard Certificate Workflow', N'Default workflow for certificate requests', 1, 1),
    (2, N'Business License Workflow', N'Workflow requiring police verification', 3, 1),
    (3, N'Land Certificate Workflow', N'Workflow for land and property services', 5, 1);
    SET IDENTITY_INSERT WorkflowDefinitions OFF;
END
GO

-- Seed Workflow Steps for Standard Certificate Workflow (WorkflowDefinitionId = 1)
IF NOT EXISTS (SELECT * FROM WorkflowSteps WHERE WorkflowDefinitionId = 1)
BEGIN
    SET IDENTITY_INSERT WorkflowSteps ON;
    INSERT INTO WorkflowSteps (Id, Name, Description, StepOrder, StepType, AssignedRole, IsAutoStep, SLAHours, WorkflowDefinitionId) VALUES
    (1, N'Submission', N'Citizen submits application', 1, 'Submission', NULL, 0, 1, 1),
    (2, N'Document Verification', N'Clerk verifies submitted documents', 2, 'Verification', 'Clerk', 0, 24, 1),
    (3, N'Officer Review', N'Department officer reviews application', 3, 'Review', 'DepartmentOfficer', 0, 48, 1),
    (4, N'Supervisor Approval', N'Supervisor approves the application', 4, 'Approval', 'SubCityAdministrator', 0, 48, 1),
    (5, N'Certificate Generation', N'System generates the certificate', 5, 'Generation', NULL, 1, 1, 1),
    (6, N'Notification', N'Citizen notified of completion', 6, 'Notification', NULL, 1, 1, 1);
    SET IDENTITY_INSERT WorkflowSteps OFF;
END
GO

-- Seed Workflow Steps for Business License Workflow (WorkflowDefinitionId = 2)
IF NOT EXISTS (SELECT * FROM WorkflowSteps WHERE WorkflowDefinitionId = 2)
BEGIN
    SET IDENTITY_INSERT WorkflowSteps ON;
    INSERT INTO WorkflowSteps (Id, Name, Description, StepOrder, StepType, AssignedRole, IsAutoStep, SLAHours, WorkflowDefinitionId) VALUES
    (7, N'Submission', N'Applicant submits business license request', 1, 'Submission', NULL, 0, 1, 2),
    (8, N'Document Verification', N'Clerk verifies business documents', 2, 'Verification', 'Clerk', 0, 24, 2),
    (9, N'Police Verification', N'Police background check', 3, 'Investigation', 'PoliceAdministrator', 0, 120, 2),
    (10, N'Officer Review', N'Department officer reviews application', 4, 'Review', 'DepartmentOfficer', 0, 48, 2),
    (11, N'Supervisor Approval', N'Supervisor final approval', 5, 'Approval', 'SubCityAdministrator', 0, 48, 2),
    (12, N'License Generation', N'System generates the license', 6, 'Generation', NULL, 1, 1, 2),
    (13, N'Notification', N'Applicant notified of completion', 7, 'Notification', NULL, 1, 1, 2);
    SET IDENTITY_INSERT WorkflowSteps OFF;
END
GO

-- Seed Workflow Steps for Land Certificate Workflow (WorkflowDefinitionId = 3)
IF NOT EXISTS (SELECT * FROM WorkflowSteps WHERE WorkflowDefinitionId = 3)
BEGIN
    SET IDENTITY_INSERT WorkflowSteps ON;
    INSERT INTO WorkflowSteps (Id, Name, Description, StepOrder, StepType, AssignedRole, IsAutoStep, SLAHours, WorkflowDefinitionId) VALUES
    (14, N'Submission', N'Citizen submits land certificate request', 1, 'Submission', NULL, 0, 1, 3),
    (15, N'Document Verification', N'Clerk verifies land documents', 2, 'Verification', 'Clerk', 0, 24, 3),
    (16, N'Police Verification', N'Police verification of property', 3, 'Investigation', 'PoliceAdministrator', 0, 120, 3),
    (17, N'Survey Verification', N'Land survey verification', 4, 'Verification', 'DepartmentOfficer', 0, 72, 3),
    (18, N'Officer Review', N'Department officer reviews', 5, 'Review', 'DepartmentOfficer', 0, 48, 3),
    (19, N'Supervisor Approval', N'Supervisor final approval', 6, 'Approval', 'SubCityAdministrator', 0, 48, 3),
    (20, N'Certificate Generation', N'System generates certificate', 7, 'Generation', NULL, 1, 1, 3),
    (21, N'Notification', N'Citizen notified', 8, 'Notification', NULL, 1, 1, 3);
    SET IDENTITY_INSERT WorkflowSteps OFF;
END
GO

PRINT 'Case Management migration completed successfully.';
GO
