using System.ComponentModel.DataAnnotations;

namespace SubCityLetterSystem.Api.Models.Entities
{
    public class LetterAttachment
    {
        public int Id { get; set; }
        public int LetterId { get; set; }
        [Required, MaxLength(500)]
        public string FileName { get; set; } = string.Empty;
        [Required, MaxLength(500)]
        public string FilePath { get; set; } = string.Empty;
        [MaxLength(100)]
        public string? ContentType { get; set; }
        public long FileSize { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int UploadedById { get; set; }

        public Letter Letter { get; set; } = null!;
        public User UploadedBy { get; set; } = null!;
    }
}