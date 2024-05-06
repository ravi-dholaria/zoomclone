import React from "react";
import CallList from "@/components/CallList";
const previous = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <h1 className="text-3xl font-bold">previous</h1>
      <CallList type="ended" />
    </section>
  );
};

export default previous;
