const express = require('express');
const router = express.Router();
const Event = require('../models/Event');
const User = require('../models/User');
const auth = require('../middleware/auth');
const nodemailer = require('nodemailer');

// Configure email transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Get all events for a user
router.get('/', auth, async (req, res) => {
  try {
    const events = await Event.find({ user: req.user.userId });
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching events', error: error.message });
  }
});

// Create a new event
router.post('/', auth, async (req, res) => {
  try {
    const { title, description, startDate, endDate, location, type } = req.body;
    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      type,
      user: req.user.userId
    });
    await event.save();
    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error creating event', error: error.message });
  }
});

// Update an event
router.put('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndUpdate(
      { _id: req.params.id, user: req.user.userId },
      req.body,
      { new: true }
    );
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: 'Error updating event', error: error.message });
  }
});

// Delete an event
router.delete('/:id', auth, async (req, res) => {
  try {
    const event = await Event.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    });
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json({ message: 'Event deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting event', error: error.message });
  }
});

// Send email notification for upcoming events
const sendEventNotifications = async () => {
  try {
    const twoDaysFromNow = new Date();
    twoDaysFromNow.setDate(twoDaysFromNow.getDate() + 2);

    const events = await Event.find({
      startDate: {
        $gte: twoDaysFromNow,
        $lt: new Date(twoDaysFromNow.getTime() + 24 * 60 * 60 * 1000)
      },
      notificationSent: false
    }).populate('user');

    for (const event of events) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: event.user.email,
        subject: `Upcoming Event: ${event.title}`,
        html: `
          <h2>Upcoming Event Reminder</h2>
          <p>You have an upcoming event in 2 days:</p>
          <h3>${event.title}</h3>
          <p><strong>Description:</strong> ${event.description}</p>
          <p><strong>Date:</strong> ${event.startDate.toLocaleDateString()}</p>
          <p><strong>Time:</strong> ${event.startDate.toLocaleTimeString()}</p>
          <p><strong>Location:</strong> ${event.location || 'Not specified'}</p>
        `
      };

      await transporter.sendMail(mailOptions);
      event.notificationSent = true;
      await event.save();
    }
  } catch (error) {
    console.error('Error sending event notifications:', error);
  }
};

// Run notification check every hour
setInterval(sendEventNotifications, 60 * 60 * 1000);

module.exports = router; 