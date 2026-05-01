using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowHub.API.DTOs;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Domain.Constants;
using System.Security.Claims;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/activity")]
[Authorize]
public class ActivityLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ActivityLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetLogs(
        [FromQuery] Guid? taskId,
        [FromQuery] Guid? userId,
        [FromQuery] string? action
    )
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;
        var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (role == null || currentUserId == null)
            return Unauthorized();

        var query = _context.ActivityLogs.AsQueryable();

        // ROLE FILTERING
        if (role == Roles.Admin)
        {
            // see everything
        }
        else if (role == Roles.Manager)
        {
            var managerId = Guid.Parse(currentUserId);

            // logs for tasks in manager's projects OR assigned tasks
            query = query.Where(log =>
                _context.Tasks.Any(t =>
                    t.Id == log.TaskId &&
                    (t.AssignedUserId == managerId ||
                     _context.Projects.Any(p =>
                         p.Id == t.ProjectId && p.OwnerId == managerId))
                )
            );
        }
        else
        {
            return Forbid();
        }

        // FILTERS
        if (taskId.HasValue)
            query = query.Where(l => l.TaskId == taskId);

        if (userId.HasValue)
            query = query.Where(l => l.UserId == userId);

        if (!string.IsNullOrEmpty(action))
            query = query.Where(l => l.Action.Contains(action));

        var logs = await query
            .OrderByDescending(l => l.CreatedAt)
            .Take(100)
            .Select(l => new ActivityLogDto
            {
                Id = l.Id,
                Action = l.Action,
                Details = l.Details,
                CreatedAt = l.CreatedAt,
                UserId = l.UserId,
                TaskId = l.TaskId,
                ProjectId = l.ProjectId,

                Username = _context.Users
                    .Where(u => u.Id == l.UserId)
                    .Select(u => u.Username)
                    .FirstOrDefault()
            })
            .ToListAsync();

        return Ok(logs);
    }
}
