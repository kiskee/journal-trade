import { CalendarWithData } from "@/components/calendar/CalendarWithData";

export default function Test() {
  const sampleData = [
    // Enero 2024
    { date: "2024-01-15", value: 150.5 },
    { date: "2024-01-16", value: -75.25 },
    { date: "2024-01-20", value: 200.0 },
    { date: "2024-01-25", value: -50.0 },

    // Febrero 2024
    { date: "2024-02-05", value: 300.75 },
    { date: "2024-02-14", value: -120.0 },
    { date: "2024-02-18", value: 450.25 },
    { date: "2024-02-28", value: 89.5 },

    // Marzo 2024
    { date: "2024-03-10", value: -200.3 },
    { date: "2024-03-15", value: 175.8 },
    { date: "2024-03-22", value: 95.25 },
    { date: "2024-03-30", value: -65.75 },

    // Abril 2024
    { date: "2024-04-05", value: 220.4 },
    { date: "2024-04-12", value: -85.9 },
    { date: "2024-04-20", value: 310.6 },
    { date: "2024-04-28", value: 125.35 },

    // Mayo 2024
    { date: "2024-05-08", value: -150.25 },
    { date: "2024-05-15", value: 280.7 },
    { date: "2024-05-25", value: 95.8 },
    { date: "2024-05-31", value: -45.2 },
  ];
  return (
    <>
      {/* <CalendarWithNavigation /> */}
      {/* <AdvancedCalendarWithNavigation /> */}
      <div className="container mx-auto py-8">
        <CalendarWithData data={sampleData} />
      </div>
    </>
  );
}
