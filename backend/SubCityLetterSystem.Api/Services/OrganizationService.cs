using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class OrganizationService : IOrganizationService
    {
        private readonly AppDbContext _context;

        public OrganizationService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<OrganizationDto>> GetAllAsync()
        {
            return await _context.Organizations
                .Select(o => new OrganizationDto
                {
                    Id = o.Id,
                    Name = o.Name,
                    Description = o.Description,
                    Code = o.Code,
                    IsActive = o.IsActive
                })
                .ToListAsync();
        }

        public async Task<OrganizationDto?> GetByIdAsync(int id)
        {
            var o = await _context.Organizations.FindAsync(id);
            if (o == null) return null;
            return new OrganizationDto
            {
                Id = o.Id,
                Name = o.Name,
                Description = o.Description,
                Code = o.Code,
                IsActive = o.IsActive
            };
        }

        public async Task<OrganizationDto> CreateAsync(OrganizationDto dto)
        {
            var org = new Organization
            {
                Name = dto.Name,
                Description = dto.Description,
                Code = dto.Code,
                IsActive = dto.IsActive
            };
            _context.Organizations.Add(org);
            await _context.SaveChangesAsync();
            dto.Id = org.Id;
            return dto;
        }

        public async Task<OrganizationDto> UpdateAsync(int id, OrganizationDto dto)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org == null) throw new KeyNotFoundException("Organization not found");

            org.Name = dto.Name;
            org.Description = dto.Description;
            org.Code = dto.Code;
            org.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            dto.Id = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var org = await _context.Organizations.FindAsync(id);
            if (org == null) return false;
            _context.Organizations.Remove(org);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
