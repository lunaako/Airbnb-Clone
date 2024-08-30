import { useNavigate } from 'react-router-dom';
import './SpotsIndex.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaw } from '@fortawesome/free-solid-svg-icons';
import { formatRating } from "../../utils/util.js";



export default function SpotsGrid({spot}) {
  const { id, city, state, price, avgRating, previewImage, name } = spot;
  const navigate = useNavigate();
  // console.log(city);

  return (
    <div 
      className="listing-item"
      onClick={() => navigate(`/spots/${id}`)}
    >

      <div className="img-container">
        <img src={previewImage} alt='spot image'/>
      </div>

      <div className="spots-details">

        <div className="location-rating">
          <p>{city}, {state}</p>
          
          <span> <FontAwesomeIcon icon={faPaw} />   {avgRating && avgRating !== null ? formatRating(avgRating) : `New`}</span>
        </div>

        <p><strong>${price}</strong> night</p>
      </div>

      <div className='tooltip'>
        {name}
      </div>

    </div>

  )
}