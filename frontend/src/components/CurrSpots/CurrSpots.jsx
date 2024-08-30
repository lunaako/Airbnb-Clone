import './CurrSpots.css';
import { getSessionSpotsThunk } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpotsGrid from '../SpotsIndex/SpotsGrid';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';
// import SpotForm from '../SpotForm/SpotForm';


export default function CurrSpots() {
  const dispatch = useDispatch();
  const sessionUser = useSelector(state => state.session.user);
  const [loaded, setIsLoaded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (sessionUser) {
      dispatch(getSessionSpotsThunk())
        .then(setIsLoaded(true));
    }

  }, [dispatch])

  const spots = sessionUser?.spots ? Object.values(sessionUser.spots): [];

  const handleUpdate = (spot) => {
    navigate(`/spots/${spot.id}/edit`);
  };


  if (!spots.length && !!sessionUser) {
    return (
      <Link to='/spots/new'>Create a New Spot</Link>
    )
  }

  return (
    <>
      <h1>Manage Spots</h1>
      <div className='spots-grid'>
        {loaded && spots.length &&
          (
            spots.map(spot => (
              <div key={spot.id}>
                <SpotsGrid  spot={spot} />
                <button
                  onClick={() => handleUpdate(spot)}
                >Update</button>

                <OpenModalButton 
                  buttonText='Delete'
                  modalComponent={<DeleteSpotModal  spotId={spot.id} />}
                />
              </div>

            ))
          )
        }
      </div>,
    </>
  )
}