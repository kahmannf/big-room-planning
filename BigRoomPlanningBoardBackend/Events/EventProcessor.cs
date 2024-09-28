using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace BigRoomPlanningBoardBackend.Events
{
    public class EventProcessor : IHostedService
    {
        private readonly BigRoomPlanningContext bigRoomPlanningContext;
        private readonly ILogger<EventProcessor> logger;
        private CancellationTokenSource _tokenSource;

        public EventProcessor(
            BigRoomPlanningContext bigRoomPlanningContext,
            ILogger<EventProcessor> logger
        )
        {
            this.bigRoomPlanningContext = bigRoomPlanningContext;
            this.logger = logger;
        }

        public Task StartAsync(CancellationToken cancellationToken)
        {
            _tokenSource?.Cancel();
            _tokenSource = new CancellationTokenSource();

            Task.Run(() => ProcessEvents(cancellationToken), _tokenSource.Token);
            return Task.CompletedTask;
        }

        public Task StopAsync(CancellationToken cancellationToken)
        {
            _tokenSource?.Cancel();
            return Task.CompletedTask;
        }

        private async Task ProcessEvents(CancellationToken cancellationToken)
        {
            try
            {
                while (!cancellationToken.IsCancellationRequested)
                {
                    var events = bigRoomPlanningContext.Events.Where(x => x.IsProcessed == false).OrderBy(x => x.CreatedAt).ToList();

                    foreach (var item in events)
                    {
                        ProcessEvent(item);
                    }

                    if (events.Count == 0)
                    {
                        await Task.Delay(10, cancellationToken);
                    }
                }
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Event Processor crashed. Stopping application.");
                // If the EventProcessor stops, nothing will work. To avoid furhter damage, we shutdown the application
                Environment.Exit(1);
            }

        }

        private void ProcessEvent(Event @event)
        {
            try
            {
                @event.IsSuccessful = @event.Process(bigRoomPlanningContext);
            }
            catch (Exception ex)
            {
                @event.IsSuccessful = false;
                logger.LogError(ex, "Failed to process event with id {eventid}", @event.EventId);
            }
            finally
            {
                @event.IsProcessed = true;
                @event.ProcessedAt = DateTime.Now;
                bigRoomPlanningContext.SaveChanges();
            }

        }
    }
}
