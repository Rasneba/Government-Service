using System.ComponentModel.DataAnnotations;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class WorkflowStep
    {
        public int Id { get; set; }
        [Required, MaxLength(200)]
        public string Name { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? Description { get; set; }
        public int StepOrder { get; set; }
        public WorkflowStepType StepType { get; set; }
        [MaxLength(50)]
        public string? AssignedRole { get; set; }
        public int? AssignedDepartmentId { get; set; }
        public bool IsAutoStep { get; set; }
        public int? SLAHours { get; set; }
        public int WorkflowDefinitionId { get; set; }

        public WorkflowDefinition WorkflowDefinition { get; set; } = null!;
    }
}
