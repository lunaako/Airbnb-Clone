import './CurrSpots.css';
import { getSessionSpotsThunk } from '../../store/session';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import SpotsGrid from '../SpotsIndex/SpotsGrid';
import OpenModalButton from '../OpenModalButton/OpenModalButton';
import DeleteSpotModal from '../DeleteSpotModal/DeleteSpotModal';


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
      <>
        <h1 className='manage-spots-no-spots'>Manage Spots</h1>

        <Link to='/spots/new' className="create-new-spot-currSpot">Create a New Spot</Link>
  
      </>
    )
  }

  const handleDivClick = (e, spot) => {
    if(e.target.tagName !== 'BUTTON') {
      navigate(`/spots/${spot.id}`)
    }
  }

  return (
    <div className='manage-spots-whole'>
      <h1>Manage Spots</h1>
      <div className='spots-grid'>
        {loaded && !!spots.length &&
          (
            spots.map(spot => (
              <div 
                key={spot.id} 
                className='manage-spots-blocks'
                onClick={(e) => handleDivClick(e, spot)}
              >
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
      </div>
    </div>
  )
}