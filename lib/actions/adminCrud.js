"use server";

import { revalidatePath } from "next/cache";
import * as trainersDb from "@/lib/db/trainers";
import * as programsDb from "@/lib/db/programs";
import * as membershipsDb from "@/lib/db/memberships";
import * as classesDb from "@/lib/db/classes";
import * as supplementsDb from "@/lib/db/supplements";
import * as nutritionDb from "@/lib/db/nutrition";
import * as transformationsDb from "@/lib/db/transformations";
import * as testimonialsDb from "@/lib/db/testimonials";
import * as eventsDb from "@/lib/db/events";
import * as blogDb from "@/lib/db/blog";
import * as galleryDb from "@/lib/db/gallery";
import * as facilitiesDb from "@/lib/db/facilities";
import * as membersDb from "@/lib/db/members";
import * as messagesDb from "@/lib/db/messages";
import * as personalTrainingDb from "@/lib/db/personalTraining";

function refresh(...paths) {
  for (const p of paths) revalidatePath(p);
}

// --- Trainers ---
export async function createTrainerAction(data) {
  const result = await trainersDb.createTrainer(data);
  refresh("/admin/trainers", "/trainers");
  return result;
}
export async function updateTrainerAction(id, data) {
  const result = await trainersDb.updateTrainer(id, data);
  refresh("/admin/trainers", "/trainers");
  return result;
}
export async function deleteTrainerAction(id) {
  const result = await trainersDb.deleteTrainer(id);
  refresh("/admin/trainers", "/trainers");
  return result;
}

// --- Programs ---
export async function createProgramAction(data) {
  const result = await programsDb.createProgram(data);
  refresh("/admin/programs", "/programs");
  return result;
}
export async function updateProgramAction(id, data) {
  const result = await programsDb.updateProgram(id, data);
  refresh("/admin/programs", "/programs");
  return result;
}
export async function deleteProgramAction(id) {
  const result = await programsDb.deleteProgram(id);
  refresh("/admin/programs", "/programs");
  return result;
}

// --- Membership Plans ---
export async function createPlanAction(data) {
  const result = await membershipsDb.createPlan(data);
  refresh("/admin/memberships", "/membership");
  return result;
}
export async function updatePlanAction(id, data) {
  const result = await membershipsDb.updatePlan(id, data);
  refresh("/admin/memberships", "/membership");
  return result;
}
export async function deletePlanAction(id) {
  const result = await membershipsDb.deletePlan(id);
  refresh("/admin/memberships", "/membership");
  return result;
}

// --- Class definitions & sessions ---
export async function createClassDefinitionAction(data) {
  const result = await classesDb.createClassDefinition(data);
  refresh("/admin/classes", "/classes");
  return result;
}
export async function updateClassDefinitionAction(id, data) {
  const result = await classesDb.updateClassDefinition(id, data);
  refresh("/admin/classes", "/classes");
  return result;
}
export async function deleteClassDefinitionAction(id) {
  const result = await classesDb.deleteClassDefinition(id);
  refresh("/admin/classes", "/classes");
  return result;
}
export async function createSessionAction(data) {
  const result = await classesDb.createSession(data);
  refresh("/admin/classes", "/classes");
  return result;
}
export async function updateSessionAction(id, data) {
  const result = await classesDb.updateSession(id, data);
  refresh("/admin/classes", "/classes");
  return result;
}
export async function deleteSessionAction(id) {
  const result = await classesDb.deleteSession(id);
  refresh("/admin/classes", "/classes");
  return result;
}
export async function updateBookingStatusAction(id, status) {
  const result = await classesDb.updateBookingStatus(id, status);
  refresh("/admin/bookings", "/classes");
  return result;
}

// --- Supplements ---
export async function createSupplementAction(data) {
  const result = await supplementsDb.createSupplement(data);
  refresh("/admin/supplements", "/supplements");
  return result;
}
export async function updateSupplementAction(id, data) {
  const result = await supplementsDb.updateSupplement(id, data);
  refresh("/admin/supplements", "/supplements");
  return result;
}
export async function deleteSupplementAction(id) {
  const result = await supplementsDb.deleteSupplement(id);
  refresh("/admin/supplements", "/supplements");
  return result;
}
export async function updateOrderStatusAction(id, status) {
  const result = await supplementsDb.updateOrderStatus(id, status);
  refresh("/admin/orders");
  return result;
}

// --- Nutrition (flatten sample-meals textarea into structured array) ---
function toNutritionPlanPayload(data) {
  const { sampleMealsText, mealTiming, ...rest } = data;
  const sampleMeals = (sampleMealsText || "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [meal, ...items] = line.split(":");
      return { meal: (meal || "").trim(), items: items.join(":").trim() };
    });
  return { ...rest, sampleMeals, mealTiming: Array.isArray(mealTiming) ? mealTiming : [] };
}
export async function createNutritionPlanAction(data) {
  const result = await nutritionDb.createNutritionPlan(toNutritionPlanPayload(data));
  refresh("/admin/nutrition", "/nutrition");
  return result;
}
export async function updateNutritionPlanAction(id, data) {
  const result = await nutritionDb.updateNutritionPlan(id, toNutritionPlanPayload(data));
  refresh("/admin/nutrition", "/nutrition");
  return result;
}
export async function deleteNutritionPlanAction(id) {
  const result = await nutritionDb.deleteNutritionPlan(id);
  refresh("/admin/nutrition", "/nutrition");
  return result;
}
export async function updateConsultationStatusAction(id, status) {
  const result = await nutritionDb.updateConsultationStatus(id, status);
  refresh("/admin/nutrition");
  return result;
}
export async function createNutritionistAction(data) {
  const result = await nutritionDb.createNutritionist(data);
  refresh("/admin/nutrition", "/nutrition/consultation");
  return result;
}
export async function updateNutritionistAction(id, data) {
  const result = await nutritionDb.updateNutritionist(id, data);
  refresh("/admin/nutrition", "/nutrition/consultation");
  return result;
}
export async function deleteNutritionistAction(id) {
  const result = await nutritionDb.deleteNutritionist(id);
  refresh("/admin/nutrition", "/nutrition/consultation");
  return result;
}

