using System.ComponentModel.DataAnnotations;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class ApplicationStepHistory
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        public int WorkflowStepId { get; set; }
        public StepExecutionStatus Status { get; set; } = StepExecutionStatus.Pending;
        public int? AssignedToUserId { get; set; }
        [MaxLength(1000)]
        public string? Notes { get; set; }
        public DateTime? StartedAt { get; set; }
        public DateTime? CompletedAt { get; set; }
        public DateTime? DueAt { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public Application Application { get; set; } = null!;
        public WorkflowStep WorkflowStep { get; set; } = null!;
        public User? AssignedToUser { get; set; }
    }
}
