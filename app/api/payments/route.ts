import Razorpay from "razorpay";
import { NextRequest, NextResponse } from "next/server";

const razorpay = new Razorpay({
  //  key_id: process.env.RAZERPAY_KEY,
  //  key_secret: process.env.RAZERPAY_SECRET,
  key_id: "rzp_test_iaR3rE6L32N9P0",
  key_secret: "JAQXaoBuVyNCPpCciPIm3ECj",
});

export async function POST(request: NextRequest) {
  const { amount, currency } = (await request.json()) as {
    amount: string;
    currency: string;
  };

  const options = {
    amount: amount,
    currency: currency,
    receipt: "rcp1",
  };
  const order = await razorpay.orders.create(options);
  console.log(order);
  return NextResponse.json({ orderId: order.id }, { status: 200 });
}
