import React, { useState } from 'react';
import { store } from '../../services/store';
import { X, Utensils, ThumbsUp, ThumbsDown, MessageSquare, Clock, Calendar } from 'lucide-react';

interface MessViewModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const MessViewModal: React.FC<MessViewModalProps> = ({ isOpen, onClose }) => {
  const [selectedDay, setSelectedDay] = useState('Thursday');
  const [feedbackMeal, setFeedbackMeal] = useState<'Breakfast' | 'Lunch' | 'Dinner'>('Lunch');
  const [feedbackRating, setFeedbackRating] = useState<'GOOD' | 'AVERAGE' | 'POOR'>('GOOD');
  const [feedbackText, setFeedbackText] = useState('');
  const [hasSubmittedFeedback, setHasSubmittedFeedback] = useState(false);

  if (!isOpen) return null;

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const weeklyMenu: Record<string, { breakfast: string; lunch: string; snacks: string; dinner: string }> = {
    Thursday: {
      breakfast: 'Masala Dosa, Sambar, Coconut Chutney, Boiled Eggs / Banana, Tea / Coffee',
      lunch: 'Jeera Rice, Dal Tadka, Paneer Butter Masala / Chicken Curry, Mixed Veg, Curd, Roti, Salad',
      snacks: 'Samosa, Mint Chutney, Hot Masala Tea',
      dinner: 'Phulka Roti, Aloo Gobi Matar, Dal Makhani, Steamed Rice, Gulab Jamun',
    },
    Friday: {
      breakfast: 'Idli & Vada with 2 Chutneys & Piping Hot Sambar, Fresh Fruit, Tea',
      lunch: 'Hyderabadi Veg Biryani / Egg Biryani, Mirchi Ka Salan, Raita, Fryums',
      snacks: 'Pav Bhaji with Buttered Buns, Filter Coffee',
      dinner: 'Tandoori Roti, Chana Masala, Jeera Rice, Rasam, Ice Cream Cup',
    },
    Saturday: {
      breakfast: 'Aloo Paratha with Amul Butter & Curd, Pickle, Tea',
      lunch: 'Rajma Masala, Steamed Basmati Rice, Bhindi Do Pyaza, Boondi Raita',
      snacks: 'Poha with Sev & Roasted Peanuts, Lemon Tea',
      dinner: 'Veg Pulao, Paneer Kadhai / Fish Curry, Roti, Sweet Semiya Kheer',
    },
    Sunday: {
      breakfast: 'Puri with Potato Bhaji, Halwa, Milk / Tea',
      lunch: 'Special Sunday Feast: Mutton Curry / Shahi Paneer, Biryani, Naan, Rasmalai',
      snacks: 'Assorted Biscuits & Filter Coffee',
      dinner: 'Khichdi, Kadhi, Papad, Aloo Chokha, Pickle',
    },
    Monday: {
      breakfast: 'Upma with Coconut Chutney, Sprouts Salad, Tea',
      lunch: 'Plain Rice, Sambhar, Cabbage Poriyal, Dal Fry, Roti, Curd',
      snacks: 'Onion Pakoda, Green Chutney, Tea',
      dinner: 'Roti, Dal Palak, Mixed Veg Korma, Steamed Rice, Papad',
    },
    Tuesday: {
      breakfast: 'Uttapam with Tomato & Coconut Chutney, Boiled Egg / Fruit, Tea',
      lunch: 'Lemon Rice, Curd Rice, Sambar, Potato Roast, Appalam',
      snacks: 'Veg Cutlet, Tomato Sauce, Tea',
      dinner: 'Roti, Matar Paneer, Dal Tadka, Rice, Fruit Custard',
    },
    Wednesday: {
      breakfast: 'Poori Chole, Halwa, Tea / Coffee',
      lunch: 'Chicken Biryani / Soya Chaap Biryani, Salan, Onion Raita',
      snacks: 'Bhel Puri with Chutneys, Tea',
      dinner: 'Roti, Dal Fry, Seasonal Subzi, Rice, Sweet Boondi',
    },
  };

