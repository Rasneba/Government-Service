using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.DTOs.Letters
{
    public class LetterListDto
    {
        public int Id { get; set; }
        public string LetterNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string? ReceiverName { get; set; }
        public string? SenderDepartment { get; set; }
        public string? ReceiverDepartment { get; set; }
        public bool IsIncoming { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsOverdue => DueDate.HasValue && DueDate.Value < DateTime.UtcNow && Status != "Closed" && Status != "Received";
    }

    public class LetterDetailDto
    {
        public int Id { get; set; }
        public string LetterNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public int SenderId { get; set; }
        public string SenderName { get; set; } = string.Empty;
        public int? ReceiverId { get; set; }
        public string? ReceiverName { get; set; }
        public int? SenderDepartmentId { get; set; }
        public string? SenderDepartment { get; set; }
        public int? ReceiverDepartmentId { get; set; }
        public string? ReceiverDepartment { get; set; }
        public string? CitizenName { get; set; }
        public string? CaseNumber { get; set; }
        public DateTime? DueDate { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? SentAt { get; set; }
        public DateTime? ReceivedAt { get; set; }
        public DateTime? ClosedAt { get; set; }
        public string? RejectionReason { get; set; }
        public bool IsIncoming { get; set; }
        public int CreatedById { get; set; }
        public string CreatedByName { get; set; } = string.Empty;
        public List<AttachmentDto> Attachments { get; set; } = new();
        public List<MovementDto> Movements { get; set; } = new();
        public List<CommentDto> Comments { get; set; } = new();
    }

    public class CreateLetterDto
    {
        public string Subject { get; set; } = string.Empty;
        public string Body { get; set; } = string.Empty;
        public string Priority { get; set; } = "Normal";
        public int? ReceiverId { get; set; }
        public int? ReceiverDepartmentId { get; set; }
        public string? CitizenName { get; set; }
        public string? CaseNumber { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsIncoming { get; set; }
    }

    public class UpdateLetterStatusDto
    {
        public string Status { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public string? RejectionReason { get; set; }
    }

    public class AttachmentDto
    {
        public int Id { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string? ContentType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; }
        public string UploadedByName { get; set; } = string.Empty;
    }

    public class MovementDto
    {
        public int Id { get; set; }
        public string FromUserName { get; set; } = string.Empty;
        public string? ToUserName { get; set; }
        public string? FromDepartment { get; set; }
        public string? ToDepartment { get; set; }
        public string Action { get; set; } = string.Empty;
        public string? Notes { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CommentDto
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public string UserName { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class AddCommentDto
    {
        public string Comment { get; set; } = string.Empty;
    }

    public class LetterSearchDto
    {
        public string? LetterNumber { get; set; }
        public string? Subject { get; set; }
        public string? SenderName { get; set; }
        public string? ReceiverName { get; set; }
        public string? CitizenName { get; set; }
        public string? CaseNumber { get; set; }
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public string? Status { get; set; }
        public string? Priority { get; set; }
        public int? DepartmentId { get; set; }
        public bool? IsIncoming { get; set; }
        public int Page { get; set; } = 1;
        public int PageSize { get; set; } = 20;
    }
}