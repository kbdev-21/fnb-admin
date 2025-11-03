import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip";


export default function TextTooltip({ children, text }: { children: React.ReactNode, text: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {children}
      </TooltipTrigger>
      <TooltipContent>
        <div className="text-sm">{text}</div>
      </TooltipContent>
    </Tooltip>
  );
}