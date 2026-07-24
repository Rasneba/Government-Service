using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.DTOs.Letters;

namespace SubCityLetterSystem.Api.Services
{
    public interface ILetterService
    {
        Task<PagedResult<LetterListDto>> GetLettersAsync(LetterSearchDto search);
        Task<LetterDetailDto?> GetLetterByIdAsync(int id);
        Task<LetterDetailDto> CreateLetterAsync(CreateLetterDto dto, int userId);
        Task<LetterDetailDto> UpdateLetterStatusAsync(int id, UpdateLetterStatusDto dto, int userId);
        Task<LetterDetailDto> AddCommentAsync(int letterId, AddCommentDto dto, int userId);
        Task<bool> DeleteLetterAsync(int id);
        Task<string> GenerateLetterNumberAsync(bool isIncoming);
        Task<PagedResult<LetterListDto>> GetInboxAsync(int userId, int page, int pageSize);
        Task<PagedResult<LetterListDto>> GetOutboxAsync(int userId, int page, int pageSize);
    }
}