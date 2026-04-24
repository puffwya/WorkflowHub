using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowHub.API.DTOs;
using WorkflowHub.Infrastructure.Data;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/activity")]
public class ActivityLogsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ActivityLogsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetLogs()
    {
        var logs = await _context.ActivityLogs
            .OrderByDescending(a => a.CreatedAt)
            .Take(50)
            .Select(a => new ActivityLogDto
            {
                Id = a.Id,
                Action = a.Action,
                Details = a.Details,
                CreatedAt = a.CreatedAt,
                UserId = a.UserId,
                TaskId = a.TaskId
            })
            .ToListAsync();

        return Ok(logs);
    }
}
