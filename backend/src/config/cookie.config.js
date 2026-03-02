const isProduction = process.env.NODE_ENV === "production";

  export const options = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      path: "/",
    };