using WorkflowHub.Domain.Entities;
using WorkflowHub.Infrastructure.Data;

namespace WorkflowHub.Infrastructure.Services;

public class ActivityLogService
{
    private readonly AppDbContext _context;

    public ActivityLogService(AppDbContext context)
    {
        _context = context;
    }

    public async Task LogAsync(
        string action,
        string details,
        Guid userId,
        Guid? taskId = null
    )
    {
        var log = new ActivityLog
        {
            Id = Guid.NewGuid(),
            Action = action,
            Details = details,
            UserId = userId,
            TaskId = taskId,
            CreatedAt = DateTime.UtcNow
        };

        _context.ActivityLogs.Add(log);
        await _context.SaveChangesAsync();
    }
}
