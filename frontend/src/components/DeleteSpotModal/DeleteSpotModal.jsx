import './DeleteSpot.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import OpenModalButton from "../OpenModalButton/OpenModalButton.jsx";
import { deleteSpotThunk } from '../../store/spots.js';
import { getSessionSpotsThunk } from '../../store/session.js';


export default function DeleteSpotModal({spotId}) {
  // console.log(spotId)
  const { closeModal } = useModal();
  const dispatch = useDispatch();

  return (
    <div className="delete-spot-modal-container">
      <div className='delete-spot-header'>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings?</p>
      </div>

      <button
        className='delete-spot-yes'
        onClick={() => dispatch(deleteSpotThunk(spotId))
                  .then(() => dispatch(getSessionSpotsThunk()))
                  .then(closeModal)}
      >
        Yes  (Delete Spot)
      </button>
      
      <button 
        className='delete-spot-no'
        onClick={() => closeModal()}>
        No  (Keep Spot)

      </button>
    </div>
  )
}