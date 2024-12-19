import { setUserToken } from "@/utils/setUserToken";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FiArrowLeft } from "react-icons/fi";
import Cookies from "universal-cookie";

export async function getServerSideProps(context) {
    const cookies = new Cookies(context.req.headers.cookie);
    const userId = cookies.get("user_token");
    if (!userId) {
        return {
            props: { userIdCookie: null },
        };
    }
    return {
        props: { userIdCookie: userId },
    };
}

export default function Signup({ userIdCookie }) {
    const cookies = new Cookies(); // Initialize Cookies here
    const [step, setStep] = useState(1);
    const [message, setMessage] = useState({ errorMsg: "", successMsg: "" });

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [contactNumber, setContactNumber] = useState("");
    const [regNumber, setRegNumber] = useState("");
    const [username, setUsername] = useState("");

    const [preferences, setPreferences] = useState({
        categories: [],
        locations: [],
        ageRange: '',
        interests: [],
        activityLevel: ''
    });
    const [searchText, setSearchText] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState('');
    const router = useRouter();

    useEffect(() => {
        if (userIdCookie) {
            setStep(4);
            setMessage({
                errorMsg: "",
                successMsg: "Redirecting you ...",
            });
            setTimeout(() => {
                router.push("/users/dashboard");
            }, 800);
        }
    }, [userIdCookie]);

    useEffect(() => {
        if (searchText) {
            const allLocations = ['Chennai', 'Bangalore', 'Sathyamangalam', 'Coimbatore', 'Madurai', 'Erode', 'Delhi', 'Mumbai', 'Kerala', 'Hyderabad','Karnataaka', 'Tamil Nadu', 'Andhra Pradesh', 'Telangana', 'Kolkata', 'Pune', 'Jaipur', 'Lucknow', 'Ahmedabad', 'Surat', 'Vadodara', 'Nagpur', 'Nashik', 'Aurangabad', 'Goa', 'Bhopal', 'Indore', 'Ujjain', 'Jabalpur', 'Gwalior', 'Sagar', 'Ratlam', 'Dewas', 'Satna', 'Rewa', 'Chhindwara', 'Shivpuri', 'Vidisha', 'Damoh', 'Mandsaur', 'Khargone', 'Neemuch', 'Pithampur', 'Hoshangabad', 'Itarsi', 'Sehore', 'Betul', 'Seoni', 'Datia', 'Nagda', 'Harda', 'Ashoknagar', 'Singrauli', 'Burhanpur', 'Khandwa', 'Morena', 'Balaghat', 'Bhind', 'Shajapur', 'Sheopur', 'Barwani', 'Narsinghpur', 'Dhar', 'Mandla', 'Chhatarpur', 'Damoh', 'Raisen', 'Rajgarh', 'Anuppur', 'Alirajpur', 'Jhabua', 'Sidhi', 'Umaria', 'Agar Malwa', 'Singrauli', 'Niwari', 'Maihar', 'Bamori', 'Birsinghpur', 'Bhander', 'Bhitarwar', 'Biaora', 'Bijawar', 'Boda', 'Budhni', 'Burhanpur', 'Chanderi', 'Chaurai Khas', 'Chhatarpur', 'Chhindwara', 'Chhota Udaipur', 'Daboh', 'Dabra', 'Damoh', 'Datia', 'Deori Khas', 'Depalpur', 'Dewas', 'Dhamnod', 'Dhar', 'Dharampuri', 'Dindori', 'Gadarwara', 'Gandai', 'Garhakota', 'Garhi Malhara', 'Garoth', 'Gautampura', 'Ghansor', 'Ghat','Sivaganga','Tirunelveli','Tiruppur','Vellore','Virudhunagar','Ariyalur','Karur','Nagapattinam','Perambalur','Pudukkottai','Thanjavur','Tiruchirappalli','Tiruvarur','Dharmapuri','Coimbatore','Erode','Krishnagiri','Namakkal','The Nilgiris','Salem','Tiruppur','Dindigul','Kanyakumari','Madurai','Ramanathapuram','Sivaganga','Theni','Thoothukudi','Tirunelveli','Virudhunagar','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur','Theni','Thoothukudi','Tiruchirappalli','Tirunelveli','Tiruppur','Tiruvallur','Tiruvannamalai','Tiruvarur','Vellore','Viluppuram','Virudhunagar','Ariyalur','Chennai','Coimbatore','Cuddalore','Dharmapuri','Dindigul','Erode','Kanchipuram','Kanyakumari','Karur','Krishnagiri','Madurai','Nagapattinam','Namakkal','Perambalur','Pudukkottai','Ramanathapuram','Salem','Sivaganga','Thanjavur'];
            const filteredSuggestions = allLocations.filter(location =>
                location.toLowerCase().includes(searchText.toLowerCase())
            );
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [searchText]);

    const handleCategoryChange = (e) => {
        const updatedCategories = e.target.checked
            ? [...preferences.categories, e.target.value]
            : preferences.categories.filter(cat => cat !== e.target.value);
        setPreferences({ ...preferences, categories: updatedCategories });
    };

    const handleInterestChange = (e) => {
        const updatedInterests = e.target.checked
            ? [...preferences.interests, e.target.value]
            : preferences.interests.filter(int => int !== e.target.value);
        setPreferences({ ...preferences, interests: updatedInterests });
    };

    const handleLocationAdd = (location) => {
        if (!preferences.locations.includes(location)) {
            setPreferences({ ...preferences, locations: [...preferences.locations, location] });
        }
        setSearchText('');
        setSuggestions([]);
    };

    const handleLocationRemove = (location) => {
        const updatedLocations = preferences.locations.filter(loc => loc !== location);
        setPreferences({ ...preferences, locations: updatedLocations });
    };

    const handleVerifyEmail = async (event) => {
        event.preventDefault();
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/signup`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            setMessage({ errorMsg: "", successMsg: data.msg });
            setStep(2);
        } else {
            setMessage({ errorMsg: data.msg, successMsg: "" });
            setTimeout(() => {
                router.push("/users/signin");
            }, 2500);
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const regExp = /.*/;
        if (regExp.test(regNumber)) {
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_URL}/user/signup/verify`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        contactNumber,
                        otp,
                        email,
                        regNumber: regNumber.toUpperCase(),
                        username,
                    }),
                }
            );
            const data = await response.json();
            if (response.status === 200) {
                setMessage({ errorMsg: "", successMsg: data.msg });
                setUserToken(data.user_id);
                setStep(3);
            } else {
                setMessage({ errorMsg: data.msg, successMsg: "" });
            }
        } else {
            setMessage({ errorMsg: "Registration Number is not valid", successMsg: "" });
        }
    };

    const handlePreferencesSubmit = async (event) => {
        event.preventDefault();
        const userToken = cookies.get("user_token"); // Get user token from cookies
    
        if (!userToken) {
            setMessage({ errorMsg: "User token is missing", successMsg: "" });
            return;
        }
    
        const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/user/updatePreferences`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    user_token: userToken, // Include user token
                    preferences: preferences
                }),
            }
        );
        const data = await response.json();
        if (response.status === 200) {
            setMessage({ errorMsg: "", successMsg: "Preferences saved successfully!" });
            router.push("/users/dashboard");
        } else {
            setMessage({ errorMsg: data.msg, successMsg: "" });
        }
    };
    

    const handleDropdownToggle = () => {
        setCategoryDropdownOpen(!categoryDropdownOpen);
    };

    const handleCategorySelect = (category) => {
        if (!preferences.categories.includes(category)) {
            setPreferences({ ...preferences, categories: [...preferences.categories, category] });
        }
        setSelectedCategory('');
        setCategoryDropdownOpen(false);
    };

    const handleCategoryRemove = (category) => {
        const updatedCategories = preferences.categories.filter(cat => cat !== category);
        setPreferences({ ...preferences, categories: updatedCategories });
    };

    return (
        <div className="m-2">
            <FiArrowLeft
                onClick={() => router.push("/")}
                size={24}
                className="cursor-pointer"
            />
            <div className="text-center text-3xl font-bold">Signup Page</div>

            <div className="max-w-3xl mx-auto mt-10">
                <div className="flex items-center justify-center">
                    {/* Steps Nav */}
                    <div className={`w-full h-24 lg:h-fit ${step === 1 ? `font-medium` : ``}`}>
                        <div className={`h-full border-2 rounded-l-lg px-5 py-2 ${step >= 1 ? `text-white bg-[color:var(--darker-secondary-color)] border-r-white border-[color:var(--darker-secondary-color)]` : `border-[color:var(--darker-secondary-color)] opacity-10 border-dashed`}`}>
                            <div>01</div>
                            Verify Email
                        </div>
                    </div>
                    <div className={`w-full h-24 lg:h-fit ${step === 2 ? `font-medium` : ``}`}>
                        <div className={`h-full border-2 border-l-0 px-5 py-2 ${step >= 2 ? `text-white bg-[color:var(--darker-secondary-color)] border-r-white border-[color:var(--darker-secondary-color)]` : `border-[color:var(--darker-secondary-color)] border-dashed`}`}>
                            <div>02</div>
                            Complete Signup
                        </div>
                    </div>
                    <div className={`w-full h-24 lg:h-fit ${step === 3 ? `font-medium` : ``}`}>
                        <div className={`h-full border-2 border-l-0 rounded-r-lg px-5 py-2 ${step >= 3 ? `text-white bg-[color:var(--darker-secondary-color)] border-[color:var(--darker-secondary-color)]` : `border-[color:var(--darker-secondary-color)] border-dashed`}`}>
                            <div>03</div>
                            Preferences
                        </div>
                    </div>
                    <div className={`w-full h-24 lg:h-fit ${step === 4 ? `font-medium` : ``}`}>
                        <div className={`h-full border-2 border-l-0 rounded-r-lg px-5 py-2 ${step >= 4 ? `text-white bg-[color:var(--darker-secondary-color)] border-[color:var(--darker-secondary-color)]` : `border-[color:var(--darker-secondary-color)] border-dashed`}`}>
                            <div>04</div>
                            Go to Dashboard!
                        </div>
                    </div>
                </div>

                {message.errorMsg && (
                    <h1 className="rounded p-3 my-2 bg-red-200 text-red-500 text-center">
                        {message.errorMsg}
                    </h1>
                )}
                {message.successMsg && (
                    <h1 className="rounded p-3 my-2 bg-green-200 text-green-500 text-center">
                        {message.successMsg}
                    </h1>
                )}

                <div className="bg-white p-5 rounded-lg mt-2">
                    {
                        /* Step 1 Content */
                        step === 1 && (
                            <form onSubmit={handleVerifyEmail}>
                                <label className="block mb-2 text-sm font-medium text-gray-700">
                                    Enter your email address
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={email}
                                    className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-full"
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                                <button
                                    type="submit"
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                                >
                                    Verify
                                </button>
                            </form>
                        )
                    }

                    {
                        /* Step 2 Content */
                        step === 2 && (
                            <form onSubmit={handleSubmit}>
                                {/* EMAIL */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Your email address
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        name="email"
                                        defaultValue={email}
                                        disabled
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                    // onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                {/* OTP */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Enter Verification Code
                                    </label>
                                    <input
                                        type="number"
                                        id="otp"
                                        name="otp"
                                        autoComplete="none"
                                        required
                                        value={otp}
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={(e) => setOtp(e.target.value)}
                                    />
                                </div>

                                {/* USERNAME */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Full Name
                                    </label>
                                    <input
                                        type="text"
                                        id="username"
                                        name="username"
                                        value={username}
                                        autoComplete="none"
                                        required
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={(e) =>
                                            setUsername(e.target.value)
                                        }
                                    />
                                </div>

                                {/* REG-NUMBER */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Enter BIT Registration Number
                                    </label>
                                    <input
                                        type="text"
                                        id="regNumber"
                                        name="regNumber"
                                        value={regNumber}
                                        autoComplete="none"
                                        required
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={(e) =>
                                            setRegNumber(e.target.value)
                                        }
                                        placeholder="If not BIT student, Enter NIL"
                                    />
                                </div>

                                {/* CONTACT-NUMBER */}
                                <div>
                                    <label className="block mb-2 text-sm font-medium text-gray-700">
                                        Enter Contact Number
                                    </label>
                                    <input
                                        type="number"
                                        id="contactNumber"
                                        name="contactNumber"
                                        value={contactNumber}
                                        autoComplete="none"
                                        required
                                        className="bg-gray-100 p-2 mx-2 mb-4 focus:outline-none rounded-lg w-10/12"
                                        onChange={(e) =>
                                            setContactNumber(e.target.value)
                                        }
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                                >
                                    Complete Signup
                                </button>
                            </form>
                        )
                    }

                    {step === 3 && (
                        <div className="flex flex-col items-center mt-5 p-4 rounded-lg ">
                            <h2 className="text-2xl font-semibold mb-6">Set Your Preferences</h2>

                            {/* Categories Dropdown */}
                            <div className="relative w-full max-w-md">
                            <label className="block text-gray-700 mb-2 font-medium">Category:</label>
                                <button
                                    onClick={handleDropdownToggle}
                                    className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md shadow-sm hover:bg-gray-300 transition"
                                    aria-expanded={categoryDropdownOpen}
                                    aria-controls="category-dropdown"
                                >
                                    {selectedCategory || 'Select a category...'}
                                </button>
                                {categoryDropdownOpen && (
                                    <div
                                        id="category-dropdown"
                                        className="absolute z-20 bg-white border border-gray-300 mt-2 rounded-md shadow-lg w-full"
                                    >
                                        {['Technical', 'Comic', 'Personalized', 'Entertainment', 'Educational', 'Workshop', 'Music', 'Others'].map((category, index) => (
                                            <button
                                                key={index}
                                                onClick={() => handleCategorySelect(category)}
                                                className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left transition"
                                            >
                                                {category}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Display Selected Categories */}
                            <div className="mt-6 w-full max-w-md">
                                {preferences.categories.length > 0 && (
                                    <div className="flex flex-wrap gap-2">
                                        {preferences.categories.map((category, index) => (
                                            <div
                                                key={index}
                                                className="bg-blue-100 text-blue-700 px-3 py-1 rounded-md flex items-center"
                                            >
                                                {category}
                                                <button
                                                    type="button"
                                                    onClick={() => handleCategoryRemove(category)}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Other Preferences */}
                            <div className="mt-6 w-full max-w-md">
                                {/* Interests */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium">Interests:</label>
                                    <div className="flex flex-wrap gap-4">
                                        {['Coding', 'Reading', 'Traveling', 'Music', 'Sports'].map((interest) => (
                                            <label key={interest} className="flex items-center">
                                                <input
                                                    type="checkbox"
                                                    value={interest}
                                                    onChange={handleInterestChange}
                                                    checked={preferences.interests.includes(interest)}
                                                    className="mr-2"
                                                />
                                                {interest}
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Age Range */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium">Age Range:</label>
                                    <select
                                        value={preferences.ageRange}
                                        onChange={(e) => setPreferences({ ...preferences, ageRange: e.target.value })}
                                        className="p-2 border border-gray-300 rounded-md w-full"
                                    >
                                        <option value="">Select Age Range</option>
                                        {['18-25', '26-35', '36-45', '46-60', '60+'].map((range) => (
                                            <option key={range} value={range}>{range}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Activity Level */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium">Activity Level:</label>
                                    <select
                                        value={preferences.activityLevel}
                                        onChange={(e) => setPreferences({ ...preferences, activityLevel: e.target.value })}
                                        className="p-2 border border-gray-300 rounded-md w-full"
                                    >
                                        <option value="">Select Activity Level</option>
                                        {['Sedentary', 'Lightly active', 'Moderately active', 'Very active', 'Extra active'].map((level) => (
                                            <option key={level} value={level}>{level}</option>
                                        ))}
                                    </select>
                                </div>

                                {/* Locations */}
                                <div className="mb-6">
                                    <label className="block text-gray-700 mb-2 font-medium">Locations:</label>
                                    <input
                                        type="text"
                                        value={searchText}
                                        onChange={(e) => setSearchText(e.target.value)}
                                        placeholder="Search for locations"
                                        className="p-2 border border-gray-300 rounded-md w-full"
                                    />
                                    {suggestions.length > 0 && (
                                        <div className="absolute z-20 bg-white border border-gray-300 mt-1 rounded-md shadow-lg w-auto">
                                            {suggestions.map((location, index) => (
                                                <div
                                                    key={index}
                                                    onClick={() => handleLocationAdd(location)}
                                                    className="px-4 py-2 text-gray-800 hover:bg-gray-100 cursor-pointer transition"
                                                >
                                                    {location}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    <div className="mt-2">
                                        {preferences.locations.map((location, index) => (
                                            <div key={index} className="flex items-center mb-2">
                                                <span className="bg-gray-200 text-gray-700 px-3 py-1 rounded-md">{location}</span>
                                                <button
                                                    type="button"
                                                    onClick={() => handleLocationRemove(location)}
                                                    className="ml-2 text-red-500 hover:text-red-700 transition"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button
                                    onClick={handlePreferencesSubmit}
                                    className="mt-4 bg-[color:var(--darker-secondary-color)] text-white py-2 px-4 rounded hover:bg-[color:var(--secondary-color)]"
                                >
                                    Save Preferences
                                </button>
                            </div>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
}
