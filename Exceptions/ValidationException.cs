namespace vilavelha_case.Exceptions
{
    public class ValidationException : Exception
    {
        public IDictionary<string, string[]> Errors { get; }

        public ValidationException(IDictionary<string, string[]> errors)
            : base("Foram encontrados erros de validação.")
        {
            Errors = errors;
        }
    }
}