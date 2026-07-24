using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class ServiceType
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(1000)]
        public string? Description { get; set; }
        public int? CategoryId { get; set; }
        [Required, MaxLength(50)]
        public string Code { get; set; } = string.Empty;
        public int? EstimatedDays { get; set; }
        public decimal Fee { get; set; }
        public bool RequiresPoliceVerification { get; set; }
        [MaxLength(2000)]
        public string? RequiredDocuments { get; set; }
        [MaxLength(4000)]
        public string? EligibilityCriteria { get; set; }
        [MaxLength(4000)]
        public string? SupportingEvidence { get; set; }
        [MaxLength(2000)]
        public string? Reminder { get; set; }
        [MaxLength(500)]
        public string? ServiceProvider { get; set; }
        public bool IsActive { get; set; } = true;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
        public DateTime? UpdatedAt { get; set; }

        public ServiceCategory? Category { get; set; }
        public ICollection<Application> Applications { get; set; } = new List<Application>();
        public ICollection<WorkflowDefinition> WorkflowDefinitions { get; set; } = new List<WorkflowDefinition>();
    }
}
