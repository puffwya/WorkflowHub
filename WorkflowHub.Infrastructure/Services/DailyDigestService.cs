using Microsoft.EntityFrameworkCore;
using WorkflowHub.Infrastructure.Data;

using TaskStatus =
    WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.Infrastructure.Services;

public class DailyDigestService
{
    private readonly AppDbContext _context;

    public DailyDigestService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> Generate()
    {
        var totalTasks =
            await _context.Tasks.CountAsync();

        var completedTasks =
            await _context.Tasks
                .CountAsync(t =>
                    t.Status == TaskStatus.Done);

        var overdueTasks =
            await _context.Tasks
                .CountAsync(t =>
                    t.DueDate < DateTime.UtcNow &&
                    t.Status != TaskStatus.Done);

        var totalProjects =
            await _context.Projects
                .CountAsync();

        var digest =
$"""
WorkflowHub Daily Digest
Generated: {DateTime.UtcNow}

Projects: {totalProjects}

Tasks: {totalTasks}

Completed: {completedTasks}

Overdue: {overdueTasks}
""";

        return digest;
    }
}
