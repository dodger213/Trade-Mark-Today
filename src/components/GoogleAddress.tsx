import Autocomplete from "react-google-autocomplete";
const GOOGLE_API_KEY = 'AIzaSyCEUYa_jJGDsoq3hugOAL_3nzn0lolNGBk';
const GoogleAddress = ({ className, onPlaceChange }: { className?: string, onPlaceChange: (_: string) => void }) => {
    return (
        <>
            <Autocomplete
                apiKey={GOOGLE_API_KEY}
                placeholder="Address"
                // onChange={(e) => onPlaceChange(e.currentTarget.value)}
                className={`${className} `}
                onPlaceSelected={(place) => onPlaceChange(place)}
            />
        </>
    )
}
export default GoogleAddress;