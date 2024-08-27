import { useSelector } from "react-redux";
import { useParams } from "react-router-dom"




export default function SpotDetails() {
  const { id } = useParams();
  const spotsObj = useSelector(state => state.spots);
  const spots = spotsObj.Spots;
  const spot = spots.find(obj => obj.id === +id);
  const {name, city, state, country, price, description, avgRating, owenerId, previewImage } = spot;
  // console.log(spot)

  return (
    <div className="spot-header">
      {spot && (
        <div className="spot-header">
          <h2>{name}</h2>
        </div>
      )}
    </div>
  )
}