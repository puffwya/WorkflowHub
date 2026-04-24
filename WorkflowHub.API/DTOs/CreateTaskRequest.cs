namespace WorkflowHub.API.DTOs;

public class CreateTaskRequest
{
    public string Title { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public DateTime DueDate { get; set; }
    public string Priority { get; set; } = "Medium";

    public Guid ProjectId { get; set; }
    public Guid? AssignedUserId { get; set; }
}
