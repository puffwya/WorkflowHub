using WorkflowHub.Domain.Enums;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

public class TaskDto
{
    public Guid Id { get; set; }
    public string Title { get; set; } = "";
    public string Description { get; set; } = "";
    public DateTime DueDate { get; set; }

    public Guid ProjectId { get; set; }
    public Guid? AssignedUserId { get; set; }

    public TaskStatus Status { get; set; }
}
