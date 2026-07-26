using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Applications;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Models.Entities;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Services
{
    public class ApplicationService : IApplicationService
    {
        private readonly AppDbContext _context;

        public ApplicationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ApplicationListDto>> GetApplicationsAsync(int? citizenId, int? officerId, string? status, int? serviceTypeId, int page, int pageSize)
        {
            var query = _context.Applications
                .Include(a => a.ServiceType)
                .Include(a => a.Citizen)
                .Include(a => a.CurrentStep)
                .Include(a => a.AssignedOfficer)
                .Where(a => !a.IsDeleted)
                .AsQueryable();

            if (citizenId.HasValue) query = query.Where(a => a.CitizenId == citizenId.Value);
            if (officerId.HasValue) query = query.Where(a => a.AssignedOfficerId == officerId.Value);
            if (!string.IsNullOrEmpty(status) && Enum.TryParse<ApplicationStatus>(status, out var s))
                query = query.Where(a => a.Status == s);
            if (serviceTypeId.HasValue) query = query.Where(a => a.ServiceTypeId == serviceTypeId.Value);

            var total = await query.CountAsync();
            var items = await query.OrderByDescending(a => a.CreatedAt)
                .Skip((page - 1) * pageSize).Take(pageSize)
                .Select(a => new ApplicationListDto
                {
                    Id = a.Id,
                    ApplicationNumber = a.ApplicationNumber,
                    ServiceName = a.ServiceType.Name,
                    ServiceCode = a.ServiceType.Code,
                    CitizenName = a.Citizen.FullName,
                    Status = a.Status.ToString(),
                    CurrentStep = a.CurrentStep != null ? a.CurrentStep.Name : null,
                    AssignedOfficer = a.AssignedOfficer != null ? a.AssignedOfficer.FullName : null,
                    Priority = a.Priority,
                    ReissueReason = a.ReissueReason,
                    PoliceApproved = a.PoliceApproved,
                    CreatedAt = a.CreatedAt,
                    DueDate = a.DueDate
                }).ToListAsync();

            return new PagedResult<ApplicationListDto> { Items = items, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<ApplicationDetailDto?> GetApplicationByIdAsync(int id)
        {
            return await _context.Applications
                .Include(a => a.ServiceType).ThenInclude(s => s.Category)
                .Include(a => a.Citizen)
                .Include(a => a.CurrentStep)
                .Include(a => a.AssignedOfficer)
                .Include(a => a.ServiceType.WorkflowDefinitions).ThenInclude(w => w.Steps)
                .Include(a => a.StepHistory).ThenInclude(h => h.WorkflowStep)
                .Include(a => a.StepHistory).ThenInclude(h => h.AssignedToUser)
                .Include(a => a.Documents.Where(d => !d.IsDeleted))
                .Include(a => a.Notes)
                .Where(a => !a.IsDeleted && a.Id == id)
                .Select(a => new ApplicationDetailDto
                {
                    Id = a.Id,
                    ApplicationNumber = a.ApplicationNumber,
                    ServiceTypeId = a.ServiceTypeId,
                    ServiceName = a.ServiceType.Name,
                    CitizenId = a.CitizenId,
                    CitizenName = a.Citizen.FullName,
                    CitizenPhone = a.Citizen.PhoneNumber,
                    Status = a.Status.ToString(),
                    CurrentStepName = a.CurrentStep != null ? a.CurrentStep.Name : null,
                    CurrentStepOrder = a.CurrentStep != null ? a.CurrentStep.StepOrder : null,
                    Subject = a.Subject,
                    Description = a.Description,
                    Priority = a.Priority,
                    FeeAmount = a.FeeAmount,
                    FeePaid = a.FeePaid,
                    RejectionReason = a.RejectionReason,
                    OriginalCertificateNumber = a.OriginalCertificateNumber,
                    ReissueReason = a.ReissueReason,
                    OriginalCertificateDetails = a.OriginalCertificateDetails,
                    PoliceApproved = a.PoliceApproved,
                    PoliceVerificationNotes = a.PoliceVerificationNotes,
                    PoliceVerifiedAt = a.PoliceVerifiedAt,
                    CreatedAt = a.CreatedAt,
                    SubmittedAt = a.SubmittedAt,
                    DueDate = a.DueDate,
                    CompletedAt = a.CompletedAt,
                    StepHistory = a.StepHistory.OrderByDescending(h => h.CreatedAt).Select(h => new StepHistoryDto
                    {
                        Id = h.Id,
                        StepName = h.WorkflowStep.Name,
                        Status = h.Status.ToString(),
                        AssignedTo = h.AssignedToUser != null ? h.AssignedToUser.FullName : null,
                        Notes = h.Notes,
                        StartedAt = h.StartedAt,
                        CompletedAt = h.CompletedAt
                    }).ToList(),
                    Documents = a.Documents.Select(d => new DocumentDto
                    {
                        Id = d.Id,
                        DocumentType = d.DocumentType,
                        FileName = d.FileName,
                        FileSize = d.FileSize,
                        IsVerified = d.IsVerified,
                        Version = d.Version,
                        UploadedAt = d.UploadedAt
                    }).ToList(),
                    Notes = a.Notes.OrderByDescending(n => n.CreatedAt).Select(n => new NoteDto
                    {
                        Id = n.Id,
                        AuthorName = n.User != null ? n.User.FullName : (n.CitizenId != null ? "Citizen" : "System"),
                        Note = n.Note,
                        IsInternal = n.IsInternal,
                        CreatedAt = n.CreatedAt
                    }).ToList(),
                    WorkflowSteps = a.ServiceType.WorkflowDefinitions.SelectMany(w => w.Steps).OrderBy(s => s.StepOrder)
                        .Select(s => new WorkflowStepDto
                        {
                            Id = s.Id,
                            Name = s.Name,
                            Description = s.Description,
                            StepOrder = s.StepOrder,
                            StepType = s.StepType.ToString(),
                            AssignedRole = s.AssignedRole,
                            IsAutoStep = s.IsAutoStep,
                            SLAHours = s.SLAHours,
                            ExecutionStatus = a.StepHistory.Where(h => h.WorkflowStepId == s.Id).Select(h => h.Status.ToString()).FirstOrDefault() ?? "Pending"
                        }).ToList()
                }).FirstOrDefaultAsync();
        }

        public async Task<ApplicationDetailDto> CreateApplicationAsync(CreateApplicationDto dto, int citizenId)
        {
            var serviceType = await _context.ServiceTypes.FindAsync(dto.ServiceTypeId);
            if (serviceType == null) throw new KeyNotFoundException("Service type not found");

            var applicationNumber = await GenerateApplicationNumberAsync(dto.ServiceTypeId);

            var application = new Application
            {
                ApplicationNumber = applicationNumber,
                ServiceTypeId = dto.ServiceTypeId,
                CitizenId = citizenId,
                Subject = dto.Subject,
                Description = dto.Description,
                Priority = dto.Priority,
                FeeAmount = serviceType.Fee,
                OriginalCertificateNumber = dto.OriginalCertificateNumber,
                ReissueReason = dto.ReissueReason,
                OriginalCertificateDetails = dto.OriginalCertificateDetails,
                Status = ApplicationStatus.Submitted,
                SubmittedAt = DateTime.UtcNow,
                CreatedAt = DateTime.UtcNow
            };

            _context.Applications.Add(application);
            await _context.SaveChangesAsync();

            var workflow = await _context.WorkflowDefinitions
                .Include(w => w.Steps)
                .FirstOrDefaultAsync(w => w.ServiceTypeId == dto.ServiceTypeId && w.IsActive);

            if (workflow != null && workflow.Steps.Any())
            {
                var orderedSteps = workflow.Steps.OrderBy(s => s.StepOrder).ToList();

                foreach (var step in orderedSteps)
                {
                    _context.ApplicationStepHistories.Add(new ApplicationStepHistory
                    {
                        ApplicationId = application.Id,
                        WorkflowStepId = step.Id,
                        Status = StepExecutionStatus.Pending,
                        DueAt = step.SLAHours.HasValue ? DateTime.UtcNow.AddHours(step.SLAHours.Value) : null,
                        CreatedAt = DateTime.UtcNow
                    });
                }

                await _context.SaveChangesAsync();

                var firstStep = orderedSteps[0];
                application.CurrentStepId = firstStep.Id;

                var firstHistory = await _context.ApplicationStepHistories
                    .FirstOrDefaultAsync(h => h.ApplicationId == application.Id && h.WorkflowStepId == firstStep.Id);
                if (firstHistory != null)
                {
                    firstHistory.Status = StepExecutionStatus.InProgress;
                    firstHistory.StartedAt = DateTime.UtcNow;
                }
            }

            await _context.SaveChangesAsync();
            return (await GetApplicationByIdAsync(application.Id))!;
        }

        public async Task<ApplicationDetailDto> AdvanceStepAsync(int applicationId, int userId, string? notes)
        {
            var application = await _context.Applications
                .Include(a => a.ServiceType.WorkflowDefinitions).ThenInclude(w => w.Steps.OrderBy(s => s.StepOrder))
                .Include(a => a.StepHistory).ThenInclude(h => h.WorkflowStep)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null) throw new KeyNotFoundException("Application not found");

            if (application.CurrentStepId.HasValue)
            {
                var currentHistory = application.StepHistory.FirstOrDefault(h => h.WorkflowStepId == application.CurrentStepId && h.Status == StepExecutionStatus.InProgress);
                if (currentHistory != null)
                {
                    currentHistory.Status = StepExecutionStatus.Completed;
                    currentHistory.CompletedAt = DateTime.UtcNow;
                    currentHistory.Notes = notes;
                    currentHistory.AssignedToUserId = userId;
                }
            }

            var allSteps = application.ServiceType.WorkflowDefinitions.SelectMany(w => w.Steps).OrderBy(s => s.StepOrder).ToList();
            var currentStepOrder = application.CurrentStepId.HasValue
                ? allSteps.FirstOrDefault(s => s.Id == application.CurrentStepId)?.StepOrder ?? 0
                : 0;

            var nextStep = allSteps.FirstOrDefault(s => s.StepOrder > currentStepOrder);

            if (nextStep != null)
            {
                application.CurrentStepId = nextStep.Id;
                application.Status = MapStepTypeToStatus(nextStep.StepType);

                var nextHistory = application.StepHistory.FirstOrDefault(h => h.WorkflowStepId == nextStep.Id);
                if (nextHistory != null)
                {
                    nextHistory.Status = StepExecutionStatus.InProgress;
                    nextHistory.StartedAt = DateTime.UtcNow;
                    nextHistory.AssignedToUserId = nextStep.AssignedRole == null ? userId : null;
                }
            }
            else
            {
                application.Status = ApplicationStatus.Completed;
                application.CompletedAt = DateTime.UtcNow;
                application.CurrentStepId = null;
            }

            await _context.SaveChangesAsync();
            return (await GetApplicationByIdAsync(applicationId))!;
        }

        public async Task<ApplicationDetailDto> RejectStepAsync(int applicationId, int userId, string reason)
        {
            var application = await _context.Applications.FindAsync(applicationId);
            if (application == null) throw new KeyNotFoundException("Application not found");

            if (application.CurrentStepId.HasValue)
            {
                var currentHistory = await _context.ApplicationStepHistories
                    .FirstOrDefaultAsync(h => h.ApplicationId == applicationId && h.WorkflowStepId == application.CurrentStepId && h.Status == StepExecutionStatus.InProgress);
                if (currentHistory != null)
                {
                    currentHistory.Status = StepExecutionStatus.Rejected;
                    currentHistory.CompletedAt = DateTime.UtcNow;
                    currentHistory.Notes = reason;
                    currentHistory.AssignedToUserId = userId;
                }
            }

            application.Status = ApplicationStatus.Rejected;
            application.RejectionReason = reason;

            await _context.SaveChangesAsync();
            return (await GetApplicationByIdAsync(applicationId))!;
        }

        public async Task<ApplicationDetailDto> AssignOfficerAsync(int applicationId, int officerId)
        {
            var application = await _context.Applications.FindAsync(applicationId);
            if (application == null) throw new KeyNotFoundException("Application not found");
            application.AssignedOfficerId = officerId;
            await _context.SaveChangesAsync();
            return (await GetApplicationByIdAsync(applicationId))!;
        }

        public async Task<ApplicationDetailDto> AddNoteAsync(int applicationId, AddNoteDto dto, int? userId, int? citizenId)
        {
            var note = new ApplicationNote
            {
                ApplicationId = applicationId,
                UserId = userId,
                CitizenId = citizenId,
                Note = dto.Note,
                IsInternal = dto.IsInternal,
                CreatedAt = DateTime.UtcNow
            };
            _context.ApplicationNotes.Add(note);
            await _context.SaveChangesAsync();
            return (await GetApplicationByIdAsync(applicationId))!;
        }

        public async Task<string> GenerateApplicationNumberAsync(int serviceTypeId)
        {
            var serviceType = await _context.ServiceTypes.FindAsync(serviceTypeId);
            var prefix = serviceType?.Code ?? "APP";
            var datePart = DateTime.UtcNow.ToString("yyyyMMdd");
            var count = await _context.Applications.CountAsync(a => a.ApplicationNumber.StartsWith($"{prefix}-{datePart}"));
            return $"{prefix}-{datePart}-{(count + 1):D4}";
        }

        private static ApplicationStatus MapStepTypeToStatus(WorkflowStepType stepType)
        {
            return stepType switch
            {
                WorkflowStepType.Submission => ApplicationStatus.Submitted,
                WorkflowStepType.Verification => ApplicationStatus.UnderReview,
                WorkflowStepType.DocumentValidation => ApplicationStatus.DocumentVerification,
                WorkflowStepType.SupervisorReview => ApplicationStatus.SupervisorApproval,
                WorkflowStepType.PoliceVerification => ApplicationStatus.PoliceVerification,
                WorkflowStepType.Approval => ApplicationStatus.Approved,
                WorkflowStepType.DocumentGeneration => ApplicationStatus.Approved,
                WorkflowStepType.Notification => ApplicationStatus.Completed,
                _ => ApplicationStatus.UnderReview
            };
        }
    }
}
