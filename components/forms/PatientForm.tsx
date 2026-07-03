"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { Form } from "@/components/ui/form";
import {
  createUser,
  sendOTP,
  verifyOTP,
} from "@/lib/actions/patient.actions";
import { UserFormValidation } from "@/lib/validation";

import "react-phone-number-input/style.css";
import CustomFormField, { FormFieldType } from "../CustomFormField";
import SubmitButton from "../SubmitButton";

export const PatientForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<"form" | "otp">("form");
  const [otp, setOtp] = useState("");
  const [otpError, setOtpError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [userId, setUserId] = useState("");
  const [userEmail, setUserEmail] = useState("");

  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);
    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);
      if (newUser) {
        setUserId(newUser.$id);
        setUserEmail(values.email);
        setEmailError("");
        const otpResult = await sendOTP(values.email);
        if (!otpResult.success) {
          setEmailError(otpResult.error || "Failed to send verification code");
          toast.error(otpResult.error || "Failed to send code");
          return;
        }
        toast.success("Verification code sent to your email");
        setStep("otp");
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  const handleVerifyOTP = async () => {
    setIsLoading(true);
    setOtpError("");

    const result = await verifyOTP(userEmail, otp);
    if (result.success) {
      toast.success("Verified successfully");
      router.push(`/patients/${userId}/register`);
    } else {
      const msg = result.error || "Verification failed";
      setOtpError(msg);
      toast.error(msg);
    }

    setIsLoading(false);
  };

  if (step === "otp") {
    return (
      <div className="flex-1 space-y-6">
        <button
          type="button"
          onClick={() => { setStep("form"); setOtpError(""); }}
          className="flex items-center gap-2 text-dark-700 hover:text-white mb-4"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          Back
        </button>
        <section className="mb-12 space-y-4">
          <h1 className="header">Check your email</h1>
          <p className="text-dark-700">
            We sent a 6-digit code to <strong>{userEmail}</strong>
          </p>
        </section>

        <div className="flex flex-col items-center gap-4">
          <InputOTP
            maxLength={6}
            value={otp}
            onChange={(value) => setOtp(value)}
          >
            <InputOTPGroup className="shad-otp">
              <InputOTPSlot className="shad-otp-slot" index={0} />
              <InputOTPSlot className="shad-otp-slot" index={1} />
              <InputOTPSlot className="shad-otp-slot" index={2} />
              <InputOTPSlot className="shad-otp-slot" index={3} />
              <InputOTPSlot className="shad-otp-slot" index={4} />
              <InputOTPSlot className="shad-otp-slot" index={5} />
            </InputOTPGroup>
          </InputOTP>

          {otpError && (
            <p className="shad-error text-14-regular">{otpError}</p>
          )}

          <button
            onClick={handleVerifyOTP}
            disabled={isLoading || otp.length !== 6}
            className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2 shad-primary-btn w-full"
          >
            {isLoading ? "Verifying..." : "Verify"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="flex-1 space-y-6">
        <section className="mb-12 space-y-4">
          <h1 className="header">Hi there 👋</h1>
          <p className="text-dark-700">Get started with appointments.</p>
        </section>

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Full name"
          placeholder="John Doe"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <CustomFormField
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="Email"
          placeholder="johndoe@gmail.com"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Phone number"
          placeholder="(555) 123-4567"
        />

        {emailError && (
          <p className="shad-error text-14-regular">{emailError}</p>
        )}
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
};
