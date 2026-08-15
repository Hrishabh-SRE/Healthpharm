export type ExpertProfile = {
  name: string;
  role: string;
  qualification: string;
  specialization: string;
  experience: string;
  bio: string;
  imagePlaceholder: string;
};

export const experts: ExpertProfile[] = [
  {
    name: "Dr. Aanya Mehra",
    role: "Senior Clinical Dietician",
    qualification: "MSc Clinical Nutrition, RD",
    specialization: "Clinical nutrition and lifestyle care",
    experience: "10+ years",
    bio: "Supports clients with evidence-informed nutrition guidance designed around individual medical and lifestyle context.",
    imagePlaceholder: "AM",
  },
  {
    name: "Rahul Verma",
    role: "Sports Nutrition Specialist",
    qualification: "MSc Sports Nutrition",
    specialization: "Performance and muscle gain nutrition",
    experience: "8+ years",
    bio: "Works with active adults and athletes to build practical nutrition systems for training, recovery, and consistency.",
    imagePlaceholder: "RV",
  },
  {
    name: "Dr. Nisha Kapoor",
    role: "Metabolic Health Dietician",
    qualification: "PG Diploma in Dietetics",
    specialization: "Diabetes and hormonal nutrition support",
    experience: "9+ years",
    bio: "Designs structured, personalized meal guidance to support metabolic health management and long-term wellness.",
    imagePlaceholder: "NK",
  },
];
