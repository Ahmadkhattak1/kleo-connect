import Navbar, { PAGE_NAMES } from "../../common/components/Navbar";
import { ReactComponent as SpaceCat } from '../../../assets/myData/spaceCat.svg';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import CustomSelect from "./components/CustomSelect";
import { ActivityTypesMenuList, DataTypeMenuList, SearchResultsSummary, TimeRangeMenuList } from "./mockData";
import { SearchResults } from "./components/SearchResults";

interface MyDataComponentProps { }

export const MyData = ({ }: MyDataComponentProps) => {
  // --------------- Validate UserAddress Logic --------------- //
  const [userAddress, setUserAddress] = useState<string | null>(localStorage.getItem('address'));
  const [isKleoConnectReady, setIsKleoConnectReady] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkKleoConnect = () => {
      // Poll for the availability of window.kleoConnect
      if ((window as any).kleoConnect) {
        setIsKleoConnectReady(true);
        console.log('kleoConnect is ready:', (window as any).kleoConnect);

        // Assign signIn method if not already assigned
        if (!(window as any).signIn) {
          (window as any).signIn = (window as any).kleoConnect.signIn;
        }
      } else {
        console.log('Waiting for kleoConnect...');
        setTimeout(checkKleoConnect, 100); // Poll every 100ms
      }
    };

    checkKleoConnect(); // Start polling
  }, []);

  useEffect(() => {
    if (!isKleoConnectReady) return; // Wait until kleoConnect is ready

    const validateAddresses = async () => {
      try {
        const pathname = window.location.pathname;
        let urlAddress = pathname.split('/profile/')[1]; // Address from URL
        urlAddress = String(userAddress).replace('/', '');
        const localStorageAddress = localStorage.getItem('address');

        // Call signIn to get the address from the extension
        const result = await (window as any).signIn();
        const extensionAddress = result.address;

        // Check if all three addresses match
        if (
          urlAddress !== localStorageAddress ||
          urlAddress !== extensionAddress ||
          localStorageAddress !== extensionAddress
        ) {
          navigate('/signup/0'); // Redirect to signup if addresses don't match
        } else {
          setUserAddress(localStorageAddress);
        }
      } catch (error) {
        console.error('Error during signIn or address check:', error);
        navigate('/signup/0'); // Redirect on error
      }
    };

    validateAddresses(); // Call the validation function
  }, [isKleoConnectReady]);

  // --------------- END: Validate UserAddress Logic --------------- //

  const [isResultsLoading, setIsResultsLoading] = useState<boolean>(false);

  return <div className="bg-grayblue-100 h-full">
    <Navbar
      userAddress={userAddress || ''}
      page={PAGE_NAMES.MY_DATA}
    />
    {/* <div className="flex items-center justify-center min-h-screen bg-white">
      <div className="w-full max-w-md p-8 bg-gray-100 rounded-lg shadow-lg">
        <div className="flex items-center justify-center w-full h-fit mb-4">
          <SpaceCat />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-center text-[#1e2536]">Coming Soon...</h1>
        <p className="text-center text-gray-600">
          We're working hard to bring you something amazing. Stay tuned!
        </p>
      </div>
    </div> */}
    <div className="w-full container mx-auto py-4 px-6 flex justify-between items-center mt-[72px] pt-12">
      <div className="my-data-wrapper flex flex-col justify-start items-start w-full h-full gap-[30px]">
        {/* SearchBar + Filters */}
        <div className="flex flex-col justify-start items-start w-full gap-4">
          {/* Search Bar */}
          <div className="search-bar-wrapper w-full">
            <div className="bg-white flex items-center justify-center px-4 py-1 pr-1 rounded-lg w-full">
              <SearchIcon className="size-5" />
              <Input
                type="search"
                placeholder="Search"
                className="size-full border-none bg-transparent focus:outline-none font-inter text-sm"
              />
              <Button type="submit" className="bg-primary-btn-500 text-white">Search</Button>
            </div>
          </div>

          {/* Filters wrapper */}
          <div className="filter-wrapper w-full flex justify-start items-center gap-4">
            <CustomSelect
              menuList={DataTypeMenuList}
              buttonClassName="min-w-[150px] bg-transparent border border-grayblue-300 hover:bg-grayblue-200"
              contentClassName=""
              value="all"
              align="start"
              placeholder="Data Type"
              onChange={(value) => console.log('Selected Data Type : ', value)}
              disabled={isResultsLoading}
            />
            <CustomSelect
              menuList={ActivityTypesMenuList}
              buttonClassName="min-w-[150px] bg-transparent border border-grayblue-300 hover:bg-grayblue-200"
              contentClassName=""
              align="start"
              placeholder="Activity Type"
              onChange={(value) => console.log('Selected Data Type : ', value)}
              disabled={isResultsLoading}
            />
            <CustomSelect
              menuList={TimeRangeMenuList}
              buttonClassName="min-w-[150px] bg-transparent border border-grayblue-300 hover:bg-grayblue-200"
              contentClassName=""
              align="start"
              placeholder="Time Range"
              onChange={(value) => console.log('Selected Data Type : ', value)}
              disabled={isResultsLoading}
            />
          </div>
        </div>

        {/* Summary of Result Data */}
        <div className="w-full bg-grayblue-200 p-[20px] rounded-[14px] h-fit">
          <h2 className="font-inter font-semibold text-2xl mb-2">Summary</h2>
          <ul className="font-inter font-normal text-base list-disc ml-5">
            {SearchResultsSummary.map((summaryItem, index) => {
              return (
                <li key={index}>{summaryItem}</li>
              );
            })}
          </ul>
        </div>

        {/* Search Results Title + Actions */}
        <SearchResults />
      </div>
    </div>
  </div>
}