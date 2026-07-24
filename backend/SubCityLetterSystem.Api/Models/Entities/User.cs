using System.ComponentModel.DataAnnotations;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class User
    {
        public int Id { get; set; }
        [Required, MaxLength(100)]
        public string FullName { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string Email { get; set; } = string.Empty;
        [Required, MaxLength(100)]
        public string Username { get; set; } = string.Empty;
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        [MaxLength(20)]
        public string? PhoneNumber { get; set; }
        public UserRole Role { get; set; }
        public int? OrganizationId { get; set; }
        public int? DepartmentId { get; set; }
        [MaxLength(500)]
        public string? Address { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        public Organization? Organization { get; set; }
        public Department? Department { get; set; }
    }
}