"use client";

import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Script from "next/script";

type PricingTier = {
  name: string;
  description: string;
  price: number;
  billing: string;
  features: string[];
  buttonText: string;
  isPopular?: boolean;
};

const pricingTiers: PricingTier[] = [
  {
    name: "Starter",
    description: "Perfect for students exploring mentorship",
    price: 29,
    billing: "per month",
    features: [
      "1 one-hour phone call session",
      "Access to mentor messaging",
      "Community forum access",
      "Learning resources library",
      "Email support",
    ],
    buttonText: "Get Started",
  },
  {
    name: "Growth",
    description: "Ideal for dedicated learners",
    price: 49,
    billing: "per month",
    features: [
      "2 one-hour sessions (phone or video)",
      "Unlimited mentor messaging",
      "Community forum access",
      "Learning resources library",
      "Priority email support",
      "Resume or portfolio review",
    ],
    buttonText: "Sign Up Now",
    isPopular: true,
  },
  {
    name: "Professional",
    description: "For serious career advancement",
    price: 99,
    billing: "per month",
    features: [
      "4 one-hour sessions (phone, video, or in-person)",
      "Unlimited mentor messaging",
      "Community forum access",
      "Learning resources library",
      "Priority support with 24-hour response",
      "Resume and portfolio review",
      "Career path planning session",
      "Technical interview preparation",
    ],
    buttonText: "Contact Us",
  },
];

const PricingSection = () => {
  const amount = "29";
  const createOrderId = async () => {
    try {
      const response = await fetch("/api/payments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: parseFloat(amount) * 100,
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };

  const processPayment = async () => {
    // e.preventDefault();
    try {
      const orderId: string = await createOrderId();
      const options = {
        // key: process.env.key_id,
        key: "rzp_test_iaR3rE6L32N9P0",
        amount: parseFloat(amount) * 100,
        currency: "INR",
        name: "name",
        description: "description",
        order_id: orderId,
        handler: async function (response: any) {
          const data = {
            orderCreationId: orderId,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
          };

          const result = await fetch("/api/verify", {
            method: "POST",
            body: JSON.stringify(data),
            headers: { "Content-Type": "application/json" },
          });
          const res = await result.json();
          if (res.isOk) alert("payment succeed");
          else {
            alert(res.message);
          }
        },
        prefill: {
          name: "Robin",
          email: "robinbiju@gmail.com",
        },
        theme: {
          color: "#3399cc",
        },
      };
      const paymentObject = new window.Razorpay(options);
      paymentObject.on("payment.failed", function (response: any) {
        alert(response.error.description);
      });
      paymentObject.open();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-grey-800">
              Affordable Mentorship Plans
            </h2>
            <p className="text-xl text-grey-600 max-w-2xl mx-auto">
              Choose the plan that fits your learning needs and budget
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingTiers.map((tier, index) => (
              <div
                key={index}
                className={`rounded-xl ${
                  tier.isPopular
                    ? "border-2 border-primary relative shadow-xl"
                    : "border border-grey-200 shadow-md"
                } bg-white p-8`}
              >
                {tier.isPopular && (
                  <span className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm font-medium">
                    Most Popular
                  </span>
                )}

                <h3
                  className={`text-2xl font-bold mb-2 ${
                    tier.isPopular ? "text-primary" : "text-grey-800"
                  }`}
                >
                  {tier.name}
                </h3>
                <p className="text-grey-600 mb-6">{tier.description}</p>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-grey-800">
                    ${tier.price}
                  </span>
                  <span className="text-grey-600">/{tier.billing}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="h-5 w-5 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span className="text-grey-700">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    tier.isPopular
                      ? "bg-primary hover:bg-primary-dark shadow-primary"
                      : "bg-grey-800 hover:bg-grey-900"
                  }`}
                  onClick={() => {
                    processPayment();
                  }}
                >
                  {tier.buttonText}
                </Button>
              </div>
            ))}
          </div>
          {/* <Button
          className={`w-full bg-primary hover:bg-primary-dark shadow-primary`}
          onClick={() => {
            processPayment();
          }}
        >
          Buy now
        </Button> */}
          <div className="mt-12 text-center">
            <p className="text-grey-600">
              Need a custom plan for your organization?{" "}
              <a href="#" className="text-primary font-medium underline">
                Contact our team
              </a>
            </p>
          </div>
        </div>
      </section>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
    </>
  );
};

export default PricingSection;
