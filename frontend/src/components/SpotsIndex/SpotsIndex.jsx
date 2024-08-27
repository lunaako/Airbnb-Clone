import { useSelector, useDispatch } from "react-redux";
import SpotsGrid from "./SpotsGrid";
import './SpotsIndex.css';


export default function SpotsIndex() {
  const spotsObj = useSelector(state => state.spots);
  const spotsArr = Object.values(spotsObj).filter(spot => typeof spot === 'object');

  // console.log(spotsArr);


  return (
    <div className="spots-grid">
      { spotsArr && 
        spotsArr.map((spot) => (
        <SpotsGrid key={spot.id} spot={spot} />
        )
        )
      }
    </div>
  )
}