using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class WorkflowDefinition
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        public int ServiceTypeId { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ServiceType ServiceType { get; set; } = null!;
        public ICollection<WorkflowStep> Steps { get; set; } = new List<WorkflowStep>();
    }
}
