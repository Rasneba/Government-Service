-- Update Workflow Steps to match new 8-step citizen service flow
-- Application → Verification → Document Validation → Supervisor Review → Police Verification → Approval → Document Generation → Citizen Notification → Completed

USE SubCityLetterSystem;
GO

-- Delete existing workflow steps
DELETE FROM WorkflowSteps;
DBCC CHECKIDENT ('WorkflowSteps', RESEED, 0);
GO

-- Delete existing workflow definitions
DELETE FROM WorkflowDefinitions;
DBCC CHECKIDENT ('WorkflowDefinitions', RESEED, 0);
GO

-- Standard Certificate Workflow (for all basic services)
SET IDENTITY_INSERT WorkflowDefinitions ON;
INSERT INTO WorkflowDefinitions (Id, Name, Description, ServiceTypeId, IsActive) VALUES
(1, N'Standard Service Workflow', N'Default 8-step workflow for citizen services', 1, 1),
(2, N'Police Required Workflow', N'Workflow with police verification for sensitive services', 3, 1),
(3, N'Fast Track Workflow', N'Simplified workflow for simple document requests', 2, 1);
SET IDENTITY_INSERT WorkflowDefinitions OFF;
GO

-- Standard Certificate Workflow Steps (8 steps)
SET IDENTITY_INSERT WorkflowSteps ON;
INSERT INTO WorkflowSteps (Id, Name, Description, StepOrder, StepType, AssignedRole, IsAutoStep, SLAHours, WorkflowDefinitionId) VALUES
-- Step 1: Application (citizen submits)
(1, N'Application', N'Citizen submits application with required documents', 1, 'Submission', NULL, 0, 1, 1),
-- Step 2: Verification (clerk checks documents)
(2, N'Verification', N'Clerk verifies submitted documents and application details', 2, 'Verification', 'Clerk', 0, 24, 1),
-- Step 3: Document Validation (validate authenticity)
(3, N'Document Validation', N'Validate authenticity and completeness of documents', 3, 'DocumentValidation', 'DepartmentOfficer', 0, 48, 1),
-- Step 4: Supervisor Review
(4, N'Supervisor Review', N'Department head reviews and endorses application', 4, 'SupervisorReview', 'SubCityAdministrator', 0, 48, 1),
-- Step 5: Approval (final decision)
(5, N'Approval', N'Final approval by sub-city administrator', 5, 'Approval', 'SubCityAdministrator', 0, 24, 1),
-- Step 6: Document Generation (auto)
(6, N'Document Generation', N'System generates the official document', 6, 'DocumentGeneration', NULL, 1, 1, 1),
-- Step 7: Citizen Notification (auto)
(7, N'Citizen Notification', N'Citizen is notified that document is ready for pickup', 7, 'Notification', NULL, 1, 1, 1),
-- Step 8: Completed
(8, N'Completed', N'Application process completed', 8, 'Approval', NULL, 1, 1, 1);
SET IDENTITY_INSERT WorkflowSteps OFF;
GO

-- Police Required Workflow Steps (includes police verification)
SET IDENTITY_INSERT WorkflowSteps ON;
INSERT INTO WorkflowSteps (Id, Name, Description, StepOrder, StepType, AssignedRole, IsAutoStep, SLAHours, WorkflowDefinitionId) VALUES
(9,  N'Application', N'Citizen submits application', 1, 'Submission', NULL, 0, 1, 2),
(10, N'Verification', N'Clerk verifies documents', 2, 'Verification', 'Clerk', 0, 24, 2),
(11, N'Document Validation', N'Validate documents', 3, 'DocumentValidation', 'DepartmentOfficer', 0, 48, 2),
(12, N'Police Verification', N'Police background check and investigation', 4, 'PoliceVerification', 'PoliceAdministrator', 0, 120, 2),
(13, N'Supervisor Review', N'Department head reviews', 5, 'SupervisorReview', 'SubCityAdministrator', 0, 48, 2),
(14, N'Approval', N'Final approval', 6, 'Approval', 'SubCityAdministrator', 0, 24, 2),
(15, N'Document Generation', N'Generate official document', 7, 'DocumentGeneration', NULL, 1, 1, 2),
(16, N'Citizen Notification', N'Notify citizen', 8, 'Notification', NULL, 1, 1, 2);
SET IDENTITY_INSERT WorkflowSteps OFF;
GO

-- Fast Track Workflow (simplified)
SET IDENTITY_INSERT WorkflowSteps ON;
INSERT INTO WorkflowSteps (Id, Name, Description, StepOrder, StepType, AssignedRole, IsAutoStep, SLAHours, WorkflowDefinitionId) VALUES
(17, N'Application', N'Citizen submits', 1, 'Submission', NULL, 0, 1, 3),
(18, N'Verification', N'Clerk verifies', 2, 'Verification', 'Clerk', 0, 12, 3),
(19, N'Approval', N'Quick approval', 3, 'Approval', 'SubCityAdministrator', 0, 12, 3),
(20, N'Document Generation', N'Generate document', 4, 'DocumentGeneration', NULL, 1, 1, 3),
(21, N'Citizen Notification', N'Notify citizen', 5, 'Notification', NULL, 1, 1, 3);
SET IDENTITY_INSERT WorkflowSteps OFF;
GO

PRINT 'Workflow update migration completed successfully.';
GO
