using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.DTOs.Feedback
{
    public class FeedbackDto
    {
        public int Id { get; set; }
        public int CitizenId { get; set; }
        public string CitizenName { get; set; } = string.Empty;
        public int? ApplicationId { get; set; }
        public string? ApplicationNumber { get; set; }
        public string Type { get; set; } = string.Empty;
        public int Rating { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public bool IsPublic { get; set; }
        public DateTime CreatedAt { get; set; }
    }

    public class CreateFeedbackDto
    {
        public int? ApplicationId { get; set; }
        [Required] public string Type { get; set; } = "ServiceRating";
        [Range(1, 5)] public int Rating { get; set; }
        public string? Subject { get; set; }
        public string? Message { get; set; }
        public bool IsPublic { get; set; } = false;
    }
}
