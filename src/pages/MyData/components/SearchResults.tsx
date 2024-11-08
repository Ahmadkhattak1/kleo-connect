import { useEffect, useState } from "react";
import { SearchResultsList } from "../mockData";
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from "@/components/ui/button";
import { Trash2, Lock, Unlock, CircleDollarSign, Gift } from "lucide-react";

interface SearchResultsProps { }

export const SearchResults = ({ }: SearchResultsProps) => {
  const [searchResults, setSearchResults] = useState(SearchResultsList);
  const [selectAll, setSelectAll] = useState(false);
  const [selectedCount, setSelectedCount] = useState(0);

  useEffect(
    () => setSelectedCount(searchResults.filter((item) => item.isSelected).length)
    , []
  );

  // Handle Select All / Deselect All
  const handleSelectAll = () => {
    const newSelectAll = !selectAll;
    setSelectAll(newSelectAll);
    const updatedSearchResults = searchResults.map((job) => ({
      ...job,
      selected: newSelectAll,
    }));
    setSearchResults(updatedSearchResults);
    setSelectedCount(newSelectAll ? updatedSearchResults.length : 0);
  };

  // Handle individual item selection
  const handleSelectJob = (id: number) => {
    const updatedSearchResults = searchResults.map((job) => {
      if (job.id === id) {
        return { ...job, isSelected: !job.isSelected };
      }
      return job;
    });
    setSearchResults(updatedSearchResults);
    setSelectedCount(updatedSearchResults.filter((job) => job.isSelected).length);
    setSelectAll(updatedSearchResults.every((job) => job.isSelected));
  };

  return (
    <>

      <div className="flex justify-between items-center w-full">
        <h2 className="font-inter font-semibold text-2xl mb-2">Search Results</h2>
        <div className="flex justify-end items-center gap-4">
          <div className="flex justify-end items-center gap-2 bg-grayblue-200 rounded-lg p-2 px-4">
            {/* Selected Count Label */}
            <div className="text-gray-700 font-medium">
              {selectedCount} Selected
            </div>

            {/* Select All / Deselect All Checkbox */}
            <Checkbox
              checked={selectAll}
              onCheckedChange={handleSelectAll}
              className="h-4 w-4"
            />
          </div>
          <div className="w-px h-6 bg-gray-300" />
          {/* Action Icons */}
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
      {/* Job List */}
      <ul className="space-y-2">
        {searchResults.map((job) => (
          <li
            key={job.id}
            className={`flex justify-between items-center border p-3 rounded-md ${job.isSelected ? 'bg-gray-100' : ''
              }`}
          >
            <div className="flex items-center space-x-2">
              <Checkbox
                checked={job.isSelected}
                onCheckedChange={() => handleSelectJob(job.id)}
                className="h-4 w-4"
              />
              <div>
                <h3 className="font-medium">{job.title}</h3>
                <p className="text-sm text-gray-500">{job.domainName}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </>
  )
}