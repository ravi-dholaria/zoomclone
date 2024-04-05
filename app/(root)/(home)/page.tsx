import React from "react";

const home = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white">
      <div className="h-[300px] w-full rounded-[20px] bg-hero bg-cover">
        <div className="flex h-full flex-col justify-between max-md:px-5 max-md:py-8 lg:p-11">
          <h2 className="glassmorphism max-w-[270px] selection:rounded py-2 text-center text-base">
            Upcoming Meetings
          </h2>
          <div className="flex flex-col gap-2">
            <h1></h1>
          </div>
        </div>
      </div>
    </section>
  );
};

export default home;
