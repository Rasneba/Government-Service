using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.DTOs.Complaints
{
    public class ComplaintDto
    {
        public int Id { get; set; }
        public string Subject { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string? AssignedTo { get; set; }
        public string? Resolution { get; set; }
        public DateTime CreatedAt { get; set; }
        public DateTime? ResolvedAt { get; set; }
        public List<ComplaintCommentDto> Comments { get; set; } = new();
    }

    public class CreateComplaintDto
    {
        [Required] public string Subject { get; set; } = string.Empty;
        [Required] public string Description { get; set; } = string.Empty;
        public string Category { get; set; } = "General";
        public string Priority { get; set; } = "Normal";
    }

    public class ComplaintCommentDto
    {
        public int Id { get; set; }
        public string AuthorName { get; set; } = string.Empty;
        public string Comment { get; set; } = string.Empty;
        public bool IsStaff { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class AddComplaintCommentDto
    {
        [Required] public string Comment { get; set; } = string.Empty;
    }
}
