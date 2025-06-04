import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "../../../lib/connectDB";
import User from "../../../models/User";

export async function GET(req) {
  try {
    // Get token from cookies
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "No token provided" },
        {
          status: 401,
          headers: {
            "Access-Control-Allow-Origin": req.headers.get("origin") || "*",
            "Access-Control-Allow-Credentials": "true",
          },
        }
      );
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    // Get user without password
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Return user with secure cookie options
    const response = NextResponse.json({ 
      success: true, 
      user,
      token // Return the token in response if needed for client-side
    });

    // Update both cookies to extend their session
    response.cookies.set({
      name: "token",
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost"
    });

    response.cookies.set({
      name: "client-token",
      value: token,
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : "localhost"
    });

    return response;
  } catch (err) {
    console.error("Error in /api/user/me:", err);
    return NextResponse.json(
      {
        success: false,
        message:
          err.name === "JsonWebTokenError" ? "Invalid token" : "Server error",
      },
      { status: 401 }
    );
  }
}


export async function PUT(req) {
  const token = req.cookies.get("token")?.value;

  if (!token) {
    return NextResponse.json(
      { success: false, message: "No token provided" },
      { status: 401 }
    );
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    await connectDB();

    const contentType = req.headers.get("content-type") || "";
    let data = {};
    let avatarUrl = null;

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      data.name = formData.get("name");
      data.email = formData.get("email");
      data.bio = formData.get("bio");

      const file = formData.get("avatar");
      if (file && typeof file === "object") {
        const buffer = Buffer.from(await file.arrayBuffer());

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader
            .upload_stream(
              { folder: "bookclub-profile-pics" },
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            )
            .end(buffer);
        });

        avatarUrl = result.secure_url;
      }
    } else {
      data = await req.json();
      avatarUrl = data.avatarUrl;
    }

    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    user.name = data.name ?? user.name;
    user.email = data.email ?? user.email;
    user.bio = data.bio ?? user.bio;
    user.avatarUrl = avatarUrl ?? user.avatarUrl;

    await user.save();

    return NextResponse.json({ success: true, user });
  } catch (err) {
    console.error(err);
    return NextResponse.json(
      { success: false, message: "Invalid token or error" },
      { status: 401 }
    );
  }
}
