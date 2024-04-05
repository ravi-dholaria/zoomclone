import React from "react";
import { SignIn } from "@clerk/nextjs";

const SingInPage = () => {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <SignIn />
    </main>
  );
};

export default SingInPage;
