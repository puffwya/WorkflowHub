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

using TaskStatus = WorkflowHub.Domain.Enums.TaskStatus;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/tasks")]
[Authorize]
public class TasksController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ActivityLogService _activityLogService;

    public TasksController(
        AppDbContext context,
        ActivityLogService activityLogService)
    {
        _context = context;
        _activityLogService = activityLogService;
    }

    // =========================
    // CREATE TASK
    // =========================
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

        if (project.IsArchived)
            return BadRequest("Cannot add tasks to archived project");

        if (role != Roles.Admin &&
            project.OwnerId != Guid.Parse(userId))
            return Forbid();

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
            DueDate = DateTime.SpecifyKind(request.DueDate, DateTimeKind.Utc),
            ProjectId = request.ProjectId,
            AssignedUserId = request.AssignedUserId,
            Status = TaskStatus.ToDo,
            Priority = request.Priority
        };

        _context.Tasks.Add(task);
        await _context.SaveChangesAsync();

        return Ok(task);
    }

    // =========================
    // GET TASKS
    // =========================
    [HttpGet]
    public async Task<IActionResult> GetTasks(
        [FromQuery] TaskStatus? status,
        [FromQuery] Guid? userId,
        [FromQuery] string? priority,
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        var query = _context.Tasks.AsQueryable();

        if (status.HasValue)
            query = query.Where(t => t.Status == status.Value);

        if (userId.HasValue)
            query = query.Where(t => t.AssignedUserId == userId);

        if (!string.IsNullOrEmpty(priority))
            query = query.Where(t => t.Priority == priority);

        if (!string.IsNullOrWhiteSpace(search))
            query = query.Where(t =>
                t.Title.Contains(search) ||
                t.Description.Contains(search));

        var totalCount = await query.CountAsync();

        var tasks = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                AssignedUserId = t.AssignedUserId,
                Status = t.Status,
                Priority = t.Priority
            })
            .ToListAsync();

        return Ok(new { items = tasks, totalCount, page, pageSize });
    }

    // =========================
    // GET SINGLE TASK
    // =========================
    [HttpGet("{id}")]
    public async Task<IActionResult> GetTask(Guid id)
    {
        var task = await _context.Tasks
            .Where(t => t.Id == id)
            .Select(t => new TaskDto
            {
                Id = t.Id,
                Title = t.Title,
                Description = t.Description,
                DueDate = t.DueDate,
                ProjectId = t.ProjectId,
                AssignedUserId = t.AssignedUserId,
                Status = t.Status,
                Priority = t.Priority
            })
            .FirstOrDefaultAsync();

        if (task == null)
            return NotFound();

        return Ok(task);
    }

    // =========================
    // GET TASKS BY PROJECT
    // =========================
    [HttpGet("project/{projectId}")]
    public async Task<IActionResult> GetTasksByProject(Guid projectId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null)
            return Unauthorized();

        var uid = Guid.Parse(userId);

        var project = await _context.Projects
            .Include(p => p.ProjectUsers)
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
            return NotFound();

        // ADMIN CAN SEE EVERYTHING
        bool isAdmin = role == Roles.Admin;

        // OWNER OR MEMBER OF PROJECT
        bool isOwner = project.OwnerId == uid;

        bool isMember = project.ProjectUsers.Any(pu => pu.UserId == uid);

        if (!isAdmin && !isOwner && !isMember)
            return Forbid();

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
                Status = t.Status,
                Priority = t.Priority
            })
            .ToListAsync();

        return Ok(tasks);
    }

    // =========================
    // CREATE STATUS CHANGE REQUEST
    // =========================
    [HttpPost("{taskId}/status-request")]
    public async Task<IActionResult> CreateStatusRequest(Guid taskId, [FromBody] TaskStatus requestedStatus)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var task = await _context.Tasks
            .Include(t => t.Project)
                .ThenInclude(p => p.ProjectUsers)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
            return NotFound();

        var uid = Guid.Parse(userId);

        bool inProject =
            task.Project.OwnerId == uid ||
            task.Project.ProjectUsers.Any(pu => pu.UserId == uid);

        if (!inProject)
            return Forbid();

        var request = new TaskStatusChangeRequest
        {
            Id = Guid.NewGuid(),
            TaskId = taskId,
            RequestedByUserId = uid,
            RequestedStatus = requestedStatus,
            Status = RequestStatus.Pending,
            CreatedAt = DateTime.UtcNow
        };

        _context.TaskStatusChangeRequests.Add(request);
        await _context.SaveChangesAsync();

        return Ok(request);
    }

    [HttpGet("{taskId}/status-requests")]
    public async Task<IActionResult> GetStatusRequests(Guid taskId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var uid = Guid.Parse(userId);

        var task = await _context.Tasks
            .Include(t => t.Project)
                .ThenInclude(p => p.ProjectUsers)
            .FirstOrDefaultAsync(t => t.Id == taskId);

        if (task == null)
            return NotFound();

        bool inProject =
            task.Project.OwnerId == uid ||
            task.Project.ProjectUsers.Any(pu => pu.UserId == uid);

        if (!inProject)
            return Forbid();

        var requests = await _context.TaskStatusChangeRequests
            .Where(r => r.TaskId == taskId)
            .OrderByDescending(r => r.CreatedAt)
            .Select(r => new
            {
                r.Id,
                r.TaskId,
                r.RequestedStatus,
                r.Status,
                r.CreatedAt,
                r.RequestedByUserId
            })
            .ToListAsync();

        return Ok(requests);
    }

    // =========================
    // APPROVE REQUEST
    // =========================
    [HttpPost("status-requests/{requestId}/approve")]
    public async Task<IActionResult> ApproveRequest(Guid requestId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var request = await _context.TaskStatusChangeRequests
            .Include(r => r.Task)
                .ThenInclude(t => t.Project)
                    .ThenInclude(p => p.ProjectUsers)
            .FirstOrDefaultAsync(r => r.Id == requestId);

        if (request == null)
            return NotFound();

        var uid = Guid.Parse(userId);
        var project = request.Task.Project;

        bool inProject =
            project.OwnerId == uid ||
            project.ProjectUsers.Any(pu => pu.UserId == uid);

        if (!inProject)
            return Forbid();

        request.Status = RequestStatus.Approved;
        request.Task.Status = request.RequestedStatus;

        await _activityLogService.LogAsync(
            action: "TaskStatusApproved",
            details: $"Task {request.TaskId} set to {request.RequestedStatus}",
            userId: uid,
            taskId: request.TaskId
        );

        await _context.SaveChangesAsync();

        return Ok(request);
    }

    // =========================
    // REJECT REQUEST
    // =========================
    [HttpPost("status-requests/{requestId}/reject")]
    public async Task<IActionResult> RejectRequest(Guid requestId)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var request = await _context.TaskStatusChangeRequests
            .Include(r => r.Task)
                .ThenInclude(t => t.Project)
                    .ThenInclude(p => p.ProjectUsers)
            .FirstOrDefaultAsync(r => r.Id == requestId);

        if (request == null)
            return NotFound();

        var uid = Guid.Parse(userId);
        var project = request.Task.Project;

        bool inProject =
            project.OwnerId == uid ||
            project.ProjectUsers.Any(pu => pu.UserId == uid);

        if (!inProject)
            return Forbid();

        request.Status = RequestStatus.Rejected;

        await _context.SaveChangesAsync();

        return Ok(request);
    }

    // =========================
    // DELETE TASK
    // =========================
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteTask(Guid id)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null || role == null)
            return Unauthorized();

        var uid = Guid.Parse(userId);

        var task = await _context.Tasks
            .Include(t => t.Project)
            .FirstOrDefaultAsync(t => t.Id == id);

        if (task == null)
            return NotFound();

        if (task.Project.IsArchived)
            return BadRequest("Cannot modify archived project");

        if (role == Roles.Employee && task.Project.OwnerId != uid)
            return Forbid();

        await _activityLogService.LogAsync(
            action: "TaskDeleted",
            details: $"Deleted task '{task.Title}'",
            userId: uid,
            taskId: task.Id
        );

        _context.Tasks.Remove(task);
        await _context.SaveChangesAsync();

        return Ok();
    }
}
