using System.Text;
using System.Text.Json;
using Microsoft.Extensions.Configuration;

namespace WorkflowHub.Infrastructure.Services;

public class AIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AIService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateInsight(string prompt)
    {
        var apiKey = _configuration["AI:ApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
        {
            return "AI Error: Missing Gemini API key.";
        }

        var url =
            
$"https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key={apiKey}";

        var request = new HttpRequestMessage(HttpMethod.Post, url);

        var body = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new
                        {
                            text = prompt
                        }
                    }
                }
            }
        };

        request.Content = new StringContent(
            JsonSerializer.Serialize(body),
            Encoding.UTF8,
            "application/json"
        );

        try
        {
            var response = await _httpClient.SendAsync(request);
            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return $"AI Error: {response.StatusCode} - {json}";
            }

            using var doc = JsonDocument.Parse(json);

            if (!doc.RootElement.TryGetProperty("candidates", out var candidates))
            {
                return $"AI Error: Invalid response format - {json}";
            }

            var content =
                candidates[0]
                    .GetProperty("content")
                    .GetProperty("parts")[0]
                    .GetProperty("text")
                    .GetString();

            return string.IsNullOrWhiteSpace(content)
                ? "No insight generated."
                : content;
        }
        catch (Exception ex)
        {
            return $"AI Exception: {ex.Message}";
        }
    }
}
