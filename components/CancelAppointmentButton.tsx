"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { updateAppointment } from "@/lib/actions/appointment.actions";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export function CancelAppointmentButton({
  appointmentId,
  userId,
}: {
  appointmentId: string;
  userId: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [reason, setReason] = useState("");

  const handleCancel = async () => {
    setIsLoading(true);
    const result = await updateAppointment({
      appointmentId,
      userId,
      appointment: {
        status: "cancelled",
        cancellationReason: reason.trim() || "No reason provided",
      },
      type: "cancel",
    });

    if (result) {
      toast.success("Appointment cancelled");
      setOpen(false);
      router.refresh();
    } else {
      toast.error("Failed to cancel appointment");
    }
    setIsLoading(false);
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline" size="sm" className="shad-danger-btn">
          Cancel
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent className="shad-alert-dialog">
        <AlertDialogHeader>
          <AlertDialogTitle>Cancel this appointment?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. The appointment will be marked as
            cancelled and the provider will be notified.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="px-6">
          <label className="text-14-medium text-dark-700 block mb-2">
            Reason for cancellation
          </label>
          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Tell us why you're cancelling..."
            className="w-full rounded-md border border-dark-500 bg-dark-400 px-3 py-2 text-sm text-white placeholder:text-dark-600 focus:outline-none focus:ring-1 focus:ring-green-500 min-h-[80px] resize-none"
            disabled={isLoading}
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel className="shad-gray-btn" disabled={isLoading}>
            Keep Appointment
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleCancel}
            disabled={isLoading}
            className="shad-danger-btn"
          >
            {isLoading ? "Cancelling..." : "Yes, Cancel"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
