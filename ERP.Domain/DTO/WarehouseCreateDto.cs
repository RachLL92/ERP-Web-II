using System.ComponentModel.DataAnnotations;

namespace ERP.Domain.DTO;

public class WarehouseCreateDto
{
    [Required(ErrorMessage = "El nombre de la bodega es obligatorio.")]
    [StringLength(100, ErrorMessage = "El nombre no puede superar los 100 caracteres.")]
    public string WarehouseName { get; set; } = string.Empty;

    [Required(ErrorMessage = "La dirección es obligatoria.")]
    [StringLength(200, ErrorMessage = "La dirección no puede superar los 200 caracteres.")]
    public string Address { get; set; } = string.Empty;
}