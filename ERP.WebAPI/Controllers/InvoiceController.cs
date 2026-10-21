using ERP.Application.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace ERP.WebAPI.Controllers;

[Route("api/[controller]")]
[ApiController]
public class InvoiceController : ControllerBase
{
    private readonly IInvoiceService _service;

    public InvoiceController(IInvoiceService service)
    {
        _service = service;
    }

    // GET: api/Invoice/1
    [HttpGet("{id:int}")]
    public async Task<IActionResult> GetByIdAsync(int id)
    {
        var result = await _service.GetByIdAsync(id);

        if (result is null)
            return NotFound();

        return Ok(result);
    }

    // GET: api/Invoice/by-customer/101110111
    [HttpGet("by-customer/{idCustomer}")]
    public async Task<IActionResult> GetByCustomerAsync(
        string idCustomer)
    {
        var result = await _service.GetByCustomerAsync(idCustomer);

        return Ok(result);
    }

    // GET: api/Invoice/1/lines
    [HttpGet("{id:int}/lines")]
    public async Task<IActionResult> GetLinesAsync(int id)
    {
        var result = await _service.GetLinesAsync(id);

        return Ok(result);
    }
}
