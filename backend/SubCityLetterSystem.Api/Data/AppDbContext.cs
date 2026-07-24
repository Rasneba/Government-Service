using Microsoft.EntityFrameworkCore;
using SubCityLetterSystem.Api.Models.Entities;
using SubCityLetterSystem.Api.Models.Enums;

namespace SubCityLetterSystem.Api.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users => Set<User>();
        public DbSet<Organization> Organizations => Set<Organization>();
        public DbSet<Department> Departments => Set<Department>();
        public DbSet<Letter> Letters => Set<Letter>();
        public DbSet<LetterAttachment> LetterAttachments => Set<LetterAttachment>();
        public DbSet<LetterMovement> LetterMovements => Set<LetterMovement>();
        public DbSet<LetterComment> LetterComments => Set<LetterComment>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();

        public DbSet<Citizen> Citizens => Set<Citizen>();
        public DbSet<ServiceCategory> ServiceCategories => Set<ServiceCategory>();
        public DbSet<ServiceType> ServiceTypes => Set<ServiceType>();
        public DbSet<WorkflowDefinition> WorkflowDefinitions => Set<WorkflowDefinition>();
        public DbSet<WorkflowStep> WorkflowSteps => Set<WorkflowStep>();
        public DbSet<Application> Applications => Set<Application>();
        public DbSet<ApplicationStepHistory> ApplicationStepHistories => Set<ApplicationStepHistory>();
        public DbSet<ApplicationDocument> ApplicationDocuments => Set<ApplicationDocument>();
        public DbSet<ApplicationNote> ApplicationNotes => Set<ApplicationNote>();
        public DbSet<Complaint> Complaints => Set<Complaint>();
        public DbSet<ComplaintComment> ComplaintComments => Set<ComplaintComment>();
        public DbSet<Feedback> Feedbacks => Set<Feedback>();
        public DbSet<Appointment> Appointments => Set<Appointment>();
        public DbSet<SystemNotification> SystemNotifications => Set<SystemNotification>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(e => e.Username).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.Property(e => e.Role).HasConversion<string>().HasMaxLength(50);
                entity.HasOne(e => e.Organization).WithMany(o => o.Users).HasForeignKey(e => e.OrganizationId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(e => e.Department).WithMany(d => d.Users).HasForeignKey(e => e.DepartmentId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Organization>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
            });

            modelBuilder.Entity<Department>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasOne(e => e.Organization).WithMany(o => o.Departments).HasForeignKey(e => e.OrganizationId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ParentDepartment).WithMany(d => d.ChildDepartments).HasForeignKey(e => e.ParentDepartmentId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Letter>(entity =>
            {
                entity.HasIndex(e => e.LetterNumber).IsUnique();
                entity.Property(e => e.Priority).HasConversion<string>().HasMaxLength(20);
                entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
                entity.HasOne(e => e.Sender).WithMany().HasForeignKey(e => e.SenderId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Receiver).WithMany().HasForeignKey(e => e.ReceiverId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.SenderDepartment).WithMany().HasForeignKey(e => e.SenderDepartmentId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ReceiverDepartment).WithMany().HasForeignKey(e => e.ReceiverDepartmentId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.CreatedBy).WithMany().HasForeignKey(e => e.CreatedById).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ApprovedBy).WithMany().HasForeignKey(e => e.ApprovedById).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<LetterAttachment>(entity =>
            {
                entity.HasOne(e => e.Letter).WithMany(l => l.Attachments).HasForeignKey(e => e.LetterId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.UploadedBy).WithMany().HasForeignKey(e => e.UploadedById).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<LetterMovement>(entity =>
            {
                entity.HasOne(e => e.Letter).WithMany(l => l.Movements).HasForeignKey(e => e.LetterId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.FromUser).WithMany().HasForeignKey(e => e.FromUserId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.ToUser).WithMany().HasForeignKey(e => e.ToUserId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<LetterComment>(entity =>
            {
                entity.HasOne(e => e.Letter).WithMany(l => l.Comments).HasForeignKey(e => e.LetterId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Restrict);
            });

            modelBuilder.Entity<Notification>(entity =>
            {
                entity.Property(e => e.Type).HasConversion<string>().HasMaxLength(20);
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<AuditLog>(entity =>
            {
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Citizen>(entity =>
            {
                entity.HasIndex(e => e.PhoneNumber).IsUnique();
                entity.HasIndex(e => e.Email).IsUnique();
                entity.HasIndex(e => e.NationalId).IsUnique();
            });

            modelBuilder.Entity<ServiceCategory>(entity =>
            {
                entity.HasIndex(e => e.Name).IsUnique();
            });

            modelBuilder.Entity<ServiceType>(entity =>
            {
                entity.HasIndex(e => e.Code).IsUnique();
                entity.HasOne(e => e.Category).WithMany(c => c.ServiceTypes).HasForeignKey(e => e.CategoryId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<WorkflowDefinition>(entity =>
            {
                entity.HasOne(e => e.ServiceType).WithMany(s => s.WorkflowDefinitions).HasForeignKey(e => e.ServiceTypeId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<WorkflowStep>(entity =>
            {
                entity.Property(e => e.StepType).HasConversion<string>().HasMaxLength(50);
                entity.HasOne(e => e.WorkflowDefinition).WithMany(w => w.Steps).HasForeignKey(e => e.WorkflowDefinitionId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<Application>(entity =>
            {
                entity.HasIndex(e => e.ApplicationNumber).IsUnique();
                entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
                entity.HasOne(e => e.ServiceType).WithMany(s => s.Applications).HasForeignKey(e => e.ServiceTypeId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Citizen).WithMany(c => c.Applications).HasForeignKey(e => e.CitizenId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.CurrentStep).WithMany().HasForeignKey(e => e.CurrentStepId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(e => e.AssignedOfficer).WithMany().HasForeignKey(e => e.AssignedOfficerId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ApplicationStepHistory>(entity =>
            {
                entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
                entity.HasOne(e => e.Application).WithMany(a => a.StepHistory).HasForeignKey(e => e.ApplicationId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.WorkflowStep).WithMany().HasForeignKey(e => e.WorkflowStepId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.AssignedToUser).WithMany().HasForeignKey(e => e.AssignedToUserId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ApplicationDocument>(entity =>
            {
                entity.HasOne(e => e.Application).WithMany(a => a.Documents).HasForeignKey(e => e.ApplicationId).OnDelete(DeleteBehavior.Cascade);
            });

            modelBuilder.Entity<ApplicationNote>(entity =>
            {
                entity.HasOne(e => e.Application).WithMany(a => a.Notes).HasForeignKey(e => e.ApplicationId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Complaint>(entity =>
            {
                entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
                entity.HasOne(e => e.Citizen).WithMany().HasForeignKey(e => e.CitizenId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.AssignedToUser).WithMany().HasForeignKey(e => e.AssignedToUserId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<ComplaintComment>(entity =>
            {
                entity.HasOne(e => e.Complaint).WithMany(c => c.Comments).HasForeignKey(e => e.ComplaintId).OnDelete(DeleteBehavior.Cascade);
                entity.HasOne(e => e.User).WithMany().HasForeignKey(e => e.UserId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Feedback>(entity =>
            {
                entity.HasOne(e => e.Citizen).WithMany().HasForeignKey(e => e.CitizenId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Application).WithMany().HasForeignKey(e => e.ApplicationId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Appointment>(entity =>
            {
                entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(50);
                entity.HasOne(e => e.Citizen).WithMany().HasForeignKey(e => e.CitizenId).OnDelete(DeleteBehavior.Restrict);
                entity.HasOne(e => e.Application).WithMany().HasForeignKey(e => e.ApplicationId).OnDelete(DeleteBehavior.SetNull);
                entity.HasOne(e => e.Department).WithMany().HasForeignKey(e => e.DepartmentId).OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<SystemNotification>(entity =>
            {
                entity.HasOne(e => e.Citizen).WithMany().HasForeignKey(e => e.CitizenId).OnDelete(DeleteBehavior.Cascade);
            });
        }
    }
}
