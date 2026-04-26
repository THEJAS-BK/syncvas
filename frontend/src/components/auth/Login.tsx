import React, { useState, type JSX } from "react";
import type { LoginFormData } from "../../types/Auth";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@mui/material";
import api from "../../utils/axios";

export default function Login(): JSX.Element {
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let fieldName = e.target.name as keyof LoginFormData;
    let fieldValue = e.target.value;

    setFormData((curData) => {
      return { ...curData, [fieldName]: fieldValue };
    });
  };

  const navigate = useNavigate();

  //send inputs to backend
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await api.post(`/auth/login`, formData);
    if (res.status === 200) {
      console.log(res);
      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("refreshToken", res.data.refreshToken);
      navigate("/dashboard");
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <form
        className="border-2 flex flex-col p-5 gap-12"
        onSubmit={handleSubmit}
      >
        <h1 className="text-center text-2xl">Login</h1>
        <div className="flex flex-col gap-3">
          <input
            className="border rounded-l p-2 w-100"
            onChange={handleChange}
            placeholder="Email"
            type="text"
            name="email"
            id=""
          />
          <input
            className="border rounded-l p-2 w-100"
            onChange={handleChange}
            placeholder="Password"
            type="password"
            name="password"
            id=""
          />
        </div>
        <Button variant="contained" type="submit">
          Login
        </Button>
        <div>
          <Link to="/register"> Register</Link>
        </div>
      </form>
    </div>
  );
}
