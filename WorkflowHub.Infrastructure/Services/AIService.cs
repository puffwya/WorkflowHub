using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace WorkflowHub.Infrastructure.Services;

public class AIService
{
    private readonly HttpClient _httpClient;
    private readonly IConfiguration _configuration;

    public AIService(
        HttpClient httpClient,
        IConfiguration configuration)
    {
        _httpClient = httpClient;
        _configuration = configuration;
    }

    public async Task<string> GenerateInsight(
        string prompt)
    {
        var apiKey =
            _configuration["AI:ApiKey"];

        var requestBody = new
        {
            model = "meta-llama/llama-3.1-8b-instruct:free",

            messages = new[]
            {
                new
                {
                    role = "system",
                    content =
                    "You are an intelligent project dashboard assistant. Create concise, useful workflow reports in markdown."
                },

                new
                {
                    role = "user",
                    content = prompt
                }
            }
        };

        var json =
            JsonSerializer.Serialize(
                requestBody
            );

        var request =
            new HttpRequestMessage(
                HttpMethod.Post,
                "https://openrouter.ai/api/v1/chat/completions"
            );

        request.Headers.Authorization =
            new AuthenticationHeaderValue(
                "Bearer",
                apiKey
            );

        request.Headers.Add(
            "HTTP-Referer",
            "https://workflowhub.onrender.com"
        );

        request.Headers.Add(
            "X-Title",
            "WorkflowHub"
        );

        request.Content =
            new StringContent(
                json,
                Encoding.UTF8,
                "application/json"
            );

        var response =
            await _httpClient.SendAsync(
                request
            );

        response.EnsureSuccessStatusCode();

        var responseJson =
            await response.Content
                .ReadAsStringAsync();

        using var doc =
            JsonDocument.Parse(
                responseJson
            );

        return doc
            .RootElement
            .GetProperty("choices")[0]
            .GetProperty("message")
            .GetProperty("content")
            .GetString()
            ?? "No report generated";
    }
}
