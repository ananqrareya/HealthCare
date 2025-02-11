// src/data/clinics.js

// Define the structure of a clinic using JavaScript objects
export const clinics = [
  {
    id: 1,
    doctorName: "د. أحمد خالد",
    specialty: "طب عام",
    city: "رام الله",
    address: "شارع الإرسال، عمارة الشروق، الطابق الثالث",
    phone: "0599123456",
    image:
      "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=400",
    rating: 4.8,
    workingHours: "السبت - الخميس: 9:00 ص - 5:00 م",
  },
  {
    id: 2,
    doctorName: "د. سارة محمود",
    specialty: "طب أسنان",
    city: "نابلس",
    address: "شارع فيصل، عمارة النور، الطابق الثاني",
    phone: "0598765432",
    image:
      "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&q=80&w=400",
    rating: 4.9,
    workingHours: "السبت - الخميس: 10:00 ص - 6:00 م",
  },
  {
    id: 3,
    doctorName: "د. محمد عمر",
    specialty: "طب عيون",
    city: "الخليل",
    address: "شارع السلام، مجمع الشفاء الطبي",
    phone: "0597894561",
    image:
      "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=400",
    rating: 4.7,
    workingHours: "السبت - الخميس: 8:00 ص - 4:00 م",
  },
];

// Define the list of specialties available
export const specialties = [
  "طب عام",
  "طب أسنان",
  "طب عيون",
  "طب أطفال",
  "طب نساء وتوليد",
  "طب باطني",
  "جراحة عامة",
  "طب عظام",
];

// Define the list of cities available
export const cities = [
  "القدس",
  "رام الله",
  "نابلس",
  "الخليل",
  "بيت لحم",
  "غزة",
  "جنين",
  "طولكرم",
  "قلقيلية",
];
