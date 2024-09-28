using BigRoomPlanningBoardBackend.Events;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace BigRoomPlanningBoardBackend.Hubs
{
    public interface IDataHubClient
    {
        public Task RecieveEvents(IEnumerable<Event> events);
        public Task RecieveFullData(BRPFullData bRPFullData);
    }
}
