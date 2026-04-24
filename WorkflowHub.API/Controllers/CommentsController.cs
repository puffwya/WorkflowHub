using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using WorkflowHub.API.DTOs;
using WorkflowHub.Domain.Entities;
using WorkflowHub.Infrastructure.Data;
using WorkflowHub.Infrastructure.Services;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/tasks/{taskId}/comments")]
public class CommentsController : ControllerBase
{
    private readonly AppDbContext _context;
    private readonly ActivityLogService _activityLogService;

    public CommentsController(AppDbContext context, ActivityLogService activityLogService)
    {
        _context = context;
        _activityLogService = activityLogService;
    }

    // GET comments for a task
    [HttpGet]
    [Authorize]
    public async Task<IActionResult> GetComments(Guid taskId)
    {
        var comments = await _context.Comments
            .Where(c => c.TaskId == taskId)
            .OrderByDescending(c => c.CreatedAt)
            .Select(c => new CommentDto
            {
                Id = c.Id,
                Content = c.Content,
                CreatedAt = c.CreatedAt,
                UserId = c.UserId
            })
            .ToListAsync();

        return Ok(comments);
    }

    // POST comment
    [HttpPost]
    [Authorize]
    public async Task<IActionResult> AddComment(Guid taskId, CreateCommentRequest request)
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId == null)
            return Unauthorized();

        var taskExists = await _context.Tasks.AnyAsync(t => t.Id == taskId);
        if (!taskExists)
            return NotFound("Task not found");

        var comment = new Comment
        {
            Id = Guid.NewGuid(),
            Content = request.Content,
            TaskId = taskId,
            UserId = Guid.Parse(userId)
        };

        _context.Comments.Add(comment);
        await _context.SaveChangesAsync();

        await _activityLogService.LogAsync(
            action: "CommentAdded",
            details: $"Comment added to task {taskId}",
            userId: Guid.Parse(userId),
            taskId: taskId
        );

        var result = new CommentDto
        {
            Id = comment.Id,
            Content = comment.Content,
            CreatedAt = comment.CreatedAt,
            UserId = comment.UserId
        };

        return Ok(result);
    }
}
