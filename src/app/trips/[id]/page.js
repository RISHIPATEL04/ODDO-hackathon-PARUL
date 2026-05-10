import { redirect } from "next/navigation";

export default async function TripRoot({ params }) {
  const { id } = await params;
  redirect(`/trips/${id}/itinerary`);
}
