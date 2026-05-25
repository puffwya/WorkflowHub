using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using WorkflowHub.Infrastructure.Services;
using WorkflowHub.Domain.Constants;

namespace WorkflowHub.API.Controllers;

[ApiController]
[Route("api/system")]
public class SystemController : ControllerBase
{
    private readonly DailyDigestService _dailyDigestService;
    private readonly IConfiguration _configuration;

    public SystemController(
        DailyDigestService dailyDigestService,
        IConfiguration configuration)
    {
        _dailyDigestService = dailyDigestService;
        _configuration = configuration;
    }

    // GENERATE DIGEST
    [HttpPost("daily-digest")]
    public async Task<IActionResult> GenerateDigest(
        [FromHeader(Name = "x-api-key")] string? apiKey)
    {
        var expectedKey = _configuration["Automation:Secret"];

        if (string.IsNullOrEmpty(apiKey) || apiKey != expectedKey)
            return Unauthorized();

        var digest = await _dailyDigestService.Generate();

        return Ok(new
        {
            message = "Digest generated",
            digest
        });
    }

    // GET ALL DIGESTS
    [HttpGet("daily-digests")]
    [Authorize(Roles = Roles.Admin)]
    public async Task<IActionResult> GetDigests()
    {
        var digests = await _dailyDigestService.GetDigests();
        return Ok(digests);
    }
}
