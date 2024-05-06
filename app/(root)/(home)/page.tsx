import MeetingTypeList from "@/components/MeetingTypeList";
import React from "react";
const time = new Date()
  .toLocaleTimeString("en-In", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })
  .toUpperCase();

const date = new Intl.DateTimeFormat("en-IN", { dateStyle: "full" }).format(
  new Date()
);
const home = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 md:p-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] selection:rounded py-2 text-center text-base">
            Upcoming Meetings
          </h2>
          <div className="flex flex-col gap-2">
            <h1 className="text-4xl font-extrabold lg:text-7xl">{time}</h1>
            <p className="text-lg font-medium text-sky-1 lg:text-2xl">{date}</p>
          </div>
        </div>
      </div>
      <MeetingTypeList />
    </section>
  );
};

export default home;
