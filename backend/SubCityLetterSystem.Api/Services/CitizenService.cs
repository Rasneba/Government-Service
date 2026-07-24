using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Citizens;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class CitizenService : ICitizenService
    {
        private readonly AppDbContext _context;
        private readonly IConfiguration _configuration;

        public CitizenService(AppDbContext context, IConfiguration configuration)
        {
            _context = context;
            _configuration = configuration;
        }

        public async Task<CitizenLoginResponseDto> RegisterAsync(CitizenRegisterDto dto)
        {
            if (await _context.Citizens.AnyAsync(c => c.PhoneNumber == dto.PhoneNumber))
                throw new InvalidOperationException("Phone number already registered");

            if (dto.Email != null && await _context.Citizens.AnyAsync(c => c.Email == dto.Email))
                throw new InvalidOperationException("Email already registered");

            var citizen = new Citizen
            {
                FullName = dto.FullName,
                PhoneNumber = dto.PhoneNumber,
                Email = dto.Email,
                NationalId = dto.NationalId,
                PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                DateOfBirth = dto.DateOfBirth,
                Gender = dto.Gender,
                Address = dto.Address,
                IsVerified = false,
                IsActive = true
            };

            _context.Citizens.Add(citizen);
            await _context.SaveChangesAsync();

            return await GenerateLoginResponseAsync(citizen);
        }

        public async Task<CitizenLoginResponseDto> LoginAsync(CitizenLoginDto dto)
        {
            var citizen = await _context.Citizens
                .FirstOrDefaultAsync(c => c.PhoneNumber == dto.PhoneNumber && c.IsActive);

            if (citizen == null || !BCrypt.Net.BCrypt.Verify(dto.Password, citizen.PasswordHash))
                throw new UnauthorizedAccessException("Invalid phone number or password");

            citizen.LastLoginAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();

            return await GenerateLoginResponseAsync(citizen);
        }

        public async Task<CitizenDto?> GetCitizenByIdAsync(int id)
        {
            var citizen = await _context.Citizens.FindAsync(id);
            if (citizen == null) return null;

            var activeApps = await _context.Applications.CountAsync(a => a.CitizenId == id && a.Status != Models.Enums.ApplicationStatus.Completed && a.Status != Models.Enums.ApplicationStatus.Cancelled);
            var completedApps = await _context.Applications.CountAsync(a => a.CitizenId == id && a.Status == Models.Enums.ApplicationStatus.Completed);

            return new CitizenDto
            {
                Id = citizen.Id,
                FullName = citizen.FullName,
                Email = citizen.Email,
                PhoneNumber = citizen.PhoneNumber,
                NationalId = citizen.NationalId,
                Gender = citizen.Gender,
                Address = citizen.Address,
                IsVerified = citizen.IsVerified,
                ActiveApplications = activeApps,
                CompletedApplications = completedApps
            };
        }

        public async Task<CitizenDto> UpdateCitizenProfileAsync(int id, CitizenDto dto)
        {
            var citizen = await _context.Citizens.FindAsync(id);
            if (citizen == null) throw new KeyNotFoundException("Citizen not found");

            citizen.FullName = dto.FullName;
            citizen.Email = dto.Email;
            citizen.Gender = dto.Gender;
            citizen.Address = dto.Address;
            await _context.SaveChangesAsync();

            return (await GetCitizenByIdAsync(id))!;
        }

        public async Task<bool> ChangePasswordAsync(int id, string currentPassword, string newPassword)
        {
            var citizen = await _context.Citizens.FindAsync(id);
            if (citizen == null) throw new KeyNotFoundException("Citizen not found");
            if (!BCrypt.Net.BCrypt.Verify(currentPassword, citizen.PasswordHash))
                throw new UnauthorizedAccessException("Current password is incorrect");

            citizen.PasswordHash = BCrypt.Net.BCrypt.HashPassword(newPassword);
            await _context.SaveChangesAsync();
            return true;
        }

        private async Task<CitizenLoginResponseDto> GenerateLoginResponseAsync(Citizen citizen)
        {
            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
            var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, citizen.Id.ToString()),
                new Claim(ClaimTypes.Name, citizen.FullName),
                new Claim("UserType", "Citizen"),
                new Claim("PhoneNumber", citizen.PhoneNumber)
            };

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: credentials
            );

            var activeApps = await _context.Applications.CountAsync(a => a.CitizenId == citizen.Id && a.Status != Models.Enums.ApplicationStatus.Completed && a.Status != Models.Enums.ApplicationStatus.Cancelled);
            var completedApps = await _context.Applications.CountAsync(a => a.CitizenId == citizen.Id && a.Status == Models.Enums.ApplicationStatus.Completed);

            return new CitizenLoginResponseDto
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                ExpiresAt = DateTime.UtcNow.AddDays(7),
                Citizen = new CitizenDto
                {
                    Id = citizen.Id,
                    FullName = citizen.FullName,
                    Email = citizen.Email,
                    PhoneNumber = citizen.PhoneNumber,
                    NationalId = citizen.NationalId,
                    Gender = citizen.Gender,
                    Address = citizen.Address,
                    IsVerified = citizen.IsVerified,
                    ActiveApplications = activeApps,
                    CompletedApplications = completedApps
                }
            };
        }
    }
}
