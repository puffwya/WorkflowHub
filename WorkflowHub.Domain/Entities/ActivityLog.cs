namespace WorkflowHub.Domain.Entities;

public class ActivityLog
{
    public Guid Id { get; set; }

    public string Action { get; set; } = ""; 
    // e.g. "TaskCreated", "StatusChanged", "CommentAdded"

    public string Details { get; set; } = "";
    // e.g. "Changed from ToDo to InProgress"

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Relationships
    public Guid UserId { get; set; }
    public User User { get; set; } = null!;

    public Guid? TaskId { get; set; }
    public TaskItem? Task { get; set; }
}
