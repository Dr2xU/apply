import axios from 'axios';

const API_URL = "http://localhost:5000/api/auth"; // ✅ Make sure this points to backend

// 🔹 User Registration
export const registerUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/register`, { email, password });
    return response.data;
  } catch (error) {
    throw error.response?.data?.error || "Registration failed";
  }
};

// 🔹 User Login (Checks user in DB)
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    return response.data; // ✅ Returns JWT token
  } catch (error) {
    throw error.response?.data?.error || "Invalid credentials";
  }
};
