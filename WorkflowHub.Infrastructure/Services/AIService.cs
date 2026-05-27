using System.Text;
using System.Text.Json;

namespace WorkflowHub.Infrastructure.Services;

public class AIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    private const string DefaultModel = "gemini-1.5-flash-latest";

    public AIService(HttpClient httpClient, IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateInsight(string prompt)
    {
        var apiKey = _configuration["AI:GeminiApiKey"];

        if (string.IsNullOrWhiteSpace(apiKey))
            return "AI key missing.";

        var url =
            
$"https://generativelanguage.googleapis.com/v1/models/{DefaultModel}:generateContent?key={apiKey}";

        var requestBody = new
        {
            contents = new[]
            {
                new
                {
                    role = "user",
                    parts = new[]
                    {
                        new { text = prompt }
                    }
                }
            },
            generationConfig = new
            {
                temperature = 0.7,
                maxOutputTokens = 400
            }
        };

        try
        {
            var response = await _httpClient.PostAsync(
                url,
                new StringContent(
                    JsonSerializer.Serialize(requestBody),
                    Encoding.UTF8,
                    "application/json"
                )
            );

            var json = await response.Content.ReadAsStringAsync();

            if (!response.IsSuccessStatusCode)
            {
                return $"AI Error: {response.StatusCode} - {json}";
            }

            using var doc = JsonDocument.Parse(json);

            return doc.RootElement
                .GetProperty("candidates")[0]
                .GetProperty("content")
                .GetProperty("parts")[0]
                .GetProperty("text")
                .GetString()
                ?? "No insight generated.";
        }
        catch (Exception ex)
        {
            return $"AI Exception: {ex.Message}";
        }
    }
}
