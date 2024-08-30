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
    <div className='delete-review-modal'>
      <div className='delete-review-header'>
        <h1>Confirm Delete</h1>
        <p>Are you sure you want to delete this review?</p>
      </div>

      <button
        className='delete-review-yes'
        onClick={() => dispatch(deleteReviewThunk(reviewId))
                .then(() => dispatch(getASpotThunk(spotId)))
                .then(() => dispatch(getReviewsThunk(spotId)))
                .then(closeModal)}
      >
        Yes (Delete Review)
      </button>
      
      <button
        className='delete-review-no'
        onClick={() => closeModal()}
      >
        No (Keep Review)
      </button>
    </div>
  )
}