  const handleFeedbackSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    store.addAuditLog(
      'Submitted Mess Feedback',
      `${feedbackMeal} on ${selectedDay} -> Rating: ${feedbackRating}`,
      feedbackText
    );
    setHasSubmittedFeedback(true);
    store.showToast('success', 'Mess feedback recorded', 'Thank you! Hostel Mess Committee reviews all ratings weekly.');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-amber-500/10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center">
              <Utensils className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">Hostel Dining & Mess Schedule</h3>
              <p className="text-xs text-slate-500">Weekly nutritious menu, meal timings & student feedback</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs">
          {/* Meal Timings strip */}
          <div className="grid grid-cols-4 gap-2 text-center">
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Breakfast</span>
              <span className="text-xs font-bold text-slate-900">7:30 - 9:30 AM</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Lunch</span>
              <span className="text-xs font-bold text-slate-900">12:30 - 2:30 PM</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Hi-Tea</span>
              <span className="text-xs font-bold text-slate-900">5:00 - 6:00 PM</span>
            </div>
            <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200">
              <span className="text-[10px] text-slate-500 font-bold block uppercase">Dinner</span>
              <span className="text-xs font-bold text-slate-900">7:30 - 9:45 PM</span>
            </div>
          </div>

          {/* Day Selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-2">Select Day of Week</label>
            <div className="flex gap-1.5 overflow-x-auto pb-1">
              {days.map((day) => (
                <button
                  key={day}
                  type="button"
                  onClick={() => setSelectedDay(day)}
                  className={`px-3 py-1.5 rounded-xl font-semibold transition-all whitespace-nowrap ${
                    selectedDay === day
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {day}
                </button>
              ))}
            </div>
          </div>

          {/* Menu Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-amber-50/30 space-y-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                BREAKFAST (7:30 - 9:30 AM)
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                {weeklyMenu[selectedDay]?.breakfast}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-emerald-50/30 space-y-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                LUNCH (12:30 - 2:30 PM)
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                {weeklyMenu[selectedDay]?.lunch}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-orange-50/30 space-y-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-orange-100 text-orange-800">
                EVENING SNACKS (5:00 - 6:00 PM)
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                {weeklyMenu[selectedDay]?.snacks}
              </p>
            </div>
            <div className="p-3.5 rounded-xl border border-slate-200 bg-blue-50/30 space-y-1">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800">
                DINNER (7:30 - 9:45 PM)
              </span>
              <p className="text-xs font-semibold text-slate-900 mt-1">
                {weeklyMenu[selectedDay]?.dinner}
              </p>
            </div>
          </div>

          {/* Student Meal Feedback Form */}
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
            <h4 className="font-bold text-slate-900 text-xs flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-blue-600" />
              Rate Today's Meal & Food Quality
            </h4>
            {!hasSubmittedFeedback ? (
              <form onSubmit={handleFeedbackSubmit} className="space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Meal</label>
                    <select
                      value={feedbackMeal}
                      onChange={(e: any) => setFeedbackMeal(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-medium"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rating</label>
                    <div className="flex gap-1.5">
                      <button
                        type="button"
                        onClick={() => setFeedbackRating('GOOD')}
                        className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-xs ${
                          feedbackRating === 'GOOD' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        👍 Good
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackRating('AVERAGE')}
                        className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-xs ${
                          feedbackRating === 'AVERAGE' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        😐 OK
                      </button>
                      <button
                        type="button"
                        onClick={() => setFeedbackRating('POOR')}
                        className={`flex-1 py-1.5 rounded-lg border text-center font-bold text-xs ${
                          feedbackRating === 'POOR' ? 'bg-rose-100 text-rose-800 border-rose-300' : 'bg-white border-slate-200'
                        }`}
                      >
                        👎 Poor
                      </button>
                    </div>
                  </div>
                </div>
                <input
                  type="text"
                  value={feedbackText}
                  onChange={(e) => setFeedbackText(e.target.value)}
                  placeholder="Suggestions (e.g. less salt in dal, add curd on Tuesdays)..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs bg-white focus:outline-none"
                />
                <div className="flex justify-end">
                  <button
                    type="submit"
                    className="px-4 py-1.5 rounded-lg bg-blue-600 text-white font-bold text-xs hover:bg-blue-700"
                  >
                    Submit Food Feedback
                  </button>
                </div>
              </form>
            ) : (
              <p className="text-xs text-emerald-700 font-medium">
                ✓ Feedback recorded for {feedbackMeal}. Thank you for helping improve mess quality!
              </p>
            )}
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white font-bold text-xs hover:bg-slate-800"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
