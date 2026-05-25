using Microsoft.EntityFrameworkCore;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Domain.Enums;
using WorkflowHub.Domain.Entities;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.Infrastructure.Services;

public class DailyDigestService
{
    private readonly AppDbContext _context;

    public DailyDigestService(AppDbContext context)
    {
        _context = context;
    }

    // GENERATE + SAVE DIGEST
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

        // EST TIME COVERSION
        var timeZoneId = OperatingSystem.IsWindows()
            ? "Eastern Standard Time"
            : "America/New_York";

        var est = TimeZoneInfo.FindSystemTimeZoneById(timeZoneId);

        var estTime = TimeZoneInfo.ConvertTimeFromUtc(
            DateTime.UtcNow,
            est
        );

        var content =
$"""
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

    // GET ALL DIGESTS
    public async Task<List<DailyDigest>> GetDigests()
    {
        return await _context.DailyDigests
            .OrderByDescending(d => d.GeneratedAt)
            .ToListAsync();
    }
}
