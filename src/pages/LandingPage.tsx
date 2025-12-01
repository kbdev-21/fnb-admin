import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col gap-8 pt-10 pb-20">
      <ImageTextSection
        textSide="right"
        imageSrc="https://about.starbucks.com/uploads/2023/10/SBX20231026-Starbucks-Holiday-Drinks-and-Food-Menu-feature.jpg"
        imageAlt="landing-page-1"
        title="Happy Christmas"
        description="This Christmas, treasure every moment with your loved ones. Let us bring warmth and festive flavors to your home with doorstep delivery."
        buttonText="Place Order"
        bgClassName="bg-[#ac061f]"
        onClick={() => {
          navigate("/menu");
        }}
      />

      <ImageTextSection
        textSide="left"
        imageSrc="https://about.starbucks.com/uploads/2025/07/Starbucks-Strato-Frappuccino-1024x727.png"
        imageAlt="landing-page-2"
        title="Fresh Ingredients, Every Day"
        description="Every cup begins with the finest, freshly sourced ingredients, crafted daily to bring out vibrant flavors and natural richness in every sip. From farm to cup, we ensure quality you can taste, wherever your day takes you."
        buttonText="Find a Store"
        bgClassName="bg-primary"
      />
    </div>
  );
}

function ImageTextSection({
  textSide,
  imageSrc,
  imageAlt,
  title,
  description,
  buttonText,
  bgClassName = "bg-[#ac061f]",
  onClick,
}: {
  textSide: "left" | "right";
  imageSrc: string;
  imageAlt: string;
  title: string;
  description: string;
  buttonText: string;
  bgClassName?: string;
  onClick?: () => void;
}) {
  const imageElement = (
    <div className="h-[600px]">
      <img
        src={imageSrc}
        alt={imageAlt}
        className="w-full h-full object-cover"
      />
    </div>
  );

  const textElement = (
    <div
      className={`${bgClassName} h-[600px] flex flex-col justify-center items-center px-12 text-white gap-8`}
    >
      <div className="text-4xl font-[700] tracking-widest text-center">
        {title}
      </div>
      <div className="text-lg text-center">{description}</div>
      <Button
        size="lg"
        className={`text-lg font-semibold px-6 py-6 rounded-full ${bgClassName} text-white border border-white hover:${bgClassName}`}
        onClick={onClick}
      >
        {buttonText}
      </Button>
    </div>
  );

  return (
    <div className="grid grid-cols-2">
      {textSide === "left" ? (
        <>
          {textElement}
          {imageElement}
        </>
      ) : (
        <>
          {imageElement}
          {textElement}
        </>
      )}
    </div>
  );
}
