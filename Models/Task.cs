namespace vilavelha_case.Models;
public class Task
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public string Status { get; set; }
    public DateTime DueDate { get; set; }

    public Task(string title, string description, DateTime dueDate, string status = "Pending")
    {
        Title = title;
        Description = description;
        Status = status;
        DueDate = dueDate;
    }
}
