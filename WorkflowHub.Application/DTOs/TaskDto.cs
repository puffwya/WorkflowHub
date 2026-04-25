using WorkflowHub.Domain.Enums;

namespace WorkflowHub.API.DTOs;

public class TaskDto
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    public Guid ProjectId { get; set; }

    public Guid? AssignedUserId { get; set; }

    public WorkflowHub.Domain.Enums.TaskStatus Status { get; set; }

    public string Priority { get; set; } = string.Empty;
}
