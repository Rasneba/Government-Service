namespace SubCityLetterSystem.Api.DTOs.Services
{
    public class ServiceCategoryDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public string? Icon { get; set; }
        public int DisplayOrder { get; set; }
        public bool IsActive { get; set; }
        public int ServiceCount { get; set; }
    }

    public class ServiceTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int? CategoryId { get; set; }
        public string? CategoryName { get; set; }
        public string Code { get; set; } = string.Empty;
        public int? EstimatedDays { get; set; }
        public decimal Fee { get; set; }
        public bool RequiresPoliceVerification { get; set; }
        public string? RequiredDocuments { get; set; }
        public bool IsActive { get; set; }
        public int ApplicationCount { get; set; }
        public List<WorkflowStepConfigDto> WorkflowSteps { get; set; } = new();
    }

    public class WorkflowStepConfigDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = string.Empty;
        public string? Description { get; set; }
        public int StepOrder { get; set; }
        public string StepType { get; set; } = string.Empty;
        public string? AssignedRole { get; set; }
        public int? AssignedDepartmentId { get; set; }
        public bool IsAutoStep { get; set; }
        public int? SLAHours { get; set; }
    }
}
