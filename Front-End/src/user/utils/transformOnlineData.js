const formatDate = (isoDate) => {
  const date = new Date(isoDate);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const transformOnlineData = (bookings) => {
  console.log("Bookings:", bookings);

  return bookings[0]
    .filter((booking) => booking.visit_type === "online")
    .map((booking) => {
      if (!booking.date || !booking.time || !booking.doctor) {
        console.warn(`Skipping booking due to missing fields:`, booking);
        return null;
      }

      return {
        id: booking.id.toString(),
        doctorName: booking.doctor.ar_full_name || "غير معروف",
        specialization: booking.doctor.speciality || "غير محدد",
        bookingDate: formatDate(booking.date),
        bookingTime: booking.time,
        status: booking.status ||"null",
        image: booking.doctor.avatar || "https://via.placeholder.com/150",
      };
    })
    .filter(Boolean);
};
