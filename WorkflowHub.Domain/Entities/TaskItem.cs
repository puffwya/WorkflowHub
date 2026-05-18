namespace WorkflowHub.Domain.Entities;
using WorkflowHub.Domain.Enums;

public class TaskItem
{
    public Guid Id { get; set; }

    public string Title { get; set; }
        = string.Empty;

    public string Description { get; set; }
        = string.Empty;

    public DateTime DueDate { get; set; }
        = DateTime.UtcNow;

    public TaskStatus Status { get; set; }
        = TaskStatus.ToDo;

    public string Priority { get; set; }
        = "Medium";

    public Guid ProjectId { get; set; }

    public Guid? AssignedUserId { get; set; }

    public Project Project { get; set; }
        = null!;

    public User? AssignedUser { get; set; }

    public ICollection<TaskStatusChangeRequest>
        StatusRequests { get; set; }
        = new List<TaskStatusChangeRequest>();
}
