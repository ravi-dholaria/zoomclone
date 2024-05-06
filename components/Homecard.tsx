import React from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";

interface HomeCardProps {
  className?: string;
  img: string;
  title: string;
  description: string;
  HandleClick: () => void;
}

const HomeCard = ({
  className,
  img,
  title,
  description,
  HandleClick,
}: HomeCardProps) => {
  return (
    <div
      className={cn(
        " px-4 py-6 flex flex-col justify-between w-full xl:max-wl[270px] min-h-[260px] rounded-[14px] cursor-pointer",
        className
      )}
      onClick={HandleClick}
    >
      <div className="flex-center glassmorphism size-12 rounded-[10px]">
        <Image src={img} alt="Add Meeting" width={27} height={27} />
      </div>
      <div className="flex flex-col">
        <h1 className="text-lg font-bold">{title}</h1>
        <p className="text-lg font-normal">{description}</p>
      </div>
    </div>
  );
};

export default HomeCard;
