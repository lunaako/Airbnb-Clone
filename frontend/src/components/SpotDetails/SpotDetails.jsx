import { useSelector, useDispatch } from "react-redux";
import { useParams } from "react-router-dom"
import { useEffect } from "react";
import { getASpotThunk } from "../../store/currSpot";


export default function SpotDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getASpotThunk(id))
  }, [dispatch, id])

  const spot = useSelector(state => state.currSpot);

  if (!spot || Object.keys(spot).length === 0) {
    return (
      <div>
        Loading...
      </div>
    )
  }

  const { Owner: {firstName, lastName}, SpotImages, avgStarRating, city, state, country, name , description, price, numReviews } = spot;

  return (
    <div className="spot-header">
  
        <div className="spot-header">
          <h1>{name}</h1>
          <p>{city}, {state}, {country}</p>
        </div>
{/* 
        <div className="img-container">
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
          <img src="" alt="" />
        </div> */}

        <div className="spot-description">
          <h2>Hosted by {firstName} {lastName}</h2>
          <p>{description}</p>
        </div>

        <div className="other-info">
          <div className="price-review-rating">
            <p>${price} night</p>
            <span>🌟 {avgStarRating}  #{numReviews}</span>
          </div>

          <button
            onClick={() => alert('Feature Coming Soon...')}
          >Reserve</button>
        </div>

    </div>
  )
}