"use client";
import { motion } from "motion/react";
import React, { JSX, useState } from "react";

import { cn } from "@/lib/utils";

type Card = {
  id: number;
  content: JSX.Element | React.ReactNode | string;
  className: string;
  thumbnail: string;
};

export const LayoutGrid = ({ cards }: { cards: Card[] }) => {
  const [selected, setSelected] = useState<Card | null>(null);
  const [lastSelected, setLastSelected] = useState<Card | null>(null);

  const handleClick = (card: Card) => {
    setLastSelected(selected);
    setSelected(card);
  };

  const handleOutsideClick = () => {
    setLastSelected(selected);
    setSelected(null);
  };

  return (
    <div className="w-full h-full p-10 grid grid-cols-1 md:grid-cols-3 max-w-7xl mx-auto gap-4 relative">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          onClick={() => handleClick(card)}
          className={cn(
            // Base styles first
            "relative overflow-hidden cursor-pointer",
            selected?.id === card.id
              ? "rounded-lg absolute inset-0 h-1/2 w-full md:w-1/2 m-auto z-50 flex justify-center items-center flex-wrap flex-col"
              : lastSelected?.id === card.id
                ? "z-40 rounded-xl w-full bg-gray-900/50"
                : "rounded-xl w-full bg-gray-900/50 hover:bg-gray-800/50 transition-colors duration-300",
            // Allow card-provided sizing (e.g., h-64) to take precedence
            card.className
          )}
          layoutId={`card-${card.id}`}
          whileHover={{ scale: selected?.id !== card.id ? 1.05 : 1 }}
          transition={{ duration: 0.3 }}
        >
          {selected?.id === card.id && <SelectedCard selected={selected} />}
          <ImageComponent card={card} />
        </motion.div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          "absolute h-full w-full left-0 top-0 bg-black opacity-0 z-10",
          selected?.id ? "pointer-events-auto" : "pointer-events-none"
        )}
        animate={{ opacity: selected?.id ? 0.3 : 0 }}
      />
    </div>
  );
};

const ImageComponent = ({ card }: { card: Card }) => {
  return (
    <motion.img
      layoutId={`image-${card.id}-image`}
      src={card.thumbnail}
      height="500"
      width="500"
      className={cn(
        "object-cover object-center absolute inset-0 h-full w-full transition duration-200 brightness-75 hover:brightness-100"
      )}
      alt="thumbnail"
    />
  );
};

const SelectedCard = ({ selected }: { selected: Card | null }) => {
  return (
    <div className="bg-transparent h-full w-full flex flex-col justify-center rounded-lg shadow-2xl relative z-[60]">
      <motion.div
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 0.8,
        }}
        className="absolute inset-0 h-full w-full bg-black/80 backdrop-blur-sm z-10 rounded-lg"
      />
      <motion.div
        layoutId={`content-${selected?.id}`}
        initial={{
          opacity: 0,
          y: 50,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        exit={{
          opacity: 0,
          y: 50,
        }}
        transition={{
          duration: 0.4,
          ease: "easeInOut",
        }}
        className="relative z-[70] max-h-full overflow-y-auto"
      >
        {selected?.content}
      </motion.div>
    </div>
  );
};
