import { listNutritionists, listNutritionPlans, listConsultations } from "@/lib/db/nutrition";
import NutritionManager from "@/components/admin/NutritionManager";

export const metadata = { title: "Nutrition" };

export default async function AdminNutritionPage() {
  const [nutritionists, plans, consultations] = await Promise.all([listNutritionists(), listNutritionPlans(), listConsultations()]);
  return <NutritionManager nutritionists={nutritionists} plans={plans} consultations={consultations} />;
}
