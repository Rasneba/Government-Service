using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Organization
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [MaxLength(50)]
        public string? Code { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }
        
        public ICollection<Department> Departments { get; set; } = new List<Department>();
        public ICollection<User> Users { get; set; } = new List<User>();
    }
}