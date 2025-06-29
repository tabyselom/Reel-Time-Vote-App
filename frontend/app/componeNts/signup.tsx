export type SignupFormInputs = {
  name: string;
  email: string;
  password: string;
};

export const signup = async (data: SignupFormInputs) => {
  console.log("Submitting signup data:", data);

  try {
    const response = await fetch("http://localhost:5000/api/user/create/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    const result = await response.json();
    console.log("Signup response:", result);

    if (response.ok) {
      console.log("Signup successful!", result);
      localStorage.setItem("userId", result.userId);
      // Redirect to the login page or home page
      window.location.href = "/"; // Adjust the redirect path as needed
    } else {
      console.error("Signup failed:", result.message);
      alert(result.message || "Signup failed");
    }
  } catch (error) {
    console.error("Network error:", error);
    alert("Network error, please try again.");
  }
};
