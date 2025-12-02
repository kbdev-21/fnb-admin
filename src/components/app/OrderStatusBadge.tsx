import { uppercaseFirstLetter } from "@/utils/string-utils";

export default function OrderStatusBadge({
  status,
}: {
  status: "PENDING" | "PREPARING" | "FULFILLED" | "CANCELED";
}) {
  const getStatusStyles = () => {
    switch (status) {
      case "FULFILLED":
        return "bg-gray-200 text-gray-500 dark:bg-gray-900/30 dark:text-gray-400 border border-gray-300 dark:border-gray-800";
      case "CANCELED":
        return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400 border border-red-200 dark:border-red-800";
      case "PREPARING":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400 border border-yellow-200 dark:border-yellow-800";
      case "PENDING":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  return (
    <div
      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getStatusStyles()}`}
    >
      {uppercaseFirstLetter(status)}
    </div>
  );
}
