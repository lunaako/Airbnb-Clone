import { useDispatch } from 'react-redux';
import { useModal } from '../../context/Modal';
import { useEffect, useState } from 'react';
import './PostReview.css';
import { createReviewThunk, getReviewsThunk } from '../../store/reviews';
import { getASpotThunk } from '../../store/currSpot';
import { getAllSpotsThunk } from '../../store/spots';

export default function PostReviewModal({spotId}) {

  const dispatch = useDispatch();
  const { closeModal } = useModal();
  const [newReview, setNewReview] = useState("");
  const [stars, setStars] = useState(0);
  const [errors, setErrors] = useState({});
  const [hoveredStars, setHoveredStars] = useState(0);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(createReviewThunk(newReview, stars, spotId))
      .then(() => dispatch(getASpotThunk(spotId)))
      .then(() => dispatch(getReviewsThunk(spotId)))
      .then(() => dispatch(getAllSpotsThunk()))
      .then(closeModal)
      .catch(e => setErrors(e.message));
  }

  useEffect(() => {
    let err = {};
    if (newReview.length < 10) {
      err.newReview = 'Review needs to be more than 10 characters';
    }
    if (!stars) {
      err.stars = 'Please rate'
    }

    setErrors(err);
  }, [newReview, stars])

  return (
    <>
      <div className="post-review-modal-title">
        <h2>How was your stay?</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <textarea
          type="text"
          value={newReview}
          placeholder="Leave your review here..."
          onChange={(e) => setNewReview(e.target.value)}
          required
        />
        <div className="star-rating">
          <div className="stars">
            {[1, 2, 3, 4, 5].map((n) => (
              <span
                key={n}
                onMouseEnter={() => setHoveredStars(n)}
                onMouseLeave={() => setHoveredStars(stars)}
                onClick={() => setStars(n)}
              >
                {hoveredStars >= n ? '★' : '☆'}
              </span>
            ))}
          </div>
          <span className="star-label">Stars</span>
        </div>
        <button
          className='post-review-button'
          type='submit'
          disabled={Object.values(errors).length}
          onClick={handleSubmit}
        >
          Submit Your Review
        </button>
      </form>
    </>
  );

}