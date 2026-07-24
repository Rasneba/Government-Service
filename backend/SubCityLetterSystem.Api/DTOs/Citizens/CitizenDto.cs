using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.DTOs.Citizens
{
    public class CitizenRegisterDto
    {
        [Required] public string FullName { get; set; } = string.Empty;
        [Required] public string PhoneNumber { get; set; } = string.Empty;
        [Required, MinLength(6)] public string Password { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string? NationalId { get; set; }
        public DateTime? DateOfBirth { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
    }

    public class CitizenLoginDto
    {
        [Required] public string PhoneNumber { get; set; } = string.Empty;
        [Required] public string Password { get; set; } = string.Empty;
    }

    public class CitizenDto
    {
        public int Id { get; set; }
        public string FullName { get; set; } = string.Empty;
        public string? Email { get; set; }
        public string PhoneNumber { get; set; } = string.Empty;
        public string? NationalId { get; set; }
        public string? Gender { get; set; }
        public string? Address { get; set; }
        public bool IsVerified { get; set; }
        public int ActiveApplications { get; set; }
        public int CompletedApplications { get; set; }
    }

    public class CitizenLoginResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public DateTime ExpiresAt { get; set; }
        public CitizenDto Citizen { get; set; } = null!;
    }
}
