using System.ComponentModel.DataAnnotations;
using vilavelha_case.Attributes;

namespace vilavelha_case.Models;
public class Task
{
    public int Id { get; set; }

    [Required(ErrorMessage = "O campo \"Título\" é obrigatório.")]
    [MaxLength(50, ErrorMessage = "O campo \"Título\" deve ter no máximo 100 caracteres.")]
    public string Title { get; set; }

    [MaxLength(500, ErrorMessage = "O campo \"Descrição\" deve ter no máximo 500 caracteres.")]
    public string? Description { get; set; }

    // Validação ocorrerá por precaução, mesmo que seja impossível que o valor seja deixado em branco
    [Required(ErrorMessage = "O campo \"Status\" é obrigatório.")]
    [EnumDataType(typeof(TaskStatus), ErrorMessage = "O campo \"Status\" deve ser um valor válido.")]
    public string Status { get; set; }

    private DateTime? _DueDate;
    [DueDate]
    public DateTime? DueDate
    {
        get => _DueDate; set
        {
            if (value.HasValue && value.Value.Kind != DateTimeKind.Utc)
            {
                _DueDate = DateTime.SpecifyKind(value.Value, DateTimeKind.Utc);
            }
            else
            {
                _DueDate = value;
            }
        }
    }

    public Task(string title, string? description, string status, DateTime? dueDate)
    {
        Title = title;
        Description = description;
        Status = status;
        DueDate = dueDate;
    }
}
