


export default function SpotForm() {
  return (
    <form className="new-spot-form">

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

          />
        </label>

        <label>
          Street Address
          <input
            type='text'
            name='Street Address'
            placeholder="Address"

          />
        </label>

        <label>
          City
          <input
            type='text'
            name='city'
            placeholder="City"

          />
        </label>
        <span> , </span>
        <label>
          State
          <input
            type='text'
            name='state'
            placeholder="STATE"

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
            name='title'
            placeholder="Name of your spot"

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

          />
        </label>

        <label>
          <input
            type='text'
            name='image1'
            placeholder="Image URL"

          />
        </label>

        <label>
          <input
            type='text'
            name='image2'
            placeholder="Image URL"

          />
        </label>

        <label>
          <input
            type='text'
            name='image3'
            placeholder="Image URL"

          />
        </label>

        <label>
          <input
            type='text'
            name='image4'
            placeholder="Image URL"

          />
        </label>
      </div>

      <div className='form-divider'></div>

      <button>Create Spot</button>
    </form>
  )
}