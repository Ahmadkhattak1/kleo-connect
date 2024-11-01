import React, { useEffect, useRef, useState } from 'react'
import PointsAndDataCard from './components/PointsAndData'
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js'
import DataQuality from './components/DataQuality'
import Milestones from './components/mileStones/Milestones'
import Snapshot from './components/Snapshot'
import Referrals from './components/Referrals'
import Leaderboard from './components/Leaderboard'
import Privacy from './components/Privacy'
import LeaderBoardBanner from './components/LeaderBoardBanner'
import Navbar, { PAGE_NAMES } from './components/Navbar'
import useFetch from '../common/hooks/useFetch'
import { Method } from 'axios'
import { useNavigate } from 'react-router-dom';

interface UserGraphResponse {
  processing?: boolean;
  data?: GraphLabelItem[];
  error?: string
}

interface GraphLabelItem {
  label: string;
  percentage: number;
}

interface UploadResponse {
  url?: string;
  error?: string;
  // Add other fields as needed
}

type CanvasSource = HTMLCanvasElement | HTMLImageElement;

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
)

const ONE_HOUR_IN_MS = 60 * 60 * 1000;

const canUpload = () => {
  const lastUploadTime = localStorage.getItem('lastUploadTime');
  if (lastUploadTime) {
    const timeSinceLastUpload = Date.now() - parseInt(lastUploadTime);
    return timeSinceLastUpload > ONE_HOUR_IN_MS;
  }
  return true;
};

const setLastUploadTime = () => {
  localStorage.setItem('lastUploadTime', Date.now().toString());
};

const showToastError = (message: string) => {
  const toast = document.getElementById('toast-error');
  const errorText = document.getElementById('error-text');

  if (toast && errorText) {
    errorText.innerText = message;
    toast.classList.remove('hidden');
  }
};

