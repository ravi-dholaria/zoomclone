import React from "react";
import { SignUp } from "@clerk/nextjs";

const SingUpPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignUp />
    </main>
  );
};

export default SingUpPage;
