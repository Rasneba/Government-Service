namespace SubCityLetterSystem.Api.DTOs.Applications
{
    public class ApplicationListDto
    {
        public int Id { get; set; }
        public string ApplicationNumber { get; set; } = string.Empty;
        public string ServiceName { get; set; } = string.Empty;
        public string ServiceCode { get; set; } = string.Empty;
        public string CitizenName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? CurrentStep { get; set; }
        public string? AssignedOfficer { get; set; }
        public string Priority { get; set; } = string.Empty;
        public string? ReissueReason { get; set; }
        public bool PoliceApproved { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status != "Completed" && Status != "Cancelled";
    }

    public class ApplicationDetailDto
    {
        public int Id { get; set; }
        public string ApplicationNumber { get; set; } = string.Empty;
        public int ServiceTypeId { get; set; }
        public string ServiceName { get; set; } = string.Empty;
        public int CitizenId { get; set; }
        public string CitizenName { get; set; } = string.Empty;
        public string CitizenPhone { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? CurrentStepName { get; set; }
        public int? CurrentStepOrder { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = string.Empty;
        public decimal FeeAmount { get; set; }
        public bool FeePaid { get; set; }
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? SubmittedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? OriginalCertificateNumber { get; set; }
        public string? ReissueReason { get; set; }
        public string? OriginalCertificateDetails { get; set; }
        public bool PoliceApproved { get; set; }
        public string? PoliceVerificationNotes { get; set; }
        public DateTime? PoliceVerifiedAt { get; set; }
        public List<StepHistoryDto> StepHistory { get; set; } = new();
        public List<DocumentDto> Documents { get; set; } = new();
        public List<NoteDto> Notes { get; set; } = new();
        public List<WorkflowStepDto> WorkflowSteps { get; set; } = new();
    }

    public class CreateApplicationDto
    {
        public int ServiceTypeId { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string Priority { get; set; } = "Normal";
        public string? OriginalCertificateNumber { get; set; }
        public string? ReissueReason { get; set; }
        public string? OriginalCertificateDetails { get; set; }
    }

    public class UpdateApplicationStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? RejectionReason { get; set; }
    }

    public class PoliceReviewDto
    {
        public bool Approved { get; set; }
        public string? Notes { get; set; }
    }

    public class WorkflowStepDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int StepOrder { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string? AssignedRole { get; set; }
        public bool IsAutoStep { get; set; }
        public int? SLAHours { get; set; }
        public string ExecutionStatus { get; set; } = "Pending";
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public string? AssignedTo { get; set; }
    }

    public class StepHistoryDto
    {
        public int Id { get; set; }
        public string StepName { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? AssignedTo { get; set; }
        public string? Notes { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
    }

    public class DocumentDto
    {
        public int Id { get; set; }
        public string DocumentType { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public long FileSize { get; set; }
        public bool IsVerified { get; set; }
        public int Version { get; set; }
        public DateTime UploadedAt { get; set; }
    }

    public class NoteDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Note { get; set; } = string.Empty;
        public bool IsInternal { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddNoteDto
    {
        public string Note { get; set; } = string.Empty;
        public bool IsInternal { get; set; } = false;
    }
}
