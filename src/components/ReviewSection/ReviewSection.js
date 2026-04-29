import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchReviews, submitReview, deleteReview, clearReviews } from "../../store/slices/reviewsSlice";
import StarRating from "../StarRating/StarRating";

const ReviewSection = ({ tmdbId, mediaType }) => {
  const dispatch = useDispatch();
  const { uid, displayName } = useSelector((state) => state.user);
  const { items: reviews, loading, submitting } = useSelector((state) => state.reviews);

  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [editMode, setEditMode] = useState(false);

  const myReview = reviews.find((r) => r.user_id === uid);
  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + (r.rating || 0), 0) / reviews.length).toFixed(1)
      : null;

  useEffect(() => {
    if (tmdbId) dispatch(fetchReviews(tmdbId));
    return () => dispatch(clearReviews());
  }, [tmdbId, dispatch]);

  useEffect(() => {
    if (myReview && !editMode) {
      setRating(myReview.rating || 0);
      setReviewText(myReview.review_text || "");
    }
  }, [myReview, editMode]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!rating) return;
    dispatch(submitReview({ userId: uid, userName: displayName, tmdbId, mediaType, rating, reviewText }));
    setEditMode(false);
  };

  const handleDelete = () => {
    dispatch(deleteReview({ userId: uid, tmdbId }));
    setRating(0);
    setReviewText("");
    setEditMode(false);
  };

  return (
    <div className="mt-10">
      <div className="flex items-center gap-4 mb-4">
        <h3 className="text-xl font-bold">Reviews</h3>
        {avgRating && (
          <div className="flex items-center gap-1 text-yellow-400 text-sm">
            <span className="text-lg">★</span>
            <span className="font-semibold">{avgRating}</span>
            <span className="text-gray-400">({reviews.length})</span>
          </div>
        )}
      </div>

      {/* Write / Edit review */}
      {uid && (!myReview || editMode) && (
        <form onSubmit={handleSubmit} className="bg-gray-900/60 border border-gray-700 rounded-xl p-4 mb-6">
          <p className="text-sm text-gray-400 mb-3">
            {editMode ? "Edit your review" : "Rate & review this title"}
          </p>
          <StarRating value={rating} onChange={setRating} size="lg" />
          <textarea
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="Share your thoughts (optional)..."
            rows={3}
            maxLength={500}
            className="w-full mt-3 px-3 py-2 bg-gray-800 border border-gray-700 rounded-lg text-sm text-white placeholder-gray-500 focus:outline-none focus:border-purple-500 resize-none"
          />
          <div className="flex gap-2 mt-3">
            <button
              type="submit"
              disabled={!rating || submitting}
              className="px-4 py-1.5 bg-purple-600 text-white rounded-md text-sm font-semibold hover:bg-purple-700 disabled:opacity-50 transition"
            >
              {submitting ? "Saving..." : editMode ? "Update" : "Submit"}
            </button>
            {editMode && (
              <button type="button" onClick={() => setEditMode(false)} className="px-4 py-1.5 bg-gray-700 rounded-md text-sm text-gray-300 hover:bg-gray-600 transition">
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      {/* User's existing review */}
      {uid && myReview && !editMode && (
        <div className="bg-purple-900/20 border border-purple-700/40 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-purple-300">Your Review</span>
              <StarRating value={myReview.rating} readonly size="sm" />
            </div>
            <div className="flex gap-2">
              <button onClick={() => setEditMode(true)} className="text-xs text-gray-400 hover:text-white transition">Edit</button>
              <button onClick={handleDelete} className="text-xs text-red-400 hover:text-red-300 transition">Delete</button>
            </div>
          </div>
          {myReview.review_text && (
            <p className="text-sm text-gray-300">{myReview.review_text}</p>
          )}
        </div>
      )}

      {/* All reviews */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-20 bg-gray-800/40 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : reviews.filter((r) => r.user_id !== uid).length > 0 ? (
        <div className="space-y-3">
          {reviews
            .filter((r) => r.user_id !== uid)
            .map((review) => (
              <div key={review.id} className="bg-gray-900/60 border border-gray-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold">
                    {(review.user_name || "U")[0].toUpperCase()}
                  </div>
                  <span className="text-sm font-medium text-gray-300">{review.user_name || "Anonymous"}</span>
                  <StarRating value={review.rating} readonly size="sm" />
                  <span className="text-xs text-gray-500 ml-auto">
                    {new Date(review.created_at).toLocaleDateString()}
                  </span>
                </div>
                {review.review_text && (
                  <p className="text-sm text-gray-400 mt-1">{review.review_text}</p>
                )}
              </div>
            ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No reviews yet. Be the first!</p>
      )}
    </div>
  );
};

export default ReviewSection;
