"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
// Import for email/password sign-in
import { signInWithEmailAndPassword } from "firebase/auth";
// No longer need googleProvider
import { auth } from "@/lib/firebase";

// --- ATTENTION ---
// Make sure your .env.local file is set up
// const BACK_END_URL = process.env.NEXT_PUBLIC_BACK_END_URL;
const BACK_END_URL = "https://backend-lnia.onrender.com";
const LOCAL_BACK_END_URL = "http://localhost:5000";

// Helper function to try multiple backend URLs
const tryBackendCall = async (endpoint: string, options: RequestInit) => {
  const urls = [BACK_END_URL, LOCAL_BACK_END_URL];
  
  for (const baseUrl of urls) {
    try {
      console.log(`Trying backend URL: ${baseUrl}${endpoint}`);
      const response = await fetch(`${baseUrl}${endpoint}`, options);
      
      // Check if response is actually JSON
      const contentType = response.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        const textResponse = await response.text();
        console.error(`Non-JSON response from ${baseUrl}:`, textResponse);
        continue; // Try next URL
      }
      
      return response; // Success
    } catch (error) {
      console.error(`Failed to connect to ${baseUrl}:`, error);
      continue; // Try next URL
    }
  }
  
  throw new Error("Failed to connect to any backend server");
};

export default function LoginPage() {
  // New state for email and password
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // --- NEW: Handles Email/Password Sign-In ---
  const handleEmailSignIn = async (e: React.FormEvent) => {
    // Prevent form from reloading the page
    e.preventDefault();
    setError(null);

    try {
      // 1. Sign in with Firebase Auth
      const result = await signInWithEmailAndPassword(auth, email, password);
      const user = result.user;
      const idToken = await user.getIdToken();

      // --- LOGIC FROM PREVIOUS STEP (Unchanged) ---
      // 2. Call your backend for ALL users
      try {
        const response = await tryBackendCall("/create-db", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // Send the Firebase ID token for backend authentication
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            // displayName might be null, so use email as a fallback
            username: user.displayName || user.email || "New User",
            email: user.email,
            region: null,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || "Failed to create/get database entry.");
        }

        // 3. Get response and STORE userId in localStorage
        const data = await response.json();
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        } else {
          throw new Error("Backend response is missing 'userId'.");
        }

      } catch (apiError: any) {
        console.error("Error calling /create-db:", apiError);
        setError(`Sign-in successful, but failed to sync account: ${apiError.message}`);
        return; // Don't redirect
      }
      // --- END LOGIC FROM PREVIOUS STEP ---

      // 4. Redirect ALL users to the dashboard
      // The isNewUser check is not possible with email/password sign in
      router.push("/dashboard");

    } catch (err: any) {
      // Handle Firebase sign-in errors
      console.error("Error with Email Sign-in:", err);
      if (
        err.code === "auth/user-not-found" ||
        err.code === "auth/wrong-password" ||
        err.code === "auth/invalid-credential"
      ) {
        setError("Invalid email or password. Please try again.");
      } else {
        setError("An unexpected error occurred. Please try again later.");
      }
    }
  };

  return (
    // Main container: centers the form vertically and horizontally
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      
      {/* Login Card */}
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Sign In
        </h1>

        {/* --- NEW Email/Password Form --- */}
        <form onSubmit={handleEmailSignIn} className="space-y-6">
          {/* Email Input */}
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Password Input */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-200"
            >
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white"
            />
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              className="flex w-full justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900"
            >
              Sign In
            </button>
          </div>
        </form>
        {/* --- END New Form --- */}

        {/* Error Message Display */}
        {error && (
          <p className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
            {error}
          </p>
        )}

        {/* Sign Up Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign up here
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}