using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Infrastructure.Services;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly DashboardInsightService _dashboardInsightService;

    public DashboardController(
        AppDbContext context,
        DashboardInsightService dashboardInsightService)
    {
        _context = context;
        _dashboardInsightService = dashboardInsightService;
    }

    [HttpGet("task-summary")]
    [AllowAnonymous]
    public async Task<IActionResult> GetTaskSummary()
    {
        var tasks = await _context.Tasks.ToListAsync();

        var result = new
        {
            todo = tasks.Count(t => t.Status == TaskStatus.ToDo),
            inProgress = tasks.Count(t => t.Status == TaskStatus.InProgress),
            review = tasks.Count(t => t.Status == TaskStatus.Review),
            done = tasks.Count(t => t.Status == TaskStatus.Done)
        };

        return Ok(result);
    }

    // AI-style dashboard report (role-aware, placeholder AI)
    [HttpGet("report")]
    public async Task<IActionResult> GetDashboardReport()
    {
        var userIdClaim =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (!Guid.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var report =
            await _dashboardInsightService.GenerateForUser(userId);

        return Ok(new
        {
            report
        });
    }
}
