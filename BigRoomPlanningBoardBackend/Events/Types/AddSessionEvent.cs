using System;
using System.Linq;

namespace BigRoomPlanningBoardBackend.Events.Types
{
    public class AddSessionEvent : Event
    {
        public string SessionName { get; set; }

        public override bool Process(BigRoomPlanningContext bigRoomPlanningContext)
        {
            if(string.IsNullOrWhiteSpace(SessionName) || bigRoomPlanningContext.Sessions.Any(x => x.SessionId == SessionId))
            {
                return false;
            }
            

            var session = new Session
            {
                CreatedAt = DateTime.Now,
                Username = SessionName,
                SessionId = SessionId
            };

            bigRoomPlanningContext.Add(session);

            return true;
        }
    }
}
