using System.ComponentModel.DataAnnotations;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Letter
    {
        public int Id { get; set; }
        [Required, MaxLength(50)]
        public string LetterNumber { get; set; } = string.Empty;
        [Required, MaxLength(500)]
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public LetterPriority Priority { get; set; } = LetterPriority.Normal;
        public LetterStatus Status { get; set; } = LetterStatus.Draft;
        
        public int SenderId { get; set; }
        public int? SenderDepartmentId { get; set; }
        public int? ReceiverId { get; set; }
        public int? ReceiverDepartmentId { get; set; }
        
        [MaxLength(200)]
        public string? CitizenName { get; set; }
        [MaxLength(50)]
        public string? CaseNumber { get; set; }
        
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? SentAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        
        public int CreatedById { get; set; }
        public int? ApprovedById { get; set; }
        [MaxLength(1000)]
        public string? RejectionReason { get; set; }
        
        public bool IsIncoming { get; set; }
        public bool IsDeleted { get; set; } = false;

        public User Sender { get; set; } = null!;
        public User? Receiver { get; set; }
        public Department? SenderDepartment { get; set; }
        public Department? ReceiverDepartment { get; set; }
        public User CreatedBy { get; set; } = null!;
        public User? ApprovedBy { get; set; }

        public ICollection<LetterAttachment> Attachments { get; set; } = new List<LetterAttachment>();
        public ICollection<LetterMovement> Movements { get; set; } = new List<LetterMovement>();
        public ICollection<LetterComment> Comments { get; set; } = new List<LetterComment>();
    }
}