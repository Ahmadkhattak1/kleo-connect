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
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);
  const [faviconFailed, setFaviconFailed] = useState<Record<number, boolean>>({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil(searchResults.length / ENTRIES_PER_PAGE);

  useEffect(() => setSelectedCount(searchResults.filter((item) => item.isSelected).length), [searchResults]);

  // ----------------- Select All Handler ----------------- //
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSearchResults = searchResults.map((item) => ({
      ...item,
      isSelected: newSelectAll,
    }));
    setSearchResults(updatedSearchResults);
    setSelectedCount(newSelectAll ? updatedSearchResults.length : 0);
  };

  // ----------------- Handle SearchItem selection ----------------- //
  const handleSelectSearchResult = (id: number) => {
    const updatedSearchResults = searchResults.map((item) => {
      if (item.id === id) {
        return { ...item, isSelected: !item.isSelected };
      }
      return item;
    });
    setSearchResults(updatedSearchResults);
    setSelectedCount(updatedSearchResults.filter((job) => job.isSelected).length);
    setSelectAll(updatedSearchResults.every((job) => job.isSelected));
  };

  // ----------------- Favicon Handling ----------------- //
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

  // ----------------- Pagination Helpers ----------------- //
  // Handle page change
  const handlePageChange = (pageNumber: number) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Determine current page search results to show
  const paginatedResults = searchResults.slice(
    (currentPage - 1) * ENTRIES_PER_PAGE,
    currentPage * ENTRIES_PER_PAGE
  );

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
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              className="h-4 w-4"
            />
          </div>
          <div className="w-px h-6 bg-gray-300" />
          <div className="flex bg-grayblue-200 rounded-lg">
            <Button variant="ghost" disabled={selectedCount === 0} size="icon" className="hover:bg-grayblue-300">
              <Trash2 />
            </Button>
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
              checked={searchResult.isSelected}
              onCheckedChange={() => handleSelectSearchResult(searchResult.id)}
              className="h-4 w-4 mr-2"
            />
          </li>
        ))}
      </ul>

      {/* Pagination */}
      <div className="flex justify-end w-full">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
};
