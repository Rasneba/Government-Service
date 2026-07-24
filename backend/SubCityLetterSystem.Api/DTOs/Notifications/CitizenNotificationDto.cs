namespace SubCityLetterSystem.Api.DTOs.Notifications
{
    public class CitizenNotificationDto
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string? Message { get; set; }
        public string Type { get; set; } = string.Empty;
        public int? ApplicationId { get; set; }
        public string? ReferenceType { get; set; }
        public int? ReferenceId { get; set; }
        public bool IsRead { get; set; }
        public DateTime CreatedAt { get; set; }
    }
}
