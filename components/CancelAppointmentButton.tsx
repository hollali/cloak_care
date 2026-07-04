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

  const handleCancel = async () => {
    setIsLoading(true);
    const result = await updateAppointment({
      appointmentId,
      userId,
      appointment: {
        status: "cancelled",
        cancellationReason: "Cancelled by patient",
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
