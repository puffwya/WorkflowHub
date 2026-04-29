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

        var project = new Project
        {
            Id = Guid.NewGuid(),
            Name = request.Name,
            Description = request.Description,
            CreatedAt = DateTime.UtcNow,
            OwnerId = Guid.Parse(userId)
        };

        _context.Projects.Add(project);
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

        IQueryable<Project> query = _context.Projects;

        // Admin sees everything
        if (role == Roles.Admin)
        {
            // no filter
        }
        else
        {
            query = query.Where(p =>
                p.OwnerId == userGuid || // owns project
                p.ProjectUsers.Any(pu => pu.UserId == userGuid) // assigned to project
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
            .Select(pu => new {
                pu.User.Id,
                pu.User.Username,
                pu.User.Role
            })
            .ToListAsync();

        return Ok(users);
    }

    [HttpPost("{projectId}/assign/{userId}")]
    [Authorize]
    public async Task<IActionResult> AssignUser(Guid projectId, Guid userId)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        var project = await _context.Projects
            .FirstOrDefaultAsync(p => p.Id == projectId);

        if (project == null)
            return NotFound();

        var userToAssign = await _context.Users
            .FirstOrDefaultAsync(u => u.Id == userId);

        if (userToAssign == null)
            return NotFound();

        // Employees cannot assign anyone
        if (role == Roles.Employee)
            return Forbid();

        // Managers can only assign employees
        if (role == Roles.Manager && userToAssign.Role != Roles.Employee)
            return Forbid();

        var exists = await _context.ProjectUsers
            .AnyAsync(x => x.ProjectId == projectId && x.UserId == userId);

        if (!exists)
        {
            _context.ProjectUsers.Add(new ProjectUser
            {
                ProjectId = projectId,
                UserId = userId
            });

            await _context.SaveChangesAsync();
        }

        return Ok();
    }
}
