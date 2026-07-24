using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Complaint
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        [Required, MaxLength(200)]
        public string Subject { get; set; } = string.Empty;
        [Required]
        public string Description { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Category { get; set; } = string.Empty;
        [MaxLength(50)]
        public string Priority { get; set; } = "Normal";
        [MaxLength(50)]
        public string Status { get; set; } = "Open";
        public int? AssignedToUserId { get; set; }
        [MaxLength(1000)]
        public string? Resolution { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? ResolvedAt { get; set; }
        public bool IsDeleted { get; set; } = false;

        public Citizen Citizen { get; set; } = null!;
        public User? AssignedToUser { get; set; }
        public ICollection<ComplaintComment> Comments { get; set; } = new List<ComplaintComment>();
    }

    public class ComplaintComment
    {
        public int Id { get; set; }
        public int ComplaintId { get; set; }
        public int? UserId { get; set; }
        public int? CitizenId { get; set; }
        [Required]
        public string Comment { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Complaint Complaint { get; set; } = null!;
        public User? User { get; set; }
    }
}
