using System.ComponentModel.DataAnnotations;

namespace vilavelha_case.Attributes
{
    public class DueDateAttribute : ValidationAttribute
    {
        protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
        {
            if (!(value is DateTime || value is null))
            {
                return new ValidationResult("O campo \"Prazo\" deve ser uma data válida.");
            }

            return ValidationResult.Success;
        }
    }
}