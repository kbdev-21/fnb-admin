import {
  Pagination as UIPagination,
  PaginationLink,
  PaginationPrevious,
  PaginationItem,
  PaginationContent,
  PaginationNext,
} from "@/components/ui/pagination";

type CustomPaginationProps = {
  totalPages: number;
  currentPage: number;
  onPageChange: (pageIndex: number) => void;
  isLoading?: boolean;
  error?: unknown;
};

export default function CustomPagination({
  totalPages,
  currentPage,
  onPageChange,
  isLoading,
  error,
}: CustomPaginationProps) {
  if (isLoading || error || totalPages === 0) {
    return null;
  }

  function goToPage(pageIndex: number) {
    if (pageIndex < 0 || pageIndex >= totalPages) return;
    onPageChange(pageIndex);
  }

  function onPrev(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    goToPage(currentPage - 1);
  }

  function onNext(e: React.MouseEvent<HTMLAnchorElement>) {
    e.preventDefault();
    goToPage(currentPage + 1);
  }

  return (
    <UIPagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={onPrev}
            className={
              currentPage === 0
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>

        {Array.from({ length: totalPages }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationLink
              isActive={i === currentPage}
              onClick={(e) => {
                e.preventDefault();
                goToPage(i);
              }}
              className="cursor-pointer"
            >
              {i + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        <PaginationItem>
          <PaginationNext
            onClick={onNext}
            className={
              currentPage === totalPages - 1
                ? "pointer-events-none opacity-50"
                : "cursor-pointer"
            }
          />
        </PaginationItem>
      </PaginationContent>
    </UIPagination>
  );
}
