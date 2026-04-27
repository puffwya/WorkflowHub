using WorkflowHub.API.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using WorkflowHub.Domain.Constants;
using WorkflowHub.Domain.Entities;
using WorkflowHub.Infrastructure.Data;
using System.Security.Claims;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/users")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;

    public UsersController(AppDbContext context)
    {
        _context = context;
    }

    // Get all users (Admin only)
    [HttpGet]
    public async Task<IActionResult> GetUsers()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (role != Roles.Admin)
            return Forbid();

        var users = await _context.Users
            .Select(u => new
            {
                u.Id,
                u.Username,
                u.Email,
                u.Role
            })
            .ToListAsync();

        return Ok(users);
    }

    // Create Manager (Admin only)
    [HttpPost("create-manager")]
    public async Task<IActionResult> CreateManager(CreateUserRequest request)
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (role != Roles.Admin)
            return Forbid();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            Role = Roles.Manager
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return Ok(new
        {
            user.Id,
            user.Username,
            user.Email,
            user.Role
        });
    }
}
