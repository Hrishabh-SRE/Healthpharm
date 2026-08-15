export type ServiceContent = {
  title: string;
  slug: string;
  shortDescription: string;
  benefits: string[];
  overview?: string;
  whoItsFor?: string[];
  included?: string[];
  process?: string[];
};

export const services: ServiceContent[] = [
  {
    title: "Personalized Diet Plans",
    slug: "diet-plans",
    shortDescription:
      "Customized nutrition plans designed to support your daily routine, medical context, and wellness goals.",
    benefits: ["Goal-oriented planning", "Dietician-led adjustments", "Progress tracking checkpoints"],
    overview:
      "Our personalized plans are designed to support sustainable lifestyle change through evidence-informed guidance.",
    whoItsFor: [
      "Adults looking for practical and sustainable dietary structure",
      "Individuals balancing nutrition with work and family commitments",
      "Clients seeking long-term wellness with professional follow-up",
    ],
    included: [
      "Initial diet and lifestyle review",
      "Nutrition goal setting with your dietician",
      "Practical meal structure and follow-up guidance",
    ],
    process: [
      "Initial consultation and baseline discussion",
      "Personalized plan drafted by your assigned dietician",
      "Periodic review and refinements based on progress",
    ],
  },
  {
    title: "Fat Loss Program",
    slug: "fat-loss",
    shortDescription:
      "Structured nutrition support to help improve body composition with safe, personalized, and progressive guidance.",
    benefits: ["Calorie awareness", "Portion and meal timing guidance", "Habit-focused support"],
    overview:
      "This program is designed to support healthy fat loss through realistic food planning and consistent monitoring.",
    whoItsFor: [
      "Individuals with fat-loss goals who prefer supervised guidance",
      "People restarting fitness and nutrition routines",
      "Clients who need accountability with practical diet planning",
    ],
    included: [
      "Goal alignment and baseline nutrition check",
      "Flexible meal strategy built around your preferences",
      "Tracking and review support from your dietician",
    ],
    process: [
      "Understand your current diet and routine",
      "Build a practical fat-loss aligned meal framework",
      "Review progress and adjust for sustainability",
    ],
  },
  {
    title: "Muscle Gain Diet",
    slug: "muscle-gain",
    shortDescription:
      "Nutrition planning to support muscle gain goals with balanced intake, recovery support, and progress tracking.",
    benefits: ["Protein-focused planning", "Workout-aligned fueling", "Recovery nutrition support"],
    overview:
      "Our muscle gain diet approach is designed to support training performance and healthy body composition changes.",
    whoItsFor: [
      "Beginners starting resistance training",
      "Active individuals seeking lean muscle support",
      "People who need structure for meal consistency",
    ],
    included: [
      "Training and routine review",
      "Macro-balanced plan design",
      "Ongoing review and progression support",
    ],
    process: [
      "Evaluate your current training and meal pattern",
      "Create a personalized, training-aligned diet plan",
      "Track progress and optimize with your dietician",
    ],
  },
  {
    title: "Clinical Nutrition",
    slug: "clinical-nutrition",
    shortDescription:
      "Dietician-led nutrition guidance designed to support people managing clinical health conditions.",
    benefits: ["Condition-aware nutrition guidance", "Symptom-aware meal planning", "Collaborative follow-up"],
    overview:
      "Our clinical nutrition service provides personalized guidance designed to support ongoing health management.",
    whoItsFor: [
      "Individuals managing chronic health conditions",
      "People who require personalized clinical diet support",
      "Clients needing long-term dietician follow-up",
    ],
    included: [
      "Clinical history-aware nutrition planning",
      "Lifestyle and meal adjustments",
      "Regular progress reviews and care coordination",
    ],
    process: [
      "Clinical and dietary background review",
      "Personalized plan creation based on your needs",
      "Review-driven adjustments with dietician support",
    ],
  },
  {
    title: "Lifestyle Management",
    slug: "lifestyle-management",
    shortDescription:
      "Build sustainable nutrition and daily habits with coaching designed for long-term consistency.",
    benefits: ["Behavior-focused guidance", "Meal routine optimization", "Lifestyle-first approach"],
  },
  {
    title: "Sports Nutrition",
    slug: "sports-nutrition",
    shortDescription:
      "Fueling strategies to support activity performance, training load, and recovery planning.",
    benefits: ["Pre/post workout planning", "Hydration strategy", "Performance-aware meal timing"],
  },
  {
    title: "Diabetes Nutrition",
    slug: "diabetes-nutrition",
    shortDescription:
      "Evidence-informed meal planning designed to support blood glucose management and daily stability.",
    benefits: ["Structured meal patterns", "Carbohydrate awareness", "Dietician follow-up support"],
  },
  {
    title: "PCOS / PCOD Nutrition",
    slug: "pcos-pcod-nutrition",
    shortDescription:
      "Personalized nutrition support designed around hormonal health, routine, and long-term wellbeing.",
    benefits: ["Cycle-aware guidance", "Lifestyle integration", "Progress monitoring"],
  },
  {
    title: "Digestive Health Diet",
    slug: "digestive-health-diet",
    shortDescription:
      "Gentle and structured dietary planning to support digestive comfort and sustainable eating habits.",
    benefits: ["Trigger-aware planning", "Symptom tracking", "Progressive dietary adjustments"],
  },
];

export const featuredServiceSlugs = ["diet-plans", "fat-loss", "muscle-gain", "clinical-nutrition"] as const;
