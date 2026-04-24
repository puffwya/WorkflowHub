using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Infrastructure.Services;
using WorkflowHub.Domain.Entities;
using WorkflowHub.API.DTOs;
using WorkflowHub.Domain.Constants;
using WorkflowHub.Domain.Enums;
using WorkflowHub.Application.Services;

using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ActivityLogService _activityLogService;

    public TasksController(AppDbContext context, ActivityLogService activityLogService)
    {
        _context = context;
        _activityLogService = activityLogService;
    }

    [HttpPost]
    public async Task<IActionResult> CreateTask(CreateTaskRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null)
            return Unauthorized();

        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == request.ProjectId);

        if (project == null)
            return NotFound("Project not found");

        // SECURITY CHECK
        if (role != Roles.Admin && project.OwnerId != Guid.Parse(userId))
            return Forbid();

        // Validate assigned user exists
        if (request.AssignedUserId != null)
        {
            var userExists = await _context.Users
                .AnyAsync(u => u.Id == request.AssignedUserId);

            if (!userExists)
                return BadRequest("Assigned user does not exist");
        }

        var task = new TaskItem
        {
            Id = Guid.NewGuid(),
            Title = request.Title,
            Description = request.Description,
            DueDate = request.DueDate,
            ProjectId = request.ProjectId,
            AssignedUserId = request.AssignedUserId,
            Status = TaskStatus.ToDo
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        var result = new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            AssignedUserId = task.AssignedUserId,
            Status = task.Status
        };

        return Ok(result);
    }

    [HttpGet]
    public async Task<IActionResult> GetTasks()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null)
            return Unauthorized();

        IQueryable<TaskItem> query = _context.Tasks;

        if (role != Roles.Admin)
        {
            query = query.Where(t => t.Project.OwnerId == Guid.Parse(userId));
        }

        var tasks = await query
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                AssignedUserId = t.AssignedUserId,
                Status = t.Status
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("user/{userId}")]
    public async Task<IActionResult> GetTasksByUser(Guid userId)
    {
        var tasks = await _context.Tasks
            .Where(t => t.AssignedUserId == userId)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                AssignedUserId = t.AssignedUserId,
                Status = t.Status
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetTasksByProject(Guid projectId)
    {
        var tasks = await _context.Tasks
            .Where(t => t.ProjectId == projectId)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                AssignedUserId = t.AssignedUserId,
                Status = t.Status
            })
            .ToListAsync();

        return Ok(tasks);
    }

    [HttpPut("{id}/status")]
    [Authorize]
    public async Task<IActionResult> UpdateStatus(Guid id, TaskStatus status)
    {
        var task = await _context.Tasks.FindAsync(id);

        if (task == null)
            return NotFound();

        var oldStatus = task.Status;

        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null || role == null)
            return Unauthorized();

        if (role == Roles.Employee &&
            task.AssignedUserId?.ToString() != userId)
        {
            return Forbid();
        }

        try
        {
            TaskWorkflowService.EnforceTransition(task.Status, status, role);
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(ex.Message);
        }

        task.Status = status;

        await _context.SaveChangesAsync();

        await _activityLogService.LogAsync(
            action: "TaskStatusChanged",
            details: $"Status changed from {oldStatus} to {status}",
            userId: Guid.Parse(userId),
            taskId: task.Id
        );

        return Ok(new TaskDto
        {
            Id = task.Id,
            Title = task.Title,
            Description = task.Description,
            DueDate = task.DueDate,
            ProjectId = task.ProjectId,
            AssignedUserId = task.AssignedUserId
        });
    }
}
