import { API_BASE_URL } from "../constant";

export type LoginFormInputs = {
  email: string;
  password: string;
};

export const Login = async (data: LoginFormInputs) => {
  console.log("Submitting login data:", data);

  try {
    const response = await fetch(`${API_BASE_URL}/api/user/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Login response:", result);

    if (response.ok) {
      console.log("Login successful!", result);
      localStorage.setItem("userId", result.userId);
      // Redirect to the dashboard or home page
      window.location.href = "/"; // Adjust the redirect path as needed
    } else {
      console.error("Login failed:", result.message);
      alert(result.message || "Login failed");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error, please try again.");
  }
};
