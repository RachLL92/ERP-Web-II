namespace ERP.Domain.DTO;

public record class InvoiceDetailDto
{
    public int IdInvoice { get; set; }
    public DateTime InvoiceDate { get; set; }
    public string? CustomerFullName { get; set; }

    public List<InvoiceItemDto> Items { get; set; } = new();

    // Totales de la factura
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
}
