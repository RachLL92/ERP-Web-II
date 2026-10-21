namespace ERP.Domain.DTO;

public record class InvoiceItemDto
{
    public int IdProduct { get; set; }
    public string? ProductName { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }

    // Campos calculados
    public decimal Subtotal { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
}
