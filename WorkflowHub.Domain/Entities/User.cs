namespace WorkflowHub.Domain.Entities;
using WorkflowHub.Domain.Constants;

public class User
{
    public Guid Id { get; set; }

    public string Username { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public string PasswordHash { get; set; } = string.Empty;

    public string Role { get; set; } = Roles.Employee;

    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();

    public ICollection<ProjectUser> ProjectUsers { get; set; } = new List<ProjectUser>();
}
