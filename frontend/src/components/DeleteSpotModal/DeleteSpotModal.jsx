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
    <>
      <div>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to remove this spot from the listings?</p>
      </div>

      <button
        onClick={() => dispatch(deleteSpotThunk(spotId))
                  .then(() => dispatch(getSessionSpotsThunk()))
                  .then(closeModal)}
      >
        Yes  (Delete Spot)
      </button>
      
      <button onClick={() => closeModal()}>
        No  (Keep Spot)

      </button>
    </>
  )
}