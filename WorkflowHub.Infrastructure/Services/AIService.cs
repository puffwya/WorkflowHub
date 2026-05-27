using Microsoft.Extensions.Caching.Memory;

namespace WorkflowHub.Infrastructure.Services;

public class AIService
{
    private readonly IAIProvider _provider;
    private readonly IMemoryCache _cache;

    public AIService(IAIProvider provider, IMemoryCache cache)
    {
        _provider = provider;
        _cache = cache;
    }

    public async Task<string> GenerateDashboardReport(string userId, string role, string taskJson)
    {
        var cacheKey = $"ai-dashboard-{userId}-{role}-{DateTime.UtcNow:yyyyMMdd}";

        if (_cache.TryGetValue(cacheKey, out string cached))
            return cached;

        var prompt = AIPromptBuilder.BuildDashboardPrompt(role, taskJson);

        var result = await _provider.GenerateAsync(prompt);

        _cache.Set(cacheKey, result, TimeSpan.FromHours(12));

        return result;
    }
}
