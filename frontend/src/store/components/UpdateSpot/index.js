import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import "./UpdateSpot.css";
import { updateSpotThunk } from "../../spots";
import { addSpotImageThunk, deleteSpotImagesThunk } from "../../images";
import { addSpotDetailsThunk } from "../../spotsDetails";

export default () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { id } = useParams();
  const spotDetails = useSelector((state) => state.spotsDetails[id]);

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
  const [validationErrors, setValidationErrors] = useState({});

  useEffect(() => {
    dispatch(addSpotDetailsThunk(id));
  }, [dispatch, id]);

  useEffect(() => {
    if (!spotDetails) return;
    const images = [];
    setCountry(spotDetails.country);
    setAddress(spotDetails.address);
    setCity(spotDetails.city);
    setState(spotDetails.state);
    setLat(spotDetails.lat);
    setLng(spotDetails.lng);
    setDescription(spotDetails.description);
    setName(spotDetails.name);
    setPrice(spotDetails.price);
    Object.values(spotDetails.SpotImages).forEach((image) => {
      if (image.preview) {
        setPreviewImage(image.url);
      } else images.push(image.url);
    });
    if (images[0]) setImage1(images[0]);
    if (images[1]) setImage2(images[1]);
    if (images[2]) setImage3(images[2]);
    if (images[3]) setImage4(images[3]);
  }, [spotDetails]);

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
      const response = await dispatch(updateSpotThunk(id, newSpot));
      if (response.errors && Object.values(response.errors).length) {
        setValidationErrors(response.errors);
      } else {
        const oldImages = Object.values(spotDetails.SpotImages).map(
          (image) => image.id
        );
        dispatch(deleteSpotImagesThunk(oldImages))
          .then(() => dispatch(addSpotImageThunk(images, id)))
          .then(() => history.push(`/spots/${id}`));

        // setValidationErrors({});
        // setAddress("");
        // setCity("");
        // setState("");
        // setCountry("");
        // setLat("");
        // setLng("");
        // setName("");
        // setDescription("");
        // setPrice("");
        // setSubmitted(false);
        // setPreviewImage("");
        // setImage1("");
        // setImage2("");
        // setImage3("");
        // setImage4("");

        // setButton(true);
      }
    }
  };

  return (
    <div className="update-spot-form">
      <form onSubmit={onSubmit}>
        <h2>Update your Spot </h2>
        <div className="location">
          <h3> Where's your place located?</h3>
          <p>
            Guests will only get your exact address once they booked a
            reservation.
          </p>

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
          <div id="city-state-input">
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
              />{" "}
              <span></span>
            </div>

            <div className="form-comma">{", "}</div>
            <div>
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
                placeholder="STATE"
              />
            </div>
          </div>
          <div id="lat-lng-input">
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
            </div>
            <div className="form-comma">{", "}</div>
            <div>
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
        </div>

        <div className="update-description">
          <h3>Describe your place to guests</h3>
          <p>
            Mention the best features of your space, any special amentities like
            fast wifi or parking, and what you love about the neighborhood
          </p>
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
          <h3>Create a title for your spot</h3>
          <p>
            Catch guests' attention with a spot title that highlights what makes
            your place special.
          </p>
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
          <h3>Set a base price for your spot</h3>
          <p>
            Competitive pricing can help your listing stand out and rank higher
            in search results.
          </p>
          <span>
            {"$ "}
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
          <h3>Liven up your spot with photos</h3>
          <p>Submit a link to at least one photo to publish your spot.</p>

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
        <div>
          <button>Update Spot</button>
        </div>
      </form>
    </div>
  );
};
