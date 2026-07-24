using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class DepartmentService : IDepartmentService
    {
        private readonly AppDbContext _context;

        public DepartmentService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<DepartmentListDto>> GetAllAsync(int? organizationId = null)
        {
            var query = _context.Departments.Include(d => d.Organization).AsQueryable();
            if (organizationId.HasValue)
                query = query.Where(d => d.OrganizationId == organizationId.Value);

            return await query.Select(d => new DepartmentListDto
            {
                Id = d.Id,
                Name = d.Name,
                Code = d.Code,
                OrganizationName = d.Organization.Name,
                IsActive = d.IsActive
            }).ToListAsync();
        }

        public async Task<DepartmentDetailDto?> GetByIdAsync(int id)
        {
            var d = await _context.Departments
                .Include(x => x.Organization)
                .Include(x => x.ParentDepartment)
                .FirstOrDefaultAsync(x => x.Id == id);

            if (d == null) return null;

            return new DepartmentDetailDto
            {
                Id = d.Id,
                Name = d.Name,
                Description = d.Description,
                Code = d.Code,
                OrganizationId = d.OrganizationId,
                OrganizationName = d.Organization.Name,
                ParentDepartmentId = d.ParentDepartmentId,
                ParentDepartmentName = d.ParentDepartment?.Name,
                IsActive = d.IsActive
            };
        }

        public async Task<DepartmentDetailDto> CreateAsync(DepartmentDetailDto dto)
        {
            var dept = new Department
            {
                Name = dto.Name,
                Description = dto.Description,
                Code = dto.Code,
                OrganizationId = dto.OrganizationId,
                ParentDepartmentId = dto.ParentDepartmentId,
                IsActive = dto.IsActive
            };
            _context.Departments.Add(dept);
            await _context.SaveChangesAsync();
            dto.Id = dept.Id;
            return dto;
        }

        public async Task<DepartmentDetailDto> UpdateAsync(int id, DepartmentDetailDto dto)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) throw new KeyNotFoundException("Department not found");

            dept.Name = dto.Name;
            dept.Description = dto.Description;
            dept.Code = dto.Code;
            dept.OrganizationId = dto.OrganizationId;
            dept.ParentDepartmentId = dto.ParentDepartmentId;
            dept.IsActive = dto.IsActive;
            await _context.SaveChangesAsync();
            dto.Id = id;
            return dto;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var dept = await _context.Departments.FindAsync(id);
            if (dept == null) return false;
            _context.Departments.Remove(dept);
            await _context.SaveChangesAsync();
            return true;
        }
    }
}
