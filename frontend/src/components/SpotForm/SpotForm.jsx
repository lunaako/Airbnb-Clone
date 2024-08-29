import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSpotThunk } from "../../store/spots";


export default function SpotForm() {
  const [country, setCountry] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [description, setDescription] = useState('');
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [previewImage, setPreviewImage] = useState([]);
  const [image1, setImage1] = useState("");
  const [image2, setImage2] = useState("");
  const [image3, setImage3] = useState("");
  const [image4, setImage4] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const ownerId = sessionUser.id;



  // console.log(userId)

  const handleSumbit = (e) => {
    e.preventDefault();

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

    dispatch(createSpotThunk(newSpot));

    console.log(newSpot)
  }


  return (
    <form 
      onSubmit={handleSumbit}
      className="new-spot-form"
    >

      <div className="form-header">
        <h1>Create a New Spot</h1>
        <h2>Where's your place located?</h2>
        <p>Guests will only get your exact address once they booked a reservation</p>
      </div>

      <div className="form-locations">
        <label>
          Country
          <input 
            type='text'
            name='country'
            placeholder="Country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
          />
        </label>

        <label>
          Street Address
          <input
            type='text'
            name='address'
            placeholder="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </label>

        <label>
          City
          <input
            type='text'
            name='city'
            placeholder="City"
            value={city}
            onChange={(e) => setCity( e.target.value)}
          />
        </label>
        
        <label>
          State
          <input
            type='text'
            name='state'
            placeholder="STATE"
            value={state}
            onChange={(e) => setState(e.target.value)}
          />
        </label>

        <label>
          Latitude
          <input
            type='number'
            name='lat'
            placeholder="Latitude"
            value={lat}
            onChange={(e) => setLat(e.target.value)}
          />
        </label>

        <label>
          Longtitude
          <input
            type='number'
            name='lng'
            placeholder="Longitude"
            value={lng}
            onChange={(e) => setLng(e.target.value)}
          />
        </label>
      </div>

      <div className='form-divider'></div>

      <div className="form-description">
        <h2>Describe your place to guests</h2>
        <p>Mention the best features of your space, any special amentities like fast wifi or parking, and what you love about the neighborhood.</p>

        <textarea
          name='description'
          placeholder="Please write at least 30 characters"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        >
        </textarea>
      </div>

      <div className='form-divider'></div>

      <div className="form-setTitle">
        <h2>Create a title for your spot</h2>
        <p>Catch guests' attention with a spot title that highlights what makes your place special</p>

        <label>
          <input 
            type='text'
            name='name'
            placeholder="Name of your spot"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
      </div>

      <div className='form-divider'></div>

      <div className="form-price">
        <h2>Set a base price for your spot</h2>
        <p>Competitive pricing can help your listing stand out and rank higher in search results.</p>

        <label>
          $
          <input
            type='number'
            name='price'
            placeholder="Price per night(USD)"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </label>
      </div>

      <div className='form-divider'></div>

      <div className="form-image">
        <h2>Liven up your spot with photos</h2>
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

        <label>
          <input
            type='text'
            name='image1'
            placeholder="Image URL"
            value={image1}
            onChange={(e) => setImage1(e.target.value)}
          />
        </label>

        <label>
          <input
            type='text'
            name='image2'
            placeholder="Image URL"
            value={image2}
            onChange={(e) => setImage2(e.target.value)}
          />
        </label>

        <label>
          <input
            type='text'
            name='image3'
            placeholder="Image URL"
            value={image3}
            onChange={(e) => setImage3(e.target.value)}
          />
        </label>

        <label>
          <input
            type='text'
            name='image4'
            placeholder="Image URL"
            value={image4}
            onChange={(e) => setImage4(e.target.value)}
          />
        </label>
      </div>

      <div className='form-divider'></div>

      <button 
        type='submit'
      >
        Create Spot
      </button>
    </form>
  )
}