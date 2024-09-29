using BigRoomPlanningBoardBackend.Events.Types;
using System;

namespace BigRoomPlanningBoardBackend
{
    public static class DebugData
    {

        public static void Create(BigRoomPlanningContext context)
        {
            context.Add(new AddPlannedPeriodEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Default",
                EndDay = new DateTime(2029, 12, 31),
                StartDay = new DateTime(2020, 1, 1)
            });
            
            context.Add(new AddPlannedPeriodEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Past",
                EndDay = new DateTime(2019, 12, 31),
                StartDay = new DateTime(2010, 1, 1)
            });

            context.Add(new AddPlannedPeriodEvent()
            {
                CreatedAt = DateTime.Now,
                RecievedAt = DateTime.Now,
                Name = "Future",
                EndDay = new DateTime(2039, 12, 31),
                StartDay = new DateTime(2030, 1, 1)
            });

            context.SaveChanges();
        }
    }
}
