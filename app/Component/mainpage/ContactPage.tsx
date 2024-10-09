"use client";
import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { User, Mail, Phone, MapPin, MessageSquare, Check } from "lucide-react";

const contactSchema = z.object({
  fullName: z.string().min(2, "Full name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phoneNumber: z.string().regex(/^\d{10}$/, "Phone number must be 10 digits"),
  // cityLocality: z.string().min(2, "City/Locality must be at least 2 characters"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  privacyPolicy: z.literal(true, {
    errorMap: () => ({ message: "You must agree to the privacy policy" }),
  }),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(
    null
  );

  const onSubmit: SubmitHandler<ContactFormData> = async (data) => {
    setIsSubmitting(true);
    try {
      // Here you would typically send the data to your backend
      console.log(data);
      setSubmitStatus("success");
      reset();
    } catch (error) {
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClasses = `w-full pl-10 pr-3 py-2 border rounded-md shadow-md  transition duration-150 ease-in-out`;
  const iconClasses =
    "absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400";

  return (
    <div className="max-w-md mx-auto p-6 rounded-lg shadow-2xl">
      <div className="flex justify-center mb-6">
        <Mail size={48} className="text-blue-800" />
      </div>
      {submitStatus === "success" && (
        <div
          className=" text-green-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Success!</strong>
          <span className="block sm:inline">
            {" "}
            Your message has been sent successfully!
          </span>
        </div>
      )}
      {submitStatus === "error" && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">Error!</strong>
          <span className="block sm:inline">
            {" "}
            There was a problem sending your message. Please try again.
          </span>
        </div>
      )}
      <h1 className="text-2xl font-bold mb-6 text-center">Get in Touch</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="relative">
          <User className={iconClasses} size={20} />
          <input
            {...register("fullName")}
            placeholder="Full Name"
            className={`${inputClasses} ${
              errors.fullName ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm mt-1">
              {errors.fullName.message}
            </p>
          )}
        </div>

        <div className="relative">
          <Mail className={iconClasses} size={20} />
          <input
            {...register("email")}
            type="email"
            placeholder="Email"
            className={`${inputClasses} ${
              errors.email ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
          )}
        </div>

        <div className="relative">
          <Phone className={iconClasses} size={20} />
          <input
            {...register("phoneNumber")}
            type="tel"
            placeholder="Phone Number"
            className={`${inputClasses} ${
              errors.phoneNumber ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.phoneNumber && (
            <p className="text-red-500 text-sm mt-1">
              {errors.phoneNumber.message}
            </p>
          )}
        </div>

        {/* <div className="relative">
          <MapPin className={iconClasses} size={20} />
          <input
            {...register("cityLocality")}
            placeholder="City/Locality"
            className={`${inputClasses} ${errors.cityLocality ? "border-red-500" : "border-gray-300"}`}
          />
          {errors.cityLocality && <p className="text-red-500 text-sm mt-1">{errors.cityLocality.message}</p>}
        </div> */}

        <div className="relative">
          <MessageSquare
            className={`${iconClasses} top-3 transform-none`}
            size={20}
          />
          <textarea
            {...register("message")}
            placeholder="Your Message"
            className={`${inputClasses} pl-10 ${
              errors.message ? "border-red-500" : "border-gray-300"
            }`}
            rows={4}
          ></textarea>
          {errors.message && (
            <p className="text-red-500 text-sm mt-1">
              {errors.message.message}
            </p>
          )}
        </div>

        <div className="flex items-start">
          <div className="flex items-center h-5">
            <input
              {...register("privacyPolicy")}
              type="checkbox"
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="privacyPolicy" className="text-gray-600">
              I agree to the privacy policy
            </label>
          </div>
        </div>
        {errors.privacyPolicy && (
          <p className="text-red-500 text-sm mt-1">
            {errors.privacyPolicy.message}
          </p>
        )}

        <div className="flex flex-col items-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white py-2 px-4 rounded-md  flex items-center"
          >
            {isSubmitting ? (
              "Sending..."
            ) : (
              <>
                <Check className="mr-2" size={20} />
                Send
              </>
            )}
          </button>
          <p className="mt-4 text-sm text-gray-600">
            You may call now: 1234567832
          </p>
        </div>
      </form>
    </div>
  );
};

export default ContactPage;
