using ERP.Domain.DTO;

namespace ERP.Application.Interfaces;

public interface IInvoiceService
{
    Task<InvoiceDetailDto?> GetByIdAsync(int id);

    Task<IEnumerable<InvoiceDetailDto>> GetByCustomerAsync(string idCustomer);

    Task<IEnumerable<InvoiceItemDto>> GetLinesAsync(int idInvoice);
}