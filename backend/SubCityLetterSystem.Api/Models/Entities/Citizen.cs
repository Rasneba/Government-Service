using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Citizen
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string FullName { get; set; } = string.Empty;
        [Required, MaxLength(20)]
        public string PhoneNumber { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? Email { get; set; }
        [MaxLength(50)]
        public string? NationalId { get; set; }
        [Required]
        public string PasswordHash { get; set; } = string.Empty;
        public DateTime? DateOfBirth { get; set; }
        [MaxLength(20)]
        public string? Gender { get; set; }
        [MaxLength(500)]
        public string? Address { get; set; }
        public bool IsVerified { get; set; } = false;
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? LastLoginAt { get; set; }

        public ICollection<Application> Applications { get; set; } = new List<Application>();
    }
}
