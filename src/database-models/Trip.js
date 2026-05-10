import mongoose from 'mongoose';

const ActivitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { 
    type: String, 
    enum: ['Sightseeing', 'Food', 'Adventure', 'Relaxation', 'Culture', 'Shopping', 'Transport', 'Other'], 
    default: 'Other' 
  },
  cost: { type: Number, default: 0 },
  duration: { type: String, default: '1 hour' },
  dateTime: { type: Date }
});

const StopSchema = new mongoose.Schema({
  cityName: { type: String, required: true },
  arrivalDate: { type: Date, required: true },
  departureDate: { type: Date, required: true },
  activities: [ActivitySchema]
});

const ExpenseSchema = new mongoose.Schema({
  category: { type: String, enum: ['Transport', 'Stay', 'Meals', 'Activities', 'Shopping', 'Other'], required: true },
  estimatedCost: { type: Number, default: 0 },
  actualCost: { type: Number, default: 0 }
});

const ChecklistItemSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, default: 'General' },
  packed: { type: Boolean, default: false }
});

const NoteSchema = new mongoose.Schema({
  content: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const TripSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  description: { type: String, default: '' },
  coverPhoto: { type: String, default: '' },
  isPublic: { type: Boolean, default: false },
  destination: { type: String, default: '' },
  tripType: { type: String, enum: ['Regional', 'International'], default: 'Regional' },
  modeOfTravel: { type: String, default: 'Flight' },
  budget: { type: Number, default: 5000 },
  flightCost: { type: Number, default: 0 },
  hotelCost: { type: Number, default: 0 },
  stops: [StopSchema],
  expenses: [ExpenseSchema],
  checklist: [ChecklistItemSchema],
  notes: [NoteSchema]
}, { timestamps: true });

// Force Mongoose to reload the schema in development
if (mongoose.models.Trip) {
  delete mongoose.models.Trip;
}

export default mongoose.model('Trip', TripSchema);

