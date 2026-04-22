using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WorkflowHub.Domain.Constants;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/test")]
public class TestController : ControllerBase
{
    [HttpGet("public")]
    public IActionResult Public()
    {
        return Ok("Anyone can see this");
    }

    [HttpGet("employee")]
    [Authorize(Roles = Roles.Employee)]
    public IActionResult EmployeeOnly()
    {
        return Ok("Employee access granted");
    }

    [HttpGet("admin")]
    [Authorize(Roles = Roles.Admin)]
    public IActionResult AdminOnly()
    {
        return Ok("Admin access granted");
    }
}
