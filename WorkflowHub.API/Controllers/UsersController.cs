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

    // Get all users
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetUsers()
    {
        var role = User.FindFirst(ClaimTypes.Role)?.Value;

        if (role == Roles.Employee)
            return Forbid();

        var query = _context.Users.AsQueryable();

        if (role == Roles.Manager)
        {
            query = query.Where(u => u.Role == Roles.Employee);
        }

        var users = await query
            .Select(u => new {
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
    public async Task<IActionResult> CreateManager(
        CreateUserRequest request)
    {
        var role =
            User.FindFirst(
                ClaimTypes.Role)?.Value;

        if (role != Roles.Admin)
            return Forbid();

        var user = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Email = request.Email,
            PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    request.Password),
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

    // UPDATE USER (Admin only)
    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateUser(
        Guid id,
        UpdateUserRequest request)
    {
        var role =
            User.FindFirst(
                ClaimTypes.Role)?.Value;

        if (role != Roles.Admin)
            return Forbid();

        var user =
            await _context.Users
                .FirstOrDefaultAsync(
                    u => u.Id == id);

        if (user == null)
            return NotFound();

        var usernameExists =
            await _context.Users.AnyAsync(
                u =>
                    u.Username == request.Username &&
                    u.Id != id);

        if (usernameExists)
            return BadRequest(
                "Username already exists");

        var emailExists =
            await _context.Users.AnyAsync(
                u =>
                    u.Email == request.Email &&
                    u.Id != id);

        if (emailExists)
            return BadRequest(
                "Email already exists");

        user.Username = request.Username;
        user.Email = request.Email;
        user.Role = request.Role;

        // password reset
        if (!string.IsNullOrWhiteSpace(
            request.Password))
        {
            user.PasswordHash =
                BCrypt.Net.BCrypt.HashPassword(
                    request.Password);
        }

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
