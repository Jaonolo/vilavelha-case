using System.ComponentModel.DataAnnotations;

namespace vilavelha_case.Models
{
    public enum TaskStatus
    {
        [Display(Name = "Pendente")]
        Pending,
        [Display(Name = "Em andamento")]
        InProgress,
        [Display(Name = "Concluída")]
        Completed,
        [Display(Name = "Cancelada")]
        Cancelled
    }
}