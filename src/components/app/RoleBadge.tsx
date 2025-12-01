export function RoleBadge({
  role,
  storeCode,
}: {
  role: "CUSTOMER" | "STAFF" | "ADMIN";
  storeCode?: string;
}) {
  const getRoleStyles = () => {
    switch (role) {
      case "ADMIN":
        return "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400 border border-purple-200 dark:border-purple-800";
      case "STAFF":
        return "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400 border border-blue-200 dark:border-blue-800";
      case "CUSTOMER":
        return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 border border-green-200 dark:border-green-800";
      default:
        return "bg-primary text-primary-foreground";
    }
  };

  const getRoleDisplayText = () => {
    switch (role) {
      case "ADMIN":
        return "Admin";
      case "CUSTOMER":
        return "Customer";
      case "STAFF":
        return "Staff";
      default:
        return role;
    }
  };

  return (
    <div
      className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${getRoleStyles()}`}
    >
      {role === "STAFF" && storeCode
        ? `${getRoleDisplayText()} at ${storeCode}`
        : getRoleDisplayText()}
    </div>
  );
}
