import './UpdateSpot.css';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getASpotThunk } from '../../store/currSpot';
import SpotForm from '../SpotForm/SpotForm';

export default function UpdateSpot() {
  const { id:spotId } = useParams();
  // console.log(spotId)
  const dispatch = useDispatch();


  const [isLoading, setIsLoading] = useState(true);

  const spot = useSelector(state => state.currSpot);

  useEffect(() => {
    dispatch(getASpotThunk(spotId))
      .then(() => setIsLoading(false))
      .catch(error => {
        console.error("Error fetching spot details:", error);
        setIsLoading(false);
      });
  }, [dispatch, spotId]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!spot || Object.keys(spot).length === 0) {
    return <div>Spot not found</div>;
  }

  return <SpotForm exsSpot={spot} spotId={spotId} />;
}