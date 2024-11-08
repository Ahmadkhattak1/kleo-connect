import Navbar, { PAGE_NAMES } from "../../common/components/Navbar";
import { ReactComponent as SpaceCat } from '../../../assets/myData/spaceCat.svg';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SearchIcon } from "lucide-react";
import CustomSelect from "./components/CustomSelect";
import { DataTypeMenuList, SelectionTypesMenuList, TimeRangeMenuList } from "./mockData";

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
      <div className="my-data-wrapper flex flex-col justify-start items-start w-full h-full">
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

        <div className="filter-wrapper w-full mt-4 flex justify-between">
          {/* selectionType and selectActions container */}
          <div className="flex items-center justify-start">
            {/* Selection Types : [All, None, Private, Public, Monetized, NonMonetized] */}
            <CustomSelect
              menuList={SelectionTypesMenuList}
              buttonClassName="min-w-[160px] bg-grayblue-200 hover:bg-grayblue-300"
              contentClassName="custom-popover-content"
              align="start"
              onChange={(value) => console.log('Selection Type : ', value)}
            />
          </div>
          {/* Filters wrapper */}
          <div className="flex justify-end items-center gap-4">
            <CustomSelect
              menuList={DataTypeMenuList}
              buttonClassName="min-w-[100px] bg-transparent border border-grayblue-300 hover:bg-grayblue-200"
              contentClassName=""
              align="start"
              placeholder="Data Type"
              onChange={(value) => console.log('Selected Data Type : ', value)}
            />
            <CustomSelect
              menuList={DataTypeMenuList}
              buttonClassName="min-w-[100px] bg-transparent border border-grayblue-300 hover:bg-grayblue-200"
              contentClassName=""
              align="start"
              placeholder="Activity Type"
              onChange={(value) => console.log('Selected Data Type : ', value)}
            />
            <CustomSelect
              menuList={TimeRangeMenuList}
              buttonClassName="min-w-[100px] bg-transparent border border-grayblue-300 hover:bg-grayblue-200"
              contentClassName=""
              align="start"
              placeholder="Time Range"
              onChange={(value) => console.log('Selected Data Type : ', value)}
            />
          </div>
        </div>
      </div>

    </div>
  </div>
}