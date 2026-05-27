using Microsoft.EntityFrameworkCore;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Domain.Constants;

namespace WorkflowHub.Infrastructure.Services;

public class DashboardInsightService
{
    private readonly AppDbContext _context;

    public DashboardInsightService(
        AppDbContext context)
    {
        _context = context;
    }

    public async Task<string> GenerateForUser(Guid userId)
    {
        var user =
            await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (user == null)
        {
            return "No report available.";
        }

        var assignedTasks =
            await _context.Tasks
            .CountAsync(t =>
                t.AssignedUserId == userId);

        var overdueTasks =
            await _context.Tasks
            .CountAsync(t =>
                t.AssignedUserId == userId &&
                t.DueDate < DateTime.UtcNow);

        var projectCount =
            await _context.ProjectUsers
            .CountAsync(p =>
                p.UserId == userId);

        if (user.Role == Roles.Admin)
        {
            var totalUsers =
                await _context.Users.CountAsync();

            var totalProjects =
                await _context.Projects.CountAsync();

            return
$"""
# Daily Admin Report

You currently oversee:

• {totalUsers} users

• {totalProjects} projects

• {assignedTasks} assigned tasks

System activity appears healthy.

Suggestion:
Review overdue work and monitor team productivity trends.
""";
        }

        if (user.Role == Roles.Manager)
        {
            return
var prompt = $"""
User Role: {role}

Assigned Projects: {projectCount}

Tasks:
Todo: {todo}
In Progress: {inProgress}
Review: {review}
Done: {done}

Generate a personalized dashboard report.
Keep under 150 words.
Use markdown.
""";

return await _aiService.GenerateInsight(prompt);
    }
}