function Profile() {
  const [userAddress, setUserAddress] = useState<string | null>(localStorage.getItem('address'));
  const [isKleoConnectReady, setIsKleoConnectReady] = useState(false);
  let isRequestInProgress = false;
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

  const GET_USER_PATH = `user/get-user/${userAddress}`;
  const UPLOAD_IMGUR_ENDPOINT = 'user/upload_activity_chart';
  const GET_USER_GRAPH = `user/get-user-graph/${userAddress || ''}`;
  // const GET_USER_GRAPH = `user/get-user-graph/${'0xC0cFAB5AFc7a951c510eA20DDD1eCCA31731e574'}`;

  // State for storing the user data
  const [userData, setUserData] = useState<any>(null);
  const { data, status, error, fetchData } = useFetch(GET_USER_PATH, {
    onSuccessfulFetch: (fetchedData) => {
      console.log('Fetched User Data:', fetchedData);
      setUserData(fetchedData);
    },
  });
  const { fetchData: fetchUserGraph, error: graphError } = useFetch<UserGraphResponse>();
  const [graphData, setGraphData] = useState<any>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [highestKleoPoints, setHighestKleoPoints] = useState(0);
  const { fetchData: uploadImageFetch } = useFetch<any>();

  // Define the ref with the type of an HTMLDivElement
  const milestonesRef = useRef<HTMLDivElement | null>(null);
  const [milestonesHeight, setMilestonesHeight] = useState<number>(0);

  // ------------ Start : Share Graph on Twitter ------------ //
  const createCanvasWithWhiteBackground = (canvas: CanvasSource): string => {
    const tempCanvas = document.createElement('canvas') as HTMLCanvasElement;
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');

    if (tempCtx) {
      tempCtx.fillStyle = 'white';
      tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
      tempCtx.drawImage(canvas, 0, 0);
    }

    return tempCanvas.toDataURL('image/png', 1).split(',')[1]; // Return base64 image data
  };

  const constructTweetText = (imageUrl: string): string => {
    const top3Activities = graphData
      .slice(0, 3)
      .map((activity: { label: any; }) => activity.label)
      .join(", ");
    return `Check out my Activity! My top 3 activities are ${top3Activities}. My current kleo points are ${userData.kleo_points || 0}.
Create your profile and get Kleo points! @kleo_network #KLEO ${imageUrl}`;
  };

  const handleShareGraphClick = async () => {
    // Check if a request is already being processed
    if (isRequestInProgress) {
      showToastError('Wait, we are processing your previous graph request...');
      return;
    }

    // Check if the user can upload (within the 1-hour window)
    if (!canUpload()) {
      showToastError('You can only upload a graph once per hour. Please try again later.');
      return;
    }

    // Set request as in progress
    isRequestInProgress = true;

    try {
      const canvas = document.getElementsByTagName('canvas')[0];
      const imageData = createCanvasWithWhiteBackground(canvas);

      const options = {
        method: 'POST' as Method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ image: imageData }),
        onSuccessfulFetch: (data: UploadResponse) => {
          if (data && data.url) {
            const imageUrlWithoutExtension = data.url?.replace('.png', '');

            const tweetText = constructTweetText(imageUrlWithoutExtension);

            const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;
            window.open(twitterUrl, '_blank');

            // Set the last upload time after a successful response
            setLastUploadTime();
          } else {
            console.error('Failed to upload image.');
            showToastError('Failed to upload the image. Please try again.');
          }
          isRequestInProgress = false;
        }
      };

      uploadImageFetch(UPLOAD_IMGUR_ENDPOINT, options);
    } catch (error) {
      console.error('Error uploading image:', error);
      showToastError('An error occurred while uploading graph. Please try again later.');
      isRequestInProgress = false;
    }
  };
  // ------------ End : Share Graph on Twitter ------------ //

  useEffect(() => {
    const updateHeight = () => {
      if (milestonesRef.current) {
        setMilestonesHeight(milestonesRef.current.clientHeight);
      }
    };

    updateHeight();
    // Add event listener for resizing in case window size changes
    window.addEventListener('resize', updateHeight);

    // Clean up the event listener on unmount
    return () => {
      window.removeEventListener('resize', updateHeight);
    };
  }, []);

  // Make API call when Address changes.
  useEffect(() => {
    if (!isLoading) {
      setIsLoading(true);
      fetchUserGraph(GET_USER_GRAPH, {
        onSuccessfulFetch(data) {
          if (data?.error) {
            setIsProcessing(true);
          } else if (data?.processing) {
            setIsProcessing(true);
          } else {
            setIsProcessing(false);
            if (graphData) {
              setGraphData(data?.data);
              console.log('Data : ', data);
            }
          }
          setIsLoading(false);
        },
      });
    }
  }, []);

  // Listening to error if any errors set all flags accordingly.
  useEffect(() => {
    if (graphError) {
      setIsProcessing(true);
      setIsLoading(false);
      setGraphData(null);
    }
  }, [graphError])

  return (
    <div className="bg-slate-100">
      <Navbar userAddress={userAddress || ''} page={PAGE_NAMES.PROFILE} />
      {/* Main Content */}
      <div className="container mx-auto p-6 gap-5 grid grid-cols-1 xl:grid-cols-1 mt-[80px] pt-10 scrollbar-thin">

        {/* Layout for >xl */}
        <div className="hidden xl:grid gap-5">
          {/* First Row: PointsAndDataCard (wide) | DataQuality (medium) | Milestones (narrow) */}
          <div className="grid grid-cols-[0.245fr_0.333fr_0.422fr] gap-5">
            <div>
              <PointsAndDataCard kleo_points={userData?.kleo_points || 0} data_quantity={userData?.total_data_quantity || 0} />
            </div>
            <div>
              <DataQuality address={userAddress || ''} isLoading={isLoading} isProcessing={isProcessing} graphData={graphData} userKleoPoints={userData?.kleo_points || 0} highestKleoPoints={highestKleoPoints || 0} />
            </div>
            <div>
              <Milestones mileStones={userData?.milestones || {}} handleShareGraph={handleShareGraphClick} isGraphAvailable={!isProcessing} />
            </div>
          </div>

          {/* Second Row: Snapshot & Referrals (stacked) | Leaderboard (full height) */}
          <div className="grid grid-cols-[2fr_1fr] gap-5">
            <div className="flex flex-col gap-5">
              <div className="flex-1 h-full">
                <Snapshot />
              </div>
              <div className="flex-1 h-full">
                <Referrals userAddress={userAddress || ''} />
              </div>
            </div>
            <Leaderboard userAddress={userAddress || ''} setHighestKleoPoints={setHighestKleoPoints} />
          </div>

          {/* Third Row: Privacy | LeaderBoardBanner */}
          <div className="grid grid-cols-[0.327fr_0.673fr] gap-5">
            <div>
              <Privacy pii_removed_count={userData?.pii_removed_count} />
            </div>
            <div>
              <LeaderBoardBanner />
            </div>
          </div>
        </div>

        {/* Layout for <xl */}
        <div className="xl:hidden grid gap-5">
          {/* First Row: PointsAndDataCard and DataQuality */}
          <div className="grid grid-cols-[0.412fr_0.588fr] gap-5">
            <div>
              <PointsAndDataCard kleo_points={userData?.kleo_points || 0} data_quantity={userData?.total_data_quantity || 0} />
            </div>
            <div>
              <DataQuality address={userAddress || ''} isLoading={isLoading} isProcessing={isProcessing} graphData={graphData} userKleoPoints={userData?.kleo_points || 0} highestKleoPoints={highestKleoPoints || 0} />
            </div>
          </div>

          {/* Second Row: Milestones and Leaderboard */}
          <div className="grid grid-cols-2 gap-5">
            {/* Milestones Column */}
            <div ref={milestonesRef} className="self-start">
              <Milestones mileStones={userData?.milestones || {}} handleShareGraph={handleShareGraphClick} isGraphAvailable={!isProcessing} />
            </div>

            {/* Leaderboard Column with Scroll */}
            <div
              className="overflow-y-auto"
              style={{ maxHeight: milestonesHeight }}
            >
              <Leaderboard userAddress={userAddress || ''} setHighestKleoPoints={setHighestKleoPoints} />
            </div>
          </div>

          {/* Third Row: Snapshot */}
          <div className="grid grid-cols-1">
            <Snapshot />
          </div>

          {/* Fourth Row: Referrals */}
          <div className="grid grid-cols-1">
            <Referrals userAddress={userAddress || ''} />
          </div>

          {/* Fifth Row: Privacy and LeaderBoardBanner */}
          <div className="grid grid-cols-[0.412fr_0.588fr] gap-5">
            <div>
              <Privacy pii_removed_count={userData?.pii_removed_count || 0} />
            </div>
            <div>
              <LeaderBoardBanner />
            </div>
          </div>
        </div>
      </div>

      {/* Toast Error Notification */}
      <div id="toast-error" className="fixed bottom-5 right-5 flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow dark:text-gray-400 dark:bg-gray-800 hidden" role="alert">
        <div className="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-red-500 bg-red-100 rounded-lg dark:bg-red-800 dark:text-red-200">
          <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 20 20">
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
          </svg>
          <span className="sr-only">Error icon</span>
        </div>
        <div id='error-text' className="ms-3 text-sm font-normal">Item has been deleted.</div>
        <button
          type="button"
          className="ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-800 dark:hover:bg-gray-700"
          data-dismiss-target="#toast-error"
          aria-label="Close"
          onClick={() => document.getElementById('toast-error')?.classList.add('hidden')}
        >
          <span className="sr-only">Close</span>
          <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default Profile;

