using BigRoomPlanningBoardBackend.Events.Types;
using Newtonsoft.Json;
using NJsonSchema.Converters;
using NJsonSchema.NewtonsoftJson.Converters;
using System;
using System.Runtime.Serialization;

namespace BigRoomPlanningBoardBackend.Events
{
    [JsonConverter(typeof(JsonInheritanceConverter), "discriminator")]
    [KnownType(typeof(AddDependencyEvent))]
    [KnownType(typeof(AddOrUpdateSquadSprintStatsEvent))]
    [KnownType(typeof(AddPlannedPeriodEvent))]
    [KnownType(typeof(AddRiskEvent))]
    [KnownType(typeof(AddSessionEvent))]
    [KnownType(typeof(AddSprintEvent))]
    [KnownType(typeof(AddSquadEvent))]
    [KnownType(typeof(AddTicketEvent))]
    [KnownType(typeof(DeleteDependencyEvent))]
    [KnownType(typeof(DeleteRiskEvent))]
    [KnownType(typeof(DeleteTicketEvent))]
    [KnownType(typeof(EditPlannedPeriodEvent))]
    [KnownType(typeof(EditRiskEvent))]
    [KnownType(typeof(EditSprintEvent))]
    [KnownType(typeof(EditSquadEvent))]
    [KnownType(typeof(EditTicketEvent))]
    public abstract class Event
    {
        public int EventId { get; set; }

        /// <summary>
        /// ID of the client session that caused this event
        /// </summary>
        public string SessionId { get; set; }

        /// <summary>
        /// Timestamp set by the client when the event is created
        /// </summary>
        public DateTime CreatedAt { get; set; }

        /// <summary>
        /// Timestamp set by the api when the event ist recieved and saved
        /// </summary>
        public DateTime RecievedAt { get; set; }

        /// <summary>
        /// Timestammp set by the event processor when it processes this event
        /// </summary>
        public DateTime ProcessedAt { get; set; }

        /// <summary>
        /// Determines whether this event has been processed
        /// </summary>
        public bool IsProcessed { get; set; }

        /// <summary>
        /// Determiens whether this event was sduccessfully proccessed or if it was denied processing because of invalid data
        /// This might happen if a object related to the event is deleted between the CreatedAt and ProcessedAt timestamp
        /// </summary>
        public bool IsSuccessful { get; set; }

        /// <summary>
        /// Should process the event. SaveChanges will be called on the parent context.
        /// The implemantation does not have to update any Properties from the base Event class.
        /// The EventProcessor will take care of that
        /// </summary>
        /// <param name="bigRoomPlanningContext"></param>
        /// <returns>whether the event was processed successfully</returns>
        public abstract bool Process(BigRoomPlanningContext bigRoomPlanningContext);
    }
}
