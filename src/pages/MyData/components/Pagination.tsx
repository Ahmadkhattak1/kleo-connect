import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      onPageChange(pageNumber);
    }
  };

  return (
    <div className="flex items-center gap-4">
      {/* Page X of Y Indicator */}
      <span className="text-gray-700">
        Page {currentPage} of {totalPages}
      </span>

      {/* First Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="bg-grayblue-200 hover:bg-grayblue-300 disabled:bg-grayblue-100"
      >
        <ChevronsLeft />
      </Button>

      {/* Previous Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="bg-grayblue-200 hover:bg-grayblue-300 disabled:bg-grayblue-100"
      >
        <ChevronLeft />
      </Button>

      {/* Next Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="bg-grayblue-200 hover:bg-grayblue-300 disabled:bg-grayblue-100"
      >
        <ChevronRight />
      </Button>

      {/* Last Page Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="bg-grayblue-200 hover:bg-grayblue-300 disabled:bg-grayblue-100"
      >
        <ChevronsRight />
      </Button>
    </div>
  );
};

export default Pagination;
