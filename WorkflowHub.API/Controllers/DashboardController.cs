using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowHub.Infrastructure.Data;
using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/dashboard")]
[Authorize]
public class DashboardController : ControllerBase
{
    private readonly AppDbContext _context;

    public DashboardController(AppDbContext context)
    {
        _context = context;
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
}
