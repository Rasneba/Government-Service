using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Applications;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Models.Entities;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Services
{
    public class PoliceService : IPoliceService
    {
        private readonly AppDbContext _context;

        public PoliceService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<ApplicationListDto>> GetPendingVerificationsAsync(int? userId, int page, int pageSize)
        {
            var query = _context.Applications
                .Include(a => a.ServiceType)
                .Include(a => a.Citizen)
                .Include(a => a.CurrentStep)
                .Include(a => a.AssignedOfficer)
                .Where(a => !a.IsDeleted && a.Status == ApplicationStatus.PoliceVerification)
                .AsQueryable();

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

        public async Task<ApplicationDetailDto?> GetApplicationForReviewAsync(int id)
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
                            ExecutionStatus = a.StepHistory.Any(h => h.WorkflowStepId == s.Id) ? a.StepHistory.First(h => h.WorkflowStepId == s.Id).Status.ToString() : "Pending"
                        }).ToList()
                }).FirstOrDefaultAsync();
        }

        public async Task<ApplicationDetailDto> ReviewApplicationAsync(int applicationId, int userId, PoliceReviewDto dto)
        {
            var application = await _context.Applications
                .Include(a => a.ServiceType.WorkflowDefinitions).ThenInclude(w => w.Steps.OrderBy(s => s.StepOrder))
                .Include(a => a.StepHistory)
                .FirstOrDefaultAsync(a => a.Id == applicationId);

            if (application == null) throw new KeyNotFoundException("Application not found");
            if (application.Status != ApplicationStatus.PoliceVerification)
                throw new InvalidOperationException("Application is not in Police Verification status");

            application.PoliceApproved = dto.Approved;
            application.PoliceVerifiedByUserId = userId;
            application.PoliceVerifiedAt = DateTime.UtcNow;
            application.PoliceVerificationNotes = dto.Notes;

            if (application.CurrentStepId.HasValue)
            {
                var currentHistory = application.StepHistory.FirstOrDefault(h => h.WorkflowStepId == application.CurrentStepId && h.Status == StepExecutionStatus.InProgress);
                if (currentHistory != null)
                {
                    currentHistory.Status = dto.Approved ? StepExecutionStatus.Completed : StepExecutionStatus.Rejected;
                    currentHistory.CompletedAt = DateTime.UtcNow;
                    currentHistory.Notes = dto.Notes;
                    currentHistory.AssignedToUserId = userId;
                }
            }

            if (dto.Approved)
            {
                var allSteps = application.ServiceType.WorkflowDefinitions.SelectMany(w => w.Steps).OrderBy(s => s.StepOrder).ToList();
                var currentStepOrder = allSteps.FirstOrDefault(s => s.Id == application.CurrentStepId)?.StepOrder ?? 0;
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
                    }
                }
                else
                {
                    application.Status = ApplicationStatus.Completed;
                    application.CompletedAt = DateTime.UtcNow;
                    application.CurrentStepId = null;
                }
            }
            else
            {
                application.Status = ApplicationStatus.Rejected;
                application.RejectionReason = dto.Notes ?? "Police verification rejected";
            }

            await _context.SaveChangesAsync();

            var detailService = new ApplicationService(_context);
            return (await detailService.GetApplicationByIdAsync(applicationId))!;
        }

        public async Task<List<ApplicationListDto>> GetMyReviewedApplicationsAsync(int userId, int page, int pageSize)
        {
            return await _context.Applications
                .Include(a => a.ServiceType)
                .Include(a => a.Citizen)
                .Include(a => a.CurrentStep)
                .Where(a => !a.IsDeleted && a.PoliceVerifiedByUserId == userId)
                .OrderByDescending(a => a.PoliceVerifiedAt)
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
                    Priority = a.Priority,
                    ReissueReason = a.ReissueReason,
                    PoliceApproved = a.PoliceApproved,
                    CreatedAt = a.CreatedAt,
                    DueDate = a.DueDate
                }).ToListAsync();
        }

        public async Task<PoliceStatsDto> GetPoliceStatsAsync()
        {
            var today = DateTime.UtcNow.Date;
            return new PoliceStatsDto
            {
                PendingVerifications = await _context.Applications.CountAsync(a => !a.IsDeleted && a.Status == ApplicationStatus.PoliceVerification),
                ApprovedToday = await _context.Applications.CountAsync(a => !a.IsDeleted && a.PoliceVerifiedAt != null && a.PoliceVerifiedAt >= today && a.PoliceApproved),
                RejectedToday = await _context.Applications.CountAsync(a => !a.IsDeleted && a.PoliceVerifiedAt != null && a.PoliceVerifiedAt >= today && !a.PoliceApproved),
                TotalReviewed = await _context.Applications.CountAsync(a => !a.IsDeleted && a.PoliceVerifiedByUserId != null)
            };
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
