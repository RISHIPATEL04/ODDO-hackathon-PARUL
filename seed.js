const mongoose = require('mongoose');

async function seed() {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/traveloop');
    
    // Clear existing
    await mongoose.connection.collection('trips').deleteMany({});

    const Trip = mongoose.model('Trip', new mongoose.Schema({
      userId: { type: mongoose.Schema.Types.ObjectId, required: true },
      name: { type: String, required: true },
      startDate: { type: Date, required: true },
      endDate: { type: Date, required: true },
      stops: [{
        cityName: String,
        arrivalDate: Date,
        departureDate: Date,
        activities: [{ name: String, type: { type: String }, cost: Number, duration: String }]
      }],
      expenses: [{ category: String, estimatedCost: Number }],
      checklist: [{ itemName: String, isPacked: Boolean }]
    }));

    await Trip.create({
      userId: new mongoose.Types.ObjectId("60d0fe4f5311236168a109ca"),
      name: "Euro Summer 2024",
      startDate: new Date("2024-06-15"),
      endDate: new Date("2024-07-05"),
      stops: [
        {
          cityName: "Paris, France",
          arrivalDate: new Date("2024-06-15"),
          departureDate: new Date("2024-06-18"),
          activities: [
            { name: "Eiffel Tower Visit", cost: 30, type: "Sightseeing", duration: "2h" },
            { name: "Dinner at Le Jules Verne", cost: 150, type: "Food", duration: "3h" }
          ]
        },
        {
          cityName: "Rome, Italy",
          arrivalDate: new Date("2024-06-19"),
          departureDate: new Date("2024-06-23"),
          activities: [
            { name: "Colosseum Tour", cost: 40, type: "Sightseeing", duration: "3h" }
          ]
        }
      ],
      expenses: [
        { category: "Transport", estimatedCost: 800 },
        { category: "Stay", estimatedCost: 1000 },
        { category: "Meals", estimatedCost: 400 },
        { category: "Activities", estimatedCost: 300 }
      ],
      checklist: [
        { itemName: "Passport", isPacked: true },
        { itemName: "Adapters", isPacked: false },
        { itemName: "Euros", isPacked: true }
      ]
    });

    console.log("Database seeded successfully!");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();
