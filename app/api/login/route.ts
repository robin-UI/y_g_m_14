import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import bcrypt from "bcrypt";

export async function POST(request: Request) {
    try {
        await dbConnect();

        // Parse and validate request body
        const body = await request.json();
        const { emailOrPhone, password } = body;

        // Input validation
        if (!emailOrPhone || !password) {
            return new Response(
                JSON.stringify({ error: "Email/phone and password are required" }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Enhanced email/phone detection
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isEmail = emailRegex.test(emailOrPhone);
        
        // Build query based on input type
        const query = isEmail 
            ? { email: emailOrPhone.toLowerCase() } // Normalize email to lowercase
            : { mobileNmber: emailOrPhone };

        // Find user by email OR phone
        const existingUser = await UserModel.findOne(query)
            .select('+password'); // Ensure password is included if it's normally excluded

        // Check if user exists
        if (!existingUser) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }), 
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Validate password
        const isPasswordValid = await bcrypt.compare(password, existingUser.password);
        
        if (!isPasswordValid) {
            return new Response(
                JSON.stringify({ error: "Invalid credentials" }), 
                { 
                    status: 401,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Login successful - return user data (excluding password)
        return new Response(
            JSON.stringify({
                message: "Login successful",
                user: {
                    id: existingUser._id,
                    name: `${existingUser.firstName} ${existingUser.lastName}`,
                    email: existingUser.email,
                    mobileNmber: existingUser.mobileNmber,
                },
            }),
            { 
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );

    } catch (error) {
        console.error('Login error:', error);
        
        // Handle JSON parsing errors
        if (error instanceof SyntaxError) {
            return new Response(
                JSON.stringify({ error: "Invalid JSON in request body" }), 
                { 
                    status: 400,
                    headers: { 'Content-Type': 'application/json' }
                }
            );
        }

        // Handle database connection errors
        return new Response(
            JSON.stringify({ error: "Internal server error" }), 
            { 
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    }
}