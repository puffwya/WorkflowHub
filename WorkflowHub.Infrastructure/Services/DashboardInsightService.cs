using Microsoft.EntityFrameworkCore;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Domain.Constants;
using WorkflowHub.Domain.Enums;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.Infrastructure.Services;

public class DashboardInsightService
{
    private readonly AppDbContext _context;
    private readonly AIService _aiService;

    public DashboardInsightService(
        AppDbContext context,
        AIService aiService)
    {
        _context = context;
        _aiService = aiService;
    }

    public async Task<string> GenerateForUser(Guid userId)
    {
        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == userId
                );

        if (user == null)
        {
            return "No report available.";
        }

        var assignedTasks =
            await _context.Tasks
                .Where(t => t.AssignedUserId == userId)
                .ToListAsync();

        var todo =
            assignedTasks.Count(
                t => t.Status == TaskStatus.ToDo
            );

        var inProgress =
            assignedTasks.Count(
                t => t.Status == TaskStatus.InProgress
            );

        var review =
            assignedTasks.Count(
                t => t.Status == TaskStatus.Review
            );

        var done =
            assignedTasks.Count(
                t => t.Status == TaskStatus.Done
            );

        var overdue =
            assignedTasks.Count(
                t =>
                    t.DueDate < DateTime.UtcNow &&
                    t.Status != TaskStatus.Done
            );

        var projectCount =
            await _context.ProjectUsers
                .CountAsync(
                    p => p.UserId == userId
                );

        var prompt =
$"""
User Role: {user.Role}

Assigned Projects: {projectCount}

Tasks:
Todo: {todo}
In Progress: {inProgress}
Review: {review}
Done: {done}
Overdue: {overdue}

Generate a personalized dashboard report.

Keep under 150 words.

Be encouraging and actionable.

Use markdown.
""";

        return await _aiService.GenerateDashboardReport(userId, role, taskJson);
    }
}
