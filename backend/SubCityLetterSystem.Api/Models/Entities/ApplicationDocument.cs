using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class ApplicationDocument
    {
        public int Id { get; set; }
        public int ApplicationId { get; set; }
        [Required, MaxLength(100)]
        public string DocumentType { get; set; } = string.Empty;
        [Required, MaxLength(500)]
        public string FileName { get; set; } = string.Empty;
        [MaxLength(500)]
        public string? FilePath { get; set; }
        public long FileSize { get; set; }
        public bool IsVerified { get; set; }
        public int Version { get; set; } = 1;
        public bool IsDeleted { get; set; } = false;
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;

        public Application Application { get; set; } = null!;
    }
}
