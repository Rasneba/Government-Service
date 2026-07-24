namespace SubCityLetterSystem.Api.DTOs.Dashboard
{
    public class DashboardDto
    {
        public int TotalLetters { get; set; }
        public int IncomingToday { get; set; }
        public int OutgoingToday { get; set; }
        public int PendingLetters { get; set; }
        public int OverdueLetters { get; set; }
        public List<RecentLetterDto> RecentlyReceived { get; set; } = new();
        public List<RecentLetterDto> RecentlySent { get; set; } = new();
        public List<DepartmentStatsDto> DepartmentStats { get; set; } = new();
        public List<ActivityDto> RecentActivities { get; set; } = new();
    }

    public class RecentLetterDto
    {
        public int Id { get; set; }
        public string LetterNumber { get; set; } = string.Empty;
        public string Subject { get; set; } = string.Empty;
        public string SenderName { get; set; } = string.Empty;
        public string Priority { get; set; } = string.Empty;
        public string Status { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; }
    }

    public class DepartmentStatsDto
    {
        public string DepartmentName { get; set; } = string.Empty;
        public int TotalLetters { get; set; }
        public int PendingLetters { get; set; }
        public int CompletedLetters { get; set; }
    }

    public class ActivityDto
    {
        public string Action { get; set; } = string.Empty;
        public string UserName { get; set; } = string.Empty;
        public string? Details { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}