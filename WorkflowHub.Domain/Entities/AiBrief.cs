namespace WorkflowHub.Domain.Entities;

public class AiBrief
{
    public Guid Id { get; set; }

    public Guid UserId { get; set; }

    public string Content { get; set; } = string.Empty;

    public DateTime GeneratedAt { get; set; }

    public User User { get; set; } = null!;
}
