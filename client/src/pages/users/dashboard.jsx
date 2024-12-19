import Dashboard_Filter from "@/components/Dashboard_Filter";
import Popup_Filter from "@/components/Popup_Filter";
import UserNavBar from "@/components/UserNavBar";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiOutlinePlus } from "react-icons/ai";
import { FaUsers } from "react-icons/fa";
import { RxHamburgerMenu } from "react-icons/rx";
import Cookies from "universal-cookie";

function UserDashboard() {
    const router = useRouter();
    const picRatio = 0.606;

    const [allEvents, setAllEvents] = useState([]);
    const [popupFilterOpen, setPopupFilterOpen] = useState(false);
    const [filterOptions, setFilterOptions] = useState({
        keyword: "",
        category: "",
        dateRange: "",
        price: [0, 3000],
    });
    const cookies = new Cookies();

    const fetchAllEvents = async () => {
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/getallevents`
        );
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        try {
            const data = await response.json();
            setAllEvents(data);
        } catch (error) {
            console.error("Invalid JSON string:", error.message);
        }
    };

    const fetchRecommendedEvents = async () => {
        const token = cookies.get("user_token");
        console.log("Token:", token);
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/recommendations`, 
            {
                method: 'POST', // Change this to POST if your backend expects POST requests
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`, // Include the token here
                },
                body: JSON.stringify({ user_token: token }) // Send the user token if required by the backend
            }
        );
    
        if (!response.ok) {
            throw new Error(`${response.status} ${response.statusText}`);
        }
        
        try {
            const data = await response.json();
            console.log("Recommended events:", data);
            setRecommendedEvents(data);
        } catch (error) {
            console.error("Invalid JSON string:", error.message);
        }
    };
    
    

    useEffect(() => {
        fetchAllEvents();
        fetchRecommendedEvents();
    }, []);

    // dont move this state becoz it needs allevents
    const [filteredEvents, setFilteredEvents] = useState(allEvents);
    const [recommendedEvents, setRecommendedEvents] = useState([]);


    // Update filteredEvents state whenever allEvents or filterOptions change
    useEffect(() => {
        // console.log("All events length:", allEvents.length);
        const newFilteredEvents = allEvents.filter((event) => {
            // Check if keyword filter matches
            if (
                filterOptions.keyword.toLowerCase() &&
                !event.name
                    .toLowerCase()
                    .includes(filterOptions.keyword.toLowerCase())
            ) {
                return false;
            }
            if (!event.category) {
                return false; // Skip events without a category
            }

            // Normalize both the event's category and the filter's category to ensure case insensitivity
            const normalizedEventCategory = event.category.toLowerCase();
            const normalizedFilterCategory = filterOptions.category.toLowerCase();

            // If a category is selected in the filter
            if (filterOptions.category) {
                // Only include events that have a category matching the selected category (case-insensitive)
                return normalizedEventCategory === normalizedFilterCategory;
            }

            // Check if date range filter matches
            if (filterOptions.dateRange) {
                const date = filterOptions.dateRange;
                // Split the date string into an array of substrings
                const dateParts = event.date.split("/");
                // Rearrange the array elements to get yyyy-mm-dd format
                const formattedDate = `${dateParts[2]}-${dateParts[1]}-${dateParts[0]}`;
                if (formattedDate < date) {
                    return false;
                }
            }

            // Check if price filter matches
            if (
                event.price < filterOptions.price[0] ||
                event.price > filterOptions.price[1]
            ) {
                return false;
            }

            return true;
        });

        setFilteredEvents(newFilteredEvents);
    }, [allEvents, filterOptions]);

    const handleFilterClear = () => {
        setFilterOptions({
            keyword: "",
            category: "",
            dateRange: "",
            price: [0, 3000],
        });
        setFilteredEvents(allEvents);
        setPopupFilterOpen(false);
    };

    return (
        <div className="pt-20 lg:pt-8 overflow-y-hidden bg-[color:var(--primary-color)]">
            <UserNavBar />
            <div className="flex m-auto">
                <div className="flex mx-auto container ">
                    <div className="flex m-auto overflow-y-hidden gap-4 lg:gap-8 w-full h-[calc(88vh)]">
                        {/* Render the regular filter for medium screens and above */}
                        <div className="hidden md:flex flex-col p-4 sticky top-0 w-1/6 md:w-1/4">
                            <Dashboard_Filter
                                filterOptions={filterOptions}
                                setFilterOptions={setFilterOptions}
                                handleFilterClear={handleFilterClear}
                            />
                        </div>
                        {/* Render the popup filter for small screens */}
                        {popupFilterOpen && (
                            <div className="md:hidden fixed inset-0 z-10 bg-black bg-opacity-50 flex items-center justify-center">
                                <div className="bg-white rounded-lg p-4 w-5/6">
                                    <Popup_Filter
                                        filterOptions={filterOptions}
                                        setFilterOptions={setFilterOptions}
                                        handleFilterClear={handleFilterClear}
                                        handleClose={() =>
                                            setPopupFilterOpen(false)
                                        }
                                    />
                                </div>
                            </div>
                        )}
                        {/* Render the main content of the dashboard */}
                        <div className="flex w-full md:w-3/4 mx-auto justify-between container">
                        <div className="p-4 overflow-y-auto w-full h-[calc(80vh)]">
    {/* Recommended Events Carousel */}
    <h2 className="text-lg font-medium mb-4">Recommended Events</h2>
    <div className="overflow-x-auto whitespace-nowrap">
        {recommendedEvents.length > 0 ? (
            recommendedEvents.map((event) => (
                <div
                    key={event._id}
                    className="inline-block mr-4"
                    onClick={() => {
                        router.push(`/event/${event.event_id}`);
                    }}
                >
                    <div className="hover:scale-105 cursor-pointer transition-all bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3">
                        <div className="relative h-[15rem] w-[15rem]">
                            {event.profile && (
                                <Image
                                    fill
                                    className="object-cover h-full w-full rounded-md"
                                    src={event.profile}
                                    alt=""
                                    sizes="(min-width: 640px) 100vw, 50vw"
                                    priority
                                />
                            )}
                        </div>
                        <div className="px-2 mt-2">
                            <p className="text-sm text-gray-800 font-bold">
                                {event.name.length > 15
                                    ? event.name.slice(0, 15) + "..."
                                    : event.name}
                            </p>
                            <p className="text-sm text-gray-800">{event.venue}</p>
                            <p className="text-sm text-gray-800">{event.date}</p>
                        </div>
                    </div>
                </div>
            ))
        ) : (
            <p>No recommended events available.</p>
        )}
    </div>

    <br />
    <h2 className="text-lg font-medium mb-4">All Events</h2>
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredEvents.length === 0 ? (
            <p>No events yet</p>
        ) : (
            filteredEvents.map((event) => (
                <div
                    onClick={() => {
                        router.push(`/event/${event.event_id}`);
                    }}
                    className="hover:scale-105 cursor-pointer transition-all mt-5 bg-[color:var(--white-color)] rounded-lg shadow-md px-3 py-3"
                    key={event._id}
                >
                    <div className="relative h-[25rem]">
                        {event.profile && (
                            <Image
                                fill
                                className="object-cover h-full w-full rounded-md"
                                src={event.profile}
                                alt=""
                                sizes="(min-width: 640px) 100vw, 50vw"
                                priority
                            />
                        )}
                    </div>
                    <div className="flex flex-row justify-between items-start mt-4">
                        <div className="px-2">
                            <p className="text-sm text-gray-800 font-bold">
                                {event.name.length > 30
                                    ? event.name.slice(0, 30) + "..."
                                    : event.name}
                            </p>
                            <p className="text-sm text-gray-800">{event.venue}</p>
                            <p className="text-sm text-gray-800">{event.date}</p>
                        </div>
                        <div className="flex flex-col justify-end items-center">
                            <span className="w-full flex flex-row items-center">
                                <FaUsers />
                                <span className="ml-2 text-sm">{event.participants.length}</span>
                            </span>
                            <p className="text-sm text-gray-800 mt-2">
                                <strong className="whitespace-nowrap">₹ {event.price}</strong>
                            </p>
                        </div>
                    </div>
                </div>
            ))
        )}
    </div>
</div>

                        </div>
                    </div>
                </div>
            </div>
            {/* Show the filter icon for small screens */}
            <div
                className="md:hidden fixed bottom-5 right-5 z-10 bg-[color:var(--primary-color)] text-white p-4 rounded-full shadow-lg cursor-pointer"
                onClick={() => setPopupFilterOpen(true)}
            >
                <RxHamburgerMenu className="text-xl" />
            </div>
        </div>
    );
}

export default UserDashboard;
