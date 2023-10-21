import { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./CreateSpot.css";
import { newSpotThunk } from "../../spots";
import { addSpotImageThunk } from "../../images";

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [country, setCountry] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [description, setDescription] = useState("");
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [previewImage, setPreviewImage] = useState("");
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [submitted, setSubmitted] = useState(false);
  //   const [button, setButton] = useState(true);

  const [validationErrors, setValidationErrors] = useState({});
  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const newSpot = {
      address,
      city,
      state,
      country,
      lat,
      lng,
      name,
      description,
      price,
    };

    const images = [{ url: previewImage, preview: true }];
    if (image1) images.push({ url: image1, preview: false });
    if (image2) images.push({ url: image2, preview: false });
    if (image3) images.push({ url: image3, preview: false });
    if (image4) images.push({ url: image4, preview: false });

    if (!Object.keys(validationErrors).length) {
      const response = await dispatch(newSpotThunk(newSpot));
      if (response.errors && Object.values(response.errors).length) {
        setValidationErrors(response.errors);
      } else {
        const spotId = response.id;
        dispatch(addSpotImageThunk(images, spotId));

        setValidationErrors({});
        setAddress("");
        setCity("");
        setState("");
        setCountry("");
        setLat("");
        setLng("");
        setName("");
        setDescription("");
        setPrice("");
        setSubmitted(false);
        setPreviewImage("");
        setImage1("");
        setImage2("");
        setImage3("");
        setImage4("");
        history.push(`/spots/${spotId}`);
        // setButton(true);
      }
    }
  };

  useEffect(() => {
    const errors = {};
    const imageTypes = ["png", "jpg", "jpeg"];
    if (!country) errors.country = "Country is required";
    if (!address) errors.address = "Address is required";
    if (!city) errors.city = "City is required";
    if (!state) errors.state = "State is required";
    if (!lat) errors.lat = "Latitude is required";
    if (!lng) errors.lng = "Longitude is required";
    if (description.length < 30)
      errors.description = "Description needs 30 or more characters";
    if (!description) errors.description = "Description is required";
    if (!name) errors.name = "Name is required";
    if (!price) errors.price = "Price is required";
    if (!imageTypes.includes(previewImage.split(".").at(-1)))
      errors.previewImage = "Image URL needs to end in pgn or jpg (or jpeg)";
    if (!previewImage) errors.previewImage = "Preview image is required";
    if (image1 && !imageTypes.includes(image1.split(".").at(-1)))
      errors.image1 = "Image URL needs to end in pgn or jpg (or jpeg)";
    if (image2 && !imageTypes.includes(image2.split(".").at(-1)))
      errors.image2 = "Image URL needs to end in pgn or jpg (or jpeg)";
    if (image3 && !imageTypes.includes(image3.split(".").at(-1)))
      errors.image3 = "Image URL needs to end in pgn or jpg (or jpeg)";
    if (image4 && !imageTypes.includes(image4.split(".").at(-1)))
      errors.image4 = "Image URL needs to end in pgn or jpg (or jpeg)";
    setValidationErrors(errors);
  }, [
    country,
    address,
    city,
    state,
    lat,
    lng,
    description,
    name,
    price,
    previewImage,
    image1,
    image2,
    image3,
    image4,
  ]);

  return (
    <div className="form">
      <form onSubmit={onSubmit}>
        <h1>Create a new Spot </h1>
        <div className="location">
          <h2> Where's your place located?</h2>
          <h3>
            Guests will only get your exact address once they booked a
            reservation.
          </h3>

          <div>
            <label htmlFor="country">
              Country{" "}
              <span className="errorMessage" style={{ color: "red" }}>
                {submitted && validationErrors.country}
              </span>
            </label>

            <input
              id="country"
              type="text"
              onChange={(e) => setCountry(e.target.value)}
              value={country}
              placeholder="Country"
            />
          </div>
          <div>
            <label htmlFor="address">
              Address{" "}
              <span className="errorMessage" style={{ color: "red" }}>
                {submitted && validationErrors.address}
              </span>
            </label>
            <input
              id="address"
              type="text"
              onChange={(e) => setAddress(e.target.value)}
              value={address}
              placeholder="Address"
            />
          </div>
          <div>
            <label htmlFor="city">
              City{" "}
              <span className="errorMessage" style={{ color: "red" }}>
                {submitted && validationErrors.city}
              </span>
            </label>
            <input
              id="city"
              type="text"
              onChange={(e) => setCity(e.target.value)}
              value={city}
              placeholder="City"
            />
            <label htmlFor="state">
              State{" "}
              <span className="errorMessage" style={{ color: "red" }}>
                {submitted && validationErrors.state}
              </span>
            </label>
            <input
              id="state"
              type="text"
              onChange={(e) => setState(e.target.value)}
              value={state}
              placeholder="State"
            />
          </div>
          <div>
            <label htmlFor="latitude">
              Latitude{" "}
              <span className="errorMessage" style={{ color: "red" }}>
                {submitted && validationErrors.lat}
              </span>
            </label>
            <input
              id="latitude"
              type="text"
              onChange={(e) => setLat(e.target.value)}
              value={lat}
              placeholder="Latitude"
            />

            <label htmlFor="longitude">
              Longitude{" "}
              <span className="errorMessage" style={{ color: "red" }}>
                {submitted && validationErrors.lng}
              </span>
            </label>
            <input
              id="longitude"
              type="text"
              onChange={(e) => setLng(e.target.value)}
              value={lng}
              placeholder="Longitude"
            />
          </div>
        </div>

        <div className="create-description">
          <h2>Describe your place to guests</h2>
          <h3>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood
          </h3>
          <div>
            <textarea
              id="description"
              onChange={(e) => setDescription(e.target.value)}
              value={description}
              placeholder="Please write at least 30 characters"
            ></textarea>
            <div className="errorMessage" style={{ color: "red" }}>
              {submitted && validationErrors.description}
            </div>
          </div>
        </div>

        <div className="name">
          <h2>Create a title for your spot</h2>
          <h3>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </h3>
          <input
            id="name"
            type="text"
            onChange={(e) => setName(e.target.value)}
            value={name}
            placeholder="Name of your spot"
          />
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.name}
          </div>
        </div>

        <div className="price">
          <h2>Set a base price for your spot</h2>
          <h3>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </h3>
          <span>
            $
            <input
              id="price"
              type="text"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              placeholder="Price per night (USD)"
            />
          </span>
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.price}
          </div>
        </div>

        <div className="images">
          <h2>Liven up your spot with photos</h2>
          <h3>Submit a link to at least one photo to publish your spot.</h3>

          <input
            id="previewImage"
            type="text"
            onChange={(e) => setPreviewImage(e.target.value)}
            value={previewImage}
            placeholder="Preview Image URL"
          />
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.previewImage}
          </div>
          <input
            id="image1"
            type="text"
            onChange={(e) => setImage1(e.target.value)}
            value={image1}
            placeholder="Image URL"
          />
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.image1}
          </div>
          <input
            id="image2"
            type="text"
            onChange={(e) => setImage2(e.target.value)}
            value={image2}
            placeholder="Image URL"
          />
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.image2}
          </div>
          <input
            id="image3"
            type="text"
            onChange={(e) => setImage3(e.target.value)}
            value={image3}
            placeholder="Image URL"
          />
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.image3}
          </div>
          <input
            id="image4"
            type="text"
            onChange={(e) => setImage4(e.target.value)}
            value={image4}
            placeholder="Image URL"
          />
          <div className="errorMessage" style={{ color: "red" }}>
            {submitted && validationErrors.image4}
          </div>
        </div>
        <button>Create Spot</button>
      </form>
    </div>
  );
};
