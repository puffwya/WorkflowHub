using System;

using WorkflowHub.Domain.Enums;

namespace WorkflowHub.Domain.Entities;

public class ProjectUser
{
    public Guid ProjectId { get; set; }
    public Project? Project { get; set; }

    public Guid UserId { get; set; }
    public User? User { get; set; }

    public ProjectRole Role { get; set; } = ProjectRole.Employee;
}
