using WorkflowHub.Domain.Enums;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.Domain.Entities;

public class TaskStatusChangeRequest
{
    public Guid Id { get; set; }

    public Guid TaskId { get; set; }
    public TaskItem Task { get; set; } = null!;

    public Guid RequestedByUserId { get; set; }
    public User RequestedByUser { get; set; } = null!;

    public TaskStatus CurrentStatus { get; set; }

    public TaskStatus RequestedStatus { get; set; }

    public RequestStatus Status { get; set; }
        = RequestStatus.Pending;

    public Guid? ReviewedByUserId { get; set; }

    public User? ReviewedByUser { get; set; }

    public DateTime CreatedAt { get; set; }
        = DateTime.UtcNow;

    public DateTime? ReviewedAt { get; set; }
}
