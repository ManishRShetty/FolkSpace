"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "@/lib/firebase"; // Adjust path

// Backend URL - should match your login page
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

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Debug effect to monitor error state changes
  useEffect(() => {
    if (error) {
      console.log("Error state updated:", error);
    }
  }, [error]);

  // Nordic countries for the dropdown
  const nordicCountries = [
    { value: "", label: "Select a country" },
    { value: "denmark", label: "Denmark" },
    { value: "finland", label: "Finland" },
    { value: "iceland", label: "Iceland" },
    { value: "norway", label: "Norway" },
    { value: "sweden", label: "Sweden" },
  ];

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    // Validation
    if (!username.trim()) {
      setError("Username is required.");
      setIsLoading(false);
      return;
    }
    if (!country) {
      setError("Please select a country.");
      setIsLoading(false);
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters long.");
      setIsLoading(false);
      return;
    }

    try {
      // 1. Create Firebase user
      const result = await createUserWithEmailAndPassword(auth, email, password);
      const user = result.user;

      // 2. Update Firebase profile with username
      await updateProfile(user, {
        displayName: username,
      });

      // 3. Get Firebase ID token
      const idToken = await user.getIdToken();

      // 4. Create user in your backend database
      try {
        const response = await tryBackendCall("/create-db", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${idToken}`,
          },
          body: JSON.stringify({
            username: username,
            email: email,
            region: country,
          }),
        });

        console.log("Response status:", response.status);

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to create user account in database.");
        }

        // 5. Get userId and store it
        const data = await response.json();
        console.log("Backend response:", data);
        if (data.userId) {
          localStorage.setItem("userId", data.userId);
        } else {
          throw new Error("Backend response is missing 'userId'.");
        }

        // 6. Redirect to onboarding or dashboard
        router.push("/onboarding");

      } catch (apiError: any) {
        console.error("Error calling /create-db:", apiError);
        setError(`Account created, but failed to sync with database: ${apiError.message}`);
        setIsLoading(false);
        return;
      }

    } catch (err: any) {
      // Handle Firebase signup errors
      console.error("Error signing up:", err);
      console.error("Error code:", err.code); // Debug logging
      console.error("Full error object:", err); // More detailed debugging
      
      setIsLoading(false); // Reset loading state immediately
      
      // Small delay to ensure UI updates properly
      setTimeout(() => {
        if (err.code === "auth/email-already-in-use") {
          console.log("Setting email-already-in-use error message");
          setError("This email address is already in use. Please try with a different email or sign in instead.");
        } else if (err.code === "auth/invalid-email") {
          setError("Please enter a valid email address.");
        } else if (err.code === "auth/weak-password") {
          setError("Password is too weak. Please choose a stronger password.");
        } else if (err.code === "auth/operation-not-allowed") {
          setError("Email/password accounts are not enabled. Please contact support.");
        } else {
          setError(`An unexpected error occurred: ${err.message || "Please try again."}`);
        }
      }, 100);
    }
  };

  return (
    // Main container: centers the form vertically and horizontally
    <main className="flex min-h-screen items-center justify-center bg-gray-100 p-4 dark:bg-gray-900">
      
      {/* Form Card */}
      <div className="w-full max-w-sm rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
        <h1 className="mb-6 text-center text-3xl font-bold text-gray-900 dark:text-white">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-6">
          {/* Username Field */}
          <div>
            <label
              htmlFor="username"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Username
            </label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Email Field */}
          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Country Field */}
          <div>
            <label
              htmlFor="country"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Country
            </label>
            <select
              id="country"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500 dark:focus:ring-blue-500"
            >
              {nordicCountries.map((countryOption) => (
                <option key={countryOption.value} value={countryOption.value}>
                  {countryOption.label}
                </option>
              ))}
            </select>
          </div>

          {/* Password Field */}
          <div>
            <label
              htmlFor="password"
              className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              // Add pattern for accessibility/guidance, though Firebase handles the 6-char rule
              minLength={6}
              className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-semibold text-white shadow-sm transition duration-200 ease-in-out hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed dark:focus:ring-offset-gray-800"
          >
            {isLoading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Error Message Display */}
        {error && (
          <div className="mt-4 text-center text-sm font-medium text-red-600 dark:text-red-400">
            <p>{error}</p>
            {error.includes("already in use") && (
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-2 text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300 underline"
              >
                Go to Sign In page
              </button>
            )}
          </div>
        )}

        {/* Debug info - remove in production */}
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-2 text-xs text-gray-500">
            Error state: {error ? 'Has error' : 'No error'} | Loading: {isLoading ? 'true' : 'false'}
          </div>
        )}

        {/* Sign In Link */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={() => router.push("/login")}
              className="font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Sign in here
            </button>
          </p>
        </div>
      </div>
    </main>
  );
}