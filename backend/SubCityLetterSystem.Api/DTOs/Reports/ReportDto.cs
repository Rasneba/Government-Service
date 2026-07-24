namespace SubCityLetterSystem.Api.DTOs.Reports
{
    public class ReportFilterDto
    {
        public DateTime? DateFrom { get; set; }
        public DateTime? DateTo { get; set; }
        public int? DepartmentId { get; set; }
        public int? OrganizationId { get; set; }
    }

    public class LetterReportDto
    {
        public string LetterNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string? ReceiverName { get; set; }
        public string Department { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
        public DateTime? DueDate { get; set; }
        public bool IsOverdue { get; set; }
    }

    public class MonthlyReportDto
    {
        public int Year { get; set; }
        public int Month { get; set; }
        public string MonthName { get; set; } = string.Empty;
        public int Incoming { get; set; }
        public int Outgoing { get; set; }
        public int Pending { get; set; }
        public int Completed { get; set; }
    }

    public class DepartmentPerformanceDto
    {
        public string DepartmentName { get; set; } = string.Empty;
        public int TotalLetters { get; set; }
        public int CompletedLetters { get; set; }
        public int PendingLetters { get; set; }
        public int OverdueLetters { get; set; }
        public double AvgCompletionDays { get; set; }
        public double PerformancePercentage { get; set; }
    }
}