import React from "react";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  onPageChange: (page: number) => Promise<void>;
  isLoading: boolean;
  prefetchedPages: Set<number>;
}

const Pagination = ({
  currentPage,
  totalPages,
  totalItems,
  onPageChange,
  isLoading,
  prefetchedPages,
}: PaginationProps) => {
  // Calculate visible page numbers
  const getVisiblePages = (): (number | string)[] => {
    const delta = 2;
    const range: number[] = [];
    const rangeWithDots: (number | string)[] = [];
    let l: number | undefined;

    for (let i = 1; i <= totalPages; i++) {
      if (
        i === 1 ||
        i === totalPages ||
        (i >= currentPage - delta && i <= currentPage + delta)
      ) {
        range.push(i);
      }
    }

    range.forEach((i) => {
      if (l !== undefined) {
        if (i - l === 2) {
          rangeWithDots.push(l + 1);
        } else if (i - l !== 1) {
          rangeWithDots.push("...");
        }
      }
      rangeWithDots.push(i);
      l = i;
    });

    return rangeWithDots;
  };

  return (
    <div className="w-full py-8">
      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Summary */}
        <div className="text-sm text-gray-600">
          Showing page {currentPage} of {totalPages} ({totalItems} total
          hostels)
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center gap-2">
          {/* Previous Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1 || isLoading}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="w-5 h-5" />
          </motion.button>

          {/* Page Numbers */}
          <div className="flex items-center gap-2">
            <AnimatePresence mode="wait">
              {getVisiblePages().map((pageNumber, index) =>
                pageNumber === "..." ? (
                  <span key={`dots-${index}`} className="px-2 text-gray-400">
                    •••
                  </span>
                ) : (
                  <motion.button
                    key={pageNumber}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => onPageChange(pageNumber as number)}
                    disabled={isLoading || currentPage === pageNumber}
                    className={`relative px-4 py-2 rounded-lg text-sm font-medium transition-all
                      ${
                        currentPage === pageNumber
                          ? "bg-blue-600 text-white shadow-md"
                          : "hover:bg-gray-50 border border-gray-200"
                      } disabled:cursor-not-allowed`}
                  >
                    {pageNumber}
                    {prefetchedPages.has(pageNumber as number) &&
                      pageNumber !== currentPage && (
                        <motion.div
                          className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ duration: 0.2 }}
                        />
                      )}
                  </motion.button>
                )
              )}
            </AnimatePresence>
          </div>

          {/* Next Button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages || isLoading}
            className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 
                     disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Loading Indicator */}
        <AnimatePresence>
          {isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="flex items-center gap-2 text-sm text-gray-600"
            >
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading page...
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Pagination;