// --- Personal Training bookings ---
export async function updatePTBookingStatusAction(id, status) {
  const result = await personalTrainingDb.updatePTBookingStatus(id, status);
  refresh("/admin/bookings");
  return result;
}

// --- Transformations (flatten stats.before/after for the generic form) ---
function toTransformationPayload(data) {
  const { statsBefore, statsAfter, ...rest } = data;
  return { ...rest, stats: { before: statsBefore, after: statsAfter } };
}
export async function createTransformationAction(data) {
  const result = await transformationsDb.createTransformation(toTransformationPayload(data));
  refresh("/admin/transformations", "/transformations");
  return result;
}
export async function updateTransformationAction(id, data) {
  const result = await transformationsDb.updateTransformation(id, toTransformationPayload(data));
  refresh("/admin/transformations", "/transformations");
  return result;
}
export async function deleteTransformationAction(id) {
  const result = await transformationsDb.deleteTransformation(id);
  refresh("/admin/transformations", "/transformations");
  return result;
}

// --- Testimonials ---
export async function createTestimonialAction(data) {
  const result = await testimonialsDb.createTestimonial(data);
  refresh("/admin/testimonials", "/");
  return result;
}
export async function updateTestimonialAction(id, data) {
  const result = await testimonialsDb.updateTestimonial(id, data);
  refresh("/admin/testimonials", "/");
  return result;
}
export async function deleteTestimonialAction(id) {
  const result = await testimonialsDb.deleteTestimonial(id);
  refresh("/admin/testimonials", "/");
  return result;
}

// --- Events ---
export async function createEventAction(data) {
  const result = await eventsDb.createEvent(data);
  refresh("/admin/events", "/events");
  return result;
}
export async function updateEventAction(id, data) {
  const result = await eventsDb.updateEvent(id, data);
  refresh("/admin/events", "/events");
  return result;
}
export async function deleteEventAction(id) {
  const result = await eventsDb.deleteEvent(id);
  refresh("/admin/events", "/events");
  return result;
}

// --- Blog (flatten paragraph textarea into a content array) ---
function toBlogPayload(data) {
  const { contentText, ...rest } = data;
  return { ...rest, content: (contentText || "").split("\n").map((p) => p.trim()).filter(Boolean) };
}
export async function createBlogPostAction(data) {
  const result = await blogDb.createBlogPost(toBlogPayload(data));
  refresh("/admin/blog", "/blog");
  return result;
}
export async function updateBlogPostAction(id, data) {
  const result = await blogDb.updateBlogPost(id, toBlogPayload(data));
  refresh("/admin/blog", "/blog");
  return result;
}
export async function deleteBlogPostAction(id) {
  const result = await blogDb.deleteBlogPost(id);
  refresh("/admin/blog", "/blog");
  return result;
}

// --- Gallery ---
export async function createGalleryImageAction(data) {
  const result = await galleryDb.createGalleryImage(data);
  refresh("/admin/gallery", "/gallery");
  return result;
}
export async function updateGalleryImageAction(id, data) {
  const result = await galleryDb.updateGalleryImage(id, data);
  refresh("/admin/gallery", "/gallery");
  return result;
}
export async function deleteGalleryImageAction(id) {
  const result = await galleryDb.deleteGalleryImage(id);
  refresh("/admin/gallery", "/gallery");
  return result;
}

// --- Facilities ---
export async function createFacilityAction(data) {
  const result = await facilitiesDb.createFacility(data);
  refresh("/admin/facilities", "/facilities");
  return result;
}
export async function updateFacilityAction(id, data) {
  const result = await facilitiesDb.updateFacility(id, data);
  refresh("/admin/facilities", "/facilities");
  return result;
}
export async function deleteFacilityAction(id) {
  const result = await facilitiesDb.deleteFacility(id);
  refresh("/admin/facilities", "/facilities");
  return result;
}

// --- Members ---
export async function createMemberAction(data) {
  const result = await membersDb.createMember(data);
  refresh("/admin/members");
  return result;
}
export async function updateMemberAction(id, data) {
  const result = await membersDb.updateMember(id, data);
  refresh("/admin/members");
  return result;
}
export async function deleteMemberAction(id) {
  const result = await membersDb.deleteMember(id);
  refresh("/admin/members");
  return result;
}

// --- Messages ---
export async function updateEnquiryStatusAction(id, status) {
  const result = await messagesDb.updateEnquiryStatus(id, status);
  refresh("/admin/messages");
  return result;
}
