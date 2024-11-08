import { useEffect, useState } from "react";
import { SearchResultsList } from "../mockData";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Trash2, Lock, Unlock, CircleDollarSign, Gift, Globe } from "lucide-react";
import Pagination from "./Pagination";

// Constants for pagination
const ENTRIES_PER_PAGE = 5;

interface SearchResultsProps { }

export const SearchResults = ({ }: SearchResultsProps) => {
  const [searchResults, setSearchResults] = useState(SearchResultsList);
  const [selectAll, setSelectAll] = useState(false); // Global selectAll (across pages)
  const [selectedCount, setSelectedCount] = useState(0); // Count for the selected items across all pages
  const [faviconFailed, setFaviconFailed] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(searchResults.length / ENTRIES_PER_PAGE);

  // ----------------- Select All Handler ----------------- //
  // Track selected results on a per-page basis
  const [pageSelections, setPageSelections] = useState<Record<number, Set<number>>>(
    Array.from({ length: totalPages }, (_, i) => i + 1).reduce(
      (acc, page) => ({ ...acc, [page]: new Set<number>() }),
      {}
    )
  );

  // Update selected count whenever the page selections change
  useEffect(() => {
    const totalSelectedCount = Object.values(pageSelections)
      .map((selectedSet) => selectedSet.size)
      .reduce((acc, count) => acc + count, 0);
    setSelectedCount(totalSelectedCount);
  }, [pageSelections]);

  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);

    const updatedPageSelections = { ...pageSelections };
    if (newSelectAll) {
      // Select all on the current page
      const currentPageResults = searchResults.slice(
        (currentPage - 1) * ENTRIES_PER_PAGE,
        currentPage * ENTRIES_PER_PAGE
      );
      const selectedIds = new Set(currentPageResults.map((item) => item.id));
      updatedPageSelections[currentPage] = selectedIds;
    } else {
      // Deselect all on the current page
      updatedPageSelections[currentPage] = new Set<number>();
    }

    setPageSelections(updatedPageSelections);
  };

  const handleSelectSearchResult = (id: number) => {
    const updatedPageSelections = { ...pageSelections };
    const currentPageSelections = updatedPageSelections[currentPage];

    if (currentPageSelections.has(id)) {
      currentPageSelections.delete(id); // Deselect if already selected
    } else {
      currentPageSelections.add(id); // Select if not selected
    }

    setPageSelections(updatedPageSelections);
  };

  const getFaviconUrl = (url: string | undefined) => {
    try {
      const websiteUrl = new URL(url!);
      return `${websiteUrl.origin}/favicon.ico`;
    } catch (error) {
      return null;
    }
  };

  const handleFaviconError = (id: number) => {
    setFaviconFailed((prevState) => ({ ...prevState, [id]: true }));
  };

  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const paginatedResults = searchResults.slice(
    (currentPage - 1) * ENTRIES_PER_PAGE,
    currentPage * ENTRIES_PER_PAGE
  );

  // Determine if selectAll should be checked for the current page
  const isCurrentPageSelected = (currentPageSelections: Set<number>) =>
    paginatedResults.every((result) => currentPageSelections.has(result.id));

  const isCurrentPageSelectAllChecked = isCurrentPageSelected(pageSelections[currentPage]);

  return (
    <>
      <div className="flex justify-between items-center w-full">
        <h2 className="font-inter font-semibold text-2xl mb-2">Search Results</h2>
        <div className="flex justify-end items-center gap-4">
          <div className="flex justify-end items-center gap-2 bg-grayblue-200 rounded-lg p-2 px-4">
            <div className="text-gray-700 font-medium">
              {selectedCount} Selected
            </div>
            <Checkbox
              checked={isCurrentPageSelectAllChecked}
              onCheckedChange={handleSelectAll}
              className="h-4 w-4"
            />
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex bg-grayblue-200 rounded-lg">
            <Button variant="ghost" disabled={selectedCount === 0} size="icon" className="hover:bg-grayblue-300">
              <Lock />
            </Button>
            <Button variant="ghost" disabled={selectedCount === 0} size="icon" className="hover:bg-grayblue-300">
              <Unlock />
            </Button>
            <Button variant="ghost" disabled={selectedCount === 0} size="icon" className="hover:bg-grayblue-300">
              <CircleDollarSign />
            </Button>
            <Button variant="ghost" disabled={selectedCount === 0} size="icon" className="hover:bg-grayblue-300">
              <Gift />
            </Button>
            <Button variant="ghost" disabled={selectedCount === 0} size="icon" className="hover:bg-grayblue-300">
              <Trash2 />
            </Button>
          </div>
        </div>
      </div>

      {/* Search Results List */}
      <ul className="space-y-4 w-full">
        {paginatedResults.map((searchResult) => (
          <li
            key={searchResult.id}
            className={`flex p-4 bg-white rounded-lg shadow-sm items-center justify-between gap-6`}
          >
            <div className="flex items-center justify-start flex-1 gap-4">
              <div className="h-[50px] w-[50px] bg-[#EAECF5] rounded-lg flex items-center justify-center">
                {faviconFailed[searchResult.id] ? (
                  <Globe className="h-6 w-6 text-gray-700" />
                ) : (
                  <img
                    src={getFaviconUrl(searchResult.referenceUrl) || ''}
                    alt="Website icon"
                    className="h-full w-full rounded-md"
                    onError={() => handleFaviconError(searchResult.id)}
                  />
                )}
              </div>
              <div className="flex flex-col justify-between items-start font-inter font-normal">
                <div className="flex justify-start items-center gap-2">
                  <p className="font-semibold text-base">{searchResult.title}</p>
                  <a
                    href={searchResult.referenceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-gray-700"
                  >
                    ({new URL(searchResult.referenceUrl).hostname})
                  </a>
                  {!searchResult.isPublic && <Lock className="h-4 w-4 text-gray-700" />}
                  {searchResult.isMonetised && <CircleDollarSign className="h-4 w-4 text-gray-700" />}
                </div>
                <p className="font-inter font-normal text-sm text-gray-700">{searchResult.description}</p>
              </div>
            </div>
            <Checkbox
              checked={pageSelections[currentPage].has(searchResult.id)}
              onCheckedChange={() => handleSelectSearchResult(searchResult.id)}
              className="h-4 w-4 mr-2"
            />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="w-full flex justify-end">
        <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
      </div>
    </>
  );
};
