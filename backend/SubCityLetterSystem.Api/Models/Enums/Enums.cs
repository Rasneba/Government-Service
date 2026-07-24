namespace SubCityLetterSystem.Api.Models.Enums
{
    public enum UserRole
    {
        SystemAdministrator,
        SubCityAdministrator,
        PoliceAdministrator,
        DepartmentOfficer,
        Clerk,
        ReadOnlyUser
    }

    public enum LetterPriority
    {
        Low,
        Normal,
        High,
        Urgent
    }

    public enum LetterStatus
    {
        Draft,
        Submitted,
        Approved,
        Sent,
        Received,
        Closed,
        Rejected
    }

    public enum NotificationType
    {
        Dashboard,
        Email,
        SMS
    }

    public enum ApplicationStatus
    {
        Draft,
        Submitted,
        UnderReview,
        DocumentVerification,
        PaymentPending,
        PoliceVerification,
        SupervisorApproval,
        Approved,
        Rejected,
        Completed,
        Cancelled,
        Archived
    }

    public enum WorkflowStepType
    {
        Submission,
        Verification,
        DocumentValidation,
        SupervisorReview,
        PoliceVerification,
        Approval,
        DocumentGeneration,
        Notification
    }

    public enum StepExecutionStatus
    {
        Pending,
        InProgress,
        Completed,
        Rejected
    }

    public enum ComplaintStatus
    {
        Open,
        InProgress,
        Resolved,
        Closed,
        Reopened
    }

    public enum AppointmentStatus
    {
        Scheduled,
        Confirmed,
        Completed,
        Cancelled,
        NoShow
    }
}