using ERP.Application.Implementation;
using ERP.Application.Interfaces;
using ERP.Application.Mapper;
using ERP.Domain.DTO.PatternResult;
using ERP.Infraestructure.Data;
using ERP.Infraestructure.Data.Seed;
using ERP.Infraestructure.Implementation;
using ERP.Infraestructure.Interfaces;
using Mapster;
using MapsterMapper;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Scalar.AspNetCore;
using ERP.WebAPI.Handlers;
using Serilog;
using Serilog.Events;




var builder = WebApplication.CreateBuilder(args);

// Serilog reemplaza al proveedor de logging por defecto (clase 6-1)
builder.Services.AddSerilog((services, logConfig) => logConfig
    .MinimumLevel.Information()                                              // nivel general
    .MinimumLevel.Override("Microsoft", LogEventLevel.Warning)               // menos ruido del framework
    .MinimumLevel.Override("Microsoft.Hosting.Lifetime", LogEventLevel.Information)   // "Now listening on..."
    .MinimumLevel.Override("Microsoft.EntityFrameworkCore.Database.Command",
        builder.Environment.IsDevelopment() ? LogEventLevel.Information : LogEventLevel.Warning) // SQL de EF (5-1)
    .Enrich.FromLogContext()
    .WriteTo.Console()
    .WriteTo.File(
        path: "logs/serilog-.txt",
        rollingInterval: RollingInterval.Day,       // un archivo por día: serilog-20261003.txt
        retainedFileCountLimit: 14,                 // conserva 14 archivos
        fileSizeLimitBytes: 10_485_760,             // 10 MB por archivo
        rollOnFileSizeLimit: true,                  // al llegar a 10 MB abre serilog-20261003_001.txt
        shared: true,                               // varios procesos pueden escribir el mismo archivo
        outputTemplate: "{Timestamp:yyyy-MM-dd HH:mm:ss.fff} [{Level:u3}] ({SourceContext}) {Message:lj}{NewLine}{Exception}"));


// =====================================================
// Add services to the container
// =====================================================

builder.Services.AddControllers()
    .ConfigureApiBehaviorOptions(options =>
    {
        // El 400 automático de [ApiController] usa la misma forma Result<T> que el resto de la API
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(entry => entry.Value!.Errors.Count > 0)
                .ToDictionary(
                    entry => entry.Key,
                    entry => entry.Value!.Errors.Select(error => error.ErrorMessage).ToArray());

            var result = Result<Dictionary<string, string[]>>.Failure(400, "Bad Request",
                "Uno o más datos no son válidos.");
            result.Data = errors;

            return new BadRequestObjectResult(result);
        };
    });

// Manejo global de errores (clase 6-1)
builder.Services.AddExceptionHandler<GlobalExceptionHandler>();
builder.Services.AddProblemDetails();   // obligatorio para usar UseExceptionHandler() sin parámetros


builder.Services.AddOpenApi();

var adminPassword = builder.Configuration["Seed:AdminPassword"]
    ?? throw new InvalidOperationException(
        "Falta la configuración Seed:AdminPassword (User Secrets).");

var isDevelopment = builder.Environment.IsDevelopment();

builder.Services.AddDbContext<AppDbContext>(options => options
    .UseSqlServer(
        builder.Configuration.GetConnectionString("DefaultConnection"))


    // EF Tools
    .UseSeeding((context, _) =>
    {
        MasterSeeder.Seed(context, adminPassword);

        if (isDevelopment)
            DevelopmentSeeder.Seed(context);
    })

    // Aplicación
    .UseAsyncSeeding(async (context, _, ct) =>
    {
        await MasterSeeder.SeedAsync(
            context,
            adminPassword,
            ct);

        if (isDevelopment)
            await DevelopmentSeeder.SeedAsync(
                context,
                ct);
    }));


// =====================================================
// Mapster
// =====================================================

// 1. Registrar configuraciones personalizadas
MapsterConfig.RegisterMaps();

// 2. Configuración global
var config = TypeAdapterConfig.GlobalSettings;

// 3. Registrar Mapster en DI
builder.Services.AddSingleton(config);
builder.Services.AddScoped<IMapper, ServiceMapper>();
builder.Services.AddMapster();


// =====================================================
// Repositories
// =====================================================

builder.Services.AddScoped<IProductRepository, ProductRepository>();

// Reto Invoice
builder.Services.AddScoped<IInvoiceRepository, InvoiceRepository>();

//Reto Warehouse
builder.Services.AddScoped<IWarehouseRepository, WarehouseRepository>();


// =====================================================
// Services
// =====================================================

builder.Services.AddScoped<IProductService, ProductService>();

builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<ISupplierService, SupplierService>();


// Reto Invoice
builder.Services.AddScoped<IInvoiceService, InvoiceService>();

//Reto Warehouse
builder.Services.AddScoped<IWarehouseService, WarehouseService>();


// =====================================================
// Build
// =====================================================

var app = builder.Build();

app.UseSerilogRequestLogging();    // 1. Una línea de log por petición: método, ruta, código y duración
app.UseExceptionHandler();        // 2. Todo lo que viene después queda protegido por el manejador global

// ... lo que ya tenía: OpenAPI, UseHttpsRedirection, UseAuthorization, MapControllers



// =====================================================
// Configure HTTP request pipeline
// =====================================================

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
    app.MapScalarApiReference();
}

app.UseAuthorization();

app.MapControllers();

app.Run();