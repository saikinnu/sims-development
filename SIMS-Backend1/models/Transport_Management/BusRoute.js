const mongoose = require('mongoose');

const BusRouteSchema = new mongoose.Schema(
  {
    route_name: {
      type: String,
      required: true,
    },
    start_point: {
      type: String,
      required: true,
    },
    end_point: {
      type: String,
      required: true,
    },
    stops: {
      type: [String], // Or you can create a separate "Stop" model
      required: true,
    },
    distance_km: {
      type: Number,
      required: true,
    },
    estimated_time: {
      type: String, // e.g., "45 mins"
      required: true,
    },
    route_map_image: {
      type: String, // Cloudinary image URL
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusRoute', BusRouteSchema);
