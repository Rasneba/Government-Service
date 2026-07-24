using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Models.Entities;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Data
{
    public static class SeedData
    {
        public static async Task InitializeAsync(IServiceProvider serviceProvider)
        {
            using var scope = serviceProvider.CreateScope();
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

            await context.Database.EnsureCreatedAsync();

            // Seed Organizations
            if (!await context.Organizations.AnyAsync())
            {
                context.Organizations.AddRange(
                    new Organization { Name = "Sub-City Administration", Code = "SUB", Description = "Main Sub-City Office", IsActive = true },
                    new Organization { Name = "Sub-City Police Department", Code = "POL", Description = "Sub-City Police", IsActive = true }
                );
                await context.SaveChangesAsync();
            }

            // Seed Departments
            if (!await context.Departments.AnyAsync())
            {
                var subCity = await context.Organizations.FirstAsync(o => o.Code == "SUB");
                var police = await context.Organizations.FirstAsync(o => o.Code == "POL");

                context.Departments.AddRange(
                    new Department { Name = "Administration", Code = "SUB-ADM", OrganizationId = subCity.Id, IsActive = true },
                    new Department { Name = "Finance", Code = "SUB-FIN", OrganizationId = subCity.Id, IsActive = true },
                    new Department { Name = "Planning", Code = "SUB-PLN", OrganizationId = subCity.Id, IsActive = true },
                    new Department { Name = "Investigation", Code = "POL-INV", OrganizationId = police.Id, IsActive = true },
                    new Department { Name = "Patrol", Code = "POL-PAT", OrganizationId = police.Id, IsActive = true },
                    new Department { Name = "Records", Code = "POL-REC", OrganizationId = police.Id, IsActive = true }
                );
                await context.SaveChangesAsync();
            }

            // Seed Users
            if (!await context.Users.AnyAsync())
            {
                var adminDept = await context.Departments.FirstAsync(d => d.Code == "SUB-ADM");
                var subCity = await context.Organizations.FirstAsync(o => o.Code == "SUB");

                context.Users.AddRange(
                    new User
                    {
                        FullName = "System Administrator",
                        Username = "admin",
                        Email = "admin@subcity.gov.et",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                        Role = UserRole.SystemAdministrator,
                        OrganizationId = subCity.Id,
                        DepartmentId = adminDept.Id,
                        IsActive = true
                    },
                    new User
                    {
                        FullName = "Sub-City Admin",
                        Username = "subadmin",
                        Email = "subadmin@subcity.gov.et",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sub@123"),
                        Role = UserRole.SubCityAdministrator,
                        OrganizationId = subCity.Id,
                        DepartmentId = adminDept.Id,
                        IsActive = true
                    },
                    new User
                    {
                        FullName = "Clerk User",
                        Username = "clerk",
                        Email = "clerk@subcity.gov.et",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Clerk@123"),
                        Role = UserRole.Clerk,
                        OrganizationId = subCity.Id,
                        DepartmentId = adminDept.Id,
                        IsActive = true
                    }
                );
                await context.SaveChangesAsync();
            }

            // Seed Citizen test account
            if (!await context.Citizens.AnyAsync())
            {
                context.Citizens.AddRange(
                    new Citizen
                    {
                        FullName = "Test Citizen",
                        PhoneNumber = "0911111111",
                        PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"),
                        IsVerified = true,
                        IsActive = true
                    }
                );
                await context.SaveChangesAsync();
            }

            // Seed Service Categories
            if (!await context.ServiceCategories.AnyAsync())
            {
                context.ServiceCategories.AddRange(
                    new ServiceCategory { Name = "Civil Documents", Description = "Birth certificates, marriage certificates, family records", Icon = "file-text", DisplayOrder = 1, IsActive = true },
                    new ServiceCategory { Name = "Business Services", Description = "Business licenses, trade permits, commercial registrations", Icon = "briefcase", DisplayOrder = 2, IsActive = true },
                    new ServiceCategory { Name = "Land & Property", Description = "Land ownership, property registration, building permits", Icon = "map-pin", DisplayOrder = 3, IsActive = true },
                    new ServiceCategory { Name = "Police Services", Description = "Background checks, police clearance, lost property reports", Icon = "shield", DisplayOrder = 4, IsActive = true },
                    new ServiceCategory { Name = "Social Services", Description = "Social assistance, pension, disability support", Icon = "heart", DisplayOrder = 5, IsActive = true }
                );
                await context.SaveChangesAsync();
            }

            // Seed Service Types
            if (!await context.ServiceTypes.AnyAsync())
            {
                var civil = await context.ServiceCategories.FirstAsync(c => c.Name == "Civil Documents");
                var business = await context.ServiceCategories.FirstAsync(c => c.Name == "Business Services");
                var land = await context.ServiceCategories.FirstAsync(c => c.Name == "Land & Property");
                var police = await context.ServiceCategories.FirstAsync(c => c.Name == "Police Services");
                var social = await context.ServiceCategories.FirstAsync(c => c.Name == "Social Services");

                context.ServiceTypes.AddRange(
                    new ServiceType { Name = "Birth Certificate", Description = "Official birth certificate issuance", CategoryId = civil.Id, Code = "BC", EstimatedDays = 3, Fee = 50, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID of parent\",\"Hospital birth record\"]", IsActive = true },
                    new ServiceType { Name = "Marriage Certificate", Description = "Official marriage certificate issuance", CategoryId = civil.Id, Code = "MC", EstimatedDays = 3, Fee = 75, RequiresPoliceVerification = false, RequiredDocuments = "[\"National IDs of both spouses\",\"Marriage invitation letter\"]", IsActive = true },
                    new ServiceType { Name = "Business License", Description = "New business license application", CategoryId = business.Id, Code = "BL", EstimatedDays = 7, Fee = 500, RequiresPoliceVerification = true, RequiredDocuments = "[\"National ID\",\"Business plan\",\"Tax registration\"]", IsActive = true },
                    new ServiceType { Name = "Trade Permit", Description = "Trade and commerce permit", CategoryId = business.Id, Code = "TP", EstimatedDays = 5, Fee = 200, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Business registration\"]", IsActive = true },
                    new ServiceType { Name = "Land Ownership Certificate", Description = "Certificate of land ownership", CategoryId = land.Id, Code = "LOC", EstimatedDays = 14, Fee = 1000, RequiresPoliceVerification = true, RequiredDocuments = "[\"National ID\",\"Land survey document\",\"Tax clearance\"]", IsActive = true },
                    new ServiceType { Name = "Building Permit", Description = "Construction building permit", CategoryId = land.Id, Code = "BP", EstimatedDays = 10, Fee = 750, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Architectural plans\",\"Land ownership proof\"]", IsActive = true },
                    new ServiceType { Name = "Police Clearance Certificate", Description = "Certificate of good conduct", CategoryId = police.Id, Code = "PCC", EstimatedDays = 5, Fee = 100, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Passport photos\",\"Criminal record check\"]", IsActive = true },
                    new ServiceType { Name = "Background Check", Description = "Employment background verification", CategoryId = police.Id, Code = "BG", EstimatedDays = 7, Fee = 150, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Employment letter\"]", IsActive = true },
                    new ServiceType { Name = "Social Assistance Application", Description = "Application for social welfare support", CategoryId = social.Id, Code = "SA", EstimatedDays = 14, Fee = 0, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Income certificate\",\"Family records\"]", IsActive = true },
                    new ServiceType { Name = "Disability Support Registration", Description = "Registration for disability benefits", CategoryId = social.Id, Code = "DS", EstimatedDays = 10, Fee = 0, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Medical certificate\",\"Disability assessment\"]", IsActive = true },
                    new ServiceType { Name = "Family Record Certificate", Description = "Official family record document", CategoryId = civil.Id, Code = "FR", EstimatedDays = 3, Fee = 40, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Family member IDs\"]", IsActive = true },
                    new ServiceType { Name = "Lost Property Report", Description = "File a lost property report", CategoryId = police.Id, Code = "LP", EstimatedDays = 1, Fee = 25, RequiresPoliceVerification = false, RequiredDocuments = "[\"National ID\",\"Property description\"]", IsActive = true }
                );
                await context.SaveChangesAsync();
            }

            // Seed Workflow Definitions
            if (!await context.WorkflowDefinitions.AnyAsync())
            {
                var bcType = await context.ServiceTypes.FirstAsync(s => s.Code == "BC");
                var blType = await context.ServiceTypes.FirstAsync(s => s.Code == "BL");
                var locType = await context.ServiceTypes.FirstAsync(s => s.Code == "LOC");

                context.WorkflowDefinitions.AddRange(
                    new WorkflowDefinition { Name = "Standard Service Workflow", Description = "Default 8-step workflow for citizen services", ServiceTypeId = bcType.Id, IsActive = true },
                    new WorkflowDefinition { Name = "Police Required Workflow", Description = "Workflow with police verification for sensitive services", ServiceTypeId = blType.Id, IsActive = true },
                    new WorkflowDefinition { Name = "Fast Track Workflow", Description = "Simplified workflow for simple document requests", ServiceTypeId = locType.Id, IsActive = true }
                );
                await context.SaveChangesAsync();
            }

            // Seed Workflow Steps
            if (!await context.WorkflowSteps.AnyAsync())
            {
                var wf1 = await context.WorkflowDefinitions.FirstAsync(w => w.Name == "Standard Service Workflow");
                var wf2 = await context.WorkflowDefinitions.FirstAsync(w => w.Name == "Police Required Workflow");
                var wf3 = await context.WorkflowDefinitions.FirstAsync(w => w.Name == "Fast Track Workflow");

                // Standard workflow (8 steps)
                context.WorkflowSteps.AddRange(
                    new WorkflowStep { Name = "Application", Description = "Citizen submits application with required documents", StepOrder = 1, StepType = WorkflowStepType.Submission, IsAutoStep = false, SLAHours = 1, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Verification", Description = "Clerk verifies submitted documents and application details", StepOrder = 2, StepType = WorkflowStepType.Verification, AssignedRole = "Clerk", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Document Validation", Description = "Validate authenticity and completeness of documents", StepOrder = 3, StepType = WorkflowStepType.DocumentValidation, AssignedRole = "DepartmentOfficer", IsAutoStep = false, SLAHours = 48, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Supervisor Review", Description = "Department head reviews and endorses application", StepOrder = 4, StepType = WorkflowStepType.SupervisorReview, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 48, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Approval", Description = "Final approval by sub-city administrator", StepOrder = 5, StepType = WorkflowStepType.Approval, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Document Generation", Description = "System generates the official document", StepOrder = 6, StepType = WorkflowStepType.DocumentGeneration, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Citizen Notification", Description = "Citizen is notified that document is ready for pickup", StepOrder = 7, StepType = WorkflowStepType.Notification, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf1.Id },
                    new WorkflowStep { Name = "Completed", Description = "Application process completed", StepOrder = 8, StepType = WorkflowStepType.Approval, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf1.Id }
                );

                // Police required workflow (8 steps)
                context.WorkflowSteps.AddRange(
                    new WorkflowStep { Name = "Application", Description = "Citizen submits application", StepOrder = 1, StepType = WorkflowStepType.Submission, IsAutoStep = false, SLAHours = 1, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Verification", Description = "Clerk verifies documents", StepOrder = 2, StepType = WorkflowStepType.Verification, AssignedRole = "Clerk", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Document Validation", Description = "Validate documents", StepOrder = 3, StepType = WorkflowStepType.DocumentValidation, AssignedRole = "DepartmentOfficer", IsAutoStep = false, SLAHours = 48, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Police Verification", Description = "Police background check and investigation", StepOrder = 4, StepType = WorkflowStepType.PoliceVerification, AssignedRole = "PoliceAdministrator", IsAutoStep = false, SLAHours = 120, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Supervisor Review", Description = "Department head reviews", StepOrder = 5, StepType = WorkflowStepType.SupervisorReview, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 48, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Approval", Description = "Final approval", StepOrder = 6, StepType = WorkflowStepType.Approval, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Document Generation", Description = "Generate official document", StepOrder = 7, StepType = WorkflowStepType.DocumentGeneration, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf2.Id },
                    new WorkflowStep { Name = "Citizen Notification", Description = "Notify citizen", StepOrder = 8, StepType = WorkflowStepType.Notification, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf2.Id }
                );

                // Fast track workflow (5 steps)
                context.WorkflowSteps.AddRange(
                    new WorkflowStep { Name = "Application", Description = "Citizen submits", StepOrder = 1, StepType = WorkflowStepType.Submission, IsAutoStep = false, SLAHours = 1, WorkflowDefinitionId = wf3.Id },
                    new WorkflowStep { Name = "Verification", Description = "Clerk verifies", StepOrder = 2, StepType = WorkflowStepType.Verification, AssignedRole = "Clerk", IsAutoStep = false, SLAHours = 12, WorkflowDefinitionId = wf3.Id },
                    new WorkflowStep { Name = "Approval", Description = "Quick approval", StepOrder = 3, StepType = WorkflowStepType.Approval, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 12, WorkflowDefinitionId = wf3.Id },
                    new WorkflowStep { Name = "Document Generation", Description = "Generate document", StepOrder = 4, StepType = WorkflowStepType.DocumentGeneration, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf3.Id },
                    new WorkflowStep { Name = "Citizen Notification", Description = "Notify citizen", StepOrder = 5, StepType = WorkflowStepType.Notification, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wf3.Id }
                );

                await context.SaveChangesAsync();
            }
        }
    }
}
