import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {createSpotThunk, updateSpotThunk } from "../../store/spots";
import { addImgThunk } from "../../store/spotImage";
import './SpotForm.css';
import { useNavigate } from "react-router-dom";

export default function SpotForm({ exsSpot, spotId }) {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const ownerId = sessionUser.id;
  const navigate = useNavigate();


  const [country, setCountry] = useState(exsSpot?.country || '');
  const [address, setAddress] = useState(exsSpot?.address || '');
  const [city, setCity] = useState(exsSpot?.city || '');
  const [state, setState] = useState(exsSpot?.state || '');
  const [description, setDescription] = useState(exsSpot?.description || '');
  const [name, setName] = useState(exsSpot?.name || '');
  const [price, setPrice] = useState(exsSpot?.price || '');
  const [previewImage, setPreviewImage] = useState(exsSpot?.SpotImages.find(img => img.preview).url || '');
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [lat, setLat] = useState(exsSpot?.lat || "");
  const [lng, setLng] = useState(exsSpot?.lng || "");
  const [errs, setErrs] = useState({});


  const handleSumbit = async(e) => {

    e.preventDefault();
    const errors = {};

    if (!country.length) {
      errors.country = 'Country is required'
    }
    if (!address.length) {
      errors.address = 'Address is required'
    }
    if (!city.length) {
      errors.city = 'City is required'
    }
    if (!state.length) {
      errors.state = 'State is required'
    }
    if (!lat.length) {
      errors.latitude = 'Latitude is required'
    }
    if (!lng.length) {
      errors.longitude = 'Longitude is required'
    }
    if (description.length < 30) {
      errors.description = 'Description needs a minimum of 30 characters'
    }
    if(!name.length) {
      errors.name = 'Name is required'
    }
    if (!price.length) {
      errors.price = 'Price is required'
    }
    if (!previewImage.length) {
      errors.previewImage = 'Preview image is required'
    }

    const imgUrlFormatCheck = (imageName, img) => {
      if (img.length && !img.endsWith('.png') && !img.endsWith('.jpg') && !img.endsWith('.jpeg')) {
        errors[imageName] = 'Image URL must end in .png, .jpg or jpeg';
      }
    }
    
    imgUrlFormatCheck('previewImageFormat', previewImage);
    imgUrlFormatCheck('image1Format', image1);
    imgUrlFormatCheck('image2Format', image2);
    imgUrlFormatCheck('image3Format', image3);
    imgUrlFormatCheck('image4Format', image4);

    setErrs(errors);

    if (!Object.values(errors).length) {
      const newSpot = {
        ownerId,
        address,
        city,
        state,
        country,
        lat,
        lng,
        name,
        description,
        price: +price
      };

      console.log(spotId)
      let updatedSpot;
      if (exsSpot) {
        updatedSpot = await dispatch(updateSpotThunk(spotId, newSpot));
      } else {
        updatedSpot = await dispatch(createSpotThunk(newSpot));
      }

      if (updatedSpot && updatedSpot.id) {
        spotId = updatedSpot.id;

        if (previewImage.length) {
          const prevImg = { url: previewImage, preview: true };
          dispatch(addImgThunk(prevImg, spotId));
        }

        const images = [image1, image2, image3, image4];
        for (let url of images) {
          if (url) {
            const img = { url, preview: false };
            dispatch(addImgThunk(img, spotId));
          }
        }
      }
      navigate(`/spots/${spotId}`);
    }
  }

  return (
    <form 
      onSubmit={handleSumbit}
      className="new-spot-form"
    >

      <div className="form-header">
        <h1>{exsSpot ? `Update Your Spot`: `Create a New Spot`}</h1>
        <h3>Where&apos;s your place located?</h3>
        <p>Guests will only get your exact address once they booked a reservation</p>
      </div>

      <div className="form-locations">
        <label className="form-location-label">
          Country {errs.country && <span className="form-errors">{errs.country}</span>}
          <input 
            type='text'
            name='country'
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>

        <label className="form-location-label">
          Street Address {errs.address && <span className="form-errors">{errs.address}</span>}
          <input
            type='text'
            name='address'
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <div className="spot-form-inline">
          <label className="spot-form-city inline-first">
            City {errs.city && <span className="form-errors">{errs.city}</span>}
            <input
              type='text'
              name='city'
              placeholder="City"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </label>
          <p className="spot-form-comma">,</p>
          <label className="spot-form-state inline-second">
            State {errs.state && <span className="form-errors">{errs.state}</span>}
            <input
              type='text'
              name='state'
              placeholder="STATE"
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
          </label>
        </div>

        <div className="spot-form-inline">
          <label className="spot-form-lat inline-first">
            Latitude {errs.latitude && <span className="form-errors">{errs.latitude}</span>}
            <input
              type='number'
              name='lat'
              placeholder="Latitude"
              value={lat}
              onChange={(e) => setLat(e.target.value)}
            />
          </label>

          <p className="spot-form-comma">,</p>

          <label className="spot-form-lng inline-second">
            Longitude {errs.longitude && <span className="form-errors">{errs.longitude}</span>}
            <input
              type='number'
              name='lng'
              placeholder="Longitude"
              value={lng}
              onChange={(e) => setLng(e.target.value)}
            />
          </label>
        </div>

      </div>

      <div className='form-divider'></div>

      <div className="form-description">
        <h3>Describe your place to guests</h3>
        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

        <textarea
          name='description'
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        >
        </textarea>
        {errs.description && <p className="form-errors">{errs.description}</p>}
      </div>

      <div className='form-divider'></div>

      <div className="form-setTitle">
        <h3>Create a title for your spot</h3>
        <p>Catch guests&apos; attention with a spot title that highlights what makes your place special</p>

        <label>
          <input 
            type='text'
            name='name'
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        {errs.name && <p className="form-errors">{errs.name}</p>}

      </div>

      <div className='form-divider'></div>

      <div className="form-price">
        <h3>Set a base price for your spot</h3>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>

        <label className="spot-form-price">
          <span id="money-symbol">$</span>
          <input
            type='number'
            name='price'
            placeholder="Price per night(USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
        {errs.price && <p className="form-errors">{errs.price}</p>}

      </div>

      <div className='form-divider'></div>

      <div className="form-image">
        <h3>Liven up your spot with photos</h3>
        <p>Submit a link to at least one photo to publish your spot.</p>

        <label>
          <input
            type='text'
            name='previewImage'
            placeholder="Preview Image URL"
            value={previewImage}
            onChange={(e) => setPreviewImage(e.target.value)}
          />
        </label>
        {errs.previewImage && <p className="form-errors">{errs.previewImage}</p>}

        {errs.previewImageFormat && <p className="form-errors">{errs.previewImageFormat}</p>}


        <label>
          <input
            type='text'
            name='image1'
            placeholder="Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
        </label>
        {errs.image1Format && <p className="form-errors">{errs.image1Format}</p>}

        <label>
          <input
            type='text'
            name='image2'
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
        </label>
        {errs.image2Format && <p className="form-errors">{errs.image2Format}</p>}

        <label>
          <input
            type='text'
            name='image3'
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
        </label>
        {errs.image3Format && <p className="form-errors">{errs.image3Format}</p>}

        <label>
          <input
            type='text'
            name='image4'
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
        </label>
        {errs.image4Format && <p className="form-errors">{errs.image4Format}</p>}

      </div>

      <div className='form-divider'></div>

      <button 
        type='submit'
      >
        {exsSpot ? `Update Spot` : `Create Spot`}
      </button>
    </form>
  )
}