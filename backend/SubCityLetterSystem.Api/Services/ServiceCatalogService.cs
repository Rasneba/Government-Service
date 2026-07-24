using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Data;
using SubCityLetterSystem.Api.DTOs.Services;
using SubCityLetterSystem.Api.Models.Entities;

namespace SubCityLetterSystem.Api.Services
{
    public class ServiceCatalogService : IServiceCatalogService
    {
        private readonly AppDbContext _context;
        public ServiceCatalogService(AppDbContext context) { _context = context; }

        public async Task<List<ServiceCategoryDto>> GetCategoriesAsync()
        {
            return await _context.ServiceCategories
                .Where(c => c.IsActive)
                .OrderBy(c => c.DisplayOrder)
                .Select(c => new ServiceCategoryDto
                {
                    Id = c.Id, Name = c.Name, Description = c.Description, Icon = c.Icon,
                    DisplayOrder = c.DisplayOrder, IsActive = c.IsActive,
                    ServiceCount = c.ServiceTypes.Count(s => s.IsActive)
                }).ToListAsync();
        }

        public async Task<List<ServiceTypeDto>> GetServiceTypesAsync(int? categoryId = null)
        {
            var query = _context.ServiceTypes.Include(s => s.Category).Where(s => s.IsActive).AsQueryable();
            if (categoryId.HasValue) query = query.Where(s => s.CategoryId == categoryId.Value);

            return await query.Select(s => new ServiceTypeDto
            {
                Id = s.Id, Name = s.Name, Description = s.Description, CategoryId = s.CategoryId,
                CategoryName = s.Category != null ? s.Category.Name : null, Code = s.Code,
                EstimatedDays = s.EstimatedDays, Fee = s.Fee,
                RequiresPoliceVerification = s.RequiresPoliceVerification,
                RequiredDocuments = s.RequiredDocuments, IsActive = s.IsActive,
                ApplicationCount = s.Applications.Count()
            }).ToListAsync();
        }

        public async Task<ServiceTypeDto?> GetServiceTypeByIdAsync(int id)
        {
            return await _context.ServiceTypes
                .Include(s => s.Category)
                .Include(s => s.WorkflowDefinitions).ThenInclude(w => w.Steps.OrderBy(st => st.StepOrder))
                .Where(s => s.Id == id)
                .Select(s => new ServiceTypeDto
                {
                    Id = s.Id, Name = s.Name, Description = s.Description, CategoryId = s.CategoryId,
                    CategoryName = s.Category != null ? s.Category.Name : null, Code = s.Code,
                    EstimatedDays = s.EstimatedDays, Fee = s.Fee,
                    RequiresPoliceVerification = s.RequiresPoliceVerification,
                    RequiredDocuments = s.RequiredDocuments, IsActive = s.IsActive,
                    ApplicationCount = s.Applications.Count(),
                    WorkflowSteps = s.WorkflowDefinitions.SelectMany(w => w.Steps).OrderBy(st => st.StepOrder).Select(st => new WorkflowStepConfigDto
                    {
                        Id = st.Id, Name = st.Name, Description = st.Description, StepOrder = st.StepOrder,
                        StepType = st.StepType.ToString(), AssignedRole = st.AssignedRole,
                        AssignedDepartmentId = st.AssignedDepartmentId, IsAutoStep = st.IsAutoStep, SLAHours = st.SLAHours
                    }).ToList()
                }).FirstOrDefaultAsync();
        }

        public async Task<ServiceTypeDto> CreateServiceTypeAsync(ServiceTypeDto dto)
        {
            var entity = new ServiceType
            {
                Name = dto.Name, Description = dto.Description, CategoryId = dto.CategoryId,
                Code = dto.Code, EstimatedDays = dto.EstimatedDays, Fee = dto.Fee,
                RequiresPoliceVerification = dto.RequiresPoliceVerification,
                RequiredDocuments = dto.RequiredDocuments, IsActive = dto.IsActive
            };
            _context.ServiceTypes.Add(entity);
            await _context.SaveChangesAsync();
            dto.Id = entity.Id;
            return dto;
        }

        public async Task<ServiceTypeDto> UpdateServiceTypeAsync(int id, ServiceTypeDto dto)
        {
            var entity = await _context.ServiceTypes.FindAsync(id);
            if (entity == null) throw new KeyNotFoundException("Service type not found");
            entity.Name = dto.Name; entity.Description = dto.Description; entity.CategoryId = dto.CategoryId;
            entity.EstimatedDays = dto.EstimatedDays; entity.Fee = dto.Fee;
            entity.RequiresPoliceVerification = dto.RequiresPoliceVerification;
            entity.RequiredDocuments = dto.RequiredDocuments; entity.IsActive = dto.IsActive;
            entity.UpdatedAt = DateTime.UtcNow;
            await _context.SaveChangesAsync();
            dto.Id = id;
            return dto;
        }
    }
}
