import React, { useContext, useEffect, useState } from 'react';
import { Star, MessageSquare, Trash2, MoreVertical, EyeOff } from 'lucide-react';
import { DoctorLayoutContext } from '../context/DoctorLayoutContext';
import axios from 'axios';

export default function Reviews() {
  const [selectedFilter, setSelectedFilter] = useState('all');
  const { reviews, setReview, personalInfo } = useContext(DoctorLayoutContext);
  const apiUrl = import.meta.env.VITE_APP_KEY;

  const [openDropdownId, setOpenDropdownId] = useState(null);

  const handleDropdownToggle = (id) => {
    setOpenDropdownId(openDropdownId === id ? null : id);
  };
  const handleHideRating = async (reviewId) => {
    console.log('Hiding rating for review:', reviewId);

    try {
      await axios.delete(`${apiUrl}/api/ratings/${reviewId}`,
        {
          headers: {
            "ngrok-skip-browser-warning": "s",
            Authorization: `Bearer ${localStorage.getItem("userToken")}`,
            "Content-Type": "application/json",
          },
        }
      );
      setOpenDropdownId(null);
      setReview(reviews.filter((review) => review.id !== reviewId));

    } catch (error) {
      console.error('Error hiding rating:', error);
    }
  };

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={16}
        className={`${index < rating
          ? 'text-yellow-400 fill-yellow-400'
          : 'text-gray-300'
          }`}
      />
    ));
  };

  const filteredReviews = reviews.filter((review) => {
    if (selectedFilter === 'all') {
      return true;
    }
    return review.rating === parseInt(selectedFilter);
  });



  const sumComments = reviews.filter(item => item.comment && item.comment !== 'لا توجد تعليقات').length;

  const sumRatingTotal = reviews
    .map(item => item.rating)
    .reduce((sum, rating) => sum + rating, 0)
  console.log("sumRatingTotal", sumRatingTotal)
  const totalReviews = reviews.length;
  const maxRating = 5;
  const satisfactionPercentage = Math.round((sumRatingTotal / (totalReviews * maxRating)) * 100);
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">التقييمات والتعليقات</h1>
        <div className="flex gap-2">
          <select
            value={selectedFilter}
            onChange={(e) => setSelectedFilter(e.target.value)}
            className="px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300"
          >
            <option value="all">جميع التقييمات</option>
            <option value="5">5 نجوم</option>
            <option value="4">4 نجوم</option>
            <option value="3">3 نجوم</option>
            <option value="2">2 نجوم</option>
            <option value="1">1 نجمة</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{personalInfo.rating}</h3>
            <div className="flex justify-center my-2">
              {renderStars(personalInfo.rating)}
            </div>
            <p className="text-gray-500 dark:text-gray-400">متوسط التقييم</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{reviews.length}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">إجمالي التقييمات</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{satisfactionPercentage}%</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">نسبة الرضا</p>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold text-gray-800 dark:text-white">{sumComments}</h3>
            <p className="text-gray-500 dark:text-gray-400 mt-2">تعليق</p>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm max-h-[500px] overflow-y-auto">
        <div className="p-6 space-y-6">
          {filteredReviews
            .slice() // لإنشاء نسخة من المصفوفة حتى لا نعدل الأصل
            .sort((a, b) => new Date(b.date) - new Date(a.date)) // الترتيب من الأحدث إلى الأقدم          
            .map((review) => (
              <div key={review.id} className="border-b dark:border-gray-700 last:border-0 pb-6 last:pb-0">
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-4 space-x-reverse">
                    <img
                      src={review.avatar}
                      alt={review.patient}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{review.patient}</h3>
                      <div className="flex items-center space-x-2 space-x-reverse mt-1">
                        <div className="flex">
                          {renderStars(review.rating)}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                          {review.date}
                        </span>
                      </div>
                      <p className="mt-2 text-gray-600 dark:text-gray-300">{review.comment}</p>
                    </div>
                  </div>
                  <div className="relative">
                    <button
                      className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full"
                      onClick={() => handleDropdownToggle(review.id)}
                    >
                      <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
                    </button>

                    {openDropdownId === review.id && (
                      <div className="absolute w-32 right-[-5rem] mt-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                        <button
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition duration-200 ease-in-out"
                          onClick={() => handleHideRating(review.id)}
                        >
                          <EyeOff size={16} className="mr-2 text-gray-600 dark:text-gray-400" />
                          إخفاء التقييم
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}