using ERP.Domain.Entities;
using ERP.Infraestructure.Data;
using ERP.Infraestructure.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace ERP.Infraestructure.Implementation;

public class InvoiceRepository : IInvoiceRepository
{
    private readonly AppDbContext _context;

    public InvoiceRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<Invoice?> GetByIdAsync(int id)
    {
        return await _context.Invoice
            .AsNoTracking()
            .Include(i => i.Customer)
            .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Product)
            .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Tax)
            .FirstOrDefaultAsync(i => i.IdInvoice == id);
    }

    public async Task<IEnumerable<Invoice>> GetByCustomerAsync(
        string idCustomer)
    {
        return await _context.Invoice
            .AsNoTracking()
            .Include(i => i.Customer)
            .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Product)
            .Include(i => i.InvoiceItems)
                .ThenInclude(ii => ii.Tax)
            .Where(i => i.IdCustomer == idCustomer)
            .OrderBy(i => i.IdInvoice)
            .ToListAsync();
    }

    public async Task<IEnumerable<InvoiceItem>> GetLinesAsync(
        int idInvoice)
    {
        return await _context.InvoiceItem
            .AsNoTracking()
            .Include(ii => ii.Product)
            .Include(ii => ii.Tax)
            .Where(ii => ii.IdInvoice == idInvoice)
            .ToListAsync();
    }
}
