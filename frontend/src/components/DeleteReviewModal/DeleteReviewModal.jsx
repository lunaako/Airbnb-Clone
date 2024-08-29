import './DeleteReview.css';
import { useModal } from '../../context/Modal';
import { useDispatch } from 'react-redux';
import { deleteReviewThunk } from '../../store/reviews';
import { getASpotThunk } from '../../store/currSpot';
import { getReviewsThunk } from '../../store/reviews';

export default function DeleteReviewModal({ reviewId, spotId }) {
  const dispatch = useDispatch();
  const { closeModal } = useModal();

  return (
    <>
      <div>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
      </div>

      <button
        onClick={() => dispatch(deleteReviewThunk(reviewId))
                .then(() => dispatch(getASpotThunk(spotId)))
                .then(() => dispatch(getReviewsThunk(spotId)))
                .then(closeModal)}
      >
        Yes (Delete Review)
      </button>
      
      <button
        onClick={() => closeModal()}
      >
        No (Keep Review)
      </button>
    </>
  )
}
