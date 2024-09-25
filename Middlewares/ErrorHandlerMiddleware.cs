using System.Net;
using System.Text.Json;
using vilavelha_case.Exceptions;


namespace vilavelha_case.Middlewares
{
    public class ErrorHandlerMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger<ErrorHandlerMiddleware> _logger;

        public ErrorHandlerMiddleware(RequestDelegate next, ILogger<ErrorHandlerMiddleware> logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task Invoke(HttpContext context)
        {
            try
            {
                await _next(context); // Proceed to the next middleware
            }
            catch (Exception error)
            {
                _logger.LogError(error, "Ocorreu um erro não reconhecido.");

                await HandleExceptionAsync(context, error);
            }
        }

        private static Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            HttpStatusCode statusCode;
            string message;
            object? errors = null;

            switch (exception)
            {
                case ValidationException ve:
                    statusCode = HttpStatusCode.BadRequest;
                    message = ve.Message;
                    errors = ve.Errors;
                    break;
                case NotFoundException nfe:
                    statusCode = HttpStatusCode.NotFound;
                    message = nfe.Message;
                    break;
                default:
                    statusCode = HttpStatusCode.InternalServerError;
                    message = "An unexpected error occurred.";
                    break;
            }

            var errorResponse = new
            {
                message,
                errors
            };

            var errorJson = JsonSerializer.Serialize(errorResponse);

            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;

            return context.Response.WriteAsync(errorJson);
        }
    }
}