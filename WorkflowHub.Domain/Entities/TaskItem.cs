namespace WorkflowHub.Domain.Entities;

public class TaskItem
{
    public Guid Id { get; set; }

    public string Title { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime DueDate { get; set; }

    // Foreign Keys
    public Guid ProjectId { get; set; }
    public Guid? AssignedUserId { get; set; }

    // Navigation
    public Project Project { get; set; } = null!;
    public User? AssignedUser { get; set; }
}
