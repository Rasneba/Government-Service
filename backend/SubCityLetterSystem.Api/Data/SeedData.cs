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

            // Organizations - add Police if missing
            if (!await context.Organizations.AnyAsync(o => o.Code == "POL"))
            {
                context.Organizations.Add(new Organization { Name = "Sub-City Police Department", Code = "POL", Description = "Sub-City Police", IsActive = true });
                await context.SaveChangesAsync();
            }
            if (!await context.Organizations.AnyAsync(o => o.Code == "SUB"))
            {
                context.Organizations.Add(new Organization { Name = "Sub-City Administration", Code = "SUB", Description = "Main Sub-City Office", IsActive = true });
                await context.SaveChangesAsync();
            }

            // Departments - add police depts if missing
            var subCity = await context.Organizations.FirstAsync(o => o.Code == "SUB");
            var police = await context.Organizations.FirstAsync(o => o.Code == "POL");
            var deptCodes = new[] { "SUB-ADM", "SUB-CRV", "SUB-CER", "SUB-RES", "POL-INV", "POL-VRU", "POL-REC" };
            var existingDeptCodes = await context.Departments.Select(d => d.Code).ToListAsync();
            var missingDepts = new List<Department>();
            if (!existingDeptCodes.Contains("SUB-ADM")) missingDepts.Add(new Department { Name = "Administration", Code = "SUB-ADM", OrganizationId = subCity.Id, IsActive = true });
            if (!existingDeptCodes.Contains("SUB-CRV")) missingDepts.Add(new Department { Name = "Civil Registry", Code = "SUB-CRV", OrganizationId = subCity.Id, IsActive = true });
            if (!existingDeptCodes.Contains("SUB-CER")) missingDepts.Add(new Department { Name = "Certificate Services", Code = "SUB-CER", OrganizationId = subCity.Id, IsActive = true });
            if (!existingDeptCodes.Contains("SUB-RES")) missingDepts.Add(new Department { Name = "Residency Services", Code = "SUB-RES", OrganizationId = subCity.Id, IsActive = true });
            if (!existingDeptCodes.Contains("POL-INV")) missingDepts.Add(new Department { Name = "Investigation", Code = "POL-INV", OrganizationId = police.Id, IsActive = true });
            if (!existingDeptCodes.Contains("POL-VRU")) missingDepts.Add(new Department { Name = "Verification Unit", Code = "POL-VRU", OrganizationId = police.Id, IsActive = true });
            if (!existingDeptCodes.Contains("POL-REC")) missingDepts.Add(new Department { Name = "Records", Code = "POL-REC", OrganizationId = police.Id, IsActive = true });
            if (missingDepts.Any()) { context.Departments.AddRange(missingDepts); await context.SaveChangesAsync(); }

            // Users - add police users and staff if missing
            var existingUsernames = await context.Users.Select(u => u.Username).ToListAsync();
            var adminDept = await context.Departments.FirstAsync(d => d.Code == "SUB-ADM");
            var certDept = await context.Departments.FirstAsync(d => d.Code == "SUB-CER");
            var vruDept = await context.Departments.FirstAsync(d => d.Code == "POL-VRU");
            var invDept = await context.Departments.FirstAsync(d => d.Code == "POL-INV");
            var missingUsers = new List<User>();
            if (!existingUsernames.Contains("admin")) missingUsers.Add(new User { FullName = "System Administrator", Username = "admin", Email = "admin@subcity.gov.et", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"), Role = UserRole.SystemAdministrator, OrganizationId = subCity.Id, DepartmentId = adminDept.Id, IsActive = true });
            if (!existingUsernames.Contains("subadmin")) missingUsers.Add(new User { FullName = "Sub-City Supervisor", Username = "subadmin", Email = "subadmin@subcity.gov.et", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Sub@123"), Role = UserRole.SubCityAdministrator, OrganizationId = subCity.Id, DepartmentId = adminDept.Id, IsActive = true });
            if (!existingUsernames.Contains("clerk")) missingUsers.Add(new User { FullName = "Certificate Clerk", Username = "clerk", Email = "clerk@subcity.gov.et", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Clerk@123"), Role = UserRole.Clerk, OrganizationId = subCity.Id, DepartmentId = certDept.Id, IsActive = true });
            if (!existingUsernames.Contains("police1")) missingUsers.Add(new User { FullName = "Police Verification Officer", Username = "police1", Email = "police1@subcity.gov.et", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Police@123"), Role = UserRole.PoliceAdministrator, OrganizationId = police.Id, DepartmentId = vruDept.Id, IsActive = true });
            if (!existingUsernames.Contains("police2")) missingUsers.Add(new User { FullName = "Police Investigation Officer", Username = "police2", Email = "police2@subcity.gov.et", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Police@123"), Role = UserRole.PoliceAdministrator, OrganizationId = police.Id, DepartmentId = invDept.Id, IsActive = true });
            if (missingUsers.Any()) { context.Users.AddRange(missingUsers); await context.SaveChangesAsync(); }

            // Citizens - add test citizen if missing
            if (!await context.Citizens.AnyAsync(c => c.PhoneNumber == "0911111111"))
            {
                context.Citizens.Add(new Citizen { FullName = "Test Citizen", PhoneNumber = "0911111111", PasswordHash = BCrypt.Net.BCrypt.HashPassword("Test@123"), IsVerified = true, IsActive = true });
                await context.SaveChangesAsync();
            }

            // Service Categories - add AACRRSA categories if missing
            var existingCatNames = await context.ServiceCategories.Select(c => c.Name).ToListAsync();
            var missingCats = new List<ServiceCategory>();
            if (!existingCatNames.Contains("Civil Registration")) missingCats.Add(new ServiceCategory { Name = "Civil Registration", Description = "Birth, marriage, divorce, death, adoption certificates", Icon = "file-text", DisplayOrder = 1, IsActive = true });
            if (!existingCatNames.Contains("Residency Services")) missingCats.Add(new ServiceCategory { Name = "Residency Services", Description = "Resident ID, verification, release letters", Icon = "home", DisplayOrder = 2, IsActive = true });
            if (!existingCatNames.Contains("Special Certificates")) missingCats.Add(new ServiceCategory { Name = "Special Certificates", Description = "Non-marital, paternity recognition, childhood acceptance", Icon = "shield", DisplayOrder = 3, IsActive = true });
            if (missingCats.Any()) { context.ServiceCategories.AddRange(missingCats); await context.SaveChangesAsync(); }

            // Service Types - add AACRRSA services if missing by code
            var existingCodes = await context.ServiceTypes.Select(s => s.Code).ToListAsync();
            var civil = await context.ServiceCategories.FirstAsync(c => c.Name == "Civil Registration");
            var residency = await context.ServiceCategories.FirstAsync(c => c.Name == "Residency Services");
            var special = await context.ServiceCategories.FirstAsync(c => c.Name == "Special Certificates");
            var missingServices = new List<ServiceType>();

            if (!existingCodes.Contains("BRC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Birth Registration and Certificate", Code = "BRC", CategoryId = civil.Id,
                    Description = "Registration and certification of birth for children born in Ethiopia",
                    EstimatedDays = 3, Fee = 50, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "If the parents of the child are both alive or unable to register the birth due to force majeure, they can register by giving a special birth proxy to the biological mother, and if the biological mother is unable, by giving a special birth proxy to the biological father. If one of the parents is not alive, the birth is registered when the living parent presents the legal death certificate of the deceased parent. Persons with disabilities can register through their caregivers or guardians. A birth is registered for a live birth or a live birth followed by immediate death, but a stillbirth is not registered. A birth registration service seeker who is 18 years of age or older must register their birth themselves. When parents who have a child before the age of 18 come to register, they can register by submitting a letter of support from the lower administration office. If the registrant is a foreigner, he must have been born in Ethiopia.",
                    SupportingEvidence = "If the birth occurred at a health facility, the registrant must submit a birth notification form from the health facility. When the guardian comes to register the birth, they must provide a legal proof of guardianship issued by the court. The police or appropriate government agency that comes to register an abandoned child must provide legal identification or proof of identity. If the birth registrant is a foreign citizen, proof from a health institution must be submitted.",
                    RequiredDocuments = "[\"Birth notification form from health facility\",\"Legal proof of guardianship (if applicable)\",\"Court order for abandoned children\",\"Health institution proof (foreign citizens)\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("MRC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Marriage Registration and Certificate", Code = "MRC", CategoryId = civil.Id,
                    Description = "Registration and certification of marriage for couples",
                    EstimatedDays = 5, Fee = 75, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "If the couple decides to get married too late, they must notify the registrar one month before the date. The registrar will issue a notice for 15 consecutive days stating the date of the marriage. Objection to marriage must be submitted in writing within 15 consecutive days from the date of posting of notice; it must be parents and guardians, prosecutors, guardians or a person who claims to have a previous marriage who can file an objection. The registrar must give a decision on the marriage objection submitted within five consecutive days. Neither a man nor a woman can get married before they reach 18 years of age.",
                    SupportingEvidence = "Spouses must present an unexpired residence or national ID or passport or defense army ID or proof of immigration or residence permit or proof of residency issued by the lowest administrative office. If the marriage is performed at the place of normal residence of the spouse's parents or close relatives, the residence/national ID of the parents or close relatives must be submitted. Proof of residence/nationality or passport of spouse witnesses must be provided. If the bridegroom is previously married and divorced, a divorce certificate should be provided if available. Two 3x4 photographs of the couple taken at the same time within 6 months must be submitted. Witnesses of married couples who have been married in a religious and traditional ceremony must appear in person before the registrar and sign their signatures. Birth certificates of spouses, if available, must be submitted.",
                    RequiredDocuments = "[\"Unexpired residence/national ID or passport\",\"2 photos (3x4, within 6 months)\",\"Divorce certificate (if applicable)\",\"Birth certificates of spouses (if available)\",\"Witness identification documents\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("DVC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Divorce Registration Certificate", Code = "DVC", CategoryId = civil.Id,
                    Description = "Registration and certification of divorce",
                    EstimatedDays = 3, Fee = 50, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "The applicant's renewed ID or passport and visa or residence permit must be submitted. When it is a renewal service, the old certificate must be submitted. If the court's divorce decree is not filed before, the original and the copy must be submitted. If it is an embassy confirmation, a letter from the embassy explaining the matter and the representative of the embassy must provide a renewed ID or passport. If the request is through a representative, specific legal representation evidence must be provided. For correction requests, a court order must be submitted.",
                    SupportingEvidence = "Renewed ID or passport and visa or residence permit. Old certificate (for renewal). Original and copy of court divorce decree. Embassy letter (for embassy confirmation). Legal representation documents (if through representative). Court order (for corrections).",
                    RequiredDocuments = "[\"Renewed ID or passport\",\"Court divorce decree (original and copy)\",\"Old certificate (for renewal)\",\"Embassy letter (if applicable)\",\"Court order (for corrections)\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("DRC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Death Registration and Certificate", Code = "DRC", CategoryId = civil.Id,
                    Description = "Registration and certification of death",
                    EstimatedDays = 2, Fee = 30, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "The person who lived with the deceased, the relatives of the deceased by blood or marriage if there is no cohabiting person, the nearest neighbor if these are not available, or anyone who knows about the death of the deceased must register the death. If the death occurred in a shared residence, the head of the institution must be approached. The death will be registered when the evidence provided by the body that investigates whether the person who died due to the accident and the person who was with the accident victim could be found. If the death is recorded as a result of a decision of disappearance of the person, an exact copy of the court decision must be submitted. In case of a death registered after the deadline, certified written evidence of the occurrence of the death must be submitted from the church, mosque, etc.",
                    SupportingEvidence = "Court decision for disappearance cases. Certified written evidence from church/mosque for late registration. Evidence from investigating body for accident cases. Identification of person reporting the death.",
                    RequiredDocuments = "[\"Identification of reporter\",\"Court decision (disappearance cases)\",\"Church/mosque certificate (late registration)\",\"Investigating body evidence (accident cases)\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("ADC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Adoption Registration Certificate", Code = "ADC", CategoryId = civil.Id,
                    Description = "Registration and certification of adoption",
                    EstimatedDays = 7, Fee = 100, RequiresPoliceVerification = true,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "Applicant's renewed Resident ID or passport must be submitted. If it is a renewal service, the previous certificate must be returned. If it is an embassy confirmation, a letter from the embassy explaining the matter and the representative must provide a renewed Resident ID or passport. If the request is made by representative, specific legal proof of representation must be provided. For correction requests, a court decision must be submitted.",
                    SupportingEvidence = "Renewed Resident ID or passport. Previous certificate (for renewal). Embassy letter (for embassy confirmation). Legal representation documents (if through representative). Court decision (for corrections).",
                    RequiredDocuments = "[\"Renewed ID or passport\",\"Previous certificate (for renewal)\",\"Embassy letter (if applicable)\",\"Legal representation documents\",\"Court order (for corrections)\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("CAC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Childhood Acceptance Certificate", Code = "CAC", CategoryId = special.Id,
                    Description = "Registration and certificate of acceptance of childhood by the father",
                    EstimatedDays = 30, Fee = 50, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "The father must come before the Honorary Registrar and give his word that he is my son. When a court-approved will is submitted and one of the father's parents accepts the child on behalf of the biological father, and the child's mother acknowledges the recipient's paternity, it is registered. If the child has reached the age of majority, the father's acceptance of the child is recorded. Although the biological father is a minor, only the father can promise that he is the child. If he gives his word through an agent, a special power of attorney approved by the court must be submitted. The registrar should not register unless the child's mother believes that the recipient's paternity is genuine. The registrar shall post a notice for a period of 30 consecutive days. When the child's father is dead or unable to give his consent, one of the father's parents can give his word. If the child's mother is dead or found to be incapacitated, the affidavit may be given by one of the child's mother's parents.",
                    SupportingEvidence = "Court-approved will (if applicable). Special power of attorney (if through agent). Statement or written will certified by authorized authority.",
                    RequiredDocuments = "[\"Court-approved will (if applicable)\",\"Special power of attorney (if through agent)\",\"Statement certified by authorized authority\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("PRC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Paternity Recognition Certificate", Code = "PRC", CategoryId = special.Id,
                    Description = "Recognition of paternity in court registration and certificate",
                    EstimatedDays = 7, Fee = 50, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "If the child's birth has been registered, the previously registered information regarding the child's biological father and grandfather will be recorded based on the court's decision to determine paternity (Unknown father reign). If the child's birth has not already been registered in the register of honor, the birth will be registered according to the birth registration instructions.",
                    SupportingEvidence = "Resident/national ID or passport of the registrant. Court order determining paternity.",
                    RequiredDocuments = "[\"Resident/national ID or passport\",\"Court order for paternity determination\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("RID"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Residence ID", Code = "RID", CategoryId = residency.Id,
                    Description = "Issuance of Addis Ababa City Resident ID card",
                    EstimatedDays = 3, Fee = 25, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "Must be registered in Residence Registration Form 001. Age must be 18 years and above. Must appear in person or apply through the technology option provided by the agency. An Ethiopian who is 18 years of age and older and registered as a resident in the district where he lives has the right to ask for an identity card. ID is not delegated; it will not be renewed. A resident who resigns from his previous residence has the right to request an ID when he registers as a resident after the resignation has been registered for 3 months. Renewal: valid for up to four years. Replacement available for torn, burned, damaged or lost IDs.",
                    SupportingEvidence = "2 photographs taken in the last 6 months. Service request form. Proof from Housing Development Office or tax office (if commercial and residential house are together). Police proof of loss (for lost ID).",
                    RequiredDocuments = "[\"2 photographs (within 6 months)\",\"Service request form\",\"Police proof of loss (if lost)\",\"Housing Development Office proof (if needed)\"]",
                    Reminder = "The residence ID will not be given by proxy and will not be renewed. Ethiopians diasporas and foreign nationals living abroad are not issued residence ID. Resident ID will not be issued at any business house.",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("NMC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Non-marital Certificate", Code = "NMC", CategoryId = special.Id,
                    Description = "Certificate confirming single/unmarried status",
                    EstimatedDays = 2, Fee = 20, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "Confirmation from the residential registration form that they are not married and take an affidavit. Two passport size photographs taken within six months must be submitted. Resident ID or passport containing updated complete details of the applicant. If the request is made by an agent, special representation shall be made. The only certificate issued by the district office will be valid for 6 months only. In the event of divorce or the death or disappearance of their spouse, when they seek a certificate of single status, they will be issued a single status certificate. After marriage, if they ask for proof of marriage before marriage, they will receive daily, monthly and annual service until the date of marriage.",
                    SupportingEvidence = "Affidavit confirming unmarried status. Two passport size photographs (within 6 months). Resident ID or passport with updated details. Agent's representation documents (if applicable).",
                    RequiredDocuments = "[\"Affidavit of unmarried status\",\"2 passport photos (within 6 months)\",\"Updated Resident ID or passport\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("RVS"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Residency Verification Service", Code = "RVS", CategoryId = residency.Id,
                    Description = "Verification of residency status and duration",
                    EstimatedDays = 1, Fee = 10, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "Must be registered on the family form. Applicant must provide renewed resident ID. If he/she asks for proof of how long he/she has lived in the woreda, it must be recorded on a clear resident form. It must also be confirmed on oath. When requested by a representative, a letter of proof of residency will be processed by providing a legal representative document, and providing a copy of the representative's renewed ID or passport.",
                    SupportingEvidence = "Renewed resident ID. Family form registration record. Legal representative document (if through representative). Representative's renewed ID or passport copy.",
                    RequiredDocuments = "[\"Renewed resident ID\",\"Family form registration record\",\"Legal representative document (if applicable)\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("RLL"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Resident Release Letter Service", Code = "RLL", CategoryId = residency.Id,
                    Description = "Release letter for residents transferring to another district",
                    EstimatedDays = 2, Fee = 10, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency branch office of woreda",
                    EligibilityCriteria = "Must be registered on the family form. The requesting customer must be presented in person. When picking up the item, you must return the residence ID you have been using earlier. If the person lives in a government house and is responsible for the house, he must provide proof of the handover of the government house. He/she must submit 4x4 size photograph taken within six months. If the transfer letter is given to more than one person, those over 18 years of age must submit a 4x4 size photograph. If he/she says that he/she has lost his/her Residence ID, he/she can get a replacement by providing proof of its loss from the police or photographic proof of identity and verifying it with an oath. The transfer can be handled by proxy only when the representative has clearly represented the transfer.",
                    SupportingEvidence = "Previous residence ID (must be returned). Government house handover proof (if applicable). 4x4 photograph (within 6 months). Police proof of loss (if ID lost). Legal representation documents (if through agent).",
                    RequiredDocuments = "[\"Previous residence ID (to be returned)\",\"4x4 photograph (within 6 months)\",\"Government house handover proof (if applicable)\",\"Police proof of loss (if ID lost)\"]",
                    IsActive = true
                });
            }

            if (!existingCodes.Contains("FSC"))
            {
                missingServices.Add(new ServiceType
                {
                    Name = "Residence Service Letters to Foreign Countries", Code = "FSC", CategoryId = residency.Id,
                    Description = "Residence service letters written to foreign countries and the Minister of Foreign Affairs and Immigration",
                    EstimatedDays = 5, Fee = 30, RequiresPoliceVerification = false,
                    ServiceProvider = "Civil Registration and Residency Services Agency headquarters and its branches",
                    EligibilityCriteria = "A letter written to the Agency from the Woreda where you live. Renewed ID. If the service is provided through representation, representation document and representative's renewed ID and passport and travel document or immigrant ID.",
                    SupportingEvidence = "Letter from Woreda office. Renewed ID. Representative's documents (if applicable): representation document, renewed ID, passport, travel document or immigrant ID.",
                    RequiredDocuments = "[\"Letter from Woreda office\",\"Renewed ID\",\"Representation document (if applicable)\",\"Representative's ID and passport (if applicable)\"]",
                    IsActive = true
                });
            }

            if (missingServices.Any()) { context.ServiceTypes.AddRange(missingServices); await context.SaveChangesAsync(); }

            // Workflow Definitions - add if the service type doesn't have a workflow yet
            var missingWfs = new List<WorkflowDefinition>();
            var brcType = await context.ServiceTypes.FirstAsync(s => s.Code == "BRC");
            var mrcType = await context.ServiceTypes.FirstAsync(s => s.Code == "MRC");
            var ridType = await context.ServiceTypes.FirstAsync(s => s.Code == "RID");
            if (!await context.WorkflowDefinitions.AnyAsync(w => w.ServiceTypeId == brcType.Id))
            {
                missingWfs.Add(new WorkflowDefinition { Name = "Birth Registration Workflow", Description = "Birth certificate registration and issuance", ServiceTypeId = brcType.Id, IsActive = true });
            }
            if (!await context.WorkflowDefinitions.AnyAsync(w => w.ServiceTypeId == mrcType.Id))
            {
                missingWfs.Add(new WorkflowDefinition { Name = "Marriage Registration Workflow", Description = "Marriage certificate registration and issuance", ServiceTypeId = mrcType.Id, IsActive = true });
            }
            if (!await context.WorkflowDefinitions.AnyAsync(w => w.ServiceTypeId == ridType.Id))
            {
                missingWfs.Add(new WorkflowDefinition { Name = "Standard Service Workflow", Description = "Standard workflow for residency and other services", ServiceTypeId = ridType.Id, IsActive = true });
            }
            if (missingWfs.Any()) { context.WorkflowDefinitions.AddRange(missingWfs); await context.SaveChangesAsync(); }

            // Workflow Steps - add if workflow definitions don't have steps yet
            var wfBirth = await context.WorkflowDefinitions.FirstAsync(w => w.Name == "Birth Registration Workflow");
            var wfMarriage = await context.WorkflowDefinitions.FirstAsync(w => w.Name == "Marriage Registration Workflow");
            var wfStandard = await context.WorkflowDefinitions.FirstAsync(w => w.Name == "Standard Service Workflow");

            if (!await context.WorkflowSteps.AnyAsync(s => s.WorkflowDefinitionId == wfBirth.Id))
            {
                context.WorkflowSteps.AddRange(
                    new WorkflowStep { Name = "Application", Description = "Citizen submits birth registration application", StepOrder = 1, StepType = WorkflowStepType.Submission, IsAutoStep = false, SLAHours = 1, WorkflowDefinitionId = wfBirth.Id },
                    new WorkflowStep { Name = "Document Review", Description = "Clerk reviews documents and birth notification", StepOrder = 2, StepType = WorkflowStepType.Verification, AssignedRole = "Clerk", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wfBirth.Id },
                    new WorkflowStep { Name = "Approval", Description = "Supervisor approves the registration", StepOrder = 3, StepType = WorkflowStepType.Approval, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wfBirth.Id },
                    new WorkflowStep { Name = "Certificate Issued", Description = "Certificate is generated and citizen notified", StepOrder = 4, StepType = WorkflowStepType.DocumentGeneration, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wfBirth.Id }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.WorkflowSteps.AnyAsync(s => s.WorkflowDefinitionId == wfMarriage.Id))
            {
                context.WorkflowSteps.AddRange(
                    new WorkflowStep { Name = "Application", Description = "Couple submits marriage registration", StepOrder = 1, StepType = WorkflowStepType.Submission, IsAutoStep = false, SLAHours = 1, WorkflowDefinitionId = wfMarriage.Id },
                    new WorkflowStep { Name = "Document Review", Description = "Clerk reviews IDs and required documents", StepOrder = 2, StepType = WorkflowStepType.Verification, AssignedRole = "Clerk", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wfMarriage.Id },
                    new WorkflowStep { Name = "15-Day Notice Period", Description = "Public notice posted for 15 consecutive days", StepOrder = 3, StepType = WorkflowStepType.DocumentValidation, IsAutoStep = true, SLAHours = 360, WorkflowDefinitionId = wfMarriage.Id },
                    new WorkflowStep { Name = "Approval", Description = "Registrar approves the marriage registration", StepOrder = 4, StepType = WorkflowStepType.Approval, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wfMarriage.Id },
                    new WorkflowStep { Name = "Certificate Issued", Description = "Marriage certificate is generated", StepOrder = 5, StepType = WorkflowStepType.DocumentGeneration, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wfMarriage.Id }
                );
                await context.SaveChangesAsync();
            }

            if (!await context.WorkflowSteps.AnyAsync(s => s.WorkflowDefinitionId == wfStandard.Id))
            {
                context.WorkflowSteps.AddRange(
                    new WorkflowStep { Name = "Application", Description = "Citizen submits application", StepOrder = 1, StepType = WorkflowStepType.Submission, IsAutoStep = false, SLAHours = 1, WorkflowDefinitionId = wfStandard.Id },
                    new WorkflowStep { Name = "Document Review", Description = "Clerk reviews documents", StepOrder = 2, StepType = WorkflowStepType.Verification, AssignedRole = "Clerk", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wfStandard.Id },
                    new WorkflowStep { Name = "Approval", Description = "Supervisor approval", StepOrder = 3, StepType = WorkflowStepType.Approval, AssignedRole = "SubCityAdministrator", IsAutoStep = false, SLAHours = 24, WorkflowDefinitionId = wfStandard.Id },
                    new WorkflowStep { Name = "Service Completed", Description = "Document issued and citizen notified", StepOrder = 4, StepType = WorkflowStepType.DocumentGeneration, IsAutoStep = true, SLAHours = 1, WorkflowDefinitionId = wfStandard.Id }
                );
                await context.SaveChangesAsync();
            }
        }
    }
}
