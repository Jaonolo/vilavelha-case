using System.Diagnostics;
using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Mvc;

using vilavelha_case.Models;
using vilavelha_case.Data;
using vilavelha_case.Exceptions;

namespace vilavelha_case.Controllers;

[Route("tasks")]
public class TasksController : Controller
{
    private readonly ILogger<TasksController> _logger;
    private readonly TaskDbContext _context;

    public TasksController(ILogger<TasksController> logger, TaskDbContext context)
    {
        _logger = logger;
        _context = context;
    }

    [HttpGet("getTasks")]
    public JsonResult GetTasks()
    {
        var tasks = _context.Tasks.ToList();
        return Json(tasks);
    }

    [HttpGet("getTask/{id}")]
    public JsonResult GetTask(int id)
    {
        var task = _context.Tasks.Find(id) ?? throw new NotFoundException("Tarefa não encontrada.");
        return Json(task);
    }

    [HttpPost("create")]
    public JsonResult Create([FromBody] Models.Task task)
    {
        if (!ModelState.IsValid)
        {
            var errors = ModelState.Where(x => x.Value != null && x.Value.Errors != null && x.Value.Errors.Count > 0)
                                   .Select(y => y.Value!.Errors)
                                   .ToList();

            throw new Exceptions.ValidationException(errors.ToDictionary(
                key => key.First().ErrorMessage,
                value => value.Select(x => x.ErrorMessage).ToArray()
            ));
        }

        // Save task to database
        _context.Tasks.Add(task);
        _context.SaveChanges();

        return Json(task);
    }

    [HttpPut("edit/{id}")]
    public JsonResult Edit(int id, [FromBody] DTOs.TaskUpdateDto updateDto)
    {
        var task = _context.Tasks.Find(id) ?? throw new NotFoundException("Tarefa não encontrada.");

        task.Title = updateDto.Title ?? task.Title;
        task.Description = updateDto.Description ?? task.Description;
        task.Status = updateDto.Status ?? task.Status;
        task.DueDate = updateDto.DueDate ?? task.DueDate;

        var validationResults = new List<ValidationResult>();
        var validationContext = new ValidationContext(task);
        bool isValid = Validator.TryValidateObject(task, validationContext, validationResults, true);

        if (!isValid)
        {
            //return BadRequest(validationResults);
            //     var errors = ModelState.Where(x => x.Value != null && x.Value.Errors != null && x.Value.Errors.Count > 0)
            //                            .Select(y => y.Value!.Errors)
            //                            .ToList();

            //     throw new ValidationException(errors.ToDictionary(
            //         key => key.First().ErrorMessage,
            //         value => value.Select(x => x.ErrorMessage).ToArray()
            //     ));
            return Json("Erro");
        }

        _context.Tasks.Update(task);
        _context.SaveChanges();

        return Json(task);
    }

    [HttpDelete("delete/{id}")]
    public JsonResult Delete(int id)
    {
        var task = _context.Tasks.Find(id) ?? throw new NotFoundException("Tarefa não encontrada.");
        _context.Tasks.Remove(task);
        _context.SaveChanges();
        return Json(task);
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}