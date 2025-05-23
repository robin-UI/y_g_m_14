import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function GET(request: Request) {
    await dbConnect();
    const { searchParams } = new URL(request.url);
    const _id = searchParams.get("id");
    
    if (!_id) {
        return new Response(JSON.stringify({ error: "User Not Found" }), {
        status: 400,
        });
    }
    
    const user = await UserModel.findOne({ _id });
    
    if (!user) {
        return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
        });
    }
    
    return new Response(
        JSON.stringify({
        name: user.name,
        email: user.email,
        isAcceptingMessages: user.isAcceptingMessages,
        }),
        { status: 200 }
    );
}