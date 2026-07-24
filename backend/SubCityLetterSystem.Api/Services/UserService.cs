using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Auth;
using SubCityLetterSystem.Api.DTOs.Common;
using SubCityLetterSystem.Api.Models.Entities;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Services
{
    public class UserService : IUserService
    {
        private readonly AppDbContext _context;

        public UserService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<PagedResult<UserDto>> GetUsersAsync(int page, int pageSize, string? role = null, int? departmentId = null)
        {
            var query = _context.Users
                .Include(u => u.Organization)
                .Include(u => u.Department)
                .AsQueryable();

            if (!string.IsNullOrEmpty(role) && Enum.TryParse<UserRole>(role, out var userRole))
                query = query.Where(u => u.Role == userRole);

            if (departmentId.HasValue)
                query = query.Where(u => u.DepartmentId == departmentId);

            var total = await query.CountAsync();
            var users = await query
                .OrderByDescending(u => u.CreatedAt)
                .Skip((page - 1) * pageSize)
                .Take(pageSize)
                .Select(u => new UserDto
                {
                    Id = u.Id,
                    FullName = u.FullName,
                    Email = u.Email,
                    Username = u.Username,
                    PhoneNumber = u.PhoneNumber,
                    Role = u.Role.ToString(),
                    OrganizationId = u.OrganizationId,
                    OrganizationName = u.Organization!.Name,
                    DepartmentId = u.DepartmentId,
                    DepartmentName = u.Department!.Name
                })
                .ToListAsync();

            return new PagedResult<UserDto> { Items = users, TotalCount = total, Page = page, PageSize = pageSize };
        }

        public async Task<UserDto?> GetUserByIdAsync(int id)
        {
            var user = await _context.Users
                .Include(u => u.Organization)
                .Include(u => u.Department)
                .FirstOrDefaultAsync(u => u.Id == id);

            if (user == null) return null;

            return new UserDto
            {
                Id = user.Id,
                FullName = user.FullName,
                Email = user.Email,
                Username = user.Username,
                PhoneNumber = user.PhoneNumber,
                Role = user.Role.ToString(),
                OrganizationId = user.OrganizationId,
                OrganizationName = user.Organization?.Name,
                DepartmentId = user.DepartmentId,
                DepartmentName = user.Department?.Name
            };
        }

        public async Task<UserDto> CreateUserAsync(UserDto dto, string password)
        {
            if (await _context.Users.AnyAsync(u => u.Username == dto.Username))
                throw new InvalidOperationException("Username already exists");

            if (await _context.Users.AnyAsync(u => u.Email == dto.Email))
                throw new InvalidOperationException("Email already exists");

            var user = new User
            {
                FullName = dto.FullName,
                Email = dto.Email,
                Username = dto.Username,
                PhoneNumber = dto.PhoneNumber,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(password),
                Role = Enum.Parse<UserRole>(dto.Role),
                OrganizationId = dto.OrganizationId,
                DepartmentId = dto.DepartmentId,
                IsActive = true
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            dto.Id = user.Id;
            return dto;
        }

        public async Task<UserDto> UpdateUserAsync(int id, UserDto dto)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) throw new KeyNotFoundException("User not found");

            user.FullName = dto.FullName;
            user.Email = dto.Email;
            user.PhoneNumber = dto.PhoneNumber;
            user.Role = Enum.Parse<UserRole>(dto.Role);
            user.OrganizationId = dto.OrganizationId;
            user.DepartmentId = dto.DepartmentId;

            await _context.SaveChangesAsync();
            dto.Id = id;
            return dto;
        }

        public async Task<bool> DeleteUserAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> ToggleUserStatusAsync(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null) return false;

            user.IsActive = !user.IsActive;
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
