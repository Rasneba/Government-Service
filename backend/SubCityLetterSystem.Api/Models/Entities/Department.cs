using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class Department
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        [MaxLength(50)]
        public string? Code { get; set; }
        public int OrganizationId { get; set; }
        public int? ParentDepartmentId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Organization Organization { get; set; } = null!;
        public Department? ParentDepartment { get; set; }
        public ICollection<User> Users { get; set; } = new List<User>();
        public ICollection<Department> ChildDepartments { get; set; } = new List<Department>();
    }
}