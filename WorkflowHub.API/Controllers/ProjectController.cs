using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Domain.Entities;
using WorkflowHub.API.DTOs;
using WorkflowHub.Domain.Constants;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/projects")]
[Authorize]
public class ProjectsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ProjectsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpPost]
    public async Task<IActionResult> CreateProject(CreateProjectRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null)
            return Unauthorized();

        if (role == Roles.Employee)
            return Forbid();

        var userGuid = Guid.Parse(userId);

        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            OwnerId = userGuid
        };

        _context.Projects.Add(project);

        _context.ActivityLogs.Add(new ActivityLog
        {
            Id = Guid.NewGuid(),
            Action = "Project Created",
            Details = $"Project '{project.Name}' created",
            CreatedAt = DateTime.UtcNow,
            UserId = userGuid,
            TaskId = null,
            ProjectId = project.Id
        });

        await _context.SaveChangesAsync();

        return Ok(project);
    }

    [HttpGet]
    public async Task<IActionResult> GetProjects()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null || role == null)
            return Unauthorized();

        var userGuid = Guid.Parse(userId);

        IQueryable<Project> query = _context.Projects
            .Where(p => !p.IsArchived);

        if (role != Roles.Admin)
        {
            query = query.Where(p =>
                p.OwnerId == userGuid ||
                p.ProjectUsers.Any(pu => pu.UserId == userGuid)
            );
        }

        var projects = await query
            .Select(p => new
            {
                p.Id,
                p.Name,
                p.Description
            })
            .ToListAsync();

        return Ok(projects);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProjectById(Guid id)
    {
        var project = await _context.Projects
            .Where(p => !p.IsArchived)
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound();

        return Ok(project);
    }

    [HttpGet("{projectId}/users")]
    public async Task<IActionResult> GetProjectUsers(Guid projectId)
    {
        var users = await _context.ProjectUsers
            .Where(pu => pu.ProjectId == projectId)
            .Select(pu => new
            {
                pu.User.Id,
                pu.User.Username,
                pu.User.Role
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("{projectId}/assign/{userId}")]
    public async Task<IActionResult> AssignUser(Guid projectId, Guid userId)
    {
        var currentUserId =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var role =
            User.FindFirst(ClaimTypes.Role)?.Value;

        if (currentUserId == null || role == null)
            return Unauthorized();

        var currentUserGuid = Guid.Parse(currentUserId);

        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
            return NotFound();

        if (project.IsArchived)
            return BadRequest("Cannot modify archived project");

        var userToAssign = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (userToAssign == null)
            return NotFound();

        if (role == Roles.Employee)
            return Forbid();

        if (role == Roles.Manager &&
            userToAssign.Role != Roles.Employee)
            return Forbid();

        var exists = await _context.ProjectUsers
            .AnyAsync(x =>
                x.ProjectId == projectId &&
                x.UserId == userId);

        if (!exists)
        {
            _context.ProjectUsers.Add(new ProjectUser
            {
                ProjectId = projectId,
                UserId = userId
            });

            _context.ActivityLogs.Add(new ActivityLog
            {
                Id = Guid.NewGuid(),
                Action = "User Assigned",
                Details =
                    $"User {userToAssign.Username} assigned to project {project.Name}",
                CreatedAt = DateTime.UtcNow,
                UserId = currentUserGuid,
                TaskId = null,
                ProjectId = project.Id
            });

            await _context.SaveChangesAsync();
        }

        return Ok();
    }

    [HttpPut("{id}/archive")]
    public async Task<IActionResult> ArchiveProject(Guid id)
    {
        var userId =
            User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        var role =
            User.FindFirst(ClaimTypes.Role)?.Value;

        if (userId == null || role == null)
            return Unauthorized();

        var userGuid = Guid.Parse(userId);

        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == id);

        if (project == null)
            return NotFound();

        var isOwner = project.OwnerId == userGuid;

        if (role != Roles.Admin && !isOwner)
            return Forbid();

        if (project.IsArchived)
            return BadRequest("Project already archived");

        project.IsArchived = true;

        _context.ActivityLogs.Add(new ActivityLog
        {
            Id = Guid.NewGuid(),
            Action = "Project Archived",
            Details = $"Project '{project.Name}' archived",
            CreatedAt = DateTime.UtcNow,
            UserId = userGuid,
            TaskId = null,
            ProjectId = project.Id
        });

        await _context.SaveChangesAsync();

        return Ok();
    }
}
