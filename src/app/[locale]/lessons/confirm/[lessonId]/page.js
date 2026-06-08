"use client";

import ConfirmLesson from "@/features/lessonsC/confirmlesson/ConfirmLesson";
import Cookies from "js-cookie";

export default function ConfirmLessonSharedPage() {
  const role = Cookies.get("roleUser") || "student";
  return (
    <div>
      <ConfirmLesson role={role} />
    </div>
  );
}

