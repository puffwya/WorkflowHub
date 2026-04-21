namespace WorkflowHub.Domain.Entities;

public class Project
{
    public Guid Id { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Description { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Navigation
    public ICollection<TaskItem> Tasks { get; set; } = new List<TaskItem>();
}
