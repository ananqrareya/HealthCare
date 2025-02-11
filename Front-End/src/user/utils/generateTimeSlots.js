export const generateTimeSlots = (workingHour, appointmentTime) => {
  if (!workingHour || !workingHour.time || !appointmentTime) {
    console.error("Invalid data for generating time slots", {
      workingHour,
      appointmentTime,
    });
    return [];
  }

  const [start, end] = workingHour.time.split(" - ").map((t) => {
    const [hours, minutes, period] = t.split(/[:\s]/); // تقسيم الوقت
    let adjustedHours = parseInt(hours, 10);
    if (period === "مساءً" && adjustedHours !== 12) {
      adjustedHours += 12;
    } else if (period === "صباحاً" && adjustedHours === 12) {
      adjustedHours = 0;
    }
    return new Date().setHours(adjustedHours, parseInt(minutes, 10), 0, 0);
  });

  if (!start || !end || start >= end) {
    console.error("Invalid start or end time", { start, end });
    return [];
  }

  const slots = [];
  let current = start;

  while (current + appointmentTime * 60000 <= end) {
    const startSlot = new Date(current);
    const endSlot = new Date(current + appointmentTime * 60000);
    slots.push(
      `${startSlot.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })} - ${endSlot.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    );
    current += appointmentTime * 60000;
  }

  return slots;
};
