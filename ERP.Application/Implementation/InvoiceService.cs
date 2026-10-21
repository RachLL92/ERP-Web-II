using ERP.Application.Interfaces;
using ERP.Domain.DTO;
using ERP.Infraestructure.Implementation;
using ERP.Infraestructure.Interfaces;
using MapsterMapper;

namespace ERP.Application.Implementation;

public class InvoiceService : IInvoiceService
{
    private readonly IInvoiceRepository _repository;
    private readonly IMapper _mapper;

    public InvoiceService(
        IInvoiceRepository repository,
        IMapper mapper)
    {
        _repository = repository;
        _mapper = mapper;
    }

    public async Task<InvoiceDetailDto?> GetByIdAsync(int id)
    {
        var invoice = await _repository.GetByIdAsync(id);

        if (invoice is null)
            return null;

        return _mapper.Map<InvoiceDetailDto>(invoice);
    }

    public async Task<IEnumerable<InvoiceDetailDto>> GetByCustomerAsync(
        string idCustomer)
    {
        var invoices =
            await _repository.GetByCustomerAsync(idCustomer);

        return _mapper.Map<IEnumerable<InvoiceDetailDto>>(invoices);
    }

    public async Task<IEnumerable<InvoiceItemDto>> GetLinesAsync(
        int idInvoice)
    {
        var lines =
            await _repository.GetLinesAsync(idInvoice);

        return _mapper.Map<IEnumerable<InvoiceItemDto>>(lines);
    }
}