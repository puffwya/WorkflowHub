using Microsoft.EntityFrameworkCore;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Domain.Enums;
using WorkflowHub.Domain.Entities;

namespace WorkflowHub.Infrastructure.Services;

public class DailyDigestService
{
    private readonly AppDbContext _context;

    public DailyDigestService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<DailyDigest> Generate()
    {
        var totalTasks = await _context.Tasks.CountAsync();

        var completedTasks = await _context.Tasks
            .CountAsync(t => t.Status == TaskStatus.Done);

        var overdueTasks = await _context.Tasks
            .CountAsync(t =>
                t.DueDate < DateTime.UtcNow &&
                t.Status != TaskStatus.Done);

        var totalProjects = await _context.Projects.CountAsync();

        // Convert to EST safely
        var est = TimeZoneInfo.FindSystemTimeZoneById(
            OperatingSystem.IsWindows()
                ? "Eastern Standard Time"
                : "America/New_York"
        );

        var estTime = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            est
        );

        var content = $"""
WorkflowHub Daily Digest
Generated: {estTime}

Projects: {totalProjects}

Tasks: {totalTasks}

Completed: {completedTasks}

Overdue: {overdueTasks}
""";

        var digest = new DailyDigest
        {
            Id = Guid.NewGuid(),
            GeneratedAt = estTime,
            Content = content
        };

        _context.DailyDigests.Add(digest);
        await _context.SaveChangesAsync();

        return digest;
    }
}
