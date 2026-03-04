// // src/utils/cookieHelper.js


// export const getCookieOptions = () => {
//     const baseOptions = {
//         httpOnly: true,
//         path: "/",
//         maxAge: 7 * 24 * 60 * 60 * 1000,
//     };

//     // Use different settings for development vs production
//     const isProduction = process.env.NODE_ENV === "production";

//     if (isProduction) {
//         // Production: Use secure cookies with sameSite None for cross-origin
//         return {
//             ...baseOptions,
//             secure: true,      // Requires HTTPS
//             sameSite: "None",  // Allows cross-origin (with secure: true)
//         };
//     } else {
//         // Development: Use Lax for localhost (works with HTTP)
//         return {
//             ...baseOptions,
//             secure: false,     // Allows HTTP in development
//             sameSite: "Lax",   // Works for same-site on localhost
//         };
//     }
// };


// export const setRefreshTokenCookie = (res, refreshToken) => {
//     const options = getCookieOptions();
//     res.cookie("refresh_token", refreshToken, options);

//     console.log(" Cookie set:", {
//         name: "refresh_token",
//         options,
//         tokenLength: refreshToken?.length,
//         environment: process.env.NODE_ENV,
//     });
// };


// export const clearRefreshTokenCookie = (res) => {
//     const options = getCookieOptions();
//     delete options.maxAge; // Remove maxAge when clearing

//     res.clearCookie("refresh_token", options);

//     console.log("  Cookie cleared:", {
//         name: "refresh_token",
//         options,
//         environment: process.env.NODE_ENV,
//     });
// };


// export const getRefreshToken = (req, isWeb) => {
//     if (isWeb) {
//         // Web client: Get from HTTP-only cookie
//         const token = req.cookies?.refresh_token || null;

//         // Debug logging
//         console.log(" Getting refresh token:", {
//             hasCookie: !!token,
//             cookieNames: Object.keys(req.cookies || {}),
//             isWeb,
//         });

//         return token;
//     } else {
//         // Mobile client: Get from Authorization header
//         const authHeader = req.header("Authorization");
//         if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
//             return null;
//         }
//         return authHeader.replace(/^Bearer\s+/i, "");
//     }
// };

// /**
//  * Validate that a refresh token exists
//  * @param {string|null} refreshToken - The refresh token to validate
//  * @throws {Error} If refresh token is missing
//  */
// export const validateRefreshToken = (refreshToken) => {
//     if (!refreshToken) {
//         const error = new Error("No refresh token provided");
//         error.statusCode = 401;
//         throw error;
//     }
// };

// src/utils/cookieHelper.js
// Unified helper that works for both simple auth and OAuth

/**
 * Get cookie options based on environment
 * Works for both development (HTTP) and production (HTTPS)
 */
export const getCookieOptions = () => {
    const baseOptions = {
        httpOnly: true,
        path: "/",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    };

    const isProduction = process.env.NODE_ENV === "production";

    if (isProduction) {
        // Production: Secure cookies with SameSite None for cross-origin
        return {
            ...baseOptions,
            secure: true,
            sameSite: "None",
        };
    } else {
        // Development: Lax for localhost (works with HTTP)
        return {
            ...baseOptions,
            secure: false,
            sameSite: "Lax",
        };
    }
};

/**
 * Set refresh token cookie
 * @param {Response} res - Express response object
 * @param {string} refreshToken - JWT refresh token
 */
export const setRefreshTokenCookie = (res, refreshToken) => {
    const options = getCookieOptions();
    res.cookie("refresh_token", refreshToken, options);

    console.log(" Cookie Set:", {
        name: "refresh_token",
        tokenLength: refreshToken?.length,
        environment: process.env.NODE_ENV,
        secure: options.secure,
        sameSite: options.sameSite,
    });
};

/**
 * Clear refresh token cookie
 * @param {Response} res - Express response object
 */
export const clearRefreshTokenCookie = (res) => {
    const options = getCookieOptions();
    delete options.maxAge; // Remove maxAge when clearing

    res.clearCookie("refresh_token", options);

    console.log(" Cookie Cleared:", {
        name: "refresh_token",
        environment: process.env.NODE_ENV,
    });
};

/**
 * Get refresh token from request
 * Works for both web (cookie) and mobile (header)
 * @param {Request} req - Express request object
 * @param {boolean} isWeb - Whether client is web or mobile
 * @returns {string|null} - Refresh token or null
 */
export const getRefreshToken = (req, isWeb) => {
    if (isWeb) {
        // Web client: Get from HTTP-only cookie
        const token = req.cookies?.refresh_token || null;

        console.log(" Getting Refresh Token (Web):", {
            hasCookie: !!token,
            cookieNames: Object.keys(req.cookies || {}),
        });

        return token;
    } else {
        // Mobile client: Get from Authorization header
        const authHeader = req.header("Authorization");

        if (!authHeader || !authHeader.toLowerCase().startsWith("bearer ")) {
            console.log(" Getting Refresh Token (Mobile): No bearer token found");
            return null;
        }

        const token = authHeader.replace(/^Bearer\s+/i, "");
        console.log(" Getting Refresh Token (Mobile):", {
            hasToken: !!token,
            tokenLength: token?.length,
        });

        return token;
    }
};

/**
 * Validate that a refresh token exists
 * @param {string|null} refreshToken - The refresh token to validate
 * @throws {Error} If refresh token is missing
 */
export const validateRefreshToken = (refreshToken) => {
    if (!refreshToken) {
        const error = new Error("No refresh token provided");
        error.statusCode = 401;
        throw error;
    }
};

/**
 * Handle cookie operations for authentication responses
 * Automatically sets cookie for web clients and returns data for mobile
 * @param {Response} res - Express response object
 * @param {Object} result - Service result with tokens
 * @param {boolean} isWeb - Whether client is web
 * @returns {Object} - Modified result (refreshToken removed for web)
 */
export const handleAuthResponse = (res, result, isWeb) => {
    if (result.success && isWeb && result.data?.refreshToken) {
        // Set cookie for web clients
        setRefreshTokenCookie(res, result.data.refreshToken);

        // Remove refreshToken from response body (it's in cookie now)
        const responseData = { ...result };
        delete responseData.data.refreshToken;

        console.log(" Auth Response Handled (Web):", {
            cookieSet: true,
            refreshTokenRemovedFromBody: true,
        });

        return responseData;
    }

    console.log(" Auth Response Handled (Mobile):", {
        cookieSet: false,
        refreshTokenInBody: !!result.data?.refreshToken,
    });

    // For mobile, return as-is (includes refreshToken in body)
    return result;
};

/**
 * Handle logout cookie operations
 * @param {Response} res - Express response object
 * @param {Object} result - Service result
 * @param {boolean} isWeb - Whether client is web
 * @returns {Object} - Result object
 */
export const handleLogoutResponse = (res, result, isWeb) => {
    if (result.success && isWeb) {
        clearRefreshTokenCookie(res);

        console.log(" Logout Response Handled (Web):", {
            cookieCleared: true,
        });
    }

    return result;
};