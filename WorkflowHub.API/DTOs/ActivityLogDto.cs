public class ActivityLogDto
{
    public Guid Id { get; set; }
    public string Action { get; set; } = "";
    public string Details { get; set; } = "";
    public DateTime CreatedAt { get; set; }
    public string? Username { get; set; }

    public Guid UserId { get; set; }
    public Guid? TaskId { get; set; }
}
