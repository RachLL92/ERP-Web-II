using ERP.Application.Interfaces;
using ERP.Domain.DTO;
using Microsoft.AspNetCore.Mvc;

namespace ERP.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class WarehouseController : ControllerBase
{
    private readonly IWarehouseService _service;

    public WarehouseController(IWarehouseService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.GetAllAsync();
        return StatusCode(result.Status, result);
    }

    [HttpGet("pagination")]
    public async Task<IActionResult> GetPagination(
        [FromQuery] int pageNumber = 1,
        [FromQuery] int pageSize = 10)
    {
        var result = await _service.GetPaginationAsync(
            pageNumber, pageSize);

        return StatusCode(result.Status, result);
    }

    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetById(int id)
    {
        var result = await _service.GetByIdAsync(id);
        return StatusCode(result.Status, result);
    }

    [HttpPost]
    public async Task<IActionResult> Create(
        [FromBody] WarehouseCreateDto warehouse)
    {
        var result = await _service.AddAsync(warehouse);

        if (result.Status == 201 && result.Data is not null)
        {
            return CreatedAtAction(
                nameof(GetById),
                new { id = result.Data.IdWarehouse },
                result);
        }

        return StatusCode(result.Status, result);
    }

    [HttpPut("{id:int}")]
    public async Task<IActionResult> Update(
        int id,
        [FromBody] WarehouseUpdateDto warehouse)
    {
        var result = await _service.UpdateAsync(id, warehouse);
        return StatusCode(result.Status, result);
    }

    [HttpDelete("{id:int}")]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _service.DeleteAsync(id);
        return StatusCode(result.Status, result);
    }
}
