import './SpotsIndex.css';


export default function SpotsGrid({spot}) {
  const { city, state, price, avgRating, previewImage } = spot;
  // console.log(city);

  return (
    <div className="listing-item">

      <div className="img-container">
        <img src={previewImage} alt='spot image'/>
      </div>

      <div className="spots-details">

        <div className="location-rating">
          <p>{city}, {state}</p>
          <span>⭐ {avgRating !== null ? avgRating : `New`}</span>
        </div>

        <p><strong>${price}</strong> night</p>
      </div>

    </div>

  )
}