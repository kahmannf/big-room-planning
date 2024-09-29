using BigRoomPlanningBoardBackend.Events;
using BigRoomPlanningBoardBackend.Hubs;
using Microsoft.AspNetCore.Mvc;
using System;

namespace BigRoomPlanningBoardBackend.Controller
{
    /// <summary>
    /// This controller is useless an serves the purpose of exposing the types used in the SignalR-Hubs as swagger documentation.
    /// By doing so its possible to generate the client library via Nswag studio
    /// </summary>
    [Route("api/[controller]/[action]")]
    public class DummyController : ControllerBase
    {
        [HttpGet]
        public Event DummyEvent()
        {
            throw new NotSupportedException();
        }

        [HttpGet]
        public BRPFullData DummyFullData()
        {
            throw new NotSupportedException();
        }

        [HttpGet]
        public Session DummySession()
        {
            throw new NotSupportedException();
        }

        [HttpGet]
        public Sprint DummySprint()
        {
            throw new NotSupportedException();
        }
    }
}
