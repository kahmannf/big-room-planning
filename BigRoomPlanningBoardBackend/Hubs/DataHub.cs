using BigRoomPlanningBoardBackend.Events;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Options;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BigRoomPlanningBoardBackend.Hubs
{
    public class DataHub : Hub<IDataHubClient>
    {
        private readonly BigRoomPlanningContext bigRoomPlanningContext;
        private readonly IOptions<ApiSettings> apiSettingOptions;

        public DataHub(
            BigRoomPlanningContext bigRoomPlanningContext,
            IOptions<ApiSettings> apiSettingOptions
        )
        {
            this.bigRoomPlanningContext = bigRoomPlanningContext;
            this.apiSettingOptions = apiSettingOptions;
        }

        public void GetUpdated(int lastKnownEventId)
        {
            var maxUpdates = apiSettingOptions.Value.MaxEventsPerUpdate;

            var count = bigRoomPlanningContext.Events
                .Where(x => x.EventId > lastKnownEventId && x.IsProcessed)
                // only need to know if there are more than maxUpdates
                .Take(maxUpdates + 1)
                .Count();

            if (count == 0)
            {
                return;
            }

            if (count >= maxUpdates)
            {
                BRPFullData fullData = BRPFullData.FromContext(bigRoomPlanningContext);
                Clients.Caller.RecieveFullData(fullData);
                return;
            }

            Clients.Caller.RecieveEvents(bigRoomPlanningContext.Events.Where(x => x.EventId > lastKnownEventId && x.IsProcessed));
        }

        public void AddEvent(Event @event)
        {
            @event.RecievedAt = DateTime.Now;
            @event.IsProcessed = false;
            bigRoomPlanningContext.Add(@event);
            bigRoomPlanningContext.SaveChanges();
        }

        public Session GetSession(string id)
        {
            var session = bigRoomPlanningContext.Sessions.Find(id);
            return session;
        }
        public Squad GetSqaud(string id)
        {
            return bigRoomPlanningContext.Squads.Find(id);
        }
    }
}
