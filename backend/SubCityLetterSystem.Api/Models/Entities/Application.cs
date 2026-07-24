using System.ComponentModel.DataAnnotations;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Application
    {
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string ApplicationNumber { get; set; } = string.Empty;
        public int ServiceTypeId { get; set; }
        public int CitizenId { get; set; }
        [MaxLength(500)]
        public string Subject { get; set; } = string.Empty;
        [MaxLength(2000)]
        public string? Description { get; set; }
        [MaxLength(20)]
        public string Priority { get; set; } = "Normal";
        public decimal FeeAmount { get; set; }
        public bool FeePaid { get; set; }
        public ApplicationStatus Status { get; set; } = ApplicationStatus.Draft;
        public int? CurrentStepId { get; set; }
        public int? AssignedOfficerId { get; set; }
        [MaxLength(1000)]
        public string? RejectionReason { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SubmittedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime? CompletedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        [MaxLength(100)]
        public string? OriginalCertificateNumber { get; set; }
        [MaxLength(50)]
        public string? ReissueReason { get; set; }
        [MaxLength(500)]
        public string? OriginalCertificateDetails { get; set; }
        public int? PoliceVerifiedByUserId { get; set; }
        public DateTime? PoliceVerifiedAt { get; set; }
        [MaxLength(1000)]
        public string? PoliceVerificationNotes { get; set; }
        public bool PoliceApproved { get; set; }

        public ServiceType ServiceType { get; set; } = null!;
        public Citizen Citizen { get; set; } = null!;
        public WorkflowStep? CurrentStep { get; set; }
        public User? AssignedOfficer { get; set; }
        public User? PoliceVerifiedByUser { get; set; }

        public ICollection<ApplicationStepHistory> StepHistory { get; set; } = new List<ApplicationStepHistory>();
        public ICollection<ApplicationDocument> Documents { get; set; } = new List<ApplicationDocument>();
        public ICollection<ApplicationNote> Notes { get; set; } = new List<ApplicationNote>();
    }
}
