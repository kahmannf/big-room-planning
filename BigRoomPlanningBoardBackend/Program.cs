
using BigRoomPlanningBoardBackend.Events;
using BigRoomPlanningBoardBackend.Hubs;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;
using System;

namespace BigRoomPlanningBoardBackend
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddLogging(options => options.AddConsole());

            builder.Services.AddOptions();
            builder.Services.Configure<ApiSettings>(builder.Configuration.GetSection("ApiSettings"));
            builder.Services.AddSpaStaticFiles(options =>
            {
                options.RootPath = "/app/wwwroot";
            });

            // Add services to the container.

            builder.Services.AddControllers();
            builder.Services.AddOpenApiDocument();

            builder.Services.AddTransient<BigRoomPlanningContext>();
            builder.Services
                .AddSignalR()
                .AddNewtonsoftJsonProtocol();

            builder.Services.AddHostedService<EventProcessor>();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseOpenApi();
                app.UseSwaggerUi();
            }
            app.MapHub<DataHub>("/hubs/data");

            app.UseHttpsRedirection();

            app.UseAuthorization();


            app.UseSpaStaticFiles();
            app.UseSpa(spa =>
            {
            });

            //app.MapControllers();
            Console.WriteLine("Current dir: " + Environment.CurrentDirectory);
            Console.WriteLine("DB exists: " + System.IO.File.Exists("./debug.db"));

            app.Run();
        }
    }
}
