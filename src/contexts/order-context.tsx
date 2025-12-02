import {
  createContext,
  useContext,
  type ReactNode,
  useState,
  useEffect,
} from "react";

export type OrderLineSelectedOption = {
  optionId: string;
  selectionId: string;
};

export type OrderLine = {
  productId: string;
  selectedOptions: OrderLineSelectedOption[];
  selectedToppingIds: string[];
  quantity: number;
};

type OrderContextType = {
  storeCode: string | null;
  setStoreCode: (code: string | null) => void;
  orderMethod: "PICK_UP" | "DELIVERY";
  setOrderMethod: (method: "PICK_UP" | "DELIVERY") => void;
  destination: string;
  setDestination: (destination: string) => void;
  discountCode: string | null;
  setDiscountCode: (code: string | null) => void;
  lines: OrderLine[];
  setLines: (lines: OrderLine[]) => void;
  increaseLineQuantity: (
    productId: string,
    selectedOptions: OrderLineSelectedOption[],
    selectedToppingIds: string[],
    quantity: number
  ) => void;
  decreaseLineQuantity: (
    productId: string,
    selectedOptions: OrderLineSelectedOption[],
    selectedToppingIds: string[]
  ) => void;
  clearLines: () => void;
};

const STORAGE_KEYS = {
  STORE_CODE: "order_storeCode",
  ORDER_METHOD: "order_orderMethod",
  DESTINATION: "order_destination",
  LINES: "order_lines",
} as const;

const OrderContext = createContext<OrderContextType | undefined>(undefined);

export function OrderProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage with lazy initialization
  const [storeCode, setStoreCodeState] = useState<string | null>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.STORE_CODE);
    return stored ? JSON.parse(stored) : null;
  });

  const [orderMethod, setOrderMethodState] = useState<"PICK_UP" | "DELIVERY">(
    () => {
      const stored = localStorage.getItem(STORAGE_KEYS.ORDER_METHOD);
      return stored
        ? (JSON.parse(stored) as "PICK_UP" | "DELIVERY")
        : "DELIVERY";
    }
  );

  const [destination, setDestinationState] = useState<string>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.DESTINATION);
    return stored ? JSON.parse(stored) : "";
  });

  const [discountCode, setDiscountCodeState] = useState<string | null>(null);

  const [lines, setLinesState] = useState<OrderLine[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEYS.LINES);
    return stored ? JSON.parse(stored) : [];
  });

  // Sync state changes to localStorage
  useEffect(() => {
    if (storeCode !== null) {
      localStorage.setItem(
        STORAGE_KEYS.STORE_CODE,
        JSON.stringify(storeCode)
      );
    } else {
      localStorage.removeItem(STORAGE_KEYS.STORE_CODE);
    }
  }, [storeCode]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.ORDER_METHOD,
      JSON.stringify(orderMethod)
    );
  }, [orderMethod]);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEYS.DESTINATION,
      JSON.stringify(destination)
    );
  }, [destination]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.LINES, JSON.stringify(lines));
  }, [lines]);

  // Wrapper functions that update both state and localStorage
  const setStoreCode = (code: string | null) => {
    setStoreCodeState(code);
  };

  const setOrderMethod = (method: "PICK_UP" | "DELIVERY") => {
    setOrderMethodState(method);
  };

  const setDestination = (dest: string) => {
    setDestinationState(dest);
  };

  const setDiscountCode = (code: string | null) => {
    setDiscountCodeState(code);
  };

  const setLines = (newLines: OrderLine[]) => {
    setLinesState(newLines);
  };

  function increaseLineQuantity(
    productId: string,
    selectedOptions: OrderLineSelectedOption[],
    selectedToppingIds: string[],
    quantity: number
  ) {
    setLinesState((prevLines) => {
      const matchingIndex = prevLines.findIndex((line) =>
        isLineMatch(
          line,
          productId,
          selectedOptions,
          selectedToppingIds
        )
      );

      if (matchingIndex === -1) {
        // Line doesn't exist, add it with the specified quantity
        return [
          ...prevLines,
          {
            productId,
            selectedOptions,
            selectedToppingIds,
            quantity,
          },
        ];
      }

      // Line exists, increase quantity by the specified amount
      const updatedLines = [...prevLines];
      updatedLines[matchingIndex] = {
        ...updatedLines[matchingIndex],
        quantity: updatedLines[matchingIndex].quantity + quantity,
      };
      return updatedLines;
    });
  }

  function decreaseLineQuantity(
    productId: string,
    selectedOptions: OrderLineSelectedOption[],
    selectedToppingIds: string[]
  ) {
    setLinesState((prevLines) => {
      const matchingIndex = prevLines.findIndex((line) =>
        isLineMatch(
          line,
          productId,
          selectedOptions,
          selectedToppingIds
        )
      );

      if (matchingIndex === -1) {
        return prevLines; // No matching line found
      }

      const matchingLine = prevLines[matchingIndex];
      const newQuantity = matchingLine.quantity - 1;

      // If quantity reaches 0, remove the line
      if (newQuantity <= 0) {
        return prevLines.filter((_, index) => index !== matchingIndex);
      }

      // Otherwise, decrease the quantity
      const updatedLines = [...prevLines];
      updatedLines[matchingIndex] = {
        ...matchingLine,
        quantity: newQuantity,
      };
      return updatedLines;
    });
  }

  function clearLines() {
    setLinesState([]);
  }

  return (
    <OrderContext.Provider
      value={{
        storeCode,
        setStoreCode,
        orderMethod,
        setOrderMethod,
        destination,
        setDestination,
        discountCode,
        setDiscountCode,
        lines,
        setLines,
        increaseLineQuantity,
        decreaseLineQuantity,
        clearLines,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error("Context must be used within a OrderProvider");
  }
  return context;
}

// Helper function to compare selectedOptions arrays (order-independent)
function areOptionsEqual(
  a: OrderLineSelectedOption[],
  b: OrderLineSelectedOption[]
): boolean {
  if (a.length !== b.length) return false;
  const aSet = new Set(a.map((opt) => `${opt.optionId}:${opt.selectionId}`));
  const bSet = new Set(b.map((opt) => `${opt.optionId}:${opt.selectionId}`));
  return aSet.size === bSet.size && [...aSet].every((key) => bSet.has(key));
}

// Helper function to compare selectedToppingIds arrays (order-independent)
function areToppingsEqual(a: string[], b: string[]): boolean {
  if (a.length !== b.length) return false;
  const aSet = new Set(a);
  const bSet = new Set(b);
  return aSet.size === bSet.size && [...aSet].every((id) => bSet.has(id));
}

// Helper function to check if a line matches the given parameters
function isLineMatch(
  line: OrderLine,
  productId: string,
  selectedOptions: OrderLineSelectedOption[],
  selectedToppingIds: string[]
): boolean {
  return (
    line.productId === productId &&
    areOptionsEqual(line.selectedOptions, selectedOptions) &&
    areToppingsEqual(line.selectedToppingIds, selectedToppingIds)
  );
}
