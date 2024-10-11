"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  GoogleMap,
  useJsApiLoader,
  StandaloneSearchBox,
} from "@react-google-maps/api";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const US_STATES_AND_CITIES = {
  "Alabama": ["Birmingham", "Montgomery", "Huntsville", "Mobile"],
  "Alaska": ["Anchorage", "Fairbanks", "Juneau", "Sitka"],
  "Arizona": ["Phoenix", "Tucson", "Mesa", "Chandler"],
  "Arkansas": ["Little Rock", "Fort Smith", "Fayetteville", "Springdale"],
  "California": ["Los Angeles", "San Francisco", "San Diego", "San Jose"],
  "Colorado": ["Denver", "Colorado Springs", "Aurora", "Fort Collins"],
  "Connecticut": ["Bridgeport", "New Haven", "Hartford", "Stamford"],
  "Delaware": ["Wilmington", "Dover", "Newark", "Middletown"],
  "Florida": ["Miami", "Orlando", "Jacksonville", "Tampa"],
  "Georgia": ["Atlanta", "Augusta", "Columbus", "Savannah"],
  "Hawaii": ["Honolulu", "Hilo", "Kailua", "Kapolei"],
  "Idaho": ["Boise", "Meridian", "Nampa", "Idaho Falls"],
  "Illinois": ["Chicago", "Aurora", "Naperville", "Joliet"],
  "Indiana": ["Indianapolis", "Fort Wayne", "Evansville", "South Bend"],
  "Iowa": ["Des Moines", "Cedar Rapids", "Davenport", "Sioux City"],
  "Kansas": ["Wichita", "Overland Park", "Kansas City", "Topeka"],
  "Kentucky": ["Louisville", "Lexington", "Bowling Green", "Owensboro"],
  "Louisiana": ["New Orleans", "Baton Rouge", "Shreveport", "Lafayette"],
  "Maine": ["Portland", "Lewiston", "Bangor", "South Portland"],
  "Maryland": ["Baltimore", "Frederick", "Rockville", "Gaithersburg"],
  "Massachusetts": ["Boston", "Worcester", "Springfield", "Cambridge"],
  "Michigan": ["Detroit", "Grand Rapids", "Warren", "Sterling Heights"],
  "Minnesota": ["Minneapolis", "St. Paul", "Rochester", "Duluth"],
  "Mississippi": ["Jackson", "Gulfport", "Southaven", "Hattiesburg"],
  "Missouri": ["Kansas City", "St. Louis", "Springfield", "Columbia"],
  "Montana": ["Billings", "Missoula", "Great Falls", "Bozeman"],
  "Nebraska": ["Omaha", "Lincoln", "Bellevue", "Grand Island"],
  "Nevada": ["Las Vegas", "Henderson", "Reno", "North Las Vegas"],
  "New Hampshire": ["Manchester", "Nashua", "Concord", "Derry"],
  "New Jersey": ["Newark", "Jersey City", "Paterson", "Elizabeth"],
  "New Mexico": ["Albuquerque", "Las Cruces", "Rio Rancho", "Santa Fe"],
  "New York": ["New York City", "Buffalo", "Rochester", "Yonkers"],
  "North Carolina": ["Charlotte", "Raleigh", "Greensboro", "Durham"],
  "North Dakota": ["Fargo", "Bismarck", "Grand Forks", "Minot"],
  "Ohio": ["Columbus", "Cleveland", "Cincinnati", "Toledo"],
  "Oklahoma": ["Oklahoma City", "Tulsa", "Norman", "Broken Arrow"],
  "Oregon": ["Portland", "Salem", "Eugene", "Gresham"],
  "Pennsylvania": ["Philadelphia", "Pittsburgh", "Allentown", "Erie"],
  "Rhode Island": ["Providence", "Warwick", "Cranston", "Pawtucket"],
  "South Carolina": ["Charleston", "Columbia", "North Charleston", "Mount Pleasant"],
  "South Dakota": ["Sioux Falls", "Rapid City", "Aberdeen", "Brookings"],
  "Tennessee": ["Nashville", "Memphis", "Knoxville", "Chattanooga"],
  "Texas": ["Houston", "San Antonio", "Dallas", "Austin"],
  "Utah": ["Salt Lake City", "West Valley City", "Provo", "West Jordan"],
  "Vermont": ["Burlington", "South Burlington", "Rutland", "Barre"],
  "Virginia": ["Virginia Beach", "Norfolk", "Chesapeake", "Richmond"],
  "Washington": ["Seattle", "Spokane", "Tacoma", "Vancouver"],
  "West Virginia": ["Charleston", "Huntington", "Morgantown", "Parkersburg"],
  "Wisconsin": ["Milwaukee", "Madison", "Green Bay", "Kenosha"],
  "Wyoming": ["Cheyenne", "Casper", "Laramie", "Gillette"]
};

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [company_name, setCompany_name] = useState("");
  const [address, setAddress] = useState("");
  const [country, setCountry] = useState("United States");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [zip_code, setZip_code] = useState("");
  const [role, setRole] = useState("client");
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [states, setStates] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);

  const router = useRouter();

  const inputRef = useRef(null);

  const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "";

  const { isLoaded } = useJsApiLoader({
    id: "google-map-script",
    googleMapsApiKey: googleMapsApiKey,
    libraries: ["places"],
  });

  // console.log("isLoaded: ", isLoaded);
  // console.log("API KEY: ", googleMapsApiKey);

  useEffect(() => {
    setStates(Object.keys(US_STATES_AND_CITIES));
  }, []);

  useEffect(() => {
    if (state) {
      setCities(US_STATES_AND_CITIES[state as keyof typeof US_STATES_AND_CITIES] || []);
    } else {
      setCities([]);
    }
  }, [state]);

  const validateForm = () => {
    const newErrors: Record<string, boolean> = {};
    if (!email) newErrors.email = true;
    if (!password) newErrors.password = true;
    if (!username) newErrors.username = true;
    if (!firstName) newErrors.firstName = true;
    if (!lastName) newErrors.lastName = true;
    if (!phone) newErrors.phone = true;
    if (!company_name) newErrors.company_name = true;
    if (!address) newErrors.address = true;
    if (!state) newErrors.state = true;
    if (!city) newErrors.city = true;
    if (!zip_code) newErrors.zip_code = true;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateForm()) {
      const queryParams = new URLSearchParams({
        email,
        password,
        username,
        firstName,
        lastName,
        phone,
        company_name,
        address,
        country,
        state,
        city,
        zip_code,
        role,
      }).toString();

      router.push(`/register-a?${queryParams}`);
    }
  };

  const searchBoxRef = useRef<google.maps.places.SearchBox | null>(null);

  const onLoad = (ref: google.maps.places.SearchBox) => {
    searchBoxRef.current = ref;
  };

  const onPlacesChanged = () => {
    if (searchBoxRef.current) {
      const places = searchBoxRef.current.getPlaces();
      if (places && places.length > 0) {
        const place = places[0];
        const fullAddress = place.formatted_address || "";
        setAddress(fullAddress);

        // Extract and set zip code
        const zipCodeComponent = place.address_components?.find(
          (component) => component.types.includes("postal_code")
        );
        if (zipCodeComponent) {
          setZip_code(zipCodeComponent.long_name);
        } else {
          setZip_code(""); // Clear zip code if not found
        }

        // Extract and set state
        const stateComponent = place.address_components?.find(
          (component) => component.types.includes("administrative_area_level_1")
        );
        if (stateComponent) {
          setState(stateComponent.long_name);
        }

        // Extract and set city
        const cityComponent = place.address_components?.find(
          (component) => component.types.includes("locality")
        );
        if (cityComponent) {
          setCity(cityComponent.long_name);
        }
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader className="items-center">
          <CardTitle className="text-xl">Register as User</CardTitle>
          <CardDescription>
            Enter your information to create user account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  placeholder="johndoe@gmail.com"
                  type="email"
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={errors.email ? "border-red-500" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  placeholder="John Doe"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  className={errors.username ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstname">First Name</Label>
                <Input
                  id="firstname"
                  placeholder="John"
                  required
                  onChange={(e) => setFirstName(e.target.value)}
                  className={errors.firstName ? "border-red-500" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="lastname">Last Name</Label>
                <Input
                  id="lastname"
                  placeholder="Doe"
                  required
                  onChange={(e) => setLastName(e.target.value)}
                  className={errors.lastName ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  type="password"
                  className={errors.password ? "border-red-500" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  placeholder="••••••••"
                  required
                  type="password"
                  className={errors.password ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="03482051674"
                  required
                  className={errors.phone ? "border-red-500" : ""}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  onChange={(e) => setCompany_name(e.target.value)}
                  placeholder="XYZ Limited"
                  required
                  className={errors.company_name ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="address">Address</Label>
                {isLoaded && (
                  <StandaloneSearchBox
                    onLoad={onLoad}
                    onPlacesChanged={onPlacesChanged}
                  >
                    <Input
                      type="text"
                      placeholder="Start typing your address"
                      className={errors.address ? "border-red-500" : ""}
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </StandaloneSearchBox>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="zip">Zip Code</Label>
                <Input
                  id="zip"
                  type="text"
                  value={zip_code}
                  onChange={(e) => setZip_code(e.target.value)}
                  placeholder="42809"
                  required
                  className={errors.zip_code ? "border-red-500" : ""}
                />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="state">State</Label>
                <Select onValueChange={setState} value={state}>
                  <SelectTrigger className={errors.state ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select state" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="city">City</Label>
                <Select onValueChange={setCity} value={city}>
                  <SelectTrigger className={errors.city ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select city" />
                  </SelectTrigger>
                  <SelectContent>
                    {cities.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  disabled
                  value={country}
                  placeholder="United States"
                  required
                />
              </div>
            </div>
            <Button
              onClick={handleNext}
              type="button"
              variant="default"
              className="w-full"
            >
              Next
            </Button>
          </div>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}